# 🚩 बजरंग दल एकसर — Web Application

A complete, production-ready React web app for Bajrang Dal Eksar — featuring gallery, live quiz, results leaderboard, and admin panel. **100% frontend-only** (no backend/server needed) using localStorage for persistence. Deploy free on Vercel, Netlify, or GitHub Pages.

---

## 📁 Project Structure

```
bajrang-dal-eksar/
├── public/
│   └── index.html
└── src/
    ├── App.jsx                        # Root app + React Router setup
    ├── index.js                       # Entry point
    ├── styles/
    │   └── global.css                 # Complete design system
    ├── context/
    │   ├── AppContext.jsx             # Global state (quiz, images, participants, admin)
    │   └── ToastContext.jsx           # Toast notification system
    ├── hooks/
    │   ├── useCarousel.js             # Auto-sliding carousel logic
    │   ├── useQuizTimer.js            # Per-question countdown timer
    │   └── useLocalStorage.js        # Persistent useState hook
    ├── utils/
    │   ├── storage.js                 # localStorage DB + seed data + credentials
    │   ├── imageUtils.js             # Canvas-based image compression
    │   └── helpers.js                # uid, date, validation helpers
    ├── pages/
    │   ├── HomePage.jsx              # Landing page with carousel + about
    │   ├── GalleryPage.jsx           # Year-wise photo gallery
    │   ├── QuizPage.jsx              # Quiz flow (entry → questions → result)
    │   ├── ResultsPage.jsx           # Podium + leaderboard table
    │   ├── AdminPage.jsx             # Admin panel shell
    │   └── LoginPage.jsx             # Admin login form
    └── components/
        ├── common/                    # Reusable UI primitives
        │   ├── Layout.jsx            # App shell wrapper
        │   ├── Navbar.jsx            # Sticky navigation bar
        │   ├── Footer.jsx            # Site footer
        │   ├── Button.jsx            # Multi-variant button
        │   ├── Input.jsx             # Labelled input with error state
        │   ├── Modal.jsx             # Keyboard-dismissable modal
        │   ├── Badge.jsx             # Status badge with dot
        │   ├── StatCard.jsx          # Metric display card
        │   ├── EmptyState.jsx        # Empty list placeholder
        │   ├── Spinner.jsx           # Loading spinner
        │   ├── Lightbox.jsx          # Full-screen image preview
        │   ├── ToastContainer.jsx    # Toast notification renderer
        │   └── ProtectedRoute.jsx    # Admin auth guard
        ├── public/                   # Viewer-facing components
        │   ├── Carousel.jsx          # Auto-sliding image carousel
        │   ├── StatsBar.jsx          # Live stats strip
        │   ├── GalleryGrid.jsx       # Responsive image grid
        │   ├── Podium.jsx            # Top 3 winners podium
        │   └── ResultsTable.jsx      # Ranked results table
        ├── quiz/                     # Quiz flow components
        │   ├── QuizEntry.jsx         # Name + mobile form
        │   ├── QuizQuestion.jsx      # Question card with timer
        │   └── QuizResult.jsx        # Score + grade screen
        └── admin/                    # Admin panel components
            ├── AdminTabs.jsx         # Tab navigation
            ├── DashboardPanel.jsx    # Quiz/results controls + analytics
            ├── QuestionsPanel.jsx    # CRUD for quiz questions
            ├── ImagesPanel.jsx       # Image upload + gallery management
            └── ParticipantsPanel.jsx # Participants list + CSV export
```

---

## 🚀 Getting Started (Local)

### Prerequisites
- Node.js 18+ and npm

### Install & Run
```bash
# 1. Navigate into the project
cd bajrang-dal-eksar

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
```
The `build/` folder is ready to deploy anywhere.

---

## 🔐 Admin Access

| Field    | Default Value  |
|----------|---------------|
| Username | `admin`       |
| Password | `bajrang2024` |

**Change credentials before deploying:**
Edit `src/utils/storage.js` → `ADMIN_CREDS` object.

---

## 🌐 Free Deployment Options

### Option 1 — Vercel (Recommended, 1 minute)
```bash
npm install -g vercel
npm run build
vercel --prod
```
Or connect your GitHub repo at [vercel.com](https://vercel.com) for automatic deploys.

### Option 2 — Netlify (Drag & Drop)
1. Run `npm run build`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `build/` folder onto the page. Done!

### Option 3 — GitHub Pages
```bash
npm install --save-dev gh-pages
```
Add to `package.json`:
```json
"homepage": "https://yourusername.github.io/bajrang-dal-eksar",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```
Then run:
```bash
npm run deploy
```

---

## 🧠 Features

### Public (No Login)
- 🏠 **Home** — Auto-sliding image carousel, live stats bar, about section, latest photos
- 📸 **Gallery** — Year-wise photo grid with lightbox preview and year filter
- 📝 **Quiz** — Name + mobile entry, 20-second countdown per question, instant scoring
- 🏆 **Results** — Podium (top 3) + full ranked leaderboard (visible only after admin publishes)

### Admin Panel (`/admin`)
- 📊 **Dashboard** — Start/stop quiz, publish/unpublish results, analytics breakdown
- 🧠 **Questions** — Add, edit, delete quiz questions with 4 options and correct answer marking
- 🖼️ **Images** — Upload multiple images with auto-compression (canvas), caption + year tagging, delete
- 👥 **Participants** — Search, view scores with percentages, CSV export, bulk delete

### Bonus Features
- ✅ Real-time cross-tab sync (localStorage `storage` event)
- ✅ Image auto-compression (canvas, ~75% JPEG quality, max 900px)
- ✅ CSV export of participant results
- ✅ Search participants by name or mobile
- ✅ Score analytics (80%+, 60–79%, <60%)
- ✅ Mobile-responsive design
- ✅ Keyboard navigation (Escape to close modals/lightbox)

---

## 🗄️ Data Schema (localStorage)

```js
// Quiz questions
bde_questions: [{ id, question, options: [string×4], correct: 0-3 }]

// Uploaded images
bde_images: [{ id, url: "data:image/jpeg;base64,...", caption, year, uploaded }]

// Quiz participants
bde_participants: [{ name, mobile, score, total, date }]

// Quiz state
bde_quiz_state: "idle" | "active" | "ended"

// Results visibility
bde_results_published: true | false

// Admin session
bde_admin_session: true | false
```

---

## ⚡ Upgrading to a Real Backend

To support multi-device shared data, replace the `db` object in `src/utils/storage.js` with API calls to:

| Option         | Free Tier          | Notes                          |
|----------------|--------------------|-------------------------------|
| Firebase RTDB  | 1 GB storage       | Easiest real-time sync        |
| Supabase       | 500 MB + auth      | Full SQL + auth                |
| PocketBase     | Self-hosted        | Single binary, all-in-one     |
| MongoDB Atlas  | 512 MB             | Full MongoDB with REST API    |

---

## 🙏 जय श्री राम

बजरंग दल एकसर — सेवा, सुरक्षा, संस्कृति
"# quiz-app" 
