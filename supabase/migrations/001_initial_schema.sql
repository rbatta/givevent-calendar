-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendars
CREATE TABLE calendars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_budget DECIMAL(10,2) NOT NULL,
  min_amount DECIMAL(10,2) NOT NULL,
  max_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'complete')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Charities (per calendar)
CREATE TABLE charities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  calendar_id UUID NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  notes TEXT,
  scope TEXT CHECK (scope IN ('international', 'national', 'local')),
  is_grand_prize BOOLEAN DEFAULT FALSE,
  grand_prize_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Amount Tiers (for setup/preview)
CREATE TABLE amount_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  calendar_id UUID NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar Days (the actual assignments)
CREATE TABLE calendar_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  calendar_id UUID NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
  charity_id UUID NOT NULL REFERENCES charities(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  is_grand_prize BOOLEAN DEFAULT FALSE,
  is_revealed BOOLEAN DEFAULT FALSE,
  is_paid BOOLEAN DEFAULT FALSE,
  charity_rerolls_used INTEGER DEFAULT 0,
  amount_rerolls_used INTEGER DEFAULT 0,
  revealed_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(calendar_id, date)
);

-- Global charity suggestions (for popularity tracking)
CREATE TABLE charity_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  scope TEXT NOT NULL CHECK (scope IN ('international', 'national', 'local')),
  category TEXT NOT NULL,
  description TEXT,
  charity_navigator_rating INTEGER,
  charity_navigator_stars INTEGER,
  is_anchored BOOLEAN DEFAULT FALSE,
  times_selected INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE amount_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE charity_suggestions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/edit their own
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Calendars: users can only access their own
CREATE POLICY "Users can view own calendars" ON calendars FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own calendars" ON calendars FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own calendars" ON calendars FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own calendars" ON calendars FOR DELETE USING (auth.uid() = user_id);

-- Charities: users can access charities for their calendars
CREATE POLICY "Users can view own charities" ON charities FOR SELECT
  USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own charities" ON charities FOR INSERT
  WITH CHECK (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own charities" ON charities FOR UPDATE
  USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own charities" ON charities FOR DELETE
  USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));

-- Amount Tiers: same pattern
CREATE POLICY "Users can view own tiers" ON amount_tiers FOR SELECT
  USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own tiers" ON amount_tiers FOR INSERT
  WITH CHECK (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own tiers" ON amount_tiers FOR UPDATE
  USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own tiers" ON amount_tiers FOR DELETE
  USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));

-- Calendar Days: same pattern
CREATE POLICY "Users can view own days" ON calendar_days FOR SELECT
  USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own days" ON calendar_days FOR INSERT
  WITH CHECK (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own days" ON calendar_days FOR UPDATE
  USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own days" ON calendar_days FOR DELETE
  USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));

-- Charity Suggestions: everyone can read, only service role can modify
CREATE POLICY "Anyone can view suggestions" ON charity_suggestions FOR SELECT TO authenticated USING (true);

-- Create indexes for performance
CREATE INDEX idx_calendars_user_id ON calendars(user_id);
CREATE INDEX idx_charities_calendar_id ON charities(calendar_id);
CREATE INDEX idx_amount_tiers_calendar_id ON amount_tiers(calendar_id);
CREATE INDEX idx_calendar_days_calendar_id ON calendar_days(calendar_id);
CREATE INDEX idx_calendar_days_date ON calendar_days(date);
CREATE INDEX idx_charity_suggestions_scope ON charity_suggestions(scope);
