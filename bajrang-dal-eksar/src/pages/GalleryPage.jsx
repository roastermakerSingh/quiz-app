import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import GalleryGrid from '../components/public/GalleryGrid';
import EmptyState from '../components/common/EmptyState';

export default function GalleryPage() {
  const { images } = useApp();
  const [activeYear, setActiveYear] = useState('all');

  // Group by year, sorted descending
  const byYear = useMemo(() => {
    return images.reduce((acc, img) => {
      const y = img.year || 'अन्य';
      if (!acc[y]) acc[y] = [];
      acc[y].push(img);
      return acc;
    }, {});
  }, [images]);

  const years = useMemo(
    () => Object.keys(byYear).sort((a, b) => b.localeCompare(a)),
    [byYear]
  );

  const displayImages = useMemo(() => {
    if (activeYear === 'all') return images;
    return byYear[activeYear] || [];
  }, [activeYear, images, byYear]);

  return (
    <div className="page-container">
      <div className="section-heading">
        <h1 className="section-heading__title">चित्र गैलरी</h1>
        <span className="section-heading__sub">Photo Gallery</span>
      </div>

      {/* Year Filter */}
      {years.length > 1 && (
        <div className="year-filter">
          <button
            className={`year-filter__btn ${activeYear === 'all' ? 'year-filter__btn--active' : ''}`}
            onClick={() => setActiveYear('all')}
          >
            सभी ({images.length})
          </button>
          {years.map(y => (
            <button
              key={y}
              className={`year-filter__btn ${activeYear === y ? 'year-filter__btn--active' : ''}`}
              onClick={() => setActiveYear(y)}
            >
              {y} ({byYear[y].length})
            </button>
          ))}
        </div>
      )}

      {images.length === 0 ? (
        <EmptyState
          icon="🖼️"
          title="अभी कोई चित्र नहीं है"
          subtitle="Admin द्वारा चित्र अपलोड होने पर यहाँ दिखेंगे।"
        />
      ) : activeYear === 'all' ? (
        years.map(year => (
          <div key={year} className="gallery-year-section">
            <div className="gallery-year-label">
              📅 {year}
              <span className="gallery-year-label__count">{byYear[year].length} चित्र</span>
            </div>
            <GalleryGrid images={byYear[year]} />
          </div>
        ))
      ) : (
        <GalleryGrid images={displayImages} />
      )}
    </div>
  );
}
