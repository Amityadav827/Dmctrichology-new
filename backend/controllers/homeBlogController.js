const HomeBlog = require('../models/HomeBlog');

const defaultBlogs = [
  {
    date: "May 9, 2025",
    image: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778131709997-726787114.png",
    author: "Dr. Alisha Verma, Physiotherapist",
    authorIcon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777699290/dmc-trichology/xfi18qjzfi3nlsrf4taa.png",
    title: "PRP Hair Treatment – How Many Sessions Needed?",
    buttonText: "Explore More",
    buttonLink: "#",
    featured: false
  },
  {
    date: "May 9, 2025",
    image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777639995/dmc-trichology/zsnaxe1vrwm9mzu278tn.png",
    author: "Dr. Meera Joshi, Posture & Spine",
    authorIcon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777699290/dmc-trichology/hkpas8djntgu0tkj5mpe.png",
    title: "Best Shampoo For Hair Fall — What Actually Helps And Why Most People Are Looking In The Wrong Place",
    buttonText: "Explore More",
    buttonLink: "#",
    featured: true
  },
  {
    date: "May 9, 2025",
    image: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778131708889-398768761.png",
    author: "Dr. Rahul Kapoor, Neuro & Expert",
    authorIcon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777699290/dmc-trichology/xfi18qjzfi3nlsrf4taa.png",
    title: "Hair Regrowth Timeline — What To Realistically Expect And When To Actually See Results",
    buttonText: "Explore More",
    buttonLink: "#",
    featured: false
  }
];

exports.getHomeBlog = async (req, res) => {
  try {
    let data = await HomeBlog.findOne();
    if (!data) {
      data = await HomeBlog.create({
        badgeText: 'OUR LATEST BLOGS',
        heading: 'News & Wellness Advice',
        subtitle: 'Our Expert Therapists Work With You To Create Tailored Recovery Plans That Target Your Specific Needs And Goals.',
        blogs: defaultBlogs
      });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateHomeBlog = async (req, res) => {
  try {
    let data = await HomeBlog.findOne();
    if (!data) data = new HomeBlog();

    const u = req.body;
    if (u.enabled !== undefined) data.enabled = u.enabled;
    if (u.badgeText !== undefined) data.badgeText = u.badgeText;
    if (u.heading !== undefined) data.heading = u.heading;
    if (u.subtitle !== undefined) data.subtitle = u.subtitle;
    if (u.blogs !== undefined) data.blogs = u.blogs;

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
