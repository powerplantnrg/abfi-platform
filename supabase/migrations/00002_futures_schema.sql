-- ============================================
-- ABFI Platform - Futures Schema
-- Migration: 00002_futures_schema.sql
-- Perennial Crops & Long-term Supply Projections
-- ============================================

-- ============================================
-- Step 1: New Enums for Futures
-- ============================================

DO $$ BEGIN
  CREATE TYPE perennial_crop_type AS ENUM (
    'bamboo',
    'rotation_forestry',
    'eucalyptus',
    'poplar',
    'willow',
    'miscanthus',
    'switchgrass',
    'arundo_donax',
    'hemp',
    'other_perennial'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE futures_status AS ENUM (
    'draft',
    'active',
    'partially_contracted',
    'fully_contracted',
    'expired',
    'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE eoi_status AS ENUM (
    'pending',
    'under_review',
    'accepted',
    'declined',
    'expired',
    'withdrawn'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE land_status AS ENUM (
    'owned',
    'leased',
    'under_negotiation',
    'planned_acquisition'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================
-- Step 2: Feedstock Futures Table
-- Main table for long-term supply projections
-- ============================================

CREATE TABLE IF NOT EXISTS public.feedstock_futures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  futures_id TEXT NOT NULL UNIQUE, -- Human-readable ID like FUT-2024-001
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,

  -- Crop/Feedstock Information
  crop_type perennial_crop_type NOT NULL,
  crop_variety TEXT, -- Specific variety/cultivar
  feedstock_category feedstock_category NOT NULL DEFAULT 'lignocellulosic',
  title TEXT NOT NULL,
  description TEXT,

  -- Location
  location GEOGRAPHY(POINT, 4326),
  state australian_state NOT NULL,
  region TEXT,
  land_area_hectares NUMERIC NOT NULL,
  land_status land_status NOT NULL DEFAULT 'owned',

  -- Projection Period
  projection_start_year INTEGER NOT NULL,
  projection_end_year INTEGER NOT NULL,
  planting_date DATE,
  first_harvest_year INTEGER,
  rotation_cycle_years INTEGER, -- For rotation forestry

  -- Aggregate Totals (calculated from yearly projections)
  total_projected_tonnes NUMERIC NOT NULL DEFAULT 0,
  total_contracted_tonnes NUMERIC NOT NULL DEFAULT 0,
  total_available_tonnes NUMERIC NOT NULL DEFAULT 0,

  -- Pricing
  indicative_price_per_tonne NUMERIC,
  price_escalation_percent NUMERIC DEFAULT 2.5, -- Annual price escalation
  price_notes TEXT,

  -- Quality Expectations
  expected_carbon_intensity NUMERIC,
  expected_moisture_content NUMERIC,
  expected_energy_content_mj_kg NUMERIC,
  quality_notes TEXT,

  -- Certifications Planned
  planned_certifications TEXT[], -- Array of certification types planned
  sustainability_commitments TEXT,

  -- Status
  status futures_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_projection_period CHECK (projection_end_year > projection_start_year),
  CONSTRAINT valid_projection_range CHECK (projection_end_year - projection_start_year <= 25),
  CONSTRAINT positive_area CHECK (land_area_hectares > 0)
);

-- ============================================
-- Step 3: Yearly Yield Projections
-- Year-by-year breakdown of expected yields
-- ============================================

CREATE TABLE IF NOT EXISTS public.futures_yield_projections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  futures_id UUID NOT NULL REFERENCES public.feedstock_futures(id) ON DELETE CASCADE,

  -- Year Details
  projection_year INTEGER NOT NULL,
  harvest_season TEXT, -- e.g., 'Q1', 'Q2-Q3', 'Annual'

  -- Volume Projections
  projected_tonnes NUMERIC NOT NULL DEFAULT 0,
  contracted_tonnes NUMERIC NOT NULL DEFAULT 0,
  available_tonnes NUMERIC GENERATED ALWAYS AS (projected_tonnes - contracted_tonnes) STORED,

  -- Confidence Level (0-100)
  confidence_percent INTEGER NOT NULL DEFAULT 80,

  -- Year-specific notes
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  UNIQUE(futures_id, projection_year),
  CONSTRAINT valid_confidence CHECK (confidence_percent >= 0 AND confidence_percent <= 100),
  CONSTRAINT positive_volumes CHECK (projected_tonnes >= 0 AND contracted_tonnes >= 0),
  CONSTRAINT contracted_not_exceed_projected CHECK (contracted_tonnes <= projected_tonnes)
);

-- ============================================
-- Step 4: Expression of Interest (EOI) Table
-- Buyers express interest in futures
-- ============================================

CREATE TABLE IF NOT EXISTS public.futures_eoi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eoi_reference TEXT NOT NULL UNIQUE, -- Human-readable ID like EOI-2024-001
  futures_id UUID NOT NULL REFERENCES public.feedstock_futures(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.buyers(id) ON DELETE CASCADE,

  -- Interest Details
  interest_start_year INTEGER NOT NULL,
  interest_end_year INTEGER NOT NULL,
  annual_volume_tonnes NUMERIC NOT NULL,
  total_volume_tonnes NUMERIC NOT NULL,

  -- Pricing
  offered_price_per_tonne NUMERIC,
  price_terms TEXT,

  -- Delivery Requirements
  delivery_location TEXT,
  delivery_frequency TEXT, -- e.g., 'Monthly', 'Quarterly', 'Annual'
  logistics_notes TEXT,

  -- Quality Requirements
  min_quality_requirements JSONB, -- Flexible quality specs
  certification_requirements TEXT[],

  -- Contract Terms
  contract_duration_years INTEGER,
  payment_terms TEXT,
  additional_terms TEXT,

  -- Status
  status eoi_status NOT NULL DEFAULT 'pending',
  supplier_response TEXT,
  responded_at TIMESTAMPTZ,

  -- Validity
  valid_until TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '60 days'),

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_interest_period CHECK (interest_end_year >= interest_start_year),
  CONSTRAINT positive_volumes CHECK (annual_volume_tonnes > 0 AND total_volume_tonnes > 0)
);

