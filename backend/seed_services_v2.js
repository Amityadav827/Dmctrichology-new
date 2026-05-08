const mongoose = require('mongoose');

// Define temporary schemas for seeding
const servicePageSettingsSchema = new mongoose.Schema({
  hero: {
    bannerImage: String,
    pageTitle: String,
    breadcrumbText: String,
    overlayOpacity: Number,
    bannerHeight: String,
  }
}, { collection: 'ServicePageSettings' });

const serviceCardSchema = new mongoose.Schema({
  title: String,
  category: String,
  rating: String,
  duration: String,
  shortDescription: String,
  image: String,
  buttonText: String,
  buttonLink: String,
  featured: Boolean
}, { collection: 'ServiceCard' });

const serviceCategorySchema = new mongoose.Schema({
  categoryName: String,
  slug: String
}, { collection: 'ServiceCategory' });

async function seed() {
  const mongoUri = 'mongodb+srv://dmcadmin:dmc12345@cluster0.chzfua4.mongodb.net/dmctrichology?retryWrites=true&w=majority';
  await mongoose.connect(mongoUri);
  
  const ServicePageSettings = mongoose.model('ServicePageSettings', servicePageSettingsSchema);
  const ServiceCard = mongoose.model('ServiceCard', serviceCardSchema);
  const ServiceCategory = mongoose.model('ServiceCategory', serviceCategorySchema);

  // 1. Update Hero Settings
  await ServicePageSettings.deleteMany({});
  await ServicePageSettings.create({
    hero: {
      bannerImage: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
      pageTitle: "Our Premium Services",
      breadcrumbText: "Home / Services",
      overlayOpacity: 0.6,
      bannerHeight: "500px"
    }
  });

  // 2. Add Categories
  await ServiceCategory.deleteMany({});
  const categories = await ServiceCategory.create([
    { categoryName: "Hair Transplant", slug: "hair-transplant" },
    { categoryName: "Skin Care", slug: "skin-care" },
    { categoryName: "Scalp Treatments", slug: "scalp-treatments" },
    { categoryName: "Body Treatments", slug: "body-treatments" }
  ]);

  // 3. Add Realistic Services
  await ServiceCard.deleteMany({});
  await ServiceCard.create([
    {
      title: "Follicular Unit Extraction (FUE)",
      category: "hair-transplant",
      rating: "4.85",
      duration: "180 mins",
      shortDescription: "FUE is one of the most popular and limited modern procedure techniques for hair repair. Each hair follicle is removed individually and implanted into the thinning or bald areas.",
      image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png",
      buttonText: "VIEW DETAILS",
      featured: true
    },
    {
      title: "Follicular Unit Transplantation (FUT)",
      category: "hair-transplant",
      rating: "4.84",
      duration: "45 mins",
      shortDescription: "Includes chin, lower chin, upper lip, cheeks, side locks, and forehead. US FDA-approved, painless, and safe technology.",
      image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png",
      buttonText: "VIEW DETAILS",
      featured: false
    },
    {
      title: "Hair Replacement in Delhi – Non-Surgical Solutions",
      category: "hair-transplant",
      rating: "4.75",
      duration: "30 mins",
      shortDescription: "Includes chin, lower chin and upper neck area. US FDA-approved, painless, and safe technology.",
      image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png",
      buttonText: "VIEW DETAILS",
      featured: false
    },
    {
      title: "Scalp Treatments for Healthy Hair",
      category: "scalp-treatments",
      rating: "4.82",
      duration: "30 mins",
      shortDescription: "Includes cheeks, sidelocks, upper lips, chin, lower chin, jawline and upper neck. US FDA-approved, painless and safe technology.",
      image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png",
      buttonText: "VIEW DETAILS",
      featured: false
    },
    {
      title: "Body Hair Transplant (BHT)",
      category: "hair-transplant",
      rating: "4.88",
      duration: "120 mins",
      shortDescription: "Specialized technique for using body hair for scalp restoration. Ideal for patients with limited donor hair on the scalp.",
      image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png",
      buttonText: "VIEW DETAILS",
      featured: true
    },
    {
      title: "Beard Hair Transplant",
      category: "hair-transplant",
      rating: "4.9",
      duration: "150 mins",
      shortDescription: "Restore facial hair density with precision. Our beard transplants provide natural-looking results with minimal downtime.",
      image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png",
      buttonText: "VIEW DETAILS",
      featured: false
    }
  ]);

  console.log('Seed completed successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
