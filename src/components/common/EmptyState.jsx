import React from 'react';

export default function EmptyState({ icon = '📭', title, subtitle, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      {title    && <p className="empty-state__title">{title}</p>}
      {subtitle && <p className="empty-state__subtitle">{subtitle}</p>}
      {action   && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
