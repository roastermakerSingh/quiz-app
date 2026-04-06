import React from 'react';
import { useApp } from '../../context/AppContext';

export default function GalleryGrid({ images }) {
  const { openLightbox } = useApp();

  return (
    <div className="gallery-grid">
      {images.map((img, i) => (
        <button
          key={img.id || i}
          className="gallery-item"
          onClick={() => openLightbox(images, i)}
          title={img.caption}
        >
          <img
            src={img.url}
            alt={img.caption || `Photo ${i + 1}`}
            className="gallery-item__img"
            loading="lazy"
          />
          {img.caption && (
            <div className="gallery-item__caption">{img.caption}</div>
          )}
        </button>
      ))}
    </div>
  );
}
