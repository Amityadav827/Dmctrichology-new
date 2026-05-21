import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { 
  Calendar, Search, Mail, Phone, MessageSquare, 
  Trash2, Eye, Download, Filter, ChevronLeft, 
  ChevronRight, CalendarDays, Clock, User,
  CheckCircle, PhoneOutgoing, ExternalLink, X, Save,
  Check, ChevronDown, CheckSquare, Square, AlertTriangle, Loader2, Inbox
} from "lucide-react";
import Loader from "../components/Loader";
import {
  getDrNandaniLeads,
  updateDrNandaniLead,
  deleteDrNandaniLead,
  bulkDeleteDrNandaniLeads,
  exportDrNandaniLeadsCsv
} from "../api/services";

const statusOptions = [
  { label: "New", value: "new", color: "bg-blue-100 text-blue-700" },
  { label: "Contacted", value: "contacted", color: "bg-amber-100 text-amber-700" },
  { label: "Scheduled", value: "scheduled", color: "bg-indigo-100 text-indigo-700" },
  { label: "Converted", value: "converted", color: "bg-emerald-100 text-emerald-700" },
];

const sortOptions = [
  { label: "Latest Created", value: "createdAt-desc" },
  { label: "Oldest Created", value: "createdAt-asc" },
  { label: "Latest Appt.", value: "appointmentDate-desc" },
  { label: "Upcoming Appt.", value: "appointmentDate-asc" },
];

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    const day = date.getDate();
    const month = date.toLocaleDateString("en-IN", { month: "short" });
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeStr = `${hours}:${minutes} ${ampm}`;
    
    return `${day} ${month} ${year} • ${timeStr}`;
  } catch (err) {
    return "Invalid Date";
  }
};

