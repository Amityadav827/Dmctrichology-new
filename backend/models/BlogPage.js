const mongoose = require("mongoose");

const blogPageSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: "Blog" },
      breadcrumbText: { type: String, default: "Blog" },
      bannerImage: { type: String, default: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png" },
      overlayOpacity: { type: Number, default: 0.5 },
      bannerHeight: { type: String, default: "400px" },
    },
    listing: {
      sidebarSearchPlaceholder: { type: String, default: "Enter Key Word" },
      sidebarCategoriesTitle: { type: String, default: "Blog Categories" },
      sidebarRecentPostsTitle: { type: String, default: "Recent Post" },
      promoImage: { type: String, default: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png" },
      promoLink: { type: String, default: "" },
      promoButtonText: { type: String, default: "Special Offer" },
      categories: [
        {
          name: { type: String, default: "Back & Spine Therapy" },
          count: { type: Number, default: 4 }
        },
        {
          name: { type: String, default: "Sports Injury Rehab" },
          count: { type: Number, default: 3 }
        },
        {
          name: { type: String, default: "Post-Surgical Recovery" },
          count: { type: Number, default: 2 }
        },
        {
          name: { type: String, default: "Joint & Muscle Mobilization" },
          count: { type: Number, default: 3 }
        },
        {
          name: { type: String, default: "Neurological Physiotherapy" },
          count: { type: Number, default: 2 }
        }
      ],
      recentPosts: [
        {
          title: { type: String, default: "How Physiotherapy Helps You Heal Faster" },
          date: { type: String, default: "Mar 06, 2025" },
          image: { type: String, default: "" }
        },
        {
          title: { type: String, default: "Best Exercises For Shoulder Pain Relief" },
          date: { type: String, default: "Mar 08, 2025" },
          image: { type: String, default: "" }
        },
        {
          title: { type: String, default: "Improve Posture With Simple Daily Stretches" },
          date: { type: String, default: "Mar 10, 2025" },
          image: { type: String, default: "" }
        },
        {
          title: { type: String, default: "Best Exercises For Shoulder Pain Relief" },
          date: { type: String, default: "Mar 08, 2025" },
          image: { type: String, default: "" }
        }
      ],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogPage", blogPageSchema);
