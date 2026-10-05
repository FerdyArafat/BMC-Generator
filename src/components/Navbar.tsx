import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  LayoutGrid,
  FileDown,
  Presentation,
  ShieldCheck,
  RotateCcw,
  LogIn,
  LogOut,
  Building2,
  BookOpen,
  ChevronDown,
  Download,
  SlidersHorizontal,
  MoreVertical,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  businessName: string;
  onOpenGenerator: () => void;
  onOpenTemplates: () => void;
  onOpenPdfExport: () => void;
  onOpenSlidesExport: () => void;
  onOpenCritique: () => void;
  onOpenGuide: () => void;
  onReset: () => void;
  onClearCanvas: () => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isAuthenticating: boolean;
  activeView: 'canvas' | 'report';
  setActiveView: (view: 'canvas' | 'report') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  businessName,
  onOpenGenerator,
  onOpenTemplates,
  onOpenPdfExport,
  onOpenSlidesExport,
  onOpenCritique,
  onOpenGuide,
  onReset,
  onClearCanvas,
  user,
  onSignIn,
  onSignOut,
  isAuthenticating,
  activeView,
  setActiveView,
}) => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toolsRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setIsToolsOpen(false);
      }
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setIsExportOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base">
                  BMC Studio
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Canvas
                </span>
              </div>
            </div>
          </div>

          {/* Center Tabs: Minimalist View Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveView('canvas')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'canvas'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Kanvas
            </button>
            <button
              onClick={() => setActiveView('report')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'report'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Dokumen Strategi
            </button>
          </div>

          {/* Grouped Actions & Menus */}
          <div className="flex items-center space-x-2">
            {/* Group 1: Tools Menu Dropdown (Template, Panduan, Audit, Kosongkan) */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => {
                  setIsToolsOpen(!isToolsOpen);
                  setIsExportOpen(false);
                }}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isToolsOpen
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Alat & Template</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isToolsOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      onOpenTemplates();
                      setIsToolsOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center space-x-2.5 text-slate-700 font-medium"
                  >
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="font-semibold text-slate-900">Pilih Template</div>
                      <div className="text-[10px] text-slate-400">Gunakan model bisnis siap pakai</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onOpenGuide();
                      setIsToolsOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center space-x-2.5 text-slate-700 font-medium"
                  >
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="font-semibold text-slate-900">Panduan 9 Blok</div>
                      <div className="text-[10px] text-slate-400">Penjelasan & pertanyaan pemantik</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onOpenCritique();
                      setIsToolsOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center space-x-2.5 text-slate-700 font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-semibold text-slate-900">Audit Kelayakan AI</div>
                      <div className="text-[10px] text-slate-400">Evaluasi skor & analisis risiko</div>
                    </div>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => {
                      onClearCanvas();
                      setIsToolsOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-rose-50 flex items-center space-x-2.5 text-rose-700 font-medium"
                  >
                    <RotateCcw className="w-4 h-4 text-rose-500" />
                    <div>
                      <div className="font-semibold">Kosongkan Kanvas</div>
                      <div className="text-[10px] text-rose-400">Mulai rancang dari nol</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Group 2: Export Menu Dropdown (Google Slides & PDF) */}
            <div className="relative" ref={exportRef}>
              <button
                onClick={() => {
                  setIsExportOpen(!isExportOpen);
                  setIsToolsOpen(false);
                }}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isExportOpen
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Ekspor</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isExportOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      onOpenSlidesExport();
                      setIsExportOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-amber-50/50 flex items-center space-x-2.5 text-slate-700"
                  >
                    <Presentation className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Google Slides</div>
                      <div className="text-[10px] text-slate-400">Buat 8-slide presentasi instan</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onOpenPdfExport();
                      setIsExportOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-rose-50/50 flex items-center space-x-2.5 text-slate-700"
                  >
                    <FileDown className="w-4 h-4 text-rose-500 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Dokumen PDF</div>
                      <div className="text-[10px] text-slate-400">Poster A4 atau Laporan Lengkap</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Primary CTA: AI Buat BMC */}
            <button
              onClick={onOpenGenerator}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Buat</span>
            </button>

            {/* User Account / Profile Icon */}
            <div className="relative pl-1" ref={profileRef}>
              {user ? (
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden focus:outline-hidden focus:ring-2 focus:ring-slate-400"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                      {user.email?.[0]?.toUpperCase()}
                    </div>
                  )}
                </button>
              ) : (
                <button
                  onClick={onSignIn}
                  disabled={isAuthenticating}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Masuk akun Google"
                >
                  <LogIn className="w-4 h-4" />
                </button>
              )}

              {user && isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
                  <div className="px-2 py-1.5 border-b border-slate-100">
                    <div className="font-bold text-slate-900 truncate">
                      {user.displayName || 'Pengguna'}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      onSignOut();
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 mt-1 text-rose-600 hover:bg-rose-50 rounded-lg flex items-center space-x-1.5 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
