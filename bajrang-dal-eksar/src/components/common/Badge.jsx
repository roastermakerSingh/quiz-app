import React from 'react';

/**
 * Status badge with dot indicator
 * @param {'active'|'idle'|'ended'|'success'|'warning'|'info'} variant
 */
export default function Badge({ children, variant = 'info', dot = false }) {
  return (
    <span className={`badge badge--${variant}`}>
      {dot && <span className="badge__dot" />}
      {children}
    </span>
  );
}
