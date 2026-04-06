import React, { useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';

export default function Lightbox() {
  const { lightboxSrc, setLightboxSrc, lightboxList, setLightboxList, lightboxIndex, setLightboxIndex } = useApp();

  const hasList = lightboxList && lightboxList.length > 1;

  const handlePrev = useCallback(() => {
    if (!hasList) return;
    const newIdx = (lightboxIndex - 1 + lightboxList.length) % lightboxList.length;
    setLightboxIndex(newIdx);
    setLightboxSrc(lightboxList[newIdx].url);
  }, [hasList, lightboxIndex, lightboxList, setLightboxIndex, setLightboxSrc]);

  const handleNext = useCallback(() => {
    if (!hasList) return;
    const newIdx = (lightboxIndex + 1) % lightboxList.length;
    setLightboxIndex(newIdx);
    setLightboxSrc(lightboxList[newIdx].url);
  }, [hasList, lightboxIndex, lightboxList, setLightboxIndex, setLightboxSrc]);

  const handleDownload = useCallback(() => {
    if (!lightboxSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const highQualityUrl = canvas.toDataURL('image/jpeg', 0.95);
      const a = document.createElement('a');
      a.href = highQualityUrl;
      const caption = hasList && lightboxList[lightboxIndex]?.caption
        ? lightboxList[lightboxIndex].caption.replace(/\s+/g, '-')
        : 'bajrang-dal-eksar-photo';
      a.download = `${caption}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    img.src = lightboxSrc;
  }, [lightboxSrc, hasList, lightboxList, lightboxIndex]);

  useEffect(() => {
    if (!lightboxSrc) return;
    const handler = (e) => {
      if (e.key === 'Escape')     setLightboxSrc(null);
      if (e.key === 'ArrowLeft')  handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightboxSrc, handlePrev, handleNext, setLightboxSrc]);

  if (!lightboxSrc) return null;

  const currentCaption = hasList ? lightboxList[lightboxIndex]?.caption : null;
  const currentYear    = hasList ? lightboxList[lightboxIndex]?.year    : null;

  return (
    <div className="lightbox" onClick={() => setLightboxSrc(null)}>
      {/* Top bar */}
      <div className="lightbox__topbar" onClick={e => e.stopPropagation()}>
        <div className="lightbox__info">
          {currentCaption && <span className="lightbox__caption">{currentCaption}</span>}
          {currentYear    && <span className="lightbox__year">{currentYear}</span>}
          {hasList && (
            <span className="lightbox__counter">{lightboxIndex + 1} / {lightboxList.length}</span>
          )}
        </div>
        <div className="lightbox__actions">
          <button className="lightbox__btn" onClick={handleDownload} title="Download">
            ⬇ Download
          </button>
          <button className="lightbox__btn lightbox__btn--close" onClick={() => setLightboxSrc(null)}>
            ✕
          </button>
        </div>
      </div>

      {/* Prev */}
      {hasList && (
        <button className="lightbox__nav lightbox__nav--prev"
          onClick={e => { e.stopPropagation(); handlePrev(); }}>‹</button>
      )}

      {/* Image */}
      <img
        src={lightboxSrc}
        alt={currentCaption || 'Photo'}
        className="lightbox__img"
        onClick={e => e.stopPropagation()}
        draggable={false}
      />

      {/* Next */}
      {hasList && (
        <button className="lightbox__nav lightbox__nav--next"
          onClick={e => { e.stopPropagation(); handleNext(); }}>›</button>
      )}

      {/* Dots */}
      {hasList && lightboxList.length <= 20 && (
        <div className="lightbox__dots" onClick={e => e.stopPropagation()}>
          {lightboxList.map((_, i) => (
            <button key={i}
              className={`lightbox__dot ${i === lightboxIndex ? 'lightbox__dot--active' : ''}`}
              onClick={() => { setLightboxIndex(i); setLightboxSrc(lightboxList[i].url); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
