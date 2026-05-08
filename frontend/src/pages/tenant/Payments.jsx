import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { tenantsApi, paymentsApi } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { 
  CreditCard, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle2, 
  Download, 
  Clock, 
  Wallet, 
  AlertCircle,
  X,
  Plus
} from "lucide-react";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";

export default function Payments() {
  const { user } = useAuth();
  const [lease, setLease] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchPaymentData = async () => {
    try {
      const [leaseData, paymentData] = await Promise.all([
        tenantsApi.list(),
        paymentsApi.list()
      ]);
      if (leaseData.length > 0) setLease(leaseData[0]);
      setPayments(paymentData);
    } catch (err) {
      toast.error("Failed to load payment info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const handlePay = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    const payload = {
      amount: formData.get("amount"),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      paymentMethod: formData.get("method"),
      transactionId: formData.get("txnId"),
      notes: formData.get("notes")
    };

    try {
      await paymentsApi.create(payload);
      toast.success("Payment submitted for approval");
      setShowPayModal(false);
      fetchPaymentData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-medium">Loading your financial dashboard...</p>
    </div>
  );

  const isPaymentWindow = new Date().getDate() <= 5;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Rent & Payments</h1>
          <p className="text-gray-500 mt-2 font-medium">Monthly dues and transaction history.</p>
        </div>
        <Button 
          onClick={() => setShowPayModal(true)}
          className="bg-indigo-600 text-white rounded-2xl flex items-center gap-2 px-8 py-3.5 shadow-xl shadow-indigo-200 hover:scale-105 transition-all"
        >
          <Plus size={18} />
          Record Payment
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          {/* Balance Card */}
          <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Current Month Due</p>
                  <p className="text-5xl font-black mt-3 tracking-tighter">₹ {Number(lease?.rentAmount || 0).toLocaleString()}</p>
                </div>
                {isPaymentWindow ? (
                  <div className="bg-emerald-500/20 text-emerald-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/30 flex items-center gap-2">
                    <CheckCircle2 size={14} /> Open Payment Window (1st - 5th)
                  </div>
                ) : (
                  <div className="bg-amber-500/20 text-amber-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-amber-500/30 flex items-center gap-2">
                    <AlertCircle size={14} /> Post-Due Period
                  </div>
                )}
              </div>
              
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-800 pt-10">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Billing Cycle</p>
                  <p className="text-sm font-bold mt-1">Monthly</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Next Due Date</p>
                  <p className="text-sm font-bold mt-1">{new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Maintenance</p>
                  <p className="text-sm font-bold mt-1">₹ {Number(lease?.propertyId?.maintenanceCharges || 0).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Late Fee</p>
                  <p className="text-sm font-bold mt-1 text-red-400">₹ 0.00</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"></div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-lg">Transaction Ledger</h3>
              <Button variant="ghost" size="sm" className="text-indigo-600 text-xs font-black uppercase tracking-widest">Filter by Year</Button>
            </div>
            <div className="overflow-x-auto">
              {payments.length === 0 ? (
                <div className="p-20 text-center text-gray-400">
                  <Clock size={40} className="mx-auto mb-4 opacity-20" />
                  <p className="text-sm font-medium">No payment records found yet.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reference / Period</th>
                      <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Method</th>
                      <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                      <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {payments.map((pay) => (
                      <tr key={pay._id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-10 py-6">
                          <p className="text-sm font-bold text-gray-900">{pay.transactionId || 'CASH_REC'}</p>
                          <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5">{new Date(pay.paymentDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-2">
                            <Wallet size={14} className="text-gray-400" />
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{pay.paymentMethod}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-sm font-black text-gray-900">₹ {Number(pay.amount).toLocaleString()}</td>
                        <td className="px-10 py-6 text-right">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            pay.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                            pay.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 
                            'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {pay.status === 'approved' ? <CheckCircle2 size={12} /> : 
                             pay.status === 'rejected' ? <X size={12} /> : 
                             <Clock size={12} />}
                            {pay.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-indigo-600" />
              Payment Policy
            </h3>
            <div className="space-y-6">
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <p className="text-xs font-bold text-indigo-900">1st - 5th Monthly Window</p>
                <p className="text-[10px] text-indigo-700 mt-1 leading-relaxed">
                  Rent should be recorded between the 1st and 5th of each month. 
                  Landlord approval may take 24-48 hours.
                </p>
              </div>
              <ul className="space-y-4">
                {[
                  { label: 'UPI/Online', val: 'Instant Record' },
                  { label: 'Cash', val: 'Manual Approval' },
                  { label: 'Late Fee', val: 'Applicable after 10th' }
                ].map((item, i) => (
                  <li key={i} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span>{item.label}</span>
                    <span className="text-gray-900">{item.val}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-amber-600 rounded-[2rem] p-8 text-white shadow-xl shadow-amber-600/20">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <AlertCircle size={20} />
              Security Deposit
            </h3>
            <p className="text-xs text-amber-100 mb-6">Fully refundable security amount held by your landlord.</p>
            <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</span>
              <span className="text-xl font-black">₹ {Number(lease?.propertyId?.securityDeposit || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Record Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-10 py-8 border-b flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Record Payment</h3>
                <p className="text-xs text-gray-500 mt-1">Submit details for landlord approval.</p>
              </div>
              <button onClick={() => setShowPayModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handlePay} className="p-10 space-y-6">
              <Input 
                label="Amount Paid" 
                name="amount" 
                type="number" 
                defaultValue={lease?.rentAmount} 
                required 
              />
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Payment Method</label>
                <select name="method" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="Bank Transfer">Bank Transfer (IMPS/NEFT)</option>
                  <option value="Cash">Cash Payment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <Input 
                label="Transaction ID / Reference" 
                name="txnId" 
                placeholder="UTR Number or Receipt Ref" 
              />

              <Input 
                label="Notes (Optional)" 
                name="notes" 
                placeholder="Mention any adjustments" 
              />

              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-indigo-600 text-white py-4 font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 mt-4"
              >
                {submitting ? "Submitting..." : "Submit for Approval"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
