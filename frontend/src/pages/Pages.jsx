import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, ArrowLeft, Search, Eye, Filter, ChevronDown, Check, Globe } from "lucide-react";
import Loader from "../components/Loader";
import Table from "../components/Table";
import api from "../api/client";
import { FRONTEND_URL } from "../utils/config";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image', 'video'],
    ['clean']
  ],
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

function Pages() {
  const [items, setItems] = useState([]);
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
    title: "",
    content: "",
    status: "Published",
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    canonicalUrl: "",
    schema: "",
    slug: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/pages");
      setItems(data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load pages");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setIsSlugManual(false);
    setView("form");
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || "",
      content: item.content || "",
      status: item.status || "Published",
      metaTitle: item.metaTitle || "",
      metaKeywords: item.metaKeywords || "",
      metaDescription: item.metaDescription || "",
      canonicalUrl: item.canonicalUrl || "",
      schema: item.schema || "",
      slug: item.slug || ""
    });
    setEditingId(item._id);
    setIsSlugManual(true); // Don't auto-generate when editing an existing page unless requested
    setView("form");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this page?")) return;
    try {
      await api.delete(`/pages/${id}`);
      toast.success("Page deleted successfully");
      fetchPages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete page");
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

  const handleSubmit = async (e, saveAsDraft = false) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Please fill in all required fields (Title, Content)");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const payload = { ...formData };
      if (saveAsDraft) payload.status = 'Draft';

      if (editingId) {
        await api.put(`/pages/${editingId}`, payload);
        toast.success(saveAsDraft ? "Draft saved successfully" : "Page updated successfully");
      } else {
        await api.post("/pages", payload);
        toast.success(saveAsDraft ? "Draft created successfully" : "Page published successfully");
      }
      
      setView("list");
      fetchPages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  // System slugs — these are managed by dedicated CMS editors (Homepage, About, Contact, etc.)
  // and should NOT show in the Custom Pages list to avoid confusion
  const SYSTEM_SLUGS = [
    "home", "header", "footer", "service", "details",
    "contact-us", "blog", "about-us", "press-media",
    "virtual-tour", "influencers", "science-at-dmc",
    "science-at-dmc-trichology",
  ];

  // Table filtering and pagination
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (SYSTEM_SLUGS.includes(item.slug)) return false;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, statusFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return "Never Updated";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Never Updated";
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // URL Preview logic
  const siteUrl = FRONTEND_URL;

  if (loading) {
    return <Loader label="Loading pages..." />;
  }

  if (view === "form") {
    return (
      <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", paddingBottom: "3rem" }}>
        {/* Preview Modal */}
        {showPreviewModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", padding: "1rem" }}>
            <div style={{ background: "#FFFFFF", width: "100%", maxWidth: "900px", maxHeight: "90vh", borderRadius: "16px", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}>
              <div style={{ position: "sticky", top: 0, background: "rgba(255,255,255,0.95)", padding: "1rem 1.5rem", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>Preview: {formData.title || "Untitled Page"}</h2>
                <button onClick={() => setShowPreviewModal(false)} className="btn-primary">Close Preview</button>
              </div>
              <div style={{ padding: "2rem" }}>
                <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0F172A", marginBottom: "1.5rem" }}>{formData.title}</h1>
                <div className="prose" dangerouslySetInnerHTML={{ __html: formData.content }} />
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
              {editingId ? "Edit Page" : "Add New Page"}
            </h2>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button type="button" onClick={() => setShowPreviewModal(true)} className="btn-secondary">
              <Eye size={15} /> Preview
            </button>
            <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={submitting}
              style={{ padding: "0.5rem 1.25rem", borderRadius: "8px", border: "1px solid #2563EB", background: "#EFF6FF", color: "#2563EB", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}>
              Save as Draft
            </button>
            <button onClick={(e) => handleSubmit(e, false)} disabled={submitting} className="btn-primary">
              {submitting ? "Saving..." : editingId ? "Update & Publish" : "Publish Page"}
            </button>
          </div>
        </div>

        {/* 2-column layout */}
        <form style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "start" }}>

          {/* ── LEFT PANEL (main content) ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Page Title */}
            <div className="card-glass" style={{ padding: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.625rem" }}>
                Page Title <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter page title..."
                className="form-input"
                required
                style={{ fontSize: "1.125rem", fontWeight: 600, padding: "0.75rem 1rem" }}
              />
              
              {/* URL Preview */}
              <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", background: "#F8FAFC", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                <Globe size={14} className="text-slate-400" />
                <span style={{ fontSize: "0.8rem", color: "#64748B" }}>Permalink:</span>
                <span style={{ fontSize: "0.8rem", color: "#2563EB", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {siteUrl}/{formData.slug || "..."}
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
                    placeholder="page-url-slug"
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

            {/* Content */}
            <div className="card-glass" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Page Content <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <span style={{ fontSize: "0.7rem", color: "#10B981", fontWeight: 600, background: "#D1FAE5", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>
                  ✓ Edit here — type directly
                </span>
              </div>
              <div style={{ background: "#FFFFFF", borderRadius: "10px", overflow: "hidden", border: "1px solid #E2E8F0" }}>
                <ReactQuill theme="snow" modules={modules} value={formData.content} onChange={(val) => handleQuillChange('content', val)} style={{ minHeight: "400px" }} />
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
              <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#94A3B8" }}>
                Last saved: {editingId ? "Just now" : "Not saved yet"}
              </div>
            </div>

            {/* Visual Builder */}
            {editingId && formData.slug && (
              <div className="card-glass" style={{ padding: "1.25rem" }}>
                <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.75rem 0" }}>Advanced</h3>
                <button
                  type="button"
                  onClick={() => window.open(`/cms/visual-builder/${formData.slug}`, '_blank')}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.6rem 1rem", borderRadius: "8px", background: "#F5F3FF", border: "1px solid #DDD6FE", color: "#6D28D9", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}
                >
                  <Eye size={14} /> Open Visual Builder
                </button>
                <p style={{ fontSize: "0.7rem", color: "#94A3B8", marginTop: "0.5rem", textAlign: "center" }}>Add component sections (Hero, Cards etc.)</p>
              </div>
            )}

            {/* SEO Settings */}
            <div className="card-glass" style={{ padding: "1.25rem" }}>
              <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 1rem 0" }}>SEO Settings</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Meta Title</label>
                  <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} placeholder="Page SEO Title" className="form-input" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Meta Keywords</label>
                  <textarea name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} rows="2" placeholder="keyword1, keyword2" className="form-input" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Meta Description</label>
                  <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows="3" placeholder="Brief description for search engines..." className="form-input" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Canonical URL</label>
                  <input type="text" name="canonicalUrl" value={formData.canonicalUrl} onChange={handleChange} placeholder="https://example.com/page" className="form-input" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#374151", marginBottom: "0.375rem" }}>Schema Markup (JSON-LD)</label>
                  <textarea name="schema" value={formData.schema || ""} onChange={handleChange} rows="8" placeholder={'{"@context":"https://schema.org","@type":"WebPage"}'} className="form-input" style={{ fontFamily: "monospace", fontSize: "0.75rem" }} />
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>Custom Pages</h2>
          <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "0.25rem 0 0 0" }}>
            Simple text-only pages like Privacy Policy, Terms, Disclaimer etc.
          </p>
        </div>
        <button onClick={handleAddNew} className="btn-primary">
          <Plus size={18} /> Create New Page
        </button>
      </div>


      {/* Filters + Table card */}
      <div className="card" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
            <Search style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} size={16} />
            <input
              type="text"
              placeholder="Search pages by title..."
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
          { key: "title", label: "Title" },
          { key: "slug", label: "Slug" },
          { key: "date", label: "Last Modified" },
          { key: "status", label: "Status" },
          { key: "actions", label: "Actions", align: "right" },
        ]}>
          {currentItems.map((item) => (
            <tr key={item._id} style={{ borderBottom: "1px solid #F1F5F9" }}>
              <td style={{ padding: "0.875rem 1.25rem", fontWeight: 600, color: "#0F172A" }}>
                {item.title}
              </td>
              <td style={{ padding: "0.875rem 1.25rem", color: "#475569", fontSize: "0.875rem" }}>
                /{item.slug}
              </td>
              <td style={{ padding: "0.875rem 1.25rem", color: "#475569", whiteSpace: "nowrap", fontSize: "0.875rem" }}>
                {formatDate(item.updatedAt)}
              </td>
              <td style={{ padding: "0.875rem 1.25rem" }}>
                <span style={{ padding: "0.2rem 0.6rem", borderRadius: "9999px", fontSize: "0.7rem", fontWeight: 700, background: item.status === "Published" ? "#D1FAE5" : "#FEF3C7", color: item.status === "Published" ? "#065F46" : "#92400E" }}>
                  {item.status || "Published"}
                </span>
              </td>
              <td style={{ padding: "0.875rem 1.25rem", textAlign: "right" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                  <a href={`${siteUrl}/${item.slug}`} target="_blank" rel="noreferrer" title="View Page"
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
              <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#94A3B8", fontSize: "0.875rem" }}>
                No pages found.
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

export default Pages;
