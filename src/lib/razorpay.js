// ─── Razorpay Key ─────────────────────────────────────────────────
// Get from: https://dashboard.razorpay.com → Settings → API Keys
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID || '';

/**
 * Dynamically load the Razorpay checkout script.
 * @returns {Promise<boolean>}
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Open Razorpay checkout for a donation.
 * NOTE: For production you need a backend to create an order_id.
 * For this free-deploy version we use direct payment link mode.
 *
 * @param {object} opts
 * @param {number}   opts.amount      - Amount in INR (e.g. 100 for ₹100)
 * @param {string}   opts.name        - Donor name
 * @param {string}   opts.email       - Donor email
 * @param {string}   opts.mobile      - Donor mobile
 * @param {string}   opts.description - Payment description
 * @param {function} opts.onSuccess   - Callback on success with payment data
 * @param {function} opts.onFailure   - Callback on failure
 */
export async function openDonationCheckout({
  amount, name, email, mobile, description,
  onSuccess, onFailure,
}) {
  if (!RAZORPAY_KEY) {
    alert('Razorpay key not configured. Add REACT_APP_RAZORPAY_KEY_ID to .env');
    return;
  }

  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onFailure?.('Razorpay script failed to load. Check your internet connection.');
    return;
  }

  const options = {
    key:         RAZORPAY_KEY,
    amount:      amount * 100,          // Razorpay expects paise
    currency:    'INR',
    name:        'बजरंग दल एकसर',
    description: description || 'Donation',
    image:       '',                    // Optional: your logo URL
    prefill: {
      name,
      email,
      contact: mobile,
    },
    notes: {
      purpose: 'Donation to Bajrang Dal Eksar',
    },
    theme: { color: '#FF6B00' },
    handler: (response) => {
      // response = { razorpay_payment_id, razorpay_order_id, razorpay_signature }
      onSuccess?.(response);
    },
    modal: {
      ondismiss: () => onFailure?.('Payment cancelled'),
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', (resp) => onFailure?.(resp.error?.description));
  rzp.open();
}
