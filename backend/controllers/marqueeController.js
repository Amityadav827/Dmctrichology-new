const MarqueeFeature = require('../models/MarqueeFeature');

const defaultItems = [
  { title: 'At-Home Sessions', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777546337/dmc-trichology/dujziywmelzwixisgvyb.png', link: '', enabled: true },
  { title: 'Dermatologist Monitored', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777546337/dmc-trichology/rhqehubr894icsuzfcew.png', link: '', enabled: true },
  { title: 'Shark Tank Approved', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777546337/dmc-trichology/gqnszoyafmildmq6l9mm.png', link: '', enabled: true },
  { title: 'US FDA Approved', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777546337/dmc-trichology/eqmyy5zthf9zi92xyvxm.png', link: '', enabled: true },
  { title: 'Quick & Lasting Results', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777546337/dmc-trichology/oihmmdhj7lbltqp9qgrj.png', link: '', enabled: true },
  { title: '100% Safe', icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777546337/dmc-trichology/pdc64p00mfiv0080ippb.png', link: '', enabled: true }
];

exports.getMarqueeFeatures = async (req, res) => {
  try {
    let data = await MarqueeFeature.findOne();
    if (!data) {
      data = await MarqueeFeature.create({
        enabled: true,
        backgroundColor: 'transparent',
        paddingTop: '60px',
        paddingBottom: '60px',
        marqueeSpeed: 30,
        pauseOnHover: true,
        items: defaultItems
      });
    }
    res.json({ success: true, data });
  } catch (error) {
    console.error('MarqueeFeature GET error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMarqueeFeatures = async (req, res) => {
  try {
    let data = await MarqueeFeature.findOne();
    if (!data) {
      data = new MarqueeFeature();
    }

    const updates = req.body;

    if (updates.enabled !== undefined) data.enabled = updates.enabled;
    if (updates.backgroundColor !== undefined) data.backgroundColor = updates.backgroundColor;
    if (updates.paddingTop !== undefined) data.paddingTop = updates.paddingTop;
    if (updates.paddingBottom !== undefined) data.paddingBottom = updates.paddingBottom;
    if (updates.marqueeSpeed !== undefined) data.marqueeSpeed = Number(updates.marqueeSpeed);
    if (updates.pauseOnHover !== undefined) data.pauseOnHover = updates.pauseOnHover;

    if (updates.items !== undefined) {
      try {
        const parsed = typeof updates.items === 'string'
          ? JSON.parse(updates.items)
          : updates.items;
        if (Array.isArray(parsed)) {
          data.items = parsed;
          data.markModified('items');
        }
      } catch (e) {
        console.error('Failed to parse items array:', e.message);
      }
    }

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    console.error('MarqueeFeature PUT error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
