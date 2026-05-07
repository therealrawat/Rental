import { useEffect, useState } from "react";
import { tenantsApi } from "../../services/api.js";
import { Info, MapPin, Building, ShieldCheck, Truck, Car, Phone, Mail } from "lucide-react";

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
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Unit Number</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">4B</p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Square Footage</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">1,250 sq ft</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bed / Bath</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">2 Bed / 2 Bath</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Floor</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">4th Floor</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <Building size={18} />
              </div>
              Building Amenities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {['24/7 Gym', 'Rooftop Lounge', 'Covered Parking', 'Swimming Pool', 'Package Room', 'Bike Storage'].map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 p-3 border border-gray-50 rounded-xl bg-gray-50/50">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span className="text-xs font-semibold text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency & Schedules */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl">
            <h3 className="text-lg font-bold mb-6">Emergency Contacts</h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Main Landlord</p>
                <div className="mt-3 flex items-center gap-3">
                   <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                    <Phone size={14} />
                  </div>
                  <p className="text-sm font-semibold">{lease?.propertyId?.userId?.name || 'Contact Landlord'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">24/7 Maintenance</p>
                <div className="mt-3 flex items-center gap-3">
                   <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                    <Phone size={14} />
                  </div>
                  <p className="text-sm font-semibold">+91 98765 43210</p>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-800">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Building Security</p>
                <div className="mt-3 flex items-center gap-3">
                   <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">
                    <ShieldCheck size={14} />
                  </div>
                  <p className="text-sm font-semibold">Extension 101</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Utilities & Schedules</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trash Pickup</p>
                  <p className="text-sm font-bold text-gray-900">Mon, Wed, Fri</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <Car size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Parking Spot</p>
                  <p className="text-sm font-bold text-gray-900">Level 2, Spot #142</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
