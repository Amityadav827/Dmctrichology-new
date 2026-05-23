const getCategoryContent = (type, title) => {
  const content = {
    laser: {
      badge: "HAIR REDUCTION",
      duration: "45-60 mins",
      shortDesc: "Advanced laser technology for smooth, hair-free skin.",
      longDesc: `${title} is a state-of-the-art procedure designed for long-lasting hair reduction. Utilizing targeted laser energy, this treatment safely and effectively destroys hair follicles at their root, preventing future growth while leaving the surrounding skin completely undamaged. It is practically painless, highly effective, and suitable for all skin types.`,
      benefits: [{ text: "Virtually painless procedure" }, { text: "Long-lasting hair reduction" }, { text: "Safe for all skin types including tanned skin" }, { text: "No downtime required" }],
      closing: `Experience the freedom of smooth skin with our specialized ${title} treatments performed by expert dermatologists.`,
      processTitle: `How ${title} works?`,
      processSteps: [
        { stepNumber: "STEP 1", title: "Skin Analysis", description: "Our experts assess your hair and skin type to customize the laser settings for optimal results." },
        { stepNumber: "STEP 2", title: "Area Preparation", description: "The treatment area is cleaned and shaved if necessary. A protective cooling gel is applied." },
        { stepNumber: "STEP 3", title: "Laser Application", description: "The laser device is glided over the skin, delivering targeted energy to the hair follicles." },
        { stepNumber: "STEP 4", title: "Cooling & Aftercare", description: "Post-treatment soothing lotions are applied, and sun protection guidelines are provided." }
      ],
      freqDesc: "After 6-8 sessions, 80% - 90% hair reduction can be seen.",
      idealFor: ["Unwanted body hair", "Sensitive skin prone to razor bumps", "Long-term hair reduction seekers", "Ingrown hair problems"],
      notIdealFor: ["White, grey, or very light blonde hair", "Recently sun-tanned skin", "Active skin infections or open wounds", "Pregnant women"],
      beforePoints: ["Avoid waxing or plucking for 4 weeks prior", "Avoid direct sun exposure and tanning beds", "Shave the treatment area 24 hours before the session", "Do not apply lotions or deodorants on the day"],
      afterPoints: ["Apply broad-spectrum sunscreen daily", "Avoid hot showers, saunas, and intense workouts for 24-48 hours", "Moisturize the skin regularly", "Do not wax or pluck new hair growth"],
      faqs: [
        { question: "Is the treatment painful?", answer: "Most patients experience little to no pain. Advanced cooling technology ensures the skin remains comfortable throughout the procedure." },
        { question: "How many sessions are needed?", answer: "Typically, 6 to 8 sessions spaced 4-6 weeks apart are recommended for optimal, long-lasting results." },
        { question: "Is it safe for all skin types?", answer: "Yes, our advanced laser systems are FDA-approved and perfectly safe for all skin tones, including darker skin types." }
      ]
    },
    transplant: {
      badge: "HAIR RESTORATION",
      duration: "6-8 hours",
      shortDesc: "High-density hair transplant using advanced extraction techniques.",
      longDesc: `${title} is one of the most effective and permanent solutions for hair loss. This advanced microsurgical procedure involves extracting healthy hair follicles from a donor area and precisely implanting them into thinning or bald areas. The result is a natural-looking hairline with permanent, growing hair.`,
      benefits: [{ text: "Natural-looking, permanent results" }, { text: "No linear scarring" }, { text: "Fast recovery time" }, { text: "High graft survival rate" }],
      closing: `Restore your confidence with our seamless ${title} procedure, performed by award-winning surgeons.`,
      processTitle: `The ${title} Procedure`,
      processSteps: [
        { stepNumber: "STEP 1", title: "Consultation & Design", description: "Detailed scalp analysis and designing of the new, natural-looking hairline." },
        { stepNumber: "STEP 2", title: "Local Anesthesia", description: "Painless administration of local anesthesia to ensure complete comfort." },
        { stepNumber: "STEP 3", title: "Follicle Extraction", description: "Individual healthy hair follicles are carefully extracted using precise micro-punches." },
        { stepNumber: "STEP 4", title: "Implantation", description: "Follicles are meticulously implanted at the correct angle and density for a natural look." }
      ],
      freqDesc: "A one-time procedure with visible growth starting from month 3, and full results in 9-12 months.",
      idealFor: ["Male pattern baldness", "Receding hairlines", "Thinning crowns", "Eyebrow or beard restoration"],
      notIdealFor: ["Complete baldness with no donor area", "Active scalp infections or severe psoriasis", "Uncontrolled diabetes or blood disorders", "Very young patients with unstable hair loss"],
      beforePoints: ["Stop smoking and alcohol consumption 1 week prior", "Avoid blood-thinning medications", "Wash your hair thoroughly on the morning of surgery", "Wear a comfortable, button-down shirt"],
      afterPoints: ["Sleep with your head elevated for the first few nights", "Spray saline solution on the grafts as instructed", "Avoid heavy lifting and strenuous exercise for 2 weeks", "Do not scratch or rub the implanted area"],
      faqs: [
        { question: "Will the results look natural?", answer: "Absolutely. Our surgeons implant each follicle at the precise angle and direction of your natural hair growth." },
        { question: "Is the procedure painful?", answer: "The procedure is performed under local anesthesia, making it virtually painless. You can watch TV, listen to music, or sleep during the surgery." },
        { question: "Are the results permanent?", answer: "Yes, the transplanted hair is genetically resistant to baldness and will continue to grow for a lifetime." }
      ]
    },
    regrowth: {
      badge: "HAIR REGROWTH",
      duration: "45-60 mins",
      shortDesc: "Advanced cellular therapy to stimulate natural hair regrowth.",
      longDesc: `${title} is a cutting-edge, non-surgical treatment designed to combat hair thinning and stimulate new hair growth. By utilizing advanced growth factors and cellular stimulation techniques, this therapy rejuvenates dormant hair follicles, increases hair thickness, and significantly improves overall scalp health.`,
      benefits: [{ text: "Non-surgical, non-invasive procedure" }, { text: "Stimulates natural hair growth" }, { text: "Strengthens existing hair follicles" }, { text: "Zero downtime" }],
      closing: `Rejuvenate your hair naturally with our specialized ${title} protocols, tailored to your unique scalp needs.`,
      processTitle: `How ${title} Works`,
      processSteps: [
        { stepNumber: "STEP 1", title: "Scalp Preparation", description: "The scalp is thoroughly cleansed and prepped to ensure maximum absorption." },
        { stepNumber: "STEP 2", title: "Solution Preparation", description: "The highly concentrated growth factor or nutrient solution is prepared." },
        { stepNumber: "STEP 3", title: "Application/Micro-needling", description: "The solution is precisely delivered to the hair roots using advanced micro-needling or derma-rollers." },
        { stepNumber: "STEP 4", title: "Scalp Massage & LED", description: "A soothing massage and LED light therapy are used to boost blood circulation and absorption." }
      ],
      freqDesc: "Visible improvement after 3-4 sessions. Maintenance sessions required every 3-6 months.",
      idealFor: ["Early to moderate hair thinning", "Diffuse hair loss", "Post-pregnancy hair fall", "Patients seeking non-surgical options"],
      notIdealFor: ["Complete baldness with dead follicles", "Active scalp infections", "Severe autoimmune hair loss (Alopecia Totalis)"],
      beforePoints: ["Wash your hair before coming to the clinic", "Avoid applying hair gels or styling products", "Stay hydrated and eat a light meal beforehand"],
      afterPoints: ["Do not wash your hair for at least 12-24 hours", "Avoid strenuous exercise and sweating for 24 hours", "Do not apply harsh chemicals or colors to your hair for 1 week"],
      faqs: [
        { question: "When will I see results?", answer: "Most patients notice a reduction in hair fall within the first few weeks, with visible new growth appearing after 2 to 3 months." },
        { question: "Can this be combined with a hair transplant?", answer: "Yes, it is highly recommended both before and after a hair transplant to boost graft survival and strengthen existing hair." },
        { question: "Are there any side effects?", answer: "It is extremely safe. Mild redness or tenderness on the scalp may occur but resolves within a few hours." }
      ]
    },
    facial: {
      badge: "SKIN REJUVENATION",
      duration: "60-90 mins",
      shortDesc: "Premium facial treatments for a glowing, youthful complexion.",
      longDesc: `${title} is a luxurious, multi-step skin rejuvenation treatment designed to deep-cleanse, exfoliate, and deeply hydrate your skin. Using a combination of potent serums and advanced dermal technologies, this treatment addresses dullness, fine lines, and uneven texture, leaving you with an instant, radiant glow.`,
      benefits: [{ text: "Instant glowing and hydrated skin" }, { text: "Deep pore cleansing and exfoliation" }, { text: "Reduces fine lines and uneven texture" }, { text: "Customized to your skin type" }],
      closing: `Pamper your skin and achieve a flawless complexion with our bespoke ${title} treatments.`,
      processTitle: `The ${title} Experience`,
      processSteps: [
        { stepNumber: "STEP 1", title: "Deep Cleansing", description: "Gentle removal of impurities, makeup, and excess oil from the skin surface." },
        { stepNumber: "STEP 2", title: "Exfoliation & Extraction", description: "Painless removal of dead skin cells and blackheads to unclog pores." },
        { stepNumber: "STEP 3", title: "Serum Infusion", description: "Deep penetration of customized serums rich in antioxidants and hyaluronic acid." },
        { stepNumber: "STEP 4", title: "Hydration & Protection", description: "Application of soothing masks and premium sun protection to lock in the glow." }
      ],
      freqDesc: "Recommended once every 3 to 4 weeks for consistently radiant and healthy skin.",
      idealFor: ["Dull, tired-looking skin", "Uneven skin tone and texture", "Fine lines and signs of aging", "Pre-event instant glow"],
      notIdealFor: ["Active, severe cystic acne", "Sunburned skin", "Open cuts or recent facial surgery", "Severe rosacea flare-ups"],
      beforePoints: ["Discontinue use of Retinols or strong acids 3 days prior", "Avoid excessive sun exposure", "Inform your therapist about any active skin allergies"],
      afterPoints: ["Avoid applying makeup for at least 12 hours", "Use a gentle cleanser and keep skin moisturized", "Apply sunscreen generously", "Avoid saunas and intense workouts for 24 hours"],
      faqs: [
        { question: "Is there any downtime?", answer: "No, there is absolutely zero downtime. You will leave the clinic with an instant, radiant glow." },
        { question: "Can I get this treatment before a big event?", answer: "Yes! It is highly recommended to get this facial 1-2 days before an event for the best glow." },
        { question: "Will it help with my acne?", answer: "While it deeply cleanses pores and helps prevent future breakouts, we have specific acne-focused peels if you have active acne." }
      ]
    },
    smp: {
      badge: "COSMETIC RESTORATION",
      duration: "3-4 hours",
      shortDesc: "Non-surgical cosmetic tattoo for the illusion of dense hair.",
      longDesc: `${title} is a highly advanced non-surgical cosmetic procedure that uses detailed micro-needles to deposit pigment into the scalp. This creates the illusion of tiny hair follicles, giving the appearance of a closely shaved head or adding density to thinning areas. It's the perfect solution for instant results without surgery.`,
      benefits: [{ text: "Instant illusion of hair density" }, { text: "100% non-surgical and safe" }, { text: "Matches your natural hair color perfectly" }, { text: "Long-lasting results with minimal maintenance" }],
      closing: `Achieve the look of a full head of hair instantly with our hyper-realistic ${title} techniques.`,
      processTitle: `The ${title} Process`,
      processSteps: [
        { stepNumber: "STEP 1", title: "Consultation & Mapping", description: "We design a hairline that perfectly frames your face and matches your age and style." },
        { stepNumber: "STEP 2", title: "Pigment Matching", description: "Custom blending of organic pigments to exactly match your natural hair color and skin tone." },
        { stepNumber: "STEP 3", title: "Micro-pigmentation", description: "Precise application of thousands of micro-dots onto the scalp using specialized equipment." },
        { stepNumber: "STEP 4", title: "Review & Refine", description: "A follow-up session to add depth, density, and ensure a flawless, 3D effect." }
      ],
      freqDesc: "Requires 2-3 initial sessions spaced 10-14 days apart. Touch-ups needed every 3-5 years.",
      idealFor: ["Complete baldness (buzz-cut look)", "Adding density to thinning hair", "Camouflaging hair transplant scars", "Alopecia patients"],
      notIdealFor: ["Active scalp psoriasis or eczema", "Patients expecting actual hair growth (this is a cosmetic illusion)"],
      beforePoints: ["Wash and moisturize your scalp daily leading up to the session", "Avoid sun exposure to the scalp", "Do not take blood thinners 48 hours prior"],
      afterPoints: ["Keep the scalp completely dry for 4 days", "Avoid heavy sweating, saunas, and swimming for 1 week", "Do not shave the head for at least 1 week", "Apply the provided aftercare ointment as directed"],
      faqs: [
        { question: "Does it look real?", answer: "Yes, our highly trained practitioners use varied pigment shades and needle sizes to create a hyper-realistic 3D follicle illusion." },
        { question: "Does the procedure hurt?", answer: "Most clients describe it as mild discomfort rather than pain, often rating it a 3 out of 10." },
        { question: "Will the color fade or turn blue?", answer: "We use premium, carbon-based organic pigments specifically designed for the scalp, which gradually lighten over time but do not change color." }
      ]
    }
  };

  return content[type] || content.laser;
};

