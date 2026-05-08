import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTranslation } from "../../context/LanguageContext.jsx";
import { maintenanceApi } from "../../services/api.js";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import {
  Wrench, Plus, Clock, CheckCircle2, AlertCircle, ChevronRight,
  X, Loader2, RotateCcw, User, Home, AlertTriangle, CheckCheck
} from "lucide-react";

const CATEGORIES = ["Plumbing", "Electrical", "HVAC", "Appliance", "Structural", "Pest Control", "Other"];
const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["Submitted", "Acknowledged", "In Progress", "Resolved", "Closed"];

const STATUS_STYLES = {
  Submitted: "bg-blue-50 text-blue-600 border-blue-100",
  Acknowledged: "bg-indigo-50 text-indigo-600 border-indigo-100",
  "In Progress": "bg-amber-50 text-amber-600 border-amber-100",
  Resolved: "bg-emerald-50 text-emerald-600 border-emerald-100",
  Closed: "bg-gray-100 text-gray-500 border-gray-200"
};

const PRIORITY_STYLES = {
  Low: "bg-gray-100 text-gray-500",
  Medium: "bg-amber-50 text-amber-600",
  High: "bg-rose-50 text-rose-600"
};

const STATUS_ICONS = {
  Submitted: Clock,
  Acknowledged: AlertCircle,
  "In Progress": Wrench,
  Resolved: CheckCircle2,
  Closed: CheckCheck
};

