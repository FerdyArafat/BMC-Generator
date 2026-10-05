import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  MoreHorizontal,
  Sparkles,
  BookOpen,
  Trash2,
  Edit3,
  Search,
  ArrowUp,
  ArrowDown,
  Layers,
  Copy,
} from 'lucide-react';
import { BmcData, BmcItem } from '../types/bmc';

interface BmcCanvasProps {
  bmc: BmcData;
  onUpdateBmc: (updated: BmcData) => void;
  onOpenAddItem: (blockKey: string, blockTitle: string) => void;
  onOpenEditItem: (blockKey: string, blockTitle: string, item: BmcItem) => void;
  onOpenEnhanceBlock: (blockKey: string, blockTitle: string) => void;
  onOpenGuideBlock: (blockKey: string) => void;
}

const COLOR_ACCENTS: Record<string, { border: string; bg: string; dot: string }> = {
  blue: { border: 'border-l-blue-500', bg: 'hover:bg-blue-50/20', dot: 'bg-blue-500' },
  emerald: { border: 'border-l-emerald-500', bg: 'hover:bg-emerald-50/20', dot: 'bg-emerald-500' },
  amber: { border: 'border-l-amber-500', bg: 'hover:bg-amber-50/20', dot: 'bg-amber-500' },
  purple: { border: 'border-l-purple-500', bg: 'hover:bg-purple-50/20', dot: 'bg-purple-500' },
  rose: { border: 'border-l-rose-500', bg: 'hover:bg-rose-50/20', dot: 'bg-rose-500' },
  cyan: { border: 'border-l-cyan-500', bg: 'hover:bg-cyan-50/20', dot: 'bg-cyan-500' },
  slate: { border: 'border-l-slate-400', bg: 'hover:bg-slate-50', dot: 'bg-slate-400' },
};

