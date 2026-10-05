import React, { useState } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../services/aiBmcService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredApiKey(apiKey);
    setIsSaved(true);
    if (onSaved) onSaved();
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setStoredApiKey('');
    setApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-amber-300">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Kunci Gemini API (Hosting Netlify)</h3>
              <p className="text-[11px] text-slate-400">Untuk pemrosesan AI di hosting statis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs text-indigo-900 leading-relaxed">
            <p className="font-semibold mb-1">💡 Mengapa ini diperlukan di Netlify?</p>
            <p className="text-slate-600 text-[11px]">
              Netlify secara default meng-hosting file statis. Agar fitur pembuatan AI bekerja tanpa server Node.js terpisah, Anda dapat memasukkan Gemini API Key gratis di sini atau mengatur Environment Variable <code className="bg-indigo-100/80 px-1 py-0.5 rounded font-mono text-[10px]">GEMINI_API_KEY</code> di Netlify.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
            />
            <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Disimpan secara aman di peramban lokal Anda.</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline inline-flex items-center space-x-0.5"
              >
                <span>Dapatkan API Key Gratis</span>
                <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
              </a>
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-500 hover:underline"
              >
                Hapus Kunci
              </button>
            )}
            <div className="flex items-center space-x-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tersimpan!</span>
                  </>
                ) : (
                  <span>Simpan Kunci</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
