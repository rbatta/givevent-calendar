# Advent Charity Calendar App

A webapp for creating personalized charity advent calendars. Each day reveals a charity and donation amount, turning the holiday season into a structured giving experience.

## Quick Start

### Prerequisites

- Node.js 18+
- A Supabase account (free tier works)
- A Vercel account (for deployment)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to SQL Editor and run the schema from `supabase/migrations/001_initial_schema.sql`
3. Run the seed data from `supabase/seed.sql`
4. Go to Settings > API and copy:
   - Project URL
   - `anon` public key

### 2. Set Up Local Environment

```bash
# Clone the repo
git clone <your-repo-url>
cd advent-charity

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your Supabase credentials
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

---

## Project Structure

```
advent-charity/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                 # Reusable UI primitives
│   ├── calendar/           # Calendar-specific components
│   ├── setup/              # Setup flow components
│   └── auth/               # Authentication components
├── lib/                    # Utilities and hooks
│   ├── supabase/           # Supabase client setup
│   ├── utils/              # Helper functions
│   ├── constants/          # Static data (charities)
│   ├── hooks/              # Custom React hooks
│   └── types/              # TypeScript types
├── public/                 # Static assets
└── supabase/               # Database migrations and seeds
```

---

## Key Features

- **Multi-step calendar setup**: Name, dates, charities, budget, distribution
- **Curated charity suggestions**: 30+ vetted charities with 90%+ ratings
- **Logarithmic amount distribution**: More small donations, fewer large ones
- **Card-flip reveal**: Satisfying animation when opening each day
- **Reroll system**: Up to 2 rerolls per day for charity and amount
- **Grand prize**: Designate one charity for a fixed special amount
- **Progress tracking**: See total donated throughout the month

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Supabase | Database + Auth |
| date-fns | Date utilities |

---

## Documentation

- `advent-charity-spec.md` - Full technical specification
- `charity-data.md` - Curated charity list with TypeScript types
- `ui-spec.md` - UI/UX wireframes and design guidelines

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## License

MIT
