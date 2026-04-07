import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { supabase, TABLES } from '../../lib/supabase';
import Input from '../common/Input';
import Button from '../common/Button';
import { isValidMobile } from '../../utils/helpers';

const PRESET_AMOUNTS = [51, 101, 251, 501, 1001, 2100];

// Check at runtime if Razorpay key is configured
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID || '';
const razorpayConfigured = RAZORPAY_KEY.startsWith('rzp_');

export default function DonationForm({ onSuccess }) {
  const { settings } = useApp();
  const { toast }    = useToast();

  const [form, setForm]           = useState({ name: '', email: '', mobile: '', amount: '', message: '' });
  const [customAmount, setCustom] = useState(false);
  const [selected,  setSelected]  = useState(null);
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  // For bank-only mode — record intention without payment
  const [bankDone,  setBankDone]  = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const selectPreset = (amt) => {
    setSelected(amt);
    setForm(f => ({ ...f, amount: String(amt) }));
    setCustom(false);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())           e.name   = 'नाम आवश्यक है';
    if (!isValidMobile(form.mobile)) e.mobile = '10 अंकों का वैध मोबाइल नंबर';
    if (!form.amount || parseInt(form.amount) < 1) e.amount = 'वैध राशि दर्ज करें';
    return e;
  };

  // ── MODE A: Razorpay configured → open checkout ──────────────
  const handleRazorpayDonate = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);

    try {
      // Dynamically import so it never crashes if key is missing
      const { openDonationCheckout } = await import('../../lib/razorpay');
      await openDonationCheckout({
        amount:      parseInt(form.amount),
        name:        form.name,
        email:       form.email,
        mobile:      form.mobile,
        description: 'Donation to बजरंग दल एकसर',
        onSuccess: async (paymentData) => {
          await supabase.from(TABLES.DONATIONS).insert({
            donor_name:     form.name,
            donor_email:    form.email || null,
            donor_mobile:   form.mobile,
            amount:         parseInt(form.amount),
            payment_id:     paymentData.razorpay_payment_id,
            payment_status: 'completed',
            message:        form.message || null,
          });
          toast(`₹${form.amount} का दान सफलतापूर्वक हुआ! धन्यवाद 🙏`, 'success');
          onSuccess?.({ ...form, paymentId: paymentData.razorpay_payment_id });
          setLoading(false);
        },
        onFailure: (msg) => {
          if (msg !== 'Payment cancelled') toast(msg || 'भुगतान विफल हुआ', 'error');
          setLoading(false);
        },
      });
    } catch (err) {
      toast(err.message || 'भुगतान में समस्या', 'error');
      setLoading(false);
    }
  };

  // ── MODE B: No Razorpay → just record the intention ──────────
  const handleBankDonate = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await supabase.from(TABLES.DONATIONS).insert({
        donor_name:     form.name,
        donor_email:    form.email || null,
        donor_mobile:   form.mobile,
        amount:         parseInt(form.amount),
        payment_id:     null,
        payment_status: 'pending',   // admin will verify manually
        message:        form.message || null,
      });
      setBankDone(true);
      toast('विवरण सहेजा गया! कृपया नीचे दिए गए बैंक विवरण पर राशि भेजें।', 'success');
    } catch (err) {
      toast(err.message || 'समस्या हुई, पुनः प्रयास करें', 'error');
    } finally {
      setLoading(false);
    }
  };

  const bankDetails = {
    name: settings.bank_account_name,
    bank: settings.bank_name,
    acc:  settings.bank_account_number,
    ifsc: settings.bank_ifsc,
    upi:  settings.bank_upi_id,
  };
  const hasBankDetails = !!(bankDetails.acc || bankDetails.upi);

  return (
    <div className="donation-form-wrap">
      {settings.donation_message && (
        <div className="donation-msg">{settings.donation_message}</div>
      )}

      {/* ── Bank-only success state ────────────────────────── */}
      {bankDone ? (
        <div className="bank-success-card">
          <div className="bank-success-card__icon">🙏</div>
          <h3 className="bank-success-card__title">जय श्री राम!</h3>
          <p className="bank-success-card__sub">
            आपका विवरण सहेजा गया। कृपया नीचे दिए गए बैंक / UPI पर <strong>₹{form.amount}</strong> भेजें।
            <br />भुगतान के बाद Admin द्वारा पुष्टि की जाएगी।
          </p>
          {hasBankDetails && <BankCard details={bankDetails} />}
        </div>
      ) : (
        <>
          {/* ── Form ──────────────────────────────────────── */}
          <form
            onSubmit={razorpayConfigured ? handleRazorpayDonate : handleBankDonate}
            noValidate
            className="donation-form"
          >
            {/* Amount selection */}
            <div className="form-group">
              <label className="form-label">दान राशि चुनें (₹) *</label>
              <div className="amount-presets">
                {PRESET_AMOUNTS.map(amt => (
                  <button type="button" key={amt}
                    className={`amount-btn ${selected === amt && !customAmount ? 'amount-btn--active' : ''}`}
                    onClick={() => selectPreset(amt)}>
                    ₹{amt}
                  </button>
                ))}
                <button type="button"
                  className={`amount-btn ${customAmount ? 'amount-btn--active' : ''}`}
                  onClick={() => { setCustom(true); setSelected(null); setForm(f => ({ ...f, amount: '' })); }}>
                  अन्य
                </button>
              </div>
              {customAmount && (
                <input
                  className={`form-input ${errors.amount ? 'form-input--error' : ''}`}
                  style={{ marginTop: 8 }}
                  type="number" min="1" placeholder="राशि दर्ज करें (₹)"
                  value={form.amount} onChange={e => set('amount', e.target.value)}
                />
              )}
              {errors.amount && <p className="form-error">{errors.amount}</p>}
            </div>

            <div className="grid-2">
              <Input label="आपका नाम *" placeholder="पूरा नाम"
                value={form.name} onChange={e => set('name', e.target.value)} error={errors.name} />
              <Input label="मोबाइल *" placeholder="10 अंकों का नंबर" inputMode="numeric"
                value={form.mobile}
                onChange={e => set('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                error={errors.mobile} />
            </div>

            <Input label="ईमेल (वैकल्पिक)" type="email" placeholder="email@example.com"
              value={form.email} onChange={e => set('email', e.target.value)} />

            <div className="form-group">
              <label className="form-label">संदेश (वैकल्पिक)</label>
              <textarea className="form-input form-textarea" rows={2}
                placeholder="कोई संदेश..."
                value={form.message} onChange={e => set('message', e.target.value)} />
            </div>

            {/* ── Button changes based on mode ─────────────── */}
            {razorpayConfigured ? (
              <Button type="submit" fullWidth size="lg" loading={loading}>
                💳 ₹{form.amount || '—'} का दान करें (UPI / Card)
              </Button>
            ) : (
              <>
                <Button type="submit" fullWidth size="lg" loading={loading} variant="primary">
                  🏦 विवरण सहेजें और बैंक से दान करें
                </Button>
                <p className="donation-form__note">
                  ℹ️ ऑनलाइन भुगतान अभी उपलब्ध नहीं है। फॉर्म भरने के बाद नीचे दिए बैंक / UPI पर राशि भेजें।
                </p>
              </>
            )}
          </form>

          {/* ── Always show bank details below the form ───── */}
          {hasBankDetails && <BankCard details={bankDetails} />}
        </>
      )}
    </div>
  );
}

/* ── Bank Details Card ────────────────────────────────────────── */
function BankCard({ details }) {
  const rows = [
    details.name && ['खाताधारक', details.name, false],
    details.bank && ['बैंक',      details.bank, false],
    details.acc  && ['खाता नंबर', details.acc,  true ],
    details.ifsc && ['IFSC',      details.ifsc, true ],
    details.upi  && ['UPI ID',    details.upi,  true ],
  ].filter(Boolean);

  if (!rows.length) return null;

  return (
    <div className="bank-details-card">
      <h4 className="bank-details-card__title">🏦 बैंक / UPI ट्रांसफर विवरण</h4>
      <div className="bank-details-card__grid">
        {rows.map(([label, value, mono]) => (
          <React.Fragment key={label}>
            <span>{label}</span>
            <strong className={mono ? 'mono' : ''}>{value}</strong>
          </React.Fragment>
        ))}
      </div>
      <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: '1rem' }}>
        भुगतान के बाद screenshot Admin को WhatsApp / call करके भेजें।
      </p>
    </div>
  );
}
