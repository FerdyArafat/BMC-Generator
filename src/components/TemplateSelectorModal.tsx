import React from 'react';
import { X, Building2, Check, ArrowRight, Bot, Coffee, ShoppingBag, Sparkles } from 'lucide-react';
import { BMC_TEMPLATES } from '../data/templates';
import { BmcData, BmcTemplate } from '../types/bmc';

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateData: BmcData) => void;
}

const ICON_MAP: Record<string, any> = {
  Bot,
  Coffee,
  ShoppingBag,
  Sparkles,
};

export const TemplateSelectorModal: React.FC<TemplateSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Pilih Template Industri Siap Pakai</h2>
              <p className="text-xs text-slate-300">
                Mulai instan tanpa perlu dari nol dengan model bisnis teruji dan poin terisi lengkap
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          {BMC_TEMPLATES.map((tmpl) => {
            const Icon = ICON_MAP[tmpl.icon] || Building2;
            return (
              <div
                key={tmpl.id}
                className="rounded-2xl border border-slate-200 hover:border-indigo-400 p-5 flex flex-col justify-between hover:shadow-md transition-all group bg-gradient-to-b from-white to-slate-50/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {tmpl.industry}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>

                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>9 Blok Terisi Lengkap</span>
                    <span className="font-semibold text-emerald-600">
                      Margin: {tmpl.data.financialOverview?.estimatedGrossMargin || '~70%'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectTemplate(tmpl.data);
                    onClose();
                  }}
                  className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <span>Gunakan Template Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Tips: Anda bisa mengedit, menambah, atau meminta AI menyempurnakan poin kapan saja.</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 font-semibold text-slate-700 hover:text-slate-900"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
