import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import StatCard from "../components/dashboard/StatCard.jsx";
import { propertiesApi, tenantsApi } from "../services/api.js";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const [props, tens] = await Promise.all([propertiesApi.list(), tenantsApi.list()]);
        if (!alive) return;
        setProperties(props);
        setTenants(tens);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load dashboard");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const totalProperties = properties.length;
    const occupiedUnits = tenants.length;
    const rentCollected = tenants.reduce((sum, t) => sum + (Number(t.rentAmount) || 0), 0);
    return { totalProperties, occupiedUnits, rentCollected };
  }, [properties, tenants]);

  return (
    <div>
      <div className="mb-6">
        <div className="text-2xl font-semibold text-gray-900">Dashboard</div>
        <div className="text-sm text-gray-600">A quick overview of your portfolio.</div>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-white p-4 text-sm text-gray-600">Loading metrics…</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Total properties" value={metrics.totalProperties} />
          <StatCard title="Occupied units" value={metrics.occupiedUnits} hint="Based on tenants count" />
          <StatCard title="Rent collected (monthly)" value={`₹ ${metrics.rentCollected.toLocaleString()}`} />
        </div>
      )}
    </div>
  );
}
