const HomeFAQ = require('../models/HomeFAQ');

const defaultCategories = [
  {
    title: 'General',
    faqs: [
      { 
        question: "What Is The DMC-Golden Touch Technique?", 
        answer: "The DMC-Golden Touch Technique is our signature method that combines precision hair transplantation with advanced healing protocols for natural results.", 
        icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/nfk4apuep0hexzvztq70.png" 
      },
      { 
        question: "What Should I Wear To My Appointment?", 
        answer: "Wear loose, comfortable clothes. Gym wear or stretchable outfits are ideal. Avoid tight or formal clothing.", 
        icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/cds9oqjny3l4ctfzdnxp.png" 
      },
      {
        question: "Can Both Men And Women Undergo Hair Transplant?",
        answer: "Yes, we provide specialized hair restoration solutions for both men and women, addressing pattern baldness and thinning.",
        icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/uwcoyjbmka6mtnpxif4t.png"
      },
      {
        question: "How Can I Book A Consultation At DMC Trichology?",
        answer: "You can book directly via our website, call our helpdesk, or visit our clinic. We offer both physical and virtual consultations.",
        icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/ju0yj4temj3aalwa1xna.png"
      }
    ]
  },
  {
    title: 'Pricing & Billing',
    faqs: [
      {
        question: "What Is The Average Cost Of A Hair Transplant?",
        answer: "Cost varies based on the number of grafts and technique used. We provide a detailed estimate during your initial consultation.",
        icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/nfk4apuep0hexzvztq70.png"
      },
      {
        question: "Do You Offer EMI Or Financing Options?",
        answer: "Yes, we offer 0% EMI options and flexible financing through partner providers to make treatments accessible.",
        icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/azwnlible0jjieljwpin.png"
      }
    ]
  },
  {
    title: 'Our Treatments',
    faqs: [
      {
        question: "Is The Procedure Painful?",
        answer: "We use local anesthesia to ensure minimal discomfort. Most patients feel very relaxed throughout the session.",
        icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/faxp8cvrttxpt3w38asw.png"
      },
      {
        question: "How Long Does It Take To See Final Results?",
        answer: "Initial growth starts in 3-4 months, with full density and final results typically visible after 9-12 months.",
        icon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777638444/dmc-trichology/cds9oqjny3l4ctfzdnxp.png"
      }
    ]
  }
];

exports.getHomeFAQ = async (req, res) => {
  try {
    let data = await HomeFAQ.findOne();
    if (!data) {
      data = await HomeFAQ.create({
        badgeText: 'TRUSTED CARE SERVICES',
        heading: 'Frequently Asked Question?',
        categories: defaultCategories,
        buttonText: 'View All Questions',
        buttonLink: '#'
      });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateHomeFAQ = async (req, res) => {
  try {
    let data = await HomeFAQ.findOne();
    if (!data) data = new HomeFAQ();

    const u = req.body;
    if (u.enabled !== undefined) data.enabled = u.enabled;
    if (u.badgeText !== undefined) data.badgeText = u.badgeText;
    if (u.heading !== undefined) data.heading = u.heading;
    if (u.categories !== undefined) data.categories = u.categories;
    if (u.buttonText !== undefined) data.buttonText = u.buttonText;
    if (u.buttonLink !== undefined) data.buttonLink = u.buttonLink;

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
