import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { tenantsApi } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { CreditCard, Calendar, ArrowUpRight, CheckCircle2, Download, Clock } from "lucide-react";
import Button from "../../components/common/Button.jsx";

export default function Payments() {
  const { user } = useAuth();
  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await tenantsApi.list();
        if (data.length > 0) setLease(data[0]);
      } catch (err) {
        toast.error("Failed to load payment info");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading payment history...</div>;

  const paymentHistory = [
    { date: 'May 01, 2026', amount: lease?.rentAmount, status: 'Paid', method: 'Auto-pay' },
    { date: 'Apr 01, 2026', amount: lease?.rentAmount, status: 'Paid', method: 'Auto-pay' },
    { date: 'Mar 01, 2026', amount: lease?.rentAmount, status: 'Paid', method: 'Manual' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Rent & Payments</h1>
        <p className="text-gray-500 mt-1">Manage your billing, payments, and history.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Current Balance */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Next Payment Due</p>
                  <p className="text-4xl font-bold mt-2">₹ {Number(lease?.rentAmount || 0).toLocaleString()}</p>
                </div>
                <div className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-500/30">
                  Due in 22 days
                </div>
              </div>
              
              <div className="mt-10 grid grid-cols-2 gap-8 border-t border-gray-700 pt-8">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Due Date</p>
                  <p className="text-sm font-semibold mt-1">June 01, 2026</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Outstanding</p>
                  <p className="text-sm font-semibold mt-1">₹ 0.00</p>
                </div>
              </div>
            </div>
            
            {/* Decorative background element */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Recent Transactions</h3>
              <Button variant="ghost" size="sm" className="text-emerald-600 text-xs font-bold">View All</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paymentHistory.map((pay, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-4 text-sm font-medium text-gray-900">{pay.date}</td>
                      <td className="px-8 py-4 text-sm font-bold text-gray-900">₹ {Number(pay.amount).toLocaleString()}</td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <CheckCircle2 size={14} />
                          <span className="text-xs font-bold">{pay.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <button className="text-gray-400 hover:text-emerald-600 transition-colors">
                          <Download size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Method</h3>
            <div className="p-4 rounded-2xl border-2 border-emerald-100 bg-emerald-50/30 flex items-center gap-4">
              <div className="w-12 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-[10px] font-bold text-white tracking-widest">
                VISA
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">•••• 4242</p>
                <p className="text-[10px] text-gray-500 font-medium">Expires 12/28</p>
              </div>
              <div className="text-emerald-600">
                <CheckCircle2 size={18} />
              </div>
            </div>
            
            <div className="mt-8 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Auto-pay enabled</span>
                <div className="w-10 h-5 bg-emerald-500 rounded-full relative p-1 cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 border-gray-200 text-xs font-bold rounded-xl py-2.5">
                Add New Method
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Security Deposit</h3>
            <p className="text-sm text-gray-500 mb-6">Held by landlord until move-out.</p>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Balance</span>
              <span className="text-lg font-bold text-gray-900">₹ {(lease?.rentAmount * 2).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
