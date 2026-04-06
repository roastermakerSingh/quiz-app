import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { pct } from '../../utils/helpers';

export default function QuizResult({ name, score, total }) {
  const navigate = useNavigate();
  const percentage = pct(score, total);

  const grade =
    percentage >= 80 ? { label: 'उत्कृष्ट!',   emoji: '🏆', color: 'var(--gold)'    } :
    percentage >= 60 ? { label: 'अच्छा!',        emoji: '🎉', color: 'var(--green)'   } :
    percentage >= 40 ? { label: 'ठीक है',         emoji: '👍', color: 'var(--saffron)' } :
                       { label: 'और प्रयास करें', emoji: '💪', color: 'var(--red)'     };

  return (
    <div className="quiz-result">
      <div className="quiz-result__emoji">{grade.emoji}</div>
      <h2 className="quiz-result__title">धन्यवाद, {name}!</h2>
      <p className="quiz-result__sub">क्विज़ में भाग लेने के लिए आपका बहुत-बहुत धन्यवाद।</p>

      <div className="quiz-result__score-card">
        <div className="quiz-result__score" style={{ color: grade.color }}>
          {score} / {total}
        </div>
        <div className="quiz-result__pct">{percentage}%</div>
        <div className="quiz-result__grade" style={{ color: grade.color }}>
          {grade.label}
        </div>
      </div>

      <div className="quiz-result__actions">
        <Button variant="primary" size="lg" onClick={() => navigate('/')}>
          🏠 मुख्य पृष्ठ पर जाएं
        </Button>
        <Button variant="secondary" onClick={() => navigate('/results')}>
          परिणाम देखें →
        </Button>
      </div>
    </div>
  );
}
