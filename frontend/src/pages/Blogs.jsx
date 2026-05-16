import React, { useEffect, useState, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, ArrowLeft, Image as ImageIcon, Search, Eye, Filter, ChevronDown, Check, Globe, X, CheckCircle, ExternalLink, Maximize, Layout } from "lucide-react";
import Loader from "../components/Loader";
import Table from "../components/Table";
import api from "../api/client";
import { getBlogCategories, getGalleryItems, createGalleryItems } from "../api/services";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FRONTEND_URL } from "../utils/config";

// Modules moved inside component for proper handler binding

// Derive the uploads base URL from the API base URL
const getImageUrl = (path) => {
  if (!path) return "https://placehold.co/600x400?text=No+Image";
  if (path.startsWith('http') || path.startsWith('blob:')) return path;
  
  // Try to get base URL from api client or env
  const apiUrl = import.meta.env.VITE_API_URL || 'https://dmctrichology-1.onrender.com/api';
  const base = apiUrl.replace(/\/api$/, '');
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

const FilterDropdown = ({ value, onChange, options, label, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="flex items-center justify-between gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-[12px] text-sm font-semibold text-slate-600 outline-none hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 cursor-pointer min-w-[160px] h-[38px] shadow-sm"
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon size={14} className="text-slate-400 flex-shrink-0" />}
          <span className="truncate">{selected ? selected.label : label}</span>
        </div>
        <ChevronDown 
          size={14} 
          className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 top-full mt-1.5 w-full min-w-[160px] bg-white border border-slate-100 rounded-[12px] shadow-xl z-20 overflow-hidden animate-fade-in">
            <div className="p-1.5 max-h-[200px] overflow-y-auto scrollbar-hide space-y-0.5">
              <button
                onClick={() => {
                  onChange("All");
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  value === "All" 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{label}</span>
                {value === "All" && <Check size={14} />}
              </button>
              {options.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const SidebarDropdown = ({ label, value, onChange, options, name, variant = "vertical" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(opt => opt.value === value);

  if (variant === "horizontal") {
    return (
      <div className="relative flex items-center justify-between w-full p-1.5 px-3.5 bg-slate-50 border border-slate-100 rounded-xl">
        <span className="text-sm font-semibold text-slate-600 truncate mr-2">{label}</span>
        <div className="relative min-w-[120px]">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="w-full flex items-center justify-between gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 outline-none hover:border-slate-300 transition-all duration-200"
          >
            <span className="truncate">{selected ? selected.label : value}</span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)}></div>
              <div className="absolute right-0 top-full mt-1.5 w-40 bg-white border border-slate-100 rounded-xl shadow-2xl z-[70] overflow-hidden animate-fade-in">
                <div className="p-1.5 max-h-[220px] overflow-y-auto scrollbar-hide">
                  {options.map((opt) => {
                    const isSelected = value === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onChange({ target: { name, value: opt.value } });
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                          isSelected ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check size={12} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-[0.8rem] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
          {label}
        </label>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 h-[44px] shadow-sm"
      >
        <span className="truncate">{selected ? selected.label : value}</span>
        <ChevronDown 
          size={16} 
          className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute left-0 top-full mt-1.5 w-full bg-white border border-slate-100 rounded-xl shadow-xl z-20 animate-fade-in">
            <div className="p-1.5 max-h-[220px] overflow-y-auto scrollbar-hide space-y-0.5">
              {options.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange({ target: { name, value: opt.value } });
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const processEditorialHtml = (html) => {
  if (!html) return html;
  
  // Use DOMParser to process the HTML safely
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const links = doc.querySelectorAll('a');
  
  // Professional Link SEO: Auto nofollow for external links
  const internalDomains = [
    'dmctrichology.com',
    'dmctrichology-mkm4.vercel.app',
    'localhost'
  ];

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('http')) {
      const isInternal = internalDomains.some(domain => href.includes(domain));
      if (!isInternal) {
        link.setAttribute('rel', 'nofollow noopener noreferrer');
        // Ensure external links open in new tab for better UX/Editorial
        if (!link.hasAttribute('target')) {
          link.setAttribute('target', '_blank');
        }
      }
    }
  });

  return doc.body.innerHTML;
};

function Blogs() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // 'list' | 'form'
  const [editingId, setEditingId] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSlugManual, setIsSlugManual] = useState(false);
  
  // Table state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const initialFormState = {
    showType: "Inside",
    layoutType: "Left",
    title: "",
    author: "",
    adminDescription: "",
    shortDescription: "",
    fullDescription: "",
    altTag: "",
    tags: "",
    blogDate: new Date().toISOString().split("T")[0],
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    canonicalUrl: "",
    slug: "",
    categoryId: "",
    status: "Published",
    faqs: []
  };

  const [formData, setFormData] = useState(initialFormState);
  const [blogImage, setBlogImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [blogImagePreview, setBlogImagePreview] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [savedRange, setSavedRange] = useState(null);
  const quillRef = useRef(null);

  // Gallery Picker state
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [gallerySearch, setGallerySearch] = useState("");

  // Quill Editor Config
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['blockquote', 'code-block'],
        ['clean']
      ],
      handlers: {
        image: function() {
          if (quillRef.current) {
            const range = quillRef.current.getSelection();
            setSavedRange(range);
            // Open inline Gallery Picker
            fetchGallery();
            setShowGalleryPicker(true);
          }
        }
      }
    }
  }), []);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await getBlogCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Cleanup object URLs to avoid memory leaks
  // Cleanup blob URLs only on unmount or when explicitly replaced
  useEffect(() => {
    return () => {
      if (blogImagePreview && blogImagePreview.startsWith('blob:')) URL.revokeObjectURL(blogImagePreview);
      if (bannerImagePreview && bannerImagePreview.startsWith('blob:')) URL.revokeObjectURL(bannerImagePreview);
    };
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/blogs");
      setItems(data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setBlogImage(null);
    setBannerImage(null);
    setBlogImagePreview(null);
    setBannerImagePreview(null);
    setEditingId(null);
    setIsSlugManual(false);
    setView("form");
  };

  const handleEdit = (item) => {
    setFormData({
      showType: item.showType || "Inside",
      layoutType: item.layoutType || "Left",
      title: item.title || "",
      author: item.author || "",
      adminDescription: item.adminDescription || "",
      shortDescription: item.shortDescription || "",
      fullDescription: item.fullDescription || "",
      altTag: item.altTag || "",
      tags: item.tags ? (Array.isArray(item.tags) ? item.tags.join(", ") : item.tags) : "",
      blogDate: item.blogDate ? new Date(item.blogDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      metaTitle: item.metaTitle || "",
      metaKeywords: item.metaKeywords || "",
      metaDescription: item.metaDescription || "",
      canonicalUrl: item.canonicalUrl || "",
      slug: item.slug || "",
      categoryId: item.categoryId || "",
      status: item.status || "Published",
      faqs: Array.isArray(item.faqs) ? item.faqs : []
    });
    
    setBlogImage(null);
    setBannerImage(null);
    setBlogImagePreview(item.blogImage ? getImageUrl(item.blogImage) : null);
    setBannerImagePreview(item.bannerImage ? getImageUrl(item.bannerImage) : null);
    
    setEditingId(item._id);
    setIsSlugManual(true);
    setView("form");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete blog");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "title" && !isSlugManual) {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value,
        slug: slugify(value)
      }));
    } else if (name === "slug") {
      setFormData((prev) => ({ ...prev, [name]: slugify(value) }));
      setIsSlugManual(true);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };


  const handleQuillChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }]
    }));
  };

  const handleRemoveFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index][field] = value;
    setFormData(prev => ({ ...prev, faqs: updatedFaqs }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      const url = URL.createObjectURL(file);
      
      if (type === 'blog') {
        // Revoke old blob if exists
        if (blogImagePreview && blogImagePreview.startsWith('blob:')) URL.revokeObjectURL(blogImagePreview);
        setBlogImage(file);
        setBlogImagePreview(url);
      } else {
        // Revoke old blob if exists
        if (bannerImagePreview && bannerImagePreview.startsWith('blob:')) URL.revokeObjectURL(bannerImagePreview);
        setBannerImage(file);
        setBannerImagePreview(url);
      }
    }
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const upData = new FormData();
    upData.append("image", file);
    upData.append("title", file.name.split('.')[0]);
    upData.append("status", "Active");

    try {
      setGalleryLoading(true);
      await createGalleryItems(upData);
      toast.success("Image uploaded to library");
      fetchGallery();
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setGalleryLoading(false);
    }
  };

  const fetchGallery = async () => {
    setGalleryLoading(true);
    try {
      const res = await getGalleryItems({ page: 1, limit: 100 });
      setGalleryItems(res.data || []);
    } catch (e) {
      toast.error("Failed to fetch gallery");
    } finally {
      setGalleryLoading(false);
    }
  };

  const selectGalleryImage = (item) => {
    if (!quillRef.current) return;

    const base = (import.meta.env.VITE_API_URL || "https://dmctrichology-1.onrender.com/api").replace(/\/api$/, "");
    const normalizedPath = item.image.startsWith("/") ? item.image : `/${item.image}`;
    const fullUrl = item.image.startsWith("http") ? item.image : `${base}${normalizedPath}`;

    // Semantic HTML Figure for WordPress-style insertion
    const alt = item.altText || item.title || "";
    const title = item.title || "";
    const caption = item.description || "";
    
    const figureHtml = `
      <figure class="wp-block-image size-full">
        <img src="${fullUrl}" alt="${alt}" title="${title}" style="width: 100%; border-radius: 12px;" />
        ${caption ? `<figcaption style="text-align: center; font-size: 0.875rem; color: #64748B; margin-top: 0.5rem;">${caption}</figcaption>` : ''}
      </figure><p></p>
    `;

    // Insert at saved cursor position
    const range = savedRange || { index: quillRef.current.getLength(), length: 0 };
    quillRef.current.clipboard.dangerouslyPasteHTML(range.index, figureHtml);
    
    setShowGalleryPicker(false);
    setSavedRange(null);
    toast.success("Image inserted at cursor position");
  };

  // Click to Edit Image Logic (Double Click)
  const handleEditorDoubleClick = (e) => {
    if (e.target.tagName === 'IMG') {
      // Save current image context and open drawer for replacement
      const range = quillRef.current ? quillRef.current.getSelection() : null;
      setSavedRange(range || { index: 0, length: 0 });
      fetchGallery();
      setShowGalleryPicker(true);
      toast("Select a new image to replace", { icon: '🔄' });
    }
  };

  const handleSubmit = async (e, saveAsDraft = false) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.fullDescription || !formData.author) {
      toast.error("Please fill in all required fields (Title, Author, Full Description)");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const formPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'status' && saveAsDraft) {
          formPayload.append('status', 'Draft');
        } else if (key === 'faqs') {
          formPayload.append('faqs', JSON.stringify(formData[key]));
        } else if (key === 'fullDescription' || key === 'shortDescription' || key === 'adminDescription') {
          // Process HTML for SEO (nofollow, etc)
          formPayload.append(key, processEditorialHtml(formData[key]));
        } else {
          formPayload.append(key, formData[key]);
        }
      });
      
      if (blogImage) formPayload.append("blogImage", blogImage);
      if (bannerImage) formPayload.append("bannerImage", bannerImage);

      if (editingId) {
        await api.put(`/blogs/${editingId}`, formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(saveAsDraft ? "Draft saved successfully" : "Blog updated successfully");
      } else {
        const response = await api.post("/blogs", formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        // Update editing ID so further saves become updates
        const newBlog = response.data?.data;
        if (newBlog?._id || newBlog?.id) {
          setEditingId(newBlog._id || newBlog.id);
          setIsSlugManual(true);
        }
        
        toast.success(saveAsDraft ? "Draft created successfully" : "Blog published successfully");
      }
      
      // Removed setView("list") to stay on the same page as requested
      fetchBlogs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Table filtering and pagination
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return <Loader label="Loading blogs..." />;
  }

  if (view === "form") {
    return (
      <>
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", paddingBottom: "3rem" }}>
        {/* Preview Modal */}
        {showPreviewModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", padding: "1rem" }}>
            <div style={{ background: "#FFFFFF", width: "100%", maxWidth: "900px", maxHeight: "90vh", borderRadius: "16px", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}>
              <div style={{ position: "sticky", top: 0, background: "rgba(255,255,255,0.95)", padding: "1rem 1.5rem", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>Preview: {formData.title || "Untitled Blog"}</h2>
                <button onClick={() => setShowPreviewModal(false)} className="btn-primary">Close Preview</button>
              </div>
              <div style={{ padding: "2rem" }}>
                {bannerImagePreview && <img src={bannerImagePreview} alt="Banner" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "12px", marginBottom: "1.5rem" }} />}
                <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0F172A", marginBottom: "1rem" }}>{formData.title}</h1>
                <div style={{ display: "flex", gap: "1rem", color: "#64748B", marginBottom: "2rem", fontSize: "0.875rem" }}>
                  <span>By {formData.author}</span><span>•</span>
                  <span>{new Date(formData.blogDate).toLocaleDateString()}</span>
                </div>
                {blogImagePreview && <img src={blogImagePreview} alt={formData.altTag} style={{ float: "left", width: "33%", borderRadius: "12px", marginRight: "1.5rem", marginBottom: "1rem" }} />}
                <div className="prose" dangerouslySetInnerHTML={{ __html: formData.fullDescription }} />
              </div>
            </div>
          </div>
        )}

        {/* Top Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => setView("list")}
              style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#FFFFFF", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#475569" }}
            >
              <ArrowLeft size={18} />
            </button>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>
              {editingId ? "Edit Blog" : "Add New Blog"}
            </h2>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button 
              type="button" 
              onClick={() => {
                if (formData.slug) {
                  window.open(`${FRONTEND_URL}/blog/${formData.slug}`, '_blank');
                } else {
                  toast.error("Please enter a title or slug first");
                }
              }} 
              className="btn-secondary"
            >
              <Eye size={15} /> Preview
            </button>
            <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={submitting}
              style={{ padding: "0.5rem 1.25rem", borderRadius: "8px", border: "1px solid #2563EB", background: "#EFF6FF", color: "#2563EB", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}>
              Save as Draft
            </button>
            <button onClick={(e) => handleSubmit(e, false)} disabled={submitting} className="btn-primary">
              {submitting ? "Saving..." : editingId ? "Update & Publish" : "Publish Blog"}
            </button>
          </div>
        </div>

        {/* WordPress-style 2-column layout */}
        <form style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "start" }}>

          {/* ── LEFT PANEL (main content) ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Blog Title */}
            <div className="card-glass" style={{ padding: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.625rem" }}>
                Blog Title <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter your blog title here..."
                className="form-input"
                required
                style={{ fontSize: "1.125rem", fontWeight: 600, padding: "0.75rem 1rem" }}
              />
              
              {/* URL Preview */}
              <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", background: "#F8FAFC", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                <Globe size={14} className="text-slate-400" />
                <span style={{ fontSize: "0.8rem", color: "#64748B" }}>Permalink:</span>
                <span style={{ fontSize: "0.8rem", color: "#2563EB", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {FRONTEND_URL}/blog/{formData.slug || "..."}
                </span>
                {!isSlugManual && formData.title && (
                  <button 
                    type="button" 
                    onClick={() => setIsSlugManual(true)}
                    style={{ fontSize: "0.7rem", color: "#94A3B8", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", marginLeft: "auto" }}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            {/* Slug Editor (if manual or requested) */}
            {(isSlugManual || !formData.title) && (
              <div className="card-glass" style={{ padding: "1rem 1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
                  URL Slug
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="blog-url-slug"
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  {isSlugManual && formData.title && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsSlugManual(false);
                        setFormData(prev => ({ ...prev, slug: slugify(prev.title) }));
                      }}
                      className="btn-secondary"
                      style={{ padding: "0 1rem", height: "42px" }}
                    >
                      Reset to Auto
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Author + Date row */}
            <div className="card-glass" style={{ padding: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.875rem" }}>
                Author &amp; Date
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Author Name <span style={{ color: "#EF4444" }}>*</span></label>
                  <input type="text" name="author" value={formData.author} onChange={handleChange} className="form-input" required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Blog Date</label>
                  <input type="date" name="blogDate" value={formData.blogDate} onChange={handleChange} className="form-input" />
                </div>
              </div>
            </div>

            {/* Full Description */}
            <div className="card-glass" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.625rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                  Full Description <span style={{ color: "#EF4444" }}>*</span>
                </label>
              </div>
              <div style={{ background: "#FFFFFF", borderRadius: "12px", overflow: "hidden", border: "1px solid #E2E8F0" }} onDoubleClick={handleEditorDoubleClick}>
                <ReactQuill 
                  ref={(el) => { if (el) quillRef.current = el.getEditor(); }}
                  theme="snow"
                  value={formData.fullDescription}
                  onChange={(val) => handleQuillChange("fullDescription", val)}
                  modules={modules}
                  placeholder="Start writing your editorial masterpiece..."
                  style={{ height: "500px", border: "none" }}
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="card-glass" style={{ padding: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
                Blog Short Description
              </label>
              <div style={{ background: "#FFFFFF", borderRadius: "10px", overflow: "hidden", border: "1px solid #E2E8F0" }}>
                <ReactQuill theme="snow" modules={modules} value={formData.shortDescription} onChange={(val) => handleQuillChange('shortDescription', val)} style={{ minHeight: "160px" }} />
              </div>
            </div>

            {/* Admin Description */}
            <div className="card-glass" style={{ padding: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
                Admin Description
              </label>
              <div style={{ background: "#FFFFFF", borderRadius: "10px", overflow: "hidden", border: "1px solid #E2E8F0" }}>
                <ReactQuill theme="snow" modules={modules} value={formData.adminDescription} onChange={(val) => handleQuillChange('adminDescription', val)} style={{ minHeight: "160px" }} />
              </div>
            </div>

            {/* BLOG FAQS - PREMIUM CMS UI */}
            <div className="card-glass" style={{ padding: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                    Blog FAQs
                  </label>
                  <p style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.25rem" }}>Add frequently asked questions to this blog for better SEO and engagement.</p>
                </div>
                <button 
                  type="button" 
                  onClick={handleAddFaq}
                  className="btn-primary"
                  style={{ padding: "0.5rem 1.25rem", fontSize: "0.75rem", borderRadius: "10px", display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <Plus size={16} /> Add New FAQ
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {formData.faqs.map((faq, idx) => (
                  <div key={idx} style={{ padding: "1.5rem", background: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", position: "relative", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                    <div style={{ position: "absolute", top: "1.25rem", left: "1.5rem", width: "28px", height: "28px", borderRadius: "8px", background: "#F1F5F9", color: "#64748B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>
                      #{idx + 1}
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={() => handleRemoveFaq(idx)}
                      style={{ position: "absolute", top: "1.25rem", right: "1.5rem", color: "#EF4444", background: "#FEF2F2", border: "1px solid #FECACA", width: "32px", height: "32px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={(e) => e.target.style.background = "#FEE2E2"}
                      onMouseLeave={(e) => e.target.style.background = "#FEF2F2"}
                      title="Remove FAQ"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1rem" }}>
                      <div style={{ marginLeft: "3rem" }}>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>Question</label>
                        <input 
                          type="text" 
                          value={faq.question} 
                          onChange={(e) => handleFaqChange(idx, 'question', e.target.value)} 
                          placeholder="e.g., How many sessions are required for PRP?"
                          className="form-input" 
                          style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                        />
                      </div>
                      <div style={{ marginLeft: "3rem" }}>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>Answer</label>
                        <textarea 
                          value={faq.answer} 
                          onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)} 
                          placeholder="Enter the detailed answer here..."
                          rows="4"
                          className="form-input" 
                          style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", resize: "vertical" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {formData.faqs.length === 0 && (
                  <div style={{ textAlign: "center", padding: "4rem 2rem", border: "2px dashed #E2E8F0", borderRadius: "24px", background: "#F8FAFC" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                      <Plus size={24} color="#94A3B8" />
                    </div>
                    <h4 style={{ fontSize: "1rem", color: "#1E293B", marginBottom: "0.5rem" }}>No FAQs Created Yet</h4>
                    <p style={{ fontSize: "0.875rem", color: "#64748B", maxWidth: "300px", margin: "0 auto 1.5rem" }}>Add FAQs to help your readers find answers quickly and improve your search ranking.</p>
                    <button 
                      type="button" 
                      onClick={handleAddFaq}
                      className="btn-primary"
                      style={{ padding: "0.6rem 1.5rem", fontSize: "0.8rem", borderRadius: "10px" }}
                    >
                      Start Adding FAQs
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", position: "sticky", top: "80px" }}>

            {/* Publishing */}
            <div className="card-glass" style={{ padding: "1.25rem" }}>
              <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 1rem 0" }}>Publishing</h3>
              <SidebarDropdown
                variant="horizontal"
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { label: "Published", value: "Published" },
                  { label: "Draft", value: "Draft" }
                ]}
              />
            </div>

            {/* Media */}
            <div className="card-glass" style={{ padding: "1.25rem" }}>
              <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 1rem 0" }}>Media</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.5rem" }}>Blog Image</label>
                  <div style={{ position: "relative", overflow: "hidden", borderRadius: "10px", border: "2px dashed #CBD5E1", background: "#F8FAFC", display: "flex", justifyContent: "center", alignItems: "center", height: "130px", cursor: "pointer" }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileChange(e, 'blog')} 
                      style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }} 
                    />
                    {blogImagePreview ? (
                      <img src={blogImagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#94A3B8" }}>
                        <ImageIcon size={26} style={{ marginBottom: "0.375rem" }} />
                        <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>Click to upload</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.5rem" }}>Banner Image</label>
                  <div style={{ position: "relative", overflow: "hidden", borderRadius: "10px", border: "2px dashed #CBD5E1", background: "#F8FAFC", display: "flex", justifyContent: "center", alignItems: "center", height: "90px", cursor: "pointer" }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileChange(e, 'banner')} 
                      style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }} 
                    />
                    {bannerImagePreview ? (
                      <img src={bannerImagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#94A3B8" }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>Upload Banner</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Image Alt Tag</label>
                  <input type="text" name="altTag" value={formData.altTag} onChange={handleChange} className="form-input" />
                </div>
              </div>
            </div>

            {/* SEO & Taxonomy */}
            <div className="card-glass" style={{ padding: "1.25rem" }}>
              <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 1rem 0" }}>SEO &amp; Taxonomy</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Tags <span style={{ color: "#94A3B8", fontWeight: 400 }}>(comma separated)</span></label>
                  <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="hair loss, transplant" className="form-input" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Title Tag</label>
                  <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Meta Keywords</label>
                  <textarea name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} rows="2" className="form-input" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Meta Description</label>
                  <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows="3" className="form-input" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Canonical URL</label>
                  <input type="text" name="canonicalUrl" value={formData.canonicalUrl} onChange={handleChange} className="form-input" />
                </div>

                {/* Category Selection */}
                <SidebarDropdown
                  label="Category"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  options={[
                    { label: "Uncategorized", value: "" },
                    ...categories.map(cat => ({ label: cat.name, value: cat._id }))
                  ]}
                />

                {/* Show Type & Layout Type */}
                <SidebarDropdown
                  label="Show Type"
                  name="showType"
                  value={formData.showType}
                  onChange={handleChange}
                  options={[
                    { label: "Inside", value: "Inside" },
                    { label: "Outside", value: "Outside" }
                  ]}
                />
                <SidebarDropdown
                  label="Layout Type"
                  name="layoutType"
                  value={formData.layoutType}
                  onChange={handleChange}
                  options={[
                    { label: "Left", value: "Left" },
                    { label: "Right", value: "Right" }
                  ]}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
        {/* Inline Gallery Picker Drawer - Professional Editorial Flow */}
        {showGalleryPicker && (
          <>
            {/* Backdrop for focus */}
            <div 
              onClick={() => setShowGalleryPicker(false)}
              className="animate-fade-in"
              style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)", cursor: "pointer" }} 
            />
            
            {/* Right Drawer */}
            <div 
              className="animate-in slide-in-from-right duration-300" 
              style={{ 
                position: "fixed", 
                top: 0, 
                right: 0, 
                bottom: 0, 
                width: "550px", 
                zIndex: 1001, 
                background: "#F8FAFC", 
                display: "flex", 
                flexDirection: "column",
                boxShadow: "-20px 0 50px rgba(0,0,0,0.15)",
                borderLeft: "1px solid #E2E8F0"
              }}
            >
              {/* Drawer Header */}
              <div style={{ padding: "1.5rem 2rem", background: "#FFF", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>Media Library</h2>
                  <p style={{ fontSize: "0.8rem", color: "#64748B", margin: 0 }}>Select or upload an asset</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowGalleryPicker(false)} 
                  style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #E2E8F0", background: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B" }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Action Bar */}
              <div style={{ padding: "1rem 2rem", background: "#FFF", borderBottom: "1px solid #F1F5F9", display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <Search size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                  <input 
                    type="text" 
                    placeholder="Search library..." 
                    className="form-input" 
                    style={{ paddingLeft: "2.5rem", borderRadius: "10px", height: "40px", fontSize: "0.875rem" }}
                    value={gallerySearch}
                    onChange={(e) => setGallerySearch(e.target.value)}
                  />
                </div>
                <div style={{ position: "relative" }}>
                  <input type="file" accept="image/*" onChange={handleGalleryUpload} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }} />
                  <button type="button" className="btn-primary" style={{ height: "40px", padding: "0 1rem", fontSize: "0.875rem", borderRadius: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Plus size={16} /> Upload New
                  </button>
                </div>
              </div>

              {/* Grid Content */}
              <div style={{ flex: 1, padding: "1.5rem 2rem", overflowY: "auto" }}>
                {galleryLoading ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "30vh", gap: "1rem" }}>
                    <Loader />
                    <p style={{ fontSize: "0.875rem", color: "#64748B" }}>Accessing library...</p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1rem" }}>
                    {galleryItems.filter(item => (item.title || "").toLowerCase().includes(gallerySearch.toLowerCase())).map((item) => (
                      <div 
                        key={item._id} 
                        onClick={() => selectGalleryImage(item)}
                        style={{ 
                          background: "#FFF", 
                          borderRadius: "12px", 
                          border: "1px solid #E2E8F0", 
                          overflow: "hidden", 
                          cursor: "pointer", 
                          transition: "all 0.2s" 
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = "#2563EB";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.1)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = "#E2E8F0";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div style={{ aspectRatio: "1/1", overflow: "hidden" }}>
                          <img 
                            src={item.image.startsWith('http') ? item.image : `${(import.meta.env.VITE_API_URL || "https://dmctrichology-1.onrender.com/api").replace(/\/api$/, "")}${item.image.startsWith('/') ? '' : '/'}${item.image}`} 
                            alt={item.title} 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                          />
                        </div>
                        <div style={{ padding: "0.5rem" }}>
                          <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#1E293B", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.title || "Untitled"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Information */}
              <div style={{ padding: "1rem 2rem", background: "#FFF", borderTop: "1px solid #E2E8F0", fontSize: "0.75rem", color: "#94A3B8" }}>
                Tip: Images are inserted exactly at your cursor position. Double-click any image in the editor to replace it.
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Search and Filters */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>Blogs</h2>
        <button onClick={handleAddNew} className="btn-primary">
          <Plus size={18} /> Create New Blog
        </button>
      </div>

      {/* Filters + Table card */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
            <Search style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} size={16} />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "2.25rem", paddingRight: "0.875rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", fontSize: "0.875rem", width: "100%" }}
            />
          </div>
          <FilterDropdown
            label="All Statuses"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: "Published", value: "Published" },
              { label: "Draft", value: "Draft" },
            ]}
            icon={Filter}
          />
        </div>

        <Table columns={[
          { key: "image", label: "Image" },
          { key: "title", label: "Title" },
          { key: "author", label: "Author" },
          { key: "category", label: "Category" },
          { key: "date", label: "Date" },
          { key: "status", label: "Status" },
          { key: "actions", label: "Actions", align: "right" },
        ]}>
          {currentItems.map((item) => (
            <tr key={item._id} style={{ borderBottom: "1px solid #F1F5F9" }}>
              <td style={{ padding: "0.875rem 1.25rem" }}>
                {item.blogImage ? (
                  <div style={{ width: "40px", height: "40px", borderRadius: "8px", overflow: "hidden", background: "#F1F5F9" }}>
                    <img 
                      src={getImageUrl(item.blogImage)} 
                      alt={item.altTag || "blog"} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => { e.target.src = "https://placehold.co/40x40?text=Blog"; }}
                    />
                  </div>
                ) : (
                  <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>
                    <ImageIcon size={18} />
                  </div>
                )}
              </td>
              <td style={{ padding: "0.875rem 1.25rem", fontWeight: 600, color: "#0F172A", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.title}>
                {item.title}
              </td>
              <td style={{ padding: "0.875rem 1.25rem", color: "#475569", fontSize: "0.875rem" }}>{item.author}</td>
              <td style={{ padding: "0.875rem 1.25rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "0.25rem 0.625rem", borderRadius: "20px", background: "#F1F5F9", color: "#475569" }}>
                  {item.category?.name || "Uncategorized"}
                </span>
              </td>
              <td style={{ padding: "0.875rem 1.25rem", color: "#475569", whiteSpace: "nowrap", fontSize: "0.875rem" }}>
                {item.blogDate ? new Date(item.blogDate).toLocaleDateString() : "—"}
              </td>
              <td style={{ padding: "0.875rem 1.25rem" }}>
                <span style={{ padding: "0.2rem 0.6rem", borderRadius: "9999px", fontSize: "0.7rem", fontWeight: 700, background: item.status === "Published" ? "#D1FAE5" : "#FEF3C7", color: item.status === "Published" ? "#065F46" : "#92400E" }}>
                  {item.status || "Published"}
                </span>
              </td>
              <td style={{ padding: "0.875rem 1.25rem", textAlign: "right" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                  <a href={`${FRONTEND_URL}/blog/${item.slug}`} target="_blank" rel="noreferrer" title="View Blog"
                    style={{ padding: "0.375rem", borderRadius: "6px", background: "#F0F9FF", border: "1px solid #BAE6FD", cursor: "pointer", color: "#0284C7", display: "flex" }}>
                    <Eye size={15} />
                  </a>
                  <button onClick={() => handleEdit(item)} title="Edit"
                    style={{ padding: "0.375rem", borderRadius: "6px", background: "#FFFFFF", border: "1px solid #E2E8F0", cursor: "pointer", color: "#475569", display: "flex" }}>
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => handleDelete(item._id)} title="Delete"
                    style={{ padding: "0.375rem", borderRadius: "6px", background: "#FEF2F2", border: "1px solid #FECACA", cursor: "pointer", color: "#DC2626", display: "flex" }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {currentItems.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#94A3B8", fontSize: "0.875rem" }}>
                No blogs found matching your criteria.
              </td>
            </tr>
          )}
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.875rem", color: "#64748B" }}>
              Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length}
            </span>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)}
                  style={{ width: "32px", height: "32px", borderRadius: "6px", border: "1px solid", borderColor: currentPage === i + 1 ? "#2563EB" : "#E2E8F0", background: currentPage === i + 1 ? "#2563EB" : "#FFFFFF", color: currentPage === i + 1 ? "#FFFFFF" : "#475569", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Blogs;




