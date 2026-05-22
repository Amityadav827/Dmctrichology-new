const AboutDrNivedita = require('../models/AboutDrNivedita');
const AboutDrNiveditaLead = require('../models/AboutDrNiveditaLead');
const uploadToSupabase = require('../utils/uploadToSupabase');

// Standard fallback data for absolute SSR safety
const fallbackData = {
  hero: {
    backgroundImage: '',
    doctorImage: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png',
    mainHeading: 'EXPERT DERMATOLOGIST & TRICHOLOGIST IN DELHI',
    doctorName: 'Dr. Nivedita Dadu',
    degreeText: 'MBBS, MD (Dermatology)',
    descriptionParagraph: 'Dr. Nivedita Dadu is a renowned Dermatologist and Trichologist with over 15 years of clinical excellence. As the co-founder of DMC Trichology, she combines cutting-edge dermatological expertise with advanced hair restoration science to deliver transformative results for her patients.',
    namePlaceholder: 'Name*',
    phonePlaceholder: 'Mobile Number*',
    emailPlaceholder: 'E-Mail Address*',
    datePlaceholder: 'Select Preferred Date*',
    messagePlaceholder: 'Enter Your Message Here',
    captchaPlaceholder: 'Code*',
    submitButtonText: 'Schedule Your Visit',
    backgroundColor: '#3b5998',
    overlayOpacity: 0.45
  },
  breadcrumb: {
    parentLabel: 'Home',
    parentUrl: '/',
    currentPageText: 'About Dr Nivedita Dadu',
    backgroundColor: '#f8f9fa'
  },
  specialist: {
    heading: 'Best Dermatologist & Hair Specialist in Delhi',
    description1: 'Dr. Nivedita Dadu is a distinguished dermatologist and trichologist recognized for her exceptional patient outcomes and research contributions. A fellow of prestigious dermatological societies, she brings unparalleled clinical depth to every patient interaction at DMC Trichology.',
    description2: 'Combining her mastery in dermatology with advanced trichological sciences, Dr. Nivedita delivers comprehensive scalp health solutions — from non-surgical hair restoration therapies to advanced diagnostic protocols — ensuring each patient receives the most effective, evidence-based care.',
    highlightedText: 'She specializes in cutting-edge treatments including:',
    bullets: [
      'Advanced PRP & GFC Therapy',
      'FUE Hair Transplant Surgery',
      'Scalp Micropigmentation',
      'LLLT (Laser Hair Therapy)',
      'Custom Trichological Protocols'
    ],
    sectionBgColor: '#ffffff',
    cardBgColor: '#3b5998'
  },
  membership: {
    sectionHeading: 'MEMBERSHIP',
    sectionBgColor: '#ffffff',
    paddingTop: '60px',
    paddingBottom: '60px',
    logos: [
      { id: 1, title: 'EADV', imageUrl: '', link: '', enabled: true },
      { id: 2, title: 'IAM', imageUrl: '', link: '', enabled: true },
      { id: 3, title: 'IADVL', imageUrl: '', link: '', enabled: true },
      { id: 4, title: 'Trichology Society', imageUrl: '', link: '', enabled: true },
      { id: 5, title: 'ISOINEL', imageUrl: '', link: '', enabled: true }
    ]
  },
  educationExperience: {
    sectionBgColor: '#FFFFFF',
    educationTitle: 'EDUCATION',
    experienceTitle: 'EXPERIENCE',
    educationItems: [
      { degree: 'MBBS', institution: 'Himalayan Institute of Medical Sciences (HIMS), Dehradun', year: '2000' },
      { degree: 'MD (Dermatology)', institution: 'Himalayan Institute of Medical Sciences (HIMS), Dehradun', year: '2004' }
    ],
    experienceItems: [
      { role: 'Senior Dermatologist', hospital: 'Dr. Ram Manohar Lohia Hospital, New Delhi', duration: '2004 - 2008' },
      { role: 'Fellowship In Hair Science & Trichology', hospital: 'King Edward Memorial Hospital, Mumbai', duration: '2008 - 2010' },
      { role: 'Consultant Dermatologist', hospital: 'Primus Hospital, New Delhi', duration: '2010 - 2012' },
      { role: 'Co-Founder & Senior Dermatologist', hospital: 'DMC Trichology, New Delhi', duration: '2012 - Present' }
    ]
  },
  credentialsSection: {
    bannerImage: '',
    overlayOpacity: 0.35,
    heading: 'Credentials',
    credentialsList: [
      { text: 'Fellowship In Aesthetic Dermatology' },
      { text: 'Fellowship In Hair Science' },
      { text: 'Member — IADVL (Indian Association of Dermatologists)' }
    ],
    leftHeading: 'EXPERTISE IN DERMATOLOGY & HAIR TREATMENT',
    leftText: '<p>Dr. Nivedita Dadu\'s cutting-edge Hair Loss Treatment techniques have made a significant difference. She is recognized as a <strong>leading dermatologist and trichologist in Delhi</strong> available at DMC Trichology.</p>',
    rightHeading: 'COMMITMENT TO PATIENT CARE',
    rightText: '<p>Dr. Nivedita Dadu places a high value on the doctor-patient relationship, ensuring individualized care at every step of the treatment journey.</p>',
    paddingBottom: '80px'
  },
  otherSpecialitiesSection: {
    heading: 'Other Specialities',
    introParagraph: 'Apart from being a leading expert in Trichological Sciences, Dr. Nivedita Dadu is also a diligent specialist in advanced dermatology, performing a number of cosmetic procedures such as:',
    specialitiesList: [
      { title: 'Laser Skin Resurfacing & Rejuvenation,' },
      { title: 'Chemical Peels & Advanced Facials,' },
      { title: 'Botox, Fillers & Anti-Ageing Treatments,' },
      { title: 'Pigmentation & Melasma Management,' },
      { title: 'Acne & Scar Treatment Protocols.' }
    ],
    conclusionParagraph: 'For more information, contact the **best dermatologist in Delhi** at DMC Trichology. We have our centres located at Vasant Vihar (South Delhi) & Rajouri Garden (West Delhi).',
    image: '',
    imageAlt: 'Dr. Nivedita Other Specialities',
    backgroundColor: '#ffffff',
    cardBackgroundColor: '#3b5998',
    contentMaxWidth: '1200px',
    paddingTop: '100px',
    paddingBottom: '100px',
    gridGap: '70px'
  },
  seo: {
    metaTitle: 'Dr. Nivedita Dadu | Expert Dermatologist & Trichologist in Delhi',
    metaDescription: 'Consult Dr. Nivedita Dadu, renowned Dermatologist and Trichologist at DMC Trichology Delhi. Expert in advanced hair restoration, scalp treatments, and dermatological care.',
    ogImage: ''
  }
};

