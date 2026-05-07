import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import StatCard from "../components/dashboard/StatCard.jsx";
import { propertiesApi, tenantsApi } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Home, User, Calendar, CreditCard } from "lucide-react";

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
        
        {/* Placeholder for common things like maintenance or docs */}
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

  return (
    <div>
      <div className="mb-6">
        <div className="text-2xl font-semibold text-gray-900">Landlord Dashboard</div>
        <div className="text-sm text-gray-600">A quick overview of your portfolio.</div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total properties" value={metrics.totalProperties} />
        <StatCard title="Occupied units" value={metrics.occupiedUnits} hint="Based on tenants count" />
        <StatCard title="Rent collected (monthly)" value={`₹ ${metrics.rentCollected.toLocaleString()}`} />
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