const generateServiceData = (title, slug, type) => {
  const c = getCategoryContent(type, title);

  return {
    slug,
    title,
    category: type, // Just for internal reference
    banner: {
      badgeText: c.badge,
      title: title,
      subtitle: c.shortDesc,
      duration: c.duration,
      rating: "4.9",
      buttonText: "Book Consultation",
      backgroundImage: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png"
    },
    intro: {
      badgeText: "ABOUT THE TREATMENT",
      title: title,
      rating: "4.9",
      duration: c.duration,
      shortDescription: c.shortDesc,
      longDescription: c.longDesc,
      benefits: c.benefits,
      closingText: c.closing,
      videos: [
        {
          title: `${title} Explained`,
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          thumbnail: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png",
          isYoutubeStyleButtonEnabled: true
        },
        {
          title: "Patient Success Story",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          thumbnail: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
          isYoutubeStyleButtonEnabled: true
        }
      ]
    },
    process: {
      sectionTitle: c.processTitle,
      processSteps: c.processSteps.map(step => ({
        ...step,
        image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777623481/dmc-trichology/sfqfld2ikbs00iqncyse.png"
      }))
    },
    idealFrequency: {
      frequencyTitle: "Treatment Frequency & Suitability",
      frequencyDescription: c.freqDesc,
      idealForPoints: c.idealFor,
      notIdealForPoints: c.notIdealFor,
      ctaTitle: "Not sure which treatment is right for YOU?",
      ctaDescription: "We can help with that! Schedule a free online consultation with our expert Doctors and we'll help you create a customized plan.",
      ctaButtonText: "Book a free consultation",
      ctaButtonLink: "/contact",
      ctaImage: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png"
    },
    beforeAfter: {
      beforeTitle: "Before Treatment Checklist",
      afterTitle: "Aftercare Instructions",
      beforePoints: c.beforePoints,
      afterPoints: c.afterPoints,
      sectionBackground: "#f9f7f2"
    },
    faqEnquiry: {
      faqTitle: "Common Concerns Addressed",
      faqSubtitle: `Everything you need to know about ${title}.`,
      faqItems: c.faqs,
      serviceOptions: ["Laser Hair Removal", "Hair Transplant", "Hair Fall Treatment", "Skin Rejuvenation", "Other"],
      formTitle: "Enquire About This Treatment",
      buttonText: "Schedule Your Visit"
    },
    googleReviewCta: {
      title: "Google Review",
      buttonText: "VIEW MORE",
      buttonLink: "https://dmctrichology-mkm4.vercel.app/service",
      backgroundColor: "",
      isVisible: true
    },
    resultsSection: {
      subtitle: "BEFORE AND AFTER",
      title: "RESULTS THAT SPEAK FOR THEMSELVES",
      cards: [
        {
          title: "Korean Facial Illumination",
          beforeImg: "https://res.cloudinary.com/dseixl6px/image/upload/v1777612758/dmc-trichology/dvy3knew0pzq1gg8fr8q.png",
          afterImg: "https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/uttbdof06l4xbpvexlv9.png",
          sessions: "After 6 sessions"
        },
        {
          title: "Acne Arrestor Facial With Salicylic Peel",
          beforeImg: "https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/g7fs5kfpckmmcjwg5sk0.png",
          afterImg: "https://res.cloudinary.com/dseixl6px/image/upload/v1777612758/dmc-trichology/zxyvkmr0uf8pf5qxgfvf.png",
          sessions: "After 4 sessions"
        },
        {
          title: "Elastin Boost Facial",
          beforeImg: "https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/meeed3zg8w5j3xhkcfxc.png",
          afterImg: "https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/w6qder12vvhxrbhzskgw.png",
          sessions: "After 5 sessions"
        },
        {
          title: "Derma Revive Facial",
          beforeImg: "https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/dh6webh6x4l7qfrlzxtl.png",
          afterImg: "https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/bif89jyygbycclg8qa92.png",
          sessions: "After 4 sessions"
        }
      ],
      buttonText: "VIEW ALL",
      buttonLink: "https://dmctrichology-mkm4.vercel.app/service",
      isVisible: true
    },
    videosSection: {
      title: "VIDEOS",
      videos: [
        {
          title: "P-R-P Vs Hair Transplant ? | Best Treatment for Hairloss | Dr. Nandini Dadu",
          thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          title: "Female Hair Transplant | Good or Bad ? | Dadu Medical Centre",
          thumbnail: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/ulx0crddeqpeygupa13q.png",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          title: "First 14 Days After Hair Transplant | Dos and Don'ts | Dr. Nandini Dadu",
          thumbnail: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        }
      ],
      buttonText: "VIEW MORE",
      buttonLink: "https://dmctrichology-mkm4.vercel.app/service",
      isVisible: true
    },
    enquirySection: {
      title: "Enquire About This Treatment",
      description: "Schedule your visit for this specialized treatment.",
      serviceOptions: ["Laser Hair Removal", "Hair Transplant", "Hair Fall Treatment", "Skin Rejuvenation", "Other"],
      submitButtonText: "Schedule Your Visit",
      backgroundColor: "",
      isVisible: true
    },
    contentBlocks: (type === 'transplant' || slug.includes('hair-transplant')) ? [
      {
        heading: "WHAT IS A HAIR TRANSPLANT?",
        description: "A hair transplant is a minimally invasive surgical procedure in which hair follicles are extracted from a donor site (Generally the back or sides of the head) and transplanted to the balding or thinning areas.\n\nIn other words, we can say that hair is taken from one part of the scalp area and implanted into another part where there is almost no hair.\n\nHair transplants are generally performed by hair transplant surgeons. The procedure can take 4–8 hours; most people can return to work within 2–5 days.\n\nHair transplants can give permanent, natural-looking results. However, the transplanted hair will fall out within 2–3 weeks, and new growth won't be noticeable for a few months.",
        sortOrder: 1,
        isVisible: true
      }
    ] : [],
    benefitsSection: {
      heading: "Key Benefits of the Treatment",
      image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
      altText: `${title} illustration`,
      points: (c.benefits || []).map((b, index) => ({
        benefitText: b.text || "",
        sortOrder: index + 1,
        isVisible: true
      }))
    },
    idealCandidates: {
      sectionHeading: "Ideal Candidates",
      introText: `This treatment is highly effective and suitable for individuals looking for ${title} solutions. Here is a breakdown of who will benefit the most:`,
      bottomConclusionText: "If you want a customized evaluation, our doctors are ready to help you analyze your hair health.",
      sectionImage: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
      altText: "Ideal candidates breakdown",
      bullets: (c.idealFor || []).map((idealText, index) => ({
        bulletText: idealText,
        sortOrder: index + 1,
        isVisible: true
      }))
    }
  };
};

