# Project Architecture

Repository: `https://github.com/ahlawatgaurav/Dmctrichology`

Local workspace: `C:\Users\amity\Dmctrichology-ahlawatgaurav`

Analyzed from:

- `LOCAL_SETUP_ANALYSIS.md`
- `ENV_REQUIRED.md`
- `LOCALHOST_VALIDATION.md`

## 1. Complete Folder Structure

Top-level structure:

```text
Dmctrichology-ahlawatgaurav/
  backend/
  frontend/
  website-frontend/
  scratch/
  supabase/
  .codex-local/
  .git/
  .eslintignore
  .gitignore
  .mcp.json
  .prettierignore
  ENV_REQUIRED.md
  LOCALHOST_VALIDATION.md
  LOCAL_SETUP_ANALYSIS.md
  package.json
  package-lock.json
  raw_page.html
  README.md
  render.yaml
  seed_services.js
  vercel.json
```

Primary backend structure:

```text
backend/
  config/
  controllers/
  data/
  middleware/
  models/
  routes/
  scripts/
  utils/
  package.json
  package-lock.json
  server.js
  supabase_setup.sql
  supabase_redirects_schema.sql
  supabase_newsletter_schema.sql
```

Primary admin structure:

```text
frontend/
  src/
    api/
    components/
    context/
    layouts/
    pages/
      cms/
    services/
    utils/
    App.jsx
    main.jsx
  index.html
  package.json
  package-lock.json
  postcss.config.js
  tailwind.config.js
  vercel.json
  vite.config.js
```

Primary website structure:

```text
website-frontend/
  public/
    icons/
    images/
  src/
    app/
    components/
    context/
    data/
    services/
    utils/
  .env.example
  AGENTS.md
  CLAUDE.md
  eslint.config.mjs
  jsconfig.json
  next.config.mjs
  package.json
  package-lock.json
  README.md
```

Auxiliary folders:

```text
scratch/
  audit_categories.js
  check-db.js
  check_faq.js
  force_update_faq.js
  test-endpoints.js

supabase/.temp/
  linked project/tooling metadata
```

## 2. Frontend App Path

Public website frontend:

- Path: `website-frontend/`
- Framework: Next.js app router
- Entry/layout: `website-frontend/src/app/layout.js`
- Home page: `website-frontend/src/app/page.js`
- Dev command: `npm run dev`
- Local port used: `3000`
- Local URL: `http://localhost:3000`

## 3. Backend App Path

Backend API:

- Path: `backend/`
- Framework: Express
- Entry file: `backend/server.js`
- Dev command: `npm run dev`
- Default code port: `4000`
- Local compatibility port used: `10000`
- Local URL: `http://localhost:10000`

## 4. CMS/Admin Path

Admin dashboard and CMS:

- Path: `frontend/`
- Framework: Vite + React
- Entry file: `frontend/src/main.jsx`
- Router file: `frontend/src/App.jsx`
- CMS pages path: `frontend/src/pages/cms/`
- Dev command: `npm run dev`
- Local port: `5173`
- Local URL: `http://localhost:5173`

## 5. Supabase Integration Files

Core Supabase client/config:

- `backend/config/supabase.js`

Supabase upload/storage:

- `backend/utils/uploadToSupabase.js`
- `backend/middleware/uploadMiddleware.js`

Supabase-backed backend controllers/routes:

- Most files under `backend/controllers/`
- Most files under `backend/routes/`

Supabase scripts:

- `backend/checkSupabaseSchema.js`
- `backend/test-supabase.js`
- `backend/migrateMongoToSupabase.js`
- `backend/scripts/migrate_to_supabase.js`
- `backend/scripts/seed_data.js`
- `backend/scripts/seed_services.js`

Supabase SQL/schema:

- `backend/supabase_setup.sql`
- `backend/supabase_redirects_schema.sql`
- `backend/supabase_newsletter_schema.sql`
- `backend/scripts/create_tables.sql`

Supabase project/tool metadata:

