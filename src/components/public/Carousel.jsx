import React from 'react';
import { useCarousel } from '../../hooks/useCarousel';

export default function Carousel({ slides }) {
  const { current, goTo, next, prev } = useCarousel(slides.length, 3800);

  if (!slides.length) {
    return (
      <div className="carousel carousel--empty">
        <div className="carousel__placeholder">
          <div className="carousel__placeholder-icon">🚩</div>
          <h2 className="carousel__placeholder-title">बजरंग दल एकसर</h2>
          <p className="carousel__placeholder-sub">सेवा • सुरक्षा • संस्कृति</p>
        </div>
      </div>
    );
  }

  return (
    <div className="carousel">
      {/* Track */}
      <div
        className="carousel__track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="carousel__slide">
            <img
              src={slide.url}
              alt={slide.caption || 'बजरंग दल एकसर'}
              className="carousel__img"
            />
            <div className="carousel__overlay">
              <div className="carousel__caption">
                <h2 className="carousel__caption-title">
                  {slide.caption || 'बजरंग दल एकसर'}
                </h2>
                <p className="carousel__caption-year">{slide.year}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next arrows */}
      {slides.length > 1 && (
        <>
          <button className="carousel__arrow carousel__arrow--prev" onClick={prev}>‹</button>
          <button className="carousel__arrow carousel__arrow--next" onClick={next}>›</button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="carousel__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`carousel__dot ${i === current ? 'carousel__dot--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
