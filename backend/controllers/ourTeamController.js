const supabase = require('../config/supabase');
const uploadToSupabase = require('../utils/uploadToSupabase');

const CMS_KEY = 'our_team';

const fallbackData = {
  hero: {
    isEnabled: true,
    backgroundImage: '',
    pageTitle: 'Our Team',
    breadcrumbLabel: 'Our Team',
    overlayOpacity: 0.62
  },
  teamMembers: {
    isEnabled: true,
    badgeText: 'OUR MEDICAL EXPERTS',
    heading: 'Meet Our Expert Doctors',
    members: []
  },
  seo: {
    metaTitle: '',
    metaDescription: '',
    ogImage: ''
  }
};

const normalizeMember = (member = {}, index = 0) => ({
  image: member.image || '',
  name: member.name || '',
  designation: member.designation || '',
  qualification: member.qualification || '',
  shortDescription: member.shortDescription || member.description || '',
  description: member.description || member.shortDescription || '',
  profileLink: member.profileLink || '',
  sortOrder: Number.isFinite(Number(member.sortOrder)) ? Number(member.sortOrder) : (index + 1) * 10,
  isVisible: member.isVisible !== false
});

const normalizePayload = (source = fallbackData) => ({
  hero: { ...fallbackData.hero, ...(source.hero || {}) },
  teamMembers: {
    ...fallbackData.teamMembers,
    ...(source.teamMembers || {}),
    members: Array.isArray(source.teamMembers?.members)
      ? source.teamMembers.members.map(normalizeMember)
      : []
  },
  seo: {
    ...fallbackData.seo,
    ...(source.seo || {})
  }
});

exports.getSettings = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections')
      .select('data')
      .eq('key', CMS_KEY)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return res.status(200).json({
      success: true,
      data: normalizePayload(row?.data || fallbackData),
      isFallback: !row
    });
  } catch (error) {
    console.error('Error fetching Our Team settings:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const payload = normalizePayload(req.body || fallbackData);

    const { error } = await supabase
      .from('cms_sections')
      .upsert({ key: CMS_KEY, data: payload, updated_at: new Date() }, { onConflict: 'key' });

    if (error) throw error;

    return res.status(200).json({ success: true, data: payload, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating Our Team settings:', error);
    return res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const publicUrl = await uploadToSupabase(req.file, 'our_team_assets');
    return res.status(200).json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Error uploading Our Team asset:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
