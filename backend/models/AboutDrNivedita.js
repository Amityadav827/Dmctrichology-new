const mongoose = require('mongoose');

const AboutDrNiveditaSchema = new mongoose.Schema({
  hero: {
    backgroundImage: { type: String, default: '' },
    mainImage: { type: String, default: '' },
    doctorImage: { type: String, default: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png' },
    mainHeading: { type: String, default: 'EXPERT DERMATOLOGIST & TRICHOLOGIST IN DELHI' },
    doctorName: { type: String, default: 'Dr. Nivedita Dadu' },
    degreeText: { type: String, default: 'MBBS, MD (Dermatology)' },
    descriptionParagraph: { type: String, default: 'Dr. Nivedita Dadu is a renowned Dermatologist and Trichologist with over 15 years of clinical excellence. As the co-founder of DMC Trichology, she combines cutting-edge dermatological expertise with advanced hair restoration science to deliver transformative results for her patients.' },
    namePlaceholder: { type: String, default: 'Name*' },
    phonePlaceholder: { type: String, default: 'Mobile Number*' },
    emailPlaceholder: { type: String, default: 'E-Mail Address*' },
    datePlaceholder: { type: String, default: 'Select Preferred Date*' },
    messagePlaceholder: { type: String, default: 'Enter Your Message Here' },
    captchaPlaceholder: { type: String, default: 'Code*' },
    submitButtonText: { type: String, default: 'Schedule Your Visit' },
    backgroundColor: { type: String, default: '#3b5998' },
    overlayOpacity: { type: Number, default: 0.45 }
  },
  breadcrumb: {
    parentLabel: { type: String, default: 'Home' },
    parentUrl: { type: String, default: '/' },
    currentPageText: { type: String, default: 'About Dr Nivedita Dadu' },
    backgroundColor: { type: String, default: '#f8f9fa' }
  },
  specialist: {
    heading: { type: String, default: 'Best Dermatologist & Hair Specialist in Delhi' },
    description1: { type: String, default: 'Dr. Nivedita Dadu is a distinguished dermatologist and trichologist recognized for her exceptional patient outcomes and research contributions. A fellow of prestigious dermatological societies, she brings unparalleled clinical depth to every patient interaction at DMC Trichology.' },
    description2: { type: String, default: 'Combining her mastery in dermatology with advanced trichological sciences, Dr. Nivedita delivers comprehensive scalp health solutions — from non-surgical hair restoration therapies to advanced diagnostic protocols — ensuring each patient receives the most effective, evidence-based care.' },
    highlightedText: { type: String, default: 'She specializes in cutting-edge treatments including:' },
    bullets: {
      type: [String],
      default: [
        'Advanced PRP & GFC Therapy',
        'FUE Hair Transplant Surgery',
        'Scalp Micropigmentation',
        'LLLT (Laser Hair Therapy)',
        'Custom Trichological Protocols'
      ]
    },
    sectionBgColor: { type: String, default: '#ffffff' },
    cardBgColor: { type: String, default: '#3b5998' }
  },
  membership: {
    sectionHeading: { type: String, default: 'MEMBERSHIP' },
    sectionBgColor: { type: String, default: '#ffffff' },
    paddingTop: { type: String, default: '60px' },
    paddingBottom: { type: String, default: '60px' },
    logos: {
      type: [mongoose.Schema.Types.Mixed],
      default: [
        { id: 1, title: 'EADV', imageUrl: '', link: '', enabled: true },
        { id: 2, title: 'IAM', imageUrl: '', link: '', enabled: true },
        { id: 3, title: 'IADVL', imageUrl: '', link: '', enabled: true },
        { id: 4, title: 'Trichology Society', imageUrl: '', link: '', enabled: true },
        { id: 5, title: 'ISOINEL', imageUrl: '', link: '', enabled: true }
      ]
    }
  },
  educationExperience: {
    sectionBgColor: { type: String, default: '#FFFFFF' },
    educationTitle: { type: String, default: 'EDUCATION' },
    experienceTitle: { type: String, default: 'EXPERIENCE' },
    educationItems: {
      type: [mongoose.Schema.Types.Mixed],
      default: [
        { degree: 'MBBS', institution: 'Himalayan Institute of Medical Sciences (HIMS), Dehradun', year: '2000' },
        { degree: 'MD (Dermatology)', institution: 'Himalayan Institute of Medical Sciences (HIMS), Dehradun', year: '2004' }
      ]
    },
    experienceItems: {
      type: [mongoose.Schema.Types.Mixed],
      default: [
        { role: 'Senior Dermatologist', hospital: 'Dr. Ram Manohar Lohia Hospital, New Delhi', duration: '2004 - 2008' },
        { role: 'Fellowship In Hair Science & Trichology', hospital: 'King Edward Memorial Hospital, Mumbai', duration: '2008 - 2010' },
        { role: 'Consultant Dermatologist', hospital: 'Primus Hospital, New Delhi', duration: '2010 - 2012' },
        { role: 'Co-Founder & Senior Dermatologist', hospital: 'DMC Trichology, New Delhi', duration: '2012 - Present' }
      ]
    }
  },
  credentialsSection: {
    bannerImage: { type: String, default: '' },
    overlayOpacity: { type: Number, default: 0.35 },
    heading: { type: String, default: 'Credentials' },
    credentialsList: {
      type: [mongoose.Schema.Types.Mixed],
      default: [
        { text: 'Fellowship In Aesthetic Dermatology' },
        { text: 'Fellowship In Hair Science' },
        { text: 'Member — IADVL (Indian Association of Dermatologists)' }
      ]
    },
    leftHeading: { type: String, default: 'EXPERTISE IN DERMATOLOGY & HAIR TREATMENT' },
    leftText: { type: String, default: '<p>Dr. Nivedita Dadu\'s cutting-edge Hair Loss Treatment techniques have made a significant difference in the lives of those suffering from severe hair loss. She is recognized as a <strong>leading dermatologist and trichologist in Delhi</strong> available at DMC Trichology, Vasant Vihar (South Delhi), & Rajouri Garden (West Delhi).</p>' },
    rightHeading: { type: String, default: 'COMMITMENT TO PATIENT CARE' },
    rightText: { type: String, default: '<p>Dr. Nivedita Dadu places a high value on the doctor-patient relationship. She ensures individualized care and attention at every step of the treatment journey at DMC Trichology.</p>' },
    paddingBottom: { type: String, default: '80px' }
  },
  otherSpecialitiesSection: {
    heading: { type: String, default: 'Other Specialities' },
    introParagraph: { type: String, default: 'Apart from being a leading expert in Trichological Sciences, Dr. Nivedita Dadu is also a diligent specialist in advanced dermatology, performing a number of cosmetic procedures such as:' },
    specialitiesList: {
      type: [mongoose.Schema.Types.Mixed],
      default: [
        { title: 'Laser Skin Resurfacing & Rejuvenation,' },
        { title: 'Chemical Peels & Advanced Facials,' },
        { title: 'Botox, Fillers & Anti-Ageing Treatments,' },
        { title: 'Pigmentation & Melasma Management,' },
        { title: 'Acne & Scar Treatment Protocols.' }
      ]
    },
    conclusionParagraph: { type: String, default: 'For more information, contact the **best dermatologist in Delhi** at DMC Trichology. We have our centres located at Vasant Vihar (South Delhi) & Rajouri Garden (West Delhi).' },
    image: { type: String, default: '' },
    imageAlt: { type: String, default: 'Dr. Nivedita Other Specialities' },
    backgroundColor: { type: String, default: '#ffffff' },
    cardBackgroundColor: { type: String, default: '#3b5998' },
    contentMaxWidth: { type: String, default: '1200px' },
    paddingTop: { type: String, default: '100px' },
    paddingBottom: { type: String, default: '100px' },
    gridGap: { type: String, default: '70px' }
  },
  featuredInSection: {
    sectionHeading: { type: String, default: 'As Featured In' },
    descriptionText: { type: String, default: 'For her strong focus on the doctor-patient relationship, Dr. Nivedita Dadu has become the most sought-after Dermatology expert and also featured in various national and regional publications including:' },
    sectionBgColor: { type: String, default: '#ffffff' },
    paddingTop: { type: String, default: '72px' },
    paddingBottom: { type: String, default: '72px' },
    publications: {
      type: [mongoose.Schema.Types.Mixed],
      default: [
        { id: 1, title: 'Dainik Bhaskar', imageUrl: '', link: '', enabled: true },
        { id: 2, title: 'NDTV', imageUrl: '', link: '', enabled: true },
        { id: 3, title: 'Femina', imageUrl: '', link: '', enabled: true },
        { id: 4, title: 'Deccan Herald', imageUrl: '', link: '', enabled: true },
        { id: 5, title: "Woman's Era", imageUrl: '', link: '', enabled: true },
        { id: 6, title: 'Hindustan Times', imageUrl: '', link: '', enabled: true },
        { id: 7, title: 'Stayfit', imageUrl: '', link: '', enabled: true },
        { id: 8, title: 'Practo', imageUrl: '', link: '', enabled: true },
        { id: 9, title: 'Mail Today', imageUrl: '', link: '', enabled: true }
      ]
    }
  },
  patientCareSection: {
    sectionBgColor: { type: String, default: '#f8f9fa' },
    paddingTop: { type: String, default: '80px' },
    paddingBottom: { type: String, default: '80px' },
    maxWidth: { type: String, default: '1200px' },
    cardBorderRadius: { type: String, default: '0px' },
    cardShadowIntensity: { type: String, default: '0 6px 32px rgba(0,0,0,0.07)' },
    gridGap: { type: String, default: '32px' },
    leftCardTitle: { type: String, default: 'Patient Centred Care' },
    leftCardBgColor: { type: String, default: '#ffffff' },
    leftCardContent: { type: String, default: '<p>Dr. Nivedita Dadu offers professional-grade, most personalised skin & hair care treatments to each individual patient. She, along with her team of dermatologists & aestheticians, has treated over 100 thousands critical cases throughout her career with optimal results. She is always available to her patients, offering compassionate care and utmost respect to ensure healthy skin & hair for all.</p><p>Dr. Nivedita takes the practice of skin & hair care seriously and will make sure you receive the care you deserve.</p>' },
    rightCardTitle: { type: String, default: 'Professionalism' },
    rightCardBgColor: { type: String, default: '#ffffff' },
    rightCardContent: { type: String, default: '<p>Dr. Nivedita Dadu maintains a highly professional environment to offer quality clinical care. She is one of the most recognised and respected skin & hair specialist professionals making her the best dermatologist giving customised treatment solutions that work- not just today, but for life.</p>' }
  },
  associationsSection: {
    sectionHeading:  { type: String, default: 'ASSOCIATIONS' },
    sectionBgColor:  { type: String, default: '#ffffff' },
    paddingTop:      { type: String, default: '72px' },
    paddingBottom:   { type: String, default: '72px' },
    logoSpacing:     { type: String, default: '24px' },
    logoHeight:      { type: String, default: '90px' },
    logoCardPadding: { type: String, default: '20px 28px' },
    associations: {
      type: [mongoose.Schema.Types.Mixed],
      default: [
        { id: 1, title: 'IADVL',                          imageUrl: '', link: '', enabled: true },
        { id: 2, title: 'World Trichology Society',        imageUrl: '', link: '', enabled: true },
        { id: 3, title: 'AAM MMI',                         imageUrl: '', link: '', enabled: true },
        { id: 4, title: 'EADV',                            imageUrl: '', link: '', enabled: true },
        { id: 5, title: 'Association of Cutaneous Surgeons', imageUrl: '', link: '', enabled: true }
      ]
    }
  },
  seo: {
    metaTitle: { type: String, default: 'Dr. Nivedita Dadu | Expert Dermatologist & Trichologist in Delhi' },
    metaDescription: { type: String, default: 'Consult Dr. Nivedita Dadu, renowned Dermatologist and Trichologist at DMC Trichology Delhi. Expert in advanced hair restoration, scalp treatments, and dermatological care.' },
    ogImage: { type: String, default: '' }
  }
}, { timestamps: true, collection: 'aboutdrnivedita' });

module.exports = mongoose.model('AboutDrNivedita', AboutDrNiveditaSchema);
