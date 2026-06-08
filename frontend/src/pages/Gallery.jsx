import { useEffect, useRef, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Upload, X, Search, Edit2, Trash2, Eye, CheckCircle, XCircle, Image as ImageIcon, ChevronDown, Square, CheckSquare } from "lucide-react";
import Loader from "../components/Loader";
import {
  createGalleryItems,
  deleteGalleryItem,
  getGalleryItems,
  toggleGalleryItemStatus,
  updateGalleryItem,
} from "../api/services";

const getImgUrl = (path) => {
  if (!path) return "https://placehold.co/600x400?text=No+Image";
  if (path.startsWith("http")) return path;
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const base = (import.meta.env.VITE_API_URL || "https://dmctrichology-1.onrender.com/api").replace(/\/api$/, "");
  
  return `${base}${normalizedPath}`;
};

const getMediaFilename = (itemOrPath) => {
  const rawPath = typeof itemOrPath === "string"
    ? itemOrPath
    : itemOrPath?.originalName || itemOrPath?.filename || itemOrPath?.fileName || itemOrPath?.image || itemOrPath?.imageUrl || itemOrPath?.url || "";

  if (!rawPath) return "No filename";

  const cleanPath = rawPath.split("?")[0].split("#")[0];
  const filename = cleanPath.substring(cleanPath.lastIndexOf("/") + 1);

  try {
    return decodeURIComponent(filename || cleanPath);
  } catch {
    return filename || cleanPath;
  }
};

const getMediaDisplayName = (item) => {
  const title = item?.title?.trim?.();
  return title || getMediaFilename(item);
};

