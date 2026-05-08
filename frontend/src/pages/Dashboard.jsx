import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import StatCard from "../components/dashboard/StatCard.jsx";
import { propertiesApi, tenantsApi } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Home, User, Calendar, CreditCard, ArrowUpRight, Building2, Users } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);

  const isLandlord = user?.role === "landlord";

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        if (isLandlord) {
          const [props, tens] = await Promise.all([propertiesApi.list(), tenantsApi.list()]);
          if (!alive) return;
          setProperties(props);
          setTenants(tens);
        } else {
          const tens = await tenantsApi.list();
          if (!alive) return;
          setTenants(tens);
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load dashboard");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [isLandlord]);

  const metrics = useMemo(() => {
    if (isLandlord) {
      const totalProperties = properties.length;
      const occupiedUnits = tenants.length;
      const rentCollected = tenants.reduce((sum, t) => sum + (Number(t.rentAmount) || 0), 0);
      return { totalProperties, occupiedUnits, rentCollected };
    } else {
      const myLease = tenants[0];
      return {
        rentAmount: myLease?.rentAmount || 0,
        landlordName: myLease?.propertyId?.userId?.name || "N/A",
        propertyName: myLease?.propertyId?.name || "N/A",
        leaseEnd: myLease?.leaseEnd ? new Date(myLease.leaseEnd).toLocaleDateString() : "N/A"
      };
    }
  }, [properties, tenants, isLandlord]);

  if (loading) {
    return <div className="rounded-xl border bg-white p-4 text-sm text-gray-600">Loading metrics…</div>;
  }

  if (!isLandlord) {
    return (
      <div>
        <div className="mb-6">
          <div className="text-2xl font-bold text-gray-900">Tenant Dashboard</div>
          <div className="text-sm text-gray-600">Welcome back! Here's your lease overview.</div>
        </div>

        {tenants.length === 0 ? (
          <div className="bg-white rounded-2xl border p-8 text-center max-w-2xl mx-auto mt-4">
            <p className="text-gray-500">No active lease found. Please contact your landlord to link your account.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Monthly Rent" 
              value={`₹ ${Number(metrics.rentAmount).toLocaleString()}`} 
              icon={<CreditCard className="text-emerald-600" size={20} />}
            />
            <StatCard 
              title="Property" 
              value={metrics.propertyName} 
              icon={<Home className="text-blue-600" size={20} />}
            />
            <StatCard 
              title="Landlord" 
              value={metrics.landlordName} 
              icon={<User className="text-purple-600" size={20} />}
            />
            <StatCard 
              title="Lease Ends" 
              value={metrics.leaseEnd} 
              icon={<Calendar className="text-orange-600" size={20} />}
            />
          </div>
        )}
        
        <div className="mt-10 grid gap-6 md:grid-cols-2">
           <div className="bg-white rounded-2xl border p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-500 mb-4">Contact your landlord directly for maintenance requests or lease inquiries.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                  <Mail size={18} />
                </div>
                <div className="text-sm font-medium">{tenants[0]?.propertyId?.userId?.email}</div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  const recentProperties = properties.slice(0, 5);
  const recentTenants = tenants.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-2xl font-bold text-gray-900">Landlord Dashboard</div>
        <div className="text-sm text-gray-600">Overview of your rental portfolio activity.</div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard 
          title="Total Properties" 
          value={metrics.totalProperties} 
          icon={<Building2 className="text-indigo-600" size={20} />}
        />
        <StatCard 
          title="Occupied Units" 
          value={metrics.occupiedUnits} 
          icon={<Users className="text-pink-600" size={20} />}
          hint="Based on current tenants"
        />
        <StatCard 
          title="Monthly Revenue" 
          value={`₹ ${metrics.rentCollected.toLocaleString()}`} 
          icon={<CreditCard className="text-emerald-600" size={20} />}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Properties Grid */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Home size={18} className="text-gray-400" />
              Recent Properties
            </h3>
            <Link 
              to="/properties" 
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
            >
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Property</th>
                  <th className="px-6 py-3 text-right">Rent</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentProperties.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-400">No properties found</td>
                  </tr>
                ) : (
                  recentProperties.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[180px]">{p.address}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">
                        ₹ {Number(p.rent).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          p.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Tenants Grid */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <User size={18} className="text-gray-400" />
              Recent Tenants
            </h3>
            <Link 
              to="/tenants" 
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
            >
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Tenant</th>
                  <th className="px-6 py-3">Property</th>
                  <th className="px-6 py-3 text-right">Rent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentTenants.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-400">No tenants found</td>
                  </tr>
                ) : (
                  recentTenants.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{t.name}</div>
                        <div className="text-xs text-gray-500">{t.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {t.propertyId?.name || "—"}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">
                        ₹ {Number(t.rentAmount).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Helper for the icon support in StatCard if not already there
function Mail({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}
