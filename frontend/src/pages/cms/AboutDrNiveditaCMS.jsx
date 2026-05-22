import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import {
  Save, Loader2, Image as ImageIcon, Eye, Settings, User,
  Globe, Plus, Trash2, Award, BookOpen, Briefcase, Star, Layout
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
    } finally { setLoading(false); }
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
    } finally { setSaving(false); }
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
      if (res.success) { updateSectionField(section, field, res.url); toast.success("Image uploaded successfully"); }
    } catch { toast.error("Image upload failed"); }
    finally { setUploadingImage(false); }
  };

  // ── Styles ───────────────────────────────────────────────────────────────────
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
    tab: (active) => ({ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: active ? "600" : "400", fontSize: "12px", background: active ? "#fff" : "transparent", color: active ? "#3b5998" : "#64748b", boxShadow: active ? "0 1px 3px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s", whiteSpace: "nowrap" }),
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
    addBtn: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", background: "#f0f7ff", color: "#3b5998", border: "1px solid #bfdbfe", cursor: "pointer", fontSize: "13px", fontWeight: "500", marginTop: "8px" },
    colorRow: { display: "flex", alignItems: "center", gap: "10px" },
    sectionDivider: { borderTop: "1px dashed #e2e8f0", marginTop: "20px", paddingTop: "20px" }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
      <Loader2 size={28} style={{ animation: "spin 1s linear infinite", color: "#3b5998" }} />
    </div>
  );

  if (!data) return <div style={{ color: "#e53e3e", padding: "24px" }}>Failed to load settings. Please refresh.</div>;

  const hero = data.hero || {};
  const breadcrumb = data.breadcrumb || {};
  const specialist = data.specialist || {};
  const membership = data.membership || {};
  const eduExp = data.educationExperience || {};
  const credentials = data.credentialsSection || {};
  const featuredIn = data.featuredInSection || {};
  const patientCare = data.patientCareSection || {};
  const associations = data.associationsSection || {};
  const otherSpec = data.otherSpecialitiesSection || {};
  const seo = data.seo || {};

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.iconBox}><User size={20} color="#fff" /></div>
          <div>
            <p style={s.title}>About Dr. Nivedita Dadu CMS</p>
            <p style={s.subtitle}>Full Isolated CMS Builder — All Sections</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <a href="https://dmctrichology-mkm4.vercel.app/about-dr-nivedita-dadu" target="_blank" rel="noopener noreferrer" style={s.previewBtn}>
            <Eye size={14} /> Live Preview
          </a>
          <button style={{ ...s.saveBtn, ...(saving ? s.saveBtnDisabled : {}) }} onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={15} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabsContainer}>
        <button style={s.tab(activeSection === "hero")} onClick={() => setActiveSection("hero")}><User size={13} /> Hero Design & Copy</button>
        <button style={s.tab(activeSection === "breadcrumb")} onClick={() => setActiveSection("breadcrumb")}><Layout size={13} /> Breadcrumb Config</button>
        <button style={s.tab(activeSection === "specialist")} onClick={() => setActiveSection("specialist")}><Star size={13} /> Specialist Info</button>
        <button style={s.tab(activeSection === "membership")} onClick={() => setActiveSection("membership")}><Award size={13} /> Membership Section</button>
        <button style={s.tab(activeSection === "education")} onClick={() => setActiveSection("education")}><BookOpen size={13} /> Education & Experience</button>
        <button style={s.tab(activeSection === "credentials")} onClick={() => setActiveSection("credentials")}><Briefcase size={13} /> Credentials Section</button>
        <button style={s.tab(activeSection === "featured")} onClick={() => setActiveSection("featured")}><Star size={13} /> Featured In</button>
        <button style={s.tab(activeSection === "patientcare")} onClick={() => setActiveSection("patientcare")}><User size={13} /> Patient Care</button>
        <button style={s.tab(activeSection === "other")} onClick={() => setActiveSection("other")}><Settings size={13} /> Other Specialities</button>
        <button style={s.tab(activeSection === "associations")} onClick={() => setActiveSection("associations")}><Award size={13} /> Associations</button>
        <button style={s.tab(activeSection === "seo")} onClick={() => setActiveSection("seo")}><Globe size={13} /> SEO & Metadata</button>
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
                <div style={s.colorRow}>
                  <input type="color" value={hero.backgroundColor || "#3b5998"} onChange={e => updateSectionField("hero", "backgroundColor", e.target.value)} style={{ width: "40px", height: "36px", border: "1px solid #e2e8f0", borderRadius: "6px", cursor: "pointer", padding: "2px" }} />
                  <input style={{ ...s.input, flex: 1 }} value={hero.backgroundColor || "#3b5998"} onChange={e => updateSectionField("hero", "backgroundColor", e.target.value)} />
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
            {hero.doctorImage && (<div style={s.imgPreviewBox}><img src={hero.doctorImage} alt="Doctor" style={{ width: "100%", display: "block" }} /></div>)}
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

      {/* ── BREADCRUMB SECTION ──────────────────────── */}
      {activeSection === "breadcrumb" && (
        <div style={s.card}>
          <p style={s.cardTitle}><Layout size={16} color="#3b5998" /> Breadcrumb Configuration</p>
          <div style={s.grid2}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Parent Label (Home link text)</label>
              <input style={s.input} value={breadcrumb.parentLabel || ""} onChange={e => updateSectionField("breadcrumb", "parentLabel", e.target.value)} placeholder="Home" />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Parent URL</label>
              <input style={s.input} value={breadcrumb.parentUrl || ""} onChange={e => updateSectionField("breadcrumb", "parentUrl", e.target.value)} placeholder="/" />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Current Page Text</label>
              <input style={s.input} value={breadcrumb.currentPageText || ""} onChange={e => updateSectionField("breadcrumb", "currentPageText", e.target.value)} placeholder="About Dr Nivedita Dadu" />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Breadcrumb Bar Background Color</label>
              <div style={s.colorRow}>
                <input type="color" value={breadcrumb.backgroundColor || "#f8f9fa"} onChange={e => updateSectionField("breadcrumb", "backgroundColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                <input style={{ ...s.input, flex: 1 }} value={breadcrumb.backgroundColor || "#f8f9fa"} onChange={e => updateSectionField("breadcrumb", "backgroundColor", e.target.value)} />
              </div>
            </div>
          </div>
        </div>
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
              <input style={s.input} value={specialist.highlightedText || ""} onChange={e => updateSectionField("specialist", "highlightedText", e.target.value)} />
            </div>
          </div>
          <div style={s.card}>
            <p style={s.cardTitle}><Settings size={16} color="#3b5998" /> Treatment Bullets</p>
            {(specialist.bullets || []).map((bullet, idx) => (
              <div key={idx} style={s.bulletRow}>
                <input style={s.bulletInput} value={bullet} onChange={e => updateNestedField(`specialist.bullets.${idx}`, e.target.value)} placeholder={`Bullet ${idx + 1}`} />
                <button style={s.removeBtn} onClick={() => { const upd = [...(specialist.bullets || [])]; upd.splice(idx, 1); updateSectionField("specialist", "bullets", upd); }}><Trash2 size={14} /></button>
              </div>
            ))}
            <button style={s.addBtn} onClick={() => updateSectionField("specialist", "bullets", [...(specialist.bullets || []), "New Treatment"])}><Plus size={14} /> Add Bullet</button>
          </div>
          <div style={s.card}>
            <p style={s.cardTitle}><ImageIcon size={16} color="#3b5998" /> Section Colors</p>
            <div style={s.grid2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Section Background Color</label>
                <div style={s.colorRow}>
                  <input type="color" value={specialist.sectionBgColor || "#ffffff"} onChange={e => updateSectionField("specialist", "sectionBgColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                  <input style={{ ...s.input, flex: 1 }} value={specialist.sectionBgColor || "#ffffff"} onChange={e => updateSectionField("specialist", "sectionBgColor", e.target.value)} />
                </div>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Card Background Color</label>
                <div style={s.colorRow}>
                  <input type="color" value={specialist.cardBgColor || "#3b5998"} onChange={e => updateSectionField("specialist", "cardBgColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                  <input style={{ ...s.input, flex: 1 }} value={specialist.cardBgColor || "#3b5998"} onChange={e => updateSectionField("specialist", "cardBgColor", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── MEMBERSHIP SECTION ────────────────────────── */}
      {activeSection === "membership" && (
        <>
          <div style={s.card}>
            <p style={s.cardTitle}><Award size={16} color="#3b5998" /> Membership Section Settings</p>
            <div style={s.grid2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Section Heading</label>
                <input style={s.input} value={membership.sectionHeading || ""} onChange={e => updateSectionField("membership", "sectionHeading", e.target.value)} placeholder="MEMBERSHIP" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Background Color</label>
                <div style={s.colorRow}>
                  <input type="color" value={membership.sectionBgColor || "#ffffff"} onChange={e => updateSectionField("membership", "sectionBgColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                  <input style={{ ...s.input, flex: 1 }} value={membership.sectionBgColor || "#ffffff"} onChange={e => updateSectionField("membership", "sectionBgColor", e.target.value)} />
                </div>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Padding Top</label>
                <input style={s.input} value={membership.paddingTop || "60px"} onChange={e => updateSectionField("membership", "paddingTop", e.target.value)} placeholder="60px" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Padding Bottom</label>
                <input style={s.input} value={membership.paddingBottom || "60px"} onChange={e => updateSectionField("membership", "paddingBottom", e.target.value)} placeholder="60px" />
              </div>
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><ImageIcon size={16} color="#3b5998" /> Organisation Logos</p>
            {(membership.logos || []).map((logo, idx) => (
              <div key={idx} style={{ background: "#f8fafc", borderRadius: 8, padding: "14px", marginBottom: 12, border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Logo #{idx + 1}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <label style={{ fontSize: 12, color: "#475569", display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
                      <input type="checkbox" checked={logo.enabled !== false} onChange={e => updateNestedField(`membership.logos.${idx}.enabled`, e.target.checked)} /> Enabled
                    </label>
                    <button style={s.removeBtn} onClick={() => { const upd = [...(membership.logos || [])]; upd.splice(idx, 1); updateSectionField("membership", "logos", upd); }}><Trash2 size={13} /></button>
                  </div>
                </div>
                <div style={s.grid2}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Organisation Title</label>
                    <input style={s.input} value={logo.title || ""} onChange={e => updateNestedField(`membership.logos.${idx}.title`, e.target.value)} placeholder="EADV" />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>External Link (optional)</label>
                    <input style={s.input} value={logo.link || ""} onChange={e => updateNestedField(`membership.logos.${idx}.link`, e.target.value)} placeholder="https://..." />
                  </div>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Logo Image URL</label>
                  <input style={s.input} value={logo.imageUrl || ""} onChange={e => updateNestedField(`membership.logos.${idx}.imageUrl`, e.target.value)} placeholder="https://..." />
                </div>
                {logo.imageUrl && <div style={{ ...s.imgPreviewBox, maxWidth: 100 }}><img src={logo.imageUrl} alt={logo.title} style={{ width: "100%", display: "block" }} /></div>}
              </div>
            ))}
            <button style={s.addBtn} onClick={() => updateSectionField("membership", "logos", [...(membership.logos || []), { id: Date.now(), title: "New Organisation", imageUrl: "", link: "", enabled: true }])}>
              <Plus size={14} /> Add Logo
            </button>
          </div>
        </>
      )}

      {/* ── EDUCATION & EXPERIENCE ────────────────────── */}
      {activeSection === "education" && (
        <>
          <div style={s.card}>
            <p style={s.cardTitle}><BookOpen size={16} color="#3b5998" /> Section Settings</p>
            <div style={s.grid2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Education Card Title</label>
                <input style={s.input} value={eduExp.educationTitle || ""} onChange={e => updateSectionField("educationExperience", "educationTitle", e.target.value)} placeholder="EDUCATION" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Experience Card Title</label>
                <input style={s.input} value={eduExp.experienceTitle || ""} onChange={e => updateSectionField("educationExperience", "experienceTitle", e.target.value)} placeholder="EXPERIENCE" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Section Background Color</label>
                <div style={s.colorRow}>
                  <input type="color" value={eduExp.sectionBgColor || "#ffffff"} onChange={e => updateSectionField("educationExperience", "sectionBgColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                  <input style={{ ...s.input, flex: 1 }} value={eduExp.sectionBgColor || "#ffffff"} onChange={e => updateSectionField("educationExperience", "sectionBgColor", e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><BookOpen size={16} color="#3b5998" /> Education Items</p>
            {(eduExp.educationItems || []).map((item, idx) => (
              <div key={idx} style={{ background: "#f8fafc", borderRadius: 8, padding: "14px", marginBottom: 12, border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Education #{idx + 1}</span>
                  <button style={s.removeBtn} onClick={() => { const upd = [...(eduExp.educationItems || [])]; upd.splice(idx, 1); updateSectionField("educationExperience", "educationItems", upd); }}><Trash2 size={13} /></button>
                </div>
                <div style={s.grid2}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Degree / Qualification</label>
                    <input style={s.input} value={item.degree || ""} onChange={e => updateNestedField(`educationExperience.educationItems.${idx}.degree`, e.target.value)} placeholder="MBBS" />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Year</label>
                    <input style={s.input} value={item.year || ""} onChange={e => updateNestedField(`educationExperience.educationItems.${idx}.year`, e.target.value)} placeholder="2005" />
                  </div>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Institution</label>
                  <input style={s.input} value={item.institution || ""} onChange={e => updateNestedField(`educationExperience.educationItems.${idx}.institution`, e.target.value)} placeholder="Institution name" />
                </div>
              </div>
            ))}
            <button style={s.addBtn} onClick={() => updateSectionField("educationExperience", "educationItems", [...(eduExp.educationItems || []), { degree: "", institution: "", year: "" }])}>
              <Plus size={14} /> Add Education Item
            </button>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><Briefcase size={16} color="#3b5998" /> Experience Items</p>
            {(eduExp.experienceItems || []).map((item, idx) => (
              <div key={idx} style={{ background: "#f8fafc", borderRadius: 8, padding: "14px", marginBottom: 12, border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Experience #{idx + 1}</span>
                  <button style={s.removeBtn} onClick={() => { const upd = [...(eduExp.experienceItems || [])]; upd.splice(idx, 1); updateSectionField("educationExperience", "experienceItems", upd); }}><Trash2 size={13} /></button>
                </div>
                <div style={s.grid2}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Role / Position</label>
                    <input style={s.input} value={item.role || ""} onChange={e => updateNestedField(`educationExperience.experienceItems.${idx}.role`, e.target.value)} placeholder="Senior Dermatologist" />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Duration / Year</label>
                    <input style={s.input} value={item.duration || ""} onChange={e => updateNestedField(`educationExperience.experienceItems.${idx}.duration`, e.target.value)} placeholder="2004 - 2008" />
                  </div>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Hospital / Organisation</label>
                  <input style={s.input} value={item.hospital || ""} onChange={e => updateNestedField(`educationExperience.experienceItems.${idx}.hospital`, e.target.value)} placeholder="Hospital name" />
                </div>
              </div>
            ))}
            <button style={s.addBtn} onClick={() => updateSectionField("educationExperience", "experienceItems", [...(eduExp.experienceItems || []), { role: "", hospital: "", duration: "" }])}>
              <Plus size={14} /> Add Experience Item
            </button>
          </div>
        </>
      )}

      {/* ── CREDENTIALS SECTION ──────────────────────── */}
      {activeSection === "credentials" && (
        <>
          <div style={s.card}>
            <p style={s.cardTitle}><Briefcase size={16} color="#3b5998" /> Banner & Heading</p>
            <div style={s.fieldGroup}>
              <label style={s.label}>Banner Image URL</label>
              <input style={s.input} value={credentials.bannerImage || ""} onChange={e => updateSectionField("credentialsSection", "bannerImage", e.target.value)} placeholder="https://..." />
            </div>
            {credentials.bannerImage && (<div style={s.imgPreviewBox}><img src={credentials.bannerImage} alt="Banner" style={{ width: "100%", display: "block" }} /></div>)}
            <label style={s.uploadLabel}>
              {uploadingImage ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <ImageIcon size={13} />}
              {uploadingImage ? "Uploading..." : "Upload Banner Image"}
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, "credentialsSection", "bannerImage")} style={{ display: "none" }} disabled={uploadingImage} />
            </label>
            <div style={s.sectionDivider} />
            <div style={s.grid2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Section Heading</label>
                <input style={s.input} value={credentials.heading || ""} onChange={e => updateSectionField("credentialsSection", "heading", e.target.value)} placeholder="Credentials" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Banner Overlay Opacity (0.0 – 1.0)</label>
                <input type="number" min="0" max="1" step="0.05" style={s.input} value={credentials.overlayOpacity ?? 0.35} onChange={e => updateSectionField("credentialsSection", "overlayOpacity", parseFloat(e.target.value))} />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Padding Bottom</label>
                <input style={s.input} value={credentials.paddingBottom || "80px"} onChange={e => updateSectionField("credentialsSection", "paddingBottom", e.target.value)} placeholder="80px" />
              </div>
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><Award size={16} color="#3b5998" /> Credential Badges</p>
            {(credentials.credentialsList || []).map((cred, idx) => (
              <div key={idx} style={s.bulletRow}>
                <input style={s.bulletInput} value={cred.text || ""} onChange={e => updateNestedField(`credentialsSection.credentialsList.${idx}.text`, e.target.value)} placeholder={`Credential ${idx + 1}`} />
                <button style={s.removeBtn} onClick={() => { const upd = [...(credentials.credentialsList || [])]; upd.splice(idx, 1); updateSectionField("credentialsSection", "credentialsList", upd); }}><Trash2 size={14} /></button>
              </div>
            ))}
            <button style={s.addBtn} onClick={() => updateSectionField("credentialsSection", "credentialsList", [...(credentials.credentialsList || []), { text: "New Credential" }])}>
              <Plus size={14} /> Add Credential
            </button>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><BookOpen size={16} color="#3b5998" /> Editorial Content (Two Columns)</p>
            <div style={s.fieldGroup}>
              <label style={s.label}>Left Column Heading</label>
              <input style={s.input} value={credentials.leftHeading || ""} onChange={e => updateSectionField("credentialsSection", "leftHeading", e.target.value)} placeholder="EXPERTISE IN DERMATOLOGY & HAIR TREATMENT" />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Left Column Content (HTML supported)</label>
              <textarea style={{ ...s.textarea, minHeight: 140 }} value={credentials.leftText || ""} onChange={e => updateSectionField("credentialsSection", "leftText", e.target.value)} rows={6} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Right Column Heading</label>
              <input style={s.input} value={credentials.rightHeading || ""} onChange={e => updateSectionField("credentialsSection", "rightHeading", e.target.value)} placeholder="COMMITMENT TO PATIENT CARE" />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Right Column Content (HTML supported)</label>
              <textarea style={{ ...s.textarea, minHeight: 140 }} value={credentials.rightText || ""} onChange={e => updateSectionField("credentialsSection", "rightText", e.target.value)} rows={6} />
            </div>
          </div>
        </>
      )}

      {/* ── OTHER SPECIALITIES ────────────────────────── */}
      {activeSection === "other" && (
        <>
          <div style={s.card}>
            <p style={s.cardTitle}><Settings size={16} color="#3b5998" /> Section Settings</p>
            <div style={s.grid2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Section Heading</label>
                <input style={s.input} value={otherSpec.heading || ""} onChange={e => updateSectionField("otherSpecialitiesSection", "heading", e.target.value)} placeholder="Other Specialities" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Content Max Width</label>
                <input style={s.input} value={otherSpec.contentMaxWidth || "1200px"} onChange={e => updateSectionField("otherSpecialitiesSection", "contentMaxWidth", e.target.value)} placeholder="1200px" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Section Background Color</label>
                <div style={s.colorRow}>
                  <input type="color" value={otherSpec.backgroundColor || "#ffffff"} onChange={e => updateSectionField("otherSpecialitiesSection", "backgroundColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                  <input style={{ ...s.input, flex: 1 }} value={otherSpec.backgroundColor || "#ffffff"} onChange={e => updateSectionField("otherSpecialitiesSection", "backgroundColor", e.target.value)} />
                </div>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Card Background Color</label>
                <div style={s.colorRow}>
                  <input type="color" value={otherSpec.cardBackgroundColor || "#3b5998"} onChange={e => updateSectionField("otherSpecialitiesSection", "cardBackgroundColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                  <input style={{ ...s.input, flex: 1 }} value={otherSpec.cardBackgroundColor || "#3b5998"} onChange={e => updateSectionField("otherSpecialitiesSection", "cardBackgroundColor", e.target.value)} />
                </div>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Padding Top</label>
                <input style={s.input} value={otherSpec.paddingTop || "100px"} onChange={e => updateSectionField("otherSpecialitiesSection", "paddingTop", e.target.value)} placeholder="100px" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Padding Bottom</label>
                <input style={s.input} value={otherSpec.paddingBottom || "100px"} onChange={e => updateSectionField("otherSpecialitiesSection", "paddingBottom", e.target.value)} placeholder="100px" />
              </div>
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Intro Paragraph</label>
              <textarea style={s.textarea} value={otherSpec.introParagraph || ""} onChange={e => updateSectionField("otherSpecialitiesSection", "introParagraph", e.target.value)} rows={3} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Conclusion Paragraph (use **bold** for gold highlight)</label>
              <textarea style={s.textarea} value={otherSpec.conclusionParagraph || ""} onChange={e => updateSectionField("otherSpecialitiesSection", "conclusionParagraph", e.target.value)} rows={3} />
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><Star size={16} color="#3b5998" /> Speciality Bullets</p>
            {(otherSpec.specialitiesList || []).map((bullet, idx) => (
              <div key={idx} style={s.bulletRow}>
                <input style={s.bulletInput} value={bullet.title || ""} onChange={e => updateNestedField(`otherSpecialitiesSection.specialitiesList.${idx}.title`, e.target.value)} placeholder={`Speciality ${idx + 1}`} />
                <button style={s.removeBtn} onClick={() => { const upd = [...(otherSpec.specialitiesList || [])]; upd.splice(idx, 1); updateSectionField("otherSpecialitiesSection", "specialitiesList", upd); }}><Trash2 size={14} /></button>
              </div>
            ))}
            <button style={s.addBtn} onClick={() => updateSectionField("otherSpecialitiesSection", "specialitiesList", [...(otherSpec.specialitiesList || []), { title: "New Speciality," }])}>
              <Plus size={14} /> Add Speciality
            </button>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><ImageIcon size={16} color="#3b5998" /> Right Side Image</p>
            <div style={s.fieldGroup}>
              <label style={s.label}>Image URL</label>
              <input style={s.input} value={otherSpec.image || ""} onChange={e => updateSectionField("otherSpecialitiesSection", "image", e.target.value)} placeholder="https://..." />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Image Alt Text</label>
              <input style={s.input} value={otherSpec.imageAlt || ""} onChange={e => updateSectionField("otherSpecialitiesSection", "imageAlt", e.target.value)} placeholder="Dr. Nivedita Other Specialities" />
            </div>
            {otherSpec.image && (<div style={s.imgPreviewBox}><img src={otherSpec.image} alt={otherSpec.imageAlt} style={{ width: "100%", display: "block" }} /></div>)}
            <label style={s.uploadLabel}>
              {uploadingImage ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <ImageIcon size={13} />}
              {uploadingImage ? "Uploading..." : "Upload Section Image"}
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, "otherSpecialitiesSection", "image")} style={{ display: "none" }} disabled={uploadingImage} />
            </label>
          </div>
        </>
      )}

      {/* ── AS FEATURED IN SECTION ───────────────────── */}
      {activeSection === "featured" && (
        <>
          <div style={s.card}>
            <p style={s.cardTitle}><Star size={16} color="#3b5998" /> Section Settings</p>
            <div style={s.grid2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Section Heading</label>
                <input style={s.input} value={featuredIn.sectionHeading || ""} onChange={e => updateSectionField("featuredInSection", "sectionHeading", e.target.value)} placeholder="As Featured In" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Background Color</label>
                <div style={s.colorRow}>
                  <input type="color" value={featuredIn.sectionBgColor || "#ffffff"} onChange={e => updateSectionField("featuredInSection", "sectionBgColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                  <input style={{ ...s.input, flex: 1 }} value={featuredIn.sectionBgColor || "#ffffff"} onChange={e => updateSectionField("featuredInSection", "sectionBgColor", e.target.value)} />
                </div>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Padding Top</label>
                <input style={s.input} value={featuredIn.paddingTop || "72px"} onChange={e => updateSectionField("featuredInSection", "paddingTop", e.target.value)} placeholder="72px" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Padding Bottom</label>
                <input style={s.input} value={featuredIn.paddingBottom || "72px"} onChange={e => updateSectionField("featuredInSection", "paddingBottom", e.target.value)} placeholder="72px" />
              </div>
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Description Paragraph</label>
              <textarea style={s.textarea} value={featuredIn.descriptionText || ""} onChange={e => updateSectionField("featuredInSection", "descriptionText", e.target.value)} rows={3} />
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><ImageIcon size={16} color="#3b5998" /> Publication Logos</p>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Each publication appears as a bordered logo card. Upload an image or leave blank to show the title as text.</p>
            {(featuredIn.publications || []).map((pub, idx) => (
              <div key={idx} style={{ background: "#f8fafc", borderRadius: 8, padding: "14px", marginBottom: 12, border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Publication #{idx + 1}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <label style={{ fontSize: 12, color: "#475569", display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
                      <input type="checkbox" checked={pub.enabled !== false} onChange={e => updateNestedField(`featuredInSection.publications.${idx}.enabled`, e.target.checked)} /> Enabled
                    </label>
                    <button style={s.removeBtn} onClick={() => { const upd = [...(featuredIn.publications || [])]; upd.splice(idx, 1); updateSectionField("featuredInSection", "publications", upd); }}><Trash2 size={13} /></button>
                  </div>
                </div>
                <div style={s.grid2}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Publication Name</label>
                    <input style={s.input} value={pub.title || ""} onChange={e => updateNestedField(`featuredInSection.publications.${idx}.title`, e.target.value)} placeholder="NDTV" />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>External Link (optional)</label>
                    <input style={s.input} value={pub.link || ""} onChange={e => updateNestedField(`featuredInSection.publications.${idx}.link`, e.target.value)} placeholder="https://..." />
                  </div>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Logo Image URL</label>
                  <input style={s.input} value={pub.imageUrl || ""} onChange={e => updateNestedField(`featuredInSection.publications.${idx}.imageUrl`, e.target.value)} placeholder="https://..." />
                </div>
                {pub.imageUrl && <div style={{ ...s.imgPreviewBox, maxWidth: 120 }}><img src={pub.imageUrl} alt={pub.title} style={{ width: "100%", display: "block", objectFit: "contain" }} /></div>}
              </div>
            ))}
            <button style={s.addBtn} onClick={() => updateSectionField("featuredInSection", "publications", [...(featuredIn.publications || []), { id: Date.now(), title: "New Publication", imageUrl: "", link: "", enabled: true }])}>
              <Plus size={14} /> Add Publication
            </button>
          </div>
        </>
      )}

      {/* ── PATIENT CARE SECTION ─────────────────────── */}
      {activeSection === "patientcare" && (
        <>
          <div style={s.card}>
            <p style={s.cardTitle}><User size={16} color="#3b5998" /> Section Settings</p>
            <div style={s.grid2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Section Background Color</label>
                <div style={s.colorRow}>
                  <input type="color" value={patientCare.sectionBgColor || "#f8f9fa"} onChange={e => updateSectionField("patientCareSection", "sectionBgColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                  <input style={{ ...s.input, flex: 1 }} value={patientCare.sectionBgColor || "#f8f9fa"} onChange={e => updateSectionField("patientCareSection", "sectionBgColor", e.target.value)} />
                </div>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Content Max Width</label>
                <input style={s.input} value={patientCare.maxWidth || "1200px"} onChange={e => updateSectionField("patientCareSection", "maxWidth", e.target.value)} placeholder="1200px" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Padding Top</label>
                <input style={s.input} value={patientCare.paddingTop || "80px"} onChange={e => updateSectionField("patientCareSection", "paddingTop", e.target.value)} placeholder="80px" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Padding Bottom</label>
                <input style={s.input} value={patientCare.paddingBottom || "80px"} onChange={e => updateSectionField("patientCareSection", "paddingBottom", e.target.value)} placeholder="80px" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Cards Gap</label>
                <input style={s.input} value={patientCare.gridGap || "32px"} onChange={e => updateSectionField("patientCareSection", "gridGap", e.target.value)} placeholder="32px" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Card Border Radius</label>
                <input style={s.input} value={patientCare.cardBorderRadius || "0px"} onChange={e => updateSectionField("patientCareSection", "cardBorderRadius", e.target.value)} placeholder="0px" />
              </div>
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><Award size={16} color="#3b5998" /> Left Card — Patient Centred Care</p>
            <div style={s.grid2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Card Title</label>
                <input style={s.input} value={patientCare.leftCardTitle || ""} onChange={e => updateSectionField("patientCareSection", "leftCardTitle", e.target.value)} placeholder="Patient Centred Care" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Card Background Color</label>
                <div style={s.colorRow}>
                  <input type="color" value={patientCare.leftCardBgColor || "#ffffff"} onChange={e => updateSectionField("patientCareSection", "leftCardBgColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                  <input style={{ ...s.input, flex: 1 }} value={patientCare.leftCardBgColor || "#ffffff"} onChange={e => updateSectionField("patientCareSection", "leftCardBgColor", e.target.value)} />
                </div>
              </div>
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Card Content (HTML supported)</label>
              <textarea style={{ ...s.textarea, minHeight: 160 }} value={patientCare.leftCardContent || ""} onChange={e => updateSectionField("patientCareSection", "leftCardContent", e.target.value)} rows={7} />
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><Briefcase size={16} color="#3b5998" /> Right Card — Professionalism</p>
            <div style={s.grid2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Card Title</label>
                <input style={s.input} value={patientCare.rightCardTitle || ""} onChange={e => updateSectionField("patientCareSection", "rightCardTitle", e.target.value)} placeholder="Professionalism" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Card Background Color</label>
                <div style={s.colorRow}>
                  <input type="color" value={patientCare.rightCardBgColor || "#ffffff"} onChange={e => updateSectionField("patientCareSection", "rightCardBgColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                  <input style={{ ...s.input, flex: 1 }} value={patientCare.rightCardBgColor || "#ffffff"} onChange={e => updateSectionField("patientCareSection", "rightCardBgColor", e.target.value)} />
                </div>
              </div>
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Card Content (HTML supported)</label>
              <textarea style={{ ...s.textarea, minHeight: 160 }} value={patientCare.rightCardContent || ""} onChange={e => updateSectionField("patientCareSection", "rightCardContent", e.target.value)} rows={7} />
            </div>
          </div>
        </>
      )}

      {/* ── ASSOCIATIONS SECTION ─────────────────────────────────── */}
      {activeSection === "associations" && (
        <>
          <div style={s.card}>
            <p style={s.cardTitle}><Award size={16} color="#3b5998" /> Section Settings</p>
            <div style={s.grid2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Section Heading</label>
                <input style={s.input} value={associations.sectionHeading || ""} onChange={e => updateSectionField("associationsSection", "sectionHeading", e.target.value)} placeholder="ASSOCIATIONS" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Background Color</label>
                <div style={s.colorRow}>
                  <input type="color" value={associations.sectionBgColor || "#ffffff"} onChange={e => updateSectionField("associationsSection", "sectionBgColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                  <input style={{ ...s.input, flex: 1 }} value={associations.sectionBgColor || "#ffffff"} onChange={e => updateSectionField("associationsSection", "sectionBgColor", e.target.value)} />
                </div>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Padding Top</label>
                <input style={s.input} value={associations.paddingTop || "72px"} onChange={e => updateSectionField("associationsSection", "paddingTop", e.target.value)} placeholder="72px" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Padding Bottom</label>
                <input style={s.input} value={associations.paddingBottom || "72px"} onChange={e => updateSectionField("associationsSection", "paddingBottom", e.target.value)} placeholder="72px" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Logo Spacing (gap)</label>
                <input style={s.input} value={associations.logoSpacing || "24px"} onChange={e => updateSectionField("associationsSection", "logoSpacing", e.target.value)} placeholder="24px" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Logo Card Height</label>
                <input style={s.input} value={associations.logoHeight || "90px"} onChange={e => updateSectionField("associationsSection", "logoHeight", e.target.value)} placeholder="90px" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Logo Card Padding</label>
                <input style={s.input} value={associations.logoCardPadding || "20px 28px"} onChange={e => updateSectionField("associationsSection", "logoCardPadding", e.target.value)} placeholder="20px 28px" />
              </div>
            </div>
          </div>

          <div style={s.card}>
            <p style={s.cardTitle}><ImageIcon size={16} color="#3b5998" /> Association Logos</p>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Each association appears as a bordered logo card. Upload an image URL or leave blank to show the name as text. Logos load with a subtle grayscale effect and sharpen on hover.</p>
            {(associations.associations || []).map((assoc, idx) => (
              <div key={idx} style={{ background: "#f8fafc", borderRadius: 8, padding: "14px", marginBottom: 12, border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Association #{idx + 1}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <label style={{ fontSize: 12, color: "#475569", display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
                      <input type="checkbox" checked={assoc.enabled !== false} onChange={e => updateNestedField(`associationsSection.associations.${idx}.enabled`, e.target.checked)} /> Enabled
                    </label>
                    <button style={s.removeBtn} onClick={() => { const upd = [...(associations.associations || [])]; upd.splice(idx, 1); updateSectionField("associationsSection", "associations", upd); }}><Trash2 size={13} /></button>
                  </div>
                </div>
                <div style={s.grid2}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Association Name</label>
                    <input style={s.input} value={assoc.title || ""} onChange={e => updateNestedField(`associationsSection.associations.${idx}.title`, e.target.value)} placeholder="IADVL" />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>External Link (optional)</label>
                    <input style={s.input} value={assoc.link || ""} onChange={e => updateNestedField(`associationsSection.associations.${idx}.link`, e.target.value)} placeholder="https://..." />
                  </div>
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Logo Image URL</label>
                  <input style={s.input} value={assoc.imageUrl || ""} onChange={e => updateNestedField(`associationsSection.associations.${idx}.imageUrl`, e.target.value)} placeholder="https://..." />
                </div>
                {assoc.imageUrl && <div style={{ ...s.imgPreviewBox, maxWidth: 120 }}><img src={assoc.imageUrl} alt={assoc.title} style={{ width: "100%", display: "block", objectFit: "contain", maxHeight: 60 }} /></div>}
              </div>
            ))}
            <button style={s.addBtn} onClick={() => updateSectionField("associationsSection", "associations", [...(associations.associations || []), { id: Date.now(), title: "New Association", imageUrl: "", link: "", enabled: true }])}>
              <Plus size={14} /> Add Association
            </button>
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
          {seo.ogImage && (<div style={s.imgPreviewBox}><img src={seo.ogImage} alt="OG" style={{ width: "100%", display: "block" }} /></div>)}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
