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
  const [editing, setEditing] = useState(false);
  
  // Search state for tenants
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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
      if (isLandlord) {
        const [t, p] = await Promise.all([tenantsApi.list(), propertiesApi.list()]);
        setTenants(t);
        setProperties(p);
      } else {
        const data = await tenantsApi.list();
        setTenants(data);
        if (data.length > 0) {
          const t = data[0];
          reset({
            name: t.name,
            email: t.email,
            phone: t.phone,
            leaseStart: t.leaseStart?.split('T')[0],
            leaseEnd: t.leaseEnd?.split('T')[0],
            rentAmount: t.rentAmount
          });
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [isLandlord]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await propertiesApi.search(query);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const onJoinProperty = async (propertyId) => {
    try {
      await tenantsApi.join({ propertyId });
      toast.success("Successfully joined the property!");
      setSearchQuery("");
      setSearchResults([]);
      await refresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to join property");
    }
  };

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

  const onUpdateSelf = async (values) => {
    if (tenants.length === 0) return;
    setEditing(true);
    try {
      await tenantsApi.update(tenants[0]._id, {
        name: values.name,
        phone: values.phone
      });
      toast.success("Profile updated");
      await refresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setEditing(false);
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;

  if (!isLandlord) {
    const myLease = tenants[0];
    
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Lease Information</h1>
          <p className="text-sm text-gray-500">Find your landlord and manage your lease details.</p>
        </div>

        {!myLease && (
          <div className="bg-white rounded-2xl border p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Search size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Add Landlord / Property</h3>
                <p className="text-xs text-gray-500">Search by Landlord email or Property name to link your account.</p>
              </div>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                placeholder="Search landlord email or property name..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            {isSearching && <div className="mt-4 text-center text-xs text-gray-500">Searching...</div>}

            {searchResults.length > 0 && (
              <div className="mt-4 border rounded-xl divide-y overflow-hidden">
                {searchResults.map((p) => (
                  <div key={p._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="font-bold text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.address}</div>
                      <div className="mt-1 text-xs text-emerald-600 font-medium">Landlord: {p.userId?.name} ({p.userId?.email})</div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2"
                      onClick={() => onJoinProperty(p._id)}
                    >
                      Join <ArrowRight size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {searchQuery.length >= 3 && searchResults.length === 0 && !isSearching && (
              <div className="mt-4 text-center py-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">No properties found. Try a different search term.</p>
              </div>
            )}
          </div>
        )}

        {myLease && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Lease Summary Card */}
              <div className="bg-white rounded-2xl border p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <Home size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Property Details</h3>
                    <p className="text-xs text-gray-500">{myLease.propertyId?.name || "Unit Info"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Address</span>
                    <span className="font-medium text-gray-900 text-right">{myLease.propertyId?.address}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Landlord</span>
                    <span className="font-medium text-emerald-600">{myLease.propertyId?.userId?.name || "Landlord"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Landlord Email</span>
                    <span className="font-medium text-gray-900">{myLease.propertyId?.userId?.email || "-"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Lease Terms</h3>
                    <p className="text-xs text-gray-500">Duration & Rent</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Monthly Rent</span>
                    <span className="font-bold text-gray-900">₹ {Number(myLease.rentAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Lease Start</span>
                    <span className="font-medium text-gray-900">{new Date(myLease.leaseStart).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Lease End</span>
                    <span className="font-medium text-gray-900">{new Date(myLease.leaseEnd).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Section */}
            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                  <UserIcon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">My Contact Information</h3>
                  <p className="text-xs text-gray-500">Keep your details up to date.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onUpdateSelf)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input 
                    label="Full Name" 
                    error={errors.name?.message} 
                    {...register("name", { required: "Name is required" })} 
                  />
                  <Input 
                    label="Phone Number" 
                    error={errors.phone?.message} 
                    {...register("phone", validators.phone)} 
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input 
                    label="Email" 
                    disabled 
                    className="bg-gray-50"
                    value={myLease.email}
                  />
                  <div className="flex items-end">
                    <Button className="w-full bg-emerald-600" type="submit" disabled={editing}>
                      {editing ? "Updating..." : "Update Profile"}
                    </Button>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">* Email and lease terms can only be changed by your landlord.</p>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Landlord View (same as before)
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
