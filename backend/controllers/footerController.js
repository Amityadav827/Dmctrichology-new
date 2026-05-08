const Footer = require('../models/Footer');

const defaultColumns = [
  {
    id: 'col1',
    title: 'HAIR TRANSPLANT',
    links: [
      { id: 'l1', label: 'FUE Hair Transplant', url: '#' },
      { id: 'l2', label: 'DHI Hair Transplant', url: '#' },
      { id: 'l3', label: 'Hair Restoration', url: '#' },
      { id: 'l4', label: 'Beard Transplant', url: '#' },
      { id: 'l5', label: 'Moustache Transplant', url: '#' },
      { id: 'l6', label: 'Eyebrow Transplant', url: '#' }
    ]
  },
  {
    id: 'col2',
    title: 'HAIR TREATMENTS',
    links: [
      { id: 'l7', label: 'PRP Therapy', url: '#' },
      { id: 'l8', label: 'GFC Therapy', url: '#' },
      { id: 'l9', label: 'QR 678®', url: '#' },
      { id: 'l10', label: 'Meso Therapy', url: '#' },
      { id: 'l11', label: 'Cyclical Therapy', url: '#' },
      { id: 'l12', label: 'Low-Level Laser Therapy', url: '#' }
    ]
  }
];

const defaultSocials = [
  { id: 's1', icon: 'facebook', url: 'https://facebook.com/dmctrichology' },
  { id: 's2', icon: 'instagram', url: 'https://instagram.com/dmctrichology' },
  { id: 's3', icon: 'youtube', url: 'https://youtube.com/dmctrichology' }
];

exports.getFooter = async (req, res) => {
  try {
    let data = await Footer.findOne();
    if (!data) {
      data = await Footer.create({
        columns: defaultColumns,
        socials: defaultSocials
      });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFooter = async (req, res) => {
  try {
    let data = await Footer.findOne();
    if (!data) data = new Footer();

    const u = req.body;
    if (u.enabled !== undefined) data.enabled = u.enabled;
    if (u.columns !== undefined) data.columns = u.columns;
    if (u.contact !== undefined) data.contact = u.contact;
    if (u.disclaimer !== undefined) data.disclaimer = u.disclaimer;
    if (u.newsletter !== undefined) data.newsletter = u.newsletter;
    if (u.branding !== undefined) data.branding = u.branding;
    if (u.socials !== undefined) data.socials = u.socials;
    if (u.bottomFooter !== undefined) data.bottomFooter = u.bottomFooter;

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