-- ============================================
-- Step 5: Futures Contracts (when EOI accepted)
-- ============================================

CREATE TABLE IF NOT EXISTS public.futures_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_reference TEXT NOT NULL UNIQUE, -- Human-readable ID
  futures_id UUID NOT NULL REFERENCES public.feedstock_futures(id),
  eoi_id UUID NOT NULL REFERENCES public.futures_eoi(id),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
  buyer_id UUID NOT NULL REFERENCES public.buyers(id),

  -- Contract Period
  start_year INTEGER NOT NULL,
  end_year INTEGER NOT NULL,

  -- Volumes
  annual_volume_tonnes NUMERIC NOT NULL,
  total_contracted_tonnes NUMERIC NOT NULL,

  -- Pricing
  base_price_per_tonne NUMERIC NOT NULL,
  price_escalation_percent NUMERIC DEFAULT 2.5,
  price_review_frequency TEXT DEFAULT 'annual',

  -- Terms
  delivery_terms TEXT,
  quality_specifications JSONB,
  penalty_clauses TEXT,
  force_majeure_terms TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'suspended', 'completed', 'terminated')),

  -- Document References
  contract_document_url TEXT,

  -- Metadata
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Step 6: Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_futures_supplier ON public.feedstock_futures(supplier_id);
CREATE INDEX IF NOT EXISTS idx_futures_crop_type ON public.feedstock_futures(crop_type);
CREATE INDEX IF NOT EXISTS idx_futures_state ON public.feedstock_futures(state);
CREATE INDEX IF NOT EXISTS idx_futures_status ON public.feedstock_futures(status);
CREATE INDEX IF NOT EXISTS idx_futures_projection_years ON public.feedstock_futures(projection_start_year, projection_end_year);
CREATE INDEX IF NOT EXISTS idx_futures_location ON public.feedstock_futures USING GIST(location);

CREATE INDEX IF NOT EXISTS idx_yield_projections_futures ON public.futures_yield_projections(futures_id);
CREATE INDEX IF NOT EXISTS idx_yield_projections_year ON public.futures_yield_projections(projection_year);

CREATE INDEX IF NOT EXISTS idx_eoi_futures ON public.futures_eoi(futures_id);
CREATE INDEX IF NOT EXISTS idx_eoi_buyer ON public.futures_eoi(buyer_id);
CREATE INDEX IF NOT EXISTS idx_eoi_status ON public.futures_eoi(status);

CREATE INDEX IF NOT EXISTS idx_contracts_futures ON public.futures_contracts(futures_id);
CREATE INDEX IF NOT EXISTS idx_contracts_supplier ON public.futures_contracts(supplier_id);
CREATE INDEX IF NOT EXISTS idx_contracts_buyer ON public.futures_contracts(buyer_id);

-- ============================================
-- Step 7: Triggers
-- ============================================

