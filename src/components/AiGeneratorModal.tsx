import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Lightbulb,
  Building2,
  Users,
  BadgeDollarSign,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { BmcData } from '../types/bmc';
import { apiGenerateBmc } from '../services/aiBmcService';

interface AiGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (data: BmcData) => void;
  onOpenApiKey?: () => void;
}

const QUICK_INSPIRATIONS = [
  {
    title: 'Katering Sehat Langganan Kantor',
    desc: 'Layanan katering makan siang sehat kalori terukur dengan kemasan ramah lingkungan dan jadwal antar fleksibel via aplikasi.',
    industry: 'Makanan & Minuman (F&B)',
    revenueModel: 'Langganan Mingguan / Bulanan',
  },
  {
    title: 'Aplikasi Laundry Kiloan Antar-Jemput',
    desc: 'Platform on-demand penjemputan dan pencucian pakaian bergaransi 24 jam dengan tracking real-time dan detergen hypoallergenic.',
    industry: 'Jasa & Marketplace On-Demand',
    revenueModel: 'Bayar per Transaksi & Langganan',
  },
  {
    title: 'SaaS Inventaris & Kasir Warung Pintar',
    desc: 'Aplikasi POS mobile ringan khusus warung kelontong & toko retail UMKM dengan fitur pencatatan utang otomatis dan peringatan stok habis.',
    industry: 'Teknologi & Software B2B',
    revenueModel: 'Freemium & Biaya Tambahan Fitur',
  },
  {
    title: 'Marketplace Sewa Alat Fotografi & Kreatif',
    desc: 'Platform persewaan kamera, lensa, dan drone terverifikasi antar kreator konten dengan asuransi kerusakan otomatis dan deposit aman.',
    industry: 'Marketplace & Sharing Economy',
    revenueModel: 'Komisi Transaksi 12-15%',
  },
];

const INDUSTRIES = [
  'Teknologi & Software B2B',
  'Makanan & Minuman (F&B)',
  'Ritel & E-Commerce D2C',
  'Jasa Profesional & Kreatif',
  'Kesehatan & Wellness',
  'Pendidikan & EduTech',
  'Marketplace & Sharing Economy',
  'Pertanian & Agroteknologi',
  'Pariwisata & Hospitaliti',
  'Fintech & Keuangan',
  'Lainnya',
];

export const AiGeneratorModal: React.FC<AiGeneratorModalProps> = ({
  isOpen,
  onClose,
  onGenerated,
  onOpenApiKey,
}) => {
  const [businessName, setBusinessName] = useState('');
  const [businessIdea, setBusinessIdea] = useState('');
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [targetAudience, setTargetAudience] = useState('');
  const [revenueModel, setRevenueModel] = useState('');
  const [uniqueAdvantage, setUniqueAdvantage] = useState('');
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleApplyInspiration = (item: (typeof QUICK_INSPIRATIONS)[0]) => {
    setBusinessName(item.title);
    setBusinessIdea(item.desc);
    setIndustry(item.industry);
    setRevenueModel(item.revenueModel);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessIdea.trim()) {
      setErrorMessage('Harap jelaskan ide bisnis Anda.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setLoadingStep(1);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1800);

    try {
      const result = await apiGenerateBmc({
        businessName: businessName.trim(),
        businessIdea: businessIdea.trim(),
        industry,
        targetAudience: targetAudience.trim(),
        revenueModel: revenueModel.trim(),
        uniqueAdvantage: uniqueAdvantage.trim(),
        language,
      });

      clearInterval(stepInterval);
      setLoadingStep(5);
      setTimeout(() => {
        onGenerated(result);
        onClose();
        setIsLoading(false);
      }, 500);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsLoading(false);
      setErrorMessage(err.message || 'Gagal menghasilkan Business Model Canvas.');
    }
  };

  const stepsText = [
    'Menganalisis ide bisnis & konteks pasar...',
    'Merumuskan 9 blok inti Business Model Canvas...',
    'Menghubungkan proposisi nilai dengan segmen pelanggan...',
    'Memetakan unit economics & arsitektur finansial...',
    'Selesai! Mengisi kanvas secara otomatis...',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Business Model Canvas Generator</h2>
              <p className="text-xs text-indigo-200">
                Cukup ketikkan ide Anda, AI akan merumuskan 9 blok kanvas secara komprehensif
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="p-8 text-center py-16 space-y-6">
            <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
              <Sparkles className="w-7 h-7 text-indigo-600 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">
                Meracik Business Model Canvas Anda...
              </h3>
              <p className="text-xs font-medium text-indigo-600 animate-pulse">
                {stepsText[loadingStep - 1] || stepsText[0]}
              </p>
            </div>

            {/* Progress indicators */}
            <div className="max-w-md mx-auto grid grid-cols-4 gap-2 pt-4">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    loadingStep >= step ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errorMessage && (
              <div className="p-3 text-xs rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                <span className="leading-relaxed">{errorMessage}</span>
                {onOpenApiKey && errorMessage.includes('API') && (
                  <button
                    type="button"
                    onClick={onOpenApiKey}
                    className="shrink-0 px-3 py-1.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors text-[11px]"
                  >
                    🔑 Masukkan API Key
                  </button>
                )}
              </div>
            )}

            {/* Quick Inspiration Pills */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Pilih Contoh Ide Bisnis Cepat (Inspirasi)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_INSPIRATIONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyInspiration(item)}
                    className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-xs group"
                  >
                    <div className="font-bold text-slate-800 group-hover:text-indigo-600 line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Business Name & Industry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Bisnis / Brand (Opsional)
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Contoh: FreshLocker, Karsa Kopi..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sektor / Industri
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Core Business Idea Description */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Deskripsi Ide Bisnis <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={businessIdea}
                onChange={(e) => setBusinessIdea(e.target.value)}
                rows={3}
                required
                placeholder="Jelaskan produk/jasa yang ingin Anda bangun, masalah apa yang diselesaikan, dan bagaimana cara kerjanya..."
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Target Audience & Revenue Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Pasar / Audiens (Opsional)
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Contoh: Pemilik UMKM retail, mahasiswa usia 18-24..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {['UMKM & Toko Lokal', 'Profesional Muda / Urban', 'B2B Korporat Enterprise', 'Kreator Konten'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setTargetAudience(tag)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Model Monetisasi / Pendapatan (Opsional)
                </label>
                <input
                  type="text"
                  value={revenueModel}
                  onChange={(e) => setRevenueModel(e.target.value)}
                  placeholder="Contoh: Langganan bulanan, komisi per transaksi..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {['Langganan Bulanan (SaaS)', 'Komisi Transaksi 10-15%', 'Penjualan Aset Ritel', 'Freemium Upgrade'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setRevenueModel(tag)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Unique Advantage / Moat & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keunggulan Unik / Diferensiasi (Opsional)
                </label>
                <input
                  type="text"
                  value={uniqueAdvantage}
                  onChange={(e) => setUniqueAdvantage(e.target.value)}
                  placeholder="Contoh: Teknologi AI eksklusif, direct trade petani..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bahasa Hasil Kanvas
                </label>
                <div className="flex items-center space-x-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setLanguage('id')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      language === 'id'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🇮🇩 Bahasa Indonesia
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      language === 'en'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🇺🇸 English
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl shadow-md shadow-indigo-200 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Hasilkan Business Model Canvas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