function StatusBadge({ status }) {
  const Icon = STATUS_ICONS[status] || Clock;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${STATUS_STYLES[status] || ''}`}>
      <Icon size={10} />
      {status}
    </span>
  );
}

// Detail / Update modal for landlord
function RequestDetailModal({ request, onClose, onUpdate }) {
  const [status, setStatus] = useState(request.status);
  const [remarks, setRemarks] = useState(request.landlordRemarks || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(request._id, { status, landlordRemarks: remarks });
      toast.success("Request updated");
      onClose();
    } catch {
      toast.error("Failed to update request");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{request.title}</h2>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
              <User size={12} />
              <span>{request.tenantId?.name}</span>
              <span>·</span>
              <Home size={12} />
              <span>{request.propertyId?.name}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${PRIORITY_STYLES[request.priority]}`}>
              {request.priority} Priority
            </span>
            <span className="text-xs text-gray-400 font-medium">{request.category}</span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400">{new Date(request.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tenant Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">{request.description}</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Update Status</label>
            <div className="grid grid-cols-3 gap-2">
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                    status === s
                      ? `${STATUS_STYLES[s]} scale-105 shadow-sm`
                      : 'border-gray-100 text-gray-400 hover:border-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Your Remarks (Optional)</label>
            <textarea
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-300 outline-none transition-all min-h-[80px] resize-none"
              placeholder="e.g. Plumber scheduled for Tuesday 10am..."
            />
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <Button variant="ghost" className="flex-1 border border-gray-200" onClick={onClose}>Cancel</Button>
          <Button
            className="flex-[2] bg-gray-900 text-white rounded-xl font-bold"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            {saving ? "Saving..." : "Update Request"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Maintenance() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const isLandlord = user?.role === "landlord";

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false });
  const [filterStatus, setFilterStatus] = useState("all");

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { title: "", description: "", category: "Plumbing", priority: "Medium" }
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await maintenanceApi.list();
      setRequests(data);
    } catch {
      toast.error("Failed to load maintenance requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await maintenanceApi.create(values);
      toast.success("Maintenance request submitted!");
      reset();
      setShowForm(false);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const onUpdate = async (id, payload) => {
    const updated = await maintenanceApi.update(id, payload);
    setRequests(prev => prev.map(r => r._id === id ? updated : r));
  };

  const onDelete = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Maintenance Request",
      message: "Are you sure you want to delete this request? This cannot be undone.",
      confirmText: "Delete Request",
      type: "danger",
      onConfirm: async () => {
        setConfirmConfig(prev => ({ ...prev, loading: true }));
        try {
          await maintenanceApi.remove(id);
          toast.success("Request deleted");
          setRequests(prev => prev.filter(r => r._id !== id));
          setConfirmConfig({ isOpen: false });
        } catch {
          toast.error("Failed to delete");
          setConfirmConfig(prev => ({ ...prev, loading: false }));
        }
      }
    });
  };

  const filtered = filterStatus === "all" ? requests : requests.filter(r => r.status === filterStatus);
  const stats = {
    open: requests.filter(r => r.status === "Submitted" || r.status === "Acknowledged").length,
    inProgress: requests.filter(r => r.status === "In Progress").length,
    resolved: requests.filter(r => r.status === "Resolved" || r.status === "Closed").length
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t('maintenance') || 'Maintenance'}</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {isLandlord ? "Manage and respond to tenant repair requests." : "Submit and track your repair requests."}
          </p>
        </div>
        {!isLandlord && (
          <Button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 rounded-2xl px-6 font-bold text-white transition-all ${
              showForm ? 'bg-gray-600 hover:bg-gray-700' : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200'
            }`}
          >
            {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> New Request</>}
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Open / New", value: stats.open, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "In Progress", value: stats.inProgress, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Resolved", value: stats.resolved, color: "text-emerald-600", bg: "bg-emerald-50" }
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <Wrench size={18} className={stat.color} />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* New Request Form */}
      {!isLandlord && showForm && (
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Wrench size={16} className="text-emerald-600" />
            </div>
            New Maintenance Request
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Category</label>
                <select
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                  {...register("category")}
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Priority</label>
                <select
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                  {...register("priority")}
                >
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <Input
              label="Short Title"
              placeholder="e.g., Leaking faucet in master bathroom"
              error={errors.title?.message}
              {...register("title", { required: "Title is required" })}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Detailed Description</label>
              <textarea
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-400 outline-none transition-all min-h-[120px] resize-none"
                placeholder="Describe the issue in detail — when it started, severity, location in the unit..."
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && <p className="text-xs text-rose-500">{errors.description.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-3.5 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Wrench size={16} />}
              {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </div>
      )}

      {/* Filter + List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-gray-900">
            {isLandlord ? "All Tenant Requests" : "My Requests"}
          </h3>
          <div className="flex gap-2 flex-wrap">
            {["all", "Submitted", "In Progress", "Resolved"].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  filterStatus === s
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
            <button
              onClick={load}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="Refresh"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-12 flex items-center justify-center gap-3 text-gray-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Loading requests...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium text-sm">
                {filterStatus === "all" ? "No maintenance requests yet." : `No ${filterStatus} requests.`}
              </p>
              {!isLandlord && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 text-xs font-bold text-emerald-600 hover:underline"
                >
                  + Submit your first request
                </button>
              )}
            </div>
          ) : (
            filtered.map(req => (
              <div
                key={req._id}
                className="p-5 px-6 hover:bg-gray-50/50 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`mt-0.5 w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center border ${STATUS_STYLES[req.status] || ''}`}>
                      {(() => { const Icon = STATUS_ICONS[req.status] || Clock; return <Icon size={20} />; })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                        {req.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="font-medium">{req.category}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                        {isLandlord && req.tenantId && (
                          <>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span className="flex items-center gap-1"><User size={10} /> {req.tenantId.name}</span>
                          </>
                        )}
                      </div>
                      {req.landlordRemarks && (
                        <p className="mt-2 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg inline-block">
                          💬 {req.landlordRemarks}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${PRIORITY_STYLES[req.priority]}`}>
                      {req.priority}
                    </span>
                    <StatusBadge status={req.status} />
                    {isLandlord ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-[10px] border border-indigo-100 text-indigo-600 hover:bg-indigo-50 font-bold"
                        onClick={() => setSelectedRequest(req)}
                      >
                        Respond
                      </Button>
                    ) : (
                      <button
                        onClick={() => onDelete(req._id)}
                        className="p-1.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Landlord detail modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdate={onUpdate}
        />
      )}

      <ConfirmDialog
        {...confirmConfig}
        onClose={() => setConfirmConfig({ isOpen: false })}
      />
    </div>
  );
}
