import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import DonationForm from '../components/public/DonationForm';

// Check if Razorpay key exists at build time
const razorpayConfigured = (process.env.REACT_APP_RAZORPAY_KEY_ID || '').startsWith('rzp_');

export default function DonationPage() {
  const { settings, donations } = useApp();
  const [success, setSuccess]   = useState(null);

  const donationEnabled = settings.donation_enabled !== 'false';
  const completed       = donations.filter(d => d.payment_status === 'completed');
  const totalDonated    = completed.reduce((s, d) => s + (d.amount || 0), 0);

  /* ── Razorpay success screen ───────────────────────────────── */
  if (success) {
    return (
      <div className="page-container page-container--centered">
        <div className="status-screen">
          <div className="status-screen__icon">🙏</div>
          <h2 className="status-screen__title" style={{ color: 'var(--green)' }}>
            जय श्री राम!
          </h2>
          <p style={{ color: 'var(--text-mid)', marginBottom: '0.5rem', fontSize: '1.05rem' }}>
            <strong>₹{success.amount}</strong> का दान सफलतापूर्वक प्राप्त हुआ।
          </p>
          {success.paymentId && (
            <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', fontSize: '0.82rem' }}>
              Payment ID: <code>{success.paymentId}</code>
            </p>
          )}
          <p style={{ color: 'var(--text-mid)' }}>
            आपके सहयोग के लिए बजरंग दल एकसर की ओर से हार्दिक आभार। 🙏
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="section-heading">
        <h1 className="section-heading__title">दान करें</h1>
        <span className="section-heading__sub">Support Bajrang Dal Eksar</span>
      </div>

      {/* Mode notice */}
      {!razorpayConfigured && (
        <div className="alert alert--info" style={{ marginBottom: '1.5rem' }}>
          💡 <strong>बैंक ट्रांसफर मोड:</strong> ऑनलाइन भुगतान गेटवे सेटअप नहीं है।
          नीचे फॉर्म भरें और बैंक / UPI से सीधे राशि भेजें।
        </div>
      )}

      {/* Donation stats */}
      {(totalDonated > 0 || completed.length > 0) && (
        <div className="donation-stats">
          <div className="donation-stat">
            <span className="donation-stat__value">₹{totalDonated.toLocaleString('en-IN')}</span>
            <span className="donation-stat__label">कुल दान राशि</span>
          </div>
          <div className="donation-stat">
            <span className="donation-stat__value">{completed.length}</span>
            <span className="donation-stat__label">दानकर्ता</span>
          </div>
        </div>
      )}

      {!donationEnabled ? (
        <div className="alert alert--info" style={{ marginTop: '1rem' }}>
          दान प्रणाली अभी बंद है। Admin द्वारा सक्रिय होने पर वापस आएं।
        </div>
      ) : (
        <div className="donation-layout">
          <div className="donation-layout__form">
            <DonationForm onSuccess={setSuccess} />
          </div>
          <div className="donation-layout__sidebar">
            <div className="donation-sidebar-card">
              <div className="donation-sidebar-card__icon">🚩</div>
              <h3>आपका दान क्यों ज़रूरी है?</h3>
              <ul>
                <li>🏛️ सांस्कृतिक कार्यक्रमों का आयोजन</li>
                <li>📚 शैक्षणिक गतिविधियाँ</li>
                <li>🤝 समाज सेवा कार्य</li>
                <li>🛡️ धर्म रक्षा के प्रयास</li>
              </ul>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '1rem' }}>
                हर दान, चाहे छोटा हो या बड़ा, हमारे लिए बहुमूल्य है।
              </p>
            </div>

            {/* Payment method indicator */}
            <div style={{
              marginTop: '1rem', padding: '14px', borderRadius: 10,
              background: razorpayConfigured ? 'var(--green-light)' : 'var(--gold-light)',
              border: `1px solid ${razorpayConfigured ? 'rgba(26,107,26,0.2)' : 'rgba(200,146,10,0.3)'}`,
              fontSize: '0.82rem',
              color: razorpayConfigured ? 'var(--green)' : 'var(--gold)',
            }}>
              {razorpayConfigured
                ? '✅ ऑनलाइन भुगतान सक्रिय है (UPI, Card, Net Banking)'
                : '🏦 बैंक ट्रांसफर / UPI मोड सक्रिय है'
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
