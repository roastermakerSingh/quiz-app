# 🚩 बजरंग दल एकसर — v2.0 Full-Stack Web App

A complete production-ready React app with **Supabase** (database), **Cloudinary** (image CDN), and **Razorpay** (payments). Deploy free on Netlify in under 10 minutes.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🖼️ Gallery | Images stored on **Cloudinary CDN** — visible to all users worldwide |
| 👥 Members | Anyone can apply. Admin approves/rejects. Unique mobile enforced. |
| 💳 Donations | **Razorpay** payment gateway (UPI, Cards, Net Banking) |
| 🏦 Bank Details | Admin adds bank account + UPI ID shown on donation page |
| 🔐 Password | Admin can change password from Settings panel |
| 🧠 Quiz | Live quiz with 20s timer, Supabase leaderboard |
| 📊 Results | Podium + leaderboard, admin publishes when ready |
| 🔄 Realtime | Supabase realtime — all tabs sync instantly |

---

## ✅ What's Required vs Optional

| Service | Required? | Without it |
|---------|-----------|-----------|
| **Supabase** | ✅ YES | App won't load data (images, members, quiz) |
| **Cloudinary** | ✅ YES | Image upload won't work |
| **Razorpay** | ❌ NO — Optional | Donation page shows bank details only. Users fill form → transfer manually → admin verifies. Everything else works perfectly. |

### 🏦 How Donation Works WITHOUT Razorpay

1. User visits `/donation` page — sees a notice: "Bank Transfer Mode"
2. User fills: Name, Mobile, Amount, Message → clicks **"विवरण सहेजें और बैंक से दान करें"**
3. Their details are saved in Supabase (Admin can see in Donations panel)
4. Page shows your Bank Account Number + IFSC + UPI ID (set in Admin → Settings)
5. User manually transfers money via their own UPI/banking app
6. Admin verifies receipt and updates status

**You can add Razorpay later anytime** — just set the environment variable in Netlify and redeploy. No code changes needed.


---

## 🚀 STEP-BY-STEP DEPLOYMENT GUIDE

### STEP 1 — Create Supabase Database (Free)

1. Go to **https://supabase.com** → Sign up (free)
2. Click **"New Project"** → Give it a name → Choose a region close to India → Set a strong DB password → **Create Project** (takes ~2 min)
3. Once ready, click **"SQL Editor"** in the left sidebar
4. Paste the entire SQL below and click **Run**:

```sql
create table if not exists images (
  id         uuid primary key default gen_random_uuid(),
  url        text not null,
  public_id  text,
  caption    text default '',
  year       text default '',
  created_at timestamptz default now()
);

create table if not exists questions (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  options    jsonb not null,
  correct    int  not null,
  created_at timestamptz default now()
);

create table if not exists participants (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  mobile     text not null unique,
  score      int  default 0,
  total      int  default 0,
  created_at timestamptz default now()
);

create table if not exists members (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  age              int,
  address          text,
  mobile           text not null unique,
  email            text,
  photo_url        text,
  photo_public_id  text,
  status           text default 'pending',
  created_at       timestamptz default now()
);

create table if not exists donations (
  id             uuid primary key default gen_random_uuid(),
  donor_name     text,
  donor_email    text,
  donor_mobile   text,
  amount         int  not null,
  payment_id     text,
  payment_status text default 'pending',
  message        text,
  created_at     timestamptz default now()
);

create table if not exists settings (
  key   text primary key,
  value text
);

-- RLS
alter table images       enable row level security;
alter table questions    enable row level security;
alter table participants enable row level security;
alter table members      enable row level security;
alter table donations    enable row level security;
alter table settings     enable row level security;

create policy "pub_read_images"    on images       for select using (true);
create policy "pub_read_questions" on questions    for select using (true);
create policy "pub_read_parts"     on participants for select using (true);
create policy "pub_read_members"   on members      for select using (status = 'approved');
create policy "pub_read_all_members" on members    for select using (true);
create policy "pub_read_donations" on donations    for select using (true);
create policy "pub_read_settings"  on settings     for select using (true);

create policy "pub_insert_members"  on members      for insert with check (true);
create policy "pub_insert_donations" on donations   for insert with check (true);
create policy "pub_insert_parts"    on participants for insert with check (true);

create policy "admin_images"    on images    for all using (true) with check (true);
create policy "admin_questions" on questions for all using (true) with check (true);
create policy "admin_members"   on members   for all using (true) with check (true);
create policy "admin_settings"  on settings  for all using (true) with check (true);
create policy "admin_donations" on donations for all using (true) with check (true);

-- Seed default questions
insert into questions (question, options, correct) values
('हनुमान जी के पिता का नाम क्या था?', '["केसरी","वायु","सुमेरु","अंजन"]', 0),
('हनुमान चालीसा में कितनी चौपाइयाँ हैं?', '["38","40","42","44"]', 1),
('रामायण के किस काण्ड में हनुमान जी लंका जाते हैं?', '["बाल काण्ड","किष्किंधा काण्ड","सुंदर काण्ड","युद्ध काण्ड"]', 2);
```

5. Go to **Project Settings → API** → Copy:
   - **Project URL** → This is your `REACT_APP_SUPABASE_URL`
   - **anon public** key → This is your `REACT_APP_SUPABASE_ANON_KEY`

---

### STEP 2 — Create Cloudinary Account (Free)

