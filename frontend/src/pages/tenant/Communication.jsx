import { MessageSquare, Bell, Megaphone, Send, User, Check, Trash2 } from "lucide-react";
import Button from "../../components/common/Button.jsx";

export default function Communication() {
  const notices = [
    { title: 'Elevator Maintenance', date: 'May 10, 2026', content: 'Elevator A will be out of service from 9 AM to 3 PM for routine maintenance.', priority: 'Medium' },
    { title: 'Community Pool Reopening', date: 'May 15, 2026', content: 'The community pool is officially opening for the summer season next week!', priority: 'Low' },
    { title: 'Mandatory Fire Inspection', date: 'May 08, 2026', content: 'Fire alarm testing will occur building-wide tomorrow. Please ensure pets are secured.', priority: 'High' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Communication</h1>
          <p className="text-gray-500 mt-1">Announcements, notices, and landlord messaging.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Notices & Announcements */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Megaphone size={20} className="text-orange-500" />
                Latest Announcements
              </h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">3 New</span>
            </div>
            <div className="divide-y divide-gray-50">
              {notices.map((notice, i) => (
                <div key={i} className="p-8 hover:bg-gray-50/50 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900">{notice.title}</h4>
                    <span className="text-xs text-gray-400 font-medium">{notice.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{notice.content}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      notice.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {notice.priority} Priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Community Board</h3>
            <div className="flex flex-col items-center justify-center py-10 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-300 mb-4 shadow-sm">
                <MessageSquare size={30} />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">No community posts yet</h4>
              <p className="text-xs text-gray-500 max-w-[200px]">Start a conversation with your neighbors or post an update.</p>
              <Button variant="outline" className="mt-6 border-gray-200 text-xs font-bold rounded-xl px-6">Create Post</Button>
            </div>
          </div>
        </div>

        {/* Messaging Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare size={20} className="text-emerald-600" />
              Direct Message
            </h3>
            <p className="text-sm text-gray-500 mb-6">Contact your landlord or property manager directly.</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    LM
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 tracking-tight">Leasing Manager</p>
                    <p className="text-[10px] text-emerald-600 font-bold">Online</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm text-xs text-gray-600 leading-relaxed italic">
                  "Hi there! How can I help you today?"
                </div>
              </div>
              
              <div className="relative">
                <textarea 
                  placeholder="Type your message..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all min-h-[100px] resize-none"
                />
                <button className="absolute bottom-3 right-3 w-8 h-8 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-4">
              {[
                { text: 'Rent payment successful', time: '2 days ago', icon: Check },
                { text: 'Maintenance update', time: '1 week ago', icon: Bell }
              ].map((notif, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                    <notif.icon size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{notif.text}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
