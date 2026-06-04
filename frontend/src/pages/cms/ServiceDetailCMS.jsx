import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import {
  Save, Loader2, Layout, Type, List, CheckCircle, HelpCircle,
  Image as ImageIcon, Video, Plus, Trash2, RefreshCw, Globe, 
  ArrowUp, ArrowDown, Upload, Film, ExternalLink, Star
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ServiceSearchSelector from "../../components/ServiceSearchSelector";

const HAIR_COST_DELHI_SLUGS = ["hair-transplant-cost-in-delhi", "hair-transplant-cost-in-india"];

const hairCostFactorDescription = `However, most commonly, two factors determine the cost of a hair transplant procedure in most hair transplant clinics.

- The stage of baldness
- The number of hair grafts (or per follicles).

One can better understand the **hair transplant cost in Delhi** by consulting with the hair transplant experts at DMC Trichology Centre.

Dealing with hair loss problems and deciding to get a hair transplantation is a big decision. To begin with, who should we consult? Where to get the Transplant? All these questions need sufficient answers. So, there are certainly the most essential conditions to consider besides the cost factor. These include:

- Experience of the Clinic
- Hair Transplant Technique
- Risk Factors
- Recovery Time
- Success Rate.

Getting a hair transplant procedure at an economical rate is everybody's choice, provided the quality standard of the clinical procedure is not compromised. The reason is that hair transplant surgery is nothing less than any surgical procedure and requires optimum expertise and precautions.

Our experts at DMC Trichology are the best at determining the **_hair transplant cost in Delhi._** The experts are specialised in providing state-of-the-art hair transplant procedures at the most reasonable and affordable cost without compromising the quality standard necessary for a most natural hairline and permanent result.`;

const isHairCostDelhiSlug = (slug) => HAIR_COST_DELHI_SLUGS.includes(String(slug || "").toLowerCase());

const hairCostBenefitsSectionDefaults = {
  heading: "HOW MUCH HAIR TRANSPLANT COST IN DELHI AT DMC TRICHOLOGY?",
  description: "The price of hair transplant surgery will vary significantly from case to case. It depends on a number of variables, including the hair transplant surgeon's experience, the reputation of the clinic, the approach used, the degree of hair loss, and the quantity of grafts required. During the visit, the trichologist will determine the number of grafts required to cover your bald area or based on the severity of hair loss.",
  secondaryHeading: "HOW MUCH DOES A FUT HAIR TRANSPLANT COST?",
  secondaryDescription: "Follicular Unit Transplantation or FUT or strip surgery, is a hair transplant technique in which healthy hair follicles or grafts are extracted from a strip that is extracted from the hair-bearing part of the skin. Then they are transplanted to areas affected with hair loss.",
  benefitStripHeading: "BENEFITS OF HAIR TRANSPLANT AT DMC TRICHOLOGY",
  altText: "Hair transplant cost consultation"
};

const hairCostBenefitPoints = [
  "Natural regrowth of hair",
  "Minimum downtime",
  "Pain-free with no visible scars",
  "Long-term cost efficient"
];

const hairCostEditorialFaqDescription = `Choosing the right hair transplant clinic matters when seeking a successful hair transplant surgery. If you are searching for the best clinic for hair transplant, look no further than DMC Trichology. Many patients go for hair transplant surgery at DMC Trichology, as it stands out among other clinics, because of the following reasons:

DMC Trichology is a pioneer in hair transplant services, conveniently located in Delhi at Rajouri Garden (West Delhi) & Vasant Vihar (South Delhi).

DMC trichology has a legacy of excellence in its hair transplant services.`;

const consultationHeading = "REQUEST A CONSULTATION";
const consultationDescription = "Clinic Timings ( By Appointments Only )\nMonday to Saturday : 9:00 AM to 8:00 PM\nSunday : 10:00 AM to 7:00 PM";
const FUE_DETAIL_SLUGS = ["fue-hair-transplant"];
const BODY_HAIR_DETAIL_SLUGS = ["body-hair-transplant-bht"];
const fueProcedureDefaults = {
  heading: "FUE HAIR TRANSPLANT PROCEDURE",
  image: "/images/service-details/fue-procedure.webp",
  altText: "FUE hair transplant procedure at DMC Trichology",
  content: `The FUE technique involves extracting healthy follicular hair units from the donor scalp area, usually from the back or side of the scalp, and implanting them into the recipient area. It is performed with a sophisticated surgical tool to extract individual follicular units without damaging the neighbouring tissue.

The procedure is minimally invasive & discreet. The donor area is carefully shaved to remain undetectable and thus allows the patient to return to normal activities in no time.

Our leading **hair transplant surgeon** at DMC Trichology expertise in providing the **best FUE hair transplant in Delhi**. We are among the very few in the nation to have mastered the skill of complicated injectables associated with hair transplants. Being an expert in pain medicine and critical care, our surgeons provide the safest FUE hair transplantation with zero risk factors & optimal results.

To get the best FUE hair transplant or to learn about the FUE hair transplant cost in Delhi, visit DMC Trichology Centre. We have centres at Rajouri Garden (West Delhi) & Vasant Vihar (South Delhi).`,
  isVisible: true
};
const fueCostSectionDefaults = {
  heading: "FUE HAIR TRANSPLANT COST IN DELHI",
  introText: "The key elements that affect the cost of FUE hair transplant in Delhi are:",
  points: [
    { pointText: "Number of grafts required to cover the balding area", sortOrder: 1, isVisible: true },
    { pointText: "Extend of hair loss", sortOrder: 2, isVisible: true },
    { pointText: "quality and thickness of the donor's hair", sortOrder: 3, isVisible: true },
    { pointText: "Experience and skill of the hair transplant surgeon", sortOrder: 4, isVisible: true },
    { pointText: "post-surgery care and follow-up appointments", sortOrder: 5, isVisible: true },
    { pointText: "Clinics facility with technology offered", sortOrder: 6, isVisible: true },
    { pointText: "Customization of the treatment to enhance the result.", sortOrder: 7, isVisible: true }
  ],
  noteText: "The cost per graft ranges from Rs 20 to Rs 120. It is decided based on the donor site's health.",
  image: "/images/service-details/fue-cost-info.webp",
  altText: "FUE hair transplant cost in Delhi chart",
  tableHeaders: ["No. of Grafts", "FUE Hair Transplant Cost in Delhi"],
  tableRows: [
    { grafts: "< 2000", cost: "50K", sortOrder: 1, isVisible: true },
    { grafts: "2500-3500", cost: "60K-84K", sortOrder: 2, isVisible: true },
    { grafts: "3500-4500", cost: "84K- 108K", sortOrder: 3, isVisible: true },
    { grafts: "4500-5500", cost: "108K-132K", sortOrder: 4, isVisible: true },
    { grafts: "More than 6000", cost: "144K", sortOrder: 5, isVisible: true }
  ],
  isVisible: true
};
const fueOptingBenefitsDefaults = {
  heading: "BENEFITS OF OPTING FOR A FUE HAIR TRANSPLANT",
  introText: "It is critical to remember that each individual is unique, and so are their needs and intended objectives from cosmetic surgery like FUE hair transplant in Delhi, India. If you are considering FUE hair transplant as a solution to your hair loss or thinning, you should schedule a thorough consultation with one of the skilled hair transplant surgeons at DMC Trichology. During the consultation, you can know what FUE hair transplant has set for you and whether you are a good candidate for it.",
  leadText: "The benefits of electing a FUE hair transplant include:",
  benefits: [
    { title: "Minimally invasive", description: "FUE hair transplantation involves the removal of donor hair follicles using a micro-punch tool and their placement into the micro-holes created at the recipient site. The surgery is the least invasive and associated with minimal scarring, discomfort, side effects, risks, complications, and downtime.", sortOrder: 1, isVisible: true },
    { title: "Hair styling flexibility", description: "Following the hair transplantation surgery recovery period, patients may be able to style their hair short or long, as per their choice without worrying about having noticeable, ugly scars.", sortOrder: 2, isVisible: true },
    { title: "Natural-looking results", description: "The purpose of the FUE procedure is natural hair restoration in the areas of hair thinning or hair loss. The hair follicles are transplanted at an angle matching the natural growth pattern of the patient's existing hair. This means no one expects the patient and the surgeon to be able to tell that a hair transplant has been performed.", sortOrder: 3, isVisible: true },
    { title: "Minimal discomfort", description: "Individual experiences of undergoing a FUE hair transplant may vary. Many patients report little to no discomfort during the FUE hair transplantation because of the effect of local anaesthesia. Some report experiencing soreness or sensitivity following the surgery.", sortOrder: 4, isVisible: true },
    { title: "No stitches or staples", description: "FUE hair transplant does not involve the making of incisions and the use of sutures or staples. Rather, it involves the use of micro-punch devices to extract hair follicles.", sortOrder: 5, isVisible: true },
    { title: "Minimal scarring", description: "Unlike FUT hair transplants, where linear scarring occurs at the donor site, harvesting grafts by the FUE technique leaves behind micro-punch holes.", sortOrder: 6, isVisible: true },
    { title: "Recovery", description: "Recovery time is typically faster with the FUE treatment in Delhi than other hair transplanting procedures because it is the least invasive. It is generally expected to take around 72 hours, though individual recovery times may vary.", sortOrder: 7, isVisible: true }
  ],
  isVisible: true
};
const isFueDetailSlug = (slug) => FUE_DETAIL_SLUGS.includes(String(slug || "").toLowerCase());
const isBodyHairDetailSlug = (slug) => BODY_HAIR_DETAIL_SLUGS.includes(String(slug || "").toLowerCase());

const bodyHairIntroDefaults = {
  heading: "WHAT IS BODY HAIR TRANSPLANT?",
  content: `Men and women suffering from extensive hair loss or baldness often wonder whether they have sufficient healthy hair follicles for performing hair transplants. Here comes a sigh of relief! In case of not enough donor hair grafts, a body hair transplant can be an ideal solution to combat scalp hair loss.

The best body hair transplant or BHT is available at an affordable price at DMC Trichology. You can contact us to know your candidacy.

BHT is a cosmetic surgical procedure, a permanent hair restoration method, wherein healthy hair follicles are taken from any hair-bearing body site and implanted in the bald areas of the scalp to provide full hair coverage. It is solely done using a FUE (Follicular Unit Extraction) technique. The body areas that can serve as donor sites include the beard, chest, stomach, leg, armpits, and pubic area.`,
  isVisible: true
};

const bodyHairSuitableDefaults = {
  heading: "SUITABLE CANDIDATES",
  procedureHeading: "PROCEDURE",
  procedureContent: `Like in any other Hair Restoration procedures, follicular unit extraction (FUE) technique is best suited in Body Hair Transplantation as well. It is one of the best techniques used at our centre to provide the best body hair transplant in Delhi, Vasant Vihar (South Delhi) & Rajouri Garden (West Delhi). Instead of strip harvesting of hair with skin, individual extraction of follicular units from various parts of the body including beard, chest, arms, legs in hirsute candidates are often used as the source of secondary donor supply. This procedure can be successfully done either alone or with donor scalp hairs for greater coverage.

Follicular unit extraction for body hair transplant utilises a unique & sophisticated sharp tip punches to create minimal tissue damaged and the individual graft is harvested one at a time. With this procedure, there is no linear scarring and no post surgical discomfort. Due to quicker healing of wounds and less traumatic for patients, FUE is the best option for Body Hair Transplant.`,
  candidates: [
    "Advanced grades of Androgenetic Alopecia with limited donor scalp hair to give sufficient coverage.",
    "Extensive Scarring Alopecia in which no adequate donor hair is available due to scarring patches.",
    "To correct & repair previous poor results from traditional hair transplant methods.",
    "To enhance the volume & hair density for those with retrograde thinning of scalp donor."
  ],
  benefitsHeading: "BENEFITS",
  benefitsIntro: "Following are a few of the body hair transplant in Delhi performed at our centre:",
  benefits: [
    "Through BHT, people with severe hair loss issues can be a potential candidate for a hair transplant with a pool of donor hairs.",
    "There is no limitation to harvesting hair grafts if future transplantation is needed.",
    "Any definitive hair designed is made practicable with BHT for as many as hair grafts can be extracted."
  ],
  concernsHeading: "CONCERNS",
  concernsContent: `Body Hair Transplantation is comparatively a demanding procedure that requires higher skills & precision to achieve optimal results. Since the characteristics of body hair grafts as compared to scalp hair vary distinctively in texture, density, colour, etc it needs exceptional skills in creating a seeming resemblance to natural appearance throughout the implantation.

DMC-TRICHOLOGY is known to yield highly effective results with our most notable hair transplant surgeons. This makes the centre well renowned for providing the best body hair transplant in Delhi. Our experts are the most esteemed hair specialists committed to providing the best outcome in any surgical procedure being conducted at the centre.`,
  isVisible: true
};

const serviceGlobalSectionDefaults = {
  section1: {
    isVisible: true,
    sortOrder: 10,
    label: "",
    title: "",
    description: "",
    media: []
  },
  section2: {
    isVisible: true,
    sortOrder: 20,
    badge: "",
    title: "",
    points: [],
    image: ""
  },
  section3: {
    isVisible: true,
    sortOrder: 30,
    title: "",
    subtitle: "",
    candidates: [],
    image: "",
    ctaTitle: "",
    ctaDescription: "",
    ctaButtonText: ""
  },
  section4: {
    isVisible: true,
    sortOrder: 40,
    title: "",
    processSteps: []
  },
  section5: {
    isVisible: true,
    sortOrder: 50,
    badge: "",
    title: "",
    description: "",
    image: ""
  },
  section6: {
    isVisible: true,
    sortOrder: 60,
    title: "",
    results: []
  },
  section7: {
    isVisible: true,
    sortOrder: 70,
    beforeTitle: "Before Treatment",
    afterTitle: "After Treatment",
    beforePoints: [],
    afterPoints: []
  },
  section8: {
    isVisible: true,
    sortOrder: 80,
    introText: "",
    title: "",
    faqs: [],
    formTitle: "",
    buttonText: ""
  },
  section9: {
    isVisible: true,
    sortOrder: 90,
    badge: "",
    title: "",
    rows: [],
    note: ""
  }
};

const withGlobalSectionDefaults = (payload = {}) => ({
  ...payload,
  section1: { ...serviceGlobalSectionDefaults.section1, ...(payload.section1 || {}) },
  section2: { ...serviceGlobalSectionDefaults.section2, ...(payload.section2 || {}) },
  section3: { ...serviceGlobalSectionDefaults.section3, ...(payload.section3 || {}) },
  section4: { ...serviceGlobalSectionDefaults.section4, ...(payload.section4 || {}) },
  section5: { ...serviceGlobalSectionDefaults.section5, ...(payload.section5 || {}) },
  section6: { ...serviceGlobalSectionDefaults.section6, ...(payload.section6 || {}) },
  section7: { ...serviceGlobalSectionDefaults.section7, ...(payload.section7 || {}) },
  section8: { ...serviceGlobalSectionDefaults.section8, ...(payload.section8 || {}) },
  section9: { ...serviceGlobalSectionDefaults.section9, ...(payload.section9 || {}) }
});

const isGenericBenefitPointSet = (points = []) => {
  const text = points.map(point => String(point?.benefitText || "").toLowerCase()).join(" ");
  return points.length < 4 || text.includes("painless and non-invasive") || text.includes("maximizes hair density") || text.includes("minimal post-treatment");
};

const normalizeHairCostBenefitsSection = (benefitsSection = {}) => ({
  ...benefitsSection,
  heading: !benefitsSection?.heading || String(benefitsSection.heading).toLowerCase().includes("key benefits")
    ? hairCostBenefitsSectionDefaults.heading
    : benefitsSection.heading,
  description: benefitsSection?.description || hairCostBenefitsSectionDefaults.description,
  secondaryHeading: benefitsSection?.secondaryHeading || hairCostBenefitsSectionDefaults.secondaryHeading,
  secondaryDescription: benefitsSection?.secondaryDescription || hairCostBenefitsSectionDefaults.secondaryDescription,
  benefitStripHeading: benefitsSection?.benefitStripHeading || hairCostBenefitsSectionDefaults.benefitStripHeading,
  altText: benefitsSection?.altText || hairCostBenefitsSectionDefaults.altText,
  points: (!benefitsSection?.points?.length || isGenericBenefitPointSet(benefitsSection.points) ? hairCostBenefitPoints.map((benefitText, index) => ({
    benefitText,
    icon: "",
    sortOrder: index + 1,
    isVisible: true
  })) : benefitsSection.points)
});

const normalizeHairCostContentBlocks = (contentBlocks = []) => {
  const blocks = Array.isArray(contentBlocks) ? [...contentBlocks] : [];
  const targetIndex = blocks.findIndex((block) =>
    String(block?.heading || "").toLowerCase().includes("what factors influence the cost of a hair transplant")
  );

  if (targetIndex === -1) {
    return [
      ...blocks,
      {
        heading: "WHAT FACTORS INFLUENCE THE COST OF A HAIR TRANSPLANT?",
        description: hairCostFactorDescription,
        sortOrder: blocks.length + 1,
        isVisible: true
      }
    ];
  }

  const currentDescription = String(blocks[targetIndex]?.description || "");
  const hasDashboardTickFormat = currentDescription
    .split(/\r?\n/)
    .some((line) => /^[-*]\s+/.test(line.trim()));

  if (!hasDashboardTickFormat) {
    blocks[targetIndex] = {
      ...blocks[targetIndex],
      description: hairCostFactorDescription
    };
  }

  return blocks;
};

// ─── Unified Media Item Editor (supports Image + Video) ───────────────────────
function MediaItemEditor({ item, index, onUpdate, onRemove, onPickFromLibrary, onMoveUp, onMoveDown, canMoveUp = false, canMoveDown = false }) {
  const [uploading, setUploading] = useState(false);
  const [thumbUploading, setThumbUploading] = useState(false);

  const uploadFile = async (file, fieldName, setLoadingFn) => {
    const fd = new FormData();
    fd.append('image', file);
    setLoadingFn(true);
    try {
      const res = await axios.post('/service-details/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        onUpdate(fieldName, res.data.url);
        toast.success(fieldName === 'url' ? "Media uploaded!" : "Thumbnail uploaded!");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setLoadingFn(false);
    }
  };

  const isVideo = item.type === 'video';
  const previewUrl = isVideo ? (item.thumbnail || '') : (item.url || '');

  return (
    <div className="group relative bg-white rounded-[24px] border-2 border-slate-100 hover:border-blue-200 p-6 transition-all duration-300 shadow-sm hover:shadow-lg">
      {/* Slide Number + Remove */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
            <span className="text-xs font-black text-white">{index + 1}</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Slide {index + 1}</span>
        </div>
        <div className="flex items-center gap-1">
          {onMoveUp && (
            <button
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-30"
            >
              <ArrowUp size={14} />
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-30"
            >
              <ArrowDown size={14} />
            </button>
          )}
          <button
            onClick={onRemove}
            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Media Type Toggle */}
      <div className="mb-5">
        <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Media Type</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              onUpdate('type', 'image');
              onUpdate('thumbnail', '');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${
              !isVideo 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            <ImageIcon size={13} /> Image
          </button>
          <button
            type="button"
            onClick={() => onUpdate('type', 'video')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${
              isVideo 
                ? 'bg-violet-600 text-white shadow-md shadow-violet-200' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            <Film size={13} /> Video
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">Slide Title</label>
        <input 
          type="text" 
          value={item.title || ''} 
          onChange={e => onUpdate('title', e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="e.g. Treatment Overview"
        />
      </div>

      {/* Main Media URL + Upload */}
      <div className="mb-4">
        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">
          {isVideo ? 'Video File' : 'Image File'}
        </label>
        <div className="flex gap-3 items-center">
          {/* Preview Thumbnail */}
          <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            {previewUrl ? (
              isVideo ? (
                <div className="w-full h-full position-relative">
                  <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                      <Film size={12} className="text-violet-600" />
                    </div>
                  </div>
                </div>
              ) : (
                <img src={previewUrl} alt="" className="w-full h-full object-cover" />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50">
                {isVideo ? <Film size={20} className="text-slate-300" /> : <ImageIcon size={20} className="text-slate-300" />}
              </div>
            )}
          </div>

          {/* URL Input */}
          <div className="flex-1 space-y-2">
            <input 
              type="text" 
              value={item.url || ''} 
              onChange={e => onUpdate('url', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder={isVideo ? 'Video file URL...' : 'Image URL...'}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onPickFromLibrary('url')}
                className="flex-1 flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all"
              >
                <ImageIcon size={12} /> Gallery
              </button>
              <label className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase cursor-pointer transition-all">
                {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                Upload
                <input 
                  type="file" 
                  accept={isVideo ? "video/*" : "image/*"} 
                  className="hidden" 
                  onChange={e => e.target.files[0] && uploadFile(e.target.files[0], 'url', setUploading)} 
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Video Thumbnail (only for video type) */}
      {isVideo && (
        <div className="mb-4">
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">Video Cover Image (Thumbnail)</label>
          <div className="flex gap-3 items-center">
            <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              {item.thumbnail ? (
                <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-50">
                  <ImageIcon size={20} className="text-slate-300" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <input 
                type="text" 
                value={item.thumbnail || ''} 
                onChange={e => onUpdate('thumbnail', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                placeholder="Thumbnail image URL..."
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onPickFromLibrary('thumbnail')}
                  className="flex-1 flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all"
                >
                  <ImageIcon size={12} /> Gallery
                </button>
                <label className="flex-1 flex items-center justify-center gap-1 bg-violet-50 text-violet-600 hover:bg-violet-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase cursor-pointer transition-all">
                  {thumbUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  Upload
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={e => e.target.files[0] && uploadFile(e.target.files[0], 'thumbnail', setThumbUploading)} 
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alt Text */}
      <div>
        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">Alt Text (SEO)</label>
        <input 
          type="text" 
          value={item.alt || ''} 
          onChange={e => onUpdate('alt', e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Describe this media for SEO..."
        />
      </div>
    </div>
  );
}

// ─── Standard Media Uploader (for other sections) ────────────────────────────
function MediaUploader({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    setUploading(true);
    try {
      const res = await axios.post('/service-details/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        onChange(res.data.url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Upload failed: " + (res.data.message || "Unknown error"));
      }
    } catch {
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">{label}</label>
      <div className="flex items-center gap-4">
        {value && (
          <img src={value} alt="Preview" className="h-16 w-16 rounded-xl object-cover border border-slate-200" />
        )}
        <div className="flex-1 relative">
           <input 
             type="text" 
             value={value || ""} 
             onChange={e => onChange(e.target.value)} 
             className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl pr-28 outline-none focus:border-blue-500 transition-all text-sm" 
             placeholder="https://..."
           />
           <label className="absolute right-2 top-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1">
             {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
             Upload
             <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
           </label>
        </div>
      </div>
    </div>
  );
}

// Reordering helper
const moveArrayItem = (arr, index, direction) => {
  const newArr = [...arr];
  if (direction === 'up' && index > 0) {
    const temp = newArr[index];
    newArr[index] = newArr[index - 1];
    newArr[index - 1] = temp;
  } else if (direction === 'down' && index < newArr.length - 1) {
    const temp = newArr[index];
    newArr[index] = newArr[index + 1];
    newArr[index + 1] = temp;
  }
  return newArr;
};

const numberedItems = (items) => items.map((text, index) => ({
  bulletText: text,
  featureText: text,
  benefitText: text,
  sortOrder: index + 1,
  isVisible: true
}));

const bestHairTransplantTemplate = {
  title: "Best Hair Transplant",
  category: "transplant",
  banner: {
    badgeText: "BEST HAIR CLINIC",
    title: "Best Hair Transplant",
    subtitle: "Advanced hair restoration with natural-looking density and expert surgical planning.",
    duration: "6-8 hours",
    buttonText: "Book Consultation",
    backgroundImage: "",
    secondaryTitle: "Best Hair Transplant",
    tagline: "Natural Hair Restoration",
    shortDescription: "Advanced hair restoration with natural-looking density and expert surgical planning."
  },
  intro: {
    badgeText: "ABOUT THE TREATMENT",
    title: "Best Hair Transplant",
    rating: "4.9",
    duration: "6-8 hours",
    longDescription: "A hair transplant is a minimally invasive surgical procedure in which hair follicles are extracted from a donor site, generally the back or sides of the head, and transplanted to the balding or thinning areas.\n\nHair transplants can give permanent, natural-looking results when planned carefully around your face structure, donor area, and future hair loss pattern.",
    benefits: [
      { text: "Permanent and natural-looking results" },
      { text: "Customized hairline planning" },
      { text: "Advanced techniques for better density" },
      { text: "Clear post-procedure aftercare guidance" }
    ],
    introMedia: []
  },
  contentBlocks: [
    {
      heading: "WHAT IS A HAIR TRANSPLANT?",
      description: "A hair transplant is a minimally invasive surgical procedure in which hair follicles are extracted from a donor site, generally the back or sides of the head, and transplanted to the balding or thinning areas.\n\nIn other words, hair is taken from one part of the scalp area and implanted into another part where there is almost no hair.\n\nHair transplants are generally performed by hair transplant surgeons. The procedure can take 4-8 hours; most people can return to work within 2-5 days.\n\nHair transplants can give permanent, natural-looking results. However, the transplanted hair will fall out within 2-3 weeks, and new growth will not be noticeable for a few months.",
      sortOrder: 1,
      isVisible: true
    }
  ],
  benefitsSection: {
    heading: "KEY BENEFITS OF HAIR TRANSPLANT",
    image: "",
    altText: "Hair transplant benefits",
    points: numberedItems([
      "Restores a natural-looking hairline.",
      "Uses your own healthy donor hair.",
      "Offers permanent growth in transplanted areas.",
      "Improves density in thinning or bald areas."
    ])
  },
  idealCandidates: {
    sectionHeading: "IDEAL CANDIDATES FOR HAIR TRANSPLANT",
    introText: "Hair transplant is a suitable option for adults, both men and women, who:",
    bottomConclusionText: "",
    sectionImage: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
    altText: "Ideal candidates for hair transplant",
    bullets: numberedItems([
      "Are distressed with their looks affected by different kinds of alopecia (except alopecia areata) or having thinning hair, receding hairline, or bald spots/patches.",
      "People experiencing baldness in patches, widening hair partition, and hair thinning and less volume are candidates for this procedure.",
      "Are having enough healthy hair growth at the back or sides of their head to serve as donor areas.",
      "Are unable to restore their natural hair growth with non-surgical alternatives like meso grow, RRT, HGP, mesotherapy, and others.",
      "Are having healthy scalp with good skin laxity and no active infections, injuries, or skin conditions.",
      "Are physically and mentally healthy without any illnesses or conditions that could interfere with the surgery outcome.",
      "They have realistic expectations of their surgery results and a positive outlook toward their treatment.",
      "Women with thinning hair and receding hairline.",
      "People looking for a change in their existing hairline."
    ])
  },
  notCandidatesSection: {
    sectionHeading: "WHO IS NOT A CANDIDATE FOR HAIR TRANSPLANT SURGERY?",
    bullets: numberedItems([
      "Those with a keloidal tendency",
      "Those with active infection or inflammation on the scalp."
    ])
  },
  techniquesSection: {
    sectionHeading: "HAIR TRANSPLANT TECHNIQUES",
    techniques: [
      {
        title: "FUE HAIR TRANSPLANT",
        description: "FUE is a modern extraction method where individual follicles are taken from the donor area and implanted into the required area with careful angle and density planning.",
        sortOrder: 1,
        isVisible: true
      },
      {
        title: "FUT HAIR TRANSPLANT",
        description: "FUT may be recommended in selected cases where a larger number of grafts are required and the donor area allows strip-based harvesting.",
        sortOrder: 2,
        isVisible: true
      }
    ]
  },
  infoBlocksSection: {
    blocks: [
      {
        heading: "WHAT HAPPENS DURING THE HAIR TRANSPLANT PROCEDURE?",
        description: "During the surgery, the hair from the 'donor' area of the scalp is trimmed short. This makes the procedure easy to perform. Then, the head area where the hair grows is thick and anaesthetized safely.\n\nThe small hair grafts are extracted, and then transplanted into the front or bald area of the scalp.",
        backgroundVariant: "white",
        sortOrder: 1,
        isVisible: true
      }
    ]
  },
  aftercareSection: {
    sectionHeading: "WHAT TO EXPECT AFTER HAIR TRANSPLANT PROCEDURE?",
    introText: "There will be small red scabs on the recipient site. They will be visible for about 7-10 days. One can see their normal appearance after 10-15 days after surgery. There will be a slight redness that might be visible for a few days.",
    bullets: numberedItems([
      "WHEN DO YOU SEE RESULTS FROM HAIR TRANSPLANT SURGERY?"
    ]),
    conclusionText: "After about 2-4 months of receiving a hair transplant, your transplanted hair will start to push through your skin, which is fine initially. The hair growth happens at different times and speeds, resulting in a patchy start. You can expect full growth of your transplanted hair in about a year."
  },
  whyChooseUsSection: {
    sectionHeading: "HOW TO TAKE CARE OF SCALP AFTER HAIR TRANSPLANT?",
    introText: "Post-hair transplant, you must follow these aftercare steps as set by the hair transplant surgeons:",
    features: numberedItems([
      "Spray the scalp with saline for 1 to 4 days to speed healing and prevent incision infection and scabbing.",
      "48 hours post-procedure, the scalp is washed with medicated shampoo.",
      "Take proper rest in the initial few days to speed up your recovery.",
      "Avoid swimming, smoking, alcohol consumption, steam rooms, sun tanning beds, hot baths, and high-impact exercise for a few days.",
      "Take prescribed painkillers, anti-inflammatory medications, and antibiotics to reduce pain, swelling, and chances of infection.",
      "Avoid the application of any hair products.",
      "Do not wear tight headwear like caps and helmets that can cause sweating and delay healing.",
      "Avoid exposing the scalp to direct sunlight.",
      "Do not comb hair in the initial few days.",
      "Gently wash the scalp after 5 to 7 days of the surgery, and normally wash hair after about 2 weeks.",
      "Schedule check-up appointments after 3 months and 6 months after the surgery to see the progress of the results."
    ])
  },
  hairTransplantInfoSection: {
    isVisible: true,
    cards: [
      {
        title: "HOW LONG DOES THE HAIR TRANSPLANT PROCEDURE TAKE?",
        content: "Hair transplant surgery lasts for a few hours. The procedure duration is decided based on the surgical technique chosen and the size of the area to be covered with donor hair. Mostly, the hair transplantation procedure is over in a single day, but two sessions may be required in case of extensive hair loss.",
        isVisible: true,
        sortOrder: 1
      },
      {
        title: "IS HAIR TRANSPLANT SURGERY PAINFUL?",
        content: "The procedure is performed under anaesthetic, and the method does not cause any pain. The scalp will feel a little numb and tender once the anaesthesia wears off. There will be a little redness and swelling for a few days after surgery. One can take mild painkillers (as advised by the doctor) to alleviate any pain and discomfort following surgery.\n\nYou will be surprised to have a comfortable experience during a hair transplant surgery in Delhi, India, at DMC Trichology. As local anaesthesia will be injected into the donor and recipient areas, the only pain or discomfort felt by you during the operation would be the injections. After the hair transplant, there will be slight irritation, redness, or swelling, but such discomfort quickly subsides.",
        isVisible: true,
        sortOrder: 2
      }
    ]
  },
  hairTransplantWhyChooseSection: {
    sectionHeading: "WHY CHOOSE DMC TRICHOLOGY FOR HAIR TRANSPLANT IN DELHI?",
    introText: "Choose us for a hair transplant in Delhi because we offer hair transplant procedures to ensure high-quality care for patients.",
    points: [
      "Expert Team of Surgeons",
      "Advanced Techniques",
      "State-of-the-Art Facilities",
      "Personalized Treatment Plans",
      "Best Results of Hair Transplant",
      "Affordable Cost",
      "Patient Positive Feedback",
      "Patient Support and Care"
    ]
  }
};

const getServiceDetailTemplate = (slug) => {
  if (slug === "best-hair-transplant") return bestHairTransplantTemplate;
  return null;
};

const applyTemplateToData = (currentData, template, selectedSlug, serviceInfo = {}) => ({
  ...withGlobalSectionDefaults({
    ...(currentData || {}),
    ...template,
    slug: selectedSlug,
    title: serviceInfo.title || template.title || currentData?.title || "",
    category: serviceInfo.category || template.category || currentData?.category || "",
    seo: {
      ...(currentData?.seo || {}),
      ...(template.seo || {})
    }
  })
});

export default function ServiceDetailCMS() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const serviceSlugFromUrl = searchParams.get("service") || "";
  const [services, setServices] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [data, setData] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("banner");
  const [sectionsLayout, setSectionsLayout] = useState({});
  const [cardInfo, setCardInfo] = useState({});
  const [savingCard, setSavingCard] = useState(false);
  const [categories, setCategories] = useState([]);

  const ALL_SECTIONS = [
    { id: "banner", label: "Hero & Intro" },
    { id: "section1", label: "Section 1" },
    { id: "section2", label: "Section 2" },
    { id: "section3", label: "Section 3" },
    { id: "section4", label: "Section 4" },
    { id: "section5", label: "Section 5" },
    { id: "section6", label: "Section 6" },
    { id: "section7", label: "Section 7" },
    { id: "section8", label: "Section 8" },
    { id: "section9", label: "Section 9" },
  ];

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newService, setNewService] = useState({ title: "", category: "", slug: "", image: "", shortDescription: "" });
  const [creating, setCreating] = useState(false);

  // Gallery Picker States
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [gallerySearch, setGallerySearch] = useState("");
  const [activePickerTarget, setActivePickerTarget] = useState(null); // { section, arrayField, index, field }
  const activeTemplate = getServiceDetailTemplate(selectedSlug);

  const fetchGallery = async () => {
    setGalleryLoading(true);
    try {
      const res = await axios.get("/gallery?page=1&limit=200");
      if (res.data?.data) {
        setGalleryItems(res.data.data);
      }
    } catch {
      toast.error("Failed to load gallery items");
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleOpenGalleryPicker = (index, field, section = "intro", arrayField = "introMedia") => {
    setActivePickerTarget({ section, arrayField, index, field });
    fetchGallery();
    setShowGalleryPicker(true);
  };

  const handleSelectGalleryItem = (item) => {
    if (!activePickerTarget) return;
    const { section, arrayField, index, field } = activePickerTarget;
    // Set the selected URL
    const url = item.imageUrl || item.image || item.url || "";
    updateArrayItem(section, arrayField, index, field, url);
    
    // Auto-fill type and default thumbnail if it's the main URL
    if (field === 'url') {
      const isVid = item.mediaType === 'video';
      updateArrayItem(section, arrayField, index, 'type', isVid ? 'video' : 'image');
    }

    setShowGalleryPicker(false);
    setActivePickerTarget(null);
    toast.success("Media selected from gallery!");
  };

  const selectServiceForEditing = (slug, options = {}) => {
    if (!slug) return;
    setSelectedSlug(slug);
    setActiveTab("banner");

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("service", slug);
    setSearchParams(nextParams, { replace: options.replace ?? false });
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get("/service-listing-cards");
      if (res.data?.data) {
        setServices(res.data.data);
        return res.data.data;
      }
    } catch (error) {
      toast.error("Failed to load services list");
    }
    return [];
  };

  useEffect(() => {
    fetchServices().then(list => {
      if (!serviceSlugFromUrl) {
        // No service in URL — open create modal directly
        setIsCreateModalOpen(true);
        setLoading(false);
        return;
      }
      if (list.length > 0) {
        const serviceExistsInUrl = list.some(service => service.slug === serviceSlugFromUrl);
        selectServiceForEditing(serviceExistsInUrl ? serviceSlugFromUrl : list[0].slug, { replace: true });
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!serviceSlugFromUrl) return;
    setIsCreateModalOpen(false);
    if (serviceSlugFromUrl === selectedSlug) return;
    setSelectedSlug(serviceSlugFromUrl);
  }, [serviceSlugFromUrl, selectedSlug]);

  // Load categories once
  useEffect(() => {
    axios.get("/service-listing-categories").then(res => {
      if (res.data?.data) setCategories(res.data.data);
    }).catch(() => {});
  }, []);

  // Sync card info whenever the selected service changes
  useEffect(() => {
    if (!selectedSlug || !services.length) return;
    const card = services.find(s => s.slug === selectedSlug);
    if (card) {
      setCardInfo({
        id: card.id || card._id || '',
        title: card.title || '',
        slug: card.slug || '',
        image: card.image || '',
        category: card.category || '',
        rating: card.rating ?? 4.8,
        duration: card.duration || '45 mins',
        shortDescription: card.shortDescription || card.short_description || '',
        buttonText: card.buttonText || 'View Details',
        buttonLink: card.buttonLink || `/details/${card.slug}`,
        featured: card.featured ?? false,
        status: card.status || 'Published',
      });
    }
  }, [selectedSlug, services]);

  useEffect(() => {
    if (!selectedSlug) return;
    
    setFetchingDetails(true);
    axios.get(`/service-details/${selectedSlug}`)
      .then(res => {
        if (res.data?.data) {
          const fetchedData = res.data.data;
          // Normalize intro media — convert any legacy format to introMedia
          if (fetchedData.intro) {
            const intro = fetchedData.intro;
            if (!intro.introMedia || intro.introMedia.length === 0) {
              if (Array.isArray(intro.videos) && intro.videos.length > 0) {
                intro.introMedia = intro.videos.map(v => ({
                  type: v.videoUrl ? 'video' : 'image',
                  url: v.thumbnail || v.image || v.videoUrl || '',
                  title: v.title || '',
                  alt: v.title || '',
                  thumbnail: v.thumbnail || v.image || ''
                }));
              } else if (Array.isArray(intro.introImages) && intro.introImages.length > 0) {
                intro.introMedia = intro.introImages.map(img => ({
                  type: 'image',
                  url: img.image || img.url || '',
                  title: img.title || '',
                  alt: img.alt || img.title || '',
                  thumbnail: img.image || img.url || ''
                }));
              } else {
                intro.introMedia = [];
              }
            }
          }
          if (!fetchedData.contentBlocks) {
            fetchedData.contentBlocks = [];
          }
          if (isHairCostDelhiSlug(selectedSlug)) {
            fetchedData.contentBlocks = normalizeHairCostContentBlocks(fetchedData.contentBlocks);
          }
          if (!fetchedData.benefitsSection) {
            fetchedData.benefitsSection = { heading: "Key Benefits of the Treatment", image: "", altText: "", points: [] };
          } else if (!fetchedData.benefitsSection.points) {
            fetchedData.benefitsSection.points = [];
          }
          if (isHairCostDelhiSlug(selectedSlug)) {
            fetchedData.benefitsSection = normalizeHairCostBenefitsSection(fetchedData.benefitsSection);
          }
          if (!fetchedData.fueProcedureSection) {
            fetchedData.fueProcedureSection = { ...fueProcedureDefaults };
          } else if (isFueDetailSlug(selectedSlug)) {
            fetchedData.fueProcedureSection = {
              ...fueProcedureDefaults,
              ...fetchedData.fueProcedureSection,
              heading: fetchedData.fueProcedureSection.heading || fueProcedureDefaults.heading,
              content: fetchedData.fueProcedureSection.content || fueProcedureDefaults.content,
              image: fetchedData.fueProcedureSection.image || fueProcedureDefaults.image,
              altText: fetchedData.fueProcedureSection.altText || fueProcedureDefaults.altText,
              isVisible: fetchedData.fueProcedureSection.isVisible !== false
            };
          }
          if (!fetchedData.fueCostSection) {
            fetchedData.fueCostSection = isFueDetailSlug(selectedSlug) ? { ...fueCostSectionDefaults } : { heading: "", introText: "", points: [], noteText: "", image: "", altText: "", tableHeaders: [], tableRows: [], isVisible: true };
          } else if (isFueDetailSlug(selectedSlug)) {
            fetchedData.fueCostSection = {
              ...fueCostSectionDefaults,
              ...fetchedData.fueCostSection,
              heading: fetchedData.fueCostSection.heading || fueCostSectionDefaults.heading,
              introText: fetchedData.fueCostSection.introText || fueCostSectionDefaults.introText,
              points: fetchedData.fueCostSection.points?.length ? fetchedData.fueCostSection.points : fueCostSectionDefaults.points,
              noteText: fetchedData.fueCostSection.noteText || fueCostSectionDefaults.noteText,
              image: fetchedData.fueCostSection.image || fueCostSectionDefaults.image,
              altText: fetchedData.fueCostSection.altText || fueCostSectionDefaults.altText,
              tableHeaders: fetchedData.fueCostSection.tableHeaders?.length ? fetchedData.fueCostSection.tableHeaders : fueCostSectionDefaults.tableHeaders,
              tableRows: fetchedData.fueCostSection.tableRows?.length ? fetchedData.fueCostSection.tableRows : fueCostSectionDefaults.tableRows,
              isVisible: fetchedData.fueCostSection.isVisible !== false
            };
          }
          if (!fetchedData.fueOptingBenefitsSection) {
            fetchedData.fueOptingBenefitsSection = isFueDetailSlug(selectedSlug) ? { ...fueOptingBenefitsDefaults } : { heading: "", introText: "", leadText: "", benefits: [], isVisible: true };
          } else if (isFueDetailSlug(selectedSlug)) {
            fetchedData.fueOptingBenefitsSection = {
              ...fueOptingBenefitsDefaults,
              ...fetchedData.fueOptingBenefitsSection,
              heading: fetchedData.fueOptingBenefitsSection.heading || fueOptingBenefitsDefaults.heading,
              introText: fetchedData.fueOptingBenefitsSection.introText || fueOptingBenefitsDefaults.introText,
              leadText: fetchedData.fueOptingBenefitsSection.leadText || fueOptingBenefitsDefaults.leadText,
              benefits: fetchedData.fueOptingBenefitsSection.benefits?.length ? fetchedData.fueOptingBenefitsSection.benefits : fueOptingBenefitsDefaults.benefits,
              isVisible: fetchedData.fueOptingBenefitsSection.isVisible !== false
            };
          }
          if (!fetchedData.idealCandidates) {
            fetchedData.idealCandidates = { sectionHeading: "Ideal Candidates", introText: "", bottomConclusionText: "", sectionImage: "", altText: "", bullets: [] };
          } else if (!fetchedData.idealCandidates.bullets) {
            fetchedData.idealCandidates.bullets = [];
          }
          if (!fetchedData.bodyHairIntroSection) {
            fetchedData.bodyHairIntroSection = isBodyHairDetailSlug(selectedSlug) ? { ...bodyHairIntroDefaults } : { heading: "", content: "", isVisible: true };
          } else if (isBodyHairDetailSlug(selectedSlug)) {
            fetchedData.bodyHairIntroSection = {
              ...bodyHairIntroDefaults,
              ...fetchedData.bodyHairIntroSection,
              heading: fetchedData.bodyHairIntroSection.heading || bodyHairIntroDefaults.heading,
              content: fetchedData.bodyHairIntroSection.content || bodyHairIntroDefaults.content,
              isVisible: fetchedData.bodyHairIntroSection.isVisible !== false
            };
          }
          if (!fetchedData.bodyHairSuitableSection) {
            fetchedData.bodyHairSuitableSection = isBodyHairDetailSlug(selectedSlug)
              ? { ...bodyHairSuitableDefaults }
              : { heading: "", procedureHeading: "", procedureContent: "", candidates: [], benefitsHeading: "", benefitsIntro: "", benefits: [], concernsHeading: "", concernsContent: "", isVisible: true };
          } else if (isBodyHairDetailSlug(selectedSlug)) {
            fetchedData.bodyHairSuitableSection = {
              ...bodyHairSuitableDefaults,
              ...fetchedData.bodyHairSuitableSection,
              heading: fetchedData.bodyHairSuitableSection.heading || bodyHairSuitableDefaults.heading,
              procedureHeading: fetchedData.bodyHairSuitableSection.procedureHeading || bodyHairSuitableDefaults.procedureHeading,
              procedureContent: fetchedData.bodyHairSuitableSection.procedureContent || bodyHairSuitableDefaults.procedureContent,
              candidates: fetchedData.bodyHairSuitableSection.candidates?.length ? fetchedData.bodyHairSuitableSection.candidates : bodyHairSuitableDefaults.candidates,
              benefitsHeading: fetchedData.bodyHairSuitableSection.benefitsHeading || bodyHairSuitableDefaults.benefitsHeading,
              benefitsIntro: fetchedData.bodyHairSuitableSection.benefitsIntro || bodyHairSuitableDefaults.benefitsIntro,
              benefits: fetchedData.bodyHairSuitableSection.benefits?.length ? fetchedData.bodyHairSuitableSection.benefits : bodyHairSuitableDefaults.benefits,
              concernsHeading: fetchedData.bodyHairSuitableSection.concernsHeading || bodyHairSuitableDefaults.concernsHeading,
              concernsContent: fetchedData.bodyHairSuitableSection.concernsContent || bodyHairSuitableDefaults.concernsContent,
              isVisible: fetchedData.bodyHairSuitableSection.isVisible !== false
            };
          }
          if (isFueDetailSlug(selectedSlug) && typeof fetchedData.notCandidatesSection?.isVisible !== "boolean") {
            fetchedData.notCandidatesSection = { ...(fetchedData.notCandidatesSection || {}), isVisible: false };
          }
          if (!fetchedData.googleReviewCta) {
            fetchedData.googleReviewCta = { title: "Google Review", buttonText: "VIEW MORE", buttonLink: "https://dmctrichology-mkm4.vercel.app/service", backgroundColor: "", isVisible: true };
          }
          if (!fetchedData.resultsSection) {
            fetchedData.resultsSection = { subtitle: "BEFORE AND AFTER", title: "RESULTS THAT SPEAK FOR THEMSELVES", cards: [], buttonText: "VIEW ALL", buttonLink: "https://dmctrichology-mkm4.vercel.app/service", isVisible: true };
          } else if (!fetchedData.resultsSection.cards) {
            fetchedData.resultsSection.cards = [];
          }
          if (!fetchedData.videosSection) {
            fetchedData.videosSection = { title: "VIDEOS", videos: [], buttonText: "VIEW MORE", buttonLink: "https://dmctrichology-mkm4.vercel.app/service", showOnCostPage: false, isVisible: true };
          } else if (!fetchedData.videosSection.videos) {
            fetchedData.videosSection.videos = [];
          }
          if (isHairCostDelhiSlug(selectedSlug) && typeof fetchedData.videosSection.showOnCostPage !== "boolean") {
            fetchedData.videosSection.showOnCostPage = false;
          }
          if (!fetchedData.enquirySection) {
            fetchedData.enquirySection = { title: "Enquire About This Treatment", description: "Schedule your visit for this specialized treatment.", serviceOptions: ["Laser Hair Removal", "Hair Transplant", "Hair Fall Treatment", "Skin Rejuvenation", "Other"], submitButtonText: "Schedule Your Visit", backgroundColor: "", isVisible: true };
          } else if (!fetchedData.enquirySection.serviceOptions) {
            fetchedData.enquirySection.serviceOptions = [];
          }
          if (!fetchedData.faqEnquiry) {
            fetchedData.faqEnquiry = { faqTitle: "Common Concerns Addressed", faqSubtitle: "", faqItems: [], serviceOptions: [], formTitle: "Enquire About This Treatment", buttonText: "Schedule Your Visit" };
          } else if (!fetchedData.faqEnquiry.faqItems) {
            fetchedData.faqEnquiry.faqItems = [];
          }
          if (isHairCostDelhiSlug(selectedSlug)) {
            if (!fetchedData.faqEnquiry.faqTitle || fetchedData.faqEnquiry.faqTitle === "Common Concerns Addressed") {
              fetchedData.faqEnquiry.faqTitle = consultationHeading;
            }
            if (!fetchedData.faqEnquiry.faqSubtitle || fetchedData.faqEnquiry.faqSubtitle === "Common questions about our treatments.") {
              fetchedData.faqEnquiry.faqSubtitle = consultationDescription;
            }
            if (!fetchedData.enquirySection.title || fetchedData.enquirySection.title === "Enquire About This Treatment") {
              fetchedData.enquirySection.title = consultationHeading;
            }
            if (!fetchedData.enquirySection.description || fetchedData.enquirySection.description === "Schedule your visit for this specialized treatment.") {
              fetchedData.enquirySection.description = consultationDescription;
            }
          }
          if (!fetchedData.editorialFaqSection) {
            fetchedData.editorialFaqSection = { sectionSubtitle: "EXPERT ANSWERS", sectionTitle: "EDITORIAL FAQ", sectionDescription: "", faqs: [] };
          } else if (!fetchedData.editorialFaqSection.faqs) {
            fetchedData.editorialFaqSection.faqs = [];
          }
          if (isHairCostDelhiSlug(selectedSlug) && !fetchedData.editorialFaqSection.sectionDescription) {
            fetchedData.editorialFaqSection.sectionDescription = hairCostEditorialFaqDescription;
          }
          Object.assign(fetchedData, withGlobalSectionDefaults(fetchedData));
          setSectionsLayout(fetchedData.sectionsLayout || {});
          setData(fetchedData);
        }
      })
      .catch(err => {
        if (err.response?.status === 404) {
          const serviceInfo = services.find(s => s.slug === selectedSlug) || {};
          const serviceTemplate = getServiceDetailTemplate(selectedSlug);

          if (serviceTemplate) {
            setData(applyTemplateToData({
              slug: selectedSlug,
              title: serviceInfo.title || serviceTemplate.title || "",
              category: serviceInfo.category || serviceTemplate.category || "",
              seo: { metaTitle: "", metaDescription: "", canonicalUrl: "", ogImage: "", schemaScript: "" }
            }, serviceTemplate, selectedSlug, serviceInfo));
            return;
          }

          const isCostFallback = isHairCostDelhiSlug(selectedSlug);

          setData(withGlobalSectionDefaults({
            slug: selectedSlug,
            title: serviceInfo.title || "",
            category: serviceInfo.category || "",
            banner: { badgeText: "PREMIUM TREATMENT", title: serviceInfo.title || "", subtitle: "", duration: "45 mins", buttonText: "Book Consultation", backgroundImage: "" },
            intro: { badgeText: "ABOUT THE TREATMENT", title: serviceInfo.title || "", rating: "4.9", duration: "45 mins", longDescription: "", benefits: [], introMedia: [] },
            process: { sectionTitle: "How it works?", processSteps: [], isVisible: true },
            idealFrequency: { frequencyTitle: "Treatment Frequency & Suitability", frequencyDescription: "", idealForPoints: [], notIdealForPoints: [], ctaTitle: "", ctaDescription: "", ctaButtonText: "", ctaButtonLink: "", ctaImage: "" },
            beforeAfter: { beforeTitle: "Before Treatment Checklist", afterTitle: "Aftercare Instructions", beforePoints: [], afterPoints: [], sectionBackground: "#f9f7f2" },
            faqEnquiry: {
              faqTitle: isCostFallback ? consultationHeading : "Common Concerns Addressed",
              faqSubtitle: isCostFallback ? consultationDescription : "",
              faqItems: [],
              serviceOptions: [],
              formTitle: isCostFallback ? consultationHeading : "Enquire About This Treatment",
              buttonText: "Schedule Your Visit",
              namePlaceholder: "Name*",
              emailPlaceholder: "E-Mail Address*",
              servicePlaceholder: "Type Of Service Enquiry*",
              datePlaceholder: "Select Date & Time*"
            },
            googleReviewCta: { title: "Google Review", buttonText: "VIEW MORE", buttonLink: "https://dmctrichology-mkm4.vercel.app/service", backgroundColor: "", isVisible: true },
            resultsSection: { subtitle: "BEFORE AND AFTER", title: "RESULTS THAT SPEAK FOR THEMSELVES", cards: [], buttonText: "VIEW ALL", buttonLink: "https://dmctrichology-mkm4.vercel.app/service", isVisible: true },
            videosSection: { title: "VIDEOS", videos: [], buttonText: "VIEW MORE", buttonLink: "https://dmctrichology-mkm4.vercel.app/service", showOnCostPage: false, isVisible: true },
            enquirySection: {
              title: isCostFallback ? consultationHeading : "Enquire About This Treatment",
              description: isCostFallback ? consultationDescription : "Schedule your visit for this specialized treatment.",
              serviceOptions: ["Laser Hair Removal", "Hair Transplant", "Hair Fall Treatment", "Skin Rejuvenation", "Other"],
              submitButtonText: "Schedule Your Visit",
              backgroundColor: "",
              isVisible: true
            },
            footerCta: { heading: "", description: "", emailPlaceholder: "", buttonText: "" },
            seo: { metaTitle: "", metaDescription: "", canonicalUrl: "", ogImage: "", schemaScript: "" },
            contentBlocks: [
              {
                heading: "WHAT IS A HAIR TRANSPLANT?",
                description: "A hair transplant is a minimally invasive surgical procedure in which hair follicles are extracted from a donor site (Generally the back or sides of the head) and transplanted to the balding or thinning areas.\n\nIn other words, we can say that hair is taken from one part of the scalp area and implanted into another part where there is almost no hair.\n\nHair transplants are generally performed by hair transplant surgeons. The procedure can take 4–8 hours; most people can return to work within 2–5 days.\n\nHair transplants can give permanent, natural-looking results. However, the transplanted hair will fall out within 2–3 weeks, and new growth won't be noticeable for a few months.",
                sortOrder: 1,
                isVisible: true
              }
            ],
            benefitsSection: {
              heading: "Key Benefits of the Treatment",
              image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
              altText: "Treatment benefits illustration",
              points: [
                { benefitText: "Painless and non-invasive restorative technique", sortOrder: 1, isVisible: true },
                { benefitText: "Maximizes hair density with permanent natural-looking results", sortOrder: 2, isVisible: true },
                { benefitText: "Minimal post-treatment recovery and zero scarring", sortOrder: 3, isVisible: true }
              ]
            },
            fueProcedureSection: isFueDetailSlug(selectedSlug) ? { ...fueProcedureDefaults } : { heading: "", content: "", image: "", altText: "", isVisible: true },
            fueCostSection: isFueDetailSlug(selectedSlug) ? { ...fueCostSectionDefaults } : { heading: "", introText: "", points: [], noteText: "", image: "", altText: "", tableHeaders: [], tableRows: [], isVisible: true },
            fueOptingBenefitsSection: isFueDetailSlug(selectedSlug) ? { ...fueOptingBenefitsDefaults } : { heading: "", introText: "", leadText: "", benefits: [], isVisible: true },
            bodyHairIntroSection: isBodyHairDetailSlug(selectedSlug) ? { ...bodyHairIntroDefaults } : { heading: "", content: "", isVisible: true },
            bodyHairSuitableSection: isBodyHairDetailSlug(selectedSlug) ? { ...bodyHairSuitableDefaults } : { heading: "", procedureHeading: "", procedureContent: "", candidates: [], benefitsHeading: "", benefitsIntro: "", benefits: [], concernsHeading: "", concernsContent: "", isVisible: true },
            idealCandidates: {
              sectionHeading: "Ideal Candidates",
              introText: "This treatment is highly effective and suitable for individuals experiencing initial to moderate stages of hair thinning. Here is a breakdown of who will benefit the most:",
              bottomConclusionText: "If you want a customized evaluation, our doctors are ready to help you analyze your hair health.",
              sectionImage: "https://res.cloudinary.com/dseixl6px/image/upload/v1777595561/dmc-trichology/f8w7h9n3lqj306r8rxtk.png",
              altText: "Ideal candidates breakdown",
              bullets: [
                { bulletText: "Individuals experiencing male or female pattern baldness", sortOrder: 1, isVisible: true },
                { bulletText: "People who have stable and healthy donor areas on their scalp", sortOrder: 2, isVisible: true },
                { bulletText: "Those looking for permanent, natural-looking high density restoration", sortOrder: 3, isVisible: true }
              ]
            }
          }));
        } else {
          toast.error("Failed to load service details");
        }
      })
      .finally(() => setFetchingDetails(false));
  }, [selectedSlug, services]);

  const updateSectionField = (section, field, val) => {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: val }
    }));
  };

  const renderSectionVisibilityToggle = (section, label = "Visible") => (
    <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
      <input
        type="checkbox"
        checked={data?.[section]?.isVisible !== false}
        onChange={e => updateSectionField(section, "isVisible", e.target.checked)}
        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
      />
      <span className="text-xs font-black uppercase tracking-widest text-slate-600">{label}</span>
    </label>
  );

  const updateFueCostPoint = (idx, field, val) => {
    setData(prev => {
      const points = [...(prev.fueCostSection?.points || [])];
      points[idx] = { ...points[idx], [field]: val };
      return { ...prev, fueCostSection: { ...prev.fueCostSection, points } };
    });
  };

  const addFueCostPoint = () => {
    setData(prev => ({
      ...prev,
      fueCostSection: {
        ...prev.fueCostSection,
        points: [
          ...(prev.fueCostSection?.points || []),
          { pointText: "", sortOrder: (prev.fueCostSection?.points?.length || 0) + 1, isVisible: true }
        ]
      }
    }));
  };

  const removeFueCostPoint = (idx) => {
    setData(prev => ({
      ...prev,
      fueCostSection: {
        ...prev.fueCostSection,
        points: (prev.fueCostSection?.points || []).filter((_, i) => i !== idx)
      }
    }));
  };

  const updateFueCostRow = (idx, field, val) => {
    setData(prev => {
      const tableRows = [...(prev.fueCostSection?.tableRows || [])];
      tableRows[idx] = { ...tableRows[idx], [field]: val };
      return { ...prev, fueCostSection: { ...prev.fueCostSection, tableRows } };
    });
  };

  const addFueCostRow = () => {
    setData(prev => ({
      ...prev,
      fueCostSection: {
        ...prev.fueCostSection,
        tableRows: [
          ...(prev.fueCostSection?.tableRows || []),
          { grafts: "", cost: "", sortOrder: (prev.fueCostSection?.tableRows?.length || 0) + 1, isVisible: true }
        ]
      }
    }));
  };

  const removeFueCostRow = (idx) => {
    setData(prev => ({
      ...prev,
      fueCostSection: {
        ...prev.fueCostSection,
        tableRows: (prev.fueCostSection?.tableRows || []).filter((_, i) => i !== idx)
      }
    }));
  };

  const updateFueOptingBenefit = (idx, field, val) => {
    setData(prev => {
      const benefits = [...(prev.fueOptingBenefitsSection?.benefits || [])];
      benefits[idx] = { ...benefits[idx], [field]: val };
      return { ...prev, fueOptingBenefitsSection: { ...prev.fueOptingBenefitsSection, benefits } };
    });
  };

  const addFueOptingBenefit = () => {
    setData(prev => ({
      ...prev,
      fueOptingBenefitsSection: {
        ...prev.fueOptingBenefitsSection,
        benefits: [
          ...(prev.fueOptingBenefitsSection?.benefits || []),
          { title: "", description: "", sortOrder: (prev.fueOptingBenefitsSection?.benefits?.length || 0) + 1, isVisible: true }
        ]
      }
    }));
  };

  const removeFueOptingBenefit = (idx) => {
    setData(prev => ({
      ...prev,
      fueOptingBenefitsSection: {
        ...prev.fueOptingBenefitsSection,
        benefits: (prev.fueOptingBenefitsSection?.benefits || []).filter((_, i) => i !== idx)
      }
    }));
  };

  const addResultCard = () => {
    setData(prev => ({
      ...prev,
      resultsSection: {
        ...prev.resultsSection,
        cards: [
          ...(prev.resultsSection?.cards || []),
          { title: "", beforeImg: "", afterImg: "", sessions: "" }
        ]
      }
    }));
  };

  const updateResultCard = (idx, field, val) => {
    setData(prev => {
      const cards = [...(prev.resultsSection?.cards || [])];
      cards[idx] = { ...cards[idx], [field]: val };
      return {
        ...prev,
        resultsSection: {
          ...prev.resultsSection,
          cards
        }
      };
    });
  };

  const removeResultCard = (idx) => {
    setData(prev => ({
      ...prev,
      resultsSection: {
        ...prev.resultsSection,
        cards: (prev.resultsSection?.cards || []).filter((_, i) => i !== idx)
      }
    }));
  };

  const addVideoItem = () => {
    setData(prev => ({
      ...prev,
      videosSection: {
        ...prev.videosSection,
        videos: [
          ...(prev.videosSection?.videos || []),
          { thumbnail: "", videoUrl: "", title: "" }
        ]
      }
    }));
  };

  const updateVideoItem = (idx, field, val) => {
    setData(prev => {
      const vids = [...(prev.videosSection?.videos || [])];
      vids[idx] = { ...vids[idx], [field]: val };
      return {
        ...prev,
        videosSection: {
          ...prev.videosSection,
          videos: vids
        }
      };
    });
  };

  const removeVideoItem = (idx) => {
    setData(prev => ({
      ...prev,
      videosSection: {
        ...prev.videosSection,
        videos: (prev.videosSection?.videos || []).filter((_, i) => i !== idx)
      }
    }));
  };

  const addHairTransplantInfoCard = () => {
    setData(prev => ({
      ...prev,
      hairTransplantInfoSection: {
        ...(prev.hairTransplantInfoSection || { isVisible: true }),
        cards: [
          ...(prev.hairTransplantInfoSection?.cards || []),
          { title: "", content: "", sortOrder: (prev.hairTransplantInfoSection?.cards?.length || 0) + 1, isVisible: true }
        ]
      }
    }));
  };

  const updateHairTransplantInfoCard = (idx, field, val) => {
    setData(prev => {
      const cards = [...(prev.hairTransplantInfoSection?.cards || [])];
      cards[idx] = { ...cards[idx], [field]: val };
      return {
        ...prev,
        hairTransplantInfoSection: {
          ...(prev.hairTransplantInfoSection || { isVisible: true }),
          cards
        }
      };
    });
  };

  const removeHairTransplantInfoCard = (idx) => {
    setData(prev => ({
      ...prev,
      hairTransplantInfoSection: {
        ...(prev.hairTransplantInfoSection || { isVisible: true }),
        cards: (prev.hairTransplantInfoSection?.cards || []).filter((_, i) => i !== idx)
      }
    }));
  };

  const reorderHairTransplantInfoCard = (idx, direction) => {
    setData(prev => ({
      ...prev,
      hairTransplantInfoSection: {
        ...(prev.hairTransplantInfoSection || { isVisible: true }),
        cards: moveArrayItem(prev.hairTransplantInfoSection?.cards || [], idx, direction)
      }
    }));
  };

  const addHairTransplantWhyPoint = () => {
    setData(prev => ({
      ...prev,
      hairTransplantWhyChooseSection: {
        ...(prev.hairTransplantWhyChooseSection || {}),
        points: [...(prev.hairTransplantWhyChooseSection?.points || []), ""]
      }
    }));
  };

  const updateHairTransplantWhyPoint = (idx, val) => {
    setData(prev => {
      const points = [...(prev.hairTransplantWhyChooseSection?.points || [])];
      points[idx] = val;
      return {
        ...prev,
        hairTransplantWhyChooseSection: {
          ...(prev.hairTransplantWhyChooseSection || {}),
          points
        }
      };
    });
  };

  const removeHairTransplantWhyPoint = (idx) => {
    setData(prev => ({
      ...prev,
      hairTransplantWhyChooseSection: {
        ...(prev.hairTransplantWhyChooseSection || {}),
        points: (prev.hairTransplantWhyChooseSection?.points || []).filter((_, i) => i !== idx)
      }
    }));
  };

  const reorderHairTransplantWhyPoint = (idx, direction) => {
    setData(prev => ({
      ...prev,
      hairTransplantWhyChooseSection: {
        ...(prev.hairTransplantWhyChooseSection || {}),
        points: moveArrayItem(prev.hairTransplantWhyChooseSection?.points || [], idx, direction)
      }
    }));
  };

  const addArrayItem = (section, arrayField, defaultItem) => {
    const arr = [...(data[section][arrayField] || [])];
    arr.push(defaultItem);
    updateSectionField(section, arrayField, arr);
  };
  
  const updateArrayItem = (section, arrayField, idx, field, val) => {
    const arr = [...(data[section][arrayField] || [])];
    if (typeof arr[idx] === 'object') {
      arr[idx] = { ...arr[idx], [field]: val };
    } else {
      arr[idx] = val;
    }
    updateSectionField(section, arrayField, arr);
  };

  const removeArrayItem = (section, arrayField, idx) => {
    const arr = (data[section][arrayField] || []).filter((_, i) => i !== idx);
    updateSectionField(section, arrayField, arr);
  };

  const reorderArrayItem = (section, arrayField, idx, direction) => {
    const newArr = moveArrayItem(data[section][arrayField] || [], idx, direction);
    updateSectionField(section, arrayField, newArr);
  };

  const reorderOrderedArrayItem = (section, arrayField, idx, direction) => {
    const newArr = moveArrayItem(data[section][arrayField] || [], idx, direction)
      .map((item, index) => (typeof item === "object" ? { ...item, sortOrder: index + 1 } : item));
    updateSectionField(section, arrayField, newArr);
  };

  const addContentBlock = () => {
    setData(prev => ({
      ...prev,
      contentBlocks: [
        ...(prev.contentBlocks || []),
        { heading: "NEW CONTENT BLOCK", description: "", sortOrder: (prev.contentBlocks?.length || 0) + 1, isVisible: true }
      ]
    }));
  };

  const updateContentBlock = (idx, field, val) => {
    setData(prev => {
      const arr = [...(prev.contentBlocks || [])];
      arr[idx] = { ...arr[idx], [field]: val };
      return { ...prev, contentBlocks: arr };
    });
  };

  const removeContentBlock = (idx) => {
    setData(prev => ({
      ...prev,
      contentBlocks: (prev.contentBlocks || []).filter((_, i) => i !== idx)
    }));
  };

  const reorderContentBlock = (idx, direction) => {
    setData(prev => {
      const newArr = moveArrayItem(prev.contentBlocks || [], idx, direction);
      return { ...prev, contentBlocks: newArr };
    });
  };

  const addBenefitPoint = () => {
    setData(prev => ({
      ...prev,
      benefitsSection: {
        ...prev.benefitsSection,
        points: [
          ...(prev.benefitsSection?.points || []),
          { benefitText: "", sortOrder: (prev.benefitsSection?.points?.length || 0) + 1, isVisible: true }
        ]
      }
    }));
  };

  const updateBenefitPoint = (idx, field, val) => {
    setData(prev => {
      const pts = [...(prev.benefitsSection?.points || [])];
      pts[idx] = { ...pts[idx], [field]: val };
      return {
        ...prev,
        benefitsSection: {
          ...prev.benefitsSection,
          points: pts
        }
      };
    });
  };

  const removeBenefitPoint = (idx) => {
    setData(prev => ({
      ...prev,
      benefitsSection: {
        ...prev.benefitsSection,
        points: (prev.benefitsSection?.points || []).filter((_, i) => i !== idx)
      }
    }));
  };

  const reorderBenefitPoint = (idx, direction) => {
    setData(prev => {
      const newPts = moveArrayItem(prev.benefitsSection?.points || [], idx, direction);
      return {
        ...prev,
        benefitsSection: {
          ...prev.benefitsSection,
          points: newPts
        }
      };
    });
  };

  const addCandidateBullet = () => {
    setData(prev => ({
      ...prev,
      idealCandidates: {
        ...prev.idealCandidates,
        bullets: [
          ...(prev.idealCandidates?.bullets || []),
          { bulletText: "", sortOrder: (prev.idealCandidates?.bullets?.length || 0) + 1, isVisible: true }
        ]
      }
    }));
  };

  const updateCandidateBullet = (idx, field, val) => {
    setData(prev => {
      const bts = [...(prev.idealCandidates?.bullets || [])];
      bts[idx] = { ...bts[idx], [field]: val };
      return {
        ...prev,
        idealCandidates: {
          ...prev.idealCandidates,
          bullets: bts
        }
      };
    });
  };

  const removeCandidateBullet = (idx) => {
    setData(prev => ({
      ...prev,
      idealCandidates: {
        ...prev.idealCandidates,
        bullets: (prev.idealCandidates?.bullets || []).filter((_, i) => i !== idx)
      }
    }));
  };

  const reorderCandidateBullet = (idx, direction) => {
    setData(prev => {
      const newBts = moveArrayItem(prev.idealCandidates?.bullets || [], idx, direction);
      return {
        ...prev,
        idealCandidates: {
          ...prev.idealCandidates,
          bullets: newBts
        }
      };
    });
  };

  const addNotCandidateBullet = () => {
    setData(prev => ({
      ...prev,
      notCandidatesSection: {
        ...prev.notCandidatesSection,
        bullets: [
          ...(prev.notCandidatesSection?.bullets || []),
          { bulletText: "", sortOrder: (prev.notCandidatesSection?.bullets?.length || 0) + 1, isVisible: true }
        ]
      }
    }));
  };

  const updateNotCandidateBullet = (idx, field, val) => {
    setData(prev => {
      const bts = [...(prev.notCandidatesSection?.bullets || [])];
      bts[idx] = { ...bts[idx], [field]: val };
      return {
        ...prev,
        notCandidatesSection: {
          ...prev.notCandidatesSection,
          bullets: bts
        }
      };
    });
  };

  const removeNotCandidateBullet = (idx) => {
    setData(prev => ({
      ...prev,
      notCandidatesSection: {
        ...prev.notCandidatesSection,
        bullets: (prev.notCandidatesSection?.bullets || []).filter((_, i) => i !== idx)
      }
    }));
  };

  const reorderNotCandidateBullet = (idx, direction) => {
    setData(prev => {
      const newBts = moveArrayItem(prev.notCandidatesSection?.bullets || [], idx, direction);
      return {
        ...prev,
        notCandidatesSection: {
          ...prev.notCandidatesSection,
          bullets: newBts
        }
      };
    });
  };

  const addTechniqueItem = () => {
    setData(prev => ({
      ...prev,
      techniquesSection: {
        ...prev.techniquesSection,
        techniques: [
          ...(prev.techniquesSection?.techniques || []),
          { title: "", description: "", sortOrder: (prev.techniquesSection?.techniques?.length || 0) + 1, isVisible: true }
        ]
      }
    }));
  };

  const updateTechniqueItem = (idx, field, val) => {
    setData(prev => {
      const techs = [...(prev.techniquesSection?.techniques || [])];
      techs[idx] = { ...techs[idx], [field]: val };
      return {
        ...prev,
        techniquesSection: {
          ...prev.techniquesSection,
          techniques: techs
        }
      };
    });
  };

  const removeTechniqueItem = (idx) => {
    setData(prev => ({
      ...prev,
      techniquesSection: {
        ...prev.techniquesSection,
        techniques: (prev.techniquesSection?.techniques || []).filter((_, i) => i !== idx)
      }
    }));
  };

  const reorderTechniqueItem = (idx, direction) => {
    setData(prev => {
      const newTechs = moveArrayItem(prev.techniquesSection?.techniques || [], idx, direction);
      return {
        ...prev,
        techniquesSection: {
          ...prev.techniquesSection,
          techniques: newTechs
        }
      };
    });
  };

  const addInfoBlockItem = () => {
    setData(prev => ({
      ...prev,
      infoBlocksSection: {
        ...prev.infoBlocksSection,
        blocks: [
          ...(prev.infoBlocksSection?.blocks || []),
          { heading: "", description: "", backgroundVariant: "white", sortOrder: (prev.infoBlocksSection?.blocks?.length || 0) + 1, isVisible: true }
        ]
      }
    }));
  };

  const updateInfoBlockItem = (idx, field, val) => {
    setData(prev => {
      const blks = [...(prev.infoBlocksSection?.blocks || [])];
      blks[idx] = { ...blks[idx], [field]: val };
      return {
        ...prev,
        infoBlocksSection: {
          ...prev.infoBlocksSection,
          blocks: blks
        }
      };
    });
  };

  const removeInfoBlockItem = (idx) => {
    setData(prev => ({
      ...prev,
      infoBlocksSection: {
        ...prev.infoBlocksSection,
        blocks: (prev.infoBlocksSection?.blocks || []).filter((_, i) => i !== idx)
      }
    }));
  };

  const reorderInfoBlockItem = (idx, direction) => {
    setData(prev => {
      const newBlks = moveArrayItem(prev.infoBlocksSection?.blocks || [], idx, direction);
      return {
        ...prev,
        infoBlocksSection: {
          ...prev.infoBlocksSection,
          blocks: newBlks
        }
      };
    });
  };

  const addAftercareBullet = () => {
    setData(prev => ({
      ...prev,
      aftercareSection: {
        ...prev.aftercareSection,
        bullets: [
          ...(prev.aftercareSection?.bullets || []),
          { bulletText: "", sortOrder: (prev.aftercareSection?.bullets?.length || 0) + 1, isVisible: true }
        ]
      }
    }));
  };

  const updateAftercareBullet = (idx, field, val) => {
    setData(prev => {
      const bts = [...(prev.aftercareSection?.bullets || [])];
      bts[idx] = { ...bts[idx], [field]: val };
      return {
        ...prev,
        aftercareSection: {
          ...prev.aftercareSection,
          bullets: bts
        }
      };
    });
  };

  const removeAftercareBullet = (idx) => {
    setData(prev => ({
      ...prev,
      aftercareSection: {
        ...prev.aftercareSection,
        bullets: (prev.aftercareSection?.bullets || []).filter((_, i) => i !== idx)
      }
    }));
  };

  const reorderAftercareBullet = (idx, direction) => {
    setData(prev => {
      const newBts = moveArrayItem(prev.aftercareSection?.bullets || [], idx, direction);
      return {
        ...prev,
        aftercareSection: {
          ...prev.aftercareSection,
          bullets: newBts
        }
      };
    });
  };

  const addWhyChooseFeature = () => {
    setData(prev => ({
      ...prev,
      whyChooseUsSection: {
        ...prev.whyChooseUsSection,
        features: [
          ...(prev.whyChooseUsSection?.features || []),
          { featureText: "", sortOrder: (prev.whyChooseUsSection?.features?.length || 0) + 1, isVisible: true }
        ]
      }
    }));
  };

  const updateWhyChooseFeature = (idx, field, val) => {
    setData(prev => {
      const fts = [...(prev.whyChooseUsSection?.features || [])];
      fts[idx] = { ...fts[idx], [field]: val };
      return {
        ...prev,
        whyChooseUsSection: {
          ...prev.whyChooseUsSection,
          features: fts
        }
      };
    });
  };

  const removeWhyChooseFeature = (idx) => {
    setData(prev => ({
      ...prev,
      whyChooseUsSection: {
        ...prev.whyChooseUsSection,
        features: (prev.whyChooseUsSection?.features || []).filter((_, i) => i !== idx)
      }
    }));
  };

  const reorderWhyChooseFeature = (idx, direction) => {
    setData(prev => {
      const newFts = moveArrayItem(prev.whyChooseUsSection?.features || [], idx, direction);
      return {
        ...prev,
        whyChooseUsSection: {
          ...prev.whyChooseUsSection,
          features: newFts
        }
      };
    });
  };

  const addEditorialFaqItem = () => {
    setData(prev => ({
      ...prev,
      editorialFaqSection: {
        ...prev.editorialFaqSection,
        faqs: [
          ...(prev.editorialFaqSection?.faqs || []),
          { question: "", answer: "", sortOrder: (prev.editorialFaqSection?.faqs?.length || 0) + 1, isVisible: true }
        ]
      }
    }));
  };

  const updateEditorialFaqItem = (idx, field, val) => {
    setData(prev => {
      const newFqs = [...(prev.editorialFaqSection?.faqs || [])];
      newFqs[idx] = { ...newFqs[idx], [field]: val };
      return {
        ...prev,
        editorialFaqSection: {
          ...prev.editorialFaqSection,
          faqs: newFqs
        }
      };
    });
  };

  const removeEditorialFaqItem = (idx) => {
    setData(prev => ({
      ...prev,
      editorialFaqSection: {
        ...prev.editorialFaqSection,
        faqs: (prev.editorialFaqSection?.faqs || []).filter((_, i) => i !== idx)
      }
    }));
  };

  const reorderEditorialFaqItem = (idx, direction) => {
    setData(prev => {
      const newFqs = moveArrayItem(prev.editorialFaqSection?.faqs || [], idx, direction);
      return {
        ...prev,
        editorialFaqSection: {
          ...prev.editorialFaqSection,
          faqs: newFqs
        }
      };
    });
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await axios.put(`/service-details/${selectedSlug}`, { ...data, sectionsLayout });
      toast.success("Service details saved successfully");
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || err.message || "Save failed";
      toast.error(message);
      console.error("Service details save failed:", err.response?.data || err);
    } finally {
      setSaving(false);
    }
  };

  const handleApplyTemplate = () => {
    if (!activeTemplate) return;

    const serviceInfo = services.find(s => s.slug === selectedSlug) || {};
    setData(prev => applyTemplateToData(prev, activeTemplate, selectedSlug, serviceInfo));
    toast.success("Best Hair Transplant template applied locally");
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!newService.title.trim()) return toast.error("Title is required");
    setCreating(true);
    try {
      const slug = (newService.slug || newService.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const res = await axios.post('/service-listing-cards', {
        title: newService.title,
        slug,
        category: newService.category || '',
        image: newService.image || '',
        short_description: newService.shortDescription || '',
        status: "Published",
      });
      if (res.data?.success) {
        toast.success("Service created!");
        await fetchServices();
        setIsCreateModalOpen(false);
        setNewService({ title: "", category: "" });
        selectServiceForEditing(slug);
      }
    } catch (err) {
      toast.error("Failed to create service");
    } finally {
      setCreating(false);
    }
  };

  const handleSaveCard = async () => {
    if (!cardInfo.id) return toast.error("No card selected");
    setSavingCard(true);
    try {
      await axios.put(`/service-listing-cards/${cardInfo.id}`, cardInfo);
      toast.success("Service card saved");
      await fetchServices();
    } catch {
      toast.error("Failed to save service card");
    } finally {
      setSavingCard(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;

  const selectedServiceInfo = services.find(s => s.slug === selectedSlug) || {};
  const isHairCostEditor = isHairCostDelhiSlug(selectedSlug);

  return (
    <div className="service-detail-direct-editor p-4 lg:p-5 max-w-[1540px] mx-auto bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-5 bg-white border border-slate-200 rounded-[24px] px-5 py-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Service CMS</h1>
          <p className="text-sm text-slate-500 font-medium italic">Manage individual service page content</p>
          {selectedServiceInfo?.title && (
            <p className="mt-2 text-xs font-black uppercase tracking-widest text-blue-600">
              Editing Page: {selectedServiceInfo.title}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
           {activeTemplate && (
             <button onClick={handleApplyTemplate} disabled={fetchingDetails || !data} className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-100 transition-all disabled:opacity-50">
               <Star size={16} /> Apply Template
             </button>
           )}
           <button onClick={() => navigate(`/cms/visual-builder/details?service=${selectedSlug}`)} disabled={fetchingDetails || !data} className="flex items-center gap-2 bg-indigo-50 text-indigo-600 border border-indigo-200 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all">
             <Layout size={16} /> Visual Builder
           </button>
           {selectedSlug && (
             <a
               href={`${import.meta.env.VITE_FRONTEND_URL || 'http://localhost:3000'}/details/${selectedSlug}`}
               target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all"
             >
               <ExternalLink size={16} /> Preview
             </a>
           )}
           <button onClick={handleSave} disabled={saving || fetchingDetails || !data}
             className="flex items-center gap-2 bg-slate-900 text-white px-7 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-200">
             {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
             {saving ? "Saving..." : "Publish Updates"}
           </button>
        </div>
      </div>

      {/* Service Selector */}
      <div className="hidden">
        <label className="text-[12px] font-black uppercase text-slate-500 tracking-widest min-w-max">Select Service to Edit:</label>
        <div className="flex-1 w-full">
          <ServiceSearchSelector 
            services={services} 
            selectedSlug={selectedSlug} 
            onChange={selectServiceForEditing} 
          />
        </div>
      </div>

      {/* ── Layout Manager ── */}
      {data && !fetchingDetails && (
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-6 mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Page Layout — Toggle Sections</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {ALL_SECTIONS.map(sec => {
              const enabled = sectionsLayout[sec.id] !== false;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSectionsLayout(prev => ({ ...prev, [sec.id]: !enabled }))}
                  className={`text-xs px-3 py-2 rounded-xl font-bold border transition-all text-left ${enabled ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-400 line-through'}`}
                >
                  {enabled ? '✓' : '✗'} {sec.label}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-400 mt-3">Click to toggle. Save with "Publish Updates" to apply on website.</p>
        </div>
      )}

      {!data || fetchingDetails ? (
         <div className="py-20 text-center text-slate-400 font-medium flex flex-col items-center">
            <RefreshCw className="animate-spin mb-4 text-blue-600" size={32} />
            Loading structure...
         </div>
      ) : (
        <>
          <div className="hidden">
            {[
              { id: "banner", label: "Hero & Intro", icon: Layout },
              { id: "section1", label: "Section 1", icon: Film },
              { id: "section2", label: "Section 2", icon: CheckCircle },
              { id: "section3", label: "Section 3", icon: Star },
              { id: "section4", label: "Section 4", icon: List },
              { id: "section5", label: "Section 5", icon: ImageIcon },
              { id: "section6", label: "Section 6", icon: RefreshCw },
              { id: "section7", label: "Section 7", icon: CheckCircle },
              { id: "section8", label: "Section 8", icon: HelpCircle },
              { id: "section9", label: "Section 9", icon: List },
              { id: "contentBlocks", label: "Content Blocks", icon: Type },
              { id: "benefitsSection", label: "Benefits Section", icon: CheckCircle },
              { id: "fueProcedureSection", label: "FUE Procedure", icon: ImageIcon },
              { id: "fueCostSection", label: "FUE Cost", icon: CheckCircle },
              { id: "fueOptingBenefitsSection", label: "FUE Benefits", icon: CheckCircle },
              { id: "bodyHairIntroSection", label: "BHT Intro", icon: Type },
              { id: "bodyHairSuitableSection", label: "BHT Suitable", icon: CheckCircle },
              { id: "idealCandidates", label: "Ideal Candidates", icon: Star },
              { id: "notCandidates", label: "Not Candidates", icon: HelpCircle },
              { id: "techniques", label: "Techniques", icon: List },
              { id: "infoBlocks", label: "Info Blocks", icon: Type },
              { id: "aftercare", label: "Aftercare", icon: CheckCircle },
              { id: "whyChooseUs", label: "Why Choose Us", icon: Star },
              { id: "editorialFaq", label: "Editorial FAQ", icon: HelpCircle },
              { id: "googleReviewCta", label: "Google Review CTA", icon: Star },
              { id: "resultsSection", label: "Before & After Results", icon: RefreshCw },
              { id: "videosSection", label: "Videos Section", icon: Video },
              { id: "enquirySection", label: "Enquiry Form", icon: Layout },
              { id: "process", label: "Process Steps", icon: List },
              { id: "idealFrequency", label: "Suitability & CTA", icon: CheckCircle },
              { id: "beforeAfter", label: "Before/After", icon: RefreshCw },
              { id: "faqEnquiry", label: "FAQs & Options", icon: HelpCircle },
              { id: "hairTransplantInfo", label: "Transplant Info", icon: Type },
              { id: "hairTransplantWhy", label: "Transplant Why", icon: Star },
              { id: "footerCta", label: "Footer CTA", icon: Layout },
              { id: "seo", label: "SEO Settings", icon: Globe }
            ].filter(tab => !isHairCostEditor || ![
              "idealCandidates",
              "notCandidates",
              "whyChooseUs",
              "hairTransplantInfo",
              "hairTransplantWhy",
              "process",
              "aftercare",
              "techniques",
              "infoBlocks"
            ].includes(tab.id)).map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'}`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="service-editor-sections">
            {/* ── Service Card Info Panel ── */}
            {selectedSlug && cardInfo.id && (
              <div className="bg-white rounded-[32px] border-2 border-blue-100 shadow-sm p-8 mb-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <ImageIcon size={18} className="text-blue-500" /> Service Card Info
                  </h3>
                  <button
                    onClick={handleSaveCard}
                    disabled={savingCard}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-200"
                  >
                    {savingCard ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {savingCard ? "Saving..." : "Save Card"}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Title</label>
                    <input
                      type="text"
                      value={cardInfo.title || ''}
                      onChange={e => setCardInfo(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Slug</label>
                    <input
                      type="text"
                      value={cardInfo.slug || ''}
                      onChange={e => setCardInfo(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Category</label>
                    <select
                      value={cardInfo.category || ''}
                      onChange={e => setCardInfo(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">— Select category —</option>
                      {categories.map(c => (
                        <option key={c.id || c._id} value={c.slug}>{c.categoryName || c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Image URL</label>
                    <input
                      type="text"
                      value={cardInfo.image || ''}
                      onChange={e => setCardInfo(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="/images/services/my-service.webp"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Duration</label>
                    <input
                      type="text"
                      value={cardInfo.duration || ''}
                      onChange={e => setCardInfo(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="45 mins"
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Short Description</label>
                    <textarea
                      value={cardInfo.shortDescription || ''}
                      onChange={e => setCardInfo(prev => ({ ...prev, shortDescription: e.target.value }))}
                      rows={2}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Button Text</label>
                    <input
                      type="text"
                      value={cardInfo.buttonText || ''}
                      onChange={e => setCardInfo(prev => ({ ...prev, buttonText: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Button Link</label>
                    <input
                      type="text"
                      value={cardInfo.buttonLink || ''}
                      onChange={e => setCardInfo(prev => ({ ...prev, buttonLink: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-6 items-center pt-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!cardInfo.featured}
                        onChange={e => setCardInfo(prev => ({ ...prev, featured: e.target.checked }))}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-xs font-black uppercase tracking-widest text-slate-600">Featured (home slider)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={cardInfo.status === 'Published' || cardInfo.status === 'active'}
                        onChange={e => setCardInfo(prev => ({ ...prev, status: e.target.checked ? 'Published' : 'Draft' }))}
                        className="w-4 h-4 accent-emerald-600"
                      />
                      <span className="text-xs font-black uppercase tracking-widest text-slate-600">Published</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {(true || activeTab === 'banner') && (
              <>
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2"><Layout size={18} className="text-blue-500"/> Hero Banner Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Badge Text</label>
                    <input type="text" value={data.banner.badgeText || ""} onChange={e => updateSectionField("banner", "badgeText", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Banner Title</label>
                    <input type="text" value={data.banner.title || ""} onChange={e => updateSectionField("banner", "title", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10 mt-8">
                <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2"><Type size={18} className="text-blue-500"/> Service Intro Description</h3>
                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Long Description</label>
                    <textarea value={data.intro.longDescription || ""} onChange={e => updateSectionField("intro", "longDescription", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold min-h-[120px]" />
                  </div>

                  {/* RESTORED GRID FOR BENEFITS AND MEDIA */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 pt-8 mt-4">
                    {/* LEFT: Benefits */}
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <label className="block text-[12px] font-black uppercase text-slate-900 tracking-widest">Benefits Bullet Points</label>
                        <button onClick={() => addArrayItem("intro", "benefits", { text: "" })} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Plus size={14}/></button>
                      </div>
                      <div className="space-y-3">
                        {(data.intro.benefits || []).map((b, i) => (
                           <div key={i} className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                              <input type="text" value={b.text || ""} onChange={e => updateArrayItem("intro", "benefits", i, "text", e.target.value)} className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm" placeholder="Benefit Point..." />
                              <button onClick={() => removeArrayItem("intro", "benefits", i)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                           </div>
                        ))}
                      </div>
                    </div>

                     <div>
                       <div className="flex justify-between items-center mb-6">
                         <div>
                           <label className="block text-[12px] font-black uppercase text-slate-900 tracking-widest">Intro Media</label>
                           <p className="text-[10px] text-slate-400 mt-1">Images & videos for the gallery slider</p>
                         </div>
                         <button 
                           onClick={() => addArrayItem("intro", "introMedia", { type: "image", url: "", title: "", alt: "", thumbnail: "" })} 
                           className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
                         >
                           <Plus size={13}/> Add Slide
                         </button>
                       </div>
                       <div className="space-y-4">
                         {(data.intro.introMedia || []).map((item, i) => (
                           <MediaItemEditor
                             key={i}
                             item={item}
                             index={i}
                             onUpdate={(field, val) => updateArrayItem("intro", "introMedia", i, field, val)}
                             onRemove={() => removeArrayItem("intro", "introMedia", i)}
                              onPickFromLibrary={(field) => handleOpenGalleryPicker(i, field)}
                           />
                         ))}
                         {(data.intro.introMedia || []).length === 0 && (
                           <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                             <ImageIcon size={28} className="text-slate-300 mx-auto mb-3" />
                             <p className="text-xs text-slate-400 font-semibold">No media slides yet</p>
                             <p className="text-[10px] text-slate-300 mt-1">Click "Add Slide" to start building your gallery</p>
                           </div>
                         )}
                       </div>
                     </div>
                  </div>
                </div>
              </div>
              </>
            )}

            {(true || activeTab === 'section1') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Film size={18} className="text-blue-500"/> Section 1</h3>
                    <p className="text-xs text-slate-400 mt-1">Left media slider with right-side label, title, and rich text content.</p>
                  </div>
                  {renderSectionVisibilityToggle("section1")}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Sort Order</label>
                        <input type="number" value={data.section1?.sortOrder ?? 10} onChange={e => updateSectionField("section1", "sortOrder", parseInt(e.target.value, 10) || 0)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Small Label</label>
                        <input type="text" value={data.section1?.label || ""} onChange={e => updateSectionField("section1", "label", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="Hair Health" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Heading</label>
                        <input type="text" value={data.section1?.title || ""} onChange={e => updateSectionField("section1", "title", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="Section heading" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Rich Text Content</label>
                      <textarea value={data.section1?.description || ""} onChange={e => updateSectionField("section1", "description", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium min-h-[180px]" placeholder="Use blank lines to separate paragraphs." />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Media Slider</h4>
                        <p className="text-[10px] text-slate-400 mt-1">Supports images and videos.</p>
                      </div>
                      <button onClick={() => addArrayItem("section1", "media", { type: "image", url: "", title: "", alt: "", thumbnail: "", sortOrder: (data.section1?.media?.length || 0) + 1, isVisible: true })} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                        <Plus size={13}/> Add Media
                      </button>
                    </div>
                    {(data.section1?.media || []).map((item, i) => (
                      <MediaItemEditor
                        key={i}
                        item={item}
                        index={i}
                        onUpdate={(field, val) => updateArrayItem("section1", "media", i, field, val)}
                        onRemove={() => removeArrayItem("section1", "media", i)}
                        onPickFromLibrary={(field) => handleOpenGalleryPicker(i, field, "section1", "media")}
                        onMoveUp={() => reorderOrderedArrayItem("section1", "media", i, "up")}
                        onMoveDown={() => reorderOrderedArrayItem("section1", "media", i, "down")}
                        canMoveUp={i > 0}
                        canMoveDown={i < (data.section1?.media?.length || 0) - 1}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(true || activeTab === 'section2') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><CheckCircle size={18} className="text-blue-500"/> Section 2</h3>
                    <p className="text-xs text-slate-400 mt-1">Left content with unlimited ordered points and right-side image.</p>
                  </div>
                  {renderSectionVisibilityToggle("section2")}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="space-y-6">
                    <MediaUploader label="Right Image" value={data.section2?.image || ""} onChange={val => updateSectionField("section2", "image", val)} />
                  </div>
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Sort Order</label>
                        <input type="number" value={data.section2?.sortOrder ?? 20} onChange={e => updateSectionField("section2", "sortOrder", parseInt(e.target.value, 10) || 0)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Badge</label>
                        <input type="text" value={data.section2?.badge || ""} onChange={e => updateSectionField("section2", "badge", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="Benefits Section" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Title</label>
                        <input type="text" value={data.section2?.title || ""} onChange={e => updateSectionField("section2", "title", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="What Sets It Apart" />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Points</h4>
                        <button onClick={() => addArrayItem("section2", "points", { text: "", sortOrder: (data.section2?.points?.length || 0) + 1, isVisible: true })} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                          <Plus size={13}/> Add Point
                        </button>
                      </div>
                      {(data.section2?.points || []).map((point, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                          <input value={point.text || ""} onChange={e => updateArrayItem("section2", "points", i, "text", e.target.value)} className="md:col-span-6 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold" placeholder="Point text" />
                          <input type="number" value={point.sortOrder ?? (i + 1)} onChange={e => updateArrayItem("section2", "points", i, "sortOrder", parseInt(e.target.value, 10) || 0)} className="md:col-span-2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center" />
                          <label className="md:col-span-2 flex items-center gap-1 text-[10px] font-black uppercase text-slate-500"><input type="checkbox" checked={point.isVisible !== false} onChange={e => updateArrayItem("section2", "points", i, "isVisible", e.target.checked)} /> Visible</label>
                          <div className="md:col-span-2 flex justify-end gap-1">
                            <button onClick={() => reorderOrderedArrayItem("section2", "points", i, "up")} disabled={i === 0} className="p-1 bg-slate-50 text-slate-500 rounded disabled:opacity-30"><ArrowUp size={12}/></button>
                            <button onClick={() => reorderOrderedArrayItem("section2", "points", i, "down")} disabled={i === (data.section2?.points?.length || 0) - 1} className="p-1 bg-slate-50 text-slate-500 rounded disabled:opacity-30"><ArrowDown size={12}/></button>
                            <button onClick={() => removeArrayItem("section2", "points", i)} className="p-1 bg-red-50 text-red-500 rounded"><Trash2 size={12}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(true || activeTab === 'section3') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Star size={18} className="text-blue-500"/> Section 3</h3>
                    <p className="text-xs text-slate-400 mt-1">Two-column candidates panel with consultation CTA.</p>
                  </div>
                  {renderSectionVisibilityToggle("section3")}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="space-y-6">
                    <MediaUploader label="CTA Illustration/Image" value={data.section3?.image || ""} onChange={val => updateSectionField("section3", "image", val)} />
                  </div>
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Sort Order</label>
                        <input type="number" value={data.section3?.sortOrder ?? 30} onChange={e => updateSectionField("section3", "sortOrder", parseInt(e.target.value, 10) || 0)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Title</label>
                        <input value={data.section3?.title || ""} onChange={e => updateSectionField("section3", "title", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="Who It's For" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Subtitle</label>
                        <input value={data.section3?.subtitle || ""} onChange={e => updateSectionField("section3", "subtitle", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="After 6-8 sessions..." />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input value={data.section3?.ctaTitle || ""} onChange={e => updateSectionField("section3", "ctaTitle", e.target.value)} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="CTA title" />
                      <input value={data.section3?.ctaDescription || ""} onChange={e => updateSectionField("section3", "ctaDescription", e.target.value)} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="CTA description" />
                      <input value={data.section3?.ctaButtonText || ""} onChange={e => updateSectionField("section3", "ctaButtonText", e.target.value)} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="Button text" />
                    </div>

                    <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Candidates</h4>
                        <button onClick={() => addArrayItem("section3", "candidates", { text: "", sortOrder: (data.section3?.candidates?.length || 0) + 1, isVisible: true })} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                          <Plus size={13}/> Add Candidate
                        </button>
                      </div>
                      {(data.section3?.candidates || []).map((candidate, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                          <input value={candidate.text || ""} onChange={e => updateArrayItem("section3", "candidates", i, "text", e.target.value)} className="md:col-span-6 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold" placeholder="Candidate text" />
                          <input type="number" value={candidate.sortOrder ?? (i + 1)} onChange={e => updateArrayItem("section3", "candidates", i, "sortOrder", parseInt(e.target.value, 10) || 0)} className="md:col-span-2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center" />
                          <label className="md:col-span-2 flex items-center gap-1 text-[10px] font-black uppercase text-slate-500"><input type="checkbox" checked={candidate.isVisible !== false} onChange={e => updateArrayItem("section3", "candidates", i, "isVisible", e.target.checked)} /> Visible</label>
                          <div className="md:col-span-2 flex justify-end gap-1">
                            <button onClick={() => reorderOrderedArrayItem("section3", "candidates", i, "up")} disabled={i === 0} className="p-1 bg-slate-50 text-slate-500 rounded disabled:opacity-30"><ArrowUp size={12}/></button>
                            <button onClick={() => reorderOrderedArrayItem("section3", "candidates", i, "down")} disabled={i === (data.section3?.candidates?.length || 0) - 1} className="p-1 bg-slate-50 text-slate-500 rounded disabled:opacity-30"><ArrowDown size={12}/></button>
                            <button onClick={() => removeArrayItem("section3", "candidates", i)} className="p-1 bg-red-50 text-red-500 rounded"><Trash2 size={12}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(true || activeTab === 'section4') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><List size={18} className="text-blue-500"/> Section 4</h3>
                    <p className="text-xs text-slate-400 mt-1">Horizontal process slider with image, step title, and description.</p>
                  </div>
                  {renderSectionVisibilityToggle("section4")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Sort Order</label>
                    <input type="number" value={data.section4?.sortOrder ?? 40} onChange={e => updateSectionField("section4", "sortOrder", parseInt(e.target.value, 10) || 0)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Title</label>
                    <input value={data.section4?.title || ""} onChange={e => updateSectionField("section4", "title", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="The Process" />
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Process Steps</h4>
                    <button onClick={() => addArrayItem("section4", "processSteps", { id: Date.now().toString(), title: "", description: "", image: "", sortOrder: (data.section4?.processSteps?.length || 0) + 1, isVisible: true })} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                      <Plus size={13}/> Add Step
                    </button>
                  </div>
                  {(data.section4?.processSteps || []).map((step, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step {i + 1}</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => reorderOrderedArrayItem("section4", "processSteps", i, "up")} disabled={i === 0} className="p-1 bg-slate-50 text-slate-500 rounded disabled:opacity-30"><ArrowUp size={12}/></button>
                          <button onClick={() => reorderOrderedArrayItem("section4", "processSteps", i, "down")} disabled={i === (data.section4?.processSteps?.length || 0) - 1} className="p-1 bg-slate-50 text-slate-500 rounded disabled:opacity-30"><ArrowDown size={12}/></button>
                          <button onClick={() => removeArrayItem("section4", "processSteps", i)} className="p-1 bg-red-50 text-red-500 rounded"><Trash2 size={12}/></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <MediaUploader label="Step Image" value={step.image || ""} onChange={val => updateArrayItem("section4", "processSteps", i, "image", val)} />
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input value={step.title || ""} onChange={e => updateArrayItem("section4", "processSteps", i, "title", e.target.value)} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="Step title" />
                          <input type="number" value={step.sortOrder ?? (i + 1)} onChange={e => updateArrayItem("section4", "processSteps", i, "sortOrder", parseInt(e.target.value, 10) || 0)} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500"><input type="checkbox" checked={step.isVisible !== false} onChange={e => updateArrayItem("section4", "processSteps", i, "isVisible", e.target.checked)} /> Visible</label>
                          <textarea value={step.description || ""} onChange={e => updateArrayItem("section4", "processSteps", i, "description", e.target.value)} className="md:col-span-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium min-h-[90px]" placeholder="Step description" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(true || activeTab === 'section5') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><ImageIcon size={18} className="text-blue-500"/> Section 5</h3>
                    <p className="text-xs text-slate-400 mt-1">Two-column large image with badge, heading, and rich text content.</p>
                  </div>
                  {renderSectionVisibilityToggle("section5")}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="space-y-6">
                    <MediaUploader label="Large Image" value={data.section5?.image || ""} onChange={val => updateSectionField("section5", "image", val)} />
                  </div>
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Sort Order</label>
                        <input type="number" value={data.section5?.sortOrder ?? 50} onChange={e => updateSectionField("section5", "sortOrder", parseInt(e.target.value, 10) || 0)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Badge</label>
                        <input value={data.section5?.badge || ""} onChange={e => updateSectionField("section5", "badge", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="Techniques" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Title</label>
                        <input value={data.section5?.title || ""} onChange={e => updateSectionField("section5", "title", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="The Detail That Actually Matters" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Rich Text Description</label>
                      <textarea value={data.section5?.description || ""} onChange={e => updateSectionField("section5", "description", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium min-h-[220px]" placeholder="Use blank lines to separate paragraphs." />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(true || activeTab === 'section6') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><RefreshCw size={18} className="text-blue-500"/> Section 6</h3>
                    <p className="text-xs text-slate-400 mt-1">Before and after results carousel with unlimited cards.</p>
                  </div>
                  {renderSectionVisibilityToggle("section6")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Sort Order</label>
                    <input type="number" value={data.section6?.sortOrder ?? 60} onChange={e => updateSectionField("section6", "sortOrder", parseInt(e.target.value, 10) || 0)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Title</label>
                    <input value={data.section6?.title || ""} onChange={e => updateSectionField("section6", "title", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="Before & After Results" />
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Results</h4>
                    <button onClick={() => addArrayItem("section6", "results", { id: Date.now().toString(), title: "", beforeImage: "", afterImage: "", description: "", sortOrder: (data.section6?.results?.length || 0) + 1, isVisible: true })} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                      <Plus size={13}/> Add Result
                    </button>
                  </div>
                  {(data.section6?.results || []).map((result, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Result {i + 1}</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => reorderOrderedArrayItem("section6", "results", i, "up")} disabled={i === 0} className="p-1 bg-slate-50 text-slate-500 rounded disabled:opacity-30"><ArrowUp size={12}/></button>
                          <button onClick={() => reorderOrderedArrayItem("section6", "results", i, "down")} disabled={i === (data.section6?.results?.length || 0) - 1} className="p-1 bg-slate-50 text-slate-500 rounded disabled:opacity-30"><ArrowDown size={12}/></button>
                          <button onClick={() => removeArrayItem("section6", "results", i)} className="p-1 bg-red-50 text-red-500 rounded"><Trash2 size={12}/></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <MediaUploader label="Before Image" value={result.beforeImage || ""} onChange={val => updateArrayItem("section6", "results", i, "beforeImage", val)} />
                        <MediaUploader label="After Image" value={result.afterImage || ""} onChange={val => updateArrayItem("section6", "results", i, "afterImage", val)} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input value={result.title || ""} onChange={e => updateArrayItem("section6", "results", i, "title", e.target.value)} className="md:col-span-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="Result title" />
                        <input type="number" value={result.sortOrder ?? (i + 1)} onChange={e => updateArrayItem("section6", "results", i, "sortOrder", parseInt(e.target.value, 10) || 0)} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500"><input type="checkbox" checked={result.isVisible !== false} onChange={e => updateArrayItem("section6", "results", i, "isVisible", e.target.checked)} /> Visible</label>
                        <input value={result.description || ""} onChange={e => updateArrayItem("section6", "results", i, "description", e.target.value)} className="md:col-span-4 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium" placeholder="After 6 sessions" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(true || activeTab === 'section7') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><CheckCircle size={18} className="text-blue-500"/> Section 7</h3>
                    <p className="text-xs text-slate-400 mt-1">Before Treatment and After Treatment bullet cards.</p>
                  </div>
                  {renderSectionVisibilityToggle("section7")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Sort Order</label>
                    <input type="number" value={data.section7?.sortOrder ?? 70} onChange={e => updateSectionField("section7", "sortOrder", parseInt(e.target.value, 10) || 0)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Before Heading</label>
                    <input value={data.section7?.beforeTitle || ""} onChange={e => updateSectionField("section7", "beforeTitle", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="Before Treatment" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">After Heading</label>
                    <input value={data.section7?.afterTitle || ""} onChange={e => updateSectionField("section7", "afterTitle", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="After Treatment" />
                  </div>
                </div>

                {[
                  { key: "beforePoints", label: "Before Treatment Bullets" },
                  { key: "afterPoints", label: "After Treatment Bullets" }
                ].map(group => (
                  <div key={group.key} className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">{group.label}</h4>
                      <button onClick={() => addArrayItem("section7", group.key, { text: "", sortOrder: (data.section7?.[group.key]?.length || 0) + 1, isVisible: true })} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                        <Plus size={13}/> Add Bullet
                      </button>
                    </div>
                    {(data.section7?.[group.key] || []).map((point, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                        <input value={point.text || ""} onChange={e => updateArrayItem("section7", group.key, i, "text", e.target.value)} className="md:col-span-6 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold" placeholder="Bullet text" />
                        <input type="number" value={point.sortOrder ?? (i + 1)} onChange={e => updateArrayItem("section7", group.key, i, "sortOrder", parseInt(e.target.value, 10) || 0)} className="md:col-span-2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center" />
                        <label className="md:col-span-2 flex items-center gap-1 text-[10px] font-black uppercase text-slate-500"><input type="checkbox" checked={point.isVisible !== false} onChange={e => updateArrayItem("section7", group.key, i, "isVisible", e.target.checked)} /> Visible</label>
                        <div className="md:col-span-2 flex justify-end gap-1">
                          <button onClick={() => reorderOrderedArrayItem("section7", group.key, i, "up")} disabled={i === 0} className="p-1 bg-slate-50 text-slate-500 rounded disabled:opacity-30"><ArrowUp size={12}/></button>
                          <button onClick={() => reorderOrderedArrayItem("section7", group.key, i, "down")} disabled={i === (data.section7?.[group.key]?.length || 0) - 1} className="p-1 bg-slate-50 text-slate-500 rounded disabled:opacity-30"><ArrowDown size={12}/></button>
                          <button onClick={() => removeArrayItem("section7", group.key, i)} className="p-1 bg-red-50 text-red-500 rounded"><Trash2 size={12}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {(true || activeTab === 'section8') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><HelpCircle size={18} className="text-blue-500"/> Section 8</h3>
                    <p className="text-xs text-slate-400 mt-1">Common concerns accordion and enquiry form.</p>
                  </div>
                  {renderSectionVisibilityToggle("section8")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Sort Order</label>
                    <input type="number" value={data.section8?.sortOrder ?? 80} onChange={e => updateSectionField("section8", "sortOrder", parseInt(e.target.value, 10) || 0)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Heading</label>
                    <input value={data.section8?.title || ""} onChange={e => updateSectionField("section8", "title", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="Few Of The Common Concerns" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Form Title</label>
                    <input value={data.section8?.formTitle || ""} onChange={e => updateSectionField("section8", "formTitle", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="Enquiry Here Below!" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Intro Text</label>
                    <textarea value={data.section8?.introText || ""} onChange={e => updateSectionField("section8", "introText", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium min-h-[90px]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Button Text</label>
                    <input value={data.section8?.buttonText || ""} onChange={e => updateSectionField("section8", "buttonText", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="Schedule Your Visit" />
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">FAQs</h4>
                    <button onClick={() => addArrayItem("section8", "faqs", { id: Date.now().toString(), question: "", answer: "", sortOrder: (data.section8?.faqs?.length || 0) + 1, isVisible: true })} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                      <Plus size={13}/> Add FAQ
                    </button>
                  </div>
                  {(data.section8?.faqs || []).map((faq, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">FAQ {i + 1}</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => reorderOrderedArrayItem("section8", "faqs", i, "up")} disabled={i === 0} className="p-1 bg-slate-50 text-slate-500 rounded disabled:opacity-30"><ArrowUp size={12}/></button>
                          <button onClick={() => reorderOrderedArrayItem("section8", "faqs", i, "down")} disabled={i === (data.section8?.faqs?.length || 0) - 1} className="p-1 bg-slate-50 text-slate-500 rounded disabled:opacity-30"><ArrowDown size={12}/></button>
                          <button onClick={() => removeArrayItem("section8", "faqs", i)} className="p-1 bg-red-50 text-red-500 rounded"><Trash2 size={12}/></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input value={faq.question || ""} onChange={e => updateArrayItem("section8", "faqs", i, "question", e.target.value)} className="md:col-span-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="Question" />
                        <input type="number" value={faq.sortOrder ?? (i + 1)} onChange={e => updateArrayItem("section8", "faqs", i, "sortOrder", parseInt(e.target.value, 10) || 0)} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500"><input type="checkbox" checked={faq.isVisible !== false} onChange={e => updateArrayItem("section8", "faqs", i, "isVisible", e.target.checked)} /> Visible</label>
                        <textarea value={faq.answer || ""} onChange={e => updateArrayItem("section8", "faqs", i, "answer", e.target.value)} className="md:col-span-4 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium min-h-[90px]" placeholder="Answer" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(true || activeTab === 'section9') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><List size={18} className="text-blue-500"/> Section 9</h3>
                    <p className="text-xs text-slate-400 mt-1">Cost by graft count pricing table.</p>
                  </div>
                  {renderSectionVisibilityToggle("section9")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Sort Order</label>
                    <input type="number" value={data.section9?.sortOrder ?? 90} onChange={e => updateSectionField("section9", "sortOrder", parseInt(e.target.value, 10) || 0)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Badge</label>
                    <input value={data.section9?.badge || ""} onChange={e => updateSectionField("section9", "badge", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="Pricing Guide" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Heading</label>
                    <input value={data.section9?.title || ""} onChange={e => updateSectionField("section9", "title", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" placeholder="Cost By Graft Count" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Pricing Note</label>
                    <textarea value={data.section9?.note || ""} onChange={e => updateSectionField("section9", "note", e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium min-h-[90px]" placeholder="Per graft cost ranges from ₹20 to ₹120 based on donor site health. Final pricing is confirmed at your consultation." />
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Pricing Rows</h4>
                    <button onClick={() => addArrayItem("section9", "rows", { id: Date.now().toString(), graftRange: "", cost: "", sortOrder: (data.section9?.rows?.length || 0) + 1, isVisible: true })} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                      <Plus size={13}/> Add Row
                    </button>
                  </div>
                  {(data.section9?.rows || []).map((row, i) => (
                    <div key={row.id || i} className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <input value={row.graftRange || ""} onChange={e => updateArrayItem("section9", "rows", i, "graftRange", e.target.value)} className="md:col-span-4 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold" placeholder="Grafts Required" />
                      <input value={row.cost || ""} onChange={e => updateArrayItem("section9", "rows", i, "cost", e.target.value)} className="md:col-span-4 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold" placeholder="Approximate Cost" />
                      <input type="number" value={row.sortOrder ?? (i + 1)} onChange={e => updateArrayItem("section9", "rows", i, "sortOrder", parseInt(e.target.value, 10) || 0)} className="md:col-span-2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center" />
                      <div className="md:col-span-2 flex justify-end gap-1">
                        <button onClick={() => reorderOrderedArrayItem("section9", "rows", i, "up")} disabled={i === 0} className="p-1 bg-slate-50 text-slate-500 rounded disabled:opacity-30"><ArrowUp size={12}/></button>
                        <button onClick={() => reorderOrderedArrayItem("section9", "rows", i, "down")} disabled={i === (data.section9?.rows?.length || 0) - 1} className="p-1 bg-slate-50 text-slate-500 rounded disabled:opacity-30"><ArrowDown size={12}/></button>
                        <button onClick={() => removeArrayItem("section9", "rows", i)} className="p-1 bg-red-50 text-red-500 rounded"><Trash2 size={12}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(true || activeTab === 'contentBlocks') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                 <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Type size={18} className="text-blue-500"/> Content Blocks</h3>
                      <p className="text-xs text-slate-400 mt-1">Manage long-form informational blocks on the service details page</p>
                    </div>
                    <button 
                      onClick={addContentBlock}
                      className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
                    >
                      <Plus size={13}/> Add Content Block
                    </button>
                 </div>

                 <div className="space-y-6">
                    {(data.contentBlocks || []).map((block, i) => (
                       <div key={i} className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 relative group flex flex-col gap-4 shadow-sm">
                          {/* Top row: heading and order controls */}
                          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                                   {i + 1}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Block {i + 1}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => reorderContentBlock(i, 'up')} 
                                  disabled={i === 0}
                                  className="p-1.5 bg-white text-slate-500 rounded-lg hover:bg-slate-100 disabled:opacity-30 border border-slate-200"
                                >
                                   <ArrowUp size={14} />
                                </button>
                                <button 
                                  onClick={() => reorderContentBlock(i, 'down')} 
                                  disabled={i === (data.contentBlocks?.length || 0) - 1}
                                  className="p-1.5 bg-white text-slate-500 rounded-lg hover:bg-slate-100 disabled:opacity-30 border border-slate-200"
                                >
                                   <ArrowDown size={14} />
                                </button>
                                <button 
                                  onClick={() => removeContentBlock(i)} 
                                  className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 border border-red-100"
                                >
                                   <Trash2 size={14} />
                                </button>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className="md:col-span-2">
                                <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Heading Title</label>
                                <input 
                                  type="text" 
                                  value={block.heading || ""} 
                                  onChange={e => updateContentBlock(i, "heading", e.target.value)} 
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                                  placeholder="e.g. WHAT IS A HAIR TRANSPLANT?" 
                                />
                             </div>
                             <div>
                                <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Settings</label>
                                <div className="flex gap-4 h-[46px] items-center">
                                   <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        checked={block.isVisible !== false} 
                                        onChange={e => updateContentBlock(i, "isVisible", e.target.checked)} 
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4" 
                                      />
                                      <span className="text-xs font-bold text-slate-600">Visible</span>
                                   </label>
                                   <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order:</span>
                                      <input 
                                        type="number" 
                                        value={block.sortOrder ?? (i + 1)} 
                                        onChange={e => updateContentBlock(i, "sortOrder", parseInt(e.target.value, 10) || 0)} 
                                        className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center" 
                                      />
                                   </div>
                                </div>
                             </div>
                             <div className="md:col-span-3">
                                <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Description Content (Use "- " at line start for tick points)</label>
                                <textarea 
                                  value={block.description || ""} 
                                  onChange={e => updateContentBlock(i, "description", e.target.value)} 
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[160px]" 
                                  placeholder={'Write paragraphs normally.\n\n- Add tick point like this\n- Add another tick point'}
                                />
                             </div>
                          </div>
                       </div>
                    ))}
                    {(data.contentBlocks || []).length === 0 && (
                       <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                          <Type size={32} className="text-slate-300 mx-auto mb-3" />
                          <p className="text-sm text-slate-400 font-bold">No Content Blocks added yet</p>
                          <p className="text-xs text-slate-300 mt-1">Click "Add Content Block" to add a new uppercase heading and descriptions section.</p>
                       </div>
                    )}
                 </div>
              </div>
            )}

            {isBodyHairDetailSlug(selectedSlug) && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Type size={18} className="text-blue-500"/> Body Hair Intro Section
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Edit the light blue overview section shown below the BHT hero.</p>
                  </div>
                  {renderSectionVisibilityToggle("bodyHairIntroSection")}
                </div>

                <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Section Heading</label>
                    <input
                      type="text"
                      value={data.bodyHairIntroSection?.heading || ""}
                      onChange={e => updateSectionField("bodyHairIntroSection", "heading", e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Content (blank line creates paragraph)</label>
                    <textarea
                      value={data.bodyHairIntroSection?.content || ""}
                      onChange={e => updateSectionField("bodyHairIntroSection", "content", e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[220px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {isBodyHairDetailSlug(selectedSlug) && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <CheckCircle size={18} className="text-blue-500"/> BHT Suitable Candidates Section
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Dark-blue content section below the BHT benefits list.</p>
                  </div>
                  {renderSectionVisibilityToggle("bodyHairSuitableSection")}
                </div>

                <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Section Heading</label>
                      <input
                        type="text"
                        value={data.bodyHairSuitableSection?.heading || ""}
                        onChange={e => updateSectionField("bodyHairSuitableSection", "heading", e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Procedure Label</label>
                      <input
                        type="text"
                        value={data.bodyHairSuitableSection?.procedureHeading || ""}
                        onChange={e => updateSectionField("bodyHairSuitableSection", "procedureHeading", e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Procedure Content</label>
                    <textarea
                      value={data.bodyHairSuitableSection?.procedureContent || ""}
                      onChange={e => updateSectionField("bodyHairSuitableSection", "procedureContent", e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[160px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Candidate Points</h4>
                        <button
                          type="button"
                          onClick={() => addArrayItem("bodyHairSuitableSection", "candidates", "")}
                          className="px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest"
                        >
                          + Add
                        </button>
                      </div>
                      <div className="space-y-3">
                        {(data.bodyHairSuitableSection?.candidates || []).map((point, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              type="text"
                              value={point || ""}
                              onChange={e => updateArrayItem("bodyHairSuitableSection", "candidates", i, null, e.target.value)}
                              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button type="button" onClick={() => removeArrayItem("bodyHairSuitableSection", "candidates", i)} className="px-3 rounded-xl bg-red-50 text-red-500">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Benefits Heading</label>
                          <input
                            type="text"
                            value={data.bodyHairSuitableSection?.benefitsHeading || ""}
                            onChange={e => updateSectionField("bodyHairSuitableSection", "benefitsHeading", e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Benefits Intro</label>
                          <input
                            type="text"
                            value={data.bodyHairSuitableSection?.benefitsIntro || ""}
                            onChange={e => updateSectionField("bodyHairSuitableSection", "benefitsIntro", e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Benefit Points</h4>
                        <button
                          type="button"
                          onClick={() => addArrayItem("bodyHairSuitableSection", "benefits", "")}
                          className="px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest"
                        >
                          + Add
                        </button>
                      </div>
                      <div className="space-y-3">
                        {(data.bodyHairSuitableSection?.benefits || []).map((point, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              type="text"
                              value={point || ""}
                              onChange={e => updateArrayItem("bodyHairSuitableSection", "benefits", i, null, e.target.value)}
                              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button type="button" onClick={() => removeArrayItem("bodyHairSuitableSection", "benefits", i)} className="px-3 rounded-xl bg-red-50 text-red-500">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Concerns Heading</label>
                    <input
                      type="text"
                      value={data.bodyHairSuitableSection?.concernsHeading || ""}
                      onChange={e => updateSectionField("bodyHairSuitableSection", "concernsHeading", e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Concerns Content</label>
                    <textarea
                      value={data.bodyHairSuitableSection?.concernsContent || ""}
                      onChange={e => updateSectionField("bodyHairSuitableSection", "concernsContent", e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[160px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {(true || activeTab === 'benefitsSection') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><CheckCircle size={18} className="text-blue-500"/> {isHairCostEditor ? "Hair Transplant Benefits Strip" : "Benefits Section"}</h3>
                    <p className="text-xs text-slate-400 mt-1">{isHairCostEditor ? "Manage the benefits strip heading, icons, and items shown on this service page" : "Manage the premium dynamic benefits list and left-side graphic image"}</p>
                  </div>
                  {renderSectionVisibilityToggle("benefitsSection")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Column: Image and Alt Text */}
                  {!isHairCostEditor && <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Section Graphic & SEO</h4>
                    
                    <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                      <MediaUploader 
                        label="Benefits Section Image" 
                        value={data.benefitsSection?.image || ""} 
                        onChange={val => setData(prev => ({
                          ...prev,
                          benefitsSection: { ...prev.benefitsSection, image: val }
                        }))} 
                      />
                      
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Image Alt Text (SEO)</label>
                        <input 
                          type="text" 
                          value={data.benefitsSection?.altText || ""} 
                          onChange={e => setData(prev => ({
                            ...prev,
                            benefitsSection: { ...prev.benefitsSection, altText: e.target.value }
                          }))}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                          placeholder="e.g. FUE Hair transplant transplanting follicles" 
                        />
                      </div>
                    </div>
                  </div>}

                  {/* Right Column: Heading & Repeater List */}
                  <div className={`${isHairCostEditor ? 'md:col-span-3' : 'md:col-span-2'} space-y-6`}>
                    {isHairCostEditor ? (
                      <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                        <div>
                          <div className="flex justify-between items-center gap-3 mb-4">
                            <div>
                              <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Dark Benefits Strip</h4>
                              <p className="text-[11px] text-slate-400 mt-1">This section appears below the cost information on the frontend.</p>
                            </div>
                            <button
                              onClick={addBenefitPoint}
                              className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
                            >
                              <Plus size={13}/> Add Item
                            </button>
                          </div>
                          <div className="mb-4">
                            <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Strip Heading</label>
                            <input
                              type="text"
                              value={data.benefitsSection?.benefitStripHeading || ""}
                              onChange={e => setData(prev => ({
                                ...prev,
                                benefitsSection: { ...prev.benefitsSection, benefitStripHeading: e.target.value }
                              }))}
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                              placeholder="BENEFITS OF HAIR TRANSPLANT AT DMC TRICHOLOGY"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(data.benefitsSection?.points || []).map((pt, i) => (
                              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-sm">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Benefit Item {i + 1}</span>
                                  <button
                                    onClick={() => removeBenefitPoint(i)}
                                    className="p-1 bg-red-50 text-red-500 rounded hover:bg-red-100 border border-red-100"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={pt.benefitText || ""}
                                  onChange={e => updateBenefitPoint(i, "benefitText", e.target.value)}
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="e.g. Natural regrowth of hair"
                                />
                                <MediaUploader
                                  label="Icon Image"
                                  value={pt.icon || ""}
                                  onChange={val => updateBenefitPoint(i, "icon", val)}
                                />
                                <div className="flex items-center justify-between gap-3">
                                  <label className="flex items-center gap-1 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={pt.isVisible !== false}
                                      onChange={e => updateBenefitPoint(i, "isVisible", e.target.checked)}
                                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                                    />
                                    <span className="text-[10px] font-black uppercase text-slate-500">Visible</span>
                                  </label>
                                  <input
                                    type="number"
                                    value={pt.sortOrder ?? (i + 1)}
                                    onChange={e => updateBenefitPoint(i, "sortOrder", parseInt(e.target.value, 10) || 0)}
                                    className="w-14 px-1 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-center"
                                    min="0"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Benefits & Heading</h4>
                          <button 
                            onClick={addBenefitPoint}
                            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
                          >
                            <Plus size={13}/> Add Benefit
                          </button>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Section Heading Title</label>
                            <input 
                              type="text" 
                              value={data.benefitsSection?.heading || ""} 
                              onChange={e => setData(prev => ({
                                ...prev,
                                benefitsSection: { ...prev.benefitsSection, heading: e.target.value }
                              }))}
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                              placeholder="e.g. Key Benefits of the Treatment" 
                            />
                          </div>

                          <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Benefits List</label>
                            
                            {(data.benefitsSection?.points || []).map((pt, i) => (
                          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-3 shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Benefit Point {i + 1}</span>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => reorderBenefitPoint(i, 'up')} 
                                  disabled={i === 0}
                                  className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"
                                >
                                  <ArrowUp size={12} />
                                </button>
                                <button 
                                  onClick={() => reorderBenefitPoint(i, 'down')} 
                                  disabled={i === (data.benefitsSection?.points?.length || 0) - 1}
                                  className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"
                                >
                                  <ArrowDown size={12} />
                                </button>
                                <button 
                                  onClick={() => removeBenefitPoint(i)} 
                                  className="p-1 bg-red-50 text-red-500 rounded hover:bg-red-100 border border-red-100"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                              <div className="md:col-span-3">
                                <input 
                                  type="text" 
                                  value={pt.benefitText || ""} 
                                  onChange={e => updateBenefitPoint(i, "benefitText", e.target.value)}
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="e.g. Natural-looking, permanent results"
                                />
                              </div>
                              <div className="flex justify-between items-center gap-2">
                                <label className="flex items-center gap-1 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={pt.isVisible !== false} 
                                    onChange={e => updateBenefitPoint(i, "isVisible", e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" 
                                  />
                                  <span className="text-[10px] font-black uppercase text-slate-500">Visible</span>
                                </label>
                                <input 
                                  type="number" 
                                  value={pt.sortOrder ?? (i + 1)} 
                                  onChange={e => updateBenefitPoint(i, "sortOrder", parseInt(e.target.value, 10) || 0)}
                                  className="w-12 px-1 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-center" 
                                  min="0"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        {(data.benefitsSection?.points || []).length === 0 && (
                          <div className="text-center py-8 bg-white rounded-2xl border border-slate-200">
                            <CheckCircle size={24} className="text-slate-300 mx-auto mb-2" />
                            <p className="text-xs text-slate-400 font-bold">No benefits added yet</p>
                            <p className="text-[10px] text-slate-300 mt-0.5">Click "Add Benefit" to build a clean checklist.</p>
                          </div>
                        )}
                      </div>
                    </div>
                    </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isFueDetailSlug(selectedSlug) && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <ImageIcon size={18} className="text-blue-500"/> FUE Procedure Section
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">This section appears below the benefits section on the FUE service page.</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={data.fueProcedureSection?.isVisible !== false}
                      onChange={e => updateSectionField("fueProcedureSection", "isVisible", e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-600">Visible</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Section Image & SEO</h4>
                    <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                      <MediaUploader
                        label="Procedure Image"
                        value={data.fueProcedureSection?.image || ""}
                        onChange={val => updateSectionField("fueProcedureSection", "image", val)}
                      />
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Image Alt Text</label>
                        <input
                          type="text"
                          value={data.fueProcedureSection?.altText || ""}
                          onChange={e => updateSectionField("fueProcedureSection", "altText", e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          placeholder="FUE hair transplant procedure"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Heading & Content</h4>
                    <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Section Heading</label>
                        <input
                          type="text"
                          value={data.fueProcedureSection?.heading || ""}
                          onChange={e => updateSectionField("fueProcedureSection", "heading", e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          placeholder="FUE HAIR TRANSPLANT PROCEDURE"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Content (blank line for paragraphs, **bold** supported)</label>
                        <textarea
                          value={data.fueProcedureSection?.content || ""}
                          onChange={e => updateSectionField("fueProcedureSection", "content", e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[260px]"
                          placeholder="Write procedure content..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isFueDetailSlug(selectedSlug) && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <CheckCircle size={18} className="text-blue-500"/> FUE Cost Section
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Manage the FUE cost factors, chart image, and pricing table.</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={data.fueCostSection?.isVisible !== false}
                      onChange={e => updateSectionField("fueCostSection", "isVisible", e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-600">Visible</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Cost Chart Image</h4>
                    <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                      <MediaUploader
                        label="Chart Image"
                        value={data.fueCostSection?.image || ""}
                        onChange={val => updateSectionField("fueCostSection", "image", val)}
                      />
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Image Alt Text</label>
                        <input
                          type="text"
                          value={data.fueCostSection?.altText || ""}
                          onChange={e => updateSectionField("fueCostSection", "altText", e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Content & Table</h4>
                    <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Section Heading</label>
                          <input
                            type="text"
                            value={data.fueCostSection?.heading || ""}
                            onChange={e => updateSectionField("fueCostSection", "heading", e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Intro Text</label>
                          <input
                            type="text"
                            value={data.fueCostSection?.introText || ""}
                            onChange={e => updateSectionField("fueCostSection", "introText", e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Cost Factor Points</label>
                          <button onClick={addFueCostPoint} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                            <Plus size={12}/> Add Point
                          </button>
                        </div>
                        <div className="space-y-3">
                          {(data.fueCostSection?.points || []).map((point, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-3 rounded-xl border border-slate-200">
                              <input
                                type="text"
                                value={point.pointText || ""}
                                onChange={e => updateFueCostPoint(i, "pointText", e.target.value)}
                                className="md:col-span-8 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <input
                                type="number"
                                value={point.sortOrder ?? (i + 1)}
                                onChange={e => updateFueCostPoint(i, "sortOrder", parseInt(e.target.value, 10) || 0)}
                                className="md:col-span-2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center"
                              />
                              <label className="md:col-span-1 flex items-center justify-center">
                                <input type="checkbox" checked={point.isVisible !== false} onChange={e => updateFueCostPoint(i, "isVisible", e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4" />
                              </label>
                              <button onClick={() => removeFueCostPoint(i)} className="md:col-span-1 p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Note Text</label>
                        <input
                          type="text"
                          value={data.fueCostSection?.noteText || ""}
                          onChange={e => updateSectionField("fueCostSection", "noteText", e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Pricing Table Rows</label>
                          <button onClick={addFueCostRow} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                            <Plus size={12}/> Add Row
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <input
                            type="text"
                            value={data.fueCostSection?.tableHeaders?.[0] || ""}
                            onChange={e => setData(prev => {
                              const headers = [...(prev.fueCostSection?.tableHeaders || [])];
                              headers[0] = e.target.value;
                              return { ...prev, fueCostSection: { ...prev.fueCostSection, tableHeaders: headers } };
                            })}
                            className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="No. of Grafts"
                          />
                          <input
                            type="text"
                            value={data.fueCostSection?.tableHeaders?.[1] || ""}
                            onChange={e => setData(prev => {
                              const headers = [...(prev.fueCostSection?.tableHeaders || [])];
                              headers[1] = e.target.value;
                              return { ...prev, fueCostSection: { ...prev.fueCostSection, tableHeaders: headers } };
                            })}
                            className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="FUE Hair Transplant Cost in Delhi"
                          />
                        </div>
                        <div className="space-y-3">
                          {(data.fueCostSection?.tableRows || []).map((row, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-3 rounded-xl border border-slate-200">
                              <input type="text" value={row.grafts || ""} onChange={e => updateFueCostRow(i, "grafts", e.target.value)} className="md:col-span-4 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500" placeholder="< 2000" />
                              <input type="text" value={row.cost || ""} onChange={e => updateFueCostRow(i, "cost", e.target.value)} className="md:col-span-4 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500" placeholder="50K" />
                              <input type="number" value={row.sortOrder ?? (i + 1)} onChange={e => updateFueCostRow(i, "sortOrder", parseInt(e.target.value, 10) || 0)} className="md:col-span-2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center" />
                              <label className="md:col-span-1 flex items-center justify-center">
                                <input type="checkbox" checked={row.isVisible !== false} onChange={e => updateFueCostRow(i, "isVisible", e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4" />
                              </label>
                              <button onClick={() => removeFueCostRow(i)} className="md:col-span-1 p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isFueDetailSlug(selectedSlug) && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <CheckCircle size={18} className="text-blue-500"/> FUE Opting Benefits
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Manage the dark blue FUE benefits section shown below the cost guide.</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={data.fueOptingBenefitsSection?.isVisible !== false}
                      onChange={e => updateSectionField("fueOptingBenefitsSection", "isVisible", e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-600">Visible</span>
                  </label>
                </div>

                <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Section Heading</label>
                      <input
                        type="text"
                        value={data.fueOptingBenefitsSection?.heading || ""}
                        onChange={e => updateSectionField("fueOptingBenefitsSection", "heading", e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Lead Text</label>
                      <input
                        type="text"
                        value={data.fueOptingBenefitsSection?.leadText || ""}
                        onChange={e => updateSectionField("fueOptingBenefitsSection", "leadText", e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Intro Paragraph</label>
                    <textarea
                      value={data.fueOptingBenefitsSection?.introText || ""}
                      onChange={e => updateSectionField("fueOptingBenefitsSection", "introText", e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[120px]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Benefit Items</label>
                      <button onClick={addFueOptingBenefit} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                        <Plus size={12}/> Add Benefit
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(data.fueOptingBenefitsSection?.benefits || []).map((benefit, i) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-3 rounded-xl border border-slate-200">
                          <input
                            type="text"
                            value={benefit.title || ""}
                            onChange={e => updateFueOptingBenefit(i, "title", e.target.value)}
                            className="md:col-span-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Benefit title"
                          />
                          <textarea
                            value={benefit.description || ""}
                            onChange={e => updateFueOptingBenefit(i, "description", e.target.value)}
                            className="md:col-span-5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500 min-h-[70px]"
                            placeholder="Benefit description"
                          />
                          <input
                            type="number"
                            value={benefit.sortOrder ?? (i + 1)}
                            onChange={e => updateFueOptingBenefit(i, "sortOrder", parseInt(e.target.value, 10) || 0)}
                            className="md:col-span-2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center"
                          />
                          <label className="md:col-span-1 flex items-center justify-center">
                            <input type="checkbox" checked={benefit.isVisible !== false} onChange={e => updateFueOptingBenefit(i, "isVisible", e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4" />
                          </label>
                          <button onClick={() => removeFueOptingBenefit(i)} className="md:col-span-1 p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isHairCostEditor && (true || activeTab === 'idealCandidates') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Star size={18} className="text-blue-500"/> Ideal Candidates Section</h3>
                    <p className="text-xs text-slate-400 mt-1">Manage the premium ideal candidates breakdown, lists, and right-side graphics</p>
                  </div>
                  {renderSectionVisibilityToggle("idealCandidates")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left & Center: Text Fields & Repeater List */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Section Heading Title</label>
                        <input 
                          type="text" 
                          value={data.idealCandidates?.sectionHeading || ""} 
                          onChange={e => setData(prev => ({
                            ...prev,
                            idealCandidates: { ...prev.idealCandidates, sectionHeading: e.target.value }
                          }))}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                          placeholder="e.g. Ideal Candidates" 
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Introductory Paragraph Text</label>
                        <textarea 
                          value={data.idealCandidates?.introText || ""} 
                          onChange={e => setData(prev => ({
                            ...prev,
                            idealCandidates: { ...prev.idealCandidates, introText: e.target.value }
                          }))}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]" 
                          placeholder="Introduce the ideal candidate criteria..." 
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Bullet Checklist</label>
                          <button 
                            onClick={addCandidateBullet}
                            className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm"
                          >
                            <Plus size={12}/> Add Bullet
                          </button>
                        </div>
                        
                        {(data.idealCandidates?.bullets || []).map((pt, i) => (
                          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-3 shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Bullet Point {i + 1}</span>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => reorderCandidateBullet(i, 'up')} 
                                  disabled={i === 0}
                                  className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"
                                >
                                  <ArrowUp size={12} />
                                </button>
                                <button 
                                  onClick={() => reorderCandidateBullet(i, 'down')} 
                                  disabled={i === (data.idealCandidates?.bullets?.length || 0) - 1}
                                  className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"
                                >
                                  <ArrowDown size={12} />
                                </button>
                                <button 
                                  onClick={() => removeCandidateBullet(i)} 
                                  className="p-1 bg-red-50 text-red-500 rounded hover:bg-red-100 border border-red-100"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                              <div className="md:col-span-3">
                                <input 
                                  type="text" 
                                  value={pt.bulletText || ""} 
                                  onChange={e => updateCandidateBullet(i, "bulletText", e.target.value)}
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="e.g. Male or female pattern thinning"
                                />
                              </div>
                              <div className="flex justify-between items-center gap-2">
                                <label className="flex items-center gap-1 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={pt.isVisible !== false} 
                                    onChange={e => updateCandidateBullet(i, "isVisible", e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" 
                                  />
                                  <span className="text-[10px] font-black uppercase text-slate-500">Visible</span>
                                </label>
                                <input 
                                  type="number" 
                                  value={pt.sortOrder ?? (i + 1)} 
                                  onChange={e => updateCandidateBullet(i, "sortOrder", parseInt(e.target.value, 10) || 0)}
                                  className="w-12 px-1 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-center" 
                                  min="0"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        {(data.idealCandidates?.bullets || []).length === 0 && (
                          <div className="text-center py-8 bg-white rounded-2xl border border-slate-200">
                            <Star size={24} className="text-slate-300 mx-auto mb-2" />
                            <p className="text-xs text-slate-400 font-bold">No bullets added yet</p>
                            <p className="text-[10px] text-slate-300 mt-0.5">Click "Add Bullet" to build a candidate criteria checklist.</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Bottom Conclusion Text</label>
                        <textarea 
                          value={data.idealCandidates?.bottomConclusionText || ""} 
                          onChange={e => setData(prev => ({
                            ...prev,
                            idealCandidates: { ...prev.idealCandidates, bottomConclusionText: e.target.value }
                          }))}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]" 
                          placeholder="Summarize or add a CTA conclusion..." 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Graphic Image and Alt Text */}
                  <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Section Graphic & SEO</h4>
                    
                    <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                      <MediaUploader 
                        label="Candidates Infographic Image" 
                        value={data.idealCandidates?.sectionImage || ""} 
                        onChange={val => setData(prev => ({
                          ...prev,
                          idealCandidates: { ...prev.idealCandidates, sectionImage: val }
                        }))} 
                      />
                      
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Image Alt Text (SEO)</label>
                        <input 
                          type="text" 
                          value={data.idealCandidates?.altText || ""} 
                          onChange={e => setData(prev => ({
                            ...prev,
                            idealCandidates: { ...prev.idealCandidates, altText: e.target.value }
                          }))}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                          placeholder="e.g. Ideal candidates checklist infographic" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isHairCostEditor && (true || activeTab === 'notCandidates') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><HelpCircle size={18} className="text-blue-500"/> Not Candidates Section</h3>
                    <p className="text-xs text-slate-400 mt-1">Manage who is NOT a candidate for this treatment (exclusion criteria list)</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={data.notCandidatesSection?.isVisible !== false}
                      onChange={e => setData(prev => ({
                        ...prev,
                        notCandidatesSection: { ...(prev.notCandidatesSection || {}), isVisible: e.target.checked }
                      }))}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-600">Visible</span>
                  </label>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Section Heading Title</label>
                      <input 
                        type="text" 
                        value={data.notCandidatesSection?.sectionHeading || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          notCandidatesSection: { ...prev.notCandidatesSection, sectionHeading: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        placeholder="e.g. Who is not a candidate for Hair Transplant Surgery?" 
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Contraindications & Exclusions Bullets</label>
                        <button 
                          onClick={addNotCandidateBullet}
                          className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm"
                        >
                          <Plus size={12}/> Add Bullet
                        </button>
                      </div>
                      
                      {(data.notCandidatesSection?.bullets || []).map((pt, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-3 shadow-sm">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Bullet Point {i + 1}</span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => reorderNotCandidateBullet(i, 'up')} 
                                disabled={i === 0}
                                className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button 
                                onClick={() => reorderNotCandidateBullet(i, 'down')} 
                                disabled={i === (data.notCandidatesSection?.bullets?.length || 0) - 1}
                                className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"
                              >
                                <ArrowDown size={12} />
                              </button>
                              <button 
                                onClick={() => removeNotCandidateBullet(i)} 
                                className="p-1 bg-red-50 text-red-500 rounded hover:bg-red-100 border border-red-100"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <div className="md:col-span-3">
                              <input 
                                type="text" 
                                value={pt.bulletText || ""} 
                                onChange={e => updateNotCandidateBullet(i, "bulletText", e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g. Those with active scalp psoriasis or infection"
                              />
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={pt.isVisible !== false} 
                                  onChange={e => updateNotCandidateBullet(i, "isVisible", e.target.checked)}
                                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" 
                                />
                                <span className="text-[10px] font-black uppercase text-slate-500">Visible</span>
                              </label>
                              <input 
                                type="number" 
                                value={pt.sortOrder ?? (i + 1)} 
                                onChange={e => updateNotCandidateBullet(i, "sortOrder", parseInt(e.target.value, 10) || 0)}
                                className="w-12 px-1 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-center" 
                                min="0"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {(data.notCandidatesSection?.bullets || []).length === 0 && (
                        <div className="text-center py-8 bg-white rounded-2xl border border-slate-200">
                          <HelpCircle size={24} className="text-slate-300 mx-auto mb-2" />
                          <p className="text-xs text-slate-400 font-bold">No bullets added yet</p>
                          <p className="text-[10px] text-slate-300 mt-0.5">Click "Add Bullet" to build the exclusions list.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isHairCostEditor && (true || activeTab === 'techniques') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><List size={18} className="text-blue-500"/> Treatment Techniques</h3>
                    <p className="text-xs text-slate-400 mt-1">Manage premium numbered techniques, procedures, and methods</p>
                  </div>
                  {renderSectionVisibilityToggle("techniquesSection")}
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Section Heading Title</label>
                      <input 
                        type="text" 
                        value={data.techniquesSection?.sectionHeading || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          techniquesSection: { ...prev.techniquesSection, sectionHeading: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        placeholder="e.g. Hair Transplant Technique" 
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Techniques List</label>
                        <button 
                          onClick={addTechniqueItem}
                          className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm"
                        >
                          <Plus size={12}/> Add Technique
                        </button>
                      </div>
                      
                      {(data.techniquesSection?.techniques || []).map((pt, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col gap-4 shadow-sm">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Technique Item {i + 1}</span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => reorderTechniqueItem(i, 'up')} 
                                disabled={i === 0}
                                className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button 
                                onClick={() => reorderTechniqueItem(i, 'down')} 
                                disabled={i === (data.techniquesSection?.techniques?.length || 0) - 1}
                                className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"
                              >
                                <ArrowDown size={12} />
                              </button>
                              <button 
                                onClick={() => removeTechniqueItem(i)} 
                                className="p-1 bg-red-50 text-red-500 rounded hover:bg-red-100 border border-red-100"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                              <div className="md:col-span-3">
                                <label className="block text-[8px] font-black uppercase text-slate-400 mb-1 tracking-widest">Technique Title</label>
                                <input 
                                  type="text" 
                                  value={pt.title || ""} 
                                  onChange={e => updateTechniqueItem(i, "title", e.target.value)}
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="e.g. 1. FUT HAIR TRANSPLANT"
                                />
                              </div>
                              <div className="flex justify-between items-center gap-2 pt-4">
                                <label className="flex items-center gap-1 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={pt.isVisible !== false} 
                                    onChange={e => updateTechniqueItem(i, "isVisible", e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" 
                                  />
                                  <span className="text-[10px] font-black uppercase text-slate-500">Visible</span>
                                </label>
                                <input 
                                  type="number" 
                                  value={pt.sortOrder ?? (i + 1)} 
                                  onChange={e => updateTechniqueItem(i, "sortOrder", parseInt(e.target.value, 10) || 0)}
                                  className="w-12 px-1 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-center" 
                                  min="0"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[8px] font-black uppercase text-slate-400 mb-1 tracking-widest">Description</label>
                              <textarea 
                                value={pt.description || ""} 
                                onChange={e => updateTechniqueItem(i, "description", e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                                placeholder="Describe the procedural method in detail..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {(data.techniquesSection?.techniques || []).length === 0 && (
                        <div className="text-center py-8 bg-white rounded-2xl border border-slate-200">
                          <List size={24} className="text-slate-300 mx-auto mb-2" />
                          <p className="text-xs text-slate-400 font-bold">No techniques added yet</p>
                          <p className="text-[10px] text-slate-300 mt-0.5">Click "Add Technique" to display procedures list.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isHairCostEditor && (true || activeTab === 'infoBlocks') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Type size={18} className="text-blue-500"/> Editorial Info Blocks</h3>
                    <p className="text-xs text-slate-400 mt-1">Manage highly reusable editorial sections with alternating cream/white backgrounds</p>
                  </div>
                  {renderSectionVisibilityToggle("infoBlocksSection")}
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Editorial Blocks</label>
                        <button 
                          onClick={addInfoBlockItem}
                          className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm"
                        >
                          <Plus size={12}/> Add Block
                        </button>
                      </div>
                      
                      {(data.infoBlocksSection?.blocks || []).map((pt, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col gap-4 shadow-sm">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Info Block {i + 1}</span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => reorderInfoBlockItem(i, 'up')} 
                                disabled={i === 0}
                                className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button 
                                onClick={() => reorderInfoBlockItem(i, 'down')} 
                                disabled={i === (data.infoBlocksSection?.blocks?.length || 0) - 1}
                                className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"
                              >
                                <ArrowDown size={12} />
                              </button>
                              <button 
                                onClick={() => removeInfoBlockItem(i)} 
                                className="p-1 bg-red-50 text-red-500 rounded hover:bg-red-100 border border-red-100"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                              <div className="md:col-span-2">
                                <label className="block text-[8px] font-black uppercase text-slate-400 mb-1 tracking-widest">Block Heading</label>
                                <input 
                                  type="text" 
                                  value={pt.heading || ""} 
                                  onChange={e => updateInfoBlockItem(i, "heading", e.target.value)}
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="e.g. WHAT HAPPENS DURING HAIR TRANSPLANT PROCEDURE?"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] font-black uppercase text-slate-400 mb-1 tracking-widest">Background Variant</label>
                                <select 
                                  value={pt.backgroundVariant || "white"} 
                                  onChange={e => updateInfoBlockItem(i, "backgroundVariant", e.target.value)}
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="white">Editorial White</option>
                                  <option value="cream">Luxury Cream / Ivory</option>
                                </select>
                              </div>
                              <div className="flex justify-between items-center gap-2 pt-4">
                                <label className="flex items-center gap-1 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={pt.isVisible !== false} 
                                    onChange={e => updateInfoBlockItem(i, "isVisible", e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" 
                                  />
                                  <span className="text-[10px] font-black uppercase text-slate-500">Visible</span>
                                </label>
                                <input 
                                  type="number" 
                                  value={pt.sortOrder ?? (i + 1)} 
                                  onChange={e => updateInfoBlockItem(i, "sortOrder", parseInt(e.target.value, 10) || 0)}
                                  className="w-12 px-1 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-center" 
                                  min="0"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[8px] font-black uppercase text-slate-400 mb-1 tracking-widest">Description</label>
                              <textarea 
                                value={pt.description || ""} 
                                onChange={e => updateInfoBlockItem(i, "description", e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500 min-h-[120px]"
                                placeholder="Write the editorial description content..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {(data.infoBlocksSection?.blocks || []).length === 0 && (
                        <div className="text-center py-8 bg-white rounded-2xl border border-slate-200">
                          <Type size={24} className="text-slate-300 mx-auto mb-2" />
                          <p className="text-xs text-slate-400 font-bold">No info blocks added yet</p>
                          <p className="text-[10px] text-slate-300 mt-0.5">Click "Add Block" to insert premium sections.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isHairCostEditor && (true || activeTab === 'aftercare') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><CheckCircle size={18} className="text-blue-500"/> Aftercare Instructions</h3>
                    <p className="text-xs text-slate-400 mt-1">Manage guidelines, tips, and recovery protocols post-treatment</p>
                  </div>
                  {renderSectionVisibilityToggle("aftercareSection")}
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Section Heading Title</label>
                      <input 
                        type="text" 
                        value={data.aftercareSection?.sectionHeading || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          aftercareSection: { ...prev.aftercareSection, sectionHeading: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        placeholder="e.g. How to take care of scalp after Hair Transplant?" 
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Introductory Text</label>
                      <textarea 
                        value={data.aftercareSection?.introText || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          aftercareSection: { ...prev.aftercareSection, introText: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[80px]" 
                        placeholder="Post-hair transplant, you must follow these aftercare steps..." 
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Aftercare Guidelines Repeater</label>
                        <button 
                          onClick={addAftercareBullet}
                          className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm"
                        >
                          <Plus size={12}/> Add Guideline
                        </button>
                      </div>
                      
                      {(data.aftercareSection?.bullets || []).map((pt, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-3 shadow-sm">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Guideline {i + 1}</span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => reorderAftercareBullet(i, 'up')} 
                                disabled={i === 0}
                                className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button 
                                onClick={() => reorderAftercareBullet(i, 'down')} 
                                disabled={i === (data.aftercareSection?.bullets?.length || 0) - 1}
                                className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"
                              >
                                <ArrowDown size={12} />
                              </button>
                              <button 
                                onClick={() => removeAftercareBullet(i)} 
                                className="p-1 bg-red-50 text-red-500 rounded hover:bg-red-100 border border-red-100"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <div className="md:col-span-3">
                              <input 
                                type="text" 
                                value={pt.bulletText || ""} 
                                onChange={e => updateAftercareBullet(i, "bulletText", e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g. Spray the scalp with saline for 1 to 4 days"
                              />
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={pt.isVisible !== false} 
                                  onChange={e => updateAftercareBullet(i, "isVisible", e.target.checked)}
                                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" 
                                  id={`aftercare-vis-${i}`}
                                />
                                <span className="text-[10px] font-black uppercase text-slate-500">Visible</span>
                              </label>
                              <input 
                                type="number" 
                                value={pt.sortOrder ?? (i + 1)} 
                                onChange={e => updateAftercareBullet(i, "sortOrder", parseInt(e.target.value, 10) || 0)}
                                className="w-12 px-1 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-center" 
                                min="0"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {(data.aftercareSection?.bullets || []).length === 0 && (
                        <div className="text-center py-8 bg-white rounded-2xl border border-slate-200">
                          <CheckCircle size={24} className="text-slate-300 mx-auto mb-2" />
                          <p className="text-xs text-slate-400 font-bold">No guidelines added yet</p>
                          <p className="text-[10px] text-slate-300 mt-0.5">Click "Add Guideline" to build the checklist.</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Concluding Text</label>
                      <textarea 
                        value={data.aftercareSection?.conclusionText || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          aftercareSection: { ...prev.aftercareSection, conclusionText: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[80px]" 
                        placeholder="Schedule check-up appointments after 3 months..." 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isHairCostEditor && (true || activeTab === 'whyChooseUs') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Star size={18} className="text-blue-500"/> Why Choose Us</h3>
                    <p className="text-xs text-slate-400 mt-1">Manage unique credentials, values, and USPs grid</p>
                  </div>
                  {renderSectionVisibilityToggle("whyChooseUsSection")}
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Section Heading Title</label>
                      <input 
                        type="text" 
                        value={data.whyChooseUsSection?.sectionHeading || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          whyChooseUsSection: { ...prev.whyChooseUsSection, sectionHeading: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        placeholder="e.g. Why Choose DMC Trichology?" 
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Introductory Text</label>
                      <textarea 
                        value={data.whyChooseUsSection?.introText || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          whyChooseUsSection: { ...prev.whyChooseUsSection, introText: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[80px]" 
                        placeholder="At DMC Trichology, we deliver medical-grade luxury reconstructions..." 
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Features Grid Items</label>
                        <button 
                          onClick={addWhyChooseFeature}
                          className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm"
                        >
                          <Plus size={12}/> Add Feature
                        </button>
                      </div>
                      
                      {(data.whyChooseUsSection?.features || []).map((pt, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-3 shadow-sm">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Feature Point {i + 1}</span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => reorderWhyChooseFeature(i, 'up')} 
                                disabled={i === 0}
                                className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button 
                                onClick={() => reorderWhyChooseFeature(i, 'down')} 
                                disabled={i === (data.whyChooseUsSection?.features || 0) - 1}
                                className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"
                              >
                                <ArrowDown size={12} />
                              </button>
                              <button 
                                onClick={() => removeWhyChooseFeature(i)} 
                                className="p-1 bg-red-50 text-red-500 rounded hover:bg-red-100 border border-red-100"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <div className="md:col-span-3">
                              <input 
                                type="text" 
                                value={pt.featureText || ""} 
                                onChange={e => updateWhyChooseFeature(i, "featureText", e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g. 100% graft survival rate and permanent results"
                              />
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={pt.isVisible !== false} 
                                  onChange={e => updateWhyChooseFeature(i, "isVisible", e.target.checked)}
                                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" 
                                  id={`why-choose-vis-${i}`}
                                />
                                <span className="text-[10px] font-black uppercase text-slate-500">Visible</span>
                              </label>
                              <input 
                                type="number" 
                                value={pt.sortOrder ?? (i + 1)} 
                                onChange={e => updateWhyChooseFeature(i, "sortOrder", parseInt(e.target.value, 10) || 0)}
                                className="w-12 px-1 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-center" 
                                min="0"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {(data.whyChooseUsSection?.features || []).length === 0 && (
                        <div className="text-center py-8 bg-white rounded-2xl border border-slate-200">
                          <Star size={24} className="text-slate-300 mx-auto mb-2" />
                          <p className="text-xs text-slate-400 font-bold">No features added yet</p>
                          <p className="text-[10px] text-slate-300 mt-0.5">Click "Add Feature" to build the grid.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isHairCostEditor && (true || activeTab === 'hairTransplantInfo') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Type size={18} className="text-blue-500"/> Hair Transplant Info Cards</h3>
                    <p className="text-xs text-slate-400 mt-1">Edit the extra hair transplant question cards without changing the page layout.</p>
                  </div>
                  <button
                    onClick={addHairTransplantInfoCard}
                    className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm"
                  >
                    <Plus size={12}/> Add Card
                  </button>
                </div>

                <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Section Heading</label>
                      <input
                        type="text"
                        value={data.hairTransplantInfoSection?.sectionHeading || ""}
                        onChange={e => setData(prev => ({
                          ...prev,
                          hairTransplantInfoSection: {
                            ...(prev.hairTransplantInfoSection || { isVisible: true, cards: [] }),
                            sectionHeading: e.target.value
                          }
                        }))}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Optional heading"
                      />
                    </div>
                    <label className="flex items-center gap-2 mt-7 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.hairTransplantInfoSection?.isVisible !== false}
                        onChange={e => setData(prev => ({
                          ...prev,
                          hairTransplantInfoSection: {
                            ...(prev.hairTransplantInfoSection || { cards: [] }),
                            isVisible: e.target.checked
                          }
                        }))}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="text-xs font-black uppercase text-slate-500">Show Section</span>
                    </label>
                  </div>

                  {(data.hairTransplantInfoSection?.cards || []).map((card, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Info Card {i + 1}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => reorderHairTransplantInfoCard(i, 'up')} disabled={i === 0} className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"><ArrowUp size={12} /></button>
                          <button onClick={() => reorderHairTransplantInfoCard(i, 'down')} disabled={i === (data.hairTransplantInfoSection?.cards?.length || 0) - 1} className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"><ArrowDown size={12} /></button>
                          <button onClick={() => removeHairTransplantInfoCard(i)} className="p-1 bg-red-50 text-red-500 rounded hover:bg-red-100 border border-red-100"><Trash2 size={12} /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="md:col-span-3">
                          <label className="block text-[8px] font-black uppercase text-slate-400 mb-1 tracking-widest">Card Title</label>
                          <input
                            type="text"
                            value={card.title || ""}
                            onChange={e => updateHairTransplantInfoCard(i, "title", e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex justify-between items-center gap-2 pt-4">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input type="checkbox" checked={card.isVisible !== false} onChange={e => updateHairTransplantInfoCard(i, "isVisible", e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" />
                            <span className="text-[10px] font-black uppercase text-slate-500">Visible</span>
                          </label>
                          <input type="number" value={card.sortOrder ?? (i + 1)} onChange={e => updateHairTransplantInfoCard(i, "sortOrder", parseInt(e.target.value, 10) || 0)} className="w-12 px-1 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-center" min="0" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-1 tracking-widest">Card Content</label>
                        <textarea
                          value={card.content || ""}
                          onChange={e => updateHairTransplantInfoCard(i, "content", e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500 min-h-[140px]"
                          placeholder="Use blank lines for separate paragraphs."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isHairCostEditor && (true || activeTab === 'hairTransplantWhy') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Star size={18} className="text-blue-500"/> Hair Transplant Why Choose</h3>
                    <p className="text-xs text-slate-400 mt-1">Edit the left content and bullet points for the transplant-specific why choose section.</p>
                  </div>
                  {renderSectionVisibilityToggle("hairTransplantWhyChooseSection")}
                  <button
                    onClick={addHairTransplantWhyPoint}
                    className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm"
                  >
                    <Plus size={12}/> Add Point
                  </button>
                </div>

                <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Section Heading</label>
                    <input
                      type="text"
                      value={data.hairTransplantWhyChooseSection?.sectionHeading || ""}
                      onChange={e => setData(prev => ({
                        ...prev,
                        hairTransplantWhyChooseSection: {
                          ...(prev.hairTransplantWhyChooseSection || {}),
                          sectionHeading: e.target.value
                        }
                      }))}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Intro Text</label>
                    <textarea
                      value={data.hairTransplantWhyChooseSection?.introText || ""}
                      onChange={e => setData(prev => ({
                        ...prev,
                        hairTransplantWhyChooseSection: {
                          ...(prev.hairTransplantWhyChooseSection || {}),
                          introText: e.target.value
                        }
                      }))}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[90px]"
                    />
                  </div>

                  {(data.hairTransplantWhyChooseSection?.points || []).map((point, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
                      <input
                        type="text"
                        value={point || ""}
                        onChange={e => updateHairTransplantWhyPoint(i, e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button onClick={() => reorderHairTransplantWhyPoint(i, 'up')} disabled={i === 0} className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"><ArrowUp size={12} /></button>
                      <button onClick={() => reorderHairTransplantWhyPoint(i, 'down')} disabled={i === (data.hairTransplantWhyChooseSection?.points?.length || 0) - 1} className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"><ArrowDown size={12} /></button>
                      <button onClick={() => removeHairTransplantWhyPoint(i)} className="p-1 bg-red-50 text-red-500 rounded hover:bg-red-100 border border-red-100"><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(true || activeTab === 'editorialFaq') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><HelpCircle size={18} className="text-blue-500"/> Editorial FAQ Section</h3>
                    <p className="text-xs text-slate-400 mt-1">Manage luxury editorial faq accordions with full spacing-retention and multi-paragraph layout</p>
                  </div>
                  {renderSectionVisibilityToggle("editorialFaqSection")}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Section Subtitle</label>
                      <input 
                        type="text" 
                        value={data.editorialFaqSection?.sectionSubtitle ?? ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          editorialFaqSection: {
                            ...(prev.editorialFaqSection || {}),
                            sectionSubtitle: e.target.value
                          }
                        }))} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
                        placeholder="EXPERT ANSWERS"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Section Title</label>
                      <input 
                        type="text" 
                        value={data.editorialFaqSection?.sectionTitle ?? ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          editorialFaqSection: {
                            ...(prev.editorialFaqSection || {}),
                            sectionTitle: e.target.value
                          }
                        }))} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
                        placeholder="EDITORIAL FAQ"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Heading Description</label>
                    <textarea
                      value={data.editorialFaqSection?.sectionDescription ?? ""}
                      onChange={e => setData(prev => ({
                        ...prev,
                        editorialFaqSection: {
                          ...(prev.editorialFaqSection || {}),
                          sectionDescription: e.target.value
                        }
                      }))}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold min-h-[130px]"
                      placeholder="Description shown below the FAQ heading"
                    />
                  </div>

                  <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">FAQ Accordion List</label>
                        <button 
                          onClick={addEditorialFaqItem}
                          className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm"
                        >
                          <Plus size={12}/> Add FAQ Accordion
                        </button>
                      </div>
                      
                      {(data.editorialFaqSection?.faqs || []).map((pt, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col gap-4 shadow-sm">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">FAQ Accordion Item {i + 1}</span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => reorderEditorialFaqItem(i, 'up')} 
                                disabled={i === 0}
                                className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button 
                                onClick={() => reorderEditorialFaqItem(i, 'down')} 
                                disabled={i === (data.editorialFaqSection?.faqs?.length || 0) - 1}
                                className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-200 disabled:opacity-30 border border-slate-200"
                              >
                                <ArrowDown size={12} />
                              </button>
                              <button 
                                onClick={() => removeEditorialFaqItem(i)} 
                                className="p-1 bg-red-50 text-red-500 rounded hover:bg-red-100 border border-red-100"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                              <div className="md:col-span-3">
                                <label className="block text-[8px] font-black uppercase text-slate-400 mb-1 tracking-widest">Question Text</label>
                                <input 
                                  type="text" 
                                  value={pt.question || ""} 
                                  onChange={e => updateEditorialFaqItem(i, "question", e.target.value)}
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="e.g. Does the hair transplant look completely natural?"
                                />
                              </div>
                              <div className="flex justify-between items-center gap-2 pt-4">
                                <label className="flex items-center gap-1 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={pt.isVisible !== false} 
                                    onChange={e => updateEditorialFaqItem(i, "isVisible", e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" 
                                  />
                                  <span className="text-[10px] font-black uppercase text-slate-500">Visible</span>
                                </label>
                                <input 
                                  type="number" 
                                  value={pt.sortOrder ?? (i + 1)} 
                                  onChange={e => updateEditorialFaqItem(i, "sortOrder", parseInt(e.target.value, 10) || 0)}
                                  className="w-12 px-1 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-center" 
                                  min="0"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[8px] font-black uppercase text-slate-400 mb-1 tracking-widest">Answer Text (Multi-line Support)</label>
                              <textarea 
                                value={pt.answer || ""} 
                                onChange={e => updateEditorialFaqItem(i, "answer", e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-blue-500 min-h-[120px]"
                                placeholder="Provide the long-form answer here..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {(data.editorialFaqSection?.faqs || []).length === 0 && (
                        <div className="text-center py-8 bg-white rounded-2xl border border-slate-200">
                          <HelpCircle size={24} className="text-slate-300 mx-auto mb-2" />
                          <p className="text-xs text-slate-400 font-bold">No FAQ accordions added yet</p>
                          <p className="text-[10px] text-slate-300 mt-0.5">Click "Add FAQ Accordion" to build the panel list.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(true || activeTab === 'googleReviewCta') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Star size={18} className="text-blue-500"/> Google Review CTA Section</h3>
                    <p className="text-xs text-slate-400 mt-1">Manage the Google Review CTA banner with background and text customizers</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-[24px] border border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={data.googleReviewCta?.isVisible !== false} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          googleReviewCta: { ...prev.googleReviewCta, isVisible: e.target.checked }
                        }))}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4" 
                      />
                      <span className="text-sm font-bold text-slate-600">Section Visible</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">CTA Title</label>
                      <input 
                        type="text" 
                        value={data.googleReviewCta?.title || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          googleReviewCta: { ...prev.googleReviewCta, title: e.target.value }
                        }))} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Button Text</label>
                      <input 
                        type="text" 
                        value={data.googleReviewCta?.buttonText || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          googleReviewCta: { ...prev.googleReviewCta, buttonText: e.target.value }
                        }))} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Button Link</label>
                      <input 
                        type="text" 
                        value={data.googleReviewCta?.buttonLink || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          googleReviewCta: { ...prev.googleReviewCta, buttonLink: e.target.value }
                        }))} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
                        placeholder="e.g. https://dmctrichology-mkm4.vercel.app/service"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Background Color / Custom Class (Optional)</label>
                      <input 
                        type="text" 
                        value={data.googleReviewCta?.backgroundColor || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          googleReviewCta: { ...prev.googleReviewCta, backgroundColor: e.target.value }
                        }))} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
                        placeholder="e.g. bg-slate-900 or empty for default luxury background"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(true || activeTab === 'resultsSection') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><RefreshCw size={18} className="text-blue-500"/> Before & After Results</h3>
                    <p className="text-xs text-slate-400 mt-1">Manage Before & After result cards, subtitle, title, and cta buttons</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-slate-50 p-6 rounded-[24px] border border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={data.resultsSection?.isVisible !== false} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          resultsSection: { ...prev.resultsSection, isVisible: e.target.checked }
                        }))}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4" 
                      />
                      <span className="text-sm font-bold text-slate-600">Section Visible</span>
                    </label>
                    <button 
                      onClick={addResultCard}
                      className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
                    >
                      <Plus size={13}/> Add Result Card
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Section Subtitle</label>
                      <input 
                        type="text" 
                        value={data.resultsSection?.subtitle || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          resultsSection: { ...prev.resultsSection, subtitle: e.target.value }
                        }))} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Section Title Heading</label>
                      <input 
                        type="text" 
                        value={data.resultsSection?.title || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          resultsSection: { ...prev.resultsSection, title: e.target.value }
                        }))} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">CTA Button Text</label>
                      <input 
                        type="text" 
                        value={data.resultsSection?.buttonText || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          resultsSection: { ...prev.resultsSection, buttonText: e.target.value }
                        }))} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">CTA Button Link</label>
                      <input 
                        type="text" 
                        value={data.resultsSection?.buttonLink || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          resultsSection: { ...prev.resultsSection, buttonLink: e.target.value }
                        }))} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
                        placeholder="e.g. https://dmctrichology-mkm4.vercel.app/service"
                      />
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Result Card Repeater</h4>
                    {(data.resultsSection?.cards || []).map((card, i) => (
                      <div key={i} className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 relative group flex flex-col gap-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Card Item {i + 1}</span>
                          <button 
                            onClick={() => removeResultCard(i)} 
                            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 border border-red-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Card Title</label>
                            <input 
                              type="text" 
                              value={card.title || ""} 
                              onChange={e => updateResultCard(i, "title", e.target.value)} 
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500" 
                              placeholder="e.g. Korean Facial Illumination"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Sessions / Result Info</label>
                            <input 
                              type="text" 
                              value={card.sessions || ""} 
                              onChange={e => updateResultCard(i, "sessions", e.target.value)} 
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500" 
                              placeholder="e.g. After 6 sessions"
                            />
                          </div>
                          <div>
                            <MediaUploader 
                              label="Before Image" 
                              value={card.beforeImg || ""} 
                              onChange={val => updateResultCard(i, "beforeImg", val)} 
                            />
                          </div>
                          <div>
                            <MediaUploader 
                              label="After Image" 
                              value={card.afterImg || ""} 
                              onChange={val => updateResultCard(i, "afterImg", val)} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {(data.resultsSection?.cards || []).length === 0 && (
                      <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <ImageIcon size={28} className="text-slate-300 mx-auto mb-3" />
                        <p className="text-xs text-slate-400 font-semibold">No result cards yet</p>
                        <p className="text-[10px] text-slate-300 mt-1">Click "Add Result Card" to add before/after showcase items.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {(true || activeTab === 'videosSection') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Video size={18} className="text-blue-500"/> Videos Section</h3>
                    <p className="text-xs text-slate-400 mt-1">Manage YouTube videos showcase repeater, section title, and cta buttons</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-slate-50 p-6 rounded-[24px] border border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isHairCostEditor ? data.videosSection?.showOnCostPage === true : data.videosSection?.isVisible !== false} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          videosSection: {
                            ...prev.videosSection,
                            ...(isHairCostEditor
                              ? { showOnCostPage: e.target.checked, isVisible: e.target.checked }
                              : { isVisible: e.target.checked })
                          }
                        }))}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4" 
                      />
                      <span className="text-sm font-bold text-slate-600">{isHairCostEditor ? "Show Videos Section On Page" : "Section Visible"}</span>
                    </label>
                    <button 
                      onClick={addVideoItem}
                      className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
                    >
                      <Plus size={13}/> Add Video Item
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Section Title Heading</label>
                      <input 
                        type="text" 
                        value={data.videosSection?.title || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          videosSection: { ...prev.videosSection, title: e.target.value }
                        }))} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">CTA Button Text</label>
                      <input 
                        type="text" 
                        value={data.videosSection?.buttonText || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          videosSection: { ...prev.videosSection, buttonText: e.target.value }
                        }))} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">CTA Button Link</label>
                      <input 
                        type="text" 
                        value={data.videosSection?.buttonLink || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          videosSection: { ...prev.videosSection, buttonLink: e.target.value }
                        }))} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
                        placeholder="e.g. https://dmctrichology-mkm4.vercel.app/blog"
                      />
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Video Repeater Cards</h4>
                    {(data.videosSection?.videos || []).map((vid, i) => (
                      <div key={i} className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 relative group flex flex-col gap-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Video Item {i + 1}</span>
                          <button 
                            onClick={() => removeVideoItem(i)} 
                            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 border border-red-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Video Title</label>
                            <input 
                              type="text" 
                              value={vid.title || ""} 
                              onChange={e => updateVideoItem(i, "title", e.target.value)} 
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500" 
                              placeholder="e.g. Female Hair Transplant | Good or Bad ?"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Video embed URL / File URL</label>
                            <input 
                              type="text" 
                              value={vid.videoUrl || ""} 
                              onChange={e => updateVideoItem(i, "videoUrl", e.target.value)} 
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500" 
                              placeholder="e.g. https://www.youtube.com/embed/..."
                            />
                          </div>
                          <div>
                            <MediaUploader 
                              label="Thumbnail/Cover Image" 
                              value={vid.thumbnail || ""} 
                              onChange={val => updateVideoItem(i, "thumbnail", val)} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {(data.videosSection?.videos || []).length === 0 && (
                      <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <Video size={28} className="text-slate-300 mx-auto mb-3" />
                        <p className="text-xs text-slate-400 font-semibold">No video items yet</p>
                        <p className="text-[10px] text-slate-300 mt-1">Click "Add Video Item" to embed educational or result videos.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {(true || activeTab === 'enquirySection') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Layout size={18} className="text-blue-500"/> Enquire About This Treatment Form</h3>
                    <p className="text-xs text-slate-400 mt-1">Customize the enquiry form title, description, drop-down options, and style settings</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-[24px] border border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={data.enquirySection?.isVisible !== false} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          enquirySection: { ...prev.enquirySection, isVisible: e.target.checked }
                        }))}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4" 
                      />
                      <span className="text-sm font-bold text-slate-600">Section Visible</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Form Title</label>
                      <input 
                        type="text" 
                        value={data.enquirySection?.title || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          enquirySection: { ...prev.enquirySection, title: e.target.value }
                        }))} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Submit Button Text</label>
                      <input 
                        type="text" 
                        value={data.enquirySection?.submitButtonText || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          enquirySection: { ...prev.enquirySection, submitButtonText: e.target.value }
                        }))} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Form Short Description</label>
                      <textarea 
                        value={data.enquirySection?.description || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          enquirySection: { ...prev.enquirySection, description: e.target.value }
                        }))} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold min-h-[80px]" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Service Dropdown Options (Comma separated list)</label>
                      <input 
                        type="text" 
                        value={Array.isArray(data.enquirySection?.serviceOptions) ? data.enquirySection.serviceOptions.join(", ") : ""} 
                        onChange={e => {
                          const options = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                          setData(prev => ({
                            ...prev,
                            enquirySection: { ...prev.enquirySection, serviceOptions: options }
                          }));
                        }} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
                        placeholder="e.g. Laser Hair Removal, Hair Transplant, Skin Rejuvenation"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Background Color / Custom Style Class (Optional)</label>
                      <input 
                        type="text" 
                        value={data.enquirySection?.backgroundColor || ""} 
                        onChange={e => setData(prev => ({
                          ...prev,
                          enquirySection: { ...prev.enquirySection, backgroundColor: e.target.value }
                        }))} 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
                        placeholder="e.g. bg-[#f9f7f2] or empty for luxury white layout"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!isHairCostEditor && (true || activeTab === 'process') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                 <div className="flex justify-between items-start gap-4 mb-8">
                    <div className="flex-1">
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Section Title</label>
                      <input type="text" value={data.process.sectionTitle || ""} onChange={e => updateSectionField("process", "sectionTitle", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                    </div>
                    {renderSectionVisibilityToggle("process")}
                 </div>
                 <div className="flex justify-between items-center mb-6 border-t border-slate-100 pt-8">
                    <label className="block text-[12px] font-black uppercase text-slate-900 tracking-widest">Process Step Cards</label>
                    <button onClick={() => addArrayItem("process", "processSteps", { stepNumber: `STEP ${(data.process.processSteps?.length || 0) + 1}`, title: "", description: "", image: "" })} className="flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100"><Plus size={14}/> Add Step</button>
                 </div>
                 <div className="space-y-6">
                    {(data.process.processSteps || []).map((step, i) => (
                       <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative group flex gap-4">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                             <input type="text" value={step.stepNumber} onChange={e => updateArrayItem("process", "processSteps", i, "stepNumber", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold" placeholder="STEP 1" />
                             <input type="text" value={step.title} onChange={e => updateArrayItem("process", "processSteps", i, "title", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold" placeholder="Title" />
                             <textarea value={step.description} onChange={e => updateArrayItem("process", "processSteps", i, "description", e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl min-h-[80px] md:col-span-2" placeholder="Description" />
                             <div className="md:col-span-2">
                                <MediaUploader label="Step Image" value={step.image} onChange={val => updateArrayItem("process", "processSteps", i, "image", val)} />
                             </div>
                          </div>
                          <button onClick={() => removeArrayItem("process", "processSteps", i)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
                       </div>
                    ))}
                 </div>
              </div>
            )}

            {/* Ideal Frequency / Suitability */}
            {(true || activeTab === 'idealFrequency') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="md:col-span-2">
                     <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Section Heading</label>
                     <input type="text" value={data.idealFrequency.frequencyTitle || ""} onChange={e => updateSectionField("idealFrequency", "frequencyTitle", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                  </div>
                  {/* Ideal For */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <label className="block text-[10px] font-black uppercase text-green-600 mb-4 tracking-widest">Ideal For Points</label>
                    <div className="space-y-3 mb-4">
                      {(data.idealFrequency.idealForPoints || []).map((pt, i) => (
                        <div key={i} className="flex gap-2">
                          <input type="text" value={pt} onChange={e => updateArrayItem("idealFrequency", "idealForPoints", i, null, e.target.value)} className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm" />
                          <button onClick={() => removeArrayItem("idealFrequency", "idealForPoints", i)} className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => addArrayItem("idealFrequency", "idealForPoints", "")} className="text-green-600 text-xs font-bold flex items-center gap-1 bg-green-50 px-3 py-2 rounded-xl"><Plus size={14}/> Add Point</button>
                  </div>
                  {/* Not Ideal For */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <label className="block text-[10px] font-black uppercase text-red-500 mb-4 tracking-widest">NOT Ideal For Points</label>
                    <div className="space-y-3 mb-4">
                      {(data.idealFrequency.notIdealForPoints || []).map((pt, i) => (
                        <div key={i} className="flex gap-2">
                          <input type="text" value={pt} onChange={e => updateArrayItem("idealFrequency", "notIdealForPoints", i, null, e.target.value)} className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm" />
                          <button onClick={() => removeArrayItem("idealFrequency", "notIdealForPoints", i)} className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => addArrayItem("idealFrequency", "notIdealForPoints", "")} className="text-red-500 text-xs font-bold flex items-center gap-1 bg-red-50 px-3 py-2 rounded-xl"><Plus size={14}/> Add Point</button>
                  </div>
                </div>
              </div>
            )}

            {(true || activeTab === 'faqEnquiry') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><HelpCircle size={18} className="text-blue-500"/> FAQ & Consultation Left Content</h3>
                    <p className="text-xs text-slate-400 mt-1">Edit the left-side heading and timing text shown beside the enquiry form.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Left Heading</label>
                    <input
                      type="text"
                      value={data.faqEnquiry?.faqTitle || ""}
                      onChange={e => setData(prev => ({
                        ...prev,
                        faqEnquiry: { ...(prev.faqEnquiry || {}), faqTitle: e.target.value }
                      }))}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold"
                      placeholder="REQUEST A CONSULTATION"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Button Text</label>
                    <input
                      type="text"
                      value={data.faqEnquiry?.buttonText || ""}
                      onChange={e => setData(prev => ({
                        ...prev,
                        faqEnquiry: { ...(prev.faqEnquiry || {}), buttonText: e.target.value }
                      }))}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold"
                      placeholder="Schedule Your Visit"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Left Description / Timings</label>
                    <textarea
                      value={data.faqEnquiry?.faqSubtitle || ""}
                      onChange={e => setData(prev => ({
                        ...prev,
                        faqEnquiry: { ...(prev.faqEnquiry || {}), faqSubtitle: e.target.value }
                      }))}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold min-h-[120px]"
                      placeholder={consultationDescription}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* SEO Settings */}
            {(true || activeTab === 'seo') && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <h3 className="text-lg font-bold mb-6 text-slate-800">SEO & Meta Attributes</h3>
                <div className="grid grid-cols-1 gap-6">
                   <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Meta Title</label>
                      <input type="text" value={data.seo?.metaTitle || ""} onChange={e => updateSectionField("seo", "metaTitle", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Meta Description</label>
                      <textarea value={data.seo?.metaDescription || ""} onChange={e => updateSectionField("seo", "metaDescription", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold min-h-[100px]" />
                   </div>
                </div>
              </div>
            )}

          </div>
        </>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <h2 className="text-xl font-black text-slate-900 mb-1">Create New Service</h2>
            <p className="text-xs text-slate-400 mb-6">Fill in the basics — you can edit everything after.</p>
            <form onSubmit={handleCreateService} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Service Title *</label>
                <input type="text" value={newService.title}
                  onChange={e => setNewService({...newService, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none font-bold text-sm" placeholder="e.g. FUE Hair Transplant" required />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Slug (URL)</label>
                <input type="text" value={newService.slug || ''}
                  onChange={e => setNewService({...newService, slug: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none font-mono text-sm text-slate-500" placeholder="auto-generated from title" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Category</label>
                <select value={newService.category || ''} onChange={e => setNewService({...newService, category: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none text-sm font-bold">
                  <option value="">— Select Category —</option>
                  {categories.map(c => <option key={c.id || c._id} value={c.slug}>{c.categoryName || c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Card Image URL</label>
                <input type="text" value={newService.image || ''}
                  onChange={e => setNewService({...newService, image: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none text-sm" placeholder="Paste Cloudinary/Supabase URL" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Short Description</label>
                <textarea value={newService.shortDescription || ''}
                  onChange={e => setNewService({...newService, shortDescription: e.target.value})}
                  rows={2} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none text-sm resize-none" placeholder="Brief overview shown on the services listing page" />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 bg-slate-100 text-slate-600 px-4 py-3 rounded-xl font-bold text-sm">Cancel</button>
                <button type="submit" disabled={creating} className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  {creating ? "Creating..." : "Create & Edit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unified Gallery Picker Modal */}
      {showGalleryPicker && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] max-w-4xl w-full h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-100">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide">Choose Media from Gallery</h3>
                <p className="text-xs text-slate-400 font-medium">Select an uploaded image or video to inject into this slide</p>
              </div>
              <button 
                onClick={() => { setShowGalleryPicker(false); setActivePickerTarget(null); }} 
                className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-2xl transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex gap-4">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-4 top-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search gallery by title or alt text..."
                  value={gallerySearch}
                  onChange={e => setGallerySearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
                />
              </div>
            </div>

            {/* Media Grid Container */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              {galleryLoading ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400 font-bold">
                  <Loader2 size={36} className="animate-spin text-blue-600 mb-3" />
                  Loading gallery...
                </div>
              ) : (
                (() => {
                  const filteredGallery = galleryItems.filter(item => {
                    const term = gallerySearch.toLowerCase();
                    const titleMatch = (item.title || "").toLowerCase().includes(term);
                    const altMatch = (item.altText || "").toLowerCase().includes(term);
                    return titleMatch || altMatch;
                  });

                  if (filteredGallery.length === 0) {
                    return (
                      <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                        <ImageIcon size={48} className="text-slate-300 mb-4" />
                        <p className="text-slate-500 font-bold text-sm">No media items found</p>
                        <p className="text-xs text-slate-400 mt-1">Try a different search term or upload media in the gallery page.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {filteredGallery.map(item => {
                        const isVid = item.mediaType === 'video';
                        const url = item.imageUrl || item.image || item.url || "";
                        return (
                          <div 
                            key={item._id}
                            onClick={() => handleSelectGalleryItem(item)}
                            className="group relative bg-white border border-slate-100 hover:border-blue-400 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all flex flex-col"
                          >
                            <div className="aspect-[4/3] bg-slate-900 relative overflow-hidden flex items-center justify-center">
                              {isVid ? (
                                <div className="w-full h-full relative">
                                  <video src={url} className="w-full h-full object-cover opacity-80" muted playsInline />
                                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                                    <div className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                      <span style={{ borderStyle: "solid", borderWidth: "5px 0 5px 8px", borderColor: "transparent transparent transparent #000", marginLeft: 2 }} />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <img src={url} alt={item.altText} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              )}
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-black/60 text-white tracking-wider">
                                {isVid ? 'Video' : 'Image'}
                              </span>
                            </div>
                            <div className="p-3 border-t border-slate-50 flex-1 flex flex-col justify-between">
                              <p className="text-xs font-bold text-slate-800 line-clamp-1 truncate">{item.title || "Untitled"}</p>
                              <p className="text-[10px] text-slate-400 italic line-clamp-1 truncate mt-0.5">{item.altText || "No SEO alt text"}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button 
                onClick={() => { setShowGalleryPicker(false); setActivePickerTarget(null); }} 
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
