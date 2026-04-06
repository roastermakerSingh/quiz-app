import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import Input from '../common/Input';
import Button from '../common/Button';

export default function SettingsPanel() {
  const { settings, updateSetting } = useApp();
  const { toast } = useToast();

  // Password change
  const [pwForm, setPwForm] = useState({ current: '', newPass: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);

  // Bank details
  const [bank, setBank] = useState({
    account_name:   '',
    account_number: '',
    ifsc:           '',
    bank_name:      '',
    upi_id:         '',
  });
  const [bankLoading, setBankLoading] = useState(false);

  // Razorpay / donation settings
  const [donationEnabled, setDonationEnabled] = useState('true');
  const [donationMsg, setDonationMsg] = useState('');

  useEffect(() => {
    if (settings.bank_account_name)   setBank(b => ({ ...b, account_name:   settings.bank_account_name }));
    if (settings.bank_account_number) setBank(b => ({ ...b, account_number: settings.bank_account_number }));
    if (settings.bank_ifsc)           setBank(b => ({ ...b, ifsc:           settings.bank_ifsc }));
    if (settings.bank_name)           setBank(b => ({ ...b, bank_name:      settings.bank_name }));
    if (settings.bank_upi_id)         setBank(b => ({ ...b, upi_id:         settings.bank_upi_id }));
    if (settings.donation_enabled !== undefined) setDonationEnabled(settings.donation_enabled);
    if (settings.donation_message)    setDonationMsg(settings.donation_message);
  }, [settings]);

  // ── Change password ────────────────────────────────────────────
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    const errs = {};
    const currentPass = settings.admin_password || 'bajrang2024';
    if (pwForm.current !== currentPass) errs.current = 'वर्तमान पासवर्ड गलत है';
    if (pwForm.newPass.length < 6)      errs.newPass = 'नया पासवर्ड कम से कम 6 अक्षर का होना चाहिए';
    if (pwForm.newPass !== pwForm.confirm) errs.confirm = 'पासवर्ड मेल नहीं खाते';
    if (Object.keys(errs).length) { setPwErrors(errs); return; }

    setPwLoading(true);
    try {
      await updateSetting('admin_password', pwForm.newPass);
      setPwForm({ current: '', newPass: '', confirm: '' });
      setPwErrors({});
      toast('पासवर्ड सफलतापूर्वक बदला गया ✓', 'success');
    } catch {
      toast('पासवर्ड बदलने में समस्या हुई', 'error');
    } finally {
      setPwLoading(false);
    }
  };

  // ── Save bank details ─────────────────────────────────────────
  const handleBankSave = async (e) => {
    e.preventDefault();
    setBankLoading(true);
    try {
      await Promise.all([
        updateSetting('bank_account_name',   bank.account_name),
        updateSetting('bank_account_number', bank.account_number),
        updateSetting('bank_ifsc',           bank.ifsc),
        updateSetting('bank_name',           bank.bank_name),
        updateSetting('bank_upi_id',         bank.upi_id),
        updateSetting('donation_enabled',    donationEnabled),
        updateSetting('donation_message',    donationMsg),
      ]);
      toast('बैंक विवरण सहेजा गया ✓', 'success');
    } catch {
      toast('सहेजने में समस्या हुई', 'error');
    } finally {
      setBankLoading(false);
    }
  };

  return (
    <div className="settings-panel">

      {/* ── Change Password ───────────────────────────────────── */}
      <div className="settings-section">
        <h3 className="settings-section__title">🔐 Admin पासवर्ड बदलें</h3>
        <form onSubmit={handlePasswordSave} noValidate>
          <Input label="वर्तमान पासवर्ड *" type="password" placeholder="••••••••"
            value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
            error={pwErrors.current} />
          <div className="grid-2">
            <Input label="नया पासवर्ड *" type="password" placeholder="कम से कम 6 अक्षर"
              value={pwForm.newPass} onChange={e => setPwForm(p => ({ ...p, newPass: e.target.value }))}
              error={pwErrors.newPass} />
            <Input label="नया पासवर्ड दोबारा *" type="password" placeholder="पासवर्ड दोहराएं"
              value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
              error={pwErrors.confirm} />
          </div>
          <Button type="submit" variant="primary" loading={pwLoading}>
            💾 पासवर्ड बदलें
          </Button>
        </form>
      </div>

      {/* ── Bank Details ──────────────────────────────────────── */}
      <div className="settings-section">
        <h3 className="settings-section__title">🏦 बैंक विवरण (दान के लिए)</h3>
        <div className="settings-section__info">
          ये विवरण दान पृष्ठ पर दिखाए जाएंगे ताकि दानकर्ता सीधे ट्रांसफर कर सकें।
        </div>
        <form onSubmit={handleBankSave} noValidate>
          <div className="grid-2">
            <Input label="खाताधारक का नाम" placeholder="जैसे: बजरंग दल एकसर"
              value={bank.account_name} onChange={e => setBank(b => ({ ...b, account_name: e.target.value }))} />
            <Input label="बैंक का नाम" placeholder="जैसे: State Bank of India"
              value={bank.bank_name} onChange={e => setBank(b => ({ ...b, bank_name: e.target.value }))} />
          </div>
          <div className="grid-2">
            <Input label="खाता नंबर" placeholder="Account Number"
              value={bank.account_number} onChange={e => setBank(b => ({ ...b, account_number: e.target.value }))} />
            <Input label="IFSC कोड" placeholder="जैसे: SBIN0001234"
              value={bank.ifsc} onChange={e => setBank(b => ({ ...b, ifsc: e.target.value.toUpperCase() }))} />
          </div>
          <Input label="UPI ID" placeholder="जैसे: bajrangdal@sbi"
            value={bank.upi_id} onChange={e => setBank(b => ({ ...b, upi_id: e.target.value }))} />

          <div className="settings-divider" />

          <div className="form-group">
            <label className="form-label">दान सक्रिय करें</label>
            <div className="toggle-row">
              {['true', 'false'].map(v => (
                <button type="button" key={v}
                  className={`toggle-btn ${donationEnabled === v ? 'toggle-btn--active' : ''}`}
                  onClick={() => setDonationEnabled(v)}>
                  {v === 'true' ? '✅ सक्रिय' : '❌ बंद'}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">दान संदेश (वैकल्पिक)</label>
            <textarea className="form-input form-textarea" rows={2}
              placeholder="दान पृष्ठ पर दिखाया जाने वाला संदेश"
              value={donationMsg} onChange={e => setDonationMsg(e.target.value)} />
          </div>

          <Button type="submit" variant="primary" loading={bankLoading}>
            💾 बैंक विवरण सहेजें
          </Button>
        </form>
      </div>

      {/* ── Razorpay note ─────────────────────────────────────── */}
      <div className="settings-section settings-section--info">
        <h3 className="settings-section__title">💳 Razorpay Gateway (वैकल्पिक)</h3>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-mid)', lineHeight: 1.8 }}>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>वर्तमान स्थिति:</strong>{' '}
            {process.env.REACT_APP_RAZORPAY_KEY_ID
              ? <span style={{ color: 'var(--green)', fontWeight: 600 }}>✅ Razorpay सक्रिय है — ऑनलाइन UPI/Card भुगतान काम करेगा।</span>
              : <span style={{ color: 'var(--gold)', fontWeight: 600 }}>🏦 बैंक ट्रांसफर मोड — Razorpay सेटअप नहीं है, यह ठीक है।</span>
            }
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>बिना Razorpay के:</strong> दान पृष्ठ पूरी तरह काम करता है।
            यूज़र फॉर्म भरकर बैंक/UPI से सीधे पैसे भेज सकते हैं।
            उनका नाम और राशि Admin panel में दिखती है।
          </p>
          <p>
            <strong>Razorpay जोड़ने के लिए:</strong> Netlify → Site settings → Environment variables में
            <code> REACT_APP_RAZORPAY_KEY_ID</code> जोड़ें और Redeploy करें।
          </p>
        </div>
      </div>

    </div>
  );
}
