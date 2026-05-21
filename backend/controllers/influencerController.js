const Influencer = require('../models/Influencer');

const defaultInfluencerCards = [
  {
    id: '1',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://res.cloudinary.com/dseixl6px/image/upload/v1714467794/sample.jpg',
    title: 'Dr. Nivedita Dadu',
    subtitle: 'Laser Hair Reduction',
    ctaText: 'Watch on Instagram',
    ctaLink: '#',
    autoplay: false,
    muted: true,
    loop: true,
    isVisible: true,
    order: 0
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

    if (u.influencerCards !== undefined) data.influencerCards = u.influencerCards;

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
