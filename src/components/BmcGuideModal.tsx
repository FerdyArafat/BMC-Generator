import React, { useState } from 'react';
import {
  BookOpen,
  X,
  Search,
  CheckCircle2,
  Plus,
  HelpCircle,
  Lightbulb,
  Building,
  AlertTriangle,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { BMC_GUIDE_DATA, BmcBlockGuide } from '../data/bmcGuideData';
import { BmcItem } from '../types/bmc';

interface BmcGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBlockKey?: string;
  onInsertComponentToCanvas: (blockKey: string, item: BmcItem) => void;
}

export const BmcGuideModal: React.FC<BmcGuideModalProps> = ({
  isOpen,
  onClose,
  initialBlockKey,
  onInsertComponentToCanvas,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>(
    initialBlockKey || BMC_GUIDE_DATA[0].key
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [insertedTitle, setInsertedTitle] = useState<string | null>(null);

  // Sync if initialBlockKey changes when opening
  React.useEffect(() => {
    if (initialBlockKey) {
      setSelectedKey(initialBlockKey);
    }
  }, [initialBlockKey, isOpen]);

  if (!isOpen) return null;

  const currentGuide =
    BMC_GUIDE_DATA.find((g) => g.key === selectedKey) || BMC_GUIDE_DATA[0];

  const handleInsert = (comp: { title: string; description: string; tag: string }) => {
    const newItem: BmcItem = {
      id: `guide-insert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: comp.title,
      description: comp.description,
      tag: comp.tag,
      color: 'blue',
    };
    onInsertComponentToCanvas(currentGuide.key, newItem);
    setInsertedTitle(comp.title);
    setTimeout(() => setInsertedTitle(null), 2500);
  };

  const filteredGuides = BMC_GUIDE_DATA.filter((g) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      g.titleId.toLowerCase().includes(q) ||
      g.titleEn.toLowerCase().includes(q) ||
      g.definition.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold">
                  Panduan Lengkap 9 Blok Business Model Canvas
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Osterwalder Framework
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Penjelasan komprehensif, pertanyaan pemantik, contoh nyata, & komponen siap pakai
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Navigation Bar */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: 9 Blocks Navigation */}
          <div className="w-full md:w-72 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-200">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari blok panduan..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredGuides.map((guide) => {
                const isSelected = guide.key === selectedKey;
                return (
                  <button
                    key={guide.key}
                    onClick={() => setSelectedKey(guide.key)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {guide.number}
                      </span>
                      <div className="truncate">
                        <div className="truncate">{guide.titleId}</div>
                        <div
                          className={`text-[10px] truncate ${
                            isSelected ? 'text-indigo-100' : 'text-slate-400'
                          }`}
                        >
                          {guide.titleEn}
                        </div>
                      </div>
                    </div>
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-indigo-200 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Guide Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {insertedTitle && (
              <div className="sticky top-0 z-20 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Berhasil menambahkan "<strong>{insertedTitle}</strong>" ke kanvas Anda!
                </span>
              </div>
            )}

            {/* Block Header Title */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center">
                  #{currentGuide.number}
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {currentGuide.titleId} ({currentGuide.titleEn})
                </h3>
              </div>
              <p className="text-xs text-indigo-700 font-semibold mt-1">
                {currentGuide.shortDesc}
              </p>
            </div>

            {/* Definition Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-normal">
              <span className="font-bold text-slate-900 block mb-1">
                Definisi & Esensi Strategis:
              </span>
              {currentGuide.definition}
            </div>

            {/* Guiding Questions (Pertanyaan Pemantik) */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2.5 flex items-center space-x-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>Pertanyaan Panduan untuk Merumuskan Blok Ini:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentGuide.guidingQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 flex items-start space-x-2"
                  >
                    <span className="font-bold text-indigo-600 shrink-0">•</span>
                    <span className="leading-relaxed">{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ready-to-Use Component Library with 1-Click Insert */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Komponen Umum Siap Masuk ke Kanvas Anda:</span>
                </h4>
                <span className="text-[11px] text-slate-500">Klik "+ Gunakan" untuk menambah</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentGuide.quickInsertComponents.map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-indigo-50/20 transition-all flex flex-col justify-between group text-xs shadow-2xs"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {comp.title}
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0 ml-1">
                          {comp.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        {comp.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleInsert(comp)}
                      className="mt-3 w-full py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 text-[11px] font-bold transition-colors flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambahkan ke Kanvas</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Types & Categories */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2.5 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-slate-600" />
                <span>Kategori & Pola Standar:</span>
              </h4>
              <div className="space-y-2">
                {currentGuide.typesAndCategories.map((type, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white text-xs">
                    <span className="font-bold text-slate-900">{type.title}: </span>
                    <span className="text-slate-600">{type.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Real World Examples */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2.5 flex items-center space-x-1.5">
                <Building className="w-4 h-4 text-emerald-600" />
                <span>Contoh Penerapan di Perusahaan Dunia Nyata:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentGuide.realWorldExamples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-emerald-950">{ex.company}</span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                        {ex.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {ex.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 text-xs">
              <h4 className="font-bold text-rose-900 mb-2 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Kesalahan Umum yang Sering Dilakukan (Pitfalls):</span>
              </h4>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                {currentGuide.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-rose-600 font-bold shrink-0">✕</span>
                    <span className="leading-relaxed">{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>
            Gunakan tombol <strong>"+ Tambahkan ke Kanvas"</strong> untuk langsung mengadopsi poin panduan.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