export const servicesData = [
  generateServiceData("Soprano Titanium Laser", "soprano-titanium-laser", "laser"),
  generateServiceData("Best Hair Transplant", "best-hair-transplant", "transplant"),
  generateServiceData("Hair Transplant Cost in Delhi", "hair-transplant-cost-in-delhi", "transplant"),
  generateServiceData("FUE Hair Transplant", "fue-hair-transplant", "transplant"),
  generateServiceData("Advanced GFC Therapy", "advanced-gfc-therapy", "regrowth"),
  generateServiceData("PRP Plus+", "prp-plus", "regrowth"),
  generateServiceData("DMC Signature Facial", "dmc-signature-facial", "facial"),
  generateServiceData("Beard Shaping Laser", "beard-shaping-laser", "laser"),
  generateServiceData("Underarms Smoothness", "underarms-smoothness", "laser"),
  generateServiceData("Full Legs Silk", "full-legs-silk", "laser"),
  generateServiceData("Bikini Line Precision", "bikini-line-precision", "laser"),
  generateServiceData("Back Hair Removal", "back-hair-removal", "laser"),
  generateServiceData("Hair Repair Mask", "hair-repair-mask", "regrowth"),
  generateServiceData("Women’s Thinning Fix", "women-s-thinning-fix", "regrowth"),
  generateServiceData("DHT Blocker Therapy", "dht-blocker-therapy", "regrowth"),
  generateServiceData("Full Face Rejuvenation", "full-face-rejuvenation", "facial"),
  generateServiceData("Arm & Forearm Smooth", "arm-forearm-smooth", "laser"),
  generateServiceData("Chest & Front Laser", "chest-front-laser", "laser"),
  generateServiceData("Scalp Micro-Pigmentation", "scalp-micro-pigmentation", "smp")
];
