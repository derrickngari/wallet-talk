# WalletTalk

**Voice-Powered Personal Finance Tracker**
A smart, human-centered app that empowers small business owners and individuals to manage their expenses and income through natural speech input.

---

## 🏆 Hackathon Submission — Vibe Coding Hackathon 2025

**Theme:** *Human-Centered, Joy-Driven Solutions Using AI and Low-Code Tools*
**Track:** Retail & Ecommerce — *Lightweight Storefront Builder*

> **Problem:** Many small traders don't track their income or expenses and have no idea if they're making a profit.
> **Solution:** Build a mobile/web app that uses **voice** input to help business owners track income and expenses in real-time.

---

## 🛒 Why I Built This

Many small business owners and traders struggle to keep track of their income and expenses, often relying on memory or paper records. This makes it difficult to know if their business is truly profitable, and leads to missed opportunities for growth.

**WalletTalk** was created to solve this problem.  
My goal is to empower small business owners with a lightweight, easy-to-use tool that lets them track their accounts in real-time—using just their voice or a few taps on their phone. By making financial tracking as simple as talking, WalletTalk helps entrepreneurs make smarter decisions, stay organized, and grow their businesses with confidence.

---

## 🎯 Project Vision

WalletTalk is a mobile-first web application that enables users to:

* 🎙 Record expenses and income **by speaking naturally** (e.g. "I spent 500 shillings on food")
* 📈 Visualize transactions, categories, and trends
* 🧠 Receive real-time budget insights and summaries
* 🔐 Store data securely using Supabase with Row-Level Security (RLS)
* 🚀 Upgrade for advanced features through a clean freemium model

---

## 🧰 Tech Stack

| Feature            | Stack/Tool                   |
| ------------------ | ---------------------------- |
| Frontend Framework | React + Vite                 |
| Styling            | Tailwind CSS                 |
| Backend & Auth     | Supabase (PostgreSQL + Auth) |
| Voice Recognition  | Web Speech API               |
| Animation          | Framer Motion                |
| Deployment         | Vercel                       |
| Charts & Graphs    | Recharts                     |
| Toasts & Alerts    | React Toastify               |
|Icons               | Heroicons                    |

---

## 🌐 Live Demo

