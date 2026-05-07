import { FileText, Download, Eye, Folder, File, Search, Filter } from "lucide-react";
import Button from "../../components/common/Button.jsx";

export default function Documents() {
  const documents = [
    { name: 'Lease Agreement 2026.pdf', type: 'PDF', size: '2.4 MB', date: 'Jan 01, 2026', category: 'Lease' },
    { name: 'Move-in Inspection.pdf', type: 'PDF', size: '4.1 MB', date: 'Jan 02, 2026', category: 'Inspection' },
    { name: 'Rent Receipt - May.pdf', type: 'PDF', size: '156 KB', date: 'May 01, 2026', category: 'Financial' },
    { name: 'Building Rules.pdf', type: 'PDF', size: '890 KB', date: 'Jan 01, 2026', category: 'Legal' },
    { name: 'Insurance Certificate.pdf', type: 'PDF', size: '1.2 MB', date: 'Feb 15, 2026', category: 'Insurance' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Documents</h1>
          <p className="text-gray-500 mt-1">Access your lease, receipts, and important notices.</p>
        </div>
        <div className="flex gap-3">
           <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search docs..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all w-64"
            />
          </div>
          <Button variant="outline" className="border-gray-200 rounded-2xl flex items-center gap-2">
            <Filter size={18} />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Categories */}
        <div className="md:col-span-1 space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 mb-4">Categories</h3>
          {['All Documents', 'Lease & Legal', 'Financial', 'Inspection', 'Notices'].map((cat, i) => (
            <button 
              key={i}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${i === 0 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <div className="flex items-center gap-3">
                <Folder size={18} className={i === 0 ? 'text-emerald-200' : 'text-gray-400'} />
                {cat}
              </div>
            </button>
          ))}
        </div>

        {/* Document List */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Document Name</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Size</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {documents.map((doc, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                            <File size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{doc.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{doc.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-gray-600">{doc.date}</td>
                      <td className="px-8 py-5 text-sm font-medium text-gray-400">{doc.size}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                            <Eye size={18} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                            <Download size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
