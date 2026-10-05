import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  Sparkles,
  Building2,
  FileDown,
  Presentation,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { BmcCanvas } from './components/BmcCanvas';
import { ExecutiveReportView } from './components/ExecutiveReportView';
import { AiGeneratorModal } from './components/AiGeneratorModal';
import { TemplateSelectorModal } from './components/TemplateSelectorModal';
import { SlidesExportModal } from './components/SlidesExportModal';
import { PdfExportModal } from './components/PdfExportModal';
import { BlockItemModal } from './components/BlockItemModal';
import { AiEnhanceBlockModal } from './components/AiEnhanceBlockModal';
import { AiCritiqueDrawer } from './components/AiCritiqueDrawer';
import { BmcGuideModal } from './components/BmcGuideModal';
import { BMC_TEMPLATES } from './data/templates';
import { BmcData, BmcItem } from './types/bmc';
import { initAuth, googleSignIn, logout, getAccessToken } from './services/firebaseAuth';

const STORAGE_KEY = 'bmc_current_workspace_v2';

export const EMPTY_BMC: BmcData = {
  businessName: 'Kanvas Bisnis Baru',
  tagline: 'Rancang model bisnis Anda secara leluasa atau gunakan generator AI & template industri',
  executiveSummary: 'Belum ada ringkasan eksekutif. Tambahkan poin-poin utama Anda pada 9 blok kanvas di bawah atau gunakan tombol AI Isi Otomatis.',
  elevatorPitch: 'Jelaskan proposisi nilai unik dan solusi bisnis Anda di sini.',
  keyPartners: [],
  keyActivities: [],
  keyResources: [],
  valuePropositions: [],
  customerRelationships: [],
  channels: [],
  customerSegments: [],
  costStructure: [],
  revenueStreams: [],
  financialOverview: {
    estimatedGrossMargin: '-',
    primaryCostDrivers: [],
    keyMetrics: [],
  },
  swotSummary: undefined,
  nextActionItems: [],
  metadata: {
    generatedAt: new Date().toISOString(),
    industry: 'Umum',
    language: 'id',
  },
};

