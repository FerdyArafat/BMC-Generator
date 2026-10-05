import React, { useState } from 'react';
import { FileDown, X, CheckCircle2, Layout, FileText, Download } from 'lucide-react';
import { BmcData } from '../types/bmc';
import { exportBmcToPdf } from '../services/pdfExport';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bmc: BmcData;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({ isOpen, onClose, bmc }) => {
  const [selectedMode, setSelectedMode] = useState<'poster' | 'report'>('poster');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      exportBmcToPdf(bmc, { mode: selectedMode });
      setIsDownloading(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2500);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-rose-400">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Ekspor Format PDF</h2>
              <p className="text-xs text-slate-300">
                Unduh Business Model Canvas dalam format siap cetak & presentasi
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

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Pilih Format Tata Letak PDF:
            </label>

            {/* Option A: Poster Landscape */}
            <div
              onClick={() => setSelectedMode('poster')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start space-x-3.5 ${
                selectedMode === 'poster'
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div
                className={`p-2 rounded-xl mt-0.5 ${
                  selectedMode === 'poster' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Layout className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">
                    Poster Kanvas Landscape A4 (1 Halaman)
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                    Paling Populer
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Tata letak klasik Osterwalder 9 blok penuh dalam satu lembar landscape A4. Cocok untuk display dinding, workshop, atau lampiran investor deck.
                </p>
              </div>
            </div>

            {/* Option B: Full Multi-page Report */}
            <div
              onClick={() => setSelectedMode('report')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start space-x-3.5 ${
                selectedMode === 'report'
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div
                className={`p-2 rounded-xl mt-0.5 ${
                  selectedMode === 'report' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900">
                  Laporan Strategi Bisnis Lengkap (Multi-Halaman)
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Dokumen komprehensif mencakup cover eksekutif, analisis mendalam ke-9 blok, ikhtisar finansial, dan rencana aksi validasi.
                </p>
              </div>
            </div>
          </div>

          {/* Success notice */}
          {isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>PDF berhasil diunduh ke perangkat Anda!</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Menyusun PDF...' : 'Unduh PDF Sekarang'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
