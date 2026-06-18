const supabase = require('../config/supabase');
const uploadToSupabase = require('../utils/uploadToSupabase');
const { sendLeadToTelecrm } = require('../services/telecrmService');

const CMS_KEY = 'about_dr_nandani';

// Standard fallback data for absolute SSR safety
const fallbackData = {
  hero: {
    backgroundImage: "",
    mainImage: "",
    doctorImage: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
    mainHeading: "BEST HAIR TRANSPLANT SURGEON IN DELHI",
    doctorName: "Dr. Nandani Dadu",
    degreeText: "MD (Dermatology)",
    descriptionParagraph: "Dr. Nandini Dadu, MBBS, a Board-Certified Trichologist, has been studying hair and scalp treatments for over ten years. Throughout her career, she has successfully treated severe cases with excellent outcomes and has attained the title of the best hair transplant surgeon in Delhi.",
    pageEyebrow: "About DMC Trichology",
    statsCards: [
      { label: "10+ Years Experience" },
      { label: "Thousands of Successful Cases" },
      { label: "Board Certified Specialist" }
    ],
    namePlaceholder: "Name*",
    phonePlaceholder: "Mobile Number*",
    captchaPlaceholder: "Code*",
    submitButtonText: "Schedule Your Visit",
    backgroundColor: "#3b5998",
    overlayOpacity: 0.4
  },
  specialist: {
    heading: "Best Hair Specialist in Delhi",
    description1: "Dr. Nandini Dadu is a well-known former consultant at ARTEMIS HOSPITAL in Gurgaon. Over the years, she has provided insights to several dignitaries and celebrities in New Delhi. She is the best hair specialist in Delhi. She works in close collaboration with doctors at Hair Care & Transplant Surgeons and is always looking for new, cutting-edge products for hair and scalp care treatments.",
    description2: "Being a specialist in the cosmetological and trichological sciences combined, Dr. Nandini is dedicated to thorough diagnosis, effective treatment processes, and the best DMC Golden Touch Techniques for generating amazing outcomes at the highest level of client satisfaction. So, to get the long-lasting effects opt to get treated by the best hair specialist in Delhi only at DMC Trichology.",
    highlightedText: "She employs cutting-edge knowledge in Hair & Scalp Treatments with:",
    bullets: ["MESOGROW", "ADVANCED HGP", "ADVANCED HGP 2.0", "RRT (ROOT RESTORE THERAPY)", "FUE TECHNIQUE (Follicular Hair Transplant)"],
    featureCards: [
      { title: "Advanced Hair Restoration" },
      { title: "Hair Transplant Expertise" },
      { title: "Scalp & Hair Diagnosis" },
      { title: "Personalized Treatment Plans" }
    ],
    sectionBgColor: "#FFFFFF"
  },
  timeline: {
    eyebrow: "TRUSTED CARE SERVICES",
    heading: "What Makes Dr. Nandani Dadu The Best Hair Transplant Surgeon In Delhi?",
    image: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1780906825092-79561886.webp",
    imageAlt: "Dr. Nandani Dadu hair restoration care",
    sectionBgColor: "#FFFFFF",
    contentMaxWidth: "1220px",
    maxHeight: "340px",
    paddingTop: "56px",
    paddingBottom: "56px"
  },
  trustSection: {
    eyebrow: "TRUSTED CARE SERVICES",
    heading: "Why Do Patients Trust Dr. Nandani Dadu As A Hair Transplant Doctor In Delhi?",
    image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777623481/dmc-trichology/sfqfld2ikbs00iqncyse.png",
    imageAlt: "Hair transplant treatment planning",
    trustPoints: [
      {
        title: "Unparalleled Expertise",
        description: "Dr. Nandani Dadu performs the best hair loss, thinning, and baldness procedures. She has continuously contributed to improving many lives by providing excellent hair transplant results. Through her honesty, hard work, and passionate service, she aims to change every frown into a smile."
      },
      {
        title: "Vast Hair Restoration Procedures",
        description: "Her expertise lies in hair procedures, such as DMC Mesogrow, Advanced HGP, Keravive Hair, Hair Rituals, and DMC-Golden Touch for hair transplants."
      },
      {
        title: "Expert In Complex Procedures",
        description: "She also takes a keen interest in performing complex procedures, such as repair hair transplants, body hair transplants, high-density transplants, her signature approach, DMC-Golden Touch, and more."
      },
      {
        title: "Expert Precision For Natural Results",
        description: "When it comes to hair transplants, the key factor is that the results should look natural. Dr. Dadu utilises her artistic abilities to provide a natural hairline. It gives patients confidence and leaves no proof that they underwent a hair transplant."
      }
    ],
    conclusionParagraph: "Dr. Nandani Dadu is a renowned hair transplant doctor in Delhi. She is an expert who provides safe, effective, and natural-looking results to all her patients. The doctor performs a thorough scalp examination to determine the extent of hair loss and then suggests the most suitable hair transplant technique. Those willing to restore their hair and are looking for expert help must consult Dr. Nandani Dadu now!",
    backgroundColor: "#e8eaf6",
    contentMaxWidth: "1300px",
    paddingTop: "92px",
    paddingBottom: "92px"
  },
  educationExperience: {
    sectionBgColor: "#FFFFFF",
    experienceTabLabel: "Experience",
    educationTabLabel: "Education",
    credentialsTabLabel: "Credentials",
    experienceTitle: "Experience",
    educationTitle: "Education",
    topImage: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
    bottomImage: "https://res.cloudinary.com/dseixl6px/image/upload/v1777623481/dmc-trichology/sfqfld2ikbs00iqncyse.png",
    experienceItems: [
      {
        role: "Senior Resident Anaesthesia & Critical Care",
        hospital: "Dr. Ram Manohar Lohia Hospital, New Delhi",
        duration: "2014 - 2017"
      },
      {
        role: "Fellowship In Pain Medicine",
        hospital: "King Edward Memorial Hospital, Mumbai",
        duration: "2017 - 2018"
      },
      {
        role: "Attending Consultant Anaesthesia & Critical Care",
        hospital: "Primus Hospital, New Delhi",
        duration: "2018"
      },
      {
        role: "Consultant Pain Medicine & Palliative Care",
        hospital: "Artemis Hospital, Gurgaon",
        duration: "2018 - 2020"
      },
      {
        role: "Senior Consultant Hair Transplant Surgeon",
        hospital: "Dadu Medical Centre, New Delhi",
        duration: "2020 - Present"
      }
    ],
    educationItems: [
      {
        degree: "MBBS",
        institution: "Himalayan Institute of Medical Sciences (HIMS), Dehradun",
        year: "2005"
      },
      {
        degree: "Diploma In Anaesthesia & Critical Care",
        institution: "Himalayan Institute of Medical Sciences (HIMS), Dehradun",
        year: "2012"
      }
    ]
  },
  credentialsSection: {
    heading: "Credentials",
    credentialsList: [
      { text: "Fellowship In Aesthetic Medicine" },
      { text: "Fellowship In Hair Science" },
      { text: "Fellowship In Pain Medicine" }
    ]
  },
  testimonialsSection: {
    heading: "Patient Testimonials",
    patientImage: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1780711038023-933757138.webp",
    testimonials: [
      {
        text: "Dr. Nandani Dadu is an excellent hair specialist in Delhi. I visited her clinic for hair loss treatment, and the results have been outstanding. She is very knowledgeable and patient, taking time to explain everything clearly.",
        patientName: "Sanadhan Chaima",
        image: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1780711038023-933757138.webp",
        disclaimer: "* Opinions/Results may vary from person to person.",
        stars: 5
      }
    ]
  }
};

