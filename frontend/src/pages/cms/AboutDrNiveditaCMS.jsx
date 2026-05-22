import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import {
  Save,
  Loader2,
  Image as ImageIcon,
  Eye,
  Settings,
  User,
  Globe,
  Plus,
  Trash2
} from "lucide-react";

export default function AboutDrNiveditaCMS() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const { data: res } = await axios.get("/about-dr-nivedita");
      if (res.success && res.data) setData(res.data);
    } catch {
      toast.error("Failed to load Dr. Nivedita page settings");
    } finally {
      setLoading(false);
    }
  };

  const updateSectionField = (section, field, value) => {
    setData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const updateNestedField = (path, value) => {
    setData(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let current = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = isNaN(parts[i + 1]) ? {} : [];
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return copy;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: res } = await axios.put("/about-dr-nivedita", data);
      if (res.success) { toast.success("Dr. Nivedita Dadu CMS saved successfully"); setData(res.data); }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e, section, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data: res } = await axios.post("/about-dr-nivedita/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.success) {
        updateSectionField(section, field, res.url);
        toast.success("Image uploaded successfully");
      }
    } catch { toast.error("Image upload failed"); }
    finally { setUploadingImage(false); }
  };

  // ── Styles ──────────────────────────────────────────────────────────────────
  const s = {
    page: { padding: "24px", fontFamily: "'Inter', sans-serif", maxWidth: "1100px" },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" },
    headerLeft: { display: "flex", alignItems: "center", gap: "12px" },
    iconBox: { width: 40, height: 40, borderRadius: "10px", background: "linear-gradient(135deg,#3b5998,#2a4080)", display: "flex", alignItems: "center", justifyContent: "center" },
    title: { fontSize: "22px", fontWeight: "700", color: "#1e293b", margin: 0 },
    subtitle: { fontSize: "12px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" },
    saveBtn: { display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "8px", background: "#3b5998", color: "#fff", border: "none", fontWeight: "600", cursor: "pointer", fontSize: "14px" },
    saveBtnDisabled: { opacity: 0.6, cursor: "not-allowed" },
    previewBtn: { display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", borderRadius: "8px", background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", fontWeight: "500", cursor: "pointer", fontSize: "13px", textDecoration: "none" },
    tabsContainer: { display: "flex", gap: "4px", marginBottom: "24px", background: "#f8fafc", padding: "6px", borderRadius: "12px", border: "1px solid #e2e8f0", flexWrap: "wrap" },
    tab: (active) => ({ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: active ? "600" : "400", fontSize: "13px", background: active ? "#fff" : "transparent", color: active ? "#3b5998" : "#64748b", boxShadow: active ? "0 1px 3px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s" }),
    card: { background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px", marginBottom: "20px" },
    cardTitle: { fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" },
    label: { display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" },
    input: { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", color: "#1e293b", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
    textarea: { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", color: "#1e293b", outline: "none", resize: "vertical", minHeight: "90px", boxSizing: "border-box", fontFamily: "inherit" },
    fieldGroup: { marginBottom: "18px" },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" },
    imgPreviewBox: { marginTop: "10px", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0", maxWidth: "220px", maxHeight: "180px" },
    uploadLabel: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: "12px", fontWeight: "500", marginTop: "8px" },
    bulletRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" },
    bulletInput: { flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", fontFamily: "inherit" },
    removeBtn: { padding: "6px 10px", borderRadius: "6px", background: "#fff0f0", color: "#e53e3e", border: "1px solid #feb2b2", cursor: "pointer", display: "flex", alignItems: "center" },
    addBtn: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", background: "#f0f7ff", color: "#3b5998", border: "1px solid #bfdbfe", cursor: "pointer", fontSize: "13px", fontWeight: "500", marginTop: "8px" }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
      <Loader2 size={28} style={{ animation: "spin 1s linear infinite", color: "#3b5998" }} />
    </div>
  );

  if (!data) return <div style={{ color: "#e53e3e", padding: "24px" }}>Failed to load settings. Please refresh.</div>;

  const hero = data.hero || {};
  const specialist = data.specialist || {};
  const seo = data.seo || {};

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.iconBox}><User size={20} color="#fff" /></div>
          <div>
            <p style={s.title}>About Dr. Nivedita Dadu CMS</p>
            <p style={s.subtitle}>Section 1 Isolated Builder</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <a href="https://dmctrichology-mkm4.vercel.app/about-dr-nivedita-dadu" target="_blank" rel="noopener noreferrer" style={s.previewBtn}>
            <Eye size={14} /> Live Preview
          </a>
          <button
            style={{ ...s.saveBtn, ...(saving ? s.saveBtnDisabled : {}) }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={15} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabsContainer}>
        <button style={s.tab(activeSection === "hero")} onClick={() => setActiveSection("hero")}>
          <User size={14} /> Hero Design & Copy
        </button>
        <button style={s.tab(activeSection === "specialist")} onClick={() => setActiveSection("specialist")}>
          <Settings size={14} /> Specialist Info
        </button>
        <button style={s.tab(activeSection === "seo")} onClick={() => setActiveSection("seo")}>
          <Globe size={14} /> SEO & Metadata
        </button>
      </div>

      {/* ── HERO SECTION ─────────────────────────────── */}
      {activeSection === "hero" && (
        <>
          <div style={s.card}>
            <p style={s.cardTitle}><User size={16} color="#3b5998" /> Doctor Info</p>
            <div style={s.grid2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Eyebrow / Subtitle</label>
                <input style={s.input} value={hero.mainHeading || ""} onChange={e => updateSectionField("hero", "mainHeading", e.target.value)} placeholder="EXPERT DERMATOLOGIST & TRICHOLOGIST IN DELHI" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Doctor Name (H1)</label>
                <input style={s.input} value={hero.doctorName || ""} onChange={e => updateSectionField("hero", "doctorName", e.target.value)} placeholder="Dr. Nivedita Dadu" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Degree / Badge</label>
                <input style={s.input} value={hero.degreeText || ""} onChange={e => updateSectionField("hero", "degreeText", e.target.value)} placeholder="MBBS, MD (Dermatology)" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Background Color</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input type="color" value={hero.backgroundColor || "#1a1a2e"} onChange={e => updateSectionField("hero", "backgroundColor", e.target.value)} style={{ width: "40px", height: "36px", border: "1px solid #e2e8f0", borderRadius: "6px", cursor: "pointer", padding: "2px" }} />
                  <input style={{ ...s.input, flex: 1 }} value={hero.backgroundColor || "#1a1a2e"} onChange={e => updateSectionField("hero", "backgroundColor", e.target.value)} />
                </div>
              </div>
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Description Paragraph</label>
              <textarea style={s.textarea} value={hero.descriptionParagraph || ""} onChange={e => updateSectionField("hero", "descriptionParagraph", e.target.value)} rows={4} />
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><ImageIcon size={16} color="#3b5998" /> Doctor Image</p>
            <div style={s.fieldGroup}>
              <label style={s.label}>Doctor Portrait URL</label>
              <input style={s.input} value={hero.doctorImage || ""} onChange={e => updateSectionField("hero", "doctorImage", e.target.value)} placeholder="https://..." />
            </div>
            {hero.doctorImage && (
              <div style={s.imgPreviewBox}>
                <img src={hero.doctorImage} alt="Doctor" style={{ width: "100%", display: "block" }} />
              </div>
            )}
            <label style={s.uploadLabel}>
              {uploadingImage ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <ImageIcon size={13} />}
              {uploadingImage ? "Uploading..." : "Upload New Image"}
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, "hero", "doctorImage")} style={{ display: "none" }} disabled={uploadingImage} />
            </label>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><Settings size={16} color="#3b5998" /> Form Settings</p>
            <div style={s.grid2}>
              {[
                ["Name Placeholder", "namePlaceholder", "Name*"],
                ["Email Placeholder", "emailPlaceholder", "E-Mail Address*"],
                ["Phone Placeholder", "phonePlaceholder", "Mobile Number*"],
                ["Date Placeholder", "datePlaceholder", "Select Preferred Date*"],
                ["Message Placeholder", "messagePlaceholder", "Enter Your Message Here"],
                ["Captcha Placeholder", "captchaPlaceholder", "Code*"],
                ["Submit Button Text", "submitButtonText", "Schedule Your Visit"]
              ].map(([label, field, ph]) => (
                <div key={field} style={s.fieldGroup}>
                  <label style={s.label}>{label}</label>
                  <input style={s.input} value={hero[field] || ""} onChange={e => updateSectionField("hero", field, e.target.value)} placeholder={ph} />
                </div>
              ))}
              <div style={s.fieldGroup}>
                <label style={s.label}>Overlay Opacity (0.0 – 1.0)</label>
                <input type="number" min="0" max="1" step="0.05" style={s.input} value={hero.overlayOpacity ?? 0.45} onChange={e => updateSectionField("hero", "overlayOpacity", parseFloat(e.target.value))} />
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── SPECIALIST SECTION ───────────────────────── */}
      {activeSection === "specialist" && (
        <>
          <div style={s.card}>
            <p style={s.cardTitle}><User size={16} color="#3b5998" /> Section Content</p>
            <div style={s.fieldGroup}>
              <label style={s.label}>Section Heading</label>
              <input style={s.input} value={specialist.heading || ""} onChange={e => updateSectionField("specialist", "heading", e.target.value)} placeholder="Best Dermatologist & Hair Specialist in Delhi" />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Description Paragraph 1</label>
              <textarea style={s.textarea} value={specialist.description1 || ""} onChange={e => updateSectionField("specialist", "description1", e.target.value)} rows={4} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Description Paragraph 2</label>
              <textarea style={s.textarea} value={specialist.description2 || ""} onChange={e => updateSectionField("specialist", "description2", e.target.value)} rows={4} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Highlighted Text (before bullets)</label>
              <input style={s.input} value={specialist.highlightedText || ""} onChange={e => updateSectionField("specialist", "highlightedText", e.target.value)} placeholder="She specializes in cutting-edge treatments including:" />
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><Settings size={16} color="#3b5998" /> Treatment Bullets</p>
            {(specialist.bullets || []).map((bullet, idx) => (
              <div key={idx} style={s.bulletRow}>
                <input style={s.bulletInput} value={bullet} onChange={e => updateNestedField(`specialist.bullets.${idx}`, e.target.value)} placeholder={`Bullet ${idx + 1}`} />
                <button style={s.removeBtn} onClick={() => {
                  const updated = [...(specialist.bullets || [])];
                  updated.splice(idx, 1);
                  updateSectionField("specialist", "bullets", updated);
                }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button style={s.addBtn} onClick={() => updateSectionField("specialist", "bullets", [...(specialist.bullets || []), "New Treatment"])}>
              <Plus size={14} /> Add Bullet
            </button>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><ImageIcon size={16} color="#3b5998" /> Section Colors</p>
            <div style={s.grid2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Section Background Color</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="color" value={specialist.sectionBgColor || "#ffffff"} onChange={e => updateSectionField("specialist", "sectionBgColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                  <input style={{ ...s.input, flex: 1 }} value={specialist.sectionBgColor || "#ffffff"} onChange={e => updateSectionField("specialist", "sectionBgColor", e.target.value)} />
                </div>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Card Background Color</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="color" value={specialist.cardBgColor || "#3b5998"} onChange={e => updateSectionField("specialist", "cardBgColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                  <input style={{ ...s.input, flex: 1 }} value={specialist.cardBgColor || "#3b5998"} onChange={e => updateSectionField("specialist", "cardBgColor", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── SEO SECTION ──────────────────────────────── */}
      {activeSection === "seo" && (
        <div style={s.card}>
          <p style={s.cardTitle}><Globe size={16} color="#3b5998" /> SEO & Metadata</p>
          <div style={s.fieldGroup}>
            <label style={s.label}>Meta Title</label>
            <input style={s.input} value={seo.metaTitle || ""} onChange={e => updateSectionField("seo", "metaTitle", e.target.value)} placeholder="Dr. Nivedita Dadu | Expert Dermatologist..." />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Meta Description</label>
            <textarea style={s.textarea} value={seo.metaDescription || ""} onChange={e => updateSectionField("seo", "metaDescription", e.target.value)} rows={3} />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>OG Image URL</label>
            <input style={s.input} value={seo.ogImage || ""} onChange={e => updateSectionField("seo", "ogImage", e.target.value)} placeholder="https://..." />
          </div>
          {seo.ogImage && (
            <div style={s.imgPreviewBox}>
              <img src={seo.ogImage} alt="OG" style={{ width: "100%", display: "block" }} />
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
