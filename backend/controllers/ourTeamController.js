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
    members: [
      {
        image: '',
        name: 'Dr. Nandini Dadu',
        designation: 'Hair Transplant Surgeon',
        qualification: 'MBBS, Senior Consultant, Dadu Medical Centre',
        shortDescription: 'A leading hair restoration expert focused on advanced, natural-looking scalp and hair solutions.',
        profileLink: '/about-dr-nandani-dadu',
        sortOrder: 10
      },
      {
        image: '',
        name: 'Dr. Nivedita Dadu',
        designation: 'Founder, Dadu Medical Centre',
        qualification: 'M.B.B.S., D.D.V.L., D.N.B., M.N.A.M.S (Dermatology)',
        shortDescription: 'A renowned dermatologist and trichology specialist known for clinically refined patient care.',
        profileLink: '/about-dr-nivedita-dadu',
        sortOrder: 20
      }
    ]
  }
};

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
      data: row?.data || fallbackData,
      isFallback: !row
    });
  } catch (error) {
    console.error('Error fetching Our Team settings:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const payload = {
      hero: { ...fallbackData.hero, ...(req.body?.hero || {}) },
      teamMembers: {
        ...fallbackData.teamMembers,
        ...(req.body?.teamMembers || {}),
        members: Array.isArray(req.body?.teamMembers?.members) ? req.body.teamMembers.members : fallbackData.teamMembers.members
      }
    };

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
