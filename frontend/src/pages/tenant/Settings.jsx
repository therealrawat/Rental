import { User, Shield, Bell, CreditCard, Key, Trash2, Camera } from "lucide-react";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account, security, and notifications.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Settings Navigation */}
        <div className="lg:col-span-1 space-y-1">
          {[
            { label: 'Profile Information', icon: User, active: true },
            { label: 'Security & Password', icon: Shield },
            { label: 'Notifications', icon: Bell },
            { label: 'Payment Methods', icon: CreditCard },
          ].map((item, i) => (
            <button 
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                item.active ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon size={18} className={item.active ? 'text-emerald-400' : 'text-gray-400'} />
              {item.label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all">
              <Trash2 size={18} />
              Delete Account
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
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
                <p className="text-sm text-gray-500">{user?.role?.toUpperCase()} Account</p>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="First Name" defaultValue={user?.name?.split(' ')[0]} />
                <Input label="Last Name" defaultValue={user?.name?.split(' ')[1]} />
              </div>
              <Input label="Email Address" defaultValue={user?.email} disabled className="bg-gray-50" />
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="Phone Number" placeholder="+91 00000 00000" />
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Timezone</label>
                  <select className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                    <option>IST (UTC+5:30)</option>
                    <option>GMT (UTC+0)</option>
                    <option>EST (UTC-5)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button className="bg-gray-900 text-white px-10 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Security Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-gray-900">Security</h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">Strong Account</span>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                    <Key size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Change Password</p>
                    <p className="text-xs text-gray-500">Last updated 3 months ago</p>
                  </div>
                </div>
                <Button variant="outline" className="border-gray-200 text-xs font-bold rounded-xl px-6">Update</Button>
              </div>

              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                    <Shield size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500">Enhance your account security</p>
                  </div>
                </div>
                <div className="w-10 h-5 bg-emerald-500 rounded-full relative p-1 cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
