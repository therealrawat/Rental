import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "../components/common/Button.jsx";
import Input from "../components/common/Input.jsx";
import { propertiesApi, tenantsApi } from "../services/api.js";
import { validators } from "../utils/validators.js";
import { useAuth } from "../context/AuthContext.jsx";
import { 
  User as UserIcon, 
  Home, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  Briefcase, 
  Users, 
  Phone, 
  MapPin, 
  Info,
  CheckCircle2
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

export default function Tenants() {
  const { user } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const isLandlord = user?.role === "landlord";

  const initialValues = {
    propertyId: "",
    name: "",
    email: "",
    phone: "",
    leaseStart: "",
    leaseEnd: "",
    rentAmount: 0,
    aadhaarNumber: "",
    panNumber: "",
    permanentAddress: "",
    employmentType: "salaried",
    companyName: "",
    officeAddress: "",
    officialEmail: "",
    numOccupants: 1,
    occupantsDetails: "",
    maritalStatus: "",
    foodPreference: "any",
    vehicleDetails: "",
    emergencyContact: "",
    localContact: "",
    policeVerificationConsent: false,
    smokingAllowed: false,
    drinkingAllowed: false,
    petsAllowed: false
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    defaultValues: initialValues
  });

  const refresh = async () => {
    setLoading(true);
    try {
      const [t, p] = await Promise.all([tenantsApi.list(), propertiesApi.list()]);
      setTenants(t);
      setProperties(p);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLandlord) refresh();
    else setLoading(false);
  }, [isLandlord]);

  const onEdit = (tenant) => {
    setEditingId(tenant._id);
    const formData = { ...tenant };
    // Handle nested propertyId if it's an object from populate
    if (tenant.propertyId?._id) {
      formData.propertyId = tenant.propertyId._id;
    }
    // Format dates for input type="date"
    if (tenant.leaseStart) formData.leaseStart = new Date(tenant.leaseStart).toISOString().split('T')[0];
    if (tenant.leaseEnd) formData.leaseEnd = new Date(tenant.leaseEnd).toISOString().split('T')[0];
    
    reset(formData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onCancelEdit = () => {
    setEditingId(null);
    reset(initialValues);
  };

  const onSubmit = async (values) => {
    setProcessing(true);
    try {
      if (editingId) {
        await tenantsApi.update(editingId, values);
        toast.success("Tenant profile updated successfully");
        setEditingId(null);
      } else {
        const res = await tenantsApi.create(values);
        toast.success(res.message || "Tenant created successfully");
      }
      reset(initialValues);
      await refresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || `Failed to ${editingId ? 'update' : 'create'} tenant`);
    } finally {
      setProcessing(false);
    }
  };

  if (!isLandlord) {
    return (
      <div className="max-w-4xl mx-auto text-center mt-20">
        <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
        <p className="text-gray-500 mt-2">Only landlords can manage the list of tenants.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
          <p className="text-sm text-gray-600">Comprehensive management of your rental residents.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5 items-start">
        {/* Form Column */}
        <div className="lg:col-span-3 rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="bg-gray-50/50 p-5 border-b flex items-center justify-between">
            <div className="text-sm font-bold text-gray-900 uppercase tracking-tight">
              {editingId ? "Edit Tenant Profile" : "New Tenant Registration"}
            </div>
            <div className={`text-[10px] font-medium px-2 py-1 rounded ${editingId ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
              {editingId ? 'Edit Mode' : 'V2 Registration Form'}
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            {!editingId && (
              <p className="text-xs text-gray-500 mb-6 flex items-center gap-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <Info size={14} className="text-blue-600 shrink-0" />
                This will create a tenant record and an automated login account (pass123) for the resident.
              </p>
            )}

            <FormSection title="1. Basic Lease Info" icon={Home}>
              <label className="block">
                <div className="mb-1 text-sm font-medium text-gray-700">Property</div>
                <select
                  className={[
                    "w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition",
                    errors.propertyId ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-indigo-200"
                  ].join(" ")}
                  {...register("propertyId", { required: "Property is required" })}
                >
                  <option value="">Select a property</option>
                  {properties.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
                {errors.propertyId && <div className="mt-1 text-xs text-red-600">{errors.propertyId.message}</div>}
              </label>

              <Input label="Monthly Rent (₹)" type="text" error={errors.rentAmount?.message} {...register("rentAmount", validators.amount)} />
              
              <Input label="Lease Start" type="date" error={errors.leaseStart?.message} {...register("leaseStart", { required: "Required" })} />
              <Input label="Lease End" type="date" error={errors.leaseEnd?.message} {...register("leaseEnd", { required: "Required" })} />
            </FormSection>

            <FormSection title="2. Identity & KYCs" icon={ShieldCheck}>
              <Input label="Full Name" maxLength={50} error={errors.name?.message} {...register("name", validators.name)} />
              <Input label="Email Address" error={errors.email?.message} {...register("email", validators.email)} />
              <Input label="Phone Number" maxLength={10} error={errors.phone?.message} {...register("phone", validators.phone)} />
              <Input label="Aadhaar Number" maxLength={12} placeholder="12-digit UID" error={errors.aadhaarNumber?.message} {...register("aadhaarNumber", validators.aadhaar)} />
              <Input label="PAN Card Number" maxLength={10} placeholder="ABCDE1234F" error={errors.panNumber?.message} {...register("panNumber", validators.pan)} />
              <div className="md:col-span-2">
                <Input label="Permanent (Hometown) Address" maxLength={200} placeholder="As per Aadhaar" error={errors.permanentAddress?.message} {...register("permanentAddress", { maxLength: { value: 200, message: "Max 200 characters" } })} />
              </div>
            </FormSection>

            <FormSection title="3. Employment & Income" icon={Briefcase}>
              <label className="block">
                <div className="mb-1 text-sm font-medium text-gray-700">Employment Type</div>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 transition"
                  {...register("employmentType")}
                >
                  <option value="salaried">Salaried</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="student">Student</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <Input label="Company Name" maxLength={100} error={errors.companyName?.message} {...register("companyName", { maxLength: { value: 100, message: "Max 100 characters" } })} />
              <Input label="Official Email ID" error={errors.officialEmail?.message} {...register("officialEmail", { pattern: validators.email.pattern })} />
              <Input label="Office Address" maxLength={200} error={errors.officeAddress?.message} {...register("officeAddress", { maxLength: { value: 200, message: "Max 200 characters" } })} />
            </FormSection>

            <FormSection title="4. Occupancy Details" icon={Users}>
              <Input label="Number of Occupants" type="number" maxLength={2} error={errors.numOccupants?.message} {...register("numOccupants", { min: { value: 1, message: "Min 1" }, max: { value: 20, message: "Max 20" } })} />
              <Input label="Marital Status" placeholder="Single/Married" maxLength={20} error={errors.maritalStatus?.message} {...register("maritalStatus", { maxLength: { value: 20, message: "Max 20" } })} />
              <div className="md:col-span-2">
                <Input label="Occupant Names & Relationships" maxLength={500} placeholder="e.g. Spouse, 2 Children" error={errors.occupantsDetails?.message} {...register("occupantsDetails", { maxLength: { value: 500, message: "Max 500 characters" } })} />
              </div>
              <label className="block">
                <div className="mb-1 text-sm font-medium text-gray-700">Food Preference</div>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 transition"
                  {...register("foodPreference")}
                >
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="any">Any / No Preference</option>
                </select>
              </label>
              <Input label="Vehicle Details (Parking)" maxLength={100} placeholder="KA-01-AB-1234 (SUV)" error={errors.vehicleDetails?.message} {...register("vehicleDetails", { maxLength: { value: 100, message: "Max 100 characters" } })} />
            </FormSection>

            <FormSection title="5. References & Contacts" icon={Phone}>
              <Input label="Emergency Contact" maxLength={50} placeholder="Parent/Relative Phone" error={errors.emergencyContact?.message} {...register("emergencyContact", { maxLength: { value: 50, message: "Max 50 characters" } })} />
              <Input label="Local City Contact" maxLength={50} placeholder="Local friend/relative" error={errors.localContact?.message} {...register("localContact", { maxLength: { value: 50, message: "Max 50 characters" } })} />
            </FormSection>

            <FormSection title="6. Disclosures & Policies" icon={CheckCircle2}>
              <div className="md:col-span-2 space-y-4 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300" {...register("policeVerificationConsent")} />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">Tenant agrees to mandatory Police Verification process</span>
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

            <div className="mt-10 pt-6 border-t flex gap-3">
              {editingId && (
                <Button variant="ghost" className="flex-1 border" onClick={onCancelEdit} type="button">
                  Cancel
                </Button>
              )}
              <Button 
                className={`flex-[2] text-white py-3 shadow-lg transition-all ${editingId ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-100' : 'bg-gray-900 shadow-gray-200 hover:shadow-xl'}`}
                disabled={processing} 
                type="submit"
              >
                {processing ? "Processing..." : editingId ? "Update Tenant Profile" : "Complete Tenant Registration"}
              </Button>
            </div>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-900">Your Tenants</div>
              <button 
                onClick={refresh} 
                className="text-xs text-indigo-600 font-medium hover:underline"
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh List"}
              </button>
            </div>

            <div className="divide-y max-h-[1200px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-sm text-gray-500">Loading residents...</div>
              ) : tenants.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500 italic">No tenants registered yet.</div>
              ) : (
                tenants.map((t) => (
                  <div key={t._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="font-bold text-gray-900">{t.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin size={10} /> {t.propertyId?.name || "No Property"}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-gray-900">₹ {Number(t.rentAmount).toLocaleString()}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-medium">Monthly Rent</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <div className="flex items-center gap-1"><Phone size={10} /> {t.phone}</div>
                      <div className="flex items-center gap-1"><ShieldCheck size={10} /> {t.aadhaarNumber ? "KYC Done" : "KYC Pending"}</div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                        Lease Ends: {new Date(t.leaseEnd).toLocaleDateString()}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-[10px] border border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                        onClick={() => onEdit(t)}
                      >
                        Edit Details
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
