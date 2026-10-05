import React, { useState } from 'react';
import { Sparkles, X, Check, Plus, Loader2, ArrowRight, Lightbulb } from 'lucide-react';
import { BmcItem } from '../types/bmc';

interface AiEnhanceBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockKey: string;
  blockTitle: string;
  currentItems: BmcItem[];
  businessContext: string;
  onAddEnhancedItems: (items: BmcItem[]) => void;
}

export const AiEnhanceBlockModal: React.FC<AiEnhanceBlockModalProps> = ({
  isOpen,
  onClose,
  blockKey,
  blockTitle,
  currentItems,
  businessContext,
  onAddEnhancedItems,
}) => {
  const [instruction, setInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<BmcItem[]>([]);
  const [advice, setAdvice] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/bmc/enhance-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockKey,
          blockName: blockTitle,
          currentItems,
          businessContext,
          instruction: instruction.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal mendapatkan rekomendasi AI.');
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
      setAdvice(data.advice || null);
      // Select all by default
      const allNewIds = new Set<string>((data.recommendations || []).map((r: BmcItem) => r.id));
      setSelectedIds(allNewIds);
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleApply = () => {
    const chosen = recommendations.filter((r) => selectedIds.has(r.id));
    if (chosen.length > 0) {
      onAddEnhancedItems(chosen);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 bg-gradient-to-r from-amber-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="text-sm font-bold">AI Rekomendasi Poin: {blockTitle}</h3>
              <p className="text-[11px] text-amber-100">
                Tingkatkan dan perkaya blok ini dengan ide strategis baru
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Instruksi Khusus untuk AI (Opsional):
            </label>
            <input
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Contoh: Fokus pada strategi digital biaya rendah, cari saluran B2B..."
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {recommendations.length === 0 && !isLoading && (
            <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-4">
              <Lightbulb className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-medium">
                AI akan membaca poin saat ini di blok "{blockTitle}" dan memberikan 3-4 ide segar yang belum terpikirkan.
              </p>
              <button
                type="button"
                onClick={handleGenerate}
                className="mt-3 inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Mulai Analisis AI Sekarang</span>
              </button>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-10 space-y-2">
              <Loader2 className="w-7 h-7 text-indigo-600 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-700">
                Merumuskan rekomendasi poin untuk "{blockTitle}"...
              </p>
            </div>
          )}

          {recommendations.length > 0 && !isLoading && (
            <div className="space-y-3">
              {advice && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                  <span className="font-bold">Saran AI: </span>
                  {advice}
                </div>
              )}

              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Pilih Poin untuk Ditambahkan ke Kanvas:</span>
                <span className="text-[11px] text-indigo-600 font-medium">
                  {selectedIds.size} terpilih
                </span>
              </div>

              <div className="space-y-2">
                {recommendations.map((rec) => {
                  const isChecked = selectedIds.has(rec.id);
                  return (
                    <div
                      key={rec.id}
                      onClick={() => toggleSelect(rec.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start space-x-2.5 ${
                        isChecked
                          ? 'border-indigo-500 bg-indigo-50/50 shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center ${
                          isChecked
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-slate-900">{rec.title}</div>
                        <div className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          {rec.description}
                        </div>
                        {rec.tag && (
                          <span className="inline-block mt-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-800">
                            {rec.tag}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Batal
          </button>

          {recommendations.length > 0 && !isLoading && (
            <button
              type="button"
              onClick={handleApply}
              disabled={selectedIds.size === 0}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambahkan {selectedIds.size} Poin Terpilih</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
