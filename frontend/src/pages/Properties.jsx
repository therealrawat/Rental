import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "../components/common/Button.jsx";
import Input from "../components/common/Input.jsx";
import { propertiesApi } from "../services/api.js";
import { validators } from "../utils/validators.js";

export default function Properties() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: { name: "", address: "", units: 1, rent: 0, status: "active" }
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

  const onCreate = async (values) => {
    setCreating(true);
    try {
      await propertiesApi.create(values);
      toast.success("Property created");
      reset();
      await refresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create property");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold text-gray-900">Properties</div>
          <div className="text-sm text-gray-600">Create and manage properties.</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4 text-sm font-semibold text-gray-900">Add property</div>
          <form className="space-y-3" onSubmit={handleSubmit(onCreate)}>
            <Input label="Name" error={errors.name?.message} {...register("name", { required: "Name is required" })} />
            <Input
              label="Address"
              error={errors.address?.message}
              {...register("address", { required: "Address is required" })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Units"
                type="text"
                error={errors.units?.message}
                {...register("units", validators.integer)}
              />
              <Input
                label="Rent"
                type="text"
                error={errors.rent?.message}
                {...register("rent", validators.amount)}
              />
            </div>
            <label className="block">
              <div className="mb-1 text-sm font-medium text-gray-700">Status</div>
              <select
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200"
                {...register("status")}
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </label>
            <Button className="w-full" disabled={creating} type="submit">
              {creating ? "Creating..." : "Create property"}
            </Button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-900">Your properties</div>
              <Button variant="ghost" onClick={refresh} type="button" disabled={loading}>
                Refresh
              </Button>
            </div>

            {loading ? (
              <div className="text-sm text-gray-600">Loading…</div>
            ) : items.length === 0 ? (
              <div className="text-sm text-gray-600">No properties yet. Create your first one.</div>
            ) : (
              <div className="divide-y">
                {items.map((p) => (
                  <div key={p._id} className="py-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-medium text-gray-900">{p.name}</div>
                        <div className="text-sm text-gray-600">{p.address}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          Units: {p.units} · Rent: ₹ {Number(p.rent).toLocaleString()} · Status: {p.status}
                        </div>
                      </div>
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
