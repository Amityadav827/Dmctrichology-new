# Service Details Page Architecture

Scope: Service Details page only. This document is based on repository inspection and does not change application code.

## 1. Relevant Folder Structure

```text
Dmctrichology-ahlawatgaurav/
├── backend/
│   ├── config/
│   │   └── supabase.js
│   ├── controllers/
│   │   ├── serviceDetailController.js
│   │   └── serviceCardController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   └── ServiceDetail.js
│   ├── routes/
│   │   ├── serviceDetailRoutes.js
│   │   ├── serviceCardRoutes.js
│   │   └── serviceCategoryListingRoutes.js
│   ├── scripts/
│   │   ├── create_tables.sql
│   │   └── migrate_to_supabase.js
│   ├── utils/
│   │   ├── servicesDataFallback.js
│   │   └── uploadToSupabase.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/
│       │   ├── client.js
│       │   └── services.js
│       ├── components/
│       │   ├── ServiceSearchSelector.jsx
│       │   └── Sidebar.jsx
│       ├── pages/
│       │   └── cms/
│       │       ├── ServiceDetailCMS.jsx
│       │       ├── ServiceListingCMS.jsx
│       │       └── VisualLiveBuilder.jsx
│       └── App.jsx
└── website-frontend/
    └── src/
        ├── app/
        │   └── details/
        │       └── [slug]/
        │           ├── page.js
        │           ├── ServiceClassicTemplate.jsx
        │           ├── ServiceWarmTemplate.jsx
        │           └── serviceWarmTemplate.css
        ├── components/
        │   ├── DetailsBanner.jsx
        │   ├── ServiceIntro.jsx
        │   ├── ServiceContentBlock.jsx
        │   ├── ServiceBenefits.jsx
        │   ├── ServiceIdealCandidates.jsx
        │   ├── ServiceNotCandidates.jsx
        │   ├── ServiceTechniques.jsx
        │   ├── ServiceInfoBlocks.jsx
        │   ├── ServiceAftercare.jsx
        │   ├── ServiceWhyChooseUs.jsx
        │   ├── ServiceEditorialFaq.jsx
        │   ├── FaqEnquiry.jsx
        │   ├── ProcessSlider.jsx
        │   ├── BeforeAfterTreatment.jsx
        │   ├── IdealFrequency.jsx
        │   ├── FueProcedureSection.jsx
        │   ├── FueCostSection.jsx
        │   ├── FueOptingBenefitsSection.jsx
        │   ├── BodyHairIntroSection.jsx
        │   ├── BodyHairSuitableSection.jsx
        │   ├── HairTransplantInfoSection.jsx
        │   ├── HairTransplantWhyChooseSection.jsx
        │   ├── HairTransplantResultsSection.jsx
        │   ├── HairTransplantVideosSection.jsx
        │   ├── ServiceStoryOpener.jsx
        │   ├── ServiceEditorialExplainer.jsx
        │   ├── ServiceDoctorQuote.jsx
        │   ├── ServiceCandidacy.jsx
        │   ├── AboutDrNiveditaAssociations.jsx
        │   ├── AboutDrNiveditaFeaturedIn.jsx
        │   └── TestimonialSection.jsx
        └── data/
            └── servicesData.js
```

## 2. Frontend Website Architecture

Route:

- Public URL pattern: `/details/[slug]`
- Next.js file: `website-frontend/src/app/details/[slug]/page.js`
- Rendering mode: `dynamic = 'force-dynamic'`, `revalidate = 0`
- CSS loaded by the page: `service.css`, `details.css`, `serviceWarmTemplate.css`

Data loading:

- `fetchServiceData(slug)` calls `GET ${NEXT_PUBLIC_API_URL || https://dmctrichology-1.onrender.com/api}/service-details/${slug}` with `cache: 'no-store'`.
- If the API fails or returns no valid data, the page falls back to `website-frontend/src/data/servicesData.js`.
- If no service is found, `notFound()` is called.
- Special slug handling exists for `hair-transplant-cost-in-delhi`, with backend alias support to `hair-transplant-cost-in-india`.

Template selection:

- `service.templateVersion || service.data?.templateVersion` decides the frontend template.
- `warm-v2` renders `ServiceWarmTemplate`.
- All other values render `ServiceClassicTemplate`.

SEO handling:

