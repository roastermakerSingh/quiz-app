import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import Button from '../common/Button';
import Input from '../common/Input';
import EmptyState from '../common/EmptyState';
import { compressImage } from '../../utils/imageUtils';
import { uid, currentYear } from '../../utils/helpers';

export default function ImagesPanel() {
  const { images, setImages, openLightbox } = useApp();
  const { toast } = useToast();
  const fileRef  = useRef(null);
  const [caption,   setCaption]   = useState('');
  const [year,      setYear]      = useState(currentYear());
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (!files.length) return;
    setUploading(true);
    setProgress(0);
    for (let i = 0; i < files.length; i++) {
      try {
        const url = await compressImage(files[i]);
        const newImg = {
          id:       uid(),
          url,
          caption:  caption || files[i].name.replace(/\.[^.]+$/, ''),
          year:     year || currentYear(),
          uploaded: new Date().toLocaleDateString('hi-IN'),
        };
        setImages(prev => [...prev, newImg]);
        setProgress(Math.round(((i + 1) / files.length) * 100));
      } catch {
        toast(`${files[i].name} अपलोड नहीं हो सका`, 'error');
      }
    }
    setUploading(false);
    setCaption('');
    if (fileRef.current) fileRef.current.value = '';
    toast(`${files.length} चित्र सफलतापूर्वक अपलोड हुए!`, 'success');
  };

  const handleDelete = (id) => {
    if (!window.confirm('यह चित्र हटाएं?')) return;
    setImages(prev => prev.filter(img => img.id !== id));
    toast('चित्र हटा दिया गया', 'info');
  };

  const handleDeleteAll = () => {
    if (!window.confirm(`सभी ${images.length} चित्र हटाएं?`)) return;
    setImages([]);
    toast('सभी चित्र हटाए गए', 'info');
  };

  return (
    <div className="images-panel">
      <div className="upload-card">
        <h3 className="upload-card__title">नए चित्र अपलोड करें</h3>
        <div className="upload-card__fields">
          <Input label="कैप्शन (वैकल्पिक)" placeholder="चित्र का विवरण"
            value={caption} onChange={e => setCaption(e.target.value)} />
          <Input label="वर्ष" placeholder="2024"
            value={year} onChange={e => setYear(e.target.value)} />
        </div>
        <label className={`dropzone ${uploading ? 'dropzone--uploading' : ''}`}>
          <input ref={fileRef} type="file" accept="image/*" multiple
            onChange={handleFiles} disabled={uploading} />
          {uploading ? (
            <>
              <div className="dropzone__icon">⏳</div>
              <div className="dropzone__text">अपलोड हो रहा है... {progress}%</div>
              <div className="dropzone__progress">
                <div className="dropzone__progress-bar" style={{ width: `${progress}%` }} />
              </div>
            </>
          ) : (
            <>
              <div className="dropzone__icon">📤</div>
              <div className="dropzone__text">
                चित्र चुनें या यहाँ खींचें
                <span className="dropzone__hint">Multiple images · Auto-compressed</span>
              </div>
            </>
          )}
        </label>
      </div>

      <div className="panel-header">
        <span className="panel-header__count">कुल {images.length} चित्र</span>
        {images.length > 0 && (
          <Button variant="danger" size="sm" onClick={handleDeleteAll}>सभी हटाएं</Button>
        )}
      </div>

      {images.length === 0 ? (
        <EmptyState icon="🖼️" title="कोई चित्र नहीं" subtitle="ऊपर से चित्र अपलोड करें।" />
      ) : (
        <div className="admin-gallery-grid">
          {images.map((img, i) => (
            <div key={img.id || i} className="admin-gallery-item">
              <img src={img.url} alt={img.caption} className="admin-gallery-item__img"
                onClick={() => openLightbox(images, i)} />
              <div className="admin-gallery-item__info">
                <span className="admin-gallery-item__caption">{img.caption}</span>
                <span className="admin-gallery-item__year">{img.year}</span>
              </div>
              <button className="admin-gallery-item__delete"
                onClick={() => handleDelete(img.id)} title="हटाएं">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
