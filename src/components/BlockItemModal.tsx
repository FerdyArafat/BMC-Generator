import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, Loader2, BookOpen, Layers } from 'lucide-react';
import { BmcItem } from '../types/bmc';
import { BMC_GUIDE_DATA } from '../data/bmcGuideData';

interface BlockItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockKey: string;
  blockTitle: string;
  item: BmcItem | null;
  businessContext: string;
  onSave: (itemData: Omit<BmcItem, 'id'>) => void;
}

const COLORS: Array<{ id: BmcItem['color']; label: string; bg: string }> = [
  { id: 'blue', label: 'Biru', bg: 'bg-blue-500' },
  { id: 'emerald', label: 'Hijau', bg: 'bg-emerald-500' },
  { id: 'amber', label: 'Kuning/Oranye', bg: 'bg-amber-500' },
  { id: 'purple', label: 'Ungu', bg: 'bg-purple-500' },
  { id: 'rose', label: 'Merah Muda', bg: 'bg-rose-500' },
  { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-500' },
  { id: 'slate', label: 'Abu Netral', bg: 'bg-slate-500' },
];

export const BlockItemModal: React.FC<BlockItemModalProps> = ({
  isOpen,
  onClose,
  blockKey,
  blockTitle,
  item,
  businessContext,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [color, setColor] = useState<BmcItem['color']>('blue');
  const [isElaborating, setIsElaborating] = useState(false);
  const [showComponentLibrary, setShowComponentLibrary] = useState(false);
  const [tacticSnippet, setTacticSnippet] = useState<string | null>(null);

  const guide = BMC_GUIDE_DATA.find((g) => g.key === blockKey);

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setDescription(item.description || '');
      setTag(item.tag || '');
      setColor(item.color || 'blue');
      setTacticSnippet(null);
    } else {
      setTitle('');
      setDescription('');
      setTag('');
      setColor('blue');
      setTacticSnippet(null);
    }
    setShowComponentLibrary(false);
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      tag: tag.trim() || undefined,
      color,
    });
    onClose();
  };

  const handleElaborateWithAi = async () => {
    if (!title.trim()) return;
    setIsElaborating(true);
    try {
      const res = await fetch('/api/bmc/elaborate-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockName: blockTitle,
          itemTitle: title,
          itemDesc: description,
          businessContext,
        }),
      });

      if (!res.ok) throw new Error('Gagal memperdalam dengan AI');

      const data = await res.json();
      if (data.enhancedTitle) setTitle(data.enhancedTitle);
      if (data.enhancedDescription) setDescription(data.enhancedDescription);
      if (data.recommendedTag && !tag) setTag(data.recommendedTag);
      if (data.strategicTactic) {
        setTacticSnippet(`Taktik: ${data.strategicTactic} (KPI: ${data.successMetric})`);
      }
    } catch (e) {
      console.error('Elaboration failed:', e);
    } finally {
      setIsElaborating(false);
    }
  };

  const handleSelectPresetComponent = (comp: { title: string; description: string; tag: string }) => {
    setTitle(comp.title);
    setDescription(comp.description);
    setTag(comp.tag);
    setShowComponentLibrary(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold">
              {item ? 'Kustomisasi & Perluas Poin' : 'Tambah Poin Baru'}
            </h3>
            <p className="text-[11px] text-slate-400">Blok: {blockTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick Pre-fill / Library Pill */}
          {guide && guide.quickInsertComponents.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-slate-600">
                  Ingin pakai komponen umum teruji?
                </span>
                <button
                  type="button"
                  onClick={() => setShowComponentLibrary(!showComponentLibrary)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{showComponentLibrary ? 'Sembunyikan' : 'Pilih Komponen Standar'}</span>
                </button>
              </div>

              {showComponentLibrary && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 mb-3 max-h-48 overflow-y-auto">
                  {guide.quickInsertComponents.map((comp, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectPresetComponent(comp)}
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer transition-all text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{comp.title}</span>
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {comp.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {comp.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800">
                Judul Poin <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleElaborateWithAi}
                disabled={!title.trim() || isElaborating}
                className="text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md flex items-center space-x-1 disabled:opacity-50 transition-colors"
                title="AI akan memperdalam dan mempertajam poin ini"
              >
                {isElaborating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Memperdalam...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Perdalam dengan AI</span>
                  </>
                )}
              </button>
            </div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Langganan Berulang, Kemitraan Petani..."
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Penjelasan / Detail Strategis
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan peran, mekanisme operasional, atau dampaknya pada model bisnis..."
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Tactic snippet if elaborated */}
          {tacticSnippet && (
            <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-[11px] text-indigo-900 leading-relaxed font-medium">
              💡 {tacticSnippet}
            </div>
          )}

          {/* Tag / Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Label / Kategori (Tag)
            </label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Contoh: Utama, Digital, B2B, Retensi, Fisik..."
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Warna Catatan Sticky:
            </label>
            <div className="flex items-center space-x-2">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-6 h-6 rounded-full ${c.bg} transition-all flex items-center justify-center ${
                    color === c.id ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  title={c.label}
                >
                  {color === c.id && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              {item ? 'Simpan Perubahan' : 'Tambahkan ke Kanvas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
