import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  X,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Loader2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { BmcData, AiCritiqueResult } from '../types/bmc';
import { apiCritiqueBmc } from '../services/aiBmcService';

interface AiCritiqueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bmc: BmcData;
}

export const AiCritiqueDrawer: React.FC<AiCritiqueDrawerProps> = ({ isOpen, onClose, bmc }) => {
  const [critique, setCritique] = useState<AiCritiqueResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchCritique = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await apiCritiqueBmc({ canvasData: bmc, language: 'id' });
      setCritique(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memuat audit BMC.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !critique && !isLoading) {
      fetchCritique();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Audit Strategi & Kelayakan AI</h2>
              <p className="text-xs text-slate-300">
                Evaluasi model bisnis ala Venture Capital & Business Architect
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={fetchCritique}
              disabled={isLoading}
              title="Audit Ulang"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading && (
            <div className="text-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Menganalisis Kelayakan Model Bisnis...
                </h3>
                <p className="text-xs text-slate-500">
                  Mengaudit keselarasan proposisi nilai, unit economics, dan moat terhadap risiko pasar
                </p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {errorMessage}
            </div>
          )}

          {critique && !isLoading && (
            <div className="space-y-6">
              {/* Score Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Skor Kelayakan Model Bisnis
                  </span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-3xl font-black text-slate-900">
                      {critique.overallScore}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">/ 100</span>
                  </div>
                  <span
                    className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${getScoreColor(
                      critique.overallScore
                    )}`}
                  >
                    {critique.rating}
                  </span>
                </div>

                <div className="w-20 h-20 rounded-full border-4 border-indigo-600/20 border-t-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-indigo-600" />
                </div>
              </div>

              {/* Executive Audit Summary */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1.5">
                  Ringkasan Evaluasi Ahli
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {critique.executiveSummary}
                </p>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="text-xs font-bold text-emerald-800 mb-2 flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Kekuatan Utama Model (Pilar Keunggulan)</span>
                </h4>
                <div className="space-y-1.5">
                  {critique.strengths.map((str, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 flex items-start space-x-2"
                    >
                      <span className="font-bold text-emerald-600">•</span>
                      <span className="leading-relaxed">{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Risks */}
              <div>
                <h4 className="text-xs font-bold text-rose-800 mb-2 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Risiko Kritis & Titik Lemah (Blindspots)</span>
                </h4>
                <div className="space-y-1.5">
                  {critique.criticalRisks.map((risk, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-200 text-xs text-rose-950 flex items-start space-x-2"
                    >
                      <span className="font-bold text-rose-600">•</span>
                      <span className="leading-relaxed">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div>
                <h4 className="text-xs font-bold text-indigo-900 mb-2 flex items-center space-x-1.5">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  <span>Rekomendasi Tindakan Strategis</span>
                </h4>
                <div className="space-y-1.5">
                  {critique.actionableRecommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-950 flex items-start space-x-2"
                    >
                      <span className="font-bold text-indigo-600">{i + 1}.</span>
                      <span className="leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Questions to Answer */}
              <div>
                <h4 className="text-xs font-bold text-amber-900 mb-2 flex items-center space-x-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Pertanyaan Kunci Calon Investor / Tim Eksekusi</span>
                </h4>
                <div className="space-y-1.5">
                  {critique.keyQuestionsToAnswer.map((q, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 flex items-start space-x-2"
                    >
                      <span className="font-bold text-amber-600">Q{i + 1}:</span>
                      <span className="leading-relaxed italic">{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Dianalisis menggunakan Gemini 3.8 Flash
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Tutup Panel
          </button>
        </div>
      </div>
    </div>
  );
};
