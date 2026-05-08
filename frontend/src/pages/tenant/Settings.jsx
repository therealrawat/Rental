import { useState } from "react";
import { User, Shield, Bell, CreditCard, Key, Trash2, Camera, Lock, CheckCircle2, Upload, Loader2 } from "lucide-react";
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
  const [isUploading, setIsUploading] = useState(false);

  // Profile Form
  const { register: regProfile, handleSubmit: handleProfileSubmit } = useForm({
    defaultValues: {
      name: user?.name,
      email: user?.email
    }
  });

  // Password Form
  const { register: regPass, handleSubmit: handlePassSubmit, reset: resetPass } = useForm();

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

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setIsUploading(true);
    try {
      const res = await authApi.updateAvatar(formData);
      updateUser(res.user);
      toast.success("Avatar updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Avatar upload failed");
    } finally {
      setIsUploading(false);
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
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-500 mt-2 text-lg">Personalize your experience and manage security.</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-4">
        {/* Settings Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-3xl text-sm font-black transition-all ${
                activeTab === tab.id ? 'bg-gray-900 text-white shadow-2xl shadow-gray-900/30' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-emerald-400' : 'text-gray-400'} />
              {tab.label}
            </button>
          ))}
          <div className="pt-6 mt-6 border-t border-gray-100">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-6 py-4 rounded-3xl text-sm font-black text-rose-500 hover:bg-rose-50 transition-all"
            >
              <Trash2 size={18} />
              Logout Account
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-xl font-black text-gray-900 mb-10">Personal Information</h3>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-50">
                <div className="relative shrink-0">
                  <div className="w-32 h-32 bg-gray-900 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl overflow-hidden relative border-4 border-white">
                    {isUploading && (
                      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-10 flex items-center justify-center">
                        <Loader2 className="animate-spin text-emerald-400" size={32} />
                      </div>
                    )}
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0)
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-white cursor-pointer hover:scale-110 active:scale-95 transition-all">
                    <Camera size={18} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
                  </label>
                </div>
                <div className="text-center md:text-left flex-1 min-w-0 pt-2">
                  <h4 className="font-black text-3xl text-gray-900 truncate" title={user?.name}>{user?.name}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-2 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">{user?.role} Account</span>
                    <span className="text-sm text-gray-400 font-medium">{user?.email}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-4 max-w-sm italic leading-relaxed">Update your profile photo to help others recognize you. High resolution JPG or PNG recommended.</p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <Input 
                    label="Full Name" 
                    {...regProfile("name", { required: true })} 
                    className="rounded-2xl"
                  />
                  <Input 
                    label="Email Address" 
                    {...regProfile("email")} 
                    disabled 
                    className="bg-gray-50 cursor-not-allowed rounded-2xl border-gray-100 text-gray-400" 
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit"
                    disabled={isSaving}
                    className="bg-gray-900 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-gray-900/30"
                  >
                    {isSaving ? "Saving..." : "Update Profile"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 mb-10 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <Lock size={20} />
                  </div>
                  Change Password
                </h3>
                
                <form onSubmit={handlePassSubmit(onChangePassword)} className="space-y-8 max-w-lg">
                  <Input 
                    label="Current Password" 
                    type="password" 
                    placeholder="••••••••"
                    {...regPass("currentPassword", { required: true })}
                    className="rounded-2xl"
                  />
                  <div className="pt-8 border-t border-gray-50 grid gap-8 md:grid-cols-2">
                    <Input 
                      label="New Password" 
                      type="password" 
                      placeholder="••••••••"
                      {...regPass("newPassword", { required: true, minLength: 6 })}
                      className="rounded-2xl"
                    />
                    <Input 
                      label="Confirm New Password" 
                      type="password" 
                      placeholder="••••••••"
                      {...regPass("confirmPassword", { required: true })}
                      className="rounded-2xl"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      disabled={isSaving}
                      className="px-12 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all"
                    >
                      {isSaving ? "Updating..." : "Secure Account"}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-emerald-600 shadow-inner">
                      <Shield size={28} />
                    </div>
                    <div>
                      <p className="text-lg font-black text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                    </div>
                  </div>
                  <div className="w-14 h-7 bg-gray-200 rounded-full relative p-1 cursor-pointer transition-colors hover:bg-gray-300">
                    <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
             <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xl font-black text-gray-900 mb-10">Notification Preferences</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Email Notifications', desc: 'Receive daily updates and rent alerts.' },
                    { label: 'Push Notifications', desc: 'Real-time alerts on your mobile device.' },
                    { label: 'Payment Reminders', desc: 'Get notified 3 days before rent is due.' },
                    { label: 'Maintenance Updates', desc: 'Track progress of your service requests.' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-3xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                      <div>
                        <p className="text-base font-black text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                      </div>
                      <div className="w-14 h-7 bg-emerald-500 rounded-full relative p-1 cursor-pointer shadow-inner shadow-emerald-700/20">
                        <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-lg"></div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {activeTab === 'billing' && (
             <div className="bg-white rounded-[2.5rem] border border-gray-100 p-12 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xl font-black text-gray-900 mb-10">Payment Methods</h3>
                <div className="p-12 border-4 border-dashed border-gray-50 rounded-[3rem] text-center bg-gray-50/20">
                  <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-200 shadow-sm">
                    <CreditCard size={40} />
                  </div>
                  <p className="text-lg font-black text-gray-900">No cards saved yet</p>
                  <p className="text-sm text-gray-500 mt-2 mb-10 max-w-xs mx-auto">Add a payment method for faster and automated rent payments.</p>
                  <Button variant="outline" className="border-gray-200 px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">Add New Card</Button>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
