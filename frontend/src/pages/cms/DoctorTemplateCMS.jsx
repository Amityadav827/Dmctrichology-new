import React, { useEffect, useState } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Eye, Image as ImageIcon, Loader2, Plus, Save, Trash2 } from "lucide-react";

const fallbackImage = "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1779383176156-167720490.webp";

const defaultData = {
  hero: {
    galleryImage: fallbackImage,
    doctorImage: fallbackImage,
    mainHeading: "",
    doctorName: "",
    degreeText: "",
    descriptionParagraph: "",
    namePlaceholder: "Name*",
    phonePlaceholder: "Mobile Number*",
    captchaPlaceholder: "Code*",
    submitButtonText: "Schedule Your Visit"
  },
  breadcrumb: { title: "", parentLabel: "Home", parentUrl: "/", currentPageText: "" },
  formSettings: { title: "", subtitle: "", successMessage: "" },
  specialist: { heading: "", description1: "", description2: "", highlightedText: "", bullets: [], featureCards: [] },
  timeline: { eyebrow: "TRUSTED CARE SERVICES", heading: "", steps: [] },
  trustSection: { eyebrow: "TRUSTED CARE SERVICES", heading: "", image: fallbackImage, imageAlt: "", trustPoints: [], conclusionParagraph: "" },
  educationExperience: {
    experienceTabLabel: "Experience",
    educationTabLabel: "Education",
    credentialsTabLabel: "Credentials",
    topImage: fallbackImage,
    bottomImage: fallbackImage,
    experienceItems: [],
    educationItems: []
  },
  credentialsSection: { heading: "Credentials", credentialsList: [] },
  otherSpecialitiesSection: { heading: "Other Specialities", introParagraph: "", specialitiesList: [], conclusionParagraph: "", image: fallbackImage, imageAlt: "" },
  testimonialsSection: { heading: "Patient Testimonials", testimonials: [] },
  faqSection: { enabled: true, badgeText: "TRUSTED CARE SERVICES", heading: "Frequently Asked Question?", buttonText: "View All Questions", categories: [] },
  seo: { metaTitle: "", metaDescription: "", ogImage: "" }
};

function mergeDefaults(base, source) {
  if (Array.isArray(base)) return Array.isArray(source) ? source : base;
  if (!base || typeof base !== "object") return source ?? base;
  const output = { ...base, ...(source && typeof source === "object" ? source : {}) };
  Object.keys(base).forEach(key => {
    output[key] = mergeDefaults(base[key], source?.[key]);
  });
  return output;
}

