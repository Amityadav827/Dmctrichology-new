const mongoose = require("mongoose");

const contactPageSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: "Contact Us" },
      breadcrumbText: { type: String, default: "Contact Us" },
      bannerImage: { type: String, default: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png" },
      overlayOpacity: { type: Number, default: 0.5 },
      bannerHeight: { type: String, default: "400px" },
    },
    consultation: {
      badgeText: { type: String, default: "WHY CHOOSE US SERVICES" },
      heading: { type: String, default: "REQUEST A CONSULTATION" },
      subtitle: { type: String, default: "Clinic Timings ( By Appointments Only)" },
      phoneNumber: { type: String, default: "+91-8527830194" },
      serviceTimingMonSat: { type: String, default: "9:00 AM To 8:00 PM" },
      serviceTimingSunday: { type: String, default: "10:00 AM To 7:00 PM" },
      buttonText: { type: String, default: "Schedule Your Visit" },
      beforeImage: { type: String, default: "https://res.cloudinary.com/dseixl6px/image/upload/v1777623481/dmc-trichology/sfqfld2ikbs00iqncyse.png" },
      serviceOptions: { type: [String], default: ['Hair Transplant', 'Laser Hair Removal', 'Skin Treatment', 'Others'] },
      enableDatePicker: { type: Boolean, default: true },
      enableTimePicker: { type: Boolean, default: true },
      enableInquiryDropdown: { type: Boolean, default: true },
      namePlaceholder: { type: String, default: "Name*" },
      emailPlaceholder: { type: String, default: "E-Mail Address*" },
      messagePlaceholder: { type: String, default: "Enter Your Message Here*" },
      backgroundColor: { type: String, default: "#ffffff" }
    },
    map: {
      city: { type: String, default: "New Delhi" },
      area: { type: String, default: "Vasant Vihar" },
      googleMapEmbedUrl: { type: String, default: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.444704381882!2d77.16010531508083!3d28.55641798244799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1df64319087d%3A0xe6759c22f07f2324!2sDMC%20Trichology%20Vasant%20Vihar!5e0!3m2!1sen!2sin!4v1625471234567!5m2!1sen!2sin" },
      latitude: { type: String, default: "28.556418" },
      longitude: { type: String, default: "77.162294" },
      zoomLevel: { type: Number, default: 15 },
      mapHeight: { type: String, default: "600px" },
      cardBackground: { type: String, default: "rgb(249, 247, 242)" },
      iconColor: { type: String, default: "#C8102E" },
      textColor: { type: String, default: "#FFFFFF" }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactPage", contactPageSchema);
