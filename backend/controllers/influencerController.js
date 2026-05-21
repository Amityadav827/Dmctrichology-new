const Influencer = require('../models/Influencer');

const defaultInfluencerCards = [
  {
    id: '1',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Placeholder video
    thumbnail: 'https://res.cloudinary.com/dseixl6px/image/upload/v1714467794/sample.jpg',
    influencerName: 'John Doe',
    caption: 'Best clinic experience ever!',
    instagramLink: '#',
    isVisible: true,
    order: 0
  },
  {
    id: '2',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://res.cloudinary.com/dseixl6px/image/upload/v1714467794/sample.jpg',
    influencerName: 'Jane Smith',
    caption: 'Highly recommend their treatments.',
    instagramLink: '#',
    isVisible: true,
    order: 1
  },
  {
    id: '3',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://res.cloudinary.com/dseixl6px/image/upload/v1714467794/sample.jpg',
    influencerName: 'Alex Johnson',
    caption: 'Amazing results in just weeks.',
    instagramLink: '#',
    isVisible: true,
    order: 2
  }
];

exports.getInfluencers = async (req, res) => {
  try {
    let data = await Influencer.findOne();
    if (!data) {
      data = await Influencer.create({
        influencerCards: defaultInfluencerCards
      });
    }
    if (!data.influencerCards || data.influencerCards.length === 0) {
        data.influencerCards = defaultInfluencerCards;
        await data.save();
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInfluencers = async (req, res) => {
  try {
    let data = await Influencer.findOne();
    if (!data) data = new Influencer();

    const u = req.body;

    if (u.hero !== undefined) data.hero = { ...data.hero.toObject?.() ?? data.hero, ...u.hero };
    if (u.influencerCards !== undefined) data.influencerCards = u.influencerCards;

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