export default function App() {
  // 9 blocks are empty by default so users have full freedom to build from scratch
  const [bmc, setBmc] = useState<BmcData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved BMC:', e);
    }
    return EMPTY_BMC;
  });

  const [activeView, setActiveView] = useState<'canvas' | 'report'>('canvas');

  // Modals state
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isSlidesOpen, setIsSlidesOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isCritiqueOpen, setIsCritiqueOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideInitialBlock, setGuideInitialBlock] = useState<string | undefined>(undefined);

  // Item Add/Edit modal state
  const [itemModal, setItemModal] = useState<{
    isOpen: boolean;
    blockKey: string;
    blockTitle: string;
    item: BmcItem | null;
  }>({
    isOpen: false,
    blockKey: '',
    blockTitle: '',
    item: null,
  });

  // AI Block Enhancer modal state
  const [enhanceModal, setEnhanceModal] = useState<{
    isOpen: boolean;
    blockKey: string;
    blockTitle: string;
  }>({
    isOpen: false,
    blockKey: '',
    blockTitle: '',
  });

  // User auth state
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bmc));
    } catch (e) {
      console.error('Failed to save BMC to localStorage:', e);
    }
  }, [bmc]);

  // Init Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        showToast(`Selamat datang, ${res.user.displayName || res.user.email}!`);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      showToast('Gagal masuk dengan Google: ' + (err.message || ''));
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
    showToast('Berhasil keluar dari akun Google.');
  };

  const handleReset = () => {
    if (window.confirm('Reset kanvas ke template default? Perubahan yang belum diekspor akan diganti.')) {
      setBmc(BMC_TEMPLATES[0].data);
      showToast('Kanvas telah direset ke template default.');
    }
  };

  const handleClearCanvas = () => {
    if (window.confirm('Kosongkan seluruh 9 blok kanvas untuk mulai dari nol?')) {
      setBmc(EMPTY_BMC);
      showToast('Kanvas telah dikosongkan. Silakan isi secara leluasa.');
    }
  };

  // Handler for adding/updating single items
  const handleSaveItem = (itemData: Omit<BmcItem, 'id'>) => {
    const blockKey = itemModal.blockKey as keyof BmcData;
    const currentList = ((bmc[blockKey] as BmcItem[]) || []) as BmcItem[];

    if (itemModal.item) {
      // Edit existing
      const updatedList = currentList.map((it) =>
        it.id === itemModal.item?.id ? { ...it, ...itemData } : it
      );
      setBmc({ ...bmc, [blockKey]: updatedList });
      showToast(`Poin "${itemData.title}" berhasil diperbarui.`);
    } else {
      // Add new
      const newItem: BmcItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        ...itemData,
      };
      setBmc({ ...bmc, [blockKey]: [...currentList, newItem] });
      showToast(`Poin baru berhasil ditambahkan ke ${itemModal.blockTitle}.`);
    }
  };

  // Handler for inserting components from Guide
  const handleInsertGuideComponent = (blockKey: string, item: BmcItem) => {
    const key = blockKey as keyof BmcData;
    const currentList = ((bmc[key] as BmcItem[]) || []) as BmcItem[];
    setBmc({ ...bmc, [key]: [...currentList, item] });
    showToast(`Komponen "${item.title}" ditambahkan ke kanvas.`);
  };

  // Handler for AI Enhance Block additions
  const handleAddEnhancedItems = (items: BmcItem[]) => {
    const blockKey = enhanceModal.blockKey as keyof BmcData;
    const currentList = ((bmc[blockKey] as BmcItem[]) || []) as BmcItem[];
    setBmc({ ...bmc, [blockKey]: [...currentList, ...items] });
    showToast(`${items.length} rekomendasi AI berhasil ditambahkan ke ${enhanceModal.blockTitle}!`);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        businessName={bmc.businessName}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenPdfExport={() => setIsPdfOpen(true)}
        onOpenSlidesExport={() => setIsSlidesOpen(true)}
        onOpenCritique={() => setIsCritiqueOpen(true)}
        onOpenGuide={() => {
          setGuideInitialBlock(undefined);
          setIsGuideOpen(true);
        }}
        onReset={handleReset}
        onClearCanvas={handleClearCanvas}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        isAuthenticating={isAuthenticating}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'canvas' ? (
          <BmcCanvas
            bmc={bmc}
            onUpdateBmc={setBmc}
            onOpenAddItem={(blockKey, blockTitle) =>
              setItemModal({ isOpen: true, blockKey, blockTitle, item: null })
            }
            onOpenEditItem={(blockKey, blockTitle, item) =>
              setItemModal({ isOpen: true, blockKey, blockTitle, item })
            }
            onOpenEnhanceBlock={(blockKey, blockTitle) =>
              setEnhanceModal({ isOpen: true, blockKey, blockTitle })
            }
            onOpenGuideBlock={(blockKey) => {
              setGuideInitialBlock(blockKey);
              setIsGuideOpen(true);
            }}
          />
        ) : (
          <ExecutiveReportView
            bmc={bmc}
            onUpdateBmc={setBmc}
            onOpenPdfExport={() => setIsPdfOpen(true)}
            onOpenSlidesExport={() => setIsSlidesOpen(true)}
            onOpenGenerator={() => setIsGeneratorOpen(true)}
          />
        )}
      </main>

      {/* Floating Action Banner on bottom for Mobile / Quick Access */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-md w-full px-4 sm:hidden">
        <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-2.5 shadow-2xl border border-slate-700 flex items-center justify-around text-xs">
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="flex items-center space-x-1 font-bold text-amber-300 py-1 px-2.5 rounded-lg hover:bg-white/10"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Buat</span>
          </button>
          <button
            onClick={() => {
              setGuideInitialBlock(undefined);
              setIsGuideOpen(true);
            }}
            className="flex items-center space-x-1 text-slate-200 py-1 px-2 rounded-lg hover:bg-white/10"
          >
            <span>Panduan</span>
          </button>
          <button
            onClick={() => setIsPdfOpen(true)}
            className="flex items-center space-x-1 text-slate-200 py-1 px-2 rounded-lg hover:bg-white/10"
          >
            <FileDown className="w-4 h-4 text-rose-400" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => setIsSlidesOpen(true)}
            className="flex items-center space-x-1 text-slate-200 py-1 px-2 rounded-lg hover:bg-white/10"
          >
            <Presentation className="w-4 h-4 text-amber-400" />
            <span>Slides</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <AiGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onGenerated={(generatedBmc) => {
          setBmc(generatedBmc);
          showToast(`Business Model Canvas "${generatedBmc.businessName}" berhasil digenerate!`);
        }}
      />

      <TemplateSelectorModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={(templateData) => {
          setBmc(templateData);
          showToast(`Template "${templateData.businessName}" berhasil dimuat.`);
        }}
      />

      <SlidesExportModal
        isOpen={isSlidesOpen}
        onClose={() => setIsSlidesOpen(false)}
        bmc={bmc}
        user={user}
        accessToken={accessToken}
        onSignIn={handleSignIn}
        isAuthenticating={isAuthenticating}
      />

      <PdfExportModal
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
        bmc={bmc}
      />

      <BlockItemModal
        isOpen={itemModal.isOpen}
        onClose={() => setItemModal({ ...itemModal, isOpen: false })}
        blockKey={itemModal.blockKey}
        blockTitle={itemModal.blockTitle}
        item={itemModal.item}
        businessContext={`Bisnis: ${bmc.businessName}. Ide: ${bmc.executiveSummary}`}
        onSave={handleSaveItem}
      />

      <AiEnhanceBlockModal
        isOpen={enhanceModal.isOpen}
        onClose={() => setEnhanceModal({ ...enhanceModal, isOpen: false })}
        blockKey={enhanceModal.blockKey}
        blockTitle={enhanceModal.blockTitle}
        currentItems={(bmc[enhanceModal.blockKey as keyof BmcData] as BmcItem[]) || []}
        businessContext={`Bisnis: ${bmc.businessName}. Ide: ${bmc.executiveSummary}. Proposisi Nilai: ${bmc.valuePropositions.map((v) => v.title).join(', ')}`}
        onAddEnhancedItems={handleAddEnhancedItems}
      />

      <AiCritiqueDrawer
        isOpen={isCritiqueOpen}
        onClose={() => setIsCritiqueOpen(false)}
        bmc={bmc}
      />

      <BmcGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        initialBlockKey={guideInitialBlock}
        onInsertComponentToCanvas={handleInsertGuideComponent}
      />
    </div>
  );
}
