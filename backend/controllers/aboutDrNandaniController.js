const AboutDrNandani = require('../models/AboutDrNandani');
const AboutDrNandaniLead = require('../models/AboutDrNandaniLead');
const uploadToSupabase = require('../utils/uploadToSupabase');

// Standard fallback data for absolute SSR safety
const fallbackData = {
  hero: {
    badge: "PIONEERING TRICHOLOGY & DERMATOLOGY",
    title: "Dr. Nandani Dadu",
    subtitle: "MD (Dermatology), Founder & Director. A pioneering hair transplant surgeon and dermatologist bringing elite clinical precision to customized hair restoration.",
    credentials: [
      "MD - Dermatology, Venereology & Leprosy",
      "Gold Medalist in Aesthetic Dermatology",
      "15+ Years of Clinical Expertise",
      "5,000+ Successful Hair Transformations"
    ],
    image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
    ctaText: "Book Luxury Consultation"
  },
  intro: {
    heading: "Delhi's Premier Hair Specialist & Clinical Director",
    description: "<p>Dr. Nandani Dadu is highly regarded as one of India's finest hair restoration specialists, merging state-of-the-art US-FDA approved technologies with refined artistic precision. As the Clinical Director, she has spent over a decade perfecting custom trichological protocols that deliver exceptional, natural-looking hair density.</p><p>Her signature therapies combine advanced cellular growth treatments, high-density FUE transplants, and custom scalp rejuvenation programs designed uniquely for each physiological profile.</p>",
    bulletList: [
      "Clinical expertise with 15+ years of specialized hair treatment experience.",
      "Customized high-density hairline designs backed by medical science.",
      "State-of-the-art clinical theater with advanced sterile protocols.",
      "Comprehensive pre-and-post care guidance for long-term retention."
    ],
    ctaText: "Discover Signature Treatments"
  },
  formSettings: {
    title: "Request Private Consultation",
    subtitle: "Reserve your bespoke scalp assessment and consultation session.",
    successMessage: "Your consultation request has been successfully submitted to Dr. Nandani Dadu's private desk. Our concierge team will reach out to you shortly."
  },
  seo: {
    metaTitle: "Dr. Nandani Dadu | Best Hair Restoration Specialist & Trichologist",
    metaDescription: "Consult Delhi's premier hair restoration specialist, Dr. Nandani Dadu. Experience luxury clinical consultations, high-density transplants, and customized scalp treatments.",
    ogImage: ""
  }
};

// ==========================================
// 1. PAGE SETTINGS CMS API
// ==========================================

// Get settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await AboutDrNandani.findOne();
    if (!settings) {
      // If collection is empty, gracefully return standard fallbacks
      return res.status(200).json({ success: true, data: fallbackData, isFallback: true });
    }
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error("Error fetching Dr. Nandani page settings:", error);
    return res.status(500).json({ success: false, message: "Server error fetching settings" });
  }
};

// Update settings (upsert single document)
exports.updateSettings = async (req, res) => {
  try {
    const updateData = req.body;
    const settings = await AboutDrNandani.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json({ success: true, data: settings, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating Dr. Nandani page settings:", error);
    return res.status(500).json({ success: false, message: "Server error updating settings" });
  }
};

// Upload media helper
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }
    // Upload into isolated folder bucket
    const publicUrl = await uploadToSupabase(req.file, 'dr_nandani_assets');
    return res.status(200).json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Error uploading Dr. Nandani asset:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. ISOLATED LEADS API
// ==========================================

// Create new lead
exports.createLead = async (req, res, next) => {
  try {
    const { name, email, mobile, service, appointmentDate, message } = req.body;

    // Server-side validations
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Please enter your name." });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Please enter your email address." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }
    if (!mobile || !mobile.trim()) {
      return res.status(400).json({ success: false, message: "Please enter your mobile number." });
    }
    
    const trimmedMobile = mobile.trim().replace(/\s+/g, '');
    if (!/^\d{10}$/.test(trimmedMobile)) {
      return res.status(400).json({ success: false, message: "Please enter a valid 10-digit mobile number." });
    }
    if (!appointmentDate) {
      return res.status(400).json({ success: false, message: "Please select a preferred appointment date." });
    }

    // Duplicate screening (prevent multiple clicks/spam in last 2 minutes for same mobile)
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const existing = await AboutDrNandaniLead.findOne({
      mobile: trimmedMobile,
      createdAt: { $gte: twoMinutesAgo }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a consultation request. Please wait a moment."
      });
    }

    const lead = await AboutDrNandaniLead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: trimmedMobile,
      service: service ? service.trim() : "Dr. Nandani Dadu Consultation",
      appointmentDate: new Date(appointmentDate),
      message: message ? message.trim() : "",
      status: "new",
      notes: ""
    });

    return res.status(201).json({
      success: true,
      data: lead,
      message: "Lead created successfully in Dr. Nandani leads"
    });
  } catch (error) {
    console.error("Error creating Dr. Nandani lead:", error);
    next(error);
  }
};

