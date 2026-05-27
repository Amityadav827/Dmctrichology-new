-- DMC TRICHOLOGY - REDIRECTS TABLE
-- Run this in the Supabase SQL Editor to enable the Redirect Management page.

CREATE TABLE IF NOT EXISTS public.redirects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_url TEXT NOT NULL UNIQUE,
    destination_url TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT '301',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookup by the redirect middleware on every GET request
CREATE INDEX IF NOT EXISTS idx_redirects_source_url ON public.redirects (source_url);
CREATE INDEX IF NOT EXISTS idx_redirects_status ON public.redirects (status);

-- RLS: allow service role (backend) full access
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Service role full access" ON public.redirects
    FOR ALL USING (true) WITH CHECK (true);
