const PressMedia = require('../models/PressMedia');

// ─── Default sample data ──────────────────────────────────────────────────────
const defaultAvatars = [
  { id: '1', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png' },
  { id: '2', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png' },
  { id: '3', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png' },
  { id: '4', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png' },
];

const defaultLogos = [
  { id: '1', title: 'Press 1', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777700309/dmc-trichology/rervxi6jq1fl20lu2fps.png', link: '#' },
  { id: '2', title: 'Press 2', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777700309/dmc-trichology/pvyogcawczl9mv7wb82v.png', link: '#' },
  { id: '3', title: 'Press 3', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777700309/dmc-trichology/tixdm9gnhknxtwvlj3xd.png', link: '#' },
];

const defaultMediaCards = [
  {
    id: '1',
    mediaImage: 'https://www.dmctrichology.com/assets/images/media_1.webp',
    mediaLogo: 'https://www.dmctrichology.com/assets/images/media_logo1.webp',
    mediaTitle: 'DMC Trichology Featured in Leading Health Publication',
    mediaLink: '#',
    isVisible: true,
    order: 0,
  },
  {
    id: '2',
    mediaImage: 'https://www.dmctrichology.com/assets/images/media_1.webp',
    mediaLogo: 'https://www.dmctrichology.com/assets/images/media_logo1.webp',
    mediaTitle: 'Expert Hair Restoration: DMC Trichology\'s Revolutionary Approach',
    mediaLink: '#',
    isVisible: true,
    order: 1,
  },
  {
    id: '3',
    mediaImage: 'https://www.dmctrichology.com/assets/images/media_1.webp',
    mediaLogo: 'https://www.dmctrichology.com/assets/images/media_logo1.webp',
    mediaTitle: 'India\'s Premier Trichology Clinic Gains National Recognition',
    mediaLink: '#',
    isVisible: true,
    order: 2,
  },
];

// ─── GET /api/press-media ─────────────────────────────────────────────────────
exports.getPressMedia = async (req, res) => {
  try {
    let data = await PressMedia.findOne();
    if (!data) {
      data = await PressMedia.create({
        avatars: defaultAvatars,
        mediaLogos: defaultLogos,
        mediaCards: defaultMediaCards,
      });
    }
    // Ensure mediaCards is always populated with sample data if empty
    if (!data.mediaCards || data.mediaCards.length === 0) {
      data.mediaCards = defaultMediaCards;
      await data.save();
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUT /api/press-media ─────────────────────────────────────────────────────
exports.updatePressMedia = async (req, res) => {
  try {
    let data = await PressMedia.findOne();
    if (!data) data = new PressMedia();

    const u = req.body;

    // Legacy home-section fields
    if (u.enabled !== undefined) data.enabled = u.enabled;
    if (u.heading !== undefined) data.heading = u.heading;
    if (u.ratingText !== undefined) data.ratingText = u.ratingText;
    if (u.patientCountText !== undefined) data.patientCountText = u.patientCountText;
    if (u.button !== undefined) data.button = u.button;
    if (u.avatars !== undefined) data.avatars = u.avatars;
    if (u.mediaLogos !== undefined) data.mediaLogos = u.mediaLogos;

    // New press-media page fields
    if (u.hero !== undefined) data.hero = { ...data.hero.toObject?.() ?? data.hero, ...u.hero };
    if (u.mediaCards !== undefined) data.mediaCards = u.mediaCards;

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