// ==========================================
// 1. PAGE SETTINGS CMS API
// ==========================================

exports.getSettings = async (req, res) => {
  try {
    const settings = await AboutDrNivedita.findOne();
    if (!settings) {
      return res.status(200).json({ success: true, data: fallbackData, isFallback: true });
    }
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching Dr. Nivedita page settings:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const updateData = req.body;
    const settings = await AboutDrNivedita.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json({ success: true, data: settings, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating Dr. Nivedita page settings:', error);
    return res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }
    const publicUrl = await uploadToSupabase(req.file, 'dr_nivedita_assets');
    return res.status(200).json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Error uploading Dr. Nivedita asset:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. ISOLATED LEADS API
// ==========================================

exports.createLead = async (req, res, next) => {
  try {
    const { name, email, mobile, service, appointmentDate, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your name.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your email address.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
    if (!mobile || !mobile.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your mobile number.' });
    }

    const trimmedMobile = mobile.trim().replace(/\s+/g, '');
    if (!/^\d{10}$/.test(trimmedMobile)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
    }
    if (!appointmentDate) {
      return res.status(400).json({ success: false, message: 'Please select a preferred appointment date.' });
    }

    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const existing = await AboutDrNiveditaLead.findOne({
      mobile: trimmedMobile,
      createdAt: { $gte: twoMinutesAgo }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a consultation request. Please wait a moment.'
      });
    }

    const lead = await AboutDrNiveditaLead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: trimmedMobile,
      service: service ? service.trim() : 'Dr. Nivedita Dadu Consultation',
      appointmentDate: new Date(appointmentDate),
      message: message ? message.trim() : '',
      status: 'new',
      notes: ''
    });

    return res.status(201).json({
      success: true,
      data: lead,
      message: 'Lead created successfully in Dr. Nivedita leads'
    });
  } catch (error) {
    console.error('Error creating Dr. Nivedita lead:', error);
    next(error);
  }
};

exports.getLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const queryObj = {};

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      queryObj.$or = [
        { name: searchRegex }, { email: searchRegex },
        { mobile: searchRegex }, { service: searchRegex }
      ];
    }
    if (req.query.status) queryObj.status = req.query.status.trim();
    if (req.query.startDate || req.query.endDate) {
      queryObj.createdAt = {};
      if (req.query.startDate) queryObj.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) queryObj.createdAt.$lte = new Date(`${req.query.endDate}T23:59:59.999Z`);
    }

    const sortObj = {};
    sortObj[req.query.sortBy || 'createdAt'] = req.query.sortOrder === 'asc' ? 1 : -1;

    const total = await AboutDrNiveditaLead.countDocuments(queryObj);
    const leads = await AboutDrNiveditaLead.find(queryObj).sort(sortObj).skip(skip).limit(limit);

    return res.status(200).json({
      success: true, count: leads.length, data: leads,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Error fetching Dr. Nivedita leads:', error);
    next(error);
  }
};

exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await AboutDrNiveditaLead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error('Error fetching single lead:', error);
    next(error);
  }
};

exports.updateLeadStatus = async (req, res, next) => {
  try {
    const { status, notes, service } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (service) updates.service = service;

    const lead = await AboutDrNiveditaLead.findByIdAndUpdate(
      req.params.id, { $set: updates }, { new: true, runValidators: true }
    );
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    return res.status(200).json({ success: true, data: lead, message: 'Lead updated successfully' });
  } catch (error) {
    console.error('Error updating lead status:', error);
    next(error);
  }
};

exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await AboutDrNiveditaLead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    return res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    next(error);
  }
};

exports.bulkDeleteLeads = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide valid lead IDs to delete' });
    }
    await AboutDrNiveditaLead.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({ success: true, message: 'Selected leads deleted successfully' });
  } catch (error) {
    console.error('Error in bulk delete:', error);
    next(error);
  }
};

exports.exportCsv = async (req, res, next) => {
  try {
    const queryObj = {};
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      queryObj.$or = [
        { name: searchRegex }, { email: searchRegex },
        { mobile: searchRegex }, { service: searchRegex }
      ];
    }
    if (req.query.status) queryObj.status = req.query.status.trim();
    if (req.query.startDate || req.query.endDate) {
      queryObj.createdAt = {};
      if (req.query.startDate) queryObj.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) queryObj.createdAt.$lte = new Date(`${req.query.endDate}T23:59:59.999Z`);
    }

    const leads = await AboutDrNiveditaLead.find(queryObj).sort({ createdAt: -1 });
    let csv = 'ID,Name,Email,Mobile,Service,AppointmentDate,Status,Notes,CreatedAt\n';
    leads.forEach(row => {
      const apptDateStr = row.appointmentDate ? new Date(row.appointmentDate).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      const createdStr = row.createdAt ? new Date(row.createdAt).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      csv += `"${row._id}","${(row.name||'').replace(/"/g,'""')}","${row.email}","${row.mobile}","${(row.service||'').replace(/"/g,'""')}","${apptDateStr}","${row.status}","${(row.notes||'').replace(/"/g,'""')}","${createdStr}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=dr-nivedita-leads.csv');
    return res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting leads to CSV:', error);
    next(error);
  }
};