export const BmcCanvas: React.FC<BmcCanvasProps> = ({
  bmc,
  onUpdateBmc,
  onOpenAddItem,
  onOpenEditItem,
  onOpenEnhanceBlock,
  onOpenGuideBlock,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuBlock, setActiveMenuBlock] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(bmc.businessName);
  const [taglineDraft, setTaglineDraft] = useState(bmc.tagline);

  // Close block menus when clicking outside
  useEffect(() => {
    const handleOutside = () => setActiveMenuBlock(null);
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  const filterItem = (item: BmcItem) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.tag && item.tag.toLowerCase().includes(q))
    );
  };

  const handleDeleteItem = (blockKey: keyof BmcData, itemId: string) => {
    const list = (bmc[blockKey] as BmcItem[]) || [];
    onUpdateBmc({
      ...bmc,
      [blockKey]: list.filter((i) => i.id !== itemId),
    });
  };

  const handleClearBlock = (blockKey: keyof BmcData) => {
    onUpdateBmc({
      ...bmc,
      [blockKey]: [],
    });
  };

  const handleDuplicateItem = (blockKey: keyof BmcData, item: BmcItem) => {
    const list = (bmc[blockKey] as BmcItem[]) || [];
    const copy: BmcItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: `${item.title} (Salinan)`,
    };
    onUpdateBmc({
      ...bmc,
      [blockKey]: [...list, copy],
    });
  };

  const handleSaveTitle = () => {
    onUpdateBmc({
      ...bmc,
      businessName: titleDraft.trim() || 'Kanvas Bisnis',
      tagline: taglineDraft.trim(),
    });
    setIsEditingTitle(false);
  };

  const renderBlock = ({
    blockKey,
    title,
    minHeight = 'min-h-[240px]',
  }: {
    blockKey: keyof BmcData;
    title: string;
    minHeight?: string;
  }) => {
    const rawItems = (bmc[blockKey] as BmcItem[]) || [];
    const items = rawItems.filter(filterItem);
    const isMenuOpen = activeMenuBlock === blockKey;

    return (
      <div
        className={`flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all ${minHeight} p-3`}
      >
        {/* Simple & Clean Block Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center space-x-1.5">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight">{title}</h3>
            {rawItems.length > 0 && (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded-full">
                {rawItems.length}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1 relative">
            {/* Quick Add Button */}
            <button
              onClick={() => onOpenAddItem(blockKey as string, title)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Tambah Poin"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            {/* Grouped Actions Dropdown Menu */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenuBlock(isMenuOpen ? null : (blockKey as string));
              }}
            >
              <button
                className={`p-1 rounded-lg transition-colors ${
                  isMenuOpen
                    ? 'bg-slate-200 text-slate-900'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title="Pilihan Blok"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-40 text-xs">
                  <button
                    onClick={() => {
                      onOpenEnhanceBlock(blockKey as string, title);
                      setActiveMenuBlock(null);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-amber-50 text-slate-700 hover:text-amber-800 flex items-center space-x-2 font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Rekomendasi AI</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenGuideBlock(blockKey as string);
                      setActiveMenuBlock(null);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 flex items-center space-x-2 font-medium"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Panduan & Contoh</span>
                  </button>

                  {rawItems.length > 0 && (
                    <>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        onClick={() => {
                          handleClearBlock(blockKey);
                          setActiveMenuBlock(null);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center space-x-2 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Semua Poin</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Container */}
        <div className="flex-1 space-y-2 overflow-y-auto max-h-[380px] pr-0.5">
          {items.length === 0 ? (
            <div
              onClick={() => onOpenAddItem(blockKey as string, title)}
              className="h-full min-h-[90px] flex flex-col items-center justify-center p-3 text-center rounded-xl border border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 cursor-pointer transition-all group"
            >
              <span className="text-[11px] text-slate-400 group-hover:text-slate-600 font-medium">
                + Tambah poin
              </span>
            </div>
          ) : (
            items.map((item) => {
              const accent = COLOR_ACCENTS[item.color || 'blue'] || COLOR_ACCENTS.blue;
              return (
                <div
                  key={item.id}
                  className={`group relative rounded-xl border border-slate-200/80 border-l-[3px] ${accent.border} p-2.5 bg-white ${accent.bg} transition-all shadow-2xs hover:shadow-xs text-left`}
                >
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h4>

                    {/* Clean Hover Actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-0.5 ml-1">
                      <button
                        onClick={() => onOpenEditItem(blockKey as string, title, item)}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                        title="Edit poin"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDuplicateItem(blockKey, item)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded"
                        title="Duplikat poin"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(blockKey, item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Hapus poin"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {item.description && (
                    <p className="mt-1 text-[11px] text-slate-600 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  )}

                  {item.tag && (
                    <div className="mt-1.5 flex items-center">
                      <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded-md">
                        {item.tag}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3.5">
      {/* Top Header Bar: Clean & Minimalist */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex-1">
          {isEditingTitle ? (
            <div className="space-y-1.5 max-w-lg">
              <input
                type="text"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                placeholder="Nama Bisnis"
                className="w-full text-base font-bold text-slate-900 border border-slate-300 rounded-lg px-2.5 py-1 text-xs focus:ring-2 focus:ring-slate-400"
              />
              <input
                type="text"
                value={taglineDraft}
                onChange={(e) => setTaglineDraft(e.target.value)}
                placeholder="Tagline / Deskripsi Singkat"
                className="w-full text-xs text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-slate-400"
              />
              <div className="flex items-center space-x-2 pt-0.5">
                <button
                  onClick={handleSaveTitle}
                  className="px-2.5 py-1 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800"
                >
                  Simpan
                </button>
                <button
                  onClick={() => setIsEditingTitle(false)}
                  className="px-2.5 py-1 text-slate-500 text-xs hover:text-slate-800"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <div className="group flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {bmc.businessName || 'Kanvas Bisnis'}
              </h1>
              <button
                onClick={() => {
                  setTitleDraft(bmc.businessName);
                  setTaglineDraft(bmc.tagline);
                  setIsEditingTitle(true);
                }}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-800 transition-opacity p-0.5"
                title="Edit Judul"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {!isEditingTitle && bmc.tagline && (
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{bmc.tagline}</p>
          )}
        </div>

        {/* Clean Search Input */}
        <div className="relative min-w-[180px] sm:w-60">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari poin..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-400"
          />
        </div>
      </div>

      {/* 9-BOX OSTERWALDER CANVAS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        {/* COLUMN 1: Key Partners */}
        <div className="lg:col-span-1">
          {renderBlock({
            blockKey: 'keyPartners',
            title: 'Kemitraan Utama',
            minHeight: 'h-full min-h-[380px]',
          })}
        </div>

        {/* COLUMN 2: Activities (Top) & Resources (Bottom) */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          {renderBlock({
            blockKey: 'keyActivities',
            title: 'Aktivitas Kunci',
            minHeight: 'min-h-[185px] flex-1',
          })}
          {renderBlock({
            blockKey: 'keyResources',
            title: 'Sumber Daya',
            minHeight: 'min-h-[185px] flex-1',
          })}
        </div>

        {/* COLUMN 3: Value Propositions (Center Core) */}
        <div className="lg:col-span-1">
          {renderBlock({
            blockKey: 'valuePropositions',
            title: 'Proposisi Nilai',
            minHeight: 'h-full min-h-[380px]',
          })}
        </div>

        {/* COLUMN 4: Customer Relationships (Top) & Channels (Bottom) */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          {renderBlock({
            blockKey: 'customerRelationships',
            title: 'Hubungan Pelanggan',
            minHeight: 'min-h-[185px] flex-1',
          })}
          {renderBlock({
            blockKey: 'channels',
            title: 'Saluran Distribusi',
            minHeight: 'min-h-[185px] flex-1',
          })}
        </div>

        {/* COLUMN 5: Customer Segments */}
        <div className="lg:col-span-1">
          {renderBlock({
            blockKey: 'customerSegments',
            title: 'Segmen Pelanggan',
            minHeight: 'h-full min-h-[380px]',
          })}
        </div>

        {/* BOTTOM ROW: Cost Structure (Left) & Revenue Streams (Right) */}
        <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            {renderBlock({
              blockKey: 'costStructure',
              title: 'Struktur Biaya',
              minHeight: 'min-h-[200px]',
            })}
          </div>
          <div>
            {renderBlock({
              blockKey: 'revenueStreams',
              title: 'Sumber Pendapatan',
              minHeight: 'min-h-[200px]',
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