1. Go to **https://cloudinary.com** → Sign up (free — 25 GB storage)
2. From the dashboard, note your **Cloud Name**
3. Go to **Settings → Upload → Upload presets**
4. Click **"Add upload preset"**
   - Signing mode: **Unsigned**
   - Folder: `bajrang-dal-eksar`
   - Click Save
5. Copy the **Preset Name**

---

### STEP 3 — Create Razorpay Account (Free)

1. Go to **https://razorpay.com** → Sign up
2. Complete KYC (required for live payments, skip for testing)
3. Go to **Settings → API Keys**
4. Click **"Generate Test Key"** for testing
5. Copy **Key ID** (starts with `rzp_test_...`)

> For live payments: complete KYC, generate Live keys (`rzp_live_...`), and add your bank account in Razorpay dashboard for payouts.

---

### STEP 4 — Push to GitHub

```bash
# Unzip the project
unzip bajrang-dal-eksar.zip
cd bajrang-dal-eksar

# Initialize git
git init
git add .
git commit -m "🚩 Initial commit: Bajrang Dal Eksar v2.0"

# Create repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/bajrang-dal-eksar.git
git branch -M main
git push -u origin main
```

---

### STEP 5 — Deploy on Netlify (Free)

**Option A — Connect GitHub (Recommended — auto-deploys on every push)**

1. Go to **https://app.netlify.com** → Log in with GitHub
2. Click **"Add new site" → "Import an existing project"**
3. Choose **GitHub** → Select your `bajrang-dal-eksar` repository
4. Build settings (auto-detected):
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
5. Click **"Add environment variables"** and add ALL of these:

```
REACT_APP_SUPABASE_URL          = https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY     = eyJhbGciOiJIUzI1NiI...
REACT_APP_CLOUDINARY_CLOUD_NAME = your-cloud-name
REACT_APP_CLOUDINARY_UPLOAD_PRESET = your-preset-name
REACT_APP_RAZORPAY_KEY_ID       = rzp_test_xxxxxxxxxxxxx
```

6. Click **"Deploy site"** — Done! 🎉 (takes ~2 minutes)

**Option B — Manual drag & drop**

```bash
# Create .env file first
cp .env.example .env
# Edit .env and fill in all values
nano .env

# Install and build
npm install
npm run build

# Go to https://app.netlify.com/drop
# Drag the build/ folder onto the page
```

> **Note:** For manual deploys, environment variables must be in `.env` before running `npm run build`.

---

### STEP 6 — Add _redirects for React Router

Netlify needs this to handle client-side routing. The file is already included at `public/_redirects`.

If missing, create `public/_redirects` with content:
```
/* /index.html 200
```

---

### STEP 7 — Test Your Deployment

1. Open your Netlify URL (e.g. `https://bajrang-dal-eksar.netlify.app`)
2. Go to `/login` → Login with `admin` / `bajrang2024`
3. Go to **Admin → Settings** → Change password
4. Go to **Admin → Images** → Upload a photo → Check it appears on Home/Gallery
5. Go to **Admin → Settings** → Add bank details
6. Visit `/donation` → Test a ₹1 payment (use Razorpay test card: `4111 1111 1111 1111`)
7. Visit `/members` → Submit a member request
8. Go to **Admin → Members** → Approve the member

---

## 🔐 Admin Credentials

| Username | Password     |
|----------|-------------|
| `admin`  | `bajrang2024` |

Change from **Admin Panel → ⚙️ Settings → पासवर्ड बदलें**

---

## 📁 Project Structure

```
src/
├── lib/
│   ├── supabase.js        ← Supabase client
│   ├── cloudinary.js      ← Image upload to CDN
│   └── razorpay.js        ← Payment gateway
├── context/
│   ├── AppContext.jsx      ← Global state + Supabase data
│   └── ToastContext.jsx
├── hooks/
├── utils/
├── pages/
│   ├── HomePage.jsx
│   ├── GalleryPage.jsx
│   ├── QuizPage.jsx        ← Saves to Supabase
│   ├── ResultsPage.jsx
│   ├── MembersPage.jsx     ← Public member list + form
│   ├── DonationPage.jsx    ← Razorpay + bank details
│   ├── AdminPage.jsx
│   └── LoginPage.jsx
└── components/
    ├── common/
    ├── public/
    │   └── DonationForm.jsx
    ├── quiz/
    ├── members/
    │   ├── MemberCard.jsx
    │   └── MemberForm.jsx  ← Cloudinary photo upload
    └── admin/
        ├── DashboardPanel.jsx
        ├── QuestionsPanel.jsx ← Supabase CRUD
        ├── ImagesPanel.jsx    ← Cloudinary upload
        ├── MembersPanel.jsx   ← Approve/Reject
        ├── DonationsPanel.jsx ← View donations
        ├── ParticipantsPanel.jsx
        └── SettingsPanel.jsx  ← Password + bank details
```

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Fill in Supabase, Cloudinary, Razorpay keys

# 3. Start dev server
npm start
# Opens at http://localhost:3000
```

---

## 🔧 Tech Stack

| Layer      | Technology           | Free Tier          |
|------------|---------------------|--------------------|
| Frontend   | React 18 + Router 6  | —                  |
| Database   | Supabase (PostgreSQL) | 500 MB, unlimited API |
| Images     | Cloudinary CDN       | 25 GB storage      |
| Payments   | Razorpay             | Free (2% fee on transactions) |
| Hosting    | Netlify              | 100 GB bandwidth   |

**Total cost: ₹0** for setup. Razorpay charges 2% per transaction (deducted automatically).

---

जय श्री राम 🚩 — बजरंग दल एकसर
