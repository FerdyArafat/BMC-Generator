import React, { useState } from 'react';
import {
  FileText,
  Presentation,
  FileDown,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Handshake,
  Zap,
  Boxes,
  Flame,
  HeartHandshake,
  Radio,
  Users,
  CreditCard,
  Target,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { BmcData, BmcItem } from '../types/bmc';
import { apiGenerateSwot } from '../services/aiBmcService';

interface ExecutiveReportViewProps {
  bmc: BmcData;
  onUpdateBmc: (updated: BmcData) => void;
  onOpenPdfExport: () => void;
  onOpenSlidesExport: () => void;
  onOpenGenerator: () => void;
}

export const ExecutiveReportView: React.FC<ExecutiveReportViewProps> = ({
  bmc,
  onUpdateBmc,
  onOpenPdfExport,
  onOpenSlidesExport,
  onOpenGenerator,
}) => {
  const [isGeneratingSwot, setIsGeneratingSwot] = useState(false);
  const [swotError, setSwotError] = useState<string | null>(null);

  const sections = [
    { title: '1. Proposisi Nilai (Value Propositions)', items: bmc.valuePropositions || [], icon: Flame, color: 'text-amber-600 bg-amber-50' },
    { title: '2. Segmen Pelanggan (Customer Segments)', items: bmc.customerSegments || [], icon: Users, color: 'text-emerald-600 bg-emerald-50' },
    { title: '3. Saluran Distribusi (Channels)', items: bmc.channels || [], icon: Radio, color: 'text-violet-600 bg-violet-50' },
    { title: '4. Hubungan Pelanggan (Customer Relationships)', items: bmc.customerRelationships || [], icon: HeartHandshake, color: 'text-purple-600 bg-purple-50' },
    { title: '5. Sumber Pendapatan (Revenue Streams)', items: bmc.revenueStreams || [], icon: TrendingUp, color: 'text-green-600 bg-green-50' },
    { title: '6. Struktur Biaya (Cost Structure)', items: bmc.costStructure || [], icon: CreditCard, color: 'text-rose-600 bg-rose-50' },
    { title: '7. Aktivitas Utama (Key Activities)', items: bmc.keyActivities || [], icon: Zap, color: 'text-teal-600 bg-teal-50' },
    { title: '8. Sumber Daya Utama (Key Resources)', items: bmc.keyResources || [], icon: Boxes, color: 'text-blue-600 bg-blue-50' },
    { title: '9. Kemitraan Utama (Key Partners)', items: bmc.keyPartners || [], icon: Handshake, color: 'text-slate-600 bg-slate-50' },
  ];

  const handleGenerateSwot = async () => {
    setIsGeneratingSwot(true);
    setSwotError(null);
    try {
      const swotData = await apiGenerateSwot({
        canvasData: bmc,
        language: 'id',
      });

      onUpdateBmc({
        ...bmc,
        swotSummary: {
          strengths: swotData.strengths || [],
          weaknesses: swotData.weaknesses || [],
          opportunities: swotData.opportunities || [],
          threats: swotData.threats || [],
          strategicRecommendations: swotData.strategicRecommendations || [],
        },
      });
    } catch (err: any) {
      console.error('Error generating SWOT:', err);
      setSwotError(err.message || 'Gagal memproses analisis SWOT.');
    } finally {
      setIsGeneratingSwot(false);
    }
  };

  const totalPoints = sections.reduce((acc, s) => acc + s.items.length, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Executive Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              Dokumen Strategi Bisnis
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
              {bmc.businessName || 'Business Model Canvas'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-2xl leading-relaxed">
              {bmc.tagline || bmc.executiveSummary}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onOpenPdfExport}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-xs"
            >
              <FileDown className="w-3.5 h-3.5 text-rose-600" />
              <span>Unduh PDF</span>
            </button>
            <button
              onClick={onOpenSlidesExport}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-xs"
            >
              <Presentation className="w-3.5 h-3.5 text-amber-900" />
              <span>Ekspor Slides</span>
            </button>
          </div>
        </div>

        {/* Executive Summary & Elevator Pitch Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              Ringkasan Eksekutif
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              {bmc.executiveSummary || 'Tambahkan poin-poin kanvas Anda untuk melihat ringkasan eksekutif.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
              Elevator Pitch (30 Detik)
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed italic font-normal">
              "{bmc.elevatorPitch || 'Belum ada elevator pitch.'}"
            </p>
          </div>
        </div>
      </div>

      {/* SWOT Analysis Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <span>Analisis SWOT Berbasis Data Kanvas BMC</span>
            </h2>
            <p className="text-xs text-slate-500">
              Evaluasi kekuatan, kelemahan, peluang, dan ancaman berdasarkan {totalPoints} poin di 9 blok kanvas Anda
            </p>
          </div>

          <button
            onClick={handleGenerateSwot}
            disabled={isGeneratingSwot}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-100 transition-all shrink-0 disabled:opacity-50"
          >
            {isGeneratingSwot ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menganalisis SWOT...</span>
              </>
            ) : bmc.swotSummary ? (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Analisis Ulang SWOT AI</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Hasilkan Analisis SWOT AI</span>
              </>
            )}
          </button>
        </div>

        {swotError && (
          <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
            {swotError}
          </div>
        )}

        {isGeneratingSwot && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900">
                AI Sedang Membaca & Menganalisis 9 Blok Kanvas Anda...
              </h4>
              <p className="text-[11px] text-slate-500">
                Memetakan keunggulan kompetitif internal vs dinamika peluang dan risiko pasar eksternal
              </p>
            </div>
          </div>
        )}

        {!isGeneratingSwot && !bmc.swotSummary && (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">
                Belum Ada Analisis SWOT untuk Kanvas Ini
              </h3>
              <p className="text-[11px] text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                Klik tombol <strong>"Hasilkan Analisis SWOT AI"</strong> di atas untuk memetakan kekuatan internal, titik lemah, peluang ekspansi, dan ancaman kompetitor secara otomatis.
              </p>
            </div>
          </div>
        )}

        {!isGeneratingSwot && bmc.swotSummary && (
          <div className="space-y-4">
            {/* 4 Quadrants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Strengths */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="flex items-center space-x-2 mb-2 pb-1.5 border-b border-emerald-200">
                  <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                    S
                  </span>
                  <span className="font-bold text-emerald-900 text-xs">
                    Kekuatan Internal (Strengths)
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-emerald-950">
                  {bmc.swotSummary.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5 leading-relaxed">
                      <span className="text-emerald-600 font-bold shrink-0">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <div className="flex items-center space-x-2 mb-2 pb-1.5 border-b border-amber-200">
                  <span className="w-5 h-5 rounded-md bg-amber-600 text-white font-black text-xs flex items-center justify-center">
                    W
                  </span>
                  <span className="font-bold text-amber-900 text-xs">
                    Kelemahan Internal (Weaknesses)
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-amber-950">
                  {bmc.swotSummary.weaknesses.map((w, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5 leading-relaxed">
                      <span className="text-amber-600 font-bold shrink-0">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80">
                <div className="flex items-center space-x-2 mb-2 pb-1.5 border-b border-blue-200">
                  <span className="w-5 h-5 rounded-md bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                    O
                  </span>
                  <span className="font-bold text-blue-900 text-xs">
                    Peluang Eksternal (Opportunities)
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-blue-950">
                  {bmc.swotSummary.opportunities.map((o, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5 leading-relaxed">
                      <span className="text-blue-600 font-bold shrink-0">•</span>
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Threats */}
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80">
                <div className="flex items-center space-x-2 mb-2 pb-1.5 border-b border-rose-200">
                  <span className="w-5 h-5 rounded-md bg-rose-600 text-white font-black text-xs flex items-center justify-center">
                    T
                  </span>
                  <span className="font-bold text-rose-900 text-xs">
                    Ancaman Eksternal (Threats)
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-rose-950">
                  {bmc.swotSummary.threats.map((t, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5 leading-relaxed">
                      <span className="text-rose-600 font-bold shrink-0">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Strategic Implications / SWOT Recommendations */}
            {bmc.swotSummary.strategicRecommendations &&
              bmc.swotSummary.strategicRecommendations.length > 0 && (
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                  <h4 className="text-xs font-bold text-indigo-900 mb-2 flex items-center space-x-1.5">
                    <Lightbulb className="w-4 h-4 text-indigo-600" />
                    <span>Rekomendasi Taktis Berdasarkan Matriks SWOT:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {bmc.swotSummary.strategicRecommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white border border-indigo-100/80 text-indigo-950 flex items-start space-x-2 shadow-2xs"
                      >
                        <span className="font-bold text-indigo-600 shrink-0">{idx + 1}.</span>
                        <span className="leading-relaxed font-normal">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Financial Unit Economics & Key Metrics Card */}
      {bmc.financialOverview && bmc.financialOverview.estimatedGrossMargin !== '-' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Arsitektur Finansial & Unit Economics
              </h2>
              <p className="text-xs text-slate-500">
                Estimasi margin, faktor pendorong biaya, dan metrik kinerja utama
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Estimasi Margin Kotor
              </span>
              <div className="text-xl font-black text-emerald-600 mt-1">
                {bmc.financialOverview.estimatedGrossMargin}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Penggerak Biaya Utama
              </span>
              <ul className="text-xs text-slate-700 mt-1 space-y-1">
                {bmc.financialOverview.primaryCostDrivers.map((driver, idx) => (
                  <li key={idx} className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span className="truncate">{driver}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Metrik Kunci (KPI)
              </span>
              <ul className="text-xs text-slate-700 mt-1 space-y-1">
                {bmc.financialOverview.keyMetrics.map((metric, idx) => (
                  <li key={idx} className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span className="truncate">{metric}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* In-depth 9 Blocks Accordion / Card Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Rincian Mendalam 9 Elemen Business Model Canvas
          </h2>
          <p className="text-xs text-slate-500">
            Penjelasan strategis lengkap untuk setiap poin dalam model bisnis Anda ({totalPoints} poin)
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-lg ${sec.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">{sec.title}</h3>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                    {sec.items.length} Poin
                  </span>
                </div>

                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white">
                  {sec.items.length === 0 ? (
                    <div className="col-span-2 text-center py-4 text-xs text-slate-400">
                      Belum ada poin pada blok ini. Kembali ke Kanvas untuk menambahkan poin.
                    </div>
                  ) : (
                    sec.items.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                        <div className="flex items-start justify-between">
                          <div className="text-xs font-bold text-slate-900">{item.title}</div>
                          {item.tag && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0 ml-1">
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Roadmap */}
      {bmc.nextActionItems && bmc.nextActionItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Rencana Aksi & Validasi (Next Milestones)</span>
          </h3>
          <div className="space-y-2.5">
            {bmc.nextActionItems.map((act, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3 text-xs"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span className="text-slate-800 leading-relaxed font-medium">{act}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
