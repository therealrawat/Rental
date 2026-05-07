import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import { Wrench, Plus, Clock, CheckCircle2, Image as ImageIcon, AlertCircle, ChevronRight } from "lucide-react";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";

export default function Maintenance() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  
  const requests = [
    { id: 1, title: 'Kitchen Sink Leak', status: 'In Progress', date: 'May 05, 2026', category: 'Plumbing', priority: 'High' },
    { id: 2, title: 'AC Filter Replacement', status: 'Completed', date: 'Apr 20, 2026', category: 'HVAC', priority: 'Medium' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'In Progress': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Maintenance</h1>
          <p className="text-gray-500 mt-1">Submit and track your repair requests.</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 rounded-2xl px-6"
        >
          {showForm ? 'View All' : <><Plus size={20} /> New Request</>}
        </Button>
      </div>

      {showForm ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-xl font-bold text-gray-900 mb-6">New Maintenance Request</h3>
          <form className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Issue Category</label>
                <select className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                  <option>Plumbing</option>
                  <option>Electrical</option>
                  <option>HVAC</option>
                  <option>Appliance</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Priority</label>
                <select className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High (Emergency)</option>
                </select>
              </div>
            </div>

            <Input label="Short Title" placeholder="e.g., Leaking faucet in master bath" />

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Detailed Description</label>
              <textarea 
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[120px]"
                placeholder="Describe the issue in detail..."
              />
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-emerald-300 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-50 transition-colors">
                <ImageIcon size={24} className="text-gray-400 group-hover:text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-gray-900">Upload Photos</p>
              <p className="text-xs text-gray-400 mt-1">Drag and drop or click to browse</p>
            </div>

            <Button className="w-full bg-emerald-600 py-4 text-white font-bold rounded-2xl mt-4 shadow-lg shadow-emerald-600/20">
              Submit Request
            </Button>
          </form>
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Open Requests</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">1</p>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">In Progress</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">1</p>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Resolved (30d)</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">4</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50">
              <h3 className="font-bold text-gray-900">Request History</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {requests.map((req) => (
                <div key={req.id} className="p-6 hover:bg-gray-50/50 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${getStatusColor(req.status)}`}>
                        {req.status === 'Completed' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{req.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="font-medium">{req.category}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>{req.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(req.status)}`}>
                        {req.status}
                      </div>
                      <ChevronRight size={20} className="text-gray-300 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
