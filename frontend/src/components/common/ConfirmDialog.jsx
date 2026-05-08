import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button.jsx';
import { useTranslation } from '../../context/LanguageContext.jsx';

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText, 
  cancelText,
  type = 'danger', // danger, warning, info
  loading = false
}) {
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1a1a1a] border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-800/50">
          <h3 className="text-gray-100 font-bold text-base leading-tight">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex gap-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <div className="shrink-0 w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-500">
              <AlertTriangle size={20} fill="currentColor" fillOpacity={0.2} />
            </div>
            <div>
              <p className="text-gray-100 font-bold text-sm">
                {t('actionCannotBeUndone') || 'This action cannot be undone'}
              </p>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed font-medium">
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-black/20 flex gap-3">
          <Button 
            variant="ghost" 
            className="flex-1 bg-[#2a2a2a] border-none text-gray-100 hover:bg-[#333] py-2.5 rounded-xl font-bold text-sm"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText || t('cancel')}
          </Button>
          <Button 
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all ${
              type === 'danger' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-900/20'
            }`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (t('processing') || 'Processing...') : (confirmText || t('submit'))}
          </Button>
        </div>
      </div>
    </div>
  );
}
