# Localhost Validation

Repository: `https://github.com/ahlawatgaurav/Dmctrichology`

Local clone: `C:\Users\amity\Dmctrichology-ahlawatgaurav`

Commit validated: `cab4096 feat(service-pages): warm-empathetic template + scene-based architecture`

Date: 2026-06-01

## Commands Used

Clone:

```powershell
git clone https://github.com/ahlawatgaurav/Dmctrichology.git C:\Users\amity\Dmctrichology-ahlawatgaurav
```

Audit/discovery:

```powershell
rg --files
rg --files -g package.json -g package-lock.json -g yarn.lock -g pnpm-lock.yaml -g npm-shrinkwrap.json -g .nvmrc -g .node-version -g render.yaml -g vercel.json -g next.config.* -g vite.config.* -g "*.env*" -g Dockerfile -g docker-compose.yml -g "*.config.*"
rg -n "process\.env\.[A-Z0-9_]+|import\.meta\.env\.[A-Z0-9_]+|NEXT_PUBLIC_[A-Z0-9_]+|VITE_[A-Z0-9_]+|MONGO_URI|SUPABASE|DATABASE|POSTGRES|JWT|EMAIL|CLOUDINARY|PORT|NODE_ENV" backend frontend website-frontend scratch seed_services.js -g "!**/node_modules/**" -g "!**/.next/**"
rg -n "app\.use\(|app\.get\(|router\.(get|post|put|patch|delete|route)" backend\server.js backend\routes -g "*.js"
```

Dependency installation:

```powershell
npm install
cd backend; npm install
cd ..\frontend; npm install
cd ..\website-frontend; npm install
```

Version checks:

```powershell
node -v
npm -v
npm ls --depth=0
```

Local run commands used through process-level env variables:

```powershell
# backend
$env:PORT='10000'
$env:NODE_ENV='development'
$env:SUPABASE_URL='https://placeholder.supabase.co'
$env:SUPABASE_SERVICE_KEY='placeholder-service-key'
$env:JWT_SECRET='local-placeholder-not-a-secret'
$env:JWT_EXPIRES_IN='7d'
$env:EMAIL_USER='placeholder@example.com'
$env:EMAIL_PASS='placeholder-app-password'
npm run dev

# admin frontend
$env:VITE_API_URL='http://localhost:10000/api'
$env:VITE_FRONTEND_URL='http://localhost:3000'
npm run dev -- --host 127.0.0.1

# website frontend
$env:NEXT_PUBLIC_API_URL='http://localhost:10000/api'
$env:NEXT_PUBLIC_FRONTEND_URL='http://localhost:3000'
npm run dev -- -H 127.0.0.1 -p 3000
```

## Runtime Versions

- Node: `v24.10.0`
- npm: `11.6.2`

Repository engines require `node >=18.17.0`.

## Dependency Install Results

Root:

- Installed successfully.
- No vulnerabilities reported.

Backend:

- Installed successfully.
- 5 moderate vulnerabilities reported by npm.
- Warning: `multer@1.4.5-lts.2` is deprecated/vulnerable; no fix applied because that can change runtime behavior.

Admin frontend:

- Installed successfully.
- 5 vulnerabilities reported: 4 moderate, 1 high.
- No fix applied.

Website frontend:

- Installed successfully.
- 4 vulnerabilities reported: 2 moderate, 2 high.
- No fix applied.
- `npm ls --depth=0` reported `@emnapi/runtime@1.10.0 extraneous`.

Install side effect:

- `npm install` with npm 11 added `peer: true` metadata to package-lock files. Package versions did not change in the inspected diff.

## Running Local Ports

- Backend API: `http://localhost:10000`
- Admin dashboard/CMS: `http://localhost:5173`
- Website frontend: `http://localhost:3000`

Observed listeners:

- `10000` backend Node process
- `5173` Vite admin Node process
- `3000` Next website Node process

## Confirmed Working Locally

Backend:

- `GET http://127.0.0.1:10000/` returned `200`.
- Response body confirmed API health:

```json
{"success":true,"message":"🚀 DMC Trichology API Running Successfully","env":"development"}
```

Admin frontend:

- `GET http://127.0.0.1:5173/` returned `200`.
- `GET /login` returned `200`.
- `GET /dashboard` returned `200`.
- `GET /cms/homepage` returned `200`.
- `GET /seo/robots` returned `200`.

Website frontend:

- `GET /` returned `200`.
- `GET /about` returned `200`.
- `GET /service` returned `200`.
- `GET /contact-us` returned `200`.
- `GET /blog` returned `200`.
- `GET /press-media` returned `200`.
- `GET /virtual-tour` returned `200`.
- `GET /influencers` returned `200`.
- `GET /robots.txt` returned `200`.
- `GET /sitemap.xml` returned `200`.

## Routes Discovered

### Website Pages

- `/`
- `/about`
- `/about/dr-nandani`
- `/about-dr-nandani-dadu`
- `/about-dr-nivedita-dadu`
- `/blog`
- `/blog/[slug]`
- `/contact-us`
- `/details/[slug]`
- `/footer`
- `/header`
- `/influencers`
- `/press-media`
- `/service`
- `/virtual-tour`
- `/[slug]`
- `/robots.txt`
- `/sitemap.xml`

### Admin Routes

Representative discovered route groups:

- Auth: `/login`, `/forgot-password`, `/reset-password/:token`
- Dashboard: `/dashboard`
- CMS: `/cms/about-us`, `/cms/homepage`, `/cms/hero`, `/cms/header`, `/cms/navigation`, `/cms/footer`, `/cms/page-builder/:slug`, `/cms/visual-builder/:slug`, `/cms/service-details`, `/cms/contact-page`, `/cms/blog-page`, `/cms/about-dr-nandani`, `/cms/about-dr-nivedita`
- SEO: `/seo/redirects`, `/seo/sitemap`, `/seo/robots`
- Data/admin: services, results, videos, blogs, comments, gallery, testimonials, users, roles, permissions, menus, operations, website settings
- Leads: callback, contact, treatment enquiries, appointment, science consultation, doctor leads, newsletter

### Backend APIs

Mounted API groups include:

- `/api/auth`
- `/api/dashboard`
- `/api/users`
- `/api/roles`
- `/api/menus`
- `/api/menu`
- `/api/operations`
- `/api/operation`
- `/api/menu-operations`
- `/api/services`
- `/api/blogs`
- `/api/testimonials`
- `/api/gallery`
- `/api/contact`
- `/api/contacts`
- `/api/callbacks`
- `/api/callback`
- `/api/lead`
- `/api/appointment`
- `/api/appointments`
- `/api/newsletter`
- `/api/seo`
- `/api/service-categories`
- `/api/second-categories`
- `/api/service-faqs`
- `/api/result-categories`
- `/api/results`
- `/api/video-categories`
- `/api/videos`
- `/api/redirects`
- `/api/pages`
- `/api/blog-categories`
- `/api/hero`
- `/api/site-settings`
- `/api/topbar`
- `/api/header`
- `/api/page-compositions`
- `/api/about-us`
- `/api/marquee-features`
- `/api/why-choose-us`
- `/api/results-slider`
- `/api/grade-slider`
- `/api/why-choose-dmc`
- `/api/surgeons`
- `/api/consultation`
- `/api/reviews`
- `/api/treatment-plan`
- `/api/home-faq`
- `/api/blogs-home`
- `/api/press-media`
- `/api/virtual-tour`
- `/api/influencers`
- `/api/science-dmc`
- `/api/footer`
- `/api/sections`
- `/api/service-page-settings`
- `/api/service-listing-cards`
- `/api/service-listing-categories`
- `/api/details-page`
- `/api/service-details`
- `/api/contact-page`
- `/api/blog-page`
- `/api/blog-comments`
- `/api/science-consultations`
- `/api/about-dr-nandani`
- `/api/about-dr-nivedita`
- `/robots.txt`

## API Smoke Results

- `/` returned `200`.
- `/api/auth/me` returned `401 Unauthorized`, expected without a valid token.
- `/api/service-details` returned `200`.
- `/robots.txt` returned `200`.
- `/api/blogs` returned `500` with placeholder Supabase credentials.
- `/api/site-settings` returned `500` with placeholder Supabase credentials.
- `/api/seo/sitemap.xml` returned `500` with placeholder Supabase credentials.
- `/api/gallery` returned `401 Unauthorized`.

## Features Discovered

- Public website pages and dynamic route templates.
- Admin authentication, protected dashboard, roles, users, permissions.
- CMS modules for homepage, about, doctors, services, service details, blog page, contact page, visual/page builder, virtual tour, influencers, science at DMC, header/topbar/footer/navigation.
- Lead collection modules for callbacks, contact, appointments, treatment enquiries, science consultation, doctor pages, newsletter.
- Blog listing/detail/comment system.
- Service listing and service detail pages.
- Gallery, video, result, testimonial modules.
- SEO: redirects, sitemap, robots.
- Uploads through Multer and Supabase Storage.
- Email reset through Gmail SMTP/Nodemailer.
- Dynamic redirects through Supabase-backed redirect middleware.

## Broken / Blocked Features

Blocked by missing real Supabase credentials:

- Most CMS API reads/writes.
- Dynamic site settings, header/topbar/footer data.
- Blog data, sitemap generation, redirect middleware lookups.
- Authentication against real user records.
- Form submissions/leads.
- Uploads to Supabase Storage.
- Videos/images managed through storage.

Blocked by missing SMTP credentials:

- Forgot-password email delivery.

Blocked by missing JWT secret if not provided:

- Login/register token creation.
- Protected API verification.

Blocked by missing Supabase buckets:

- Image uploads require `images` bucket.
- Video uploads require `videos` bucket.

Broken helper script:

- `backend npm run mongo` fails with `Cannot find module 'mongodb-memory-server'`.
- Several legacy/debug/migration scripts reference Mongo/Mongoose dependencies that are not installed in backend `package.json`.

## Missing Credentials Required From Project Owner

- Real `SUPABASE_URL`
- Real `SUPABASE_SERVICE_KEY`
- Real `JWT_SECRET`
- Real `EMAIL_USER`
- Real `EMAIL_PASS`
- Optional Cloudinary credentials if Cloudinary upload utility must be used
- Optional MongoDB URI for migration/debug scripts

## Current Local Status

With placeholder env values:

- Backend process starts.
- Admin dashboard process starts.
- Website frontend process starts.
- Static/app-shell routes respond.
- Dynamic Supabase-dependent behavior is not fully functional until real credentials and storage buckets are supplied.