// Fetch Leads (Search, filter status, date range, pagination, sorts)
exports.getLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const queryObj = {};

    // Live search filter
    if (req.query.search) {
      const searchVal = req.query.search.trim();
      const searchRegex = new RegExp(searchVal, 'i');
      queryObj.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { mobile: searchRegex },
        { service: searchRegex }
      ];
    }

    // Status filter
    if (req.query.status) {
      queryObj.status = req.query.status.trim();
    }

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      queryObj.createdAt = {};
      if (req.query.startDate) {
        queryObj.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        queryObj.createdAt.$lte = new Date(`${req.query.endDate}T23:59:59.999Z`);
      }
    }

    // Sort options
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";
    const sortObj = {};
    sortObj[sortBy] = sortOrder === "asc" ? 1 : -1;

    const total = await AboutDrNandaniLead.countDocuments(queryObj);
    const leads = await AboutDrNandaniLead.find(queryObj)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching Dr. Nandani leads:", error);
    next(error);
  }
};

// Fetch single lead by id
exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await AboutDrNandaniLead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error("Error fetching single lead:", error);
    next(error);
  }
};

// Update lead status & notes
exports.updateLeadStatus = async (req, res, next) => {
  try {
    const { status, notes, service } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (service) updates.service = service;

    const lead = await AboutDrNandaniLead.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    return res.status(200).json({ success: true, data: lead, message: "Lead updated successfully" });
  } catch (error) {
    console.error("Error updating lead status:", error);
    next(error);
  }
};

// Delete single lead
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await AboutDrNandaniLead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    return res.status(200).json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting lead:", error);
    next(error);
  }
};

// Bulk Delete leads
exports.bulkDeleteLeads = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide valid lead IDs to delete" });
    }

    await AboutDrNandaniLead.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({ success: true, message: "Selected leads deleted successfully" });
  } catch (error) {
    console.error("Error in bulk delete:", error);
    next(error);
  }
};

// Export to CSV format
exports.exportCsv = async (req, res, next) => {
  try {
    const queryObj = {};

    if (req.query.search) {
      const searchVal = req.query.search.trim();
      const searchRegex = new RegExp(searchVal, 'i');
      queryObj.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { mobile: searchRegex },
        { service: searchRegex }
      ];
    }

    if (req.query.status) {
      queryObj.status = req.query.status.trim();
    }

    if (req.query.startDate || req.query.endDate) {
      queryObj.createdAt = {};
      if (req.query.startDate) {
        queryObj.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        queryObj.createdAt.$lte = new Date(`${req.query.endDate}T23:59:59.999Z`);
      }
    }

    const leads = await AboutDrNandaniLead.find(queryObj).sort({ createdAt: -1 });

    let csv = "ID,Name,Email,Mobile,Service,AppointmentDate,Status,Notes,CreatedAt\n";
    leads.forEach(row => {
      const idStr = row._id.toString();
      const nameStr = row.name.replace(/"/g, '""');
      const emailStr = row.email.replace(/"/g, '""');
      const serviceStr = (row.service || "").replace(/"/g, '""');
      const notesStr = (row.notes || "").replace(/"/g, '""');
      
      const apptDateStr = row.appointmentDate ? new Date(row.appointmentDate).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      const createdStr = row.createdAt ? new Date(row.createdAt).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      
      csv += `"${idStr}","${nameStr}","${emailStr}","${row.mobile}","${serviceStr}","${apptDateStr}","${row.status}","${notesStr}","${createdStr}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=dr-nandani-leads.csv");
    return res.status(200).send(csv);
  } catch (error) {
    console.error("Error exporting leads to CSV:", error);
    next(error);
  }
};
