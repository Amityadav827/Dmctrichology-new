const ContactPage = require("../models/ContactPage");

// GET — return entire contact page data
exports.getContactPage = async (req, res) => {
  try {
    let data = await ContactPage.findOne();
    if (!data) {
      data = await ContactPage.create({});
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT — update contact page data
exports.updateContactPage = async (req, res) => {
  try {
    let data = await ContactPage.findOne();
    if (!data) {
      data = await ContactPage.create(req.body);
    } else {
      // Update nested sections if they exist in request body
      if (req.body.hero) Object.assign(data.hero, req.body.hero);
      
      if (req.body.consultation) {
        const { serviceOptions, ...otherCons } = req.body.consultation;
        Object.assign(data.consultation, otherCons);
        if (serviceOptions) {
          data.consultation.serviceOptions = serviceOptions;
          data.markModified("consultation.serviceOptions");
        }
      }

      if (req.body.map) Object.assign(data.map, req.body.map);

      await data.save();
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
