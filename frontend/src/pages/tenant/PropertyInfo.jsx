import { useEffect, useState } from "react";
import { tenantsApi } from "../../services/api.js";
import { Info, MapPin, Building, ShieldCheck, Truck, Car, Phone, Mail, User as UserIcon } from "lucide-react";

export default function PropertyInfo() {
  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await tenantsApi.list();
        if (data.length > 0) setLease(data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading property details...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Property Information</h1>
        <p className="text-gray-500 mt-1">Building details, amenities, and community rules.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Unit & Address */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                <MapPin size={18} />
              </div>
              Unit Location
            </h3>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gray-50 rounded-2xl">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Address</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{lease?.propertyId?.address}</p>
                  {lease?.propertyId?.landmark && <p className="text-xs text-indigo-600 mt-1 font-medium italic">Landmark: {lease.propertyId.landmark}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Property Name</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{lease?.propertyId?.name}</p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Property Type</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{lease?.propertyId?.propertyType || 'Residential'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Furnishing</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1 capitalize">{lease?.propertyId?.furnishingStatus || 'Unfurnished'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Floor</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{lease?.propertyId?.floorNumber} of {lease?.propertyId?.totalFloors}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <Building size={18} />
              </div>
              Building Amenities & Specs
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Lift Available', show: lease?.propertyId?.hasLift },
                { label: 'Power Backup', show: !!lease?.propertyId?.powerBackup, value: lease?.propertyId?.powerBackup },
                { label: 'Water Supply', show: !!lease?.propertyId?.waterSupply, value: lease?.propertyId?.waterSupply },
                { label: 'Parking', show: !!lease?.propertyId?.parkingDetails, value: lease?.propertyId?.parkingDetails },
                { label: 'Society NOC Required', show: lease?.propertyId?.societyNocRequired },
                { label: 'Electricity Meter', show: !!lease?.propertyId?.electricityMeterType, value: lease?.propertyId?.electricityMeterType + ' Meter' }
              ].map((amenity, i) => amenity.show && (
                <div key={i} className="flex flex-col gap-1 p-3 border border-gray-50 rounded-xl bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{amenity.label}</span>
                  </div>
                  {amenity.value && <span className="text-xs font-bold text-gray-700 ml-5 capitalize">{amenity.value}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency & Schedules */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl">
            <h3 className="text-lg font-bold mb-6">Support & Emergency</h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Primary Contact (Landlord)</p>
                <div className="mt-3 flex items-center gap-3">
                   <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                    <UserIcon size={14} />
                  </div>
                  <p className="text-sm font-semibold">{lease?.propertyId?.userId?.name || 'Landlord'}</p>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-800">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Platform Support</p>
                <div className="mt-3 flex items-center gap-3">
                   <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                    <Mail size={14} />
                  </div>
                  <p className="text-sm font-semibold">support@rentalapp.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Unit Specifics</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <Car size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Parking Spot</p>
                  <p className="text-sm font-bold text-gray-900">{lease?.propertyId?.parkingDetails || 'No Allocated Spot'}</p>
                </div>
              </div>
              {lease?.propertyId?.furnitureInventory && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                    <Info size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Inventory List</p>
                    <p className="text-[11px] font-medium text-gray-600 mt-1 line-clamp-3">{lease.propertyId.furnitureInventory}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
