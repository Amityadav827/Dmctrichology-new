# Supabase Audit Report

Repository: `https://github.com/ahlawatgaurav/Dmctrichology`

Local workspace: `C:\Users\amity\Dmctrichology-ahlawatgaurav`

Audit mode: inspection only. No code, SQL, storage, or configuration changes were made.

## Current Supabase Verification Status

Actual remote Supabase resources could not be verified from the current local environment.

Reason:

- `backend/.env` does not exist.
- `frontend/.env` does not exist.
- `website-frontend/.env.local` does not exist.
- The running backend was started with placeholder values:
  - `SUPABASE_URL=https://placeholder.supabase.co`
  - `SUPABASE_SERVICE_KEY=placeholder-service-key`
- Backend logs show Supabase requests failing with:

```text
TypeError: fetch failed
getaddrinfo ENOTFOUND placeholder.supabase.co
```

Therefore, this report distinguishes:

- resources referenced by code
- resources defined by checked-in SQL
- resources that appear missing from migrations
- resources that cannot be confirmed until real Supabase credentials are supplied

## Supabase Client Files

Main backend client:

- `backend/config/supabase.js`

Storage upload helper:

- `backend/utils/uploadToSupabase.js`

Upload middleware:

- `backend/middleware/uploadMiddleware.js`

Supabase utility/migration/seed scripts:

- `backend/checkSupabaseSchema.js`
- `backend/test-supabase.js`
- `backend/migrateMongoToSupabase.js`
- `backend/scripts/migrate_to_supabase.js`
- `backend/scripts/seed_data.js`
- `backend/scripts/seed_services.js`

Supabase metadata/tooling:

- `.mcp.json`
- `supabase/.temp/`

## Supabase Server Files

Backend routes/controllers use Supabase from server-side code only. Browser apps call the Express API rather than connecting directly to Supabase.

Important server areas:

- `backend/server.js`
- `backend/routes/`
- `backend/controllers/`
- `backend/middleware/authMiddleware.js`
- `backend/utils/roleHelpers.js`
- `backend/utils/uploadToSupabase.js`

## Existing Tables Used by Code

The following table names are referenced by code through Supabase `.from(...)` calls:

```text
appointments
blog_categories
blog_comments
blogs
callbacks
cms_sections
contacts
gallery
menu_operations
menus
newsletter_subscribers
operations
pages
redirects
result_categories
result_inner
robots
roles
science_consultation_leads
second_categories
seo_pages
service_cards
service_categories
service_details
service_faqs
services
sitemaps
testimonials
users
video_categories
videos
```

These are "used by code"; actual existence in the remote Supabase project is unverified without real credentials.

## Tables Defined by Checked-In SQL

The checked-in SQL files create or patch these tables:

From `backend/supabase_setup.sql`:

- `newsletter_subscribers`
- `callbacks`
- `contacts`
- `appointments`

From `backend/supabase_redirects_schema.sql`:

- `redirects`

From `backend/supabase_newsletter_schema.sql`:

- `newsletter_subscribers`

From `backend/scripts/create_tables.sql`:

- `cms_sections`
- `service_details`
- `service_cards`
- `science_consultation_leads`

## Missing Table Migrations

These tables are referenced by code but do not appear to be created by the checked-in SQL files inspected:

```text
blog_categories
blog_comments
blogs
gallery
menu_operations
menus
operations
pages
result_categories
result_inner
robots
roles
second_categories
seo_pages
service_categories
service_faqs
services
sitemaps
testimonials
users
video_categories
videos
```

They may already exist in the live Supabase database, but the current repository does not contain complete create-table migrations for them.

## Existing Buckets Used by Code

The code dynamically selects Supabase Storage buckets in `backend/utils/uploadToSupabase.js`:

```text
images
videos
```

Selection logic:

- MIME type starts with `video/` -> `videos`
- all other allowed image MIME types -> `images`

Actual bucket existence is unverified without real Supabase credentials.

## Missing Buckets

Required buckets that must exist in Supabase Storage:

```text
images
videos
```

No checked-in Supabase storage migration or bucket creation script was found for these buckets.

## Storage Usage

Upload pipeline:

- `backend/middleware/uploadMiddleware.js`
  - uses Multer memory storage
  - allows `image/*` and `video/*`
  - file size limit: 50 MB

- `backend/utils/uploadToSupabase.js`
  - uploads buffer to Supabase Storage
  - uses folder prefixes
  - returns public URL using `getPublicUrl`

Observed storage folders/prefixes:

```text
about_us_testimonials
blogs
dr_nandani_assets
dr_nivedita_assets
gallery
results
services
settings
videos/files
videos/thumbnails
```

## Upload Areas Depending on Supabase Storage

Image uploads:

