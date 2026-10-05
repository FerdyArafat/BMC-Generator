import React, { useState } from 'react';
import {
  Presentation,
  X,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { BmcData } from '../types/bmc';
import { exportToGoogleSlides } from '../services/slidesExport';
import { requestSlidesAccess } from '../services/firebaseAuth';

interface SlidesExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bmc: BmcData;
  user: User | null;
  accessToken: string | null;
  onSignIn: () => Promise<void>;
  isAuthenticating: boolean;
}

export const SlidesExportModal: React.FC<SlidesExportModalProps> = ({
  isOpen,
  onClose,
  bmc,
  user,
  accessToken,
  onSignIn,
  isAuthenticating,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState('');
  const [createdDeckUrl, setCreatedDeckUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleStartExport = async () => {
    setIsExporting(true);
    setErrorMessage(null);
    setCreatedDeckUrl(null);

    let token = accessToken;
    if (!token) {
      try {
        setExportStatusText('Meminta izin akses Google Slides...');
        token = await requestSlidesAccess();
      } catch (err: any) {
        setIsExporting(false);
        setErrorMessage(
          err.message ||
            'Izin akses Google Slides diperlukan. Jika akun Anda diblokir karena belum diverifikasi, Anda dapat menambahkan email Anda ke Test Users di Google Cloud Console atau gunakan Ekspor PDF.'
        );
        return;
      }
    }

    setExportProgress(10);
    setExportStatusText('Menyiapkan presentasi baru di Google Slides...');

    try {
      const result = await exportToGoogleSlides(bmc, token, (status, progress) => {
        setExportStatusText(status);
        setExportProgress(progress);
      });

      setCreatedDeckUrl(result.url);
      setExportProgress(100);
      setExportStatusText('Presentasi berhasil dibuat di Google Slides!');
    } catch (err: any) {
      console.error('Slides export failed:', err);
      setErrorMessage(
        err.message ||
          'Gagal mengekspor ke Google Slides. Pastikan Anda telah memberikan izin Google Slides.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = () => {
    if (!createdDeckUrl) return;
    navigator.clipboard.writeText(createdDeckUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const slideDeckHighlights = [
    { title: 'Slide 1: Cover Eksekutif', desc: 'Judul bisnis, tagline, sektor industri, dan metadata tanggal' },
    { title: 'Slide 2: Ringkasan & Pitch', desc: 'Ringkasan eksekutif, elevator pitch 30 detik, & indikator finansial' },
    { title: 'Slide 3: Peta 9 Blok Osterwalder', desc: 'Tata letak kanvas visual Osterwalder lengkap dengan kode warna' },
    { title: 'Slide 4: Value Prop vs Segmen', desc: 'Analisis mendalam problem-solution fit & profil target pelanggan' },
    { title: 'Slide 5: Channels & Hubungan', desc: 'Strategi go-to-market, saluran distribusi, dan retensi loyalitas' },
    { title: 'Slide 6: Mesin Operasional', desc: 'Kemitraan strategis, aktivitas kunci, & aset sumber daya' },
    { title: 'Slide 7: Arsitektur Finansial', desc: 'Rincian struktur biaya operasional vs arus sumber pendapatan' },
    { title: 'Slide 8: Roadmap & SWOT', desc: 'Rencana aksi validasi peluncuran dan sorotan kekuatan strategis' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Ekspor ke Google Slides Instan</h2>
              <p className="text-xs text-amber-100">
                Buat deck presentasi profesional 8-slide langsung di Google Drive Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success State */}
          {createdDeckUrl ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Presentasi Berhasil Dibuat!
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Slide Business Model Canvas Anda telah siap dalam format Google Slides dan tersimpan di akun Google Drive Anda.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={createdDeckUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-200 transition-all"
                >
                  <Presentation className="w-4 h-4" />
                  <span>Buka di Google Slides</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Tautan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : isExporting ? (
            /* Loading / Export Progress State */
            <div className="text-center py-10 space-y-5">
              <div className="relative mx-auto w-14 h-14 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin" />
                <Presentation className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900">
                  {exportStatusText || 'Sedang memproses deck Google Slides...'}
                </h3>
                <p className="text-xs text-slate-400">
                  Menyusun slide, memformat tata letak warna, dan memasukkan poin-poin kanvas...
                </p>
              </div>

              {/* Progress bar */}
              <div className="max-w-xs mx-auto">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div
                    className="bg-amber-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
                  {exportProgress}%
                </span>
              </div>
            </div>
          ) : (
            /* Ready to Export / Auth Check State */
            <div className="space-y-4">
              {/* Account Status */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                {user ? (
                  <div className="flex items-center space-x-3">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'Google'}
                        className="w-10 h-10 rounded-full border border-indigo-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">
                        {user.email?.[0]?.toUpperCase() || 'G'}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-slate-900">
                          {user.displayName || user.email}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <p className="text-[11px] text-slate-500">{user.email}</p>
                      <span className="text-[10px] text-emerald-600 font-medium">
                        Akun Google Terhubung & Siap Ekspor
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Hubungkan Akun Google Anda
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Masuk untuk mengizinkan pembuatan presentasi di Google Slides Anda
                      </p>
                    </div>

                    {/* Official Sign in with Google Button */}
                    <button
                      onClick={onSignIn}
                      disabled={isAuthenticating}
                      className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors"
                    >
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        className="w-4 h-4"
                      >
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        />
                        <path
                          fill="#34A853"
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        />
                      </svg>
                      <span>Masuk dengan Google</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Slide Deck Outline Preview */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  <span>Susunan Slide yang Akan Dibuat (8 Slide Lengkap):</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {slideDeckHighlights.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white text-xs"
                    >
                      <div className="font-bold text-slate-800">{s.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Tutup
                </button>

                {user ? (
                  <button
                    onClick={handleStartExport}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 rounded-xl shadow-md shadow-amber-200 transition-all"
                  >
                    <Presentation className="w-4 h-4" />
                    <span>Buat Presentasi Google Slides Sekarang</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={onSignIn}
                    disabled={isAuthenticating}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all"
                  >
                    <span>Masuk Google untuk Melanjutkan</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
