import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { 
  Search, Calendar, Mail, Phone, MessageSquare, 
  Trash2, Filter, ChevronDown, Check, X, Clock,
  MoreVertical, CheckSquare, Square, AlertTriangle, Loader2
} from "lucide-react";
import Loader from "../components/Loader";
import {
  deleteContact,
  exportContactsCsv,
  getContacts,
  updateContact,
  bulkDeleteContacts,
} from "../api/services";

const statusOptions = [
  { label: "New", value: "new", color: "bg-blue-100 text-blue-700" },
  { label: "Replied", value: "replied", color: "bg-amber-100 text-amber-700" },
  { label: "Closed", value: "closed", color: "bg-slate-100 text-slate-600" },
];

const StatusDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  const handleOpen = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={handleOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:border-slate-300 hover:bg-slate-50 transition shadow-sm outline-none"
      >
        <span>Update</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && createPortal(
        <>
          <div 
            className="fixed inset-0 z-[998]" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div 
            style={{ 
              position: 'absolute', 
              top: `${coords.top + 8}px`, 
              left: `${coords.left - 40}px`, 
              minWidth: '140px',
              zIndex: 999 
            }}
            className="bg-white border border-slate-100 rounded-xl shadow-2xl overflow-hidden animate-fade-in"
          >
            <div className="p-1.5">
              {options.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-[11px] font-bold rounded-lg transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={12} />}
                  </button>
                );
              })}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

