import React, { useState, useEffect } from "react";
import axios from "../../api/client";
import toast from "react-hot-toast";
import { Plus, Trash2, Save, Loader2, ChevronDown, ChevronRight, GripVertical, ArrowUp, ArrowDown, ExternalLink, Link as LinkIcon } from "lucide-react";

export default function NavigationCMS() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    axios.get("/header").then(res => {
      if (res.data?.data?.menuItems) {
        setMenuItems(res.data.data.menuItems);
      }
    }).catch(() => toast.error("Failed to load navigation")).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await axios.put("/header", { menuItems });
      toast.success("Navigation saved");
    } catch {
      toast.error("Failed to save navigation");
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    setMenuItems(prev => [...prev, { label: "New Item", link: "/", hasDropdown: false, submenu: [] }]);
  };

  const updateItem = (i, field, value) => {
    setMenuItems(prev => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const removeItem = (i) => {
    setMenuItems(prev => prev.filter((_, idx) => idx !== i));
  };

  const moveItem = (i, dir) => {
    setMenuItems(prev => {
      const next = [...prev];
      const j = dir === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const addSub = (i) => {
    setMenuItems(prev => {
      const next = [...prev];
      next[i] = { ...next[i], hasDropdown: true, submenu: [...(next[i].submenu || []), { label: "Sub Item", link: "/" }] };
      return next;
    });
    setExpandedItems(prev => ({ ...prev, [i]: true }));
  };

  const updateSub = (i, j, field, value) => {
    setMenuItems(prev => {
      const next = [...prev];
      const subs = [...(next[i].submenu || [])];
      subs[j] = { ...subs[j], [field]: value };
      next[i] = { ...next[i], submenu: subs };
      return next;
    });
  };

  const removeSub = (i, j) => {
    setMenuItems(prev => {
      const next = [...prev];
      const subs = next[i].submenu.filter((_, idx) => idx !== j);
      next[i] = { ...next[i], submenu: subs, hasDropdown: subs.length > 0 };
      return next;
    });
  };

  const moveSub = (i, j, dir) => {
    setMenuItems(prev => {
      const next = [...prev];
      const subs = [...next[i].submenu];
      const k = dir === "up" ? j - 1 : j + 1;
      if (k < 0 || k >= subs.length) return prev;
      [subs[j], subs[k]] = [subs[k], subs[j]];
      next[i] = { ...next[i], submenu: subs };
      return next;
    });
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Navigation</h1>
          <p className="text-sm text-gray-400 mt-1">Manage website header menu links and dropdowns</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-700 shadow-lg transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Menu"}
        </button>
      </div>

      {/* Menu Items */}
      <div className="space-y-3 mb-4">
        {menuItems.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
            No menu items yet. Click "Add Menu Item" to start.
          </div>
        )}

        {menuItems.map((item, i) => {
          const isExpanded = expandedItems[i];
          const hasSubs = item.submenu && item.submenu.length > 0;

          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Top-level item row */}
              <div className="flex items-center gap-3 p-4">
                {/* Drag handle / order */}
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveItem(i, "up")} disabled={i === 0} className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20"><ArrowUp size={14} /></button>
                  <button onClick={() => moveItem(i, "down")} disabled={i === menuItems.length - 1} className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20"><ArrowDown size={14} /></button>
                </div>

                <GripVertical size={16} className="text-gray-300 flex-shrink-0" />

                {/* Label */}
                <input
                  type="text"
                  value={item.label}
                  onChange={e => updateItem(i, "label", e.target.value)}
                  placeholder="Label"
                  className="flex-1 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                />

                {/* Link */}
                <div className="relative flex-1 min-w-0">
                  <LinkIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={item.link}
                    onChange={e => updateItem(i, "link", e.target.value)}
                    placeholder="/page-url"
                    className="w-full pl-8 pr-3 py-2 text-sm font-mono border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Dropdown toggle */}
                <button
                  onClick={() => setExpandedItems(prev => ({ ...prev, [i]: !isExpanded }))}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${hasSubs ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-gray-50 border-gray-200 text-gray-400"}`}
                  title="Toggle dropdown items"
                >
                  {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  {hasSubs ? `${item.submenu.length} sub` : "Sub"}
                </button>

                {/* Delete */}
                <button onClick={() => removeItem(i)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Sub-items */}
              {isExpanded && (
                <div className="bg-gray-50 border-t border-gray-100 px-4 pb-4 pt-3 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Dropdown Items</p>

                  {(item.submenu || []).map((sub, j) => (
                    <div key={j} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 border border-gray-200">
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => moveSub(i, j, "up")} disabled={j === 0} className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20"><ArrowUp size={12} /></button>
                        <button onClick={() => moveSub(i, j, "down")} disabled={j === (item.submenu.length - 1)} className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20"><ArrowDown size={12} /></button>
                      </div>
                      <input
                        type="text"
                        value={sub.label}
                        onChange={e => updateSub(i, j, "label", e.target.value)}
                        placeholder="Label"
                        className="flex-1 px-3 py-1.5 text-sm font-semibold border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                      />
                      <div className="relative flex-1 min-w-0">
                        <LinkIcon size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={sub.link}
                          onChange={e => updateSub(i, j, "link", e.target.value)}
                          placeholder="/sub-url"
                          className="w-full pl-7 pr-3 py-1.5 text-sm font-mono border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button onClick={() => removeSub(i, j)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addSub(i)}
                    className="flex items-center gap-2 text-blue-600 text-xs font-bold bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all w-full justify-center"
                  >
                    <Plus size={13} /> Add Dropdown Item
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Item */}
      <button
        onClick={addItem}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-gray-300 text-gray-500 font-bold text-sm hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
      >
        <Plus size={16} /> Add Menu Item
      </button>
    </div>
  );
}
