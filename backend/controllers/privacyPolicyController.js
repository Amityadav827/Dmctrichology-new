const supabase = require('../config/supabase');
const uploadToSupabase = require('../utils/uploadToSupabase');

const CMS_KEY = 'privacy_policy';

const defaultContent = `<p>Your privacy is important to us. To better protect it, we provide this declaration explaining our online information practices.</p>
<p>We recognise the importance of privacy. We value and protect your right to keep your personal information confidential. Our goal is for you to get the most out of this site and trust that we make every effort to safeguard your confidentiality.</p>
<p>Please make a note that we at www.dmctrichology.com can make changes to this private policy from time to time. Keep checking this page to know more about the updated policies.</p>
<h3>PERSONAL INFORMATION</h3>
<p>Because of the nature of this site, a certain amount of personal information is necessary to provide you with the information you have requested. It is collected to respond to your requests for this information and add you to communications regarding our education. This can include but is not limited to:</p>
<ul>
<li>Name</li>
<li>Email address</li>
<li>Phone number.</li>
</ul>
<p>This information is collected solely to respond to your inquiries and provide relevant updates.</p>
<h3>WHAT WE DO WITH YOUR PERSONAL INFORMATION</h3>
<ul>
<li>www.dmctrichology.com will not sell, distribute, or lease your personal information to third parties unless we have your permission or are required by law to do so.</li>
<li>We take appropriate security measures to protect against unauthorized access to or unauthorized alteration, disclosure, or destruction of data.</li>
<li>We restrict access to personal information to our employees and agents who need to know that information in order to operate, develop, or improve our services, treatments, and related standard operational procedures.</li>
<li>These individuals are bound by confidentiality obligations and may be subject to discipline, including termination and criminal prosecution if they fail to meet these obligations.</li>
</ul>
<h3>LINKS TO OTHER WEBSITES</h3>
<ul>
<li>Our website may contain links to other websites of interest.</li>
<li>However, once you have used these links to leave our site, you should note that we do not have any control over that other website.</li>
<li>We are not responsible for the protection and privacy of any information which you provide whilst visiting such sites and if such sites are not governed by this privacy statement.</li>
</ul>
<h3>OTHER INFORMATION COLLECTED</h3>
<p>When you visit our website, we collect non-personal information about your visit. We collect your:</p>
<ul>
<li>IP address</li>
<li>browser type</li>
<li>domain name</li>
<li>the length of time of your visit</li>
<li>the number of times you visit.</li>
</ul>
<p>We use this information to gather aggregate demographic information about our visitors, and we use it to personalize the information you see on our website and the emails you receive from us.</p>
<p>We keep this information for our internal use; we do not share it with others. This information is in no way tied to your personal information.</p>
<h3>COOKIES AND ONLINE ADVERTISING</h3>
<p>This information is only used to see how people are navigating the site. It enables us to improve the overall site, make it easier to navigate, and allows us to provide additional, updated information in the most popular areas.</p>
<p>To learn more about our third-party ad-serving partner, cookies, and how to opt out of customized Google Display Network ads or adjust your settings, please visit Google Ads Preferences Manager to adjust your settings.</p>`;

const fallbackData = {
  hero: {
    isEnabled: true,
    pageTitle: 'Privacy Policy',
    breadcrumbLabel: 'Privacy Policy',
    backgroundImage: ''
  },
  content: defaultContent,
  seo: {
    metaTitle: 'Privacy Policy | DMC Trichology',
    metaDescription: 'Read the privacy policy of DMC Trichology covering how we collect, use and protect your personal information.',
    ogImage: ''
  }
};

function normalizePayload(data = {}) {
  return {
    hero: {
      isEnabled: data.hero?.isEnabled !== false,
      pageTitle: data.hero?.pageTitle || fallbackData.hero.pageTitle,
      breadcrumbLabel: data.hero?.breadcrumbLabel || fallbackData.hero.breadcrumbLabel,
      backgroundImage: data.hero?.backgroundImage || ''
    },
    content: typeof data.content === 'string' && data.content.trim() ? data.content : fallbackData.content,
    seo: {
      metaTitle: data.seo?.metaTitle || fallbackData.seo.metaTitle,
      metaDescription: data.seo?.metaDescription || fallbackData.seo.metaDescription,
      ogImage: data.seo?.ogImage || ''
    }
  };
}

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
    console.error('Error fetching Privacy Policy settings:', error);
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

    return res.status(200).json({ success: true, data: payload });
  } catch (error) {
    console.error('Error updating Privacy Policy settings:', error);
    return res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const url = await uploadToSupabase(req.file, 'privacy_policy_assets');
    return res.status(200).json({ success: true, url });
  } catch (error) {
    console.error('Error uploading Privacy Policy image:', error);
    return res.status(500).json({ success: false, message: 'Server error uploading image' });
  }
};