function DrNandaniLeads() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  
  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  
  // Selection states
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionId, setActionId] = useState("");
  const [exporting, setExporting] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // CRM Modal State
  const [crmModal, setCrmModal] = useState({ open: false, item: null });
  const [crmForm, setCrmForm] = useState({ status: "", notes: "" });
  const [savingCrm, setSavingCrm] = useState(false);

  const fetchItems = async (page = pagination.page) => {
    setLoading(true);
    try {
      const response = await getDrNandaniLeads({
        page,
        limit: pagination.limit,
        search,
        status,
        startDate,
        endDate,
        sortBy,
        sortOrder,
      });
      setItems(response.data || []);
      setPagination(response.pagination || { page, limit: 10, total: 0, totalPages: 1 });
      
      // Keep only selected IDs that are actually present on current fetch
      const currentIds = (response.data || []).map(i => i._id);
      setSelectedIds(prev => prev.filter(id => currentIds.includes(id)));
    } catch (error) {
      toast.error("Unable to load Dr. Nandani leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchItems(1), 500);
    return () => clearTimeout(timer);
  }, [search, status, startDate, endDate, sortBy, sortOrder]);

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    setActionId(id);
    
    const previousItems = [...items];
    setItems(prev => prev.filter(item => item._id !== id));
    setSelectedIds(prev => prev.filter(x => x !== id));

    try {
      await deleteDrNandaniLead(id);
      toast.success("Lead deleted successfully from Dr. Nandani Leads");
      fetchItems(pagination.page);
    } catch (error) {
      setItems(previousItems);
      toast.error("Delete failed");
    } finally {
      setActionId("");
    }
  };

  const handleQuickContact = async (id, e) => {
    if (e) e.stopPropagation();
    setActionId(id);
    
    const previousItems = [...items];
    setItems(prev => prev.map(item => item._id === id ? { ...item, status: "contacted" } : item));

    try {
      await updateDrNandaniLead(id, { status: "contacted" });
      toast.success("Lead marked as contacted successfully");
    } catch (error) {
      setItems(previousItems);
      toast.error("Status update failed");
    } finally {
      setActionId("");
    }
  };

  const handleSelectId = (id, e) => {
    if (e) e.stopPropagation();
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const pageIds = items.map(item => item._id);
    const allSelected = pageIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...pageIds])]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setActionId("bulk");

    const previousItems = [...items];
    setItems(prev => prev.filter(item => !selectedIds.includes(item._id)));

    try {
      await bulkDeleteDrNandaniLeads({ ids: selectedIds });
      toast.success("Selected leads deleted successfully");
      setSelectedIds([]);
      setShowModal(false);
      fetchItems(1);
    } catch (error) {
      setItems(previousItems);
      toast.error("Bulk delete failed");
    } finally {
      setActionId("");
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportDrNandaniLeadsCsv({
        search,
        status,
        startDate,
        endDate
      });
      toast.success("Leads exported successfully");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const openCRMModal = (item, e) => {
    if (e) e.stopPropagation();
    setCrmModal({ open: true, item });
    setCrmForm({ 
      status: item.status || "new", 
      notes: item.notes || "" 
    });
  };

  const closeCRMModal = () => {
    setCrmModal({ open: false, item: null });
  };

  const handleSaveCRM = async (e) => {
    e.preventDefault();
    setSavingCrm(true);
    try {
      await updateDrNandaniLead(crmModal.item._id, crmForm);
      toast.success("CRM data updated successfully");
      closeCRMModal();
      fetchItems(pagination.page);
    } catch (error) {
      toast.error("Failed to save CRM data");
    } finally {
      setSavingCrm(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Dr. Nandani Dadu Leads</h3>
          <p className="text-sm text-slate-500 mt-1">Monitor and manage leads from Dr. Nandani Dadu's isolated private desk consultation form</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-semibold text-sm border border-red-200 shadow-sm"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800 transition shadow-lg disabled:opacity-50"
          >
            {exporting ? <Loader2 className="animate-spin h-4 w-4" /> : <Download size={16} />}
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone or service..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none font-medium"
          />
        </div>
        <div className="relative">
          <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none font-medium"
          />
        </div>
        <div className="relative">
          <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none font-medium"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 outline-none hover:bg-white hover:border-slate-200 transition-all duration-200 cursor-pointer"
          >
            <span className="truncate">
              {sortOptions.find(opt => opt.value === `${sortBy}-${sortOrder}`)?.label || "Latest Created"}
            </span>
            <ChevronDown 
              size={18} 
              className={`text-slate-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {isSortOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsSortOpen(false)}
              ></div>
              <div className="absolute right-0 top-full mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-xl z-20 overflow-hidden">
                <div className="p-1.5 max-h-[220px] overflow-y-auto scrollbar-hide space-y-0.5">
                  {sortOptions.map((option) => {
                    const isSelected = `${sortBy}-${sortOrder}` === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          const [field, order] = option.value.split("-");
                          setSortBy(field);
                          setSortOrder(order);
                          setIsSortOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                          isSelected 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span>{option.label}</span>
                        {isSelected && <Check size={14} className="text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {loading && items.length === 0 ? (
        <Loader label="Retrieving Dr. Nandani leads..." />
      ) : items.length === 0 ? (
        /* Empty State Card */
        <div className="bg-white/50 backdrop-blur-md rounded-[28px] border border-slate-100 p-12 text-center max-w-xl mx-auto my-12 shadow-sm">
          <div className="w-16 h-16 bg-blue-50/80 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-100 shadow-inner">
            <Inbox className="h-8 w-8 text-blue-600" />
          </div>
          <h4 className="text-xl font-bold text-gray-800 mb-2">No leads yet</h4>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
            Submissions from Dr. Nandani Dadu's private desk consultation form will appear here.
          </p>
        </div>
      ) : (
        /* Table */
        <div className="bg-white rounded-[28px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left w-10">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                    >
                      {items.length > 0 && items.every(item => selectedIds.includes(item._id)) ? (
                        <CheckSquare className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Lead Details</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Appointment Details</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => {
                  const isSelected = selectedIds.includes(item._id);
                  return (
                    <tr 
                      key={item._id} 
                      onClick={(e) => openCRMModal(item, e)}
                      className={`hover:bg-slate-50/80 transition-colors duration-200 cursor-pointer group ${
                        isSelected ? 'bg-blue-50/10' : ''
                      }`}
                    >
                      <td className="px-6 py-4 w-10" onClick={e => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => handleSelectId(item._id, e)}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Square className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-bold text-slate-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                            <User size={14} className="text-blue-500" />
                            {item.name}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                            <Mail size={12} className="text-slate-400" />
                            {item.email}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                            <Phone size={12} className="text-slate-400" />
                            {item.mobile}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="text-[11px] font-bold text-slate-700 flex items-center gap-2">
                            <Calendar size={14} className="text-indigo-500" />
                            {new Date(item.appointmentDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                            <Clock size={12} />
                            Applied: {formatDate(item.createdAt)}
                          </div>
                          <div className="text-[10px] font-semibold text-slate-500">
                            Service: {item.service}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          statusOptions.find(o => o.value === item.status)?.color || 'bg-slate-100 text-slate-600'
                        }`}>
                          {statusOptions.find(o => o.value === item.status)?.label || item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <a
                             href={`tel:${item.mobile}`}
                             className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition border border-emerald-100"
                             title="Call Lead"
                          >
                             <PhoneOutgoing size={16} />
                          </a>
                          <a
                             href={`mailto:${item.email}`}
                             className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition border border-blue-100"
                             title="Send Email"
                          >
                             <Mail size={16} />
                          </a>
                          <button
                            onClick={(e) => handleQuickContact(item._id, e)}
                            className="p-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition border border-amber-100"
                            title="Mark Contacted"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={(e) => openCRMModal(item, e)}
                            className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition border border-slate-200"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={(e) => handleDelete(item._id, e)}
                            disabled={actionId === item._id}
                            className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition border border-red-100"
                            title="Delete Lead"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-slate-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} records)
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchItems(pagination.page - 1)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition shadow-sm"
              >
                <ChevronLeft size={14} />
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchItems(pagination.page + 1)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition shadow-sm"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CRM Detail Modal */}
      {crmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{crmModal.item?.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Lead ID: #{crmModal.item?._id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
              <button onClick={closeCRMModal} className="p-2 rounded-xl hover:bg-slate-200 transition text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
              {/* Left Column: Info */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Information</h5>
                  <div className="space-y-3">
                    <a href={`mailto:${crmModal.item?.email}`} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition group">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-white transition">
                        <Mail size={16} />
                      </div>
                      <span className="text-sm font-medium text-slate-600 truncate block max-w-[200px]">{crmModal.item?.email}</span>
                    </a>
                    <a href={`tel:${crmModal.item?.mobile}`} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:bg-emerald-50 hover:border-emerald-100 transition group">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:bg-white transition">
                        <Phone size={16} />
                      </div>
                      <span className="text-sm font-medium text-slate-600">{crmModal.item?.mobile}</span>
                    </a>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Appointment Details</h5>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Requested Date</span>
                      <span className="text-sm font-bold text-indigo-600">{new Date(crmModal.item?.appointmentDate).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Applied On</span>
                      <span className="text-sm font-bold text-slate-700">{formatDate(crmModal.item?.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Service</span>
                      <span className="text-xs font-bold bg-white px-2 py-1 rounded-lg shadow-sm">{crmModal.item?.service}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inquiry Message</h5>
                  <div className="p-4 rounded-2xl bg-blue-50/30 border border-blue-100 text-sm text-slate-700 leading-relaxed italic font-medium">
                    "{crmModal.item?.message || "No additional message provided."}"
                  </div>
                </div>
              </div>

              {/* Right Column: CRM Actions */}
              <form onSubmit={handleSaveCRM} className="space-y-6">
                <div className="space-y-4">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage Lead Status</h5>
                  <div className="grid grid-cols-2 gap-3">
                    {statusOptions.map(opt => (
                      <div 
                        key={opt.value}
                        onClick={() => setCrmForm({...crmForm, status: opt.value})}
                        className={`cursor-pointer flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                          crmForm.status === opt.value 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                            : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-tight">{opt.label}</span>
                        {crmForm.status === opt.value && <Check size={12} />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CRM Notes (Private)</h5>
                  <textarea
                    value={crmForm.notes}
                    onChange={(e) => setCrmForm({...crmForm, notes: e.target.value})}
                    placeholder="Add internal notes about this lead..."
                    className="w-full h-40 p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-100 transition outline-none text-sm font-medium leading-relaxed"
                  />
                </div>

                <div className="pt-4 border-t border-slate-50 flex gap-4">
                  <button
                    type="button"
                    onClick={closeCRMModal}
                    className="flex-1 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingCrm}
                    className="flex-1 py-3 rounded-2xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {savingCrm ? <Loader2 className="animate-spin h-4 w-4" /> : <Save size={16} />}
                    <span>Update CRM</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Enterprise Bulk Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-100 transform scale-100 transition-all duration-300">
            <div className="flex items-center gap-4 text-red-600 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-800">Delete Selected Leads?</h4>
            </div>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              This action cannot be undone. You are about to permanently delete <strong>{selectedIds.length} lead{selectedIds.length > 1 ? 's' : ''}</strong> from the database.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={actionId === "bulk"}
                className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
              >
                {actionId === "bulk" && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DrNandaniLeads;
