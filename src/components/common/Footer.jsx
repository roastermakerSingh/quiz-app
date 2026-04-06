import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">🚩</span>
          <div>
            <div className="footer__title">बजरंग दल एकसर</div>
            <div className="footer__tagline">सेवा • सुरक्षा • संस्कृति</div>
          </div>
        </div>
        <div className="footer__copy">
          जय श्री राम &nbsp;•&nbsp; © {new Date().getFullYear()} बजरंग दल एकसर
        </div>
      </div>
    </footer>
  );
}
