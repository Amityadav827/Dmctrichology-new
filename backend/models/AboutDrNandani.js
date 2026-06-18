const mongoose = require('mongoose');

const AboutDrNandaniSchema = new mongoose.Schema({
  hero: {
    backgroundImage: { type: String, default: "" },
    mainImage: { type: String, default: "" },
    doctorImage: { type: String, default: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png" },
    mainHeading: { type: String, default: "BEST HAIR TRANSPLANT SURGEON IN DELHI" },
    doctorName: { type: String, default: "Dr. Nandini Dadu" },
    degreeText: { type: String, default: "MD (Dermatology)" },
    descriptionParagraph: { type: String, default: "Dr. Nandini Dadu, MBBS, a Board-Certified Trichologist, has been studying hair and scalp treatments for over ten years. Throughout her career, she has successfully treated severe cases with excellent outcomes and has attained the title of the best hair transplant surgeon in Delhi." },
    pageEyebrow: { type: String, default: "About DMC Trichology" },
    statsCards: {
      type: [{ label: { type: String } }],
      default: [
        { label: "10+ Years Experience" },
        { label: "Thousands of Successful Cases" },
        { label: "Board Certified Specialist" }
      ]
    },
    namePlaceholder: { type: String, default: "Name*" },
    phonePlaceholder: { type: String, default: "Mobile Number*" },
    emailPlaceholder: { type: String, default: "E-Mail Address" },
    datePlaceholder: { type: String, default: "Select Preferred Date*" },
    messagePlaceholder: { type: String, default: "Enter Your Message Here" },
    captchaPlaceholder: { type: String, default: "Code*" },
    submitButtonText: { type: String, default: "Schedule Your Visit" },
    backgroundColor: { type: String, default: "#3b5998" },
    overlayOpacity: { type: Number, default: 0.4 }
  },
  
  intro: {
    heading: { type: String, default: "Delhi's Premier Hair Specialist & Clinical Director" },
    description: { 
      type: String, 
      default: "<p>Dr. Nandini Dadu is highly regarded as one of India's finest hair restoration specialists, merging state-of-the-art US-FDA approved technologies with refined artistic precision. As the Clinical Director, she has spent over a decade perfecting custom trichological protocols that deliver exceptional, natural-looking hair density.</p><p>Her signature therapies combine advanced cellular growth treatments, high-density FUE transplants, and custom scalp rejuvenation programs designed uniquely for each patient's physiological profile.</p>" 
    },
    bulletList: {
      type: [String],
      default: [
        "Clinical expertise with 15+ years of specialized hair treatment experience.",
        "Customized high-density hairline designs backed by medical science.",
        "State-of-the-art clinical theater with advanced sterile protocols.",
        "Comprehensive pre-and-post care guidance for long-term retention."
      ]
    },
    ctaText: { type: String, default: "Discover Signature Treatments" }
  },

  formSettings: {
    title: { type: String, default: "Request Private Consultation" },
    subtitle: { type: String, default: "Reserve your bespoke scalp assessment and consultation session." },
    successMessage: { type: String, default: "Your consultation request has been successfully submitted to Dr. Nandini Dadu's private desk. Our concierge team will reach out to you shortly." }
  },

  seo: {
    metaTitle: { type: String, default: "Dr. Nandini Dadu | Best Hair Restoration Specialist & Trichologist" },
    metaDescription: { type: String, default: "Consult Delhi's premier hair restoration specialist, Dr. Nandini Dadu. Experience luxury clinical consultations, high-density transplants, and customized scalp treatments." },
    ogImage: { type: String, default: "" }
  },

  breadcrumb: {
    title: { type: String, default: "Hair Specialist in Delhi" },
    parentLabel: { type: String, default: "Home" },
    parentUrl: { type: String, default: "/" },
    currentPageText: { type: String, default: "Hair Specialist in Delhi" },
    backgroundColor: { type: String, default: "#f8f9fa" }
  },

  specialist: {
    heading: { type: String, default: "Best Hair Specialist in Delhi" },
    description1: { type: String, default: "Dr. Nandini Dadu is a well-known former consultant at ARTEMIS HOSPITAL in Gurgaon. Over the years, she has provided insights to several dignitaries and celebrities in New Delhi. She is the best hair specialist in Delhi. She works in close collaboration with doctors at Hair Care & Transplant Surgeons and is always looking for new, cutting-edge products for hair and scalp care treatments." },
    description2: { type: String, default: "Being a specialist in the cosmetological and trichological sciences combined, Dr. Nandini is dedicated to thorough diagnosis, effective treatment processes, and the best DMC Golden Touch Techniques for generating amazing outcomes at the highest level of client satisfaction. So, to get the long-lasting effects opt to get treated by the best hair specialist in Delhi only at DMC Trichology." },
    highlightedText: { type: String, default: "She employs cutting-edge knowledge in Hair & Scalp Treatments with:" },
    bullets: { type: [String], default: ["MESOGROW", "ADVANCED HGP", "ADVANCED HGP 2.0", "RRT (ROOT RESTORE THERAPY)", "FUE TECHNIQUE (Follicular Hair Transplant)"] },
    featureCards: {
      type: [{ title: { type: String } }],
      default: [
        { title: "Advanced Hair Restoration" },
        { title: "Hair Transplant Expertise" },
        { title: "Scalp & Hair Diagnosis" },
        { title: "Personalized Treatment Plans" }
      ]
    },
    sectionBgColor: { type: String, default: "#FFFFFF" },
    cardBgColor: { type: String, default: "#3b5998" }
  },

  timeline: {
    eyebrow: { type: String, default: "TRUSTED CARE SERVICES" },
    heading: { type: String, default: "What Makes Dr. Nandini Dadu The Best Hair Transplant Surgeon In Delhi?" },
    image: { type: String, default: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1780906825092-79561886.webp" },
    imageAlt: { type: String, default: "Dr. Nandini Dadu hair restoration care" },
    sectionBgColor: { type: String, default: "#FFFFFF" },
    contentMaxWidth: { type: String, default: "1220px" },
    maxHeight: { type: String, default: "340px" },
    paddingTop: { type: String, default: "56px" },
    paddingBottom: { type: String, default: "56px" }
  },

  educationExperience: {
    sectionBgColor: { type: String, default: "#FFFFFF" },
    educationTitle: { type: String, default: "Education" },
    experienceTitle: { type: String, default: "Experience" },
    experienceTabLabel: { type: String, default: "Experience" },
    educationTabLabel: { type: String, default: "Education" },
    credentialsTabLabel: { type: String, default: "Credentials" },
    topImage: { type: String, default: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png" },
    bottomImage: { type: String, default: "https://res.cloudinary.com/dseixl6px/image/upload/v1777623481/dmc-trichology/sfqfld2ikbs00iqncyse.png" },
    educationItems: [{
      degree: { type: String },
      institution: { type: String },
      year: { type: String }
    }],
    experienceItems: [{
      role: { type: String },
      hospital: { type: String },
      duration: { type: String }
    }]
  },

  credentialsSection: {
    bannerImage: { type: String, default: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png" },
    overlayOpacity: { type: Number, default: 0.35 },
    heading: { type: String, default: "Credentials" },
    credentialsList: [{ text: { type: String } }],
    leftHeading: { type: String, default: "EXPERTISE IN HAIR & SCALP TREATMENT" },
    leftText: { type: String, default: "<p>Dr. Nandini Dadu's cutting-edge Hair Loss Treatment technique has made a significant difference in the lives of those suffering from severe hair loss. She is the <strong>best hair specialist in Delhi</strong> available at DMC Trichology in Delhi, Vasant Vihar (South Delhi), & Rajouri Garden (West Delhi). She is solely dedicated to treating male and female hair loss with the most advanced surgical technologies available.</p><p>\"There is way more to hair restoration than JUST SCIENCE. For the optimal outcomes, ARTISTRY & IMAGINATION are required.\"</p><p>Dr. Nandini Dadu has always taken a distinctive approach to hairline design because of her passion for the art and craft of hair restoration procedures. Her primary goal is to achieve natural – superior hairlines while treating the patients' underlying issues. To ensure that her patient is confident and pleased with the most natural-looking and long-lasting outcome, Dr. Nandini meticulously subjects and specifies every aspect of her surgical procedure.</p>" },
    rightHeading: { type: String, default: "COMMITMENT TO PATIENT" },
    rightText: { type: String, default: "<p>Dr. Nandini Dadu places a high value on the doctor-patient relationship. She frequently adheres to the culture of having as much interaction as possible with her patients in order to go over the specifics of their hair loss issues and arrive at an accurate diagnosis.</p><p>With Dr. Nandini, the individualized care and attention don't stop after the procedure. She has developed a cultivating focus on patient education and offers an all-inclusive wellness protocol at every step.</p><p>The level of care that Dr. Nandini Dadu gives her patients is exceptional, and every surgical hair transplant by the best hair transplant surgeon in Delhi helps patients benefits due to her in-depth expertise.</p>" },
    paddingTop: { type: String, default: "120px" },
    paddingBottom: { type: String, default: "80px" }
  },
  
  trustSection: {
    eyebrow: { type: String, default: "TRUSTED CARE SERVICES" },
    heading: { type: String, default: "Why Do Patients Trust Dr. Nandini Dadu As A Hair Transplant Doctor In Delhi?" },
    image: { type: String, default: "https://res.cloudinary.com/dseixl6px/image/upload/v1777623481/dmc-trichology/sfqfld2ikbs00iqncyse.png" },
    imageAlt: { type: String, default: "Hair transplant treatment planning" },
    imageMaxWidth: { type: String, default: "100%" },
    trustPoints: [{
      title: { type: String },
      description: { type: String }
    }],
    conclusionParagraph: { type: String, default: "Dr. Nandini Dadu is a renowned hair transplant doctor in Delhi. She is an expert who provides safe, effective, and natural-looking results to all her patients. The doctor performs a thorough scalp examination to determine the extent of hair loss and then suggests the most suitable hair transplant technique. Those willing to restore their hair and are looking for expert help must consult Dr. Nandini Dadu now!" },
    backgroundColor: { type: String, default: "#e8eaf6" },
    contentMaxWidth: { type: String, default: "1300px" },
    paddingTop: { type: String, default: "92px" },
    paddingBottom: { type: String, default: "92px" }
  },
  otherSpecialitiesSection: {
    heading: { type: String, default: "Other Specialities" },
    introParagraph: { type: String, default: "Apart from being a leading expert in Trichological Sciences, Dr. Nandini Dadu is also a diligent specialist in cosmetology, performing a number of cosmetic procedures such as :" },
    specialitiesList: [{
      title: { type: String }
    }],
    conclusionParagraph: { type: String, default: "For more information contact the best hair specialist in Delhi at DMC Trichology. We have our centres located at Vasant Vihar (South Delhi) & Rajouri Garden (West Delhi)." },
    image: { type: String, default: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png" },
    imageAlt: { type: String, default: "Other Specialities" },
    backgroundColor: { type: String, default: "#3b5998" },
    cardBackgroundColor: { type: String, default: "#000000" },
    contentMaxWidth: { type: String, default: "1200px" },
    paddingTop: { type: String, default: "100px" },
    paddingBottom: { type: String, default: "100px" },
    gridGap: { type: String, default: "70px" }
  },

  testimonialsSection: {
    heading: { type: String, default: "Patient Testimonials" },
    patientImage: { type: String, default: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1780711038023-933757138.webp" },
    testimonials: [{
      text: { type: String },
      patientName: { type: String },
      image: { type: String },
      disclaimer: { type: String },
      stars: { type: Number, default: 5 }
    }],
    viewMoreText: { type: String, default: "VIEW MORE" },
    viewMoreUrl: { type: String, default: "https://dmctrichology-new.vercel.app/clients-feedback" },
    backgroundColor: { type: String, default: "#ffffff" },
    cardBackgroundColor: { type: String, default: "#000000" },
    contentMaxWidth: { type: String, default: "1400px" },
    paddingTop: { type: String, default: "100px" },
    paddingBottom: { type: String, default: "100px" },
    gridGap: { type: String, default: "35px" }
  },

  faqSection: {
    heading: { type: String, default: "FAQs About Best Hair Transplant Surgeon in Delhi" },
    faqItems: [{
      question: { type: String },
      answer: { type: String }
    }],
    defaultOpenIndex: { type: Number, default: 0 },
    backgroundColor: { type: String, default: "#3b5998" },
    accordionBg: { type: String, default: "#ffffff" },
    accordionActiveBg: { type: String, default: "#f5f5f5" },
    contentMaxWidth: { type: String, default: "1200px" },
    paddingTop: { type: String, default: "100px" },
    paddingBottom: { type: String, default: "120px" }
  }
}, { timestamps: true, collection: 'aboutdrnandani' });

module.exports = mongoose.model('AboutDrNandani', AboutDrNandaniSchema);