// ==========================================
// 1. PAGE SETTINGS CMS API
// ==========================================

exports.getSettings = async (req, res) => {
  try {
    const { data: row, error } = await supabase
      .from('cms_sections').select('data').eq('key', CMS_KEY).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!row) {
      return res.status(200).json({ success: true, data: fallbackData, isFallback: true });
    }
    return res.status(200).json({ success: true, data: row.data || {} });
  } catch (error) {
    console.error("Error fetching Dr. Nandani page settings:", error);
    return res.status(500).json({ success: false, message: "Server error fetching settings" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { error } = await supabase.from('cms_sections')
      .upsert({ key: CMS_KEY, data: req.body, updated_at: new Date() }, { onConflict: 'key' });
    if (error) throw error;
    return res.status(200).json({ success: true, data: req.body, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating Dr. Nandani page settings:", error);
    return res.status(500).json({ success: false, message: "Server error updating settings" });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }
    const publicUrl = await uploadToSupabase(req.file, 'dr_nandani_assets');
    return res.status(200).json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Error uploading Dr. Nandani asset:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. ISOLATED LEADS API (science_consultation_leads table)
// ==========================================

exports.createLead = async (req, res, next) => {
  try {
    const { name, mobile, email, service } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Please enter your name." });
    }
    if (!mobile || !mobile.trim()) {
      return res.status(400).json({ success: false, message: "Please enter your mobile number." });
    }
    if (email && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }

    const trimmedMobile = mobile.trim().replace(/\s+/g, '');
    const trimmedEmail = email && email.trim() ? email.trim().toLowerCase() : null;
    if (!/^\d{10}$/.test(trimmedMobile)) {
      return res.status(400).json({ success: false, message: "Please enter a valid 10-digit mobile number." });
    }

    // Duplicate prevention: same mobile in last 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const { data: existing } = await supabase
      .from('science_consultation_leads')
      .select('id')
      .eq('mobile', trimmedMobile)
      .gte('created_at', twoMinutesAgo)
      .limit(1);

    if (existing && existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a consultation request. Please wait a moment."
      });
    }

    const { data: lead, error } = await supabase
      .from('science_consultation_leads')
      .insert({
        name: name.trim(),
        email: trimmedEmail,
        mobile: trimmedMobile,
        service: service ? service.trim() : "Dr. Nandani Dadu Consultation",
        status: "new"
      })
      .select()
      .single();

    if (error) throw error;

    sendLeadToTelecrm({
      name: lead.name,
      mobile: lead.mobile,
      source: "Dr. Nandani Consultation Form"
    }).catch((crmError) => {
      console.error("TeleCRM Dr. Nandani lead sync failed:", crmError.response?.data || crmError.message);
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

exports.getLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let query = supabase.from('science_consultation_leads').select('*', { count: 'exact' });

    if (req.query.search) {
      const s = req.query.search.trim();
      query = query.or(`name.ilike.%${s}%,email.ilike.%${s}%,mobile.ilike.%${s}%,service.ilike.%${s}%`);
    }

    if (req.query.status) {
      query = query.eq('status', req.query.status.trim());
    }

    if (req.query.startDate) {
      query = query.gte('created_at', new Date(req.query.startDate).toISOString());
    }
    if (req.query.endDate) {
      query = query.lte('created_at', new Date(`${req.query.endDate}T23:59:59.999Z`).toISOString());
    }

    const sortBy = req.query.sortBy === 'appointmentDate' ? 'appointment_date' : 'created_at';
    const ascending = req.query.sortOrder === 'asc';
    query = query.order(sortBy, { ascending }).range(offset, offset + limit - 1);

    const { data: leads, error, count } = await query;
    if (error) throw error;

    return res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching Dr. Nandani leads:", error);
    next(error);
  }
};

exports.getLeadById = async (req, res, next) => {
  try {
    const { data: lead, error } = await supabase
      .from('science_consultation_leads')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error("Error fetching single lead:", error);
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

    const { data: lead, error } = await supabase
      .from('science_consultation_leads')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    return res.status(200).json({ success: true, data: lead, message: "Lead updated successfully" });
  } catch (error) {
    console.error("Error updating lead status:", error);
    next(error);
  }
};

exports.deleteLead = async (req, res, next) => {
  try {
    const { data: lead, error } = await supabase
      .from('science_consultation_leads')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    return res.status(200).json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting lead:", error);
    next(error);
  }
};

exports.bulkDeleteLeads = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide valid lead IDs to delete" });
    }

    const { error } = await supabase
      .from('science_consultation_leads')
      .delete()
      .in('id', ids);
    if (error) throw error;

    return res.status(200).json({ success: true, message: "Selected leads deleted successfully" });
  } catch (error) {
    console.error("Error in bulk delete:", error);
    next(error);
  }
};