- `.mcp.json`
- `supabase/.temp/`

## 6. Environment Variable Locations

Backend local env:

- Expected local file: `backend/.env`
- Example file: `backend/.env.example`
- Deployment location: Render dashboard

Admin local env:

- Expected local file: `frontend/.env`
- Example file: `frontend/.env.example`
- Deployment location: Vercel admin project

Website local env:

- Expected local file: `website-frontend/.env.local`
- Example file: `website-frontend/.env.example`
- Deployment location: Vercel website project

Important variables:

- Backend: `NODE_ENV`, `PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `EMAIL_USER`, `EMAIL_PASS`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `MONGO_URI`, `MONGODB_URI`
- Admin: `VITE_API_URL`, `VITE_FRONTEND_URL`, optional/compat `NEXT_PUBLIC_SITE_URL`
- Website: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_FRONTEND_URL`, `NODE_ENV`

## 7. Main API Routes

Backend mounts the following major route groups in `backend/server.js`:

```text
/
/api/auth
/api/dashboard
/api/users
/api/roles
/api/menus
/api/menu
/api/operations
/api/operation
/api/menu-operations
/api/services
/api/blogs
/api/testimonials
/api/gallery
/api/contact
/api/contacts
/api/callbacks
/api/callback
/api/lead
/api/appointment
/api/appointments
/api/newsletter
/api/seo
/api/service-categories
/api/second-categories
/api/service-faqs
/api/result-categories
/api/results
/api/video-categories
/api/videos
/api/redirects
/api/pages
/api/blog-categories
/api/hero
/api/site-settings
/api/topbar
/api/header
/api/page-compositions
/api/about-us
/api/marquee-features
/api/why-choose-us
/api/results-slider
/api/grade-slider
/api/why-choose-dmc
/api/surgeons
/api/consultation
/api/reviews
/api/treatment-plan
/api/home-faq
/api/blogs-home
/api/press-media
/api/virtual-tour
/api/influencers
/api/science-dmc
/api/footer
/api/sections
/api/service-page-settings
/api/service-listing-cards
/api/service-listing-categories
/api/details-page
/api/service-details
/api/contact-page
/api/blog-page
/api/blog-comments
/api/science-consultations
/api/about-dr-nandani
/api/about-dr-nivedita
/robots.txt
```

Representative route files:

- `backend/routes/authRoutes.js`
- `backend/routes/blogRoutes.js`
- `backend/routes/galleryRoutes.js`
- `backend/routes/serviceDetailRoutes.js`
- `backend/routes/seoRoutes.js`
- `backend/routes/redirectRoutes.js`
- `backend/routes/newsletterRoutes.js`
- `backend/routes/aboutDrNandaniRoutes.js`
- `backend/routes/aboutDrNiveditaRoutes.js`

## 8. Main Page Routes

Website routes discovered:

```text
/
/about
/about/dr-nandani
/about-dr-nandani-dadu
/about-dr-nivedita-dadu
/blog
/blog/[slug]
/contact-us
/details/[slug]
/footer
/header
/influencers
/press-media
/service
/virtual-tour
/[slug]
/robots.txt
/sitemap.xml
```

Admin/CMS route groups:

```text
/login
/forgot-password
/reset-password/:token
/dashboard
/cms/about-us
/cms/homepage
/cms/hero
/cms/header
/cms/navigation
/cms/footer
/cms/page-builder/:slug
/cms/visual-builder/:slug
/cms/service-details
/cms/contact-page
/cms/blog-page
/cms/about-dr-nandani
/cms/about-dr-nivedita
/seo/redirects
/seo/sitemap
/seo/robots
/services/*
/results/*
/videos/*
/blogs
/comments
/gallery
/testimonials
/users/*
/leads/*
/settings/website
```

## 9. Storage Bucket Usage

Primary upload storage:

- Provider: Supabase Storage
- Upload utility: `backend/utils/uploadToSupabase.js`
- Multer middleware: `backend/middleware/uploadMiddleware.js`

Expected buckets:

