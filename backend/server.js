require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

// Routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const menuRoutes = require("./routes/menuRoutes");
const operationRoutes = require("./routes/operationRoutes");
const menuOperationRoutes = require("./routes/menuOperationRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const blogRoutes = require("./routes/blogRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const contactRoutes = require("./routes/contactRoutes");
const callbackRoutes = require("./routes/callbackRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const { seoRouter, serveRobotsTxt } = require("./routes/seoRoutes");
const serviceCategoryRoutes = require("./routes/serviceCategoryRoutes");
const secondCategoryRoutes = require("./routes/secondCategoryRoutes");
const serviceFaqRoutes = require("./routes/serviceFaqRoutes");
const resultCategoryRoutes = require("./routes/resultCategoryRoutes");
const resultInnerRoutes = require("./routes/resultInnerRoutes");
const videoCategoryRoutes = require("./routes/videoCategoryRoutes");
const videoRoutes = require("./routes/videoRoutes");
const redirectRoutes = require("./routes/redirectRoutes");
const pageRoutes = require("./routes/pageRoutes");
const blogCategoryRoutes = require("./routes/blogCategoryRoutes");
const heroRoutes = require("./routes/heroRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const topbarRoutes = require("./routes/topbarRoutes");
const headerRoutes = require("./routes/headerRoutes");
const pageCompositionRoutes = require("./routes/pageCompositionRoutes");
const aboutUsRoutes = require("./routes/aboutUsRoutes");
const marqueeRoutes = require("./routes/marqueeRoutes");
const whyChooseUsRoutes = require("./routes/whyChooseUsRoutes");
const resultsSliderRoutes = require("./routes/resultsSliderRoutes");
const gradeSliderRoutes = require("./routes/gradeSliderRoutes");
const whyChooseDMCRoutes = require("./routes/whyChooseDMCRoutes");
const surgeonRoutes = require("./routes/surgeonRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const treatmentPlanRoutes = require("./routes/treatmentPlanRoutes");
const homeFaqRoutes = require("./routes/homeFaqRoutes");
const homeBlogRoutes = require("./routes/homeBlogRoutes");
const pressMediaRoutes = require("./routes/pressMediaRoutes");
const virtualTourRoutes = require("./routes/virtualTourRoutes");
const influencerRoutes = require("./routes/influencerRoutes");
const scienceDmcRoutes = require("./routes/scienceDmcRoutes");
const footerRoutes = require("./routes/footerRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const servicePageSettingsRoutes = require("./routes/servicePageRoutes");
const serviceListingCardRoutes = require("./routes/serviceCardRoutes");
const serviceListingCategoryRoutes = require("./routes/serviceCategoryListingRoutes");
const detailsPageRoutes = require("./routes/detailsPageRoutes");
const serviceDetailRoutes = require("./routes/serviceDetailRoutes");
const contactPageRoutes = require("./routes/contactPageRoutes");
const blogPageRoutes = require("./routes/blogPageRoutes");
const blogCommentRoutes = require("./routes/commentRoutes");
const scienceConsultationRoutes = require("./routes/scienceConsultationRoutes");
const aboutDrNandaniRoutes = require("./routes/aboutDrNandaniRoutes");
const aboutDrNiveditaRoutes = require("./routes/aboutDrNiveditaRoutes");
const aboutDmcTrichologyRoutes = require("./routes/aboutDmcTrichologyRoutes");
const ourTeamRoutes = require("./routes/ourTeamRoutes");
const faqsPageRoutes = require("./routes/faqsPageRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const redirectMiddleware = require("./middleware/redirectMiddleware");

const app = express();

// ========================
// ✅ Global Middleware
// ========================
const allowedOrigins = [
  "https://dmctrichology.vercel.app",
  "https://dmctrichology-mkm4.vercel.app",
  "https://dmctrichology-dashboard.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173" // Adding Vite default port too
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging only in development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}


// Dynamic Redirects (MUST be before API routes if you want to redirect old URLs)
app.use(redirectMiddleware);

// ========================
// ✅ Health Check Route
// ========================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 DMC Trichology API Running Successfully",
    env: process.env.NODE_ENV || "development"
  });
});

// ========================
// ✅ API Routes
// ========================
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);

app.use("/api/menus", menuRoutes);
app.use("/api/menu", menuRoutes);

app.use("/api/operations", operationRoutes);
app.use("/api/operation", operationRoutes);

app.use("/api/menu-operations", menuOperationRoutes);

app.use("/api/services", serviceRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/gallery", galleryRoutes);

app.use("/api/contact", contactRoutes);
app.use("/api/contacts", contactRoutes);

app.use("/api/callbacks", callbackRoutes);
app.use("/api/callback", callbackRoutes);
app.use("/api/lead", callbackRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/newsletter", newsletterRoutes);

app.use("/api/seo", seoRouter);

app.use("/api/service-categories", serviceCategoryRoutes);
app.use("/api/second-categories", secondCategoryRoutes);
app.use("/api/service-faqs", serviceFaqRoutes);

app.use("/api/result-categories", resultCategoryRoutes);
app.use("/api/results", resultInnerRoutes);

app.use("/api/video-categories", videoCategoryRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/redirects", redirectRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/blog-categories", blogCategoryRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/site-settings", settingsRoutes);
app.use("/api/topbar", topbarRoutes);
app.use("/api/header", headerRoutes);
app.use("/api/page-compositions", pageCompositionRoutes);
app.use("/api/about-us", aboutUsRoutes);
app.use("/api/marquee-features", marqueeRoutes);
app.use("/api/why-choose-us", whyChooseUsRoutes);
app.use("/api/results-slider", resultsSliderRoutes);
app.use("/api/grade-slider", gradeSliderRoutes);
app.use("/api/why-choose-dmc", whyChooseDMCRoutes);
app.use("/api/surgeons", surgeonRoutes);
app.use("/api/consultation", consultationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/treatment-plan", treatmentPlanRoutes);
app.use("/api/home-faq", homeFaqRoutes);
app.use("/api/blogs-home", homeBlogRoutes);
app.use("/api/press-media", pressMediaRoutes);
app.use("/api/virtual-tour", virtualTourRoutes);
app.use("/api/influencers", influencerRoutes);
app.use("/api/science-dmc", scienceDmcRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/service-page-settings", servicePageSettingsRoutes);
app.use("/api/service-listing-cards", serviceListingCardRoutes);
app.use("/api/service-listing-categories", serviceListingCategoryRoutes);
app.use("/api/details-page", detailsPageRoutes);
app.use("/api/service-details", serviceDetailRoutes);
app.use("/api/contact-page", contactPageRoutes);
app.use("/api/blog-page", blogPageRoutes);
app.use("/api/blog-comments", blogCommentRoutes);
app.use("/api/science-consultations", scienceConsultationRoutes);
app.use("/api/about-dr-nandani", aboutDrNandaniRoutes);
app.use("/api/about-dr-nivedita", aboutDrNiveditaRoutes);
app.use("/api/about-dmc-trichology", aboutDmcTrichologyRoutes);
app.use("/api/our-team", ourTeamRoutes);
app.use("/api/faqs-page", faqsPageRoutes);


// SEO
app.get(
  "/api/seo/sitemap.xml",
  require("./controllers/sitemapController").generateSitemapXml
);

app.get("/robots.txt", serveRobotsTxt);

// ========================
// ❌ Error Handling
// ========================
app.use(notFound);
app.use(errorHandler);

// ========================
// 🚀 Server Start
// ========================
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});

// Set server timeout to 5 minutes for large file uploads
server.timeout = 300000;
