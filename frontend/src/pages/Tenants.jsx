import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "../components/common/Button.jsx";
import Input from "../components/common/Input.jsx";
import { propertiesApi, tenantsApi } from "../services/api.js";

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

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
      toast.error(err?.response?.data?.message || "Failed to load tenants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const onCreate = async (values) => {
    setCreating(true);
    try {
      await tenantsApi.create(values);
      toast.success("Tenant created");
      reset();
      await refresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create tenant");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="text-2xl font-semibold text-gray-900">Tenants</div>
        <div className="text-sm text-gray-600">Track leases and rent.</div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4 text-sm font-semibold text-gray-900">Add tenant</div>
          <form className="space-y-3" onSubmit={handleSubmit(onCreate)}>
            <label className="block">
              <div className="mb-1 text-sm font-medium text-gray-700">Property</div>
              <select
                className={[
                  "w-full rounded-lg border bg-white px-3 py-2 text-sm focus:ring-2",
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
              type="email"
              error={errors.email?.message}
              {...register("email", { required: "Email is required" })}
            />
            <Input
              label="Phone"
              error={errors.phone?.message}
              {...register("phone", { required: "Phone is required" })}
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
              type="number"
              error={errors.rentAmount?.message}
              {...register("rentAmount", { required: "Rent required", valueAsNumber: true, min: 0 })}
            />

            <Button className="w-full" disabled={creating} type="submit">
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
