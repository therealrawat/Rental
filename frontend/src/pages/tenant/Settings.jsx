import { useState } from "react";
import { User, Shield, Bell, CreditCard, Key, Trash2, Camera, Lock, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { authApi } from "../../services/api.js";

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form
  const { register: regProfile, handleSubmit: handleProfileSubmit } = useForm({
    defaultValues: {
      name: user?.name,
      email: user?.email
    }
  });

  // Password Form
  const { register: regPass, handleSubmit: handlePassSubmit, reset: resetPass, watch } = useForm();

  const onUpdateProfile = async (values) => {
    setIsSaving(true);
    try {
      const res = await authApi.updateProfile({ name: values.name });
      updateUser(res.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const onChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    setIsSaving(true);
    try {
      await authApi.updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      toast.success("Password updated successfully");
      resetPass();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update password");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'security', label: 'Security & Password', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Payment Methods', icon: CreditCard },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account, security, and preferences.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Settings Navigation */}
        <div className="lg:col-span-1 space-y-1">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === tab.id ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-emerald-400' : 'text-gray-400'} />
              {tab.label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
            >
              <Trash2 size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-8">Personal Information</h3>
              
              <div className="flex items-center gap-6 mb-10">
                <div className="relative group">
                  <div className="w-24 h-24 bg-gray-900 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                    {user?.name?.charAt(0)}
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                    <Camera size={14} />
                  </button>
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-900">{user?.name}</h4>
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">{user?.role} Account</p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-6">
                <Input 
                  label="Full Name" 
                  {...regProfile("name", { required: true })} 
                />
                <Input 
                  label="Email Address" 
                  {...regProfile("email")} 
                  disabled 
                  className="bg-gray-50 cursor-not-allowed" 
                />
                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit"
                    disabled={isSaving}
                    className="bg-gray-900 text-white px-10 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
                  <Lock size={20} className="text-emerald-600" />
                  Change Password
                </h3>
                
                <form onSubmit={handlePassSubmit(onChangePassword)} className="space-y-6 max-w-md">
                  <Input 
                    label="Current Password" 
                    type="password" 
                    placeholder="••••••••"
                    {...regPass("currentPassword", { required: true })}
                  />
                  <div className="pt-4 border-t border-gray-50 space-y-6">
                    <Input 
                      label="New Password" 
                      type="password" 
                      placeholder="••••••••"
                      {...regPass("newPassword", { required: true, minLength: 6 })}
                    />
                    <Input 
                      label="Confirm New Password" 
                      type="password" 
                      placeholder="••••••••"
                      {...regPass("confirmPassword", { required: true })}
                    />
                  </div>
                  <Button 
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold shadow-lg shadow-emerald-600/20"
                  >
                    {isSaving ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                      <Shield size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-gray-200 rounded-full relative p-1 cursor-pointer transition-colors hover:bg-gray-300">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
             <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-8">Notification Preferences</h3>
                <div className="space-y-6">
                  {['Email Notifications', 'Push Notifications', 'Payment Reminders', 'Maintenance Updates'].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item}</p>
                        <p className="text-xs text-gray-500">Receive alerts via your selected method.</p>
                      </div>
                      <div className="w-12 h-6 bg-emerald-500 rounded-full relative p-1 cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {activeTab === 'billing' && (
             <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-8">Saved Payment Methods</h3>
                <div className="p-6 border-2 border-dashed border-gray-200 rounded-3xl text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <CreditCard size={32} />
                  </div>
                  <p className="text-sm font-bold text-gray-900">No cards saved yet</p>
                  <p className="text-xs text-gray-500 mt-1 mb-6">Add a payment method for faster rent payments.</p>
                  <Button variant="outline" className="border-gray-200 px-8 rounded-xl font-bold text-xs">Add New Card</Button>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