const FilterDropdown = ({ value, onChange, options, label, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 outline-none hover:bg-white hover:border-slate-200 hover:shadow-md transition-all duration-300 cursor-pointer h-[52px]"
      >
        <div className="flex items-center gap-2.5 truncate">
          {Icon && <Icon size={18} className="text-slate-400 flex-shrink-0" />}
          <span className="truncate">{selected ? selected.label : label}</span>
        </div>
        <ChevronDown 
          size={18} 
          className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute left-0 top-full mt-2 w-full min-w-[180px] bg-white border border-slate-100 rounded-2xl shadow-xl z-20 overflow-hidden animate-fade-in">
            <div className="p-1.5 space-y-0.5">
              <button
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                  value === "" 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{label}</span>
                {value === "" && <Check size={14} />}
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
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
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

const getLeadEnquiryType = (item) => {
  if (!item) return "";
  if (item.enquiry_type) return item.enquiry_type;
  if (item.service) return item.service;
  const match = item.message?.match(/\[Service:\s*([^\]]+)\]/);
  return match ? match[1] : (item.service || "General Enquiry");
};

const getLeadPreferredDate = (item) => {
  if (!item) return "";
  if (item.preferred_date) {
    try {
      return new Date(item.preferred_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return item.preferred_date;
    }
  }
  const match = item.message?.match(/\[Preferred Date:\s*([^\]]+)\]/);
  if (match) {
    try {
      return new Date(match[1]).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return match[1];
    }
  }
  return "N/A";
};

function TreatmentEnquiries() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [exporting, setExporting] = useState(false);
  const [messageModal, setMessageModal] = useState({ open: false, item: null });

  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchItems = async (page = pagination.page) => {
    setLoading(true);
    try {
      const response = await getContacts({
        page,
        limit: pagination.limit,
        search: debouncedSearch,
        status,
        startDate,
        endDate,
        sortBy: "createdAt",
        sortOrder: "desc",
        source: "service-details-enquiry",
      });
      setItems(response.data || []);
      setPagination(response.pagination || { page, limit: 10, total: 0, totalPages: 1 });
      
      const currentIds = (response.data || []).map(i => i._id);
      setSelectedIds(prev => prev.filter(id => currentIds.includes(id)));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load treatment enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(1);
  }, [debouncedSearch, status, startDate, endDate]);

  const handleStatusChange = async (id, value) => {
    setActionId(id);
    try {
      await updateContact(id, { status: value });
      toast.success("Status updated");
      fetchItems(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update status");
    } finally {
      setActionId("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this treatment enquiry?")) {
      return;
    }

    setActionId(id);
    try {
      await deleteContact(id);
      toast.success("Enquiry deleted");
      setSelectedIds(prev => prev.filter(x => x !== id));
      fetchItems(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete enquiry");
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
      await bulkDeleteContacts({ ids: selectedIds });
      toast.success("Selected inquiries deleted successfully");
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
      await exportContactsCsv({ source: "service-details-enquiry" });
      toast.success("CSV exported");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to export CSV");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Card */}
      <div className="rounded-[32px] bg-white p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Treatment Enquiries</h3>
            <p className="mt-1 text-sm text-slate-500">
              Manage and track custom service details enquiries submitted on dynamic treatment pages
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all font-bold text-sm border border-red-200 shadow-sm"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected ({selectedIds.length})
              </button>
            )}
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200 disabled:opacity-50"
            >
              {exporting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Improved Filter Bar */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 transition outline-none font-medium"
            />
          </div>

          <FilterDropdown
            value={status}
            onChange={setStatus}
            options={statusOptions}
            label="All Statuses"
            icon={Filter}
          />

          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white transition outline-none font-bold text-slate-600"
              title="Start Date"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white transition outline-none font-bold text-slate-600"
              title="End Date"
            />
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[32px] border border-slate-100">
          <Loader />
          <p className="mt-4 text-slate-400 font-medium animate-pulse">Syncing treatment enquiries...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left w-12 align-middle">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-slate-400 hover:text-slate-600 transition outline-none"
                    >
                      {items.length > 0 && items.every(item => selectedIds.includes(item._id)) ? (
                        <CheckSquare className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead Name</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Info</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enquiry / Service</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preferred Date</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Message</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-20 text-center text-slate-400 font-medium italic">
                      No treatment enquiries found matching your filters.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5 whitespace-nowrap align-middle">
                        <button
                          type="button"
                          onClick={(e) => handleSelectId(item._id, e)}
                          className="text-slate-400 hover:text-slate-600 transition outline-none"
                        >
                          {selectedIds.includes(item._id) ? (
                            <CheckSquare className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Square className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px] align-middle">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-slate-900 truncate" title={item.name}>{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-middle max-w-[150px]">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1 text-xs font-medium text-slate-600 truncate" title={item.email}>
                            <Mail size={12} className="text-slate-400 flex-shrink-0" />
                            <span className="truncate">{item.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs font-medium text-slate-600 truncate" title={item.mobile}>
                            <Phone size={12} className="text-slate-400 flex-shrink-0" />
                            <span className="truncate">{item.mobile}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-middle max-w-[120px] truncate" title={getLeadEnquiryType(item)}>
                        <span className="text-xs font-bold text-slate-700 capitalize truncate">
                          {getLeadEnquiryType(item)}
                        </span>
                      </td>
                      <td className="px-6 py-5 align-middle whitespace-nowrap">
                        <span className="text-xs font-semibold text-slate-600">
                          {getLeadPreferredDate(item)}
                        </span>
                      </td>
                      <td className="px-6 py-5 align-middle whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                          {item.source || 'service-details-enquiry'}
                        </span>
                      </td>
                      <td className="px-6 py-5 max-w-[130px] align-middle">
                        <button
                          type="button"
                          onClick={() => setMessageModal({ open: true, item })}
                          title={item.message}
                          className="w-full text-left text-xs text-slate-500 font-medium truncate hover:text-blue-600 transition"
                        >
                          {item.message?.replace(/\[Preferred Date:[^\]]+\]\s*\[Service:[^\]]+\]\n*/, '') || item.message}
                        </button>
                      </td>
                      <td className="px-6 py-5 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                            statusOptions.find(o => o.value === item.status)?.color || 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.status}
                          </span>
                          <StatusDropdown
                            value={item.status}
                            onChange={(val) => handleStatusChange(item._id, val)}
                            options={statusOptions}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap align-middle">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">
                            {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right align-middle w-16">
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
                          disabled={actionId === item._id}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition border border-transparent hover:border-red-100 group/btn"
                        >
                          <Trash2 size={18} className="transition-transform group-hover/btn:scale-110" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Component */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} entries)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchItems(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition shadow-sm"
              >
                Prev
              </button>
              <button
                onClick={() => fetchItems(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {messageModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{messageModal.item?.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Treatment Enquiry Details</p>
                </div>
              </div>
              <button 
                onClick={() => setMessageModal({ open: false, item: null })}
                className="p-2 rounded-xl hover:bg-slate-200 transition text-slate-400"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8">
              <div className="p-6 rounded-2xl bg-blue-50/30 border border-blue-100 text-sm text-slate-600 leading-relaxed font-medium italic">
                "{messageModal.item?.message?.replace(/\[Preferred Date:[^\]]+\]\s*\[Service:[^\]]+\]\n*/, '') || messageModal.item?.message}"
              </div>
              
              <div className="mt-8 flex flex-col gap-4">
                 <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Email</span>
                    <a href={`mailto:${messageModal.item?.email}`} className="text-sm font-bold text-blue-600 hover:underline">
                      {messageModal.item?.email}
                    </a>
                 </div>
                 <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Phone</span>
                    <a href={`tel:${messageModal.item?.mobile}`} className="text-sm font-bold text-slate-900">
                      {messageModal.item?.mobile}
                    </a>
                 </div>
                 <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Enquiry / Service Type</span>
                    <span className="text-sm font-bold text-slate-950 capitalize">
                      {getLeadEnquiryType(messageModal.item)}
                    </span>
                 </div>
                 <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Preferred Date</span>
                    <span className="text-sm font-bold text-slate-950">
                      {getLeadPreferredDate(messageModal.item)}
                    </span>
                 </div>
                 <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Source</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wide">
                      {messageModal.item?.source || 'service-details-enquiry'}
                    </span>
                 </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setMessageModal({ open: false, item: null })}
                  className="w-full py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200"
                >
                  Close Enquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl p-8 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 text-red-600 mb-6 bg-red-50 p-4 rounded-2xl border border-red-100">
              <AlertTriangle className="h-10 w-10 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Confirm Bulk Delete</h4>
                <p className="text-xs text-red-600 font-semibold mt-0.5">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              You are about to permanently delete <span className="font-bold text-slate-900">{selectedIds.length}</span> treatment enquiries. Are you sure you want to proceed?
            </p>

            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={actionId === "bulk"}
                className="flex-1 py-3.5 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-200 disabled:opacity-50 cursor-pointer"
              >
                {actionId === "bulk" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete All"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TreatmentEnquiries;
