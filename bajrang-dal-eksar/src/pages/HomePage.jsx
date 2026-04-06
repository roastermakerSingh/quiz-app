import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Carousel from '../components/public/Carousel';
import StatsBar from '../components/public/StatsBar';
import GalleryGrid from '../components/public/GalleryGrid';
import Button from '../components/common/Button';

export default function HomePage() {
  const { images, quizState, resultsPublished } = useApp();
  const navigate = useNavigate();

  const carouselSlides = [...images].reverse().slice(0, 8);
  const latestImages   = [...images].reverse().slice(0, 8);

  return (
    <div className="home-page">
      {/* Hero Carousel */}
      <Carousel slides={carouselSlides} />

      {/* Stats Bar */}
      <StatsBar />

      {/* Quick Actions */}
      <div className="home-page__section">
        <div className="home-page__actions">
          <Button size="lg" variant="primary" onClick={() => navigate('/gallery')}>
            📸 गैलरी देखें
          </Button>
          <Button size="lg" variant="navy" onClick={() => navigate('/quiz')}>
            {quizState === 'active' ? '🟢 क्विज़ में भाग लें' : '📝 क्विज़'}
          </Button>
          {resultsPublished && (
            <Button size="lg" variant="secondary" onClick={() => navigate('/results')}>
              🏆 परिणाम देखें
            </Button>
          )}
        </div>

        {/* About Card */}
        <div className="about-card">
          <h2 className="about-card__title">बजरंग दल एकसर के बारे में</h2>
          <p className="about-card__text">
            बजरंग दल एकसर एक सांस्कृतिक एवं सामाजिक संगठन है जो हिंदू संस्कृति के
            संरक्षण और संवर्धन के लिए समर्पित है। हम सेवा, सुरक्षा और संस्कृति के
            त्रिआयामी लक्ष्य को लेकर कार्यरत हैं। हमारी गतिविधियों में धार्मिक
            आयोजन, सांस्कृतिक कार्यक्रम और समाज सेवा शामिल हैं।
          </p>
          <div className="about-card__pills">
            {['🙏 सेवा', '🛡️ सुरक्षा', '🏛️ संस्कृति'].map(v => (
              <span key={v} className="about-card__pill">{v}</span>
            ))}
          </div>
        </div>

        {/* Latest Images */}
        {latestImages.length > 0 && (
          <div className="home-page__gallery">
            <div className="section-heading">
              <h2 className="section-heading__title">नवीनतम चित्र</h2>
              <span className="section-heading__sub">Recently Uploaded</span>
            </div>
            <GalleryGrid images={latestImages} />
            <div className="home-page__gallery-more">
              <Button variant="secondary" onClick={() => navigate('/gallery')}>
                सभी चित्र देखें →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