function setDeepValue(source, path, value) {
  const copy = JSON.parse(JSON.stringify(source));
  const parts = path.split(".");
  let current = copy;
  for (let i = 0; i < parts.length - 1; i += 1) {
    if (!current[parts[i]]) current[parts[i]] = Number.isNaN(Number(parts[i + 1])) ? {} : [];
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
  return copy;
}

function getDeepValue(source, path, fallback = "") {
  return path.split(".").reduce((acc, part) => acc?.[part], source) ?? fallback;
}

export default function DoctorTemplateCMS({ endpoint, uploadEndpoint, title, previewPath }) {
  const [data, setData] = useState(defaultData);
  const [active, setActive] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");

  useEffect(() => {
    let mounted = true;
    axios.get(endpoint)
      .then(({ data: res }) => {
        if (mounted && res?.success) setData(mergeDefaults(defaultData, res.data || {}));
      })
      .catch(() => toast.error(`Failed to load ${title}`))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [endpoint, title]);

  const update = (path, value) => setData(prev => setDeepValue(prev, path, value));

  const save = async () => {
    setSaving(true);
    try {
      const { data: res } = await axios.put(endpoint, data);
      if (res?.success) {
        setData(mergeDefaults(defaultData, res.data || data));
        toast.success(`${title} saved successfully`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (event, path) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setUploading(path);
    try {
      const { data: res } = await axios.post(uploadEndpoint, formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (res?.success && res.url) {
        update(path, res.url);
        toast.success("Image uploaded");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Image upload failed");
    } finally {
      setUploading("");
      event.target.value = "";
    }
  };

  const addItem = (path, item) => update(path, [...getDeepValue(data, path, []), item]);
  const updateItem = (path, index, field, value) => {
    const items = [...getDeepValue(data, path, [])];
    items[index] = { ...(items[index] || {}), [field]: value };
    update(path, items);
  };
  const removeItem = (path, index) => update(path, getDeepValue(data, path, []).filter((_, idx) => idx !== index));

  const Field = ({ label, path, multiline = false }) => (
    <div className="dt-field">
      <label>{label}</label>
      {multiline ? (
        <textarea value={getDeepValue(data, path)} onChange={e => update(path, e.target.value)} rows={4} />
      ) : (
        <input value={getDeepValue(data, path)} onChange={e => update(path, e.target.value)} />
      )}
    </div>
  );

  const ImageField = ({ label, path }) => (
    <div className="dt-field">
      <label>{label}</label>
      <div className="dt-upload-row">
        <input value={getDeepValue(data, path)} onChange={e => update(path, e.target.value)} placeholder="https://..." />
        <label className="dt-upload-btn">
          {uploading === path ? <Loader2 size={14} className="spin" /> : <ImageIcon size={14} />}
          Upload
          <input type="file" accept="image/*,video/*" onChange={e => uploadImage(e, path)} hidden />
        </label>
      </div>
      {getDeepValue(data, path) && <img className="dt-preview" src={getDeepValue(data, path)} alt="" />}
    </div>
  );

  const TextList = ({ title: listTitle, path, itemLabel = "Item" }) => (
    <div className="dt-card">
      <div className="dt-row-title">
        <h3>{listTitle}</h3>
        <button type="button" onClick={() => addItem(path, path.includes("credentials") || path.includes("specialities") ? { text: "" } : "")}><Plus size={14} /> Add</button>
      </div>
      {getDeepValue(data, path, []).map((item, index) => {
        const objectItem = typeof item === "object";
        const value = objectItem ? (item.title ?? item.text ?? "") : item;
        return (
          <div className="dt-inline" key={`${path}-${index}`}>
            <input value={value} onChange={e => {
              const items = [...getDeepValue(data, path, [])];
              items[index] = objectItem
                ? { ...item, [item.title !== undefined ? "title" : "text"]: e.target.value }
                : e.target.value;
              update(path, items);
            }} placeholder={`${itemLabel} ${index + 1}`} />
            <button type="button" className="dt-danger" onClick={() => removeItem(path, index)}><Trash2 size={14} /></button>
          </div>
        );
      })}
    </div>
  );

  const Repeater = ({ title: repeaterTitle, path, fields, newItem }) => (
    <div className="dt-card">
      <div className="dt-row-title">
        <h3>{repeaterTitle}</h3>
        <button type="button" onClick={() => addItem(path, newItem)}><Plus size={14} /> Add</button>
      </div>
      {getDeepValue(data, path, []).map((item, index) => (
        <div className="dt-repeater" key={`${path}-${index}`}>
          <div className="dt-row-title">
            <strong>{repeaterTitle} #{index + 1}</strong>
            <button type="button" className="dt-danger" onClick={() => removeItem(path, index)}><Trash2 size={14} /></button>
          </div>
          <div className="dt-grid">
            {fields.map(field => (
              <div className="dt-field" key={field.name}>
                <label>{field.label}</label>
                {field.multiline ? (
                  <textarea value={item[field.name] || ""} onChange={e => updateItem(path, index, field.name, e.target.value)} rows={3} />
                ) : (
                  <input value={item[field.name] || ""} onChange={e => updateItem(path, index, field.name, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) return <div className="dt-loading"><Loader2 className="spin" /> Loading...</div>;

  const tabs = [
    ["hero", "Hero"],
    ["specialist", "Specialist"],
    ["timeline", "Timeline"],
    ["trust", "Trust"],
    ["education", "Experience"],
    ["other", "Other"],
    ["testimonials", "Testimonials"],
    ["faq", "FAQ"],
    ["seo", "SEO"]
  ];

  return (
    <div className="dt-page">
      <div className="dt-header">
        <div>
          <p className="dt-kicker">CMS PAGE</p>
          <h1>{title}</h1>
        </div>
        <div className="dt-actions">
          <a href={`${import.meta.env.VITE_WEBSITE_URL || "http://localhost:3000"}${previewPath}`} target="_blank" rel="noreferrer"><Eye size={15} /> Preview</a>
          <button type="button" onClick={save} disabled={saving}>{saving ? <Loader2 size={15} className="spin" /> : <Save size={15} />} Save Changes</button>
        </div>
      </div>

      <div className="dt-tabs">
        {tabs.map(([id, label]) => <button key={id} type="button" className={active === id ? "active" : ""} onClick={() => setActive(id)}>{label}</button>)}
      </div>

      {active === "hero" && (
        <>
          <div className="dt-card dt-grid">
            <Field label="Hero Label" path="hero.mainHeading" />
            <Field label="Main Name / Heading" path="hero.doctorName" />
            <Field label="Degree / Subtitle" path="hero.degreeText" />
            <Field label="Page Title" path="breadcrumb.title" />
            <Field label="Breadcrumb Current Text" path="breadcrumb.currentPageText" />
            <Field label="Submit Button Text" path="hero.submitButtonText" />
            <Field label="Description" path="hero.descriptionParagraph" multiline />
          </div>
          <div className="dt-card dt-grid">
            <ImageField label="Large Gallery Image" path="hero.galleryImage" />
            <ImageField label="Doctor / Main Image" path="hero.doctorImage" />
          </div>
          <div className="dt-card dt-grid">
            <Field label="Form Title" path="formSettings.title" />
            <Field label="Form Subtitle" path="formSettings.subtitle" />
            <Field label="Success Message" path="formSettings.successMessage" />
          </div>
        </>
      )}

      {active === "specialist" && (
        <>
          <div className="dt-card dt-grid">
            <Field label="Heading" path="specialist.heading" />
            <Field label="Highlighted Text" path="specialist.highlightedText" />
            <Field label="Description 1" path="specialist.description1" multiline />
            <Field label="Description 2" path="specialist.description2" multiline />
          </div>
          <TextList title="Treatment Bullet List" path="specialist.bullets" itemLabel="Bullet" />
          <Repeater title="Feature Cards" path="specialist.featureCards" fields={[{ name: "title", label: "Title" }]} newItem={{ title: "" }} />
        </>
      )}

      {active === "timeline" && (
        <>
          <div className="dt-card dt-grid">
            <Field label="Eyebrow" path="timeline.eyebrow" />
            <Field label="Heading" path="timeline.heading" />
          </div>
          <Repeater title="Timeline / Feature Rows" path="timeline.steps" fields={[
            { name: "icon", label: "Icon URL" },
            { name: "title", label: "Title" },
            { name: "description", label: "Description", multiline: true }
          ]} newItem={{ icon: "", title: "", description: "" }} />
        </>
      )}

      {active === "trust" && (
        <>
          <div className="dt-card dt-grid">
            <Field label="Eyebrow" path="trustSection.eyebrow" />
            <Field label="Heading" path="trustSection.heading" />
            <Field label="Image Alt Text" path="trustSection.imageAlt" />
            <Field label="Conclusion Paragraph" path="trustSection.conclusionParagraph" multiline />
            <ImageField label="Section Image" path="trustSection.image" />
          </div>
          <Repeater title="Trust Content Blocks" path="trustSection.trustPoints" fields={[
            { name: "title", label: "Title" },
            { name: "description", label: "Description", multiline: true }
          ]} newItem={{ title: "", description: "" }} />
        </>
      )}

      {active === "education" && (
        <>
          <div className="dt-card dt-grid">
            <Field label="Tab 1 Label" path="educationExperience.experienceTabLabel" />
            <Field label="Tab 2 Label" path="educationExperience.educationTabLabel" />
            <Field label="Tab 3 Label" path="educationExperience.credentialsTabLabel" />
            <ImageField label="Top Image" path="educationExperience.topImage" />
            <ImageField label="Bottom Image" path="educationExperience.bottomImage" />
          </div>
          <Repeater title="Experience Items" path="educationExperience.experienceItems" fields={[
            { name: "role", label: "Title" },
            { name: "hospital", label: "Subtitle" },
            { name: "duration", label: "Date / Label" }
          ]} newItem={{ role: "", hospital: "", duration: "" }} />
          <Repeater title="Education Items" path="educationExperience.educationItems" fields={[
            { name: "degree", label: "Title" },
            { name: "institution", label: "Subtitle" },
            { name: "year", label: "Date / Label" }
          ]} newItem={{ degree: "", institution: "", year: "" }} />
          <TextList title="Credentials List" path="credentialsSection.credentialsList" itemLabel="Credential" />
        </>
      )}

      {active === "other" && (
        <>
          <div className="dt-card dt-grid">
            <Field label="Heading" path="otherSpecialitiesSection.heading" />
            <Field label="Image Alt Text" path="otherSpecialitiesSection.imageAlt" />
            <Field label="Intro Paragraph" path="otherSpecialitiesSection.introParagraph" multiline />
            <Field label="Conclusion Paragraph" path="otherSpecialitiesSection.conclusionParagraph" multiline />
            <ImageField label="Section Image" path="otherSpecialitiesSection.image" />
          </div>
          <TextList title="Specialities List" path="otherSpecialitiesSection.specialitiesList" itemLabel="Speciality" />
        </>
      )}

      {active === "testimonials" && (
        <>
          <div className="dt-card"><Field label="Section Heading" path="testimonialsSection.heading" /></div>
          <Repeater title="Testimonials" path="testimonialsSection.testimonials" fields={[
            { name: "image", label: "Patient Image URL" },
            { name: "text", label: "Text", multiline: true },
            { name: "patientName", label: "Patient Name" },
            { name: "disclaimer", label: "Disclaimer" },
            { name: "stars", label: "Stars" }
          ]} newItem={{ image: "", text: "", patientName: "", disclaimer: "* Opinions/Results may vary from person to person.", stars: 5 }} />
        </>
      )}

      {active === "faq" && (
        <>
          <div className="dt-card dt-grid">
            <Field label="Badge Text" path="faqSection.badgeText" />
            <Field label="Heading" path="faqSection.heading" />
            <Field label="Button Text" path="faqSection.buttonText" />
          </div>
          <Repeater title="FAQ Categories" path="faqSection.categories" fields={[
            { name: "title", label: "Category Title" }
          ]} newItem={{ title: "General", faqs: [] }} />
          {getDeepValue(data, "faqSection.categories", []).map((cat, catIndex) => (
            <Repeater key={catIndex} title={`${cat.title || "Category"} FAQs`} path={`faqSection.categories.${catIndex}.faqs`} fields={[
              { name: "question", label: "Question" },
              { name: "answer", label: "Answer", multiline: true }
            ]} newItem={{ question: "", answer: "" }} />
          ))}
        </>
      )}

      {active === "seo" && (
        <div className="dt-card dt-grid">
          <Field label="Meta Title" path="seo.metaTitle" />
          <Field label="OG Image" path="seo.ogImage" />
          <Field label="Meta Description" path="seo.metaDescription" multiline />
        </div>
      )}

      <style>{`
        .dt-page{padding:28px;max-width:1280px;font-family:Inter,system-ui,sans-serif;color:#0f172a}
        .dt-header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px;flex-wrap:wrap}
        .dt-kicker{margin:0 0 4px;color:#3b5998;font-weight:900;font-size:11px;letter-spacing:.16em}
        .dt-header h1{font-size:28px;margin:0;font-weight:800}
        .dt-actions{display:flex;gap:10px;align-items:center}
        .dt-actions a,.dt-actions button,.dt-row-title button{display:inline-flex;align-items:center;gap:8px;border:0;border-radius:12px;padding:12px 18px;font-weight:800;text-decoration:none;cursor:pointer}
        .dt-actions a{background:#f1f5f9;color:#334155}
        .dt-actions button,.dt-row-title button{background:#3b5998;color:white}
        .dt-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:22px}
        .dt-tabs button{border:1px solid #e2e8f0;background:#fff;color:#64748b;border-radius:999px;padding:10px 16px;font-weight:800;cursor:pointer}
        .dt-tabs button.active{background:#3b5998;color:#fff;border-color:#3b5998}
        .dt-card{background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:22px;margin-bottom:18px;box-shadow:0 10px 28px rgba(15,23,42,.04)}
        .dt-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
        .dt-field label{display:block;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#64748b;margin-bottom:8px}
        .dt-field input,.dt-field textarea,.dt-inline input{width:100%;box-sizing:border-box;border:1px solid #e2e8f0;border-radius:12px;padding:12px 14px;font:inherit;outline:none;background:#f8fafc}
        .dt-field textarea{resize:vertical}
        .dt-upload-row,.dt-inline,.dt-row-title{display:flex;align-items:center;gap:10px}
        .dt-upload-row input,.dt-inline input{flex:1}
        .dt-upload-btn{display:inline-flex;align-items:center;gap:8px;background:#eef2ff;color:#3b5998;border-radius:12px;padding:12px 14px;font-weight:900;cursor:pointer;white-space:nowrap}
        .dt-preview{display:block;margin-top:12px;max-width:180px;max-height:130px;object-fit:cover;border-radius:12px;border:1px solid #e2e8f0}
        .dt-row-title{justify-content:space-between;margin-bottom:14px}
        .dt-row-title h3{margin:0;font-size:17px}
        .dt-repeater{border:1px dashed #cbd5e1;border-radius:14px;padding:16px;margin-bottom:14px;background:#f8fafc}
        .dt-danger{background:#fff1f2!important;color:#e11d48!important;border:1px solid #fecdd3!important;padding:10px!important}
        .dt-loading{padding:40px;display:flex;gap:10px;align-items:center}
        .spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:800px){.dt-grid{grid-template-columns:1fr}.dt-page{padding:16px}.dt-actions{width:100%}.dt-actions a,.dt-actions button{flex:1;justify-content:center}}
      `}</style>
    </div>
  );
}
