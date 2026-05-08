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
const sectionRoutes = require("./routes/sectionRoutes");

// Database Connection
const connectDB = require("./config/db");
const { seedDefaultHero } = require("./controllers/heroController");
const { seedDefaultSettings } = require("./controllers/settingsController");
const { seedDefaultTopBar } = require("./controllers/topbarController");
const { seedDefaultHeader } = require("./controllers/headerController");
const { seedHomePage } = require("./controllers/pageCompositionController");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const redirectMiddleware = require("./middleware/redirectMiddleware");

const app = express();

// Connect to MongoDB
connectDB().then(() => {
  seedDefaultHero();
  seedDefaultSettings();
  seedDefaultTopBar();
  seedDefaultHeader();
  seedHomePage();
});

// ========================
// ✅ Global Middleware
// ========================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

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

app.use("/api/appointment", appointmentRoutes);

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
app.use("/api/sections", sectionRoutes);

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