- `images`
- `videos`

Observed upload-using areas:

- Gallery
- Blogs
- Results
- Site settings logo/favicon
- Videos
- Service details/images
- Doctor/about CMS image upload endpoints

Referenced image/media domains:

- `res.cloudinary.com`
- `fxzkbhhinbjbeegkjnae.supabase.co`
- `images.unsplash.com`
- YouTube embeds/thumbnails
- Google Maps embeds

Cloudinary:

- Config utility exists at `backend/utils/cloudinary.js`
- Active upload flow observed in validation is Supabase Storage first.

## 10. Database Schema Locations

Supabase schema/setup files:

- `backend/supabase_setup.sql`
- `backend/supabase_redirects_schema.sql`
- `backend/supabase_newsletter_schema.sql`
- `backend/scripts/create_tables.sql`

Migration/seed files:

- `backend/scripts/migrate_to_supabase.js`
- `backend/migrateMongoToSupabase.js`
- `backend/scripts/seed_data.js`
- `backend/scripts/seed_services.js`
- `backend/seed_services.js`
- `backend/seed_services_v2.js`
- root `seed_services.js`

Model-like legacy/data shape files:

- `backend/models/`

Runtime provider:

- Supabase is the primary runtime database provider.

Legacy provider:

- Mongo/Mongoose references remain for migration/debug/helper scripts.
- `backend/config/db.js` references Mongoose but is not invoked by current `backend/server.js`.

## 11. Current Feature Status

Confirmed running with placeholder env values:

- Backend process starts on `http://localhost:10000`
- Admin dashboard process starts on `http://localhost:5173`
- Website process starts on `http://localhost:3000`

Confirmed HTTP `200`:

- Backend health route `/`
- Admin routes: `/`, `/login`, `/dashboard`, `/cms/homepage`, `/seo/robots`
- Website routes: `/`, `/about`, `/service`, `/contact-us`, `/blog`, `/press-media`, `/virtual-tour`, `/influencers`, `/robots.txt`, `/sitemap.xml`
- Backend `/api/service-details`
- Backend `/robots.txt`

Expected auth behavior:

- `/api/auth/me` returns `401 Unauthorized` without valid token.

Blocked until real credentials/services are provided:

- Supabase-backed CMS data reads/writes
- Auth against real users
- Dynamic site content
- Blog data
- Sitemap generation that reads Supabase data
- Redirect middleware lookups
- Forms/leads
- Uploads
- Storage-managed images/videos
- Forgot-password email delivery

## 12. Broken or Incomplete Modules

Known broken/incomplete items:

- `backend npm run mongo` fails because `mongodb-memory-server` is not installed.
- Several legacy/debug/migration scripts reference Mongo/Mongoose dependencies that are not installed in backend `package.json`.
- Real Supabase credentials are missing, so Supabase-backed endpoints return `500` with placeholders.
- Supabase Storage buckets `images` and `videos` must exist before uploads can work.
- Forgot-password requires real `EMAIL_USER` and `EMAIL_PASS`.
- JWT flows require real `JWT_SECRET`.
- npm audit warnings exist:
  - Backend: 5 moderate vulnerabilities
  - Admin: 4 moderate, 1 high
  - Website: 2 moderate, 2 high
- Website `npm ls --depth=0` reports `@emnapi/runtime@1.10.0 extraneous`.
- Root Vercel config has a possible output-directory mismatch if Vercel project root is repository root while build output is generated under `website-frontend/.next`.

## Local Setup Summary

Use these ports for development:

```text
Backend API: http://localhost:10000
Admin/CMS:   http://localhost:5173
Website:     http://localhost:3000
```

Minimum credentials needed for full feature validation:

```text
SUPABASE_URL
SUPABASE_SERVICE_KEY
JWT_SECRET
EMAIL_USER
EMAIL_PASS
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_FRONTEND_URL
VITE_API_URL
VITE_FRONTEND_URL
```

Optional/legacy:

```text
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
MONGO_URI
MONGODB_URI
```
