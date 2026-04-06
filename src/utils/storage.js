// ─── Storage Keys ────────────────────────────────────────────
export const KEYS = {
  QUESTIONS:        'bde_questions',
  IMAGES:           'bde_images',
  PARTICIPANTS:     'bde_participants',
  QUIZ_STATE:       'bde_quiz_state',   // 'idle' | 'active' | 'ended'
  RESULTS_PUBLISHED:'bde_results_published',
  ADMIN_SESSION:    'bde_admin_session',
};

// ─── Admin Credentials (change before deployment) ─────────────
export const ADMIN_CREDS = {
  username: 'admin',
  password: 'bajrang2024',
};

// ─── DB helpers ───────────────────────────────────────────────
export const db = {
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Dispatch storage event for cross-tab sync
      window.dispatchEvent(new StorageEvent('storage', { key }));
    } catch (err) {
      console.error('Storage error:', err);
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },
};

// ─── Seed initial data ────────────────────────────────────────
export function seedInitialData() {
  if (db.get(KEYS.QUESTIONS) !== null) return; // already seeded

  db.set(KEYS.QUESTIONS, [
    {
      id: 1,
      question: 'हनुमान जी के पिता का नाम क्या था?',
      options: ['केसरी', 'वायु', 'सुमेरु', 'अंजन'],
      correct: 0,
    },
    {
      id: 2,
      question: 'बजरंग बली का जन्मस्थान कौन सा माना जाता है?',
      options: ['अयोध्या', 'किष्किंधा', 'लंका', 'अंजनाद्रि'],
      correct: 3,
    },
    {
      id: 3,
      question: 'राम रक्षा स्तोत्र के रचयिता कौन हैं?',
      options: ['वाल्मीकि', 'बुधकौशिक', 'तुलसीदास', 'व्यास'],
      correct: 1,
    },
    {
      id: 4,
      question: 'हनुमान चालीसा में कितनी चौपाइयाँ हैं?',
      options: ['38', '40', '42', '44'],
      correct: 1,
    },
    {
      id: 5,
      question: 'रामायण के किस काण्ड में हनुमान जी लंका जाते हैं?',
      options: ['बाल काण्ड', 'किष्किंधा काण्ड', 'सुंदर काण्ड', 'युद्ध काण्ड'],
      correct: 2,
    },
  ]);

  db.set(KEYS.QUIZ_STATE, 'idle');
  db.set(KEYS.RESULTS_PUBLISHED, false);
  db.set(KEYS.IMAGES, []);
  db.set(KEYS.PARTICIPANTS, []);
}
