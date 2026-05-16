import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, ArrowLeft, Image as ImageIcon, Search, Eye, Filter, ChevronDown, Check, Globe, X, CheckCircle, ExternalLink, Maximize, Layout } from "lucide-react";
import Loader from "../components/Loader";
import Table from "../components/Table";
import api from "../api/client";
import { getBlogCategories, getGalleryItems } from "../api/services";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FRONTEND_URL } from "../utils/config";

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['blockquote', 'code-block'],
    ['clean']
  ],
};

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

  // Media SEO Modal state
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [gallerySearch, setGallerySearch] = useState("");

  const [mediaData, setMediaData] = useState({
    url: "",
    alt: "",
    title: "",
    link: "",
    newTab: true,
    caption: "",
    width: "100%"
  });

  // Table Modal state
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tableData, setTableData] = useState({
    rows: 3,
    cols: 3,
    hasHeader: true
  });

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

  const handleOpenMediaModal = () => {
    fetchGallery();
    setMediaModalOpen(true);
  };

  const selectGalleryImage = (item) => {
    // Correct URL construction similar to Gallery.jsx
    const base = (import.meta.env.VITE_API_URL || "https://dmctrichology-1.onrender.com/api").replace(/\/api$/, "");
    const normalizedPath = item.image.startsWith("/") ? item.image : `/${item.image}`;
    const fullUrl = item.image.startsWith("http") ? item.image : `${base}${normalizedPath}`;

    setMediaData({
      ...mediaData,
      url: fullUrl,
      alt: item.altText || item.title || "",
      title: item.title || "",
      caption: item.description || ""
    });
    setGalleryModalOpen(false);
    toast.success("Image selected from gallery");
  };

  const handleInsertMedia = () => {
    if (!mediaData.url) {
      toast.error("Image URL is required");
      return;
    }

    // Construct professional semantic HTML
    let imgHtml = `<img src="${mediaData.url}" alt="${mediaData.alt}" title="${mediaData.title}" style="width: ${mediaData.width}; border-radius: 12px;" />`;
    
    let contentHtml = imgHtml;
    if (mediaData.link) {
      const isExternal = !mediaData.link.includes('dmctrichology.com') && mediaData.link.startsWith('http');
      const target = mediaData.newTab ? ' target="_blank"' : '';
      const rel = isExternal ? ' rel="nofollow noopener noreferrer"' : (mediaData.newTab ? ' rel="noopener noreferrer"' : '');
      contentHtml = `<a href="${mediaData.link}"${target}${rel}>${imgHtml}</a>`;
    }

    let figureHtml = `<figure class="wp-block-image size-full">${contentHtml}`;
    if (mediaData.caption) {
      figureHtml += `<figcaption style="text-align: center; font-size: 0.875rem; color: #64748B; margin-top: 0.5rem;">${mediaData.caption}</figcaption>`;
    }
    figureHtml += `</figure><p></p>`;

    setFormData(prev => ({
      ...prev,
      fullDescription: prev.fullDescription + figureHtml
    }));
    
    setMediaModalOpen(false);
    setMediaData({ url: "", alt: "", title: "", link: "", newTab: true, caption: "", width: "100%" });
    toast.success("Media inserted successfully");
  };

  const handleInsertTable = () => {
    const { rows, cols, hasHeader } = tableData;
    let html = '<div class="table-responsive"><table>';
    
    if (hasHeader) {
      html += '<thead><tr>';
      for (let j = 0; j < cols; j++) {
        html += `<th>Header ${j + 1}</th>`;
      }
      html += '</tr></thead>';
    }
    
    html += '<tbody>';
    for (let i = 0; i < rows; i++) {
      html += '<tr>';
      for (let j = 0; j < cols; j++) {
        html += `<td>Data Cell</td>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table></div><p></p>';

    setFormData(prev => ({
      ...prev,
      fullDescription: prev.fullDescription + html
    }));
    
    setTableModalOpen(false);
    toast.success("Table structure inserted");
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
                <div style={{ display: "flex", gap: "10px" }}>
                  <button 
                    type="button"
                    onClick={() => setTableModalOpen(true)}
                    style={{ padding: "0.3rem 0.75rem", borderRadius: "6px", background: "#10B981", color: "#FFF", fontSize: "0.75rem", fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    <Globe size={14} /> Insert Table
                  </button>
                  <button 
                    type="button"
                    onClick={handleOpenMediaModal}
                    style={{ padding: "0.3rem 0.75rem", borderRadius: "6px", background: "#2563EB", color: "#FFF", fontSize: "0.75rem", fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    <ImageIcon size={14} /> SEO Media
                  </button>
                </div>
              </div>
              <div style={{ background: "#FFFFFF", borderRadius: "12px", overflow: "hidden", border: "1px solid #E2E8F0" }}>
                <ReactQuill 
                  theme="snow"
                  value={formData.fullDescription}
                  onChange={(val) => handleQuillChange("fullDescription", val)}
                  modules={modules}
                  style={{ height: "450px" }}
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
        {/* Table Generator Modal */}
        {tableModalOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: "1rem" }}>
            <div className="animate-in fade-in zoom-in duration-200" style={{ background: "#FFFFFF", width: "100%", maxWidth: "400px", borderRadius: "24px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
              <div style={{ padding: "1.5rem", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>Table Generator</h3>
                <button onClick={() => setTableModalOpen(false)} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer" }}><X size={20} /></button>
              </div>
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748B", marginBottom: "0.5rem", textTransform: "uppercase" }}>Rows</label>
                    <input type="number" value={tableData.rows} onChange={(e) => setTableData({...tableData, rows: parseInt(e.target.value)})} className="form-input" min="1" max="20" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748B", marginBottom: "0.5rem", textTransform: "uppercase" }}>Columns</label>
                    <input type="number" value={tableData.cols} onChange={(e) => setTableData({...tableData, cols: parseInt(e.target.value)})} className="form-input" min="1" max="10" />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <input type="checkbox" id="hasHeader" checked={tableData.hasHeader} onChange={(e) => setTableData({...tableData, hasHeader: e.target.checked})} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                  <label htmlFor="hasHeader" style={{ fontSize: "0.875rem", color: "#475569", cursor: "pointer" }}>Include Header Row</label>
                </div>
              </div>
              <div style={{ padding: "1.25rem 1.5rem", background: "#F8FAFC", borderTop: "1px solid #F1F5F9", display: "flex", gap: "1rem" }}>
                <button onClick={() => setTableModalOpen(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button onClick={handleInsertTable} className="btn-primary" style={{ flex: 1 }}>Insert Table</button>
              </div>
            </div>
          </div>
        )}

        {/* Table Generator Modal */}
        {tableModalOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(8px)", padding: "1.5rem" }}>
            <div className="animate-in fade-in zoom-in duration-200" style={{ background: "#FFFFFF", width: "100%", maxWidth: "420px", borderRadius: "24px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)" }}>
              <div style={{ padding: "1.5rem", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F8FAFC" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669" }}>
                    <Layout size={20} />
                  </div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>Table Generator</h3>
                </div>
                <button onClick={() => setTableModalOpen(false)} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#FFF", border: "1px solid #E2E8F0", color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
              </div>
              <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748B", marginBottom: "0.625rem", textTransform: "uppercase" }}>Rows</label>
                    <input type="number" value={tableData.rows} onChange={(e) => setTableData({...tableData, rows: parseInt(e.target.value)})} className="form-input" min="1" max="50" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748B", marginBottom: "0.625rem", textTransform: "uppercase" }}>Columns</label>
                    <input type="number" value={tableData.cols} onChange={(e) => setTableData({...tableData, cols: parseInt(e.target.value)})} className="form-input" min="1" max="15" />
                  </div>
                </div>
                <div onClick={() => setTableData({...tableData, hasHeader: !tableData.hasHeader})} style={{ display: "flex", alignItems: "center", gap: "0.875rem", cursor: "pointer", padding: "1rem", background: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: tableData.hasHeader ? "#10B981" : "#FFF", border: "2px solid #10B981", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                    {tableData.hasHeader && <Check size={14} color="#FFF" />}
                  </div>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1E293B" }}>Include Sticky Header Row</span>
                </div>
              </div>
              <div style={{ padding: "1.25rem 1.75rem", background: "#F8FAFC", borderTop: "1px solid #F1F5F9", display: "flex", gap: "1rem" }}>
                <button onClick={() => setTableModalOpen(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button onClick={handleInsertTable} className="btn-primary" style={{ flex: 1, background: "#10B981" }}>Generate Table</button>
              </div>
            </div>
          </div>
        )}

        {/* Media SEO Modal */}
        {mediaModalOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(8px)", padding: "1.5rem" }}>
            <div className="animate-in fade-in zoom-in duration-200" style={{ background: "#FFFFFF", width: "100%", maxWidth: "560px", borderRadius: "28px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)" }}>
              <div style={{ padding: "1.5rem", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F8FAFC" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB" }}>
                    <ImageIcon size={20} />
                  </div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>SEO Media Control</h3>
                </div>
                <button onClick={() => setMediaModalOpen(false)} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#FFF", border: "1px solid #E2E8F0", color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
              </div>
              
              <div style={{ padding: "1.5rem", maxHeight: "70vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                
                {/* Gallery Quick Select */}
                <button 
                  type="button" 
                  onClick={() => setGalleryModalOpen(true)}
                  style={{ width: "100%", padding: "1rem", borderRadius: "16px", background: "#EFF6FF", border: "2px dashed #2563EB", color: "#2563EB", fontWeight: 700, fontSize: "0.875rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", cursor: "pointer" }}
                >
                  <Maximize size={18} /> Select from Media Gallery
                </button>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748B", marginBottom: "0.5rem", textTransform: "uppercase" }}>Image URL</label>
                    <input type="text" value={mediaData.url} onChange={(e) => setMediaData({...mediaData, url: e.target.value})} className="form-input" placeholder="Paste URL or select from gallery" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748B", marginBottom: "0.5rem", textTransform: "uppercase" }}>Width</label>
                    <select value={mediaData.width} onChange={(e) => setMediaData({...mediaData, width: e.target.value})} className="form-input">
                      <option value="100%">Full Width</option>
                      <option value="75%">Large (75%)</option>
                      <option value="50%">Medium (50%)</option>
                      <option value="33%">Small (33%)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748B", marginBottom: "0.5rem", textTransform: "uppercase" }}>Alt Text (SEO)</label>
                    <input type="text" value={mediaData.alt} onChange={(e) => setMediaData({...mediaData, alt: e.target.value})} className="form-input" placeholder="Keyword-rich description" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748B", marginBottom: "0.5rem", textTransform: "uppercase" }}>Image Title</label>
                    <input type="text" value={mediaData.title} onChange={(e) => setMediaData({...mediaData, title: e.target.value})} className="form-input" placeholder="Internal title" />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748B", marginBottom: "0.5rem", textTransform: "uppercase" }}>Caption (Visible under image)</label>
                  <input type="text" value={mediaData.caption} onChange={(e) => setMediaData({...mediaData, caption: e.target.value})} className="form-input" placeholder="Add a descriptive caption..." />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748B", marginBottom: "0.5rem", textTransform: "uppercase" }}>Hyperlink (Optional)</label>
                  <div style={{ position: "relative" }}>
                    <ExternalLink size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                    <input type="text" value={mediaData.link} onChange={(e) => setMediaData({...mediaData, link: e.target.value})} className="form-input" style={{ paddingLeft: "2.5rem" }} placeholder="https://example.com/target-page" />
                  </div>
                </div>

                <div onClick={() => setMediaData({...mediaData, newTab: !mediaData.newTab})} style={{ display: "flex", alignItems: "center", gap: "0.875rem", cursor: "pointer" }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "5px", background: mediaData.newTab ? "#2563EB" : "#FFF", border: "2px solid #2563EB", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                    {mediaData.newTab && <Check size={14} color="#FFF" />}
                  </div>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#475569" }}>Open Link in New Tab (Auto-Nofollow)</span>
                </div>
              </div>

              <div style={{ padding: "1.25rem 1.5rem", background: "#F8FAFC", borderTop: "1px solid #F1F5F9", display: "flex", gap: "1rem" }}>
                <button onClick={() => setMediaModalOpen(false)} className="btn-secondary" style={{ flex: 1 }}>Discard</button>
                <button onClick={handleInsertMedia} className="btn-primary" style={{ flex: 1 }}>Insert Media</button>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Selector Modal (Nested) */}
        {galleryModalOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", padding: "1.5rem" }}>
            <div className="animate-in slide-in-from-bottom duration-300" style={{ background: "#FFFFFF", width: "100%", maxWidth: "900px", height: "85vh", borderRadius: "24px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 25px 60px rgba(0,0,0,0.4)" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F8FAFC" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>Select Image from Gallery</h3>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                   <div style={{ position: "relative", width: "240px" }}>
                      <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                      <input 
                        type="text" 
                        placeholder="Search gallery..." 
                        value={gallerySearch} 
                        onChange={(e) => setGallerySearch(e.target.value)}
                        className="form-input" 
                        style={{ paddingLeft: "2.5rem", height: "38px" }}
                      />
                   </div>
                   <button onClick={() => setGalleryModalOpen(false)} style={{ background: "#FFF", border: "1px solid #E2E8F0", padding: "0.5rem", borderRadius: "50%", cursor: "pointer", color: "#64748B" }}><X size={18} /></button>
                </div>
              </div>
              
              <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto", background: "#F1F5F9" }}>
                {galleryLoading ? (
                  <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}><Loader /></div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem" }}>
                    {galleryItems.filter(item => (item.title || "").toLowerCase().includes(gallerySearch.toLowerCase())).map(item => (
                      <div 
                        key={item._id} 
                        onClick={() => selectGalleryImage(item)}
                        style={{ borderRadius: "16px", background: "#FFF", padding: "8px", border: "1px solid #E2E8F0", cursor: "pointer", transition: "all 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                      >
                        <div style={{ height: "120px", borderRadius: "12px", overflow: "hidden", marginBottom: "8px" }}>
                          <img src={item.image.startsWith('http') ? item.image : `${(import.meta.env.VITE_API_URL || "https://dmctrichology-1.onrender.com/api").replace(/\/api$/, "")}${item.image.startsWith('/') ? '' : '/'}${item.image}`} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1E293B", margin: "0 0 4px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title || "Untitled"}</p>
                        <p style={{ fontSize: "0.65rem", color: "#64748B", margin: 0 }}>SEO: {item.altText ? "✅" : "❌"}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Media SEO Modal */}
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




