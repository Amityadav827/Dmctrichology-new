const TreatmentPlan = require('../models/TreatmentPlan');

const defaultCards = [
  {
    title: "Laser Hair Reduction",
    description: "Curious about Laser Hair reduction? Take our quick test to know how it works- and find out the best suited treatment plan for you!",
    image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777634594/dmc-trichology/tgdwxqknoq3nftmlapnq.png",
    buttonText: "TAKE THE TEST",
    buttonLink: "#"
  },
  {
    title: "Weight Reduction Assessment",
    description: "Explore your personal slimming roadmap—take our AI-guided test and discover custom sessions for your goals.",
    image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777634594/dmc-trichology/wbodpzympkp4nnjnrme2.png",
    buttonText: "TAKE THE TEST",
    buttonLink: "#"
  }
];

exports.getTreatmentPlan = async (req, res) => {
  try {
    let data = await TreatmentPlan.findOne();
    if (!data) {
      data = await TreatmentPlan.create({
        badgeText: 'TREATMENT PLAN',
        heading: 'Know the Right Treatment for You',
        cards: defaultCards
      });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTreatmentPlan = async (req, res) => {
  try {
    let data = await TreatmentPlan.findOne();
    if (!data) data = new TreatmentPlan();

    const u = req.body;
    if (u.enabled !== undefined) data.enabled = u.enabled;
    if (u.badgeText !== undefined) data.badgeText = u.badgeText;
    if (u.heading !== undefined) data.heading = u.heading;
    if (u.cards !== undefined) data.cards = u.cards;

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
