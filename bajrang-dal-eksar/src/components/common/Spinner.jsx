import React from 'react';

export default function Spinner({ size = 36, label = 'लोड हो रहा है...' }) {
  return (
    <div className="spinner-wrap">
      <div
        className="spinner"
        style={{ width: size, height: size, borderWidth: size > 24 ? 3 : 2 }}
      />
      {label && <p className="spinner__label">{label}</p>}
    </div>
  );
}
