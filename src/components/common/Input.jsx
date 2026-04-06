import React from 'react';

export default function Input({
  label,
  error,
  hint,
  id,
  className = '',
  ...rest
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`form-input ${error ? 'form-input--error' : ''}`}
        {...rest}
      />
      {error && <p className="form-error">{error}</p>}
      {hint && !error && <p className="form-hint">{hint}</p>}
    </div>
  );
}
