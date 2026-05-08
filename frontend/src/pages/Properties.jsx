import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "../components/common/Button.jsx";
import Input from "../components/common/Input.jsx";
import { propertiesApi } from "../services/api.js";
import { validators } from "../utils/validators.js";
import { 
  Building2, 
  MapPin, 
  Wallet, 
  Zap, 
  Armchair, 
  Gavel, 
  FileCheck,
  Info,
  ArrowRight
} from "lucide-react";
import { useTranslation } from "../context/LanguageContext.jsx";

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

export default function Properties() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialValues = { 
    name: "", 
    address: "", 
    units: 1, 
    rent: 0, 
    status: "active",
    landmark: "",
    pincode: "",
    propertyType: "2BHK",
    floorNumber: 0,
    totalFloors: 0,
    hasLift: false,
    securityDeposit: 0,
    maintenanceCharges: 0,
    maintenancePaidBy: "tenant",
    noticePeriod: 1,
    lockInPeriod: 0,
    electricityMeterType: "postpaid",
    waterSupply: "",
    powerBackup: "",
    parkingDetails: "",
    furnishingStatus: "unfurnished",
    furnitureInventory: "",
    preferredTenant: "no-preference",
    foodPolicy: "",
    petPolicy: "",
    guestPolicy: "",
    ownershipProofType: "",
    societyNocRequired: false
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    defaultValues: initialValues
  });

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await propertiesApi.list();
      setItems(data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const onEdit = (property) => {
    setEditingId(property._id);
    reset(property);
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
        await propertiesApi.update(editingId, values);
        toast.success("Property updated successfully");
        setEditingId(null);
      } else {
        await propertiesApi.create(values);
        toast.success("Property created successfully");
      }
      reset(initialValues);
      await refresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || `Failed to ${editingId ? 'update' : 'create'} property`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('properties')}</h1>
          <p className="text-sm text-gray-600">{t('portfolioOverview')}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5 items-start">
        {/* Form Column */}
        <div className="lg:col-span-3 rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="bg-gray-50/50 p-5 border-b flex items-center justify-between">
            <div className="text-sm font-bold text-gray-900 uppercase tracking-tight">
              {editingId ? t('editProperty') : t('addProperty')}
            </div>
            <div className={`text-[10px] font-medium px-2 py-1 rounded ${editingId ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {editingId ? t('edit') : t('finance')}
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <FormSection title={t('address')} icon={Building2}>
              <div className="md:col-span-2">
                <Input label={t('propertyName')} placeholder="Flat 402, Skyline Residency" error={errors.name?.message} {...register("name", { required: "Name is required", maxLength: 100 })} />
              </div>
              <div className="md:col-span-2">
                <Input label={t('address')} placeholder="Street, Area, etc." error={errors.address?.message} {...register("address", { required: "Address is required", maxLength: 200 })} />
              </div>
              <Input label={t('landmark')} placeholder="Near Apollo Hospital" {...register("landmark", { maxLength: 100 })} />
              <Input label={t('pincode')} placeholder="560001" maxLength={6} {...register("pincode", { pattern: /^\d{6}$/ })} />
              
              <label className="block">
                <div className="mb-1 text-sm font-medium text-gray-700">Property Type</div>
                <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 transition" {...register("propertyType")}>
                  <option value="1BHK">1 BHK</option>
                  <option value="2BHK">2 BHK</option>
                  <option value="3BHK">3 BHK</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Studio">Studio / RK</option>
                  <option value="Office">Commercial Office</option>
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <Input label="Floor" type="number" {...register("floorNumber")} />
                <Input label="Total Floors" type="number" {...register("totalFloors")} />
              </div>

              <div className="md:col-span-2 flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 border-gray-300" {...register("hasLift")} />
                  <span className="text-sm text-gray-700 font-medium">Lift Available</span>
                </label>
              </div>
            </FormSection>

            <FormSection title={t('rentAmount')} icon={Wallet}>
              <Input label={t('rentAmount')} error={errors.rent?.message} {...register("rent", validators.amount)} />
              <Input label={t('securityDeposit')} {...register("securityDeposit", { min: 0 })} />
              <Input label={t('maintenanceCharges')} {...register("maintenanceCharges", { min: 0 })} />
              <label className="block">
                <div className="mb-1 text-sm font-medium text-gray-700">{t('maintenancePaidBy')}</div>
                <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 transition" {...register("maintenancePaidBy")}>
                  <option value="owner">Owner (Included in Rent)</option>
                  <option value="tenant">Tenant (Paid Separately)</option>
                </select>
              </label>
              <Input label={t('noticePeriod')} type="number" {...register("noticePeriod", { min: 0 })} />
              <Input label={t('lockInPeriod')} type="number" {...register("lockInPeriod", { min: 0 })} />
            </FormSection>

            <FormSection title="3. Utilities & Amenities" icon={Zap}>
              <label className="block">
                <div className="mb-1 text-sm font-medium text-gray-700">Electricity Meter</div>
                <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 transition" {...register("electricityMeterType")}>
                  <option value="postpaid">Postpaid (Bill per cycle)</option>
                  <option value="prepaid">Prepaid (Top-up meter)</option>
                </select>
              </label>
              <Input label="Water Supply" placeholder="24/7 Municipal/Borewell" {...register("waterSupply")} />
              <Input label="Power Backup" placeholder="Inverter / DG Backup" {...register("powerBackup")} />
              <Input label="Parking Details" placeholder="Slot 102, Covered" {...register("parkingDetails")} />
            </FormSection>

            <FormSection title="4. Furnishing & Status" icon={Armchair}>
              <label className="block">
                <div className="mb-1 text-sm font-medium text-gray-700">Furnishing Status</div>
                <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 transition" {...register("furnishingStatus")}>
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-furnished</option>
                  <option value="fully-furnished">Fully Furnished</option>
                </select>
              </label>
              <label className="block">
                <div className="mb-1 text-sm font-medium text-gray-700">Asset Status</div>
                <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 transition" {...register("status")}>
                  <option value="active">Active / Available</option>
                  <option value="inactive">Inactive / Under Repair</option>
                </select>
              </label>
              <div className="md:col-span-2">
                <Input label="Furniture Inventory Checklist" placeholder="List fans, lights, ACs, Bed, etc." {...register("furnitureInventory")} />
              </div>
            </FormSection>

            <FormSection title="5. House Rules" icon={Gavel}>
              <label className="block">
                <div className="mb-1 text-sm font-medium text-gray-700">Preferred Tenant</div>
                <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 transition" {...register("preferredTenant")}>
                  <option value="no-preference">No Preference</option>
                  <option value="families">Families Only</option>
                  <option value="bachelors">Bachelors Only</option>
                </select>
              </label>
              <Input label="Food Policy" placeholder="e.g. Veg Only" {...register("foodPolicy")} />
              <Input label="Pet Policy" placeholder="Allowed / Not Allowed" {...register("petPolicy")} />
              <Input label="Guest Policy" placeholder="Overnight stays, etc." {...register("guestPolicy")} />
            </FormSection>

            <FormSection title="6. Ownership & Legal" icon={FileCheck}>
              <Input label="Proof of Ownership Type" placeholder="Sale Deed / Tax Receipt" {...register("ownershipProofType")} />
              <div className="md:col-span-2 flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 border-gray-300" {...register("societyNocRequired")} />
                  <span className="text-sm text-gray-700 font-medium">Society NOC Required for Move-in</span>
                </label>
              </div>
            </FormSection>

            <div className="mt-10 pt-6 border-t flex gap-3">
              {editingId && (
                <Button variant="ghost" className="flex-1 border" onClick={onCancelEdit} type="button">
                  {t('cancel')}
                </Button>
              )}
              <Button className={`flex-[2] text-white py-3 shadow-lg transition-all ${editingId ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-100' : 'bg-gray-900 shadow-gray-200 hover:shadow-xl'}`} disabled={processing} type="submit">
                {processing ? "Processing..." : editingId ? t('editProperty') : t('addProperty')}
              </Button>
            </div>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-900">Your Properties</div>
              <button onClick={refresh} className="text-xs text-indigo-600 font-medium hover:underline" disabled={loading}>
                {loading ? "Refreshing..." : "Refresh List"}
              </button>
            </div>

            <div className="divide-y max-h-[1200px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-sm text-gray-500">Loading assets...</div>
              ) : items.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500 italic">No properties registered yet.</div>
              ) : (
                items.map((p) => (
                  <div key={p._id} className="p-4 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-bold text-gray-900 flex items-center gap-2">
                          {p.name}
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            p.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {p.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin size={10} /> {p.address}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">{p.propertyType}</span>
                          <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-medium">{p.furnishingStatus}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-gray-900">₹ {Number(p.rent).toLocaleString()}</div>
                        <div className="text-[10px] text-gray-400 font-medium mb-2">per month</div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-[10px] border border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                          onClick={() => onEdit(p)}
                        >
                          Edit Details
                        </Button>
                      </div>
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
