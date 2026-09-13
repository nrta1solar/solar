-- NRTA SOLAR ERP & CRM — PRODUCTION POSTGRESQL SCHEMA v15.0
-- BRANDING: NRTA SOLAR (Powered by AK TRADERS)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    mobile TEXT UNIQUE NOT NULL,
    email TEXT,
    pin_code TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('customer', 'sales', 'admin')) DEFAULT 'customer',
    sales_rep_code TEXT,
    referral_code TEXT UNIQUE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending_approval', 'rejected', 'suspended', 'blocked')),
    district TEXT,
    
    -- Technical Application
    consumer_id TEXT,
    sanctioned_load_kw NUMERIC(6,2),
    proposed_solar_kw NUMERIC(6,2),
    roof_type TEXT,
    roof_area_sqft NUMERIC(8,2),
    phase_type TEXT DEFAULT 'single',
    battery_needed BOOLEAN DEFAULT FALSE,
    customer_notes TEXT,
    
    -- Technical Checklist
    dcr_certified BOOLEAN DEFAULT FALSE,
    survey_verified BOOLEAN DEFAULT FALSE,
    discom_sanctioned BOOLEAN DEFAULT FALSE,
    net_meter_installed BOOLEAN DEFAULT FALSE,
    subsidy_disbursed BOOLEAN DEFAULT FALSE,
    
    pipeline_step INT DEFAULT 1 CHECK (pipeline_step BETWEEN 1 AND 8),
    is_completed BOOLEAN DEFAULT FALSE,
    google_drive_synced BOOLEAN DEFAULT FALSE,
    signature_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DYNAMIC PRICING MATRIX
CREATE TABLE IF NOT EXISTS public.pricing_matrix (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name TEXT NOT NULL,
    item_price NUMERIC(10,2) NOT NULL,
    category TEXT DEFAULT 'Solar & Inverter',
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVOICES & MANUAL QUOTATIONS
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number TEXT UNIQUE NOT NULL,
    business_header TEXT DEFAULT 'NRTA SOLAR (Powered by AK TRADERS)',
    gstin TEXT DEFAULT '16AAXFA9876Q1ZB',
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL CHECK (doc_type IN ('TAX_INVOICE', 'MANUAL_QUOTATION')),
    items JSONB NOT NULL,
    sub_total NUMERIC(12,2) NOT NULL,
    cgst_amount NUMERIC(10,2) DEFAULT 0,
    sgst_amount NUMERIC(10,2) DEFAULT 0,
    grand_total NUMERIC(12,2) NOT NULL,
    terms_conditions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8-SLOT CUSTOMER DOCUMENTS
CREATE TABLE IF NOT EXISTS public.customer_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    slot_name TEXT NOT NULL,
    file_data TEXT NOT NULL,
    file_name TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GALLERY ITEMS
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'Rooftop Solar',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WEBSITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    primary_phone TEXT DEFAULT '+91 98634 02515',
    secondary_phone TEXT DEFAULT '+91 98765 43210',
    support_email TEXT DEFAULT 'contact@nrtasolar.com',
    office_address TEXT DEFAULT 'NRTA Solar (AK TRADERS), Udaipur, Gomati Tripura - 799120',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