- `generateMetadata({ params })` fetches the same service data.
- Metadata source: `service.seo`.
- `title`: `seo.metaTitle` or service/banner title fallback.
- `description`: `seo.metaDescription` or banner subtitle fallback.
- `canonical`: `seo.canonicalUrl` or `/details/${slug}`.
- `openGraph.images`: `seo.ogImage` when present.
- `seo.schemaScript` exists in the data model/CMS but is not rendered by the inspected page.

## 3. Backend Architecture

Mounted API prefix:

- `backend/server.js` mounts `serviceDetailRoutes` at `/api/service-details`.

Routes:

- `GET /api/service-details`
  - Controller: `getAllServiceDetails`
  - Purpose: dashboard metadata/listing.
- `GET /api/service-details/:slug`
  - Controller: `getServiceDetailBySlug`
  - Purpose: public website Service Details page.
- `PUT /api/service-details/:slug`
  - Controller: `saveServiceDetail`
  - Auth: protected by `protect`.
  - Purpose: CMS save.
- `POST /api/service-details/upload`
  - Auth: protected by `protect`.
  - Upload middleware: `upload.single("image")`.
  - Storage helper: `uploadToSupabase(req.file, "services")`.

Controller behavior:

- Primary data store: Supabase table `service_details`.
- Data shape: one row per service slug, with full page content stored as JSONB in `data`.
- Lookup candidates include aliases from `slugAliases`.
- If Supabase fetch fails or no record exists, fallback data comes from `backend/utils/servicesDataFallback.js`.
- Save logic upserts `{ slug, data, updated_at }` on conflict by `slug`.
- Save logic removes Mongoose-only fields and migrates legacy `intro.videos` into `intro.introMedia`.

Related backend APIs used by CMS:

- `GET /api/service-listing-cards`
- `POST /api/service-listing-cards`
- `PUT /api/service-listing-cards/:id`
- `GET /api/service-listing-categories`
- `GET /api/gallery?page=1&limit=200`
- `POST /api/contact` through the public enquiry form, with `source: "service-details-enquiry"`.

## 4. Supabase and Storage Usage

Supabase client:

- `backend/config/supabase.js`
- Uses `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`.

Tables directly involved:

- `service_details`
  - Main Service Details content.
  - Schema location: `backend/scripts/create_tables.sql`.
  - Legacy Mongoose schema reference: `backend/models/ServiceDetail.js`.
- `service_cards`
  - Service listing/card metadata and CMS selector source.
  - `serviceCardController` also joins detail-like values by reading `service_details.data`.
- `service_categories`
  - Used by service listing category API for CMS category selection.
- `gallery`
  - Used by Service Detail CMS media picker.
- `contacts`
  - Used by public enquiry form submissions.

Storage buckets:

- `images`
  - Used for images uploaded through Service Detail CMS.
  - Service Detail upload folder prefix: `services/`.
- `videos`
  - Used if a video MIME type is sent to `/service-details/upload`.
  - Same folder prefix: `services/`.

Upload architecture:

- `backend/middleware/uploadMiddleware.js` uses Multer memory storage and allows image/video MIME types.
- `backend/utils/uploadToSupabase.js` chooses the bucket by MIME type:
  - `video/*` -> `videos`
  - all accepted image types -> `images`
- Public URLs are returned using Supabase `getPublicUrl`.

## 5. CMS / Dashboard Architecture

Admin route:

- React route: `/cms/service-details`
- File: `frontend/src/pages/cms/ServiceDetailCMS.jsx`
- Route registration: `frontend/src/App.jsx`
- Protected with `ProtectedRoute permission="cms"`.

Service selection:

- Uses `GET /service-listing-cards`.
- Supports query param: `/cms/service-details?service={slug}`.
- Sidebar creates per-service subnav links using the same query param.
- `ServiceSearchSelector` is used for selecting the service to edit.

CMS data flow:

1. Load service cards from `/service-listing-cards`.
2. Resolve selected slug from URL query param.
3. Fetch service detail from `/service-details/:slug`.
4. Normalize missing/legacy fields in the CMS state.
5. User edits `data`.
6. Save sends `PUT /service-details/:slug` with `{ ...data, sectionsLayout }`.

CMS upload flow:

- Media upload in Service Detail CMS posts to `/service-details/upload`.
- The editor also supports choosing existing uploaded items from `/gallery?page=1&limit=200`.

CMS controlled fields:

