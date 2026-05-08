import { useState, useEffect } from "react";
import { 
  X, 
  FileText, 
  Download, 
  Eye, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileSearch,
  Check,
  Ban
} from "lucide-react";
import { documentsApi } from "../../services/api.js";
import { toast } from "react-hot-toast";

export default function TenantDocumentsModal({ tenant, onClose }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (tenant?._id) {
      fetchDocuments();
    }
  }, [tenant?._id]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentsApi.listByTenant(tenant._id);
      setDocuments(data);
    } catch (error) {
      toast.error("Failed to load tenant documents");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (docId, status) => {
    try {
      setProcessingId(docId);
      await documentsApi.updateStatus(docId, { status });
      toast.success(`Document ${status} successfully`);
      fetchDocuments();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "verified": return <CheckCircle2 size={14} className="text-emerald-500" />;
      case "pending": return <Clock size={14} className="text-amber-500" />;
      case "rejected": return <AlertCircle size={14} className="text-rose-500" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white rounded-[2rem] w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Documents: {tenant.name}</h2>
            <p className="text-xs text-gray-500 mt-0.5">Verify files uploaded by this tenant.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:scale-110 transition-all shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : documents.length > 0 ? (
            <div className="grid gap-3">
              {documents.map((doc) => (
                <div key={doc._id} className="group flex flex-col p-4 bg-white border border-gray-100 rounded-2xl hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/5 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]" title={doc.name}>{doc.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{doc.type}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-200" />
                          <div className="flex items-center gap-1">
                            {getStatusIcon(doc.status)}
                            <span className="text-[10px] font-bold text-gray-500 capitalize">{doc.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="View"
                      >
                        <Eye size={18} />
                      </a>
                      <a 
                        href={doc.url} 
                        download 
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="Download"
                      >
                        <Download size={18} />
                      </a>
                    </div>
                  </div>

                  {/* Verification Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="text-[10px] text-gray-400 font-medium italic">
                      Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      {doc.status !== "rejected" && (
                        <button 
                          onClick={() => handleUpdateStatus(doc._id, "rejected")}
                          disabled={processingId === doc._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all disabled:opacity-50"
                        >
                          <Ban size={12} />
                          Reject
                        </button>
                      )}
                      {doc.status !== "verified" && (
                        <button 
                          onClick={() => handleUpdateStatus(doc._id, "verified")}
                          disabled={processingId === doc._id}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50"
                        >
                          <Check size={12} />
                          Verify Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileSearch size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No documents uploaded yet.</p>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