- About Us testimonial images
- About Dr Nandani images
- About Dr Nivedita images
- Blog image and banner image
- Gallery images
- Result images
- Site logo/favicon
- Service detail images
- Video thumbnails

Video uploads:

- Gallery videos
- Video module uploaded files

Blog uploads:

- `blogImage`
- `bannerImage`
- rich-editor/gallery image insertion depends on upload/gallery APIs

CMS uploads:

- Doctor CMS images
- About CMS testimonial images
- Service details CMS images
- Website settings logo/favicon
- Virtual/gallery/video-related CMS uploads

## Storage Policies Required

Because uploads are performed server-side using `SUPABASE_SERVICE_KEY`, service role access can bypass RLS for storage object writes.

However, the frontend uses returned public URLs. Therefore one of these must be true:

1. Buckets are public, or
2. Storage policies allow public read access to objects in `images` and `videos`, or
3. The app must use signed URLs instead of public URLs.

Current code expects public URLs from:

```js
supabase.storage.from(bucketName).getPublicUrl(filePath)
```

Required storage setup:

- Create bucket `images`
- Create bucket `videos`
- Allow service role inserts/updates/deletes
- Allow public read access if using `getPublicUrl`
- Keep max upload size compatible with 50 MB backend limit

Suggested policy shape, to be applied only after project-owner approval:

```sql
-- If buckets are private, public read policy is needed for frontend display.
CREATE POLICY "Public read images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Public read videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

-- Service role normally bypasses RLS; explicit write policies may be unnecessary
-- for backend service-role uploads.
```

## RLS Requirements

Current SQL posture:

- `newsletter_subscribers`: RLS disabled
- `callbacks`: RLS disabled
- `contacts`: RLS disabled
- `appointments`: RLS disabled
- `cms_sections`: RLS disabled
- `service_details`: RLS disabled
- `service_cards`: RLS disabled
- `science_consultation_leads`: RLS disabled
- `redirects`: RLS enabled with broad policy

`backend/supabase_redirects_schema.sql` defines:

```sql
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Service role full access" ON public.redirects
    FOR ALL USING (true) WITH CHECK (true);
```

Risk:

- The policy condition `USING (true)` / `WITH CHECK (true)` is broad.
- If anon/authenticated clients ever access `redirects` directly, this would be too permissive.
- In the current architecture, browser apps call Express, and Express uses the service role key server-side.

Tables referenced by code but missing checked-in RLS decisions:

```text
blog_categories
blog_comments
blogs
gallery
menu_operations
menus
operations
pages
result_categories
result_inner
robots
roles
second_categories
seo_pages
service_categories
service_faqs
services
sitemaps
testimonials
users
video_categories
videos
```

Recommended RLS approach for current architecture:

- Keep Supabase service role key server-only.
- Do not expose `SUPABASE_SERVICE_KEY` to frontend apps.
- If all Supabase access remains through Express, either:
  - disable RLS on backend-managed tables, or
  - enable RLS and create policies that permit only service-role access.
- For public forms, still route through backend with rate limiting rather than direct browser Supabase access.

## Admin Authentication Flow

Backend files:

- `backend/routes/authRoutes.js`
- `backend/controllers/authController.js`
- `backend/middleware/authMiddleware.js`
- `backend/utils/generateToken.js`
- `backend/utils/roleHelpers.js`

Tables required:

- `users`
- `roles`

Flow:

1. Admin login posts email/password to `/api/auth/login`.
2. Backend reads `users` joined with `roles`.
3. Password is verified using bcrypt.
4. User must have status `active`.
5. Joined role must be `admin`.
6. Backend signs JWT using `JWT_SECRET`.
7. Frontend stores token as `dmc_admin_token`.
8. API client sends `Authorization: Bearer <token>`.
9. `protect` middleware verifies token, fetches user from `users` joined to `roles`, and attaches `req.user`.
10. `adminOnly` checks `req.user.role.name === "admin"`.

Current local status:

- Missing-token path verified: `/api/auth/me` returns `401`.
- Real login cannot be verified because Supabase credentials and real `users`/`roles` data are unavailable.

Security note:

- `backend/middleware/authMiddleware.js` logs `JWT_SECRET` during verification. This should not be present in production logs.

## CMS Authentication Flow

CMS runs in `frontend/` and calls backend APIs.

Protected CMS/API routes use:

- `protect`
- `adminOnly`
- `checkPermission`

Examples:

- dashboard stats
- newsletter admin routes
- about/footer/home CMS updates
- page composition updates
- upload routes requiring `protect`
- service detail save/upload

CMS token handling:

- Token is stored in localStorage key `dmc_admin_token`.
- `frontend/src/api/client.js` injects Bearer token into requests.
- On token-related `401`, frontend removes stored auth and redirects to `/login`.