- Most classic sections are editable from `ServiceDetailCMS.jsx`.
- `sectionsLayout` allows whole-section hide/show for classic template sections.
- Per-item `isVisible` and `sortOrder` are supported for many list-based sections.
- Reordering is implemented by moving array items in CMS state; rendered components also sort by `sortOrder` where implemented.

Additional editing paths:

- `frontend/src/pages/cms/VisualLiveBuilder.jsx` can persist inline edits for selected classic service-detail sections:
  - `details-banner`
  - `service-intro`
  - `process-slider`
  - `before-after-section`
  - `faq-enquiry-section`
  - `ideal-frequency-section`

## 6. Dynamic Content Architecture

### Classic Template

File: `website-frontend/src/app/details/[slug]/ServiceClassicTemplate.jsx`

Data source: `service` from `GET /api/service-details/:slug`, with `staticFallback` from `servicesData.js`.

Dynamic gates:

- Whole-section gate: `service.sectionsLayout`.
- Per-section component gates: many components return `null` when section `isVisible === false`.
- Per-item gates: many arrays filter items where `isVisible !== false`.
- Ordering: many arrays sort by `sortOrder`.

Service-specific rules:

- Hair cost slugs: `hair-transplant-cost-in-delhi`, `hair-transplant-cost-in-india`.
  - Hide ideal candidates, not candidates, techniques, info blocks, process, aftercare, why choose, transplant info, transplant why, ideal frequency, before/after.
  - Videos show only when `videosSection.showOnCostPage === true`.
- FUE slug: `fue-hair-transplant`.
  - Shows FUE-specific sections.
  - Hides aftercare and why-choose in classic template.
- Body hair slug: `body-hair-transplant-bht`.
  - Shows body-hair-specific sections.
- Transplant category/slugs:
  - Show transplant info/why sections.
  - Hide ideal frequency and before/after.

### Warm Template

File: `website-frontend/src/app/details/[slug]/ServiceWarmTemplate.jsx`

Data source: same `service` object.

Important difference:

- Warm template uses a fixed editorial order.
- It does not use `sectionsLayout`.
- It passes data to components that may self-hide only if the component implements its own `isVisible` logic.
- It includes some globally shared/hardcoded components such as testimonials.

Warm template content composition:

- `ServiceEditorialExplainer` is composed from `intro.longDescription`, `intro.shortDescription`, plus absorbed copy from `techniquesSection`, `infoBlocksSection`, `whyChooseUsSection`, and `hairTransplantInfoSection`.
- This preserves SEO/content surface while simplifying the visual page.

## 7. Section Inventory

### Classic Template Section Inventory

