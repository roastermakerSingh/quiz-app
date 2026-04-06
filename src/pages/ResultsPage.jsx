import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Podium        from '../components/public/Podium';
import ResultsTable  from '../components/public/ResultsTable';
import EmptyState    from '../components/common/EmptyState';
import Button        from '../components/common/Button';

export default function ResultsPage() {
  const { resultsPublished, participants } = useApp();
  const navigate = useNavigate();

  if (!resultsPublished) {
    return (
      <div className="page-container page-container--centered">
        <div className="status-screen">
          <div className="status-screen__icon">🔒</div>
          <h2 className="status-screen__title">परिणाम अभी प्रकाशित नहीं हुए हैं</h2>
          <p className="status-screen__sub">
            Admin द्वारा परिणाम प्रकाशित होने पर यहाँ दिखेंगे।
          </p>
          <Button onClick={() => navigate('/')}>🏠 मुख्य पृष्ठ</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="section-heading">
        <h1 className="section-heading__title">परिणाम</h1>
        <span className="section-heading__sub">Quiz Results Leaderboard</span>
      </div>

      {participants.length === 0 ? (
        <EmptyState
          icon="📊"
          title="कोई प्रतिभागी नहीं"
          subtitle="अभी तक किसी ने क्विज़ नहीं दिया है।"
        />
      ) : (
        <>
          {/* Top 3 Podium */}
          {participants.length >= 2 && (
            <div className="results-page__podium">
              <Podium participants={participants} />
            </div>
          )}

          {/* Full Leaderboard */}
          <div className="section-heading" style={{ marginTop: '2rem' }}>
            <h2 className="section-heading__title" style={{ fontSize: '1.3rem' }}>
              पूरी सूची
            </h2>
          </div>
          <ResultsTable participants={participants} />
        </>
      )}
    </div>
  );
}
