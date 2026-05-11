const DetailsPage = require("../models/DetailsPage");

// GET — return entire details page data
exports.getDetailsPage = async (req, res) => {
  try {
    let data = await DetailsPage.findOne();
    if (!data) {
      data = await DetailsPage.create({});
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT — update entire details page data
exports.updateDetailsPage = async (req, res) => {
  try {
    let data = await DetailsPage.findOne();
    if (!data) {
      data = await DetailsPage.create(req.body);
    } else {
      // Deep merge: only update sent fields
      if (req.body.banner) Object.assign(data.banner, req.body.banner);
      if (req.body.intro) {
        Object.assign(data.intro, req.body.intro);
        if (req.body.intro.videoGallery !== undefined) {
          data.intro.videoGallery = req.body.intro.videoGallery;
          data.markModified("intro.videoGallery");
        }
        if (req.body.intro.bulletPoints !== undefined) {
          data.intro.bulletPoints = req.body.intro.bulletPoints;
          data.markModified("intro.bulletPoints");
        }
      }
      if (req.body.process) {
        Object.assign(data.process, req.body.process);
        if (req.body.process.processSteps !== undefined) {
          data.process.processSteps = req.body.process.processSteps;
          data.markModified("process.processSteps");
        }
      }
      if (req.body.beforeAfter) {
        Object.assign(data.beforeAfter, req.body.beforeAfter);
        if (req.body.beforeAfter.beforePoints !== undefined) {
          data.beforeAfter.beforePoints = req.body.beforeAfter.beforePoints;
          data.markModified("beforeAfter.beforePoints");
        }
        if (req.body.beforeAfter.afterPoints !== undefined) {
          data.beforeAfter.afterPoints = req.body.beforeAfter.afterPoints;
          data.markModified("beforeAfter.afterPoints");
        }
      }
      if (req.body.faqEnquiry) {
        Object.assign(data.faqEnquiry, req.body.faqEnquiry);
        if (req.body.faqEnquiry.faqItems !== undefined) {
          data.faqEnquiry.faqItems = req.body.faqEnquiry.faqItems;
          data.markModified("faqEnquiry.faqItems");
        }
        if (req.body.faqEnquiry.serviceOptions !== undefined) {
          data.faqEnquiry.serviceOptions = req.body.faqEnquiry.serviceOptions;
          data.markModified("faqEnquiry.serviceOptions");
        }
      }
      if (req.body.idealFrequency) {
        Object.assign(data.idealFrequency, req.body.idealFrequency);
        if (req.body.idealFrequency.idealForPoints !== undefined) {
          data.idealFrequency.idealForPoints = req.body.idealFrequency.idealForPoints;
          data.markModified("idealFrequency.idealForPoints");
        }
        if (req.body.idealFrequency.notIdealForPoints !== undefined) {
          data.idealFrequency.notIdealForPoints = req.body.idealFrequency.notIdealForPoints;
          data.markModified("idealFrequency.notIdealForPoints");
        }
      }
      await data.save();
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
