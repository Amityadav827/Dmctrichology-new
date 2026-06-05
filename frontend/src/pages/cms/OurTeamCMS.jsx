import React, { useEffect, useState } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Eye, Image as ImageIcon, Loader2, Plus, Save, Settings, Trash2, Users } from "lucide-react";

const emptyData = {
  hero: {
    isEnabled: true,
    backgroundImage: "",
    pageTitle: "Our Team",
    breadcrumbLabel: "Our Team",
    overlayOpacity: 0.62
  },
  teamMembers: {
    isEnabled: true,
    members: []
  }
};

export default function OurTeamCMS() {
  const [data, setData] = useState(emptyData);
  const [activeSection, setActiveSection] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: res } = await axios.get("/our-team");
      if (res.success) {
        setData({
          hero: { ...emptyData.hero, ...(res.data?.hero || {}) },
          teamMembers: {
            ...emptyData.teamMembers,
            ...(res.data?.teamMembers || {}),
            members: Array.isArray(res.data?.teamMembers?.members)
              ? res.data.teamMembers.members.map((member, index) => ({
                  ...member,
                  shortDescription: member.shortDescription || member.description || "",
                  description: member.description || member.shortDescription || "",
                  sortOrder: member.sortOrder ?? ((index + 1) * 10)
                }))
              : emptyData.teamMembers.members
          }
        });
      }
    } catch (error) {
      toast.error("Failed to load Our Team CMS");
    } finally {
      setLoading(false);
    }
  };

  const updateSectionField = (section, field, value) => {
    setData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const updateMember = (index, field, value) => {
    setData(prev => {
      const members = [...(prev.teamMembers?.members || [])];
      members[index] = { ...(members[index] || {}), [field]: value };
      return { ...prev, teamMembers: { ...prev.teamMembers, members } };
    });
  };

  const addMember = () => {
    setData(prev => ({
      ...prev,
      teamMembers: {
        ...prev.teamMembers,
        members: [
          ...(prev.teamMembers?.members || []),
          { image: "", name: "", designation: "", qualification: "", shortDescription: "", description: "", profileLink: "", sortOrder: ((prev.teamMembers?.members || []).length + 1) * 10 }
        ]
      }
    }));
  };

  const removeMember = (index) => {
    setData(prev => ({
      ...prev,
      teamMembers: {
        ...prev.teamMembers,
        members: (prev.teamMembers?.members || []).filter((_, idx) => idx !== index)
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: res } = await axios.put("/our-team", data);
      if (res.success) {
        toast.success("Our Team page saved successfully");
        setData(res.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const { data: res } = await axios.post("/our-team/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.url;
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      updateSectionField("hero", "backgroundImage", await uploadImage(file));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleMemberImageUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      updateMember(index, "image", await uploadImage(file));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const previewUrl = `${import.meta.env.VITE_WEBSITE_URL || "http://localhost:3000"}/team-of-dmc`;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  const SectionTab = ({ id, label }) => (
    <button
      type="button"
      onClick={() => setActiveSection(id)}
      className={`flex items-center justify-center gap-2 px-4 py-3 text-[11px] font-black tracking-wider transition-all border-b-2 whitespace-nowrap ${
        activeSection === id ? "border-indigo-600 text-indigo-600 bg-indigo-50/40" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Users size={14} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Settings className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Our Team CMS</h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hero and team members</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => window.open(previewUrl, "_blank")} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
              <Eye size={16} /> Live Preview
            </button>
            <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 shadow-xl shadow-indigo-200 transition-all active:scale-95">
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save size={18} />}
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </div>
        </div>
        <div className="max-w-[1600px] mx-auto px-4 flex flex-wrap items-center gap-1 border-t border-slate-100 bg-white py-1">
          <SectionTab id="hero" label="HERO SECTION" />
          <SectionTab id="members" label="TEAM MEMBERS" />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 mt-12">
        {activeSection === "hero" && (
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
            <h3 className="text-lg font-black mb-8 text-slate-800">Hero Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <label className="flex items-center gap-3 md:col-span-2">
                <input type="checkbox" checked={!!data.hero?.isEnabled} onChange={e => updateSectionField("hero", "isEnabled", e.target.checked)} />
                <span className="text-sm font-black text-slate-700">Enable Hero</span>
              </label>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Page Title</label>
                <input value={data.hero?.pageTitle || ""} onChange={e => updateSectionField("hero", "pageTitle", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Breadcrumb Label</label>
                <input value={data.hero?.breadcrumbLabel || ""} onChange={e => updateSectionField("hero", "breadcrumbLabel", e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Overlay Opacity</label>
                <input type="number" min="0" max="1" step="0.05" value={data.hero?.overlayOpacity ?? 0.62} onChange={e => updateSectionField("hero", "overlayOpacity", Number(e.target.value))} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Background Image</label>
                <div className="flex gap-4 items-center">
                  <input value={data.hero?.backgroundImage || ""} onChange={e => updateSectionField("hero", "backgroundImage", e.target.value)} className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none" placeholder="https://..." />
                  <label className="cursor-pointer shrink-0">
                    <input type="file" className="hidden" accept="image/*" onChange={handleHeroImageUpload} disabled={uploadingImage} />
                    <span className="flex items-center gap-2 px-5 py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold text-sm border border-indigo-100">
                      {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />} Upload
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "members" && (
          <div className="space-y-8">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={!!data.teamMembers?.isEnabled} onChange={e => updateSectionField("teamMembers", "isEnabled", e.target.checked)} />
                  <span className="text-sm font-black text-slate-700">Enable Team Members</span>
                </label>
                <button type="button" onClick={addMember} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                  <Plus size={16} /> Add Member
                </button>
              </div>
            </div>

            {(data.teamMembers?.members || []).map((member, index) => (
              <div key={index} className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <h3 className="text-lg font-black text-slate-800">Member {index + 1}</h3>
                  <button type="button" onClick={() => removeMember(index)} className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all">
                    <Trash2 size={17} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input value={member.name || ""} onChange={e => updateMember(index, "name", e.target.value)} placeholder="Name" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none" />
                  <input value={member.designation || ""} onChange={e => updateMember(index, "designation", e.target.value)} placeholder="Designation" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none" />
                  <input value={member.qualification || ""} onChange={e => updateMember(index, "qualification", e.target.value)} placeholder="Qualification" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none" />
                  <input type="number" value={member.sortOrder ?? ""} onChange={e => updateMember(index, "sortOrder", Number(e.target.value))} placeholder="Sort Order" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none" />
                  <input value={member.profileLink || ""} onChange={e => updateMember(index, "profileLink", e.target.value)} placeholder="Profile Link" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none md:col-span-2" />
                  <textarea rows={4} value={member.shortDescription || member.description || ""} onChange={e => { updateMember(index, "shortDescription", e.target.value); updateMember(index, "description", e.target.value); }} placeholder="Description" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none resize-none md:col-span-2" />
                  <div className="md:col-span-2 flex gap-4 items-center">
                    <input value={member.image || ""} onChange={e => updateMember(index, "image", e.target.value)} placeholder="Image URL" className="flex-1 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none" />
                    <label className="cursor-pointer shrink-0">
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleMemberImageUpload(e, index)} disabled={uploadingImage} />
                      <span className="flex items-center gap-2 px-5 py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold text-sm border border-indigo-100">
                        {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />} Upload
                      </span>
                    </label>
                  </div>
                  {member.image && <img src={member.image} alt="" className="w-32 h-32 object-cover rounded-full border border-slate-200" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
