const PressMedia = require('../models/PressMedia');

const defaultAvatars = [
  { id: '1', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png' },
  { id: '2', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png' },
  { id: '3', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png' },
  { id: '4', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png' }
];

const defaultLogos = [
  { id: '1', title: 'Press 1', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777700309/dmc-trichology/rervxi6jq1fl20lu2fps.png', link: '#' },
  { id: '2', title: 'Press 2', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777700309/dmc-trichology/pvyogcawczl9mv7wb82v.png', link: '#' },
  { id: '3', title: 'Press 3', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777700309/dmc-trichology/tixdm9gnhknxtwvlj3xd.png', link: '#' }
];

exports.getPressMedia = async (req, res) => {
  try {
    let data = await PressMedia.findOne();
    if (!data) {
      data = await PressMedia.create({
        avatars: defaultAvatars,
        mediaLogos: defaultLogos
      });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePressMedia = async (req, res) => {
  try {
    let data = await PressMedia.findOne();
    if (!data) data = new PressMedia();

    const u = req.body;
    if (u.enabled !== undefined) data.enabled = u.enabled;
    if (u.heading !== undefined) data.heading = u.heading;
    if (u.ratingText !== undefined) data.ratingText = u.ratingText;
    if (u.patientCountText !== undefined) data.patientCountText = u.patientCountText;
    if (u.button !== undefined) data.button = u.button;
    if (u.avatars !== undefined) data.avatars = u.avatars;
    if (u.mediaLogos !== undefined) data.mediaLogos = u.mediaLogos;

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