exports.exportCsv = async (req, res, next) => {
  try {
    let query = supabase.from('science_consultation_leads').select('*').order('created_at', { ascending: false });

    if (req.query.search) {
      const s = req.query.search.trim();
      query = query.or(`name.ilike.%${s}%,email.ilike.%${s}%,mobile.ilike.%${s}%,service.ilike.%${s}%`);
    }
    if (req.query.status) {
      query = query.eq('status', req.query.status.trim());
    }
    if (req.query.startDate) {
      query = query.gte('created_at', new Date(req.query.startDate).toISOString());
    }
    if (req.query.endDate) {
      query = query.lte('created_at', new Date(`${req.query.endDate}T23:59:59.999Z`).toISOString());
    }

    const { data: leads, error } = await query;
    if (error) throw error;

    let csv = "ID,Name,Email,Mobile,Service,AppointmentDate,Status,Notes,CreatedAt\n";
    leads.forEach(row => {
      const apptDateStr = row.appointment_date ? new Date(row.appointment_date).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      const createdStr = row.created_at ? new Date(row.created_at).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      csv += `"${row.id}","${(row.name || '').replace(/"/g, '""')}","${row.email}","${row.mobile}","${(row.service || '').replace(/"/g, '""')}","${apptDateStr}","${row.status}","${(row.notes || '').replace(/"/g, '""')}","${createdStr}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=dr-nandani-leads.csv");
    return res.status(200).send(csv);
  } catch (error) {
    console.error("Error exporting leads to CSV:", error);
    next(error);
  }
};
