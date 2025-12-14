-- Migration: Market Signals
-- Adds market signals table for buy/sell interest tracking

-- ============================================
-- MARKET SIGNALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS market_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Commodity information
  commodity_id TEXT NOT NULL,
  commodity_name TEXT NOT NULL,
  commodity_category TEXT,

  -- Signal details
  signal_type TEXT NOT NULL CHECK (signal_type IN ('buy', 'sell')),
  volume NUMERIC,
  unit TEXT,

  -- Pricing (optional)
  target_price NUMERIC,
  price_currency TEXT DEFAULT 'AUD',
  price_basis TEXT, -- e.g., 'FOB', 'delivered', 'ex-farm'

  -- Location preference
  preferred_state TEXT,
  preferred_region TEXT,
  delivery_location TEXT,

  -- Timing
  delivery_window_start DATE,
  delivery_window_end DATE,

  -- Quality specs (JSON for flexibility)
  quality_specs JSONB DEFAULT '{}',

  -- Notes and requirements
  notes TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'expired', 'cancelled', 'matched')),

  -- Visibility
  is_public BOOLEAN DEFAULT true,

  -- Matching
  matched_with UUID REFERENCES market_signals(id),
  matched_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT valid_volume CHECK (volume IS NULL OR volume > 0),
  CONSTRAINT valid_price CHECK (target_price IS NULL OR target_price > 0)
);

-- Indexes for performance
CREATE INDEX idx_market_signals_user ON market_signals(user_id);
CREATE INDEX idx_market_signals_commodity ON market_signals(commodity_id);
CREATE INDEX idx_market_signals_type ON market_signals(signal_type);
CREATE INDEX idx_market_signals_status ON market_signals(status);
CREATE INDEX idx_market_signals_active ON market_signals(status, signal_type) WHERE status = 'active';
CREATE INDEX idx_market_signals_category ON market_signals(commodity_category) WHERE commodity_category IS NOT NULL;

-- ============================================
-- MARKET MATCHES TABLE (for tracking potential matches)
-- ============================================
CREATE TABLE IF NOT EXISTS market_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  buy_signal_id UUID NOT NULL REFERENCES market_signals(id) ON DELETE CASCADE,
  sell_signal_id UUID NOT NULL REFERENCES market_signals(id) ON DELETE CASCADE,

  -- Match score (0-100)
  match_score NUMERIC NOT NULL CHECK (match_score >= 0 AND match_score <= 100),

  -- Match details
  match_reasons JSONB DEFAULT '[]',

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'negotiating', 'completed', 'rejected')),

  -- Communication
  buyer_contacted BOOLEAN DEFAULT false,
  seller_contacted BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT different_signals CHECK (buy_signal_id != sell_signal_id),
  UNIQUE(buy_signal_id, sell_signal_id)
);

CREATE INDEX idx_market_matches_buy ON market_matches(buy_signal_id);
CREATE INDEX idx_market_matches_sell ON market_matches(sell_signal_id);
CREATE INDEX idx_market_matches_status ON market_matches(status);

-- ============================================
-- PRICE OBSERVATIONS TABLE (for ABFI indices)
-- ============================================
CREATE TABLE IF NOT EXISTS price_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Index information
  index_id TEXT NOT NULL,
  index_name TEXT NOT NULL,

  -- Price data
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AUD',
  unit TEXT NOT NULL,

  -- Location/basis
  price_basis TEXT, -- FOB, delivered, etc.
  location TEXT,

  -- Quality/grade
  grade TEXT,
  specifications JSONB DEFAULT '{}',

  -- Source
  source_type TEXT CHECK (source_type IN ('transaction', 'quote', 'assessment', 'survey')),
  source_name TEXT,
  is_verified BOOLEAN DEFAULT false,

  -- Observation date
  observation_date DATE NOT NULL,

  -- Volume context
  volume_tonnes NUMERIC,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_price_observations_index ON price_observations(index_id, observation_date);
CREATE INDEX idx_price_observations_date ON price_observations(observation_date);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE market_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_observations ENABLE ROW LEVEL SECURITY;

-- Market signals: Users can manage their own, view public signals
CREATE POLICY "Users can manage own signals" ON market_signals
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view public active signals" ON market_signals
  FOR SELECT USING (
    is_public = true AND status = 'active'
  );

-- Market matches: Participants can view their matches
CREATE POLICY "Users can view their matches" ON market_matches
  FOR SELECT USING (
    buy_signal_id IN (SELECT id FROM market_signals WHERE user_id = auth.uid())
    OR sell_signal_id IN (SELECT id FROM market_signals WHERE user_id = auth.uid())
  );

-- Price observations: Public read, admin write
CREATE POLICY "Public can view price observations" ON price_observations
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage price observations" ON price_observations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- TRIGGERS
-- ============================================

-- Update timestamp on market_signals
CREATE OR REPLACE FUNCTION update_market_signals_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER market_signals_updated
  BEFORE UPDATE ON market_signals
  FOR EACH ROW
  EXECUTE FUNCTION update_market_signals_timestamp();

-- Update timestamp on market_matches
CREATE TRIGGER market_matches_updated
  BEFORE UPDATE ON market_matches
  FOR EACH ROW
  EXECUTE FUNCTION update_market_signals_timestamp();

-- ============================================
-- GRANTS
-- ============================================
GRANT SELECT, INSERT, UPDATE, DELETE ON market_signals TO authenticated;
GRANT SELECT ON market_matches TO authenticated;
GRANT SELECT ON price_observations TO authenticated;
GRANT INSERT ON price_observations TO authenticated;
