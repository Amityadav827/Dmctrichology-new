# Required Environment Variables

This file documents variables discovered from source code and existing `.env.example` files.

No real secrets are included here.

## Backend

Location for local development: `backend/.env`

Deployment location: Render dashboard environment variables.

### `NODE_ENV`

- Required: Recommended
- Purpose: Controls production/development behavior such as logging and error stack output.
- Example: `development` or `production`

### `PORT`

- Required: Optional
- Purpose: Selects backend HTTP port. Code defaults to `4000`.
- Local recommendation: `10000`, because admin and website local fallbacks call `http://localhost:10000/api`.
- Example: `10000`

### `SUPABASE_URL`

- Required: Yes
- Purpose: Supabase project URL used by backend database and storage client.
- Example format: `https://your-project-ref.supabase.co`

### `SUPABASE_SERVICE_KEY`

- Required: Yes
- Purpose: Service role key used by backend for Supabase table and storage access.
- Example format: `eyJ...`
- Secret: Yes. Never expose in browser env variables.

### `JWT_SECRET`

- Required: Yes
- Purpose: Signs and verifies admin authentication tokens.
- Example format: `a-long-random-secret-string`
- Secret: Yes.

### `JWT_EXPIRES_IN`

- Required: Optional
- Purpose: JWT token lifetime.
- Default in code: `7d`
- Example: `7d`

### `EMAIL_USER`

- Required: Required for forgot-password email
- Purpose: Gmail SMTP username/sender for password reset mail.
- Example format: `name@example.com`
- Secret: Usually not secret by itself, but keep deployment config private.

### `EMAIL_PASS`

- Required: Required for forgot-password email
- Purpose: Gmail SMTP app password.
- Example format: `xxxx xxxx xxxx xxxx`
- Secret: Yes.

### `CLOUDINARY_CLOUD_NAME`

- Required: Optional/feature-specific
- Purpose: Cloudinary SDK configuration. Most observed active upload flows use Supabase Storage, but Cloudinary utility still exists.
- Example format: `your_cloud_name`

### `CLOUDINARY_API_KEY`

- Required: Optional/feature-specific
- Purpose: Cloudinary SDK API key.
- Example format: `123456789012345`
- Secret: Yes.

### `CLOUDINARY_API_SECRET`

- Required: Optional/feature-specific
- Purpose: Cloudinary SDK API secret.
- Example format: `your_cloudinary_api_secret`
- Secret: Yes.

### `MONGO_URI`

- Required: Not required for current backend `server.js` startup; required by legacy migration/debug scripts.
- Purpose: MongoDB connection for old migration/debug scripts.
- Example format: `mongodb+srv://username:password@cluster.example.com/database?retryWrites=true&w=majority`
- Secret: Yes.

### `MONGODB_URI`

- Required: Only for root `seed_services.js`
- Purpose: Legacy root seed script uses this spelling instead of `MONGO_URI`.
- Example format: `mongodb+srv://username:password@cluster.example.com/database?retryWrites=true&w=majority`
- Secret: Yes.

## Admin Frontend

Location for local development: `frontend/.env`

Deployment location: Vercel project for the admin dashboard.

### `VITE_API_URL`

- Required: Recommended
- Purpose: Backend API base URL used by admin dashboard.
- Local example: `http://localhost:10000/api`
- Production example format: `https://your-backend.example.com/api`

### `VITE_FRONTEND_URL`

- Required: Recommended for CMS preview links
- Purpose: Public website base URL used by admin preview helpers.
- Local example: `http://localhost:3000`
- Production example format: `https://your-website.example.com`

### `NEXT_PUBLIC_SITE_URL`

- Required: Optional/compatibility
- Purpose: Admin config reads this as a fallback for frontend URL, although Vite apps generally expose only `VITE_` variables to client code.
- Example format: `https://your-website.example.com`

## Website Frontend

Location for local development: `website-frontend/.env.local`

Deployment location: Vercel project for the public website.

### `NEXT_PUBLIC_API_URL`

- Required: Recommended
- Purpose: Backend API base URL used by the public website.
- Local example: `http://localhost:10000/api`
- Production example format: `https://your-backend.example.com/api`

### `NEXT_PUBLIC_FRONTEND_URL`

- Required: Recommended for SEO
- Purpose: Canonical site URL used by sitemap, robots, and blog metadata.
- Local example: `http://localhost:3000`
- Production example format: `https://your-website.example.com`

### `NODE_ENV`

- Required: Set automatically by Next/npm scripts
- Purpose: Some API fallback code checks whether the website is in development mode.
- Example: `development` or `production`

## External Services Needed

- Supabase project with required tables.
- Supabase Storage buckets:
  - `images`
  - `videos`
- SMTP/Gmail app password for forgot-password.
- Optional Cloudinary account if any Cloudinary upload utility is used.
- Optional MongoDB connection for migration/debug scripts only.
