import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { tenantsApi } from "../../services/api.js";
import { validators } from "../../utils/validators.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { User as UserIcon, Home, Calendar, FileText, Download, Clock } from "lucide-react";

export default function Lease() {
  const { user } = useAuth();
  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchLease = async () => {
    setLoading(true);
    try {
      const data = await tenantsApi.list();
      if (data.length > 0) {
        setLease(data[0]);
        reset({
          name: data[0].name,
          phone: data[0].phone
        });
      }
    } catch (err) {
      toast.error("Failed to load lease info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLease();
  }, []);

  const onUpdateProfile = async (values) => {
    setEditing(true);
    try {
      await tenantsApi.update(lease._id, values);
      toast.success("Profile updated");
      await fetchLease();
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setEditing(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading lease details...</div>;

  if (!lease) {
    return (
      <div className="bg-white rounded-2xl border p-12 text-center max-w-2xl mx-auto mt-10">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <FileText size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Lease</h2>
        <p className="text-gray-500">We couldn't find a lease record for your account. Please link your property or contact your landlord.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Lease Information</h1>
          <p className="text-gray-500 mt-1">Detailed overview of your rental agreement.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2 border-gray-200">
          <Download size={18} />
          Download PDF
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Home size={20} className="text-emerald-600" />
              Property & Unit
            </h3>
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Property Name</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{lease.propertyId?.name}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Unit Address</label>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{lease.propertyId?.address}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Landlord</label>
                <p className="text-sm font-semibold text-emerald-600 mt-1">{lease.propertyId?.userId?.name}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lease Status</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  <span className="text-sm font-bold text-emerald-600">Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              Terms & Renewal
            </h3>
            <div className="grid sm:grid-cols-3 gap-8">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Start Date</label>
                <p className="text-sm font-semibold text-gray-900 mt-1">{new Date(lease.leaseStart).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">End Date</label>
                <p className="text-sm font-semibold text-gray-900 mt-1">{new Date(lease.leaseEnd).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Renewal Option</label>
                <p className="text-sm text-gray-600 mt-1">Automatic</p>
              </div>
            </div>
            
            <div className="mt-10 p-4 bg-blue-50 rounded-2xl flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900">Notice Period</p>
                <p className="text-xs text-blue-700 mt-1">You must provide at least 30 days notice before the lease end date for move-out.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <CreditCard size={20} className="text-emerald-400" />
              Financial Summary
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly Rent</label>
                <p className="text-3xl font-bold mt-1">₹ {Number(lease.rentAmount).toLocaleString()}</p>
              </div>
              <div className="pt-6 border-t border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Security Deposit</span>
                  <span className="font-semibold">₹ {(lease.rentAmount * 2).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Lease Rules</h3>
            <ul className="space-y-4">
              {['No Pets Allowed', '1 Parking Spot Included', 'No Smoking', 'No Loud Music after 10PM'].map((rule, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreditCard({ size, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
    </svg>
  );
}