| # | Section | Component file | Data key | CMS controlled? | Dynamic? | API | Table | Media usage |
|---|---|---|---|---|---|---|---|---|
| 1 | Hero/banner | `DetailsBanner.jsx` | `banner` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | background/banner image |
| 2 | Intro/media | `ServiceIntro.jsx` | `intro`, `banner` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | `introMedia`, images/videos/thumbnails |
| 3 | Body Hair Intro | `BodyHairIntroSection.jsx` | `bodyHairIntroSection` | Yes | Yes, BHT-specific | `/api/service-details/:slug` | `service_details.data` | no primary media |
| 4 | Content Blocks | `ServiceContentBlock.jsx` | `contentBlocks` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | no primary media |
| 5 | Benefits | `ServiceBenefits.jsx` | `benefitsSection` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | section image, optional icons |
| 6 | FUE Procedure | `FueProcedureSection.jsx` | `fueProcedureSection` | Yes | Yes, FUE-specific | `/api/service-details/:slug` | `service_details.data` | image |
| 7 | Ideal Candidates | `ServiceIdealCandidates.jsx` | `idealCandidates` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | section image |
| 8 | Not Candidates | `ServiceNotCandidates.jsx` | `notCandidatesSection` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | no primary media |
| 9 | Body Hair Suitable | `BodyHairSuitableSection.jsx` | `bodyHairSuitableSection` | Yes | Yes, BHT-specific | `/api/service-details/:slug` | `service_details.data` | no primary media |
| 10 | FUE Cost | `FueCostSection.jsx` | `fueCostSection` | Yes | Yes, FUE-specific | `/api/service-details/:slug` | `service_details.data` | image |
| 11 | FUE Opting Benefits | `FueOptingBenefitsSection.jsx` | `fueOptingBenefitsSection` | Yes | Yes, FUE-specific | `/api/service-details/:slug` | `service_details.data` | no primary media |
| 12 | Techniques | `ServiceTechniques.jsx` | `techniquesSection` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | no primary media |
| 13 | Info Blocks | `ServiceInfoBlocks.jsx` | `infoBlocksSection` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | no primary media |
| 14 | Process | `ProcessSlider.jsx` | `process` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | step images |
| 15 | Aftercare | `ServiceAftercare.jsx` | `aftercareSection` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | no primary media |
| 16 | Why Choose Us | `ServiceWhyChooseUs.jsx` | `whyChooseUsSection` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | no primary media |
| 17 | Hair Transplant Info | `HairTransplantInfoSection.jsx` | `hairTransplantInfoSection` | Yes | Yes, transplant-specific | `/api/service-details/:slug` | `service_details.data` | no primary media |
| 18 | Hair Transplant Why | `HairTransplantWhyChooseSection.jsx` | `hairTransplantWhyChooseSection` | Yes | Yes, transplant-specific | `/api/service-details/:slug` | `service_details.data` | image passed from benefits/ideal fallback |
| 19 | Ideal Frequency | `IdealFrequency.jsx` | `idealFrequency` | Yes | Yes, hidden for transplant category | `/api/service-details/:slug` | `service_details.data` | CTA image |
| 20 | Before/After Checklist | `BeforeAfterTreatment.jsx` | `beforeAfter` | Yes | Yes, hidden for transplant category | `/api/service-details/:slug` | `service_details.data` | before/after images |
| 21 | Editorial FAQ | `ServiceEditorialFaq.jsx` | `editorialFaqSection`, `googleReviewCta` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | static review image inside component |
| 22 | Results | `HairTransplantResultsSection.jsx` | `resultsSection` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | before/after result images |
| 23 | Videos | `HairTransplantVideosSection.jsx` | `videosSection` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | thumbnails and iframe video URLs |
| 24 | FAQ + Enquiry | `FaqEnquiry.jsx` | `faqEnquiry`, `enquirySection` | Yes | Yes | `/api/service-details/:slug`, submit to `/api/contact` | `service_details.data`, `contacts` | no upload media |

### Warm Template Section Inventory

| # | Section | Component file | Data key | CMS controlled? | Dynamic? | API | Table | Media usage |
|---|---|---|---|---|---|---|---|---|
| 1 | Cinematic Hero | `DetailsBanner.jsx` | `banner` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | background/banner image |
| 2 | Trust microbar associations | `AboutDrNiveditaAssociations.jsx` | `associations` | Partial/unclear in ServiceDetailCMS | Yes if data exists | `/api/service-details/:slug` | `service_details.data` | association logos |
| 3 | Trust microbar featured in | `AboutDrNiveditaFeaturedIn.jsx` | `featuredIn` | Partial/unclear in ServiceDetailCMS | Yes if data exists | `/api/service-details/:slug` | `service_details.data` | publication logos |
| 4 | Story Opener | `ServiceStoryOpener.jsx` | `storyOpener` | Not fully exposed in inspected ServiceDetailCMS | Yes if data exists | `/api/service-details/:slug` | `service_details.data` | no primary media |
| 5 | Editorial Explainer | `ServiceEditorialExplainer.jsx` | composed from `intro` and legacy sections | Indirectly | Yes | `/api/service-details/:slug` | `service_details.data` | banner image from intro/banner |
| 6 | Doctor Quote | `ServiceDoctorQuote.jsx` | `doctorQuote` | Not fully exposed in inspected ServiceDetailCMS | Yes if data exists | `/api/service-details/:slug` | `service_details.data` | doctor image if supported by component data |
| 7 | Candidacy | `ServiceCandidacy.jsx` | `idealCandidates`, `notCandidatesSection` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | depends on component/data |
| 8 | Journey/Process | `ProcessSlider.jsx` | `process` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | step images |
| 9 | Real Results | `BeforeAfterTreatment.jsx` | `beforeAfter` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | before/after images |
| 10 | Testimonials | `TestimonialSection.jsx` | global/internal review data | No, not ServiceDetailCMS-specific | Partly dynamic via its own CMS/global logic | not service-detail-specific | likely `cms_sections` via reviews CMS | review/video images |
| 11 | Aftercare | `ServiceAftercare.jsx` | `aftercareSection` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | no primary media |
| 12 | Editorial FAQ | `ServiceEditorialFaq.jsx` | `editorialFaqSection`, `googleReviewCta` | Yes | Yes | `/api/service-details/:slug` | `service_details.data` | static review image |
| 13 | Warm Enquiry CTA | `FaqEnquiry.jsx` | `faqEnquiry`, `enquirySection` | Yes | Yes | `/api/service-details/:slug`, submit to `/api/contact` | `service_details.data`, `contacts` | no upload media |

