import React from 'react';

export default function StatCard({ number, label, accent = false }) {
  return (
    <div className={`stat-card ${accent ? 'stat-card--accent' : ''}`}>
      <div className="stat-card__number">{number}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}