Current local status:

- Admin/CMS UI loads.
- Protected API actions cannot be fully validated without a real admin user and JWT secret.

## Content APIs Depending on Supabase

Major content APIs backed by Supabase include:

```text
/api/site-settings
/api/topbar
/api/header
/api/footer
/api/hero
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
/api/service-page-settings
/api/service-listing-cards
/api/service-listing-categories
/api/details-page
/api/service-details
/api/contact-page
/api/blog-page
/api/blogs
/api/blog-comments
/api/gallery
/api/videos
/api/results
/api/seo
/api/redirects
```

Current local status:

- Many content APIs return `500` with placeholder Supabase host.
- `/api/service-details` returned `200`, apparently using fallback behavior.

## Missing Resources Summary

Cannot confirm remote existence, but based on checked-in migrations the following are missing from repository SQL:

Missing table migrations:

```text
blog_categories
blog_comments
blogs
gallery
menu_operations
menus
operations
pages
result_categories
result_inner
robots
roles
second_categories
seo_pages
service_categories
service_faqs
services
sitemaps
testimonials
users
video_categories
videos
```

Missing bucket migrations/scripts:

```text
images
videos
```

Missing policy migrations:

- Storage public-read policies for `images` and `videos`, if buckets are private.
- Table RLS/service-role policy definitions for tables not covered by current SQL.

Missing local credentials:

```text
SUPABASE_URL
SUPABASE_SERVICE_KEY
JWT_SECRET
EMAIL_USER
EMAIL_PASS
```

## Required SQL Migrations

Existing checked-in SQL covers only part of the required schema.

Already present:

- lead/contact/newsletter basics
- redirects
- `cms_sections`
- `service_details`
- `service_cards`
- `science_consultation_leads`

Required additional migration coverage:

- Admin auth:
  - `users`
  - `roles`
- Admin permissions/navigation:
  - `menus`
  - `operations`
  - `menu_operations`
- Blog system:
  - `blogs`
  - `blog_categories`
  - `blog_comments`
- Gallery/video/results:
  - `gallery`
  - `videos`
  - `video_categories`
  - `result_categories`
  - `result_inner`
- Service catalog:
  - `services`
  - `service_categories`
  - `second_categories`
  - `service_faqs`
- SEO/content:
  - `seo_pages`
  - `sitemaps`
  - `robots`
  - `pages`
  - `sections`
  - `testimonials`

Before writing migrations, confirm the live Supabase schema to avoid duplicate or incompatible table definitions.

## Required Storage Buckets

Create/confirm these in Supabase:

```text
images
videos
```

Recommended folder organization already implied by code:

```text
images/about_us_testimonials/
images/blogs/
images/dr_nandani_assets/
images/dr_nivedita_assets/
images/gallery/
images/results/
images/services/
images/settings/
images/videos/thumbnails/
videos/videos/files/
```

Note:

- The helper chooses the bucket from MIME type, then appends folder names exactly as passed by controllers.
- For video files, folder `videos/files` is inside bucket `videos`.
- For thumbnails, folder `videos/thumbnails` is inside bucket `images`.

## Required Policies

Minimum policy requirements for current architecture:

1. Backend service role can read/write all required tables.
2. Backend service role can upload/read/delete storage objects as needed.
3. Public frontend can read returned storage public URLs.
4. Browser clients should not receive `SUPABASE_SERVICE_KEY`.

Table policy approach:

- If using service role through backend only, RLS can be disabled for backend-managed tables or enabled with service-role-only policies.
- Public inserts should remain backend-mediated because backend already has rate limiting.

Storage policy approach:

- If buckets are public: `getPublicUrl` works for display.
- If buckets are private: implement signed URL flow or add SELECT policies for public reads.

Suggested storage read policies, pending approval:

```sql
CREATE POLICY "Public read images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Public read videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');
```

## Actions Needed for a Complete Supabase Audit

1. Obtain real `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`.
2. Place them in `backend/.env` locally, without committing secrets.
3. Run a read-only schema inventory against Supabase:
   - list tables
   - list columns
   - list RLS status
   - list policies
   - list storage buckets
   - list storage policies
4. Compare live schema to code references in this report.
5. Only after confirmation, write missing migrations and policies in a separate approved task.

## Final Assessment

The project is strongly coupled to Supabase for:

- auth user/role lookup
- CMS content
- service pages
- blogs/comments
- galleries/videos/results
- leads/forms/newsletter
- SEO redirects/sitemap/robots
- uploads and public media URLs

The code references a larger Supabase schema than the repository currently defines in SQL. The immediate blocker is missing real Supabase credentials; the next blocker is confirming whether the live project already has the missing tables/buckets/policies.