## 8. Editable vs Hardcoded Sections

Clearly CMS controlled in `ServiceDetailCMS.jsx`:

- `banner`
- `intro`
- `contentBlocks`
- `benefitsSection`
- `fueProcedureSection`
- `fueCostSection`
- `fueOptingBenefitsSection`
- `bodyHairIntroSection`
- `bodyHairSuitableSection`
- `idealCandidates`
- `notCandidatesSection`
- `techniquesSection`
- `infoBlocksSection`
- `aftercareSection`
- `whyChooseUsSection`
- `editorialFaqSection`
- `googleReviewCta`
- `resultsSection`
- `videosSection`
- `enquirySection`
- `process`
- `idealFrequency`
- `beforeAfter`
- `faqEnquiry`
- `hairTransplantInfoSection`
- `hairTransplantWhyChooseSection`
- `seo`
- `sectionsLayout`
- related card data in `service_cards`

Currently hardcoded or fallback-heavy:

- Static fallback service detail data in `website-frontend/src/data/servicesData.js`.
- Backend fallback service data in `backend/utils/servicesDataFallback.js`.
- Default FUE and body-hair content in both CMS defaults and frontend component defaults.
- Hair cost Delhi/India normalization text in `ServiceDetailCMS.jsx`.
- `ServiceWarmTemplate` section order is hardcoded and ignores `sectionsLayout`.
- Warm trust components use `service.associations` and `service.featuredIn`, but the inspected Service Detail CMS section list does not clearly expose full editors for these keys.
- `TestimonialSection` in warm template is global/shared, not service-specific.
- Several components include default images or static images for empty states or review visuals.

## 9. Hide/Show and Ordering Functionality

Whole-section hide/show:

- Classic template uses `sectionsLayout`.
- In CMS, each `ALL_SECTIONS` item can be toggled. Save persists it into `service_details.data.sectionsLayout`.
- Classic template helper: `show(id) => layout[id] !== false`.
- Warm template does not currently consume `sectionsLayout`.

Per-section hide/show:

- Many data objects support `isVisible`.
- Components with `isVisible` guards include benefits, FUE/body-hair sections, ideal/not candidates, techniques, info blocks, aftercare, why choose, editorial FAQ, results, videos, process, and enquiry section logic.

Per-item hide/show and ordering:

- `sortOrder` and `isVisible` are used on:
  - `contentBlocks`
  - `benefitsSection.points`
  - `idealCandidates.bullets`
  - `notCandidatesSection.bullets`
  - `techniquesSection.techniques`
  - `infoBlocksSection.blocks`
  - `aftercareSection.bullets`
  - `whyChooseUsSection.features`
  - `editorialFaqSection.faqs`
  - `fueCostSection.points`
  - `fueCostSection.tableRows`
  - `fueOptingBenefitsSection.benefits`
  - `hairTransplantInfoSection.cards`
- CMS has up/down movement helpers and sort inputs for many of these arrays.

## 10. Reusability Analysis

Shared across all classic services:

- Hero/banner
- Intro/media
- Content blocks
- Benefits
- Ideal candidates
- Not candidates
- Techniques
- Info blocks
- Process
- Aftercare
- Why choose
- Editorial FAQ
- Results
- Videos
- FAQ/enquiry
- SEO metadata

Service-specific sections:

- FUE sections:
  - `fueProcedureSection`
  - `fueCostSection`
  - `fueOptingBenefitsSection`
- Body hair sections:
  - `bodyHairIntroSection`
  - `bodyHairSuitableSection`
- Hair transplant/transplant pages:
  - `hairTransplantInfoSection`
  - `hairTransplantWhyChooseSection`
- Hair cost pages:
  - customized content blocks, benefits normalization, consultation text, and video visibility through `showOnCostPage`.