-- Update totals on feedstock_futures when yield projections change
CREATE OR REPLACE FUNCTION update_futures_totals()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.feedstock_futures
  SET
    total_projected_tonnes = (
      SELECT COALESCE(SUM(projected_tonnes), 0)
      FROM public.futures_yield_projections
      WHERE futures_id = COALESCE(NEW.futures_id, OLD.futures_id)
    ),
    total_contracted_tonnes = (
      SELECT COALESCE(SUM(contracted_tonnes), 0)
      FROM public.futures_yield_projections
      WHERE futures_id = COALESCE(NEW.futures_id, OLD.futures_id)
    ),
    total_available_tonnes = (
      SELECT COALESCE(SUM(projected_tonnes - contracted_tonnes), 0)
      FROM public.futures_yield_projections
      WHERE futures_id = COALESCE(NEW.futures_id, OLD.futures_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.futures_id, OLD.futures_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_futures_totals
AFTER INSERT OR UPDATE OR DELETE ON public.futures_yield_projections
FOR EACH ROW EXECUTE FUNCTION update_futures_totals();

-- Auto-generate futures_id
CREATE OR REPLACE FUNCTION generate_futures_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.futures_id IS NULL THEN
    NEW.futures_id := 'FUT-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
                      LPAD(NEXTVAL('futures_id_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS futures_id_seq START 1;

CREATE TRIGGER trigger_generate_futures_id
BEFORE INSERT ON public.feedstock_futures
FOR EACH ROW EXECUTE FUNCTION generate_futures_id();

-- Auto-generate eoi_reference
CREATE OR REPLACE FUNCTION generate_eoi_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.eoi_reference IS NULL THEN
    NEW.eoi_reference := 'EOI-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
                         LPAD(NEXTVAL('eoi_reference_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS eoi_reference_seq START 1;

CREATE TRIGGER trigger_generate_eoi_reference
BEFORE INSERT ON public.futures_eoi
FOR EACH ROW EXECUTE FUNCTION generate_eoi_reference();

-- Auto-generate contract_reference
CREATE OR REPLACE FUNCTION generate_contract_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.contract_reference IS NULL THEN
    NEW.contract_reference := 'CON-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
                              LPAD(NEXTVAL('contract_reference_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS contract_reference_seq START 1;

CREATE TRIGGER trigger_generate_contract_reference
BEFORE INSERT ON public.futures_contracts
FOR EACH ROW EXECUTE FUNCTION generate_contract_reference();

-- ============================================
-- Step 8: Row Level Security (RLS)
-- ============================================

ALTER TABLE public.feedstock_futures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.futures_yield_projections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.futures_eoi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.futures_contracts ENABLE ROW LEVEL SECURITY;

-- Feedstock Futures Policies
CREATE POLICY "Suppliers can view own futures"
  ON public.feedstock_futures FOR SELECT
  TO authenticated
  USING (
    supplier_id IN (
      SELECT id FROM public.suppliers WHERE profile_id = auth.uid()
    )
    OR status = 'active'
  );

CREATE POLICY "Suppliers can create own futures"
  ON public.feedstock_futures FOR INSERT
  TO authenticated
  WITH CHECK (
    supplier_id IN (
      SELECT id FROM public.suppliers WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Suppliers can update own futures"
  ON public.feedstock_futures FOR UPDATE
  TO authenticated
  USING (
    supplier_id IN (
      SELECT id FROM public.suppliers WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Suppliers can delete own draft futures"
  ON public.feedstock_futures FOR DELETE
  TO authenticated
  USING (
    supplier_id IN (
      SELECT id FROM public.suppliers WHERE profile_id = auth.uid()
    )
    AND status = 'draft'
  );

-- Yield Projections Policies
CREATE POLICY "Users can view yield projections for accessible futures"
  ON public.futures_yield_projections FOR SELECT
  TO authenticated
  USING (
    futures_id IN (
      SELECT id FROM public.feedstock_futures
      WHERE supplier_id IN (
        SELECT id FROM public.suppliers WHERE profile_id = auth.uid()
      )
      OR status = 'active'
    )
  );

CREATE POLICY "Suppliers can manage yield projections for own futures"
  ON public.futures_yield_projections FOR ALL
  TO authenticated
  USING (
    futures_id IN (
      SELECT id FROM public.feedstock_futures
      WHERE supplier_id IN (
        SELECT id FROM public.suppliers WHERE profile_id = auth.uid()
      )
    )
  );

-- EOI Policies
CREATE POLICY "Suppliers can view EOIs for their futures"
  ON public.futures_eoi FOR SELECT
  TO authenticated
  USING (
    futures_id IN (
      SELECT id FROM public.feedstock_futures
      WHERE supplier_id IN (
        SELECT id FROM public.suppliers WHERE profile_id = auth.uid()
      )
    )
    OR buyer_id IN (
      SELECT id FROM public.buyers WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Buyers can create EOIs"
  ON public.futures_eoi FOR INSERT
  TO authenticated
  WITH CHECK (
    buyer_id IN (
      SELECT id FROM public.buyers WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Buyers can update own EOIs"
  ON public.futures_eoi FOR UPDATE
  TO authenticated
  USING (
    buyer_id IN (
      SELECT id FROM public.buyers WHERE profile_id = auth.uid()
    )
    OR futures_id IN (
      SELECT id FROM public.feedstock_futures
      WHERE supplier_id IN (
        SELECT id FROM public.suppliers WHERE profile_id = auth.uid()
      )
    )
  );

-- Contracts Policies
CREATE POLICY "Parties can view own contracts"
  ON public.futures_contracts FOR SELECT
  TO authenticated
  USING (
    supplier_id IN (
      SELECT id FROM public.suppliers WHERE profile_id = auth.uid()
    )
    OR buyer_id IN (
      SELECT id FROM public.buyers WHERE profile_id = auth.uid()
    )
  );

-- Admin policies
CREATE POLICY "Admins have full access to futures"
  ON public.feedstock_futures FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins have full access to yield projections"
  ON public.futures_yield_projections FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins have full access to EOIs"
  ON public.futures_eoi FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins have full access to contracts"
  ON public.futures_contracts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
