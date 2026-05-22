const AboutDrNandani = require('../models/AboutDrNandani');
const AboutDrNandaniLead = require('../models/AboutDrNandaniLead');
const uploadToSupabase = require('../utils/uploadToSupabase');

// Standard fallback data for absolute SSR safety
const fallbackData = {
  hero: {
    backgroundImage: "",
    doctorImage: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
    mainHeading: "BEST HAIR TRANSPLANT SURGEON IN DELHI",
    doctorName: "Dr. Nandani Dadu",
    degreeText: "MD (Dermatology)",
    descriptionParagraph: "Dr. Nandini Dadu, MBBS, a Board-Certified Trichologist, has been studying hair and scalp treatments for over ten years. Throughout her career, she has successfully treated severe cases with excellent outcomes and has attained the title of the best hair transplant surgeon in Delhi.",
    namePlaceholder: "Name*",
    phonePlaceholder: "Mobile Number*",
    emailPlaceholder: "E-Mail Address*",
    datePlaceholder: "Select Preferred Date*",
    messagePlaceholder: "Enter Your Message Here",
    captchaPlaceholder: "Code*",
    submitButtonText: "Schedule Your Visit",
    backgroundColor: "#3b5998",
    overlayOpacity: 0.4
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
  },
  breadcrumb: {
    title: "Hair Specialist in Delhi",
    parentLabel: "Home",
    parentUrl: "/",
    currentPageText: "Hair Specialist in Delhi",
    backgroundColor: "#f8f9fa"
  },
  specialist: {
    heading: "Best Hair Specialist in Delhi",
    description1: "Dr. Nandini Dadu is a well-known former consultant at ARTEMIS HOSPITAL in Gurgaon. Over the years, she has provided insights to several dignitaries and celebrities in New Delhi. She is the best hair specialist in Delhi. She works in close collaboration with doctors at Hair Care & Transplant Surgeons and is always looking for new, cutting-edge products for hair and scalp care treatments.",
    description2: "Being a specialist in the cosmetological and trichological sciences combined, Dr. Nandini is dedicated to thorough diagnosis, effective treatment processes, and the best DMC Golden Touch Techniques for generating amazing outcomes at the highest level of client satisfaction. So, to get the long-lasting effects opt to get treated by the best hair specialist in Delhi only at DMC Trichology.",
    highlightedText: "She employs cutting-edge knowledge in Hair & Scalp Treatments with:",
    bullets: ["MESOGROW", "ADVANCED HGP", "ADVANCED HGP 2.0", "RRT (ROOT RESTORE THERAPY)", "FUE TECHNIQUE (Follicular Hair Transplant)"],
    sectionBgColor: "#FFFFFF",
    cardBgColor: "#3b5998"
  },
  timeline: {
    heading: "What Makes Dr. Nandini Dadu the Best Hair Transplant Surgeon in Delhi?",
    sectionBgColor: "#FFFFFF",
    sectionImage: "",
    steps: [
      {
        title: "Compassionate Approach",
        description: "Empathy towards patients makes them feel comfortable and informed.",
        numberLabel: "01",
        colorMode: "gold",
        iconName: "heart"
      },
      {
        title: "Artistic Skills",
        description: "Expert knowledge and artistic approach ensure the latest and most effective treatments.",
        numberLabel: "02",
        colorMode: "navy",
        iconName: "brain"
      },
      {
        title: "Customized Treatment Plan",
        description: "Provide tailored treatments for every unique individual and their needs.",
        numberLabel: "03",
        colorMode: "gold",
        iconName: "kit"
      },
      {
        title: "Advanced Technologies",
        description: "Uses specialized techniques and equipment to achieve maximum results.",
        numberLabel: "04",
        colorMode: "navy",
        iconName: "tech"
      }
    ]
  },
  educationExperience: {
    sectionBgColor: "#FFFFFF",
    educationTitle: "EDUCATION",
    experienceTitle: "EXPERIENCE",
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
    ],
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
    ]
  },
  credentialsSection: {
    bannerImage: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
    overlayOpacity: 0.35,
    heading: "Credentials",
    credentialsList: [
      { text: "Fellowship In Aesthetic Medicine" },
      { text: "Fellowship In Hair Science" },
      { text: "Fellowship In Pain Medicine" }
    ],
    leftHeading: "EXPERTISE IN HAIR & SCALP TREATMENT",
    leftText: "<p>Dr. Nandini Dadu's cutting-edge Hair Loss Treatment technique has made a significant difference in the lives of those suffering from severe hair loss. She is the <strong>best hair specialist in Delhi</strong> available at DMC Trichology in Delhi, Vasant Vihar (South Delhi), & Rajouri Garden (West Delhi). She is solely dedicated to treating male and female hair loss with the most advanced surgical technologies available.</p><p>\"There is way more to hair restoration than JUST SCIENCE. For the optimal outcomes, ARTISTRY & IMAGINATION are required.\"</p><p>Dr. Nandini Dadu has always taken a distinctive approach to hairline design because of her passion for the art and craft of hair restoration procedures. Her primary goal is to achieve natural – superior hairlines while treating the patients' underlying issues. To ensure that her patient is confident and pleased with the most natural-looking and long-lasting outcome, Dr. Nandini meticulously subjects and specifies every aspect of her surgical procedure.</p>",
    rightHeading: "COMMITMENT TO PATIENT",
    rightText: "<p>Dr. Nandini Dadu places a high value on the doctor-patient relationship. She frequently adheres to the culture of having as much interaction as possible with her patients in order to go over the specifics of their hair loss issues and arrive at an accurate diagnosis.</p><p>With Dr. Nandini, the individualized care and attention don't stop after the procedure. She has developed a cultivating focus on patient education and offers an all-inclusive wellness protocol at every step.</p><p>The level of care that Dr. Nandini Dadu gives her patients is exceptional, and every surgical hair transplant by the best hair transplant surgeon in Delhi helps patients benefits due to her in-depth expertise.</p>",
    paddingTop: "120px",
    paddingBottom: "80px"
  },
  trustSection: {
    heading: "Why Do Patients Trust Dr. Nandani Dadu As a Hair Transplant Doctor in Delhi?",
    image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
    imageAlt: "Dr. Nandani Dadu",
    imageMaxWidth: "100%",
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
        title: "Expert in Complex Procedures",
        description: "She also takes a keen interest in performing complex procedures, such as repair hair transplants, body hair transplants, high-density transplants, her signature approach, DMC-Golden Touch, and more."
      },
      {
        title: "Expert Precision for Natural Results",
        description: "When it comes to hair transplants, the key factor is that the results should look natural. Dr. Dadu utilises her artistic abilities to provide a natural hairline. It gives patients confidence and leaves no proof that they underwent a hair transplant."
      }
    ],
    conclusionParagraph: "Dr. Nandani Dadu is a renowned hair transplant doctor in Delhi. She is an expert who provides safe, effective, and natural-looking results to all her patients. The doctor performs a thorough scalp examination to determine the extent of hair loss and then suggests the most suitable hair transplant technique. Those willing to restore their hair and are looking for expert help must consult Dr. Nandani Dadu now!",
    backgroundColor: "#ffffff",
    contentMaxWidth: "1280px",
    paddingTop: "110px",
    paddingBottom: "110px"
  },
  otherSpecialitiesSection: {
    heading: "Other Specialities",
    introParagraph: "Apart from being a leading expert in Trichological Sciences, Dr. Nandini Dadu is also a diligent specialist in cosmetology, performing a number of cosmetic procedures such as :",
    specialitiesList: [
      { title: "Skin Laser Treatments," },
      { title: "Implantations," },
      { title: "Collagen & other Injectable Wrinkle Fillers.etc." }
    ],
    conclusionParagraph: "For more information contact the **best hair specialist in Delhi** at DMC Trichology. We have our centres located at Vasant Vihar (South Delhi) & Rajouri Garden (West Delhi).",
    image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
    imageAlt: "Other Specialities",
    backgroundColor: "#3b5998",
    cardBackgroundColor: "#000000",
    contentMaxWidth: "1200px",
    paddingTop: "100px",
    paddingBottom: "100px",
    gridGap: "70px"
  },
  testimonialsSection: {
    heading: "Patient Testimonials",
    testimonials: [
      {
        text: "Dr. Nandani Dadu is an excellent hair specialist in Delhi. I visited her clinic for hair loss treatment, and the results have been outstanding. She is very knowledgeable and patient, taking time to explain everything clearly.",
        patientName: "Sanadhan Chaima",
        disclaimer: "* Opinions/Results may vary from person to person.",
        stars: 5
      },
      {
        text: "Dr. Nandani Dadu is the best hair transplant surgeon in Delhi. I underwent a hair transplant procedure at her clinic, and the results have been amazing. She uses advanced techniques and ensures a comfortable procedure.",
        patientName: "Akhilesh Singh",
        disclaimer: "* Opinions/Results may vary from person to person.",
        stars: 5
      },
      {
        text: "Dr. Nandani Dadu is undoubtedly the best hair specialist in Delhi. She helped me regain confidence with her effective treatment for hair thinning. Her approach is personalized, focusing on understanding the root cause of hair problems.",
        patientName: "Naveen Yadav",
        disclaimer: "* Opinions/Results may vary from person to person.",
        stars: 5
      }
    ],
    viewMoreText: "VIEW MORE",
    viewMoreUrl: "https://dmctrichology-mkm4.vercel.app/clients-feedback",
    backgroundColor: "#ffffff",
    cardBackgroundColor: "#000000",
    contentMaxWidth: "1400px",
    paddingTop: "100px",
    paddingBottom: "100px",
    gridGap: "35px"
  },
  faqSection: {
    heading: "FAQs About Best Hair Transplant Surgeon in Delhi",
    faqItems: [
      {
        question: "1. Who is the best hair transplant surgeon in Delhi?",
        answer: "The creator of the DMC Golden Touch hair transplant technique, which guarantees quicker outcomes, is Dr. Nandini Dadu. The **best hair transplant surgeon in Delhi** is a co-founder of DMC Trichology."
      },
      {
        question: "2. Who is the No 1 hair transplant surgeon in India?",
        answer: "Dr. Nandini Dadu is widely regarded as one of India's top hair transplant surgeons. With over a decade of specialized experience and thousands of successful procedures, she has earned the trust of patients across India and abroad."
      },
      {
        question: "3. Which type of doctor is best for hair?",
        answer: "A dermatologist or a trichologist who specializes in hair and scalp disorders is the best doctor for hair concerns. Dr. Nandini Dadu is a board-certified trichologist with specialized expertise in both medical and surgical hair restoration."
      },
      {
        question: "4. What is a hair specialist called?",
        answer: "A doctor who specializes in hair and scalp conditions is called a trichologist. For surgical hair restoration, they may also be referred to as a hair transplant surgeon or dermatological surgeon."
      },
      {
        question: "5. How do I choose a hair surgeon?",
        answer: "When choosing a hair surgeon, consider their experience, patient testimonials, before-and-after results, the technology they use, and their approach to personalized treatment. Dr. Nandini Dadu checks all these boxes with her advanced techniques and individualized care."
      },
      {
        question: "6. Is hair surgery good?",
        answer: "Yes, hair transplant surgery, when performed by a qualified and experienced surgeon, is a safe and highly effective solution for permanent hair restoration. Modern techniques like FUE offer minimal scarring and natural-looking results."
      },
      {
        question: "7. What is the difference between a dermatologist and a hair specialist?",
        answer: "A dermatologist treats a broad range of skin and hair conditions, while a trichologist or hair specialist focuses exclusively on hair and scalp health. Dr. Nandini Dadu combines both specializations for comprehensive hair care."
      },
      {
        question: "8. Which treatment is permanent for hair loss?",
        answer: "Hair transplant surgery (FUE/FUT) is the most permanent solution for hair loss. The transplanted follicles are resistant to the hormones that cause hair loss, ensuring long-lasting results with proper post-care."
      },
      {
        question: "9. What is the safest treatment for hair loss?",
        answer: "For non-surgical options, treatments like PRP therapy, mesotherapy, and laser treatments are safe and effective. For surgical solutions, FUE hair transplant is considered the safest with minimal scarring and quick recovery time."
      }
    ],
    defaultOpenIndex: 0,
    backgroundColor: "#3b5998",
    accordionBg: "#000000",
    accordionActiveBg: "#111111",
    contentMaxWidth: "1200px",
    paddingTop: "100px",
    paddingBottom: "120px"
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
