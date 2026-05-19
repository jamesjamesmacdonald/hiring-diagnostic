-- The Hiring Funnel Diagnostic — Supabase Schema
-- Apply this in the Supabase SQL editor before Day 6 of the build.

-- ============================================================
-- Main diagnostic results table
-- ============================================================
CREATE TABLE IF NOT EXISTS diagnostic_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Context
  company_stage TEXT NOT NULL CHECK (company_stage IN ('pre-seed', 'seed', 'series-a', 'series-b-plus')),
  role_type TEXT NOT NULL CHECK (role_type IN ('engineer', 'gtm', 'ops', 'leadership', 'other')),
  region TEXT NOT NULL CHECK (region IN ('sydney', 'melbourne', 'brisbane', 'other-au')),
  role_title TEXT, -- Free text. Used for salary lookup.

  -- Per-stage scores 0-100
  align_score INT NOT NULL CHECK (align_score BETWEEN 0 AND 100),
  attract_score INT NOT NULL CHECK (attract_score BETWEEN 0 AND 100),
  assess_score INT NOT NULL CHECK (assess_score BETWEEN 0 AND 100),
  close_score INT NOT NULL CHECK (close_score BETWEEN 0 AND 100),
  onboard_score INT NOT NULL CHECK (onboard_score BETWEEN 0 AND 100),

  -- Diagnosis
  worst_leak TEXT NOT NULL CHECK (worst_leak IN ('align', 'attract', 'assess', 'close', 'onboard')),
  recommendation_id TEXT NOT NULL,

  -- Forcing prompt (the success-criterion sentence)
  forcing_prompt TEXT,

  -- Answer detail (JSONB array of { questionId, response, score })
  answers JSONB NOT NULL,

  -- Email and contribution gate
  email TEXT,
  contributed_to_library BOOLEAN NOT NULL DEFAULT FALSE,
  sector TEXT, -- Self-reported. Optional. Used in library filters.

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diagnostic_results_contributed
  ON diagnostic_results (contributed_to_library) WHERE contributed_to_library = TRUE;

CREATE INDEX IF NOT EXISTS idx_diagnostic_results_stage_role
  ON diagnostic_results (company_stage, role_type) WHERE contributed_to_library = TRUE;

CREATE INDEX IF NOT EXISTS idx_diagnostic_results_created_at
  ON diagnostic_results (created_at DESC);


-- ============================================================
-- Public library view: only contributed entries, no PII
-- ============================================================
CREATE OR REPLACE VIEW public_library AS
SELECT
  id,
  company_stage,
  role_type,
  region,
  align_score,
  attract_score,
  assess_score,
  close_score,
  onboard_score,
  worst_leak,
  sector,
  created_at
FROM diagnostic_results
WHERE contributed_to_library = TRUE;


-- ============================================================
-- Question aggregates: peer benchmarking data
-- ============================================================
-- Used for the inline "X% of [stage] founders also answered [response]" callout.
-- Refreshes nightly via Supabase Edge Function or pg_cron.

CREATE MATERIALIZED VIEW IF NOT EXISTS question_aggregates AS
SELECT
  dr.company_stage,
  dr.role_type,
  (answer ->> 'questionId') AS question_id,
  (answer ->> 'response') AS response,
  COUNT(*) AS n
FROM diagnostic_results dr,
     jsonb_array_elements(dr.answers) AS answer
WHERE dr.contributed_to_library = TRUE
GROUP BY dr.company_stage, dr.role_type, (answer ->> 'questionId'), (answer ->> 'response');

CREATE UNIQUE INDEX IF NOT EXISTS idx_question_aggregates_unique
  ON question_aggregates (company_stage, role_type, question_id, response);

-- Refresh the materialised view (call from a scheduled job daily):
-- REFRESH MATERIALIZED VIEW CONCURRENTLY question_aggregates;


-- ============================================================
-- Row-Level Security (RLS)
-- ============================================================

-- Enable RLS on the main table.
ALTER TABLE diagnostic_results ENABLE ROW LEVEL SECURITY;

-- Anon role can insert (to allow users to submit their diagnostic without auth).
CREATE POLICY "Anyone can insert their diagnostic"
  ON diagnostic_results
  FOR INSERT
  TO anon
  WITH CHECK (TRUE);

-- Anon role can select only their own row by id (for fetching the result page).
-- We pass the id back to the client after insert; the client uses it to look up.
CREATE POLICY "Anyone can read their own diagnostic by id"
  ON diagnostic_results
  FOR SELECT
  TO anon
  USING (TRUE);

-- Service role (server-side) has full access by default.


-- ============================================================
-- Helper functions
-- ============================================================

-- Get peer-benchmark percentages for a single question.
-- Called from API route during the diagnostic flow.
CREATE OR REPLACE FUNCTION get_peer_benchmark(
  p_company_stage TEXT,
  p_role_type TEXT,
  p_question_id TEXT
)
RETURNS TABLE (
  response TEXT,
  percentage NUMERIC
) AS $$
DECLARE
  total INT;
BEGIN
  SELECT SUM(n) INTO total
  FROM question_aggregates
  WHERE company_stage = p_company_stage
    AND role_type = p_role_type
    AND question_id = p_question_id;

  IF total IS NULL OR total < 5 THEN
    -- Not enough data yet. Return nothing so the UI hides the benchmark.
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    qa.response,
    ROUND((qa.n::NUMERIC / total) * 100, 0) AS percentage
  FROM question_aggregates qa
  WHERE qa.company_stage = p_company_stage
    AND qa.role_type = p_role_type
    AND qa.question_id = p_question_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
