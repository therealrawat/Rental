import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { tenantsApi } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { validators } from "../../utils/validators.js";
import { 
  Home, 
  Calendar, 
  FileText, 
  Download, 
  Clock, 
  CreditCard, 
  User as UserIcon, 
  ShieldCheck, 
  Briefcase, 
  Users, 
  Phone, 
  CheckCircle2, 
  Info,
  Edit3,
  X,
  Zap,
  Armchair,
  MapPin
} from "lucide-react";

function FormSection({ title, icon: Icon, children }) {
  return (
    <div className="mb-8 last:mb-0">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
        {Icon && <Icon size={18} className="text-indigo-600" />}
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

export default function Lease() {
  const { user } = useAuth();
  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [processing, setProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    mode: "onChange"
  });

  const fetchLease = async () => {
    try {
      const data = await tenantsApi.list();
      if (data.length > 0) {
        setLease(data[0]);
        reset(data[0]);
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
    setProcessing(true);
    try {
      await tenantsApi.update(lease._id, values);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      await fetchLease();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-medium animate-pulse">Fetching your lease agreement...</p>
    </div>
  );

  if (!lease) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center max-w-2xl mx-auto mt-10 shadow-sm">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
          <FileText size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">No Active Lease Found</h2>
        <p className="text-gray-500 leading-relaxed">
          It looks like there isn't an active lease agreement linked to your account yet. 
          Please contact your landlord to have them add you to the property.
        </p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Update My Profile</h1>
            <p className="text-gray-500 mt-1 text-sm">Review and update your personal, employment, and occupancy details.</p>
          </div>
          <button 
            onClick={() => setIsEditing(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b bg-amber-50/50 flex items-center gap-3">
            <Info size={18} className="text-amber-600" />
            <p className="text-xs font-medium text-amber-800 uppercase tracking-wider">
              Fields like Rent and Lease Dates are locked and can only be changed by the Landlord.
            </p>
          </div>

          <form onSubmit={handleSubmit(onUpdateProfile)} className="p-10 space-y-12">
            <FormSection title="1. Personal Information" icon={UserIcon}>
              <Input label="Full Name" maxLength={50} error={errors.name?.message} {...register("name", validators.name)} />
              <Input label="Phone Number" maxLength={10} error={errors.phone?.message} {...register("phone", validators.phone)} />
              <Input label="Aadhaar Number" maxLength={12} error={errors.aadhaarNumber?.message} {...register("aadhaarNumber", validators.aadhaar)} />
              <Input label="PAN Card Number" maxLength={10} error={errors.panNumber?.message} {...register("panNumber", validators.pan)} />
              <div className="md:col-span-2">
                <Input label="Permanent (Hometown) Address" maxLength={200} error={errors.permanentAddress?.message} {...register("permanentAddress")} />
              </div>
            </FormSection>

            <FormSection title="2. Employment & Income" icon={Briefcase}>
              <label className="block">
                <div className="mb-1 text-sm font-medium text-gray-700">Employment Type</div>
                <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 transition" {...register("employmentType")}>
                  <option value="salaried">Salaried</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="student">Student</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <Input label="Company Name" maxLength={100} {...register("companyName")} />
              <Input label="Official Email ID" {...register("officialEmail", { pattern: validators.email.pattern })} />
              <Input label="Office Address" maxLength={200} {...register("officeAddress")} />
            </FormSection>

            <FormSection title="3. Occupancy Details" icon={Users}>
              <Input label="Number of Occupants" type="number" maxLength={2} {...register("numOccupants", { min: 1, max: 20 })} />
              <Input label="Marital Status" maxLength={20} {...register("maritalStatus")} />
              <div className="md:col-span-2">
                <Input label="Occupant Names & Relationships" maxLength={500} {...register("occupantsDetails")} />
              </div>
              <label className="block">
                <div className="mb-1 text-sm font-medium text-gray-700">Food Preference</div>
                <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 transition" {...register("foodPreference")}>
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="any">Any / No Preference</option>
                </select>
              </label>
              <Input label="Vehicle Details" maxLength={100} {...register("vehicleDetails")} />
            </FormSection>

            <FormSection title="4. References & Contacts" icon={Phone}>
              <Input label="Emergency Contact" maxLength={50} {...register("emergencyContact")} />
              <Input label="Local City Contact" maxLength={50} {...register("localContact")} />
            </FormSection>

            <FormSection title="5. Policies & Consents" icon={CheckCircle2}>
              <div className="md:col-span-2 space-y-4 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300" {...register("policeVerificationConsent")} />
                  <span className="text-sm text-gray-700 font-medium">I agree to mandatory Police Verification process</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300" {...register("smokingAllowed")} />
                    <span className="text-xs text-gray-600">Smoking</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300" {...register("drinkingAllowed")} />
                    <span className="text-xs text-gray-600">Drinking</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300" {...register("petsAllowed")} />
                    <span className="text-xs text-gray-600">Pets</span>
                  </label>
                </div>
              </div>
            </FormSection>

            <div className="pt-10 flex gap-4 border-t border-gray-50">
              <Button 
                className="flex-1 bg-gray-100 text-gray-600 py-4 font-bold text-sm uppercase tracking-widest" 
                onClick={() => setIsEditing(false)}
                type="button"
              >
                Cancel Changes
              </Button>
              <Button 
                className="flex-[2] bg-gray-900 text-white py-4 font-bold text-sm uppercase tracking-widest shadow-xl shadow-gray-200"
                disabled={processing}
                type="submit"
              >
                {processing ? "Saving..." : "Update My Profile"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <ShieldCheck size={14} /> Verified Agreement
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">My Lease Details</h1>
          <p className="text-gray-500 mt-2 font-medium">Agreement between {lease.propertyId?.userId?.name} and {user?.name}</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="bg-white border border-gray-200 text-gray-700 rounded-2xl flex items-center gap-2 px-6 py-3 hover:bg-gray-50 transition-all"
          >
            <Edit3 size={18} />
            Edit Profile
          </Button>
          <Button className="bg-gray-900 text-white rounded-2xl flex items-center gap-2 px-8 py-3 shadow-xl shadow-gray-900/20 hover:scale-105 transition-all">
            <Download size={18} />
            Export as PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Property Section */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Home size={20} />
              </div>
              Property & Unit Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-y-10 gap-x-12">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Property Name</label>
                <p className="text-lg font-bold text-gray-900 mt-1">{lease.propertyId?.name}</p>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Unit Address</label>
                <p className="text-sm font-medium text-gray-600 mt-1 leading-relaxed">
                  {lease.propertyId?.address}
                  {lease.propertyId?.landmark && <span className="block text-xs text-indigo-500 mt-1 italic">Landmark: {lease.propertyId.landmark}</span>}
                  {lease.propertyId?.pincode && <span className="block text-xs text-gray-400">Pincode: {lease.propertyId.pincode}</span>}
                </p>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Unit Specs</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">{lease.propertyId?.propertyType}</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">Floor {lease.propertyId?.floorNumber} of {lease.propertyId?.totalFloors}</span>
                  {lease.propertyId?.hasLift && <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase flex items-center gap-1"><CheckCircle2 size={10} /> Lift Available</span>}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Landlord / Owner</label>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <UserIcon size={14} />
                  </div>
                  <p className="text-sm font-bold text-emerald-600">{lease.propertyId?.userId?.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Utilities Section */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Zap size={20} />
              </div>
              Utilities & Infrastructure
            </h3>
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                  <Zap size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Electricity</p>
                  <p className="text-sm font-bold text-gray-900 capitalize">{lease.propertyId?.electricityMeterType} Meter</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Bills to be paid as per usage</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                  <Info size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Water Supply</p>
                  <p className="text-sm font-bold text-gray-900">{lease.propertyId?.waterSupply || 'Municipal / Borewell'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                  <Zap size={14} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Power Backup</p>
                  <p className="text-sm font-bold text-gray-900">{lease.propertyId?.powerBackup || 'Not Available'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                  <MapPin size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Parking</p>
                  <p className="text-sm font-bold text-gray-900">{lease.propertyId?.parkingDetails || 'No Dedicated Parking'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Furnishing Section */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <Armchair size={20} />
              </div>
              Furnishing & Inventory
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Furnishing Status</p>
                <span className="px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100 capitalize">
                  {lease.propertyId?.furnishingStatus}
                </span>
              </div>
              {lease.propertyId?.furnitureInventory && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Inventory Checklist</p>
                  <div className="bg-gray-50 rounded-2xl p-6 text-sm text-gray-600 leading-relaxed border border-gray-100">
                    {lease.propertyId.furnitureInventory}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dates & Terms */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Calendar size={20} />
              </div>
              Lease Timeline
            </h3>
            <div className="grid sm:grid-cols-3 gap-10">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Start Date</label>
                <p className="text-lg font-bold text-gray-900 mt-2">{new Date(lease.leaseStart).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">End Date</label>
                <p className="text-lg font-bold text-gray-900 mt-2">{new Date(lease.leaseEnd).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
              </div>
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                <label className="text-[10px] font-black text-emerald-600/60 uppercase tracking-[0.15em]">Days Remaining</label>
                <p className="text-2xl font-black text-emerald-700 mt-2">
                  {Math.max(0, Math.ceil((new Date(lease.leaseEnd) - new Date()) / (1000 * 60 * 60 * 24)))}
                </p>
              </div>
            </div>
            
            <div className="mt-10 p-6 bg-amber-50 rounded-[1.5rem] flex items-start gap-5 border border-amber-100">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900">Important Notice Period</p>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  As per your agreement, a minimum of <strong>30 days notice</strong> is required prior to move-out. 
                  Failure to provide notice may impact security deposit returns.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                <CreditCard size={20} className="text-emerald-400" />
                Rent Summary
              </h3>
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Monthly Rent</label>
                  <p className="text-4xl font-black mt-2 tracking-tight">₹ {Number(lease.rentAmount).toLocaleString()}</p>
                </div>
                <div className="pt-8 border-t border-gray-800 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Security Deposit</label>
                    <p className="text-xl font-bold mt-1 text-emerald-400">₹ {(lease.propertyId?.securityDeposit || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Maintenance</label>
                    <p className="text-xl font-bold mt-1 text-blue-400">₹ {(lease.propertyId?.maintenanceCharges || 0).toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 italic">
                  * All amounts are processed securely through the platform.
                </p>
              </div>
            </div>
            {/* Gradient accent */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]"></div>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Agreement Terms</h3>
            <div className="space-y-5">
              {[
                { label: 'Pets', value: lease.petsAllowed ? 'Allowed' : 'Not Allowed', ok: lease.petsAllowed },
                { label: 'Parking', value: lease.vehicleDetails || 'None', ok: !!lease.vehicleDetails },
                { label: 'Smoking', value: lease.smokingAllowed ? 'Allowed' : 'Prohibited', ok: lease.smokingAllowed },
                { label: 'Subletting', value: 'Not Allowed', ok: false }
              ].map((term, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{term.label}</span>
                  <span className={`text-xs font-bold ${term.ok ? 'text-emerald-600' : 'text-gray-900'}`}>{term.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-blue-600 rounded-[2rem] text-white text-center shadow-xl shadow-blue-600/20">
            <h4 className="font-bold mb-2">Need Help?</h4>
            <p className="text-xs text-blue-100 mb-6">Contact our support or your landlord directly for any lease disputes.</p>
            <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors">
              Contact Landlord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