const CustomDropdown = ({ value, onChange, options, label, icon: Icon, placeholder = "Select...", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(opt => opt.value === value);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = () => setIsOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} onClick={e => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 border border-slate-100 rounded-[12px] text-sm font-semibold text-slate-600 outline-none hover:bg-white hover:border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 h-[44px] shadow-sm ${isOpen ? 'bg-white border-blue-500 ring-4 ring-blue-500/10' : ''}`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {Icon && <Icon size={18} className="text-slate-400 flex-shrink-0" />}
          <span className={`truncate ${selected ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
            {selected ? selected.label : placeholder}
          </span>
        </div>
        <ChevronDown 
          size={18} 
          className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-full bg-white rounded-[12px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 z-[100] overflow-hidden animate-fade-in">
          <div className="p-1.5 max-h-[220px] overflow-y-auto scrollbar-hide space-y-0.5">
            {options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold rounded-[10px] transition-all duration-200 ${
                    isSelected 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={isSelected ? 'font-bold' : ''}>{opt.label}</span>
                  {isSelected && <CheckCircle size={16} className="text-blue-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Selected image for detail panel
  const [selected, setSelected] = useState(null);
  const [detailForm, setDetailForm] = useState({ title: "", altText: "", description: "", status: "active" });

  // Upload state
  const [dragOver, setDragOver] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]); // [{ file, preview, name }]
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadProgress, setUploadProgress] = useState(false);
  const fileInputRef = useRef();

  // Preview modal
  const [previewUrl, setPreviewUrl] = useState(null);

  // ── Fetch ─────────────────────────────────────────────
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await getGalleryItems({ page: 1, limit: 200 });
      setItems(res.data || []);
    } catch (e) {
      toast.error(e.response?.data?.message || "Unable to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  // ── Filtered / Sorted List ────────────────────────────
  const filtered = useMemo(() => {
    let list = [...items];
    if (search.trim()) {
      list = list.filter(i => getMediaDisplayName(i).toLowerCase().includes(search.toLowerCase()));
    }
    if (statusFilter !== "all") {
      list = list.filter(i => i.status === statusFilter);
    }
    if (sortBy === "newest") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === "oldest") list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === "name") list.sort((a, b) => getMediaDisplayName(a).localeCompare(getMediaDisplayName(b)));
    return list;
  }, [items, search, statusFilter, sortBy]);

  // ── Upload Handlers ───────────────────────────────────
  const addFiles = (fileList) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm", "video/quicktime", "video/mov"];
    const newFiles = Array.from(fileList)
      .filter(f => {
        const isAllowed = allowedTypes.includes(f.type) || f.type.startsWith("image/") || f.type.startsWith("video/");
        return isAllowed;
      })
      .map(f => ({
        file: f,
        preview: URL.createObjectURL(f),
        name: f.name,
        isVideo: f.type.startsWith("video/")
      }));
    if (!newFiles.length) { toast.error("Only image (JPG, PNG, WebP) and video (MP4, WEBM, MOV) files are allowed"); return; }
    setUploadFiles(prev => [...prev, ...newFiles]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const removeUploadFile = (idx) => {
    setUploadFiles(prev => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleUpload = async () => {
    if (!uploadFiles.length) { toast.error("Select at least one media file"); return; }
    setUploadProgress(true);
    try {
      const fd = new FormData();
      fd.append("title", uploadTitle);
      // Append files to unified field name 'media'
      uploadFiles.forEach(f => fd.append("media", f.file));
      await createGalleryItems(fd);
      toast.success(`${uploadFiles.length} media item(s) uploaded successfully`);
      setUploadFiles([]);
      setUploadTitle("");
      fetchItems();
    } catch (e) {
      toast.error(e.response?.data?.message || "Upload failed");
    } finally {
      setUploadProgress(false);
    }
  };


  // ── Select image (open detail panel) ─────────────────
  const selectItem = (item) => {
    setSelected(item);
    setDetailForm({
      title: item.title || "",
      altText: item.altText || "",
      description: item.description || "",
      status: item.status || "active",
    });
  };

  const closeDetail = () => setSelected(null);

  // ── Detail Panel: Update ──────────────────────────────
  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", detailForm.title);
      fd.append("altText", detailForm.altText);
      fd.append("description", detailForm.description);
      fd.append("status", detailForm.status);
      await updateGalleryItem(selected._id, fd);
      toast.success("Image updated");
      setItems(prev => prev.map(i => i._id === selected._id ? { ...i, ...detailForm } : i));
      setSelected(prev => ({ ...prev, ...detailForm }));
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image permanently?")) return;
    setActionId(id);
    try {
      await deleteGalleryItem(id);
      toast.success("Image deleted");
      if (selected?._id === id) setSelected(null);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    } finally {
      setActionId("");
    }
  };

  // ── Bulk Selection ───────────────────────────────────
  const toggleSelectItem = (e, id) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(i => i._id)));
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.size) return;
    if (!window.confirm(`Delete ${selectedIds.size} image(s) permanently?`)) return;
    setBulkDeleting(true);
    try {
      await Promise.all([...selectedIds].map(id => deleteGalleryItem(id)));
      toast.success(`${selectedIds.size} image(s) deleted`);
      if (selected && selectedIds.has(selected._id)) setSelected(null);
      setItems(prev => prev.filter(i => !selectedIds.has(i._id)));
      setSelectedIds(new Set());
    } catch (e) {
      toast.error("Some deletions failed");
    } finally {
      setBulkDeleting(false);
    }
  };

  // ── Toggle status ─────────────────────────────────────
  const handleToggle = async (id) => {
    setActionId(id);
    try {
      await toggleGalleryItemStatus(id);
      setItems(prev => prev.map(i => i._id === id ? { ...i, status: i.status === "active" ? "inactive" : "active" } : i));
      if (selected?._id === id) {
        setSelected(prev => ({ ...prev, status: prev.status === "active" ? "inactive" : "active" }));
        setDetailForm(prev => ({ ...prev, status: prev.status === "active" ? "inactive" : "active" }));
      }
      toast.success("Status updated");
    } catch (e) {
      toast.error("Status update failed");
    } finally {
      setActionId("");
    }
  };

  if (loading) return <Loader label="Loading gallery..." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Preview Modal */}
      {previewUrl && (
        <div onClick={() => setPreviewUrl(null)} style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <button onClick={() => setPreviewUrl(null)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}><X size={18} /></button>
          {previewUrl.toLowerCase().includes('.mp4') || previewUrl.toLowerCase().includes('.webm') || previewUrl.toLowerCase().includes('.mov') || previewUrl.includes('video') ? (
            <video src={previewUrl} controls autoPlay style={{ maxWidth: "90vw", maxHeight: "88vh", borderRadius: 12, outline: "none" }} onClick={e => e.stopPropagation()} />
          ) : (
            <img src={previewUrl} alt="Preview" style={{ maxWidth: "90vw", maxHeight: "88vh", borderRadius: 12, objectFit: "contain" }} onClick={e => e.stopPropagation()} />
          )}
        </div>
      )}


      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>Media Gallery</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.8rem", color: "#64748B" }}>{filtered.length} image{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1E293B", borderRadius: 10, padding: "0.75rem 1.25rem", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>{selectedIds.size}</span>
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#E2E8F0" }}>{selectedIds.size} image{selectedIds.size !== 1 ? "s" : ""} selected</span>
          </div>
          <div style={{ display: "flex", gap: "0.625rem" }}>
            <button onClick={() => setSelectedIds(new Set())} style={{ padding: "0.4rem 1rem", borderRadius: 8, fontSize: "0.8rem", fontWeight: 600, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#CBD5E1", cursor: "pointer" }}>Cancel</button>
            <button onClick={handleBulkDelete} disabled={bulkDeleting} style={{ padding: "0.4rem 1rem", borderRadius: 8, fontSize: "0.8rem", fontWeight: 600, background: bulkDeleting ? "#6B7280" : "#EF4444", border: "none", color: "#fff", cursor: bulkDeleting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Trash2 size={13} />
              {bulkDeleting ? "Deleting…" : `Delete ${selectedIds.size} Image${selectedIds.size !== 1 ? "s" : ""}`}
            </button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div className="card-glass" style={{ padding: "1.25rem" }}>
        <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.875rem 0" }}>Upload Media</p>
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{ border: `2px dashed ${dragOver ? "#2563EB" : "#CBD5E1"}`, borderRadius: 10, background: dragOver ? "#EFF6FF" : "#F8FAFC", padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", cursor: "pointer", transition: "all 0.2s" }}
        >
          <Upload size={28} color={dragOver ? "#2563EB" : "#94A3B8"} />
          <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 500, color: dragOver ? "#2563EB" : "#64748B" }}>Drag & drop images or videos here, or click to browse</p>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "#94A3B8" }}>PNG, JPG, WebP, MP4, WEBM, MOV — up to 50 MB each</p>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple style={{ display: "none" }} onChange={e => addFiles(e.target.files)} />

        {uploadFiles.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem", marginBottom: "0.875rem" }}>
              {uploadFiles.map((f, idx) => (
                <div key={idx} style={{ position: "relative", width: 72, height: 72, borderRadius: 8, overflow: "hidden", border: "1px solid #E2E8F0", background: "#000" }}>
                  {f.isVideo ? (
                    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <video src={f.preview} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} muted />
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)" }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ borderStyle: "solid", borderWidth: "4px 0 4px 7px", borderColor: "transparent transparent transparent #000", marginLeft: 1 }} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img src={f.preview} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                  <button onClick={e => { e.stopPropagation(); removeUploadFile(idx); }} style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}><X size={10} /></button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
              <input
                type="text"
                value={uploadTitle}
                onChange={e => setUploadTitle(e.target.value)}
                placeholder="Optional title for all items"
                className="form-input"
                style={{ maxWidth: 280 }}
              />
              <button onClick={handleUpload} disabled={uploadProgress} className="btn-primary">
                {uploadProgress ? "Uploading…" : `Upload ${uploadFiles.length} Item${uploadFiles.length !== 1 ? "s" : ""}`}
              </button>
              <button onClick={() => setUploadFiles([])} className="btn-secondary">Clear</button>
            </div>
          </div>
        )}
      </div>


      {/* Filters */}
      <div className="card" style={{ padding: "0.875rem 1.25rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
        {/* Select All toggle */}
        {filtered.length > 0 && (
          <button
            onClick={toggleSelectAll}
            title={selectedIds.size === filtered.length ? "Deselect All" : "Select All"}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.75rem", borderRadius: 8, fontSize: "0.8rem", fontWeight: 600, border: "1px solid #E2E8F0", background: selectedIds.size === filtered.length ? "#EFF6FF" : "#F8FAFC", color: selectedIds.size === filtered.length ? "#2563EB" : "#64748B", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            {selectedIds.size === filtered.length
              ? <CheckSquare size={15} />
              : <Square size={15} />}
            Select All
          </button>
        )}
        <div style={{ position: "relative", flex: "1", minWidth: 180 }}>
          <Search size={15} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
          <input type="text" placeholder="Search by title…" value={search} onChange={e => setSearch(e.target.value)} className="form-input" style={{ paddingLeft: "2.25rem" }} />
        </div>
        <CustomDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: "All Status", value: "all" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" }
          ]}
          placeholder="All Status"
          className="min-w-[140px]"
        />
        <CustomDropdown
          value={sortBy}
          onChange={setSortBy}
          options={[
            { label: "Newest First", value: "newest" },
            { label: "Oldest First", value: "oldest" },
            { label: "Name A–Z", value: "name" }
          ]}
          placeholder="Sort By"
          className="min-w-[140px]"
        />
      </div>

      {/* Main 2-column area */}
      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 320px" : "1fr", gap: "1.5rem", alignItems: "start" }}>

        {/* LEFT: Media Grid */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#94A3B8", background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0" }}>
              <ImageIcon size={40} style={{ marginBottom: "0.75rem", opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: "0.875rem" }}>No media items found. Upload some above.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.875rem" }}>
              {filtered.map(item => {
                const isChecked = selectedIds.has(item._id);
                const isActive = selected?._id === item._id;
                const isVideo = item.mediaType === "video";
                return (
                <div
                  key={item._id}
                  onClick={() => selectItem(item)}
                  style={{
                    position: "relative", borderRadius: 10, overflow: "hidden", cursor: "pointer",
                    border: isChecked ? "2px solid #EF4444" : isActive ? "2px solid #2563EB" : "2px solid transparent",
                    boxShadow: isChecked ? "0 0 0 3px rgba(239,68,68,0.2)" : isActive ? "0 0 0 3px rgba(37,99,235,0.2)" : "0 1px 3px rgba(15,23,42,0.08)",
                    transition: "all 0.18s",
                    background: isChecked ? "#FFF5F5" : "#fff",
                  }}
                >
                  {/* Checkbox */}
                  <div
                    onClick={e => toggleSelectItem(e, item._id)}
                    style={{ position: "absolute", top: 6, right: 6, zIndex: 10, cursor: "pointer" }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: 5,
                      background: isChecked ? "#EF4444" : "rgba(255,255,255,0.92)",
                      border: isChecked ? "2px solid #EF4444" : "2px solid #CBD5E1",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.15)", transition: "all 0.15s"
                    }}>
                      {isChecked && <CheckCircle size={12} color="#fff" />}
                    </div>
                  </div>

                  {/* Media Content */}
                  <div style={{ height: 140, overflow: "hidden", background: "#000", position: "relative" }}>
                    {isVideo ? (
                      <div style={{ width: "100%", height: "100%", position: "relative" }}>
                        <video
                          src={getImgUrl(item.image)}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          muted
                          playsInline
                        />
                        {/* Play Icon Overlay */}
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.25)" }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                            <span style={{ borderStyle: "solid", borderWidth: "6px 0 6px 10px", borderColor: "transparent transparent transparent #000", marginLeft: 2 }} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={getImgUrl(item.image) || "https://placehold.co/600x400?text=Gallery"}
                        alt={item.altText || item.title || "Gallery"}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.25s" }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
                        }}
                      />
                    )}
                  </div>

                  {/* Status badge */}
                  <div style={{ position: "absolute", top: 6, left: 6 }}>
                    <span style={{ padding: "0.15rem 0.45rem", borderRadius: 9999, fontSize: "0.65rem", fontWeight: 700, background: item.status === "active" ? "#D1FAE5" : "#FEF3C7", color: item.status === "active" ? "#065F46" : "#92400E" }}>
                      {item.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Hover actions */}
                  <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", opacity: 0, transition: "opacity 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                  >
                    <button onClick={e => { e.stopPropagation(); setPreviewUrl(getImgUrl(item.image)); }} title="View" style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#0F172A" }}><Eye size={14} /></button>
                    <button onClick={e => { e.stopPropagation(); selectItem(item); }} title="Edit" style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#2563EB" }}><Edit2 size={14} /></button>
                    <button onClick={e => { e.stopPropagation(); handleDelete(item._id); }} disabled={actionId === item._id} title="Delete" style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(239,68,68,0.9)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}><Trash2 size={14} /></button>
                  </div>

                  {/* Filename / title */}
                  <div title={getMediaDisplayName(item)} style={{ padding: "0.4rem 0.6rem", fontSize: "0.75rem", fontWeight: 600, color: "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {getMediaDisplayName(item)}
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>


        {/* RIGHT: Detail Panel (sticky) */}
        {selected && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", position: "sticky", top: 80 }}>
            <div className="card-glass" style={{ padding: "1.25rem" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>Image Details</h3>
                <button onClick={closeDetail} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex" }}><X size={16} /></button>
              </div>

              {/* Preview */}
              <div style={{ borderRadius: 10, overflow: "hidden", marginBottom: "1rem", border: "1px solid #E2E8F0", cursor: "pointer", height: 180, background: "#000" }} onClick={() => setPreviewUrl(getImgUrl(selected.image))}>
                {selected.mediaType === "video" ? (
                  <video
                    src={getImgUrl(selected.image)}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    muted
                    playsInline
                  />
                ) : (
                  <img 
                    src={getImgUrl(selected.image)} 
                    alt={selected.altText || "Preview"} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
                    }}
                  />
                )}
              </div>

              {/* Upload date */}
              <p style={{ fontSize: "0.75rem", color: "#94A3B8", margin: "0 0 1rem 0" }}>
                Uploaded: {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
              </p>

              <p title={getMediaFilename(selected)} style={{ fontSize: "0.75rem", color: "#334155", margin: "0 0 0.5rem 0", fontWeight: 700, wordBreak: "break-all" }}>
                Filename: {getMediaFilename(selected)}
              </p>

              {/* Fields */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div>
                  <label className="form-label">{selected.mediaType === "video" ? "Video URL" : "Image URL"}</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input type="text" readOnly value={getImgUrl(selected.image)} className="form-input" style={{ flex: 1, backgroundColor: "#F8FAFC", color: "#64748B", cursor: "text", fontSize: "0.75rem" }} />
                    <button type="button" onClick={() => { navigator.clipboard.writeText(getImgUrl(selected.image)); toast.success("URL copied!"); }} className="btn-secondary" style={{ padding: "0 0.75rem", fontSize: "0.8rem", whiteSpace: "nowrap" }}>Copy URL</button>
                  </div>
                </div>

                <div>
                  <label className="form-label">Title</label>
                  <input type="text" value={detailForm.title} onChange={e => setDetailForm(p => ({ ...p, title: e.target.value }))} className="form-input" placeholder="Image title" />
                </div>
                <div>
                  <label className="form-label">Alt Text <span style={{ color: "#2563EB", fontSize: "0.7rem" }}>(SEO)</span></label>
                  <input type="text" value={detailForm.altText} onChange={e => setDetailForm(p => ({ ...p, altText: e.target.value }))} className="form-input" placeholder="Describe for search engines" />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea rows={3} value={detailForm.description} onChange={e => setDetailForm(p => ({ ...p, description: e.target.value }))} className="form-input" placeholder="Optional description" />
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {["active", "inactive"].map(s => (
                      <button key={s} onClick={() => setDetailForm(p => ({ ...p, status: s }))}
                        style={{ flex: 1, padding: "0.5rem", borderRadius: 8, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", border: detailForm.status === s ? "2px solid #2563EB" : "1px solid #E2E8F0", background: detailForm.status === s ? "#EFF6FF" : "#FFFFFF", color: detailForm.status === s ? "#2563EB" : "#64748B", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem" }}>
                        {s === "active" ? <CheckCircle size={13} /> : <XCircle size={13} />}
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "0.625rem", marginTop: "1rem" }}>
                <button onClick={handleUpdate} disabled={saving} className="btn-primary" style={{ flex: 1 }}>
                  {saving ? "Saving…" : "Update"}
                </button>
                <button onClick={() => handleDelete(selected._id)} disabled={actionId === selected._id} className="btn-danger">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
