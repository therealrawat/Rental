import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { paymentsApi } from "../services/api.js";
import { 
  CreditCard, 
  CheckCircle2, 
  X, 
  Clock, 
  Search, 
  Filter,
  DollarSign,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import Button from "../components/common/Button.jsx";
import { useTranslation } from "../context/LanguageContext.jsx";

export default function Finance() {
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchPayments = async () => {
    try {
      const data = await paymentsApi.list();
      setPayments(data);
    } catch (err) {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleApprove = async (id, status) => {
    try {
      await paymentsApi.approve(id, { status });
      toast.success(`Payment ${status === 'approved' ? 'approved' : 'rejected'}`);
      fetchPayments();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-medium">Opening your financial books...</p>
    </div>
  );

  const stats = {
    total: payments.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').length,
    recent: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  };

  const filteredPayments = payments.filter(p => filter === "all" ? true : p.status === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t('finance')}</h1>
          <p className="text-gray-500 mt-2 font-medium">{t('portfolioOverview')}</p>
        </div>
        <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
          {['all', 'pending', 'approved'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-[2rem] p-8 text-white shadow-xl">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{t('totalRevenue')}</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black">₹ {stats.total.toLocaleString()}</p>
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{t('pendingVerifications')}</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black text-amber-600">{stats.pending}</p>
            <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
              <Clock size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{t('awaitingApproval')}</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black text-indigo-600">₹ {stats.recent.toLocaleString()}</p>
            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
              <DollarSign size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h3 className="font-bold text-gray-900">Rent Payment Ledger</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder={t('searchTenant')} 
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 transition-all w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {filteredPayments.length === 0 ? (
            <div className="p-20 text-center text-gray-400">
              <AlertCircle size={40} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm font-medium">No payments matching your filter.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('tenants')} / {t('properties')}</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('reference')} / {t('payments')}</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('amountPaid')}</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('paymentMethod')}</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('status')}</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">{t('edit')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPayments.map((pay) => (
                  <tr key={pay._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-10 py-6">
                      <p className="text-sm font-bold text-gray-900">{pay.tenantId?.name}</p>
                      <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5">{pay.propertyId?.name}</p>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {pay.paidMonths?.map((m, idx) => (
                          <span key={idx} className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                            {new Date(m.year, m.month - 1).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                          </span>
                        ))}
                        {(!pay.paidMonths || pay.paidMonths.length === 0) && (
                           <p className="text-[10px] text-gray-500">{new Date(pay.paymentDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-sm font-black text-gray-900">₹ {Number(pay.amount).toLocaleString()}</td>
                    <td className="px-10 py-6">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-gray-200">
                        {pay.paymentMethod}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        pay.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        pay.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      {pay.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleApprove(pay._id, 'rejected')}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X size={18} />
                          </button>
                          <button 
                            onClick={() => handleApprove(pay._id, 'approved')}
                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        </div>
                      )}
                      {pay.status !== 'pending' && (
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Finalized</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
