import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "../components/common/Button.jsx";
import Input from "../components/common/Input.jsx";
import { propertiesApi, tenantsApi } from "../services/api.js";
import { validators } from "../utils/validators.js";
import { useAuth } from "../context/AuthContext.jsx";
import { User as UserIcon, Home, Calendar, CreditCard, Search, ArrowRight } from "lucide-react";

export default function Tenants() {
  const { user } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const isLandlord = user?.role === "landlord";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      propertyId: "",
      name: "",
      email: "",
      phone: "",
      leaseStart: "",
      leaseEnd: "",
      rentAmount: 0
    }
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

  const onCreate = async (values) => {
    setCreating(true);
    try {
      const res = await tenantsApi.create(values);
      toast.success(res.message || "Tenant created successfully");
      reset();
      await refresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create tenant");
    } finally {
      setCreating(false);
    }
  };

  if (!isLandlord) {
    return (
      <div className="max-w-4xl mx-auto text-center mt-20">
        <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
        <p className="text-gray-500 mt-2">Only landlords can manage the list of tenants.</p>
        <p className="text-sm text-gray-400 mt-4 italic">Please check "My Lease" for your personal information.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="text-2xl font-semibold text-gray-900">Tenants</div>
        <div className="text-sm text-gray-600">Track leases and rent.</div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4 text-sm font-semibold text-gray-900">Add tenant</div>
          <p className="text-[10px] text-gray-400 mb-4">* Adding a tenant will automatically create a user account for them with the password "pass123".</p>
          <form className="space-y-3" onSubmit={handleSubmit(onCreate)}>
            <label className="block">
              <div className="mb-1 text-sm font-medium text-gray-700">Property</div>
              <select
                className={[
                  "w-full rounded-lg border bg-white px-3 py-2 text-sm focus:ring-2 outline-none transition",
                  errors.propertyId ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-indigo-200"
                ].join(" ")}
                {...register("propertyId", { required: "Property is required" })}
              >
                <option value="">Select a property</option>
                {properties.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.propertyId ? <div className="mt-1 text-xs text-red-600">{errors.propertyId.message}</div> : null}
            </label>

            <Input label="Name" error={errors.name?.message} {...register("name", { required: "Name is required" })} />
            <Input
              label="Email"
              type="text"
              error={errors.email?.message}
              {...register("email", validators.email)}
            />
            <Input
              label="Phone"
              type="text"
              error={errors.phone?.message}
              {...register("phone", validators.phone)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Lease start"
                type="date"
                error={errors.leaseStart?.message}
                {...register("leaseStart", { required: "Start date required" })}
              />
              <Input
                label="Lease end"
                type="date"
                error={errors.leaseEnd?.message}
                {...register("leaseEnd", { required: "End date required" })}
              />
            </div>
            <Input
              label="Rent amount"
              type="text"
              error={errors.rentAmount?.message}
              {...register("rentAmount", validators.amount)}
            />

            <Button className="w-full bg-gray-900 text-white" disabled={creating} type="submit">
              {creating ? "Creating..." : "Create tenant"}
            </Button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-900">Your tenants</div>
              <Button variant="ghost" onClick={refresh} type="button" disabled={loading}>
                Refresh
              </Button>
            </div>

            {loading ? (
              <div className="text-sm text-gray-600">Loading…</div>
            ) : tenants.length === 0 ? (
              <div className="text-sm text-gray-600">No tenants yet. Add your first tenant.</div>
            ) : (
              <div className="divide-y">
                {tenants.map((t) => (
                  <div key={t._id} className="py-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-medium text-gray-900">{t.name}</div>
                        <div className="text-sm text-gray-600">{t.email}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          Property: {t.propertyId?.name || "—"} · Rent: ₹ {Number(t.rentAmount).toLocaleString()}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          Lease: {new Date(t.leaseStart).toLocaleDateString()} → {new Date(t.leaseEnd).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500">{t.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
