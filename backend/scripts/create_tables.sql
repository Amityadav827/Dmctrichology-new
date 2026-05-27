-- Single-document CMS sections table (replaces hero, settings, topbar, header, etc.)
CREATE TABLE IF NOT EXISTS public.cms_sections (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.cms_sections DISABLE ROW LEVEL SECURITY;

-- Service details (38 complex documents)
CREATE TABLE IF NOT EXISTS public.service_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.service_details DISABLE ROW LEVEL SECURITY;

-- Service cards (37 documents)
CREATE TABLE IF NOT EXISTS public.service_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT DEFAULT '',
  slug TEXT UNIQUE,
  image TEXT DEFAULT '',
  rating NUMERIC DEFAULT 4.9,
  duration TEXT DEFAULT '',
  short_description TEXT DEFAULT '',
  category TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.service_cards DISABLE ROW LEVEL SECURITY;

-- Science consultation leads
CREATE TABLE IF NOT EXISTS public.science_consultation_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  mobile TEXT,
  email TEXT,
  service TEXT,
  appointment_date TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.science_consultation_leads DISABLE ROW LEVEL SECURITY;
