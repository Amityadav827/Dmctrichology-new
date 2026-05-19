-- DMC TRICHOLOGY - BACKEND MIGRATION TO SUPABASE
-- SQL SETUP & SCHEMA PATCH SCRIPT (Singapore/Tokyo AWS Regional Hosts)
-- Running this script is completely non-destructive: it will patch existing tables or create new ones.

-- =========================================================================
-- 1. NEWSLETTER SUBSCRIBERS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    subscribed_to_updates BOOLEAN DEFAULT TRUE,
    source TEXT DEFAULT 'footer-newsletter',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 2. CALLBACKS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.callbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 3. CONTACTS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Schema Patch for Contacts (Ensures mobile and status columns are present)
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS mobile TEXT;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';

-- =========================================================================
-- 4. APPOINTMENTS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT NOT NULL,
    service TEXT NOT NULL,
    appointment_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Schema Patch for Appointments (Ensures message, status, and notes columns are present)
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS message TEXT DEFAULT '';
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';

-- =========================================================================
-- 5. PERFORMANCE INDEXES (Optimized query paths for search and dashboard ranges)
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_callbacks_mobile ON public.callbacks(mobile);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at);
CREATE INDEX IF NOT EXISTS idx_appointments_mobile ON public.appointments(mobile);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON public.appointments(created_at);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);

-- =========================================================================
-- 6. SECURITY DEFINITIONS (Row Level Security bypass)
-- =========================================================================
-- Disable RLS to allow public form insertions and unrestricted dashboard admin operations
ALTER TABLE public.newsletter_subscribers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.callbacks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;
