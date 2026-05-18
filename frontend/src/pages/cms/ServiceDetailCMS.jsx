import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import {
  Save, Loader2, Layout, Type, List, CheckCircle, HelpCircle,
  Image as ImageIcon, Video, Plus, Trash2, RefreshCw, Globe, 
  ArrowUp, ArrowDown, Upload, Film, ExternalLink, Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── Unified Media Item Editor (supports Image + Video) ───────────────────────
function MediaItemEditor({ item, index, onUpdate, onRemove, onPickFromLibrary }) {
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
        <button 
          onClick={onRemove} 
          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={15} />
        </button>
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

export default function ServiceDetailCMS() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [data, setData] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("banner");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newService, setNewService] = useState({ title: "", category: "Laser" });
  const [creating, setCreating] = useState(false);

  // Gallery Picker States
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [gallerySearch, setGallerySearch] = useState("");
  const [activePickerTarget, setActivePickerTarget] = useState(null); // { index: number, field: 'url' | 'thumbnail' }

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

  const handleOpenGalleryPicker = (index, field) => {
    setActivePickerTarget({ index, field });
    fetchGallery();
    setShowGalleryPicker(true);
  };

  const handleSelectGalleryItem = (item) => {
    if (!activePickerTarget) return;
    const { index, field } = activePickerTarget;
    // Set the selected URL
    const url = item.imageUrl || item.image || item.url || "";
    updateArrayItem("intro", "introMedia", index, field, url);
    
    // Auto-fill type and default thumbnail if it's the main URL
    if (field === 'url') {
      const isVid = item.mediaType === 'video';
      updateArrayItem("intro", "introMedia", index, 'type', isVid ? 'video' : 'image');
    }

    setShowGalleryPicker(false);
    setActivePickerTarget(null);
    toast.success("Media selected from gallery!");
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
    fetchServices().then(data => {
      if (data.length > 0) {
        setSelectedSlug(data[0].slug);
      }
      setLoading(false);
    });
  }, []);

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
          if (!fetchedData.benefitsSection) {
            fetchedData.benefitsSection = { heading: "Key Benefits of the Treatment", image: "", altText: "", points: [] };
          } else if (!fetchedData.benefitsSection.points) {
            fetchedData.benefitsSection.points = [];
          }
          if (!fetchedData.idealCandidates) {
            fetchedData.idealCandidates = { sectionHeading: "Ideal Candidates", introText: "", bottomConclusionText: "", sectionImage: "", altText: "", bullets: [] };
          } else if (!fetchedData.idealCandidates.bullets) {
            fetchedData.idealCandidates.bullets = [];
          }
          setData(fetchedData);
        }
      })
      .catch(err => {
        if (err.response?.status === 404) {
          const serviceInfo = services.find(s => s.slug === selectedSlug) || {};
          setData({
            slug: selectedSlug,
            title: serviceInfo.title || "",
            category: serviceInfo.category || "",
            banner: { badgeText: "PREMIUM TREATMENT", title: serviceInfo.title || "", subtitle: "", duration: "45 mins", rating: "4.9", buttonText: "Book Consultation", backgroundImage: "" },
            intro: { badgeText: "ABOUT THE TREATMENT", title: serviceInfo.title || "", rating: "4.9", duration: "45 mins", shortDescription: "", longDescription: "", benefits: [], closingText: "", introMedia: [] },
            process: { sectionTitle: "How it works?", processSteps: [] },
            idealFrequency: { frequencyTitle: "Treatment Frequency & Suitability", frequencyDescription: "", idealForPoints: [], notIdealForPoints: [], ctaTitle: "", ctaDescription: "", ctaButtonText: "", ctaButtonLink: "", ctaImage: "" },
            beforeAfter: { beforeTitle: "Before Treatment Checklist", afterTitle: "Aftercare Instructions", beforePoints: [], afterPoints: [], sectionBackground: "#f9f7f2" },
            faqEnquiry: { faqTitle: "Common Concerns Addressed", faqSubtitle: "", faqItems: [], serviceOptions: [], formTitle: "Enquire About This Treatment", buttonText: "Schedule Your Visit", namePlaceholder: "Name*", emailPlaceholder: "E-Mail Address*", servicePlaceholder: "Type Of Service Enquiry*", datePlaceholder: "Select Date & Time*" },
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
          });
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

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await axios.put(`/service-details/${selectedSlug}`, data);
      toast.success("Service details saved successfully");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!newService.title.trim()) return toast.error("Title is required");
    setCreating(true);
    try {
      const slug = newService.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const res = await axios.post('/service-listing-cards', { title: newService.title, category: newService.category, slug: slug, status: "Published" });
      if (res.data?.success) {
        toast.success("Service created!");
        await fetchServices();
        setIsCreateModalOpen(false);
        setNewService({ title: "", category: "Laser" });
        setSelectedSlug(slug);
      }
    } catch (err) {
      toast.error("Failed to create service");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;

  return (
    <div className="p-8 max-w-6xl mx-auto bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Service CMS</h1>
          <p className="text-sm text-slate-500 font-medium italic">Manage individual service page content</p>
        </div>
        <div className="flex gap-3">
           <button onClick={() => navigate(`/cms/visual-builder/details?service=${selectedSlug}`)} disabled={fetchingDetails || !data} className="flex items-center gap-2 bg-indigo-50 text-indigo-600 border border-indigo-200 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all">
             <Layout size={16} /> Visual Builder
           </button>
           <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 bg-white text-blue-600 border border-blue-200 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all">
             <Plus size={16} /> New Service
           </button>
           <button onClick={handleSave} disabled={saving || fetchingDetails || !data}
             className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-200">
             {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
             {saving ? "Saving..." : "Publish Updates"}
           </button>
        </div>
      </div>

      {/* Service Selector */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <label className="text-[12px] font-black uppercase text-slate-500 tracking-widest min-w-max">Select Service to Edit:</label>
        <select 
          value={selectedSlug} 
          onChange={e => setSelectedSlug(e.target.value)}
          className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none cursor-pointer"
        >
          {services.map(s => (
            <option key={s.slug} value={s.slug}>{s.title} ({s.category})</option>
          ))}
        </select>
      </div>

      {!data || fetchingDetails ? (
         <div className="py-20 text-center text-slate-400 font-medium flex flex-col items-center">
            <RefreshCw className="animate-spin mb-4 text-blue-600" size={32} />
            Loading structure...
         </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 bg-slate-200/50 p-1.5 rounded-[20px] mb-8 w-fit">
            {[
              { id: "banner", label: "Hero & Intro", icon: Layout },
              { id: "contentBlocks", label: "Content Blocks", icon: Type },
              { id: "benefitsSection", label: "Benefits Section", icon: CheckCircle },
              { id: "idealCandidates", label: "Ideal Candidates", icon: Star },
              { id: "process", label: "Process Steps", icon: List },
              { id: "idealFrequency", label: "Suitability & CTA", icon: CheckCircle },
              { id: "beforeAfter", label: "Before/After", icon: RefreshCw },
              { id: "faqEnquiry", label: "FAQs & Options", icon: HelpCircle },
              { id: "footerCta", label: "Footer CTA", icon: Layout },
              { id: "seo", label: "SEO Settings", icon: Globe }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'}`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {activeTab === 'banner' && (
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
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Rating</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      min="0"
                      max="5"
                      value={data.banner.rating ?? 4.9} 
                      onChange={e => updateSectionField("banner", "rating", parseFloat(e.target.value) || 0)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Review Count</label>
                    <input 
                      type="number" 
                      value={data.banner.reviewCount ?? 1250} 
                      onChange={e => updateSectionField("banner", "reviewCount", parseInt(e.target.value, 10) || 0)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10 mt-8">
                <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2"><Type size={18} className="text-blue-500"/> Service Intro Description</h3>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Intro Heading</label>
                      <input type="text" value={data.intro.introHeading || ""} onChange={e => updateSectionField("intro", "introHeading", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Short Description</label>
                      <input type="text" value={data.intro.shortDescription || ""} onChange={e => updateSectionField("intro", "shortDescription", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                    </div>
                  </div>

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

            {activeTab === 'contentBlocks' && (
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
                                <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Description Content (Preserves spacing & paragraph line breaks)</label>
                                <textarea 
                                  value={block.description || ""} 
                                  onChange={e => updateContentBlock(i, "description", e.target.value)} 
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[160px]" 
                                  placeholder="Write informational details... Spacing and paragraph line breaks will be preserved." 
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

            {activeTab === 'benefitsSection' && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><CheckCircle size={18} className="text-blue-500"/> Benefits Section</h3>
                    <p className="text-xs text-slate-400 mt-1">Manage the premium dynamic benefits list and left-side graphic image</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Column: Image and Alt Text */}
                  <div className="space-y-6">
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
                  </div>

                  {/* Right Column: Heading & Repeater List */}
                  <div className="md:col-span-2 space-y-6">
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
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'idealCandidates' && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Star size={18} className="text-blue-500"/> Ideal Candidates Section</h3>
                    <p className="text-xs text-slate-400 mt-1">Manage the premium ideal candidates breakdown, lists, and right-side graphics</p>
                  </div>
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

            {/* Other tabs remain as in stable version */}
            {activeTab === 'process' && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                 <div className="mb-8">
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Section Title</label>
                    <input type="text" value={data.process.sectionTitle || ""} onChange={e => updateSectionField("process", "sectionTitle", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
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
            {activeTab === 'idealFrequency' && (
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
            
            {/* SEO Settings */}
            {activeTab === 'seo' && (
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-black text-slate-900 mb-2">Create New Service</h2>
            <form onSubmit={handleCreateService} className="space-y-4">
              <input type="text" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none font-bold text-sm" placeholder="Service Name" required />
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 bg-slate-100 text-slate-600 px-4 py-3 rounded-xl font-bold text-sm">Cancel</button>
                <button type="submit" disabled={creating} className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold text-sm">
                  {creating ? <Loader2 size={16} className="animate-spin" /> : "Create & Edit"}
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