Visit [WalletTalk](https://wallettalk.vercel.app) to try it out!

---

## 🏗️ File Structure

```
wallet_talk/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, logo, etc.
│   │   ├── AnimatedSection.jsx
│   │   ├── AuthForm.jsx
│   │   ├── SideBar.jsx
│   │   ├── SummaryCards.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── TransactionForm.jsx
│   │   ├── TransactionList.jsx
│   │   └── VoiceInput.jsx
│   ├── pages/               # Main app pages
│   │   ├── BudgetsPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── ExpensesPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── IncomePage.jsx
│   │   ├── NotFound.jsx
│   │   └── PricingPage.jsx
│   ├── services/            # API & utility logic
│   │   ├── supabase.js      # Supabase client setup
│   │   ├── transactionService.js
│   │   └── voiceInput.js
│   ├── App.jsx              # Main app logic and routing
│   ├── index.css            # Tailwind styles
│   └── main.jsx             # Entry point
├── .env                     # Environment variables (see below)
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tailwind.config.js
└── vite.config.js
```

---

## 🔑 Environment Keys Setup

Create a `.env` file in the root of your project with the following keys:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase project credentials.

---

## 🗄️ Supabase Setup

### Tables

#### 1. `transactions`
```sql
create table transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  type text check (type in ('income', 'expense')),
  amount float not null,
  category text,
  description text,
  date timestamp with time zone default now()
);
```

#### 2. `users`
```sql
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Row Level Security (RLS) Policies

RLS policies ensure that users can only access their own data. Here's how to set them up:

#### For `transactions`:
```sql
-- Enable RLS
alter table transactions enable row level security;

-- Policy: Users can only see their own transactions
create policy "Users can only see their own transactions"
  on transactions for select
  using (auth.uid() = user_id);

-- Policy: Users can only insert their own transactions
create policy "Users can only insert their own transactions"
  on transactions for insert
  with check (auth.uid() = user_id);

-- Policy: Users can only update their own transactions
create policy "Users can only update their own transactions"
  on transactions for update
  using (auth.uid() = user_id);

-- Policy: Users can only delete their own transactions
create policy "Users can only delete their own transactions"
  on transactions for delete
  using (auth.uid() = user_id);
```

#### For `users`:
```sql
-- Enable RLS
alter table users enable row level security;

-- Policy: Users can only see their own profile
create policy "Users can only see their own profile"
  on users for select
  using (auth.uid() = id);

-- Policy: Users can only update their own profile
create policy "Users can only update their own profile"
  on users for update
  using (auth.uid() = id);
```

---

## 🔑 Core Features

### ✅ 1. Voice-Powered Input

* Natural voice commands like: `"I spent 400 on transport"` or `"I earned 800 from freelance"`
* Speech is parsed and stored as a transaction

### ✅ 2. Manual Transaction Entry

* Form to manually enter income or expense
* Option to set category, amount, date, and description

### ✅ 3. Realtime Summary Cards

* Total income, expenses, and balance
* Animated using `react-countup`

### ✅ 4. Analytics & Charts

* Monthly trends (Bar chart)
* Category breakdown (Pie chart)
* Expenses and income are visualized separately

### ✅ 5. Dark Mode Toggle

* Fully responsive and themed UI
* User-controlled light/dark toggle

### ✅ 6. Authentication & RLS

* Secure user auth via Supabase
* Data is isolated by user ID (Row-Level Security)

### ✅ 7. Pricing Page + Monetization

* Freemium model with upgrade tiers
* Monthly/Yearly toggle
* Custom pricing page using Tailwind & React

---

## 💸 Monetization Strategy

**Freemium Model:**

* **Free Tier:** 100 transactions/month, basic charts, voice input (limited)
* **Premium Tier:** Unlimited usage, exports, smart insights, advanced visuals

Optional Future Plans:

* File uploads (MPESA, CSV, PDF)
* Budget goal tracking
* White-label solutions for banks & SACCOs

---

## 🧠 AI & Prompt Engineering

> "I spent 400 shillings on groceries" → parsed into structured JSON:

```json
{
  "type": "expense",
  "amount": 400,
  "category": "groceries",
  "currency": "KES",
  "description": "I spent 400 shillings on groceries"
}
```

* Regex-powered parsing of speech
* Voice intent matching (spent/earned/got/etc)

---

## 🎨 UX, Aesthetics & Delight

* **Onboarding splash screen** with animated logo
* Smooth component entrance animations (Framer Motion)
* Consistent typography and spacing
* Fully responsive from mobile to desktop

---

## 🛡 Security

* RLS policies on `transactions` and `users` tables
* Supabase Auth guards data access by user ID
* Email verification required for account activation

---

## 📤 How to Use

1. Sign up and confirm your email
2. Click the **"Start Voice Input"** button
3. Speak naturally (e.g. "I spent 1000 on rent")
4. See your dashboard update in real time
5. Optionally upgrade to Premium for unlimited entries

---

## 🧪 Testing & Validation

* Manual and voice entry tested on Chrome & Firefox
* Mobile-first UI tested on Android (Realme C55)
* Supabase logs and RLS tested for user isolation

---

## 🚀 Future Enhancements

* ✅ MPESA / bank statement file upload
* ✅ AI-powered budget recommendations
* ✅ Push reminders for overspending
* ✅ Offline-first support with local DB caching

---

## 👨🏽‍💻 Built With Love by

**@derrickngari** – Developer, Designer, Founder of WalletTalk

> Helping people talk to their wallet... and get answers.