- Warm-v2:
  - editorial page flow driven by `templateVersion`.

Sections that can be redesigned with low CMS risk:

- Pure presentational components that preserve the same props/data shape:
  - `DetailsBanner`
  - `ServiceIntro`
  - `ServiceContentBlock`
  - `ServiceBenefits`
  - `ServiceIdealCandidates`
  - `ServiceNotCandidates`
  - `ServiceTechniques`
  - `ServiceInfoBlocks`
  - `ServiceAftercare`
  - `ServiceWhyChooseUs`
  - `ServiceEditorialFaq`
  - `FaqEnquiry`
  - FUE/body-hair/transplant-specific display components

Sections requiring extra care:

- `ServiceClassicTemplate` because it encodes slug/category-specific visibility logic.
- `ServiceWarmTemplate` because it composes SEO text from multiple legacy fields and does not use the same layout gate.
- `FaqEnquiry` because it submits leads to `/api/contact`.
- `ServiceIntro` because it supports image/video slider normalization and legacy media data.
- `HairTransplantVideosSection` because it opens iframe video URLs and depends on thumbnail/video URL shape.

## 11. Broken or Incomplete Modules Observed From Inspection

Not verified by runtime in this task; this is code-architecture inspection only.

- Warm-v2 lacks dashboard-level drag/drop ordering because section order is fixed in `ServiceWarmTemplate.jsx`.
- Warm-v2 does not use `sectionsLayout`, so CMS section toggles do not fully control warm template visibility.
- `storyOpener`, `doctorQuote`, `associations`, and `featuredIn` are consumed by the warm template, but the inspected Service Detail CMS does not expose them as first-class `ALL_SECTIONS` editors.
- `seo.schemaScript` is captured in the CMS/model shape but not rendered by `page.js`.
- `backend/models/ServiceDetail.js` is a legacy Mongoose schema reference; runtime Service Details storage currently uses Supabase JSONB instead.
- Some default and fallback content exists in multiple places: CMS defaults, frontend component defaults, website static fallback data, and backend fallback data. This increases drift risk.

## 12. Future Expansion Recommendations

Best architecture for many new premium sections:

- Keep the current backend architecture: one `service_details` row per slug with JSONB data.
- Add a new `sections` array inside `data`, while preserving existing keys for backward compatibility.
- Proposed section record shape:

```json
{
  "id": "premium-results-v1",
  "type": "premiumResults",
  "label": "Premium Results",
  "isVisible": true,
  "sortOrder": 120,
  "variant": "editorial",
  "data": {}
}
```

How to keep existing functionality intact:

- Continue reading current top-level keys (`banner`, `intro`, `benefitsSection`, etc.).
- Introduce a renderer registry that can render both legacy keyed sections and new array-based premium sections.
- Do not remove `sectionsLayout`; map old section IDs into the new renderer only after parity is proven.
- Keep slug-specific compatibility rules for hair cost, FUE, BHT, and transplant pages until those pages are migrated.

Dashboard-controlled hide/show:

- Use `isVisible` on every section record.
- Keep per-item `isVisible` for arrays inside each section.
- For legacy sections, continue persisting `sectionsLayout` and mirror it into the future `sections` array when needed.

Future drag/drop ordering:

- Store section order as `sortOrder` in a canonical section registry/array.
- Dashboard drag/drop should update only `sortOrder`, not rewrite section content.
- Frontend renderer should sort by `sortOrder` and filter by `isVisible`.
- Warm-v2 should be migrated from hardcoded JSX order to the same registry-driven renderer when redesign begins.

Suggested migration path:

1. Preserve existing templates and data keys.
2. Create a section registry in the website frontend that maps `type` to component.
3. Add CMS support for section ordering using a `sections` array.
4. Render legacy sections through the registry behind a feature flag or template version.
5. Add premium sections one at a time as new `type` entries.
6. Only after parity, let warm-v2 and classic pages share the registry-driven renderer.

## 13. Summary

The Service Details page is already highly dynamic in the classic template through Supabase JSONB content, per-item visibility, ordering, media uploads, and CMS save/load flows. The main architectural limitation before redesign is that there are two rendering systems: classic is layout-gated and CMS-oriented, while warm-v2 is a fixed editorial template with partial CMS coverage. A redesign can safely preserve existing CMS behavior if component prop shapes and `service_details.data` keys remain stable.
