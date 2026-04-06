import React from 'react';
import { useApp } from '../../context/AppContext';

export default function StatsBar() {
  const { participants, images, questions, quizState } = useApp();

  const quizLabel =
    quizState === 'active' ? 'LIVE 🟢' :
    quizState === 'ended'  ? 'समाप्त'  : 'प्रतीक्षा';

  const stats = [
    { value: participants.length, label: 'प्रतिभागी' },
    { value: images.length,       label: 'चित्र'      },
    { value: questions.length,    label: 'प्रश्न'     },
    { value: quizLabel,           label: 'क्विज़'     },
  ];

  return (
    <div className="stats-bar">
      <div className="stats-bar__inner">
        {stats.map((s, i) => (
          <div key={i} className="stats-bar__item">
            <span className="stats-bar__value">{s.value}</span>
            <span className="stats-bar__label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
