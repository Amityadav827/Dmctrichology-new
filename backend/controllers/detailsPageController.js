const supabase = require('../config/supabase');

const CMS_KEY = 'details_page';

exports.getDetailsPage = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    if (error && error.code !== 'PGRST116') throw error;
    res.status(200).json({ success: true, data: row?.data || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDetailsPage = async (req, res) => {
  try {
    const { data: existing } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    const current = existing?.data || {};

    const merged = { ...current };

    if (req.body.banner) {
      merged.banner = { ...(current.banner || {}), ...req.body.banner };
    }

    if (req.body.intro) {
      const { introImages, benefits, videoGallery, bulletPoints, ...introFields } = req.body.intro;
      merged.intro = { ...(current.intro || {}), ...introFields };
      if (introImages !== undefined) merged.intro.introImages = introImages;
      if (benefits !== undefined) merged.intro.benefits = benefits;
      if (videoGallery !== undefined) merged.intro.videoGallery = videoGallery;
      if (bulletPoints !== undefined) merged.intro.bulletPoints = bulletPoints;
    }

    if (req.body.process) {
      const { processSteps, ...processFields } = req.body.process;
      merged.process = { ...(current.process || {}), ...processFields };
      if (processSteps !== undefined) merged.process.processSteps = processSteps;
    }

    if (req.body.beforeAfter) {
      const { beforePoints, afterPoints, ...baFields } = req.body.beforeAfter;
      merged.beforeAfter = { ...(current.beforeAfter || {}), ...baFields };
      if (beforePoints !== undefined) merged.beforeAfter.beforePoints = beforePoints;
      if (afterPoints !== undefined) merged.beforeAfter.afterPoints = afterPoints;
    }

    if (req.body.faqEnquiry) {
      const { faqItems, serviceOptions, ...faqFields } = req.body.faqEnquiry;
      merged.faqEnquiry = { ...(current.faqEnquiry || {}), ...faqFields };
      if (faqItems !== undefined) merged.faqEnquiry.faqItems = faqItems;
      if (serviceOptions !== undefined) merged.faqEnquiry.serviceOptions = serviceOptions;
    }

    if (req.body.idealFrequency) {
      const { idealForPoints, notIdealForPoints, ...ifFields } = req.body.idealFrequency;
      merged.idealFrequency = { ...(current.idealFrequency || {}), ...ifFields };
      if (idealForPoints !== undefined) merged.idealFrequency.idealForPoints = idealForPoints;
      if (notIdealForPoints !== undefined) merged.idealFrequency.notIdealForPoints = notIdealForPoints;
    }

    const { error } = await supabase.from('cms_sections')
      .upsert({ key: CMS_KEY, data: merged, updated_at: new Date() }, { onConflict: 'key' });
    if (error) throw error;

    res.status(200).json({ success: true, data: merged });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
