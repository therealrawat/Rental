import { useState, useEffect } from "react";
import { 
  FileText, 
  Download, 
  Eye, 
  Folder, 
  File, 
  Search, 
  Filter, 
  Upload, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Trash2,
  Plus
} from "lucide-react";
import Button from "../../components/common/Button.jsx";
import { documentsApi } from "../../services/api.js";
import { toast } from "react-hot-toast";
import "../../styles/documents.css";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedType, setSelectedType] = useState("aadhar");
  const [file, setFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All Documents");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentsApi.list();
      setDocuments(data);
    } catch (error) {
      toast.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", selectedType);
    formData.append("name", file.name);

    try {
      setUploading(true);
      await documentsApi.upload(formData);
      toast.success("Document uploaded successfully");
      setShowUploadModal(false);
      setFile(null);
      fetchDocuments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await documentsApi.remove(id);
      toast.success("Document deleted");
      fetchDocuments();
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === "All Documents" || 
                         (filterCategory === "Identity" && ["aadhar", "pan"].includes(doc.type)) ||
                         (filterCategory === "Lease" && doc.type === "agreement") ||
                         (filterCategory === "Other" && doc.type === "other") ||
                         (filterCategory === "Photos" && doc.type === "photo");
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "verified": return <CheckCircle2 size={16} className="text-emerald-500" />;
      case "pending": return <Clock size={16} className="text-amber-500" />;
      case "rejected": return <AlertCircle size={16} className="text-rose-500" />;
      default: return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "verified": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "pending": return "bg-amber-50 text-amber-700 border-amber-100";
      case "rejected": return "bg-rose-50 text-rose-700 border-rose-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Documents</h1>
          <p className="text-gray-500 mt-2 text-lg">Securely manage your identity and lease documents.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all w-full md:w-64 shadow-sm"
            />
          </div>
          <Button 
            onClick={() => setShowUploadModal(true)}
            className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 px-6 py-3 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Upload size={18} />
            Upload New
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Sidebar Filter */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white/50 backdrop-blur-sm p-2 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 py-4">Categories</h3>
            <div className="space-y-1">
              {['All Documents', 'Identity', 'Lease', 'Photos', 'Other'].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-between group ${filterCategory === cat ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}
                >
                  <div className="flex items-center gap-3">
                    <Folder size={18} className={filterCategory === cat ? 'text-emerald-200' : 'text-gray-400 group-hover:text-emerald-500'} />
                    {cat}
                  </div>
                  {filterCategory !== cat && <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-emerald-900 rounded-3xl p-6 text-white overflow-hidden relative group">
            <div className="relative z-10">
              <h4 className="font-bold text-lg">Need help?</h4>
              <p className="text-emerald-200 text-xs mt-2 leading-relaxed">If you're having trouble uploading, contact support.</p>
              <button className="mt-4 text-xs font-black uppercase tracking-widest bg-white text-emerald-900 px-4 py-2 rounded-xl hover:bg-emerald-50 transition-colors">Contact Support</button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-800 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-9 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : filteredDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc) => (
                <div key={doc._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group relative overflow-hidden flex flex-col h-full">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                        <FileText size={24} />
                      </div>
                      <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${getStatusClass(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        {doc.status}
                      </div>
                    </div>
                    
                    <h3 className="text-gray-900 font-bold text-lg line-clamp-1 group-hover:text-emerald-600 transition-colors" title={doc.name}>{doc.name}</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">{doc.type}</p>
                    
                    <p className="text-gray-400 text-xs mt-4 flex items-center gap-2">
                      <Clock size={12} />
                      {new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between gap-2">
                    <div className="flex gap-1">
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                      >
                        <Eye size={18} />
                      </a>
                      <a 
                        href={doc.url} 
                        download 
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                      >
                        <Download size={18} />
                      </a>
                    </div>
                    <button 
                      onClick={() => handleDelete(doc._id)}
                      className="p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Add New Card */}
              <button 
                onClick={() => setShowUploadModal(true)}
                className="bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group h-full min-h-[220px]"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-emerald-600 group-hover:scale-110 transition-all shadow-sm">
                  <Plus size={24} />
                </div>
                <p className="mt-4 text-sm font-bold text-gray-500 group-hover:text-emerald-600">Upload New Document</p>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Folder size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No documents found</h3>
              <p className="text-gray-500 mt-2 max-w-xs mx-auto">Start by uploading your identity proofs or lease agreement.</p>
              <Button 
                onClick={() => setShowUploadModal(true)}
                className="mt-8 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white px-8"
              >
                Upload First Doc
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
          
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg relative z-10 shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Upload Document</h2>
                <p className="text-gray-500 text-sm mt-1">Files supported: JPG, PNG, PDF</p>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:scale-110 transition-all shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Document Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'aadhar', label: 'Aadhar Card' },
                    { id: 'pan', label: 'PAN Card' },
                    { id: 'photo', label: 'Passport Photo' },
                    { id: 'agreement', label: 'Lease Agreement' },
                    { id: 'other', label: 'Other' }
                  ].map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${selectedType === type.id ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'bg-white border-gray-100 text-gray-600 hover:border-emerald-200'}`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">File</label>
                <div 
                  className={`border-2 border-dashed rounded-[2rem] p-8 text-center transition-all cursor-pointer group ${file ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200 hover:border-emerald-400 hover:bg-gray-50'}`}
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => setFile(e.target.files[0])}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                        <CheckCircle2 size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{file.name}</p>
                        <p className="text-[10px] text-emerald-600 font-black uppercase">Selected</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 mx-auto shadow-sm group-hover:scale-110 group-hover:text-emerald-600 transition-all">
                        <Upload size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Click to upload or drag & drop</p>
                        <p className="text-xs text-gray-400 mt-1">Maximum file size 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={uploading || !file}
                className="w-full py-4 rounded-[1.5rem] bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
              >
                {uploading ? "Uploading..." : "Start Upload"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
