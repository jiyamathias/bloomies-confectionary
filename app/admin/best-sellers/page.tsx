'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Pencil, Save, X, GripVertical, Plus, Trash2, CheckCircle } from 'lucide-react';
import {
  PRODUCTS,
  DEFAULT_BEST_SELLERS,
  getBestSellersConfig,
  saveBestSellersConfig,
} from '@/lib/products';
import type { BestSellersConfig } from '@/lib/products';
import type { Product } from '@/types';

const MAX_PRODUCTS = 6;

export default function AdminBestSellersPage() {
  const [config,      setConfig]      = useState<BestSellersConfig>(DEFAULT_BEST_SELLERS);
  const [title,       setTitle]       = useState(DEFAULT_BEST_SELLERS.title);
  const [editingTitle,setEditingTitle]= useState(false);
  const [picker,      setPicker]      = useState(false);
  const [toast,       setToast]       = useState('');
  const [saved,       setSaved]       = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const cfg = getBestSellersConfig();
    setConfig(cfg);
    setTitle(cfg.title);
  }, []);

  function flash(msg: string) {
    setToast(msg);
    setSaved(true);
    setTimeout(() => { setToast(''); setSaved(false); }, 2600);
  }

  function saveAll(cfg: BestSellersConfig) {
    saveBestSellersConfig(cfg);
    // notify the home page in case it's open in same tab
    window.dispatchEvent(new Event('bloomies:bestsellers'));
    flash('Best Sellers section updated!');
  }

  function saveTitle() {
    const updated = { ...config, title: title.trim() || 'Best Sellers' };
    setConfig(updated);
    setTitle(updated.title);
    setEditingTitle(false);
    saveAll(updated);
  }

  function removeProduct(id: string) {
    const updated = { ...config, productIds: config.productIds.filter(p => p !== id) };
    setConfig(updated);
    saveAll(updated);
  }

  function addProduct(id: string) {
    if (config.productIds.includes(id)) return;
    if (config.productIds.length >= MAX_PRODUCTS) return;
    const updated = { ...config, productIds: [...config.productIds, id] };
    setConfig(updated);
    saveAll(updated);
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    const ids = [...config.productIds];
    [ids[idx - 1], ids[idx]] = [ids[idx], ids[idx - 1]];
    const updated = { ...config, productIds: ids };
    setConfig(updated);
    saveAll(updated);
  }

  function moveDown(idx: number) {
    if (idx >= config.productIds.length - 1) return;
    const ids = [...config.productIds];
    [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]];
    const updated = { ...config, productIds: ids };
    setConfig(updated);
    saveAll(updated);
  }

  function resetToDefault() {
    setConfig(DEFAULT_BEST_SELLERS);
    setTitle(DEFAULT_BEST_SELLERS.title);
    saveAll(DEFAULT_BEST_SELLERS);
  }

  // Products currently in the section
  const currentProducts: (Product | undefined)[] = config.productIds
    .map(id => PRODUCTS.find(p => p.id === id));

  // Products available to add (not already in section)
  const available = PRODUCTS.filter(p =>
    p.in_stock && !config.productIds.includes(p.id)
  );

  const INPUT = `px-4 py-2.5 rounded-xl border border-[rgba(232,96,154,0.25)]
    text-[0.88rem] text-[#5B2D8E] bg-white focus:border-[#E8609A] focus:outline-none transition-colors`;

  return (
    <div className="p-5 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-cormorant text-[1.9rem] font-semibold text-[#5B2D8E]">
            Best Sellers Section
          </h1>
          <p className="text-[0.82rem] text-[#7B5EA7] mt-0.5">
            Manage which products appear in the Best Sellers section on the home page.
            Max {MAX_PRODUCTS} products.
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-[#3A7A3A] text-[0.82rem] bg-[#EBF7EB]
            px-4 py-2 rounded-full animate-fade-up">
            <CheckCircle size={14} /> Saved
          </div>
        )}
      </div>

      {/* Live preview note */}
      <div className="bg-[#F0EBFF] border border-[rgba(232,96,154,0.2)] rounded-xl px-4 py-3 mb-7 flex gap-2.5">
        <span className="text-[#E8609A] text-lg leading-tight">💡</span>
        <p className="text-[0.8rem] text-[#7B5EA7]">
          Changes are saved automatically and take effect immediately on the website.
          The section appears on the home page between the category grid and the stats row.
        </p>
      </div>

      {/* ── Section title ── */}
      <div className="bg-white rounded-2xl border border-[rgba(232,96,154,0.12)] p-6 mb-5">
        <p className="text-[0.72rem] tracking-[0.1em] uppercase text-[#7B5EA7] font-medium mb-4">
          Section Title
        </p>
        {editingTitle ? (
          <div className="flex gap-3">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') setEditingTitle(false); }}
              placeholder="Section title…"
              autoFocus
              className={INPUT + ' flex-1'}
            />
            <button onClick={saveTitle}
              className="flex items-center gap-1.5 bg-[#5B2D8E] text-white px-5 py-2.5
                rounded-full text-[0.82rem] font-medium hover:bg-[#E8609A] transition-colors">
              <Save size={14} /> Save
            </button>
            <button onClick={() => { setTitle(config.title); setEditingTitle(false); }}
              className="p-2.5 text-[#7B5EA7] hover:text-[#5B2D8E] border border-[rgba(232,96,154,0.2)]
                rounded-full hover:bg-[#F0EBFF] transition-all">
              <X size={15} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-cormorant text-[2rem] font-semibold text-[#5B2D8E]">{config.title}</p>
              <p className="text-[0.75rem] text-[#7B5EA7] mt-0.5">Displayed as the section heading on the home page</p>
            </div>
            <button onClick={() => setEditingTitle(true)}
              className="flex items-center gap-2 border border-[rgba(232,96,154,0.25)] text-[#7B5EA7]
                px-4 py-2 rounded-full text-[0.8rem] hover:bg-[#F0EBFF] hover:text-[#5B2D8E]
                transition-all">
              <Pencil size={14} /> Edit Title
            </button>
          </div>
        )}
      </div>

      {/* ── Current products ── */}
      <div className="bg-white rounded-2xl border border-[rgba(232,96,154,0.12)] p-6 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[0.72rem] tracking-[0.1em] uppercase text-[#7B5EA7] font-medium">
              Products in Section
            </p>
            <p className="text-[0.75rem] text-[#7B5EA7] mt-0.5">
              {config.productIds.length} of {MAX_PRODUCTS} slots used · Use arrows to reorder
            </p>
          </div>
          {config.productIds.length < MAX_PRODUCTS && (
            <button
              onClick={() => setPicker(true)}
              className="flex items-center gap-2 bg-[#5B2D8E] text-white px-4 py-2
                rounded-full text-[0.8rem] font-medium hover:bg-[#E8609A] transition-colors">
              <Plus size={14} /> Add Product
            </button>
          )}
        </div>

        {config.productIds.length === 0 ? (
          <div className="text-center py-10 text-[#7B5EA7]">
            <p className="text-[0.88rem] mb-3">No products selected yet.</p>
            <button onClick={() => setPicker(true)}
              className="inline-flex items-center gap-2 border-2 border-[#E8609A] text-[#E8609A]
                px-6 py-2.5 rounded-full text-[0.82rem] font-semibold
                hover:bg-[#E8609A] hover:text-white transition-all">
              <Plus size={14} /> Add First Product
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {currentProducts.map((product, idx) => {
              if (!product) return null;
              return (
                <div key={product.id}
                  className="flex items-center gap-3 p-3 bg-[#FAFAFE] rounded-xl
                    border border-[rgba(232,96,154,0.1)] group">
                  {/* Order controls */}
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button onClick={() => moveUp(idx)} disabled={idx === 0}
                      className="w-6 h-5 rounded text-[#7B5EA7] hover:text-[#5B2D8E] hover:bg-[#E8DAFF]
                        transition-all flex items-center justify-center disabled:opacity-20 text-[0.7rem]">
                      ▲
                    </button>
                    <button onClick={() => moveDown(idx)} disabled={idx === config.productIds.length - 1}
                      className="w-6 h-5 rounded text-[#7B5EA7] hover:text-[#5B2D8E] hover:bg-[#E8DAFF]
                        transition-all flex items-center justify-center disabled:opacity-20 text-[0.7rem]">
                      ▼
                    </button>
                  </div>

                  {/* Position badge */}
                  <span className="w-6 h-6 rounded-full bg-[#E8609A]/15 text-[#E8609A] text-[0.68rem]
                    font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>

                  {/* Image */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0">
                    <Image src={product.image} alt={product.name} fill
                      className="object-cover" sizes="40px" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.85rem] font-medium text-[#5B2D8E] truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[0.72rem] text-[#E8609A] font-medium">{product.price}</span>
                      <span className="text-[0.68rem] text-[#7B5EA7] bg-[#F0EBFF] px-2 py-0.5 rounded-full capitalize">
                        {product.category.replace('-', ' ')}
                      </span>
                      {!product.in_stock && (
                        <span className="text-[0.68rem] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          Out of stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Remove */}
                  <button onClick={() => removeProduct(product.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-[#7B5EA7]
                      hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Slot indicators */}
        {config.productIds.length < MAX_PRODUCTS && config.productIds.length > 0 && (
          <div className="mt-3 flex gap-1.5">
            {Array.from({ length: MAX_PRODUCTS }).map((_, i) => (
              <div key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors
                  ${i < config.productIds.length ? 'bg-[#E8609A]' : 'bg-[rgba(232,96,154,0.15)]'}`} />
            ))}
          </div>
        )}
      </div>

      {/* ── Reset ── */}
      <div className="flex justify-between items-center">
        <button onClick={resetToDefault}
          className="text-[0.78rem] text-[#7B5EA7] hover:text-[#E8609A] underline underline-offset-2
            transition-colors">
          Reset to defaults
        </button>
        <p className="text-[0.75rem] text-[#7B5EA7]/60">
          Changes are saved automatically ✓
        </p>
      </div>

      {/* ══════════ Product Picker Modal ══════════ */}
      {picker && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg
            max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-[rgba(232,96,154,0.12)]
              flex items-center justify-between">
              <div>
                <h3 className="font-cormorant text-[1.3rem] font-semibold text-[#5B2D8E]">
                  Add Product
                </h3>
                <p className="text-[0.75rem] text-[#7B5EA7]">
                  {MAX_PRODUCTS - config.productIds.length} slot{MAX_PRODUCTS - config.productIds.length !== 1 ? 's' : ''} remaining
                </p>
              </div>
              <button onClick={() => setPicker(false)}
                className="p-2 text-[#7B5EA7] hover:text-[#5B2D8E] hover:bg-[#F0EBFF] rounded-full transition-all">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {available.length === 0 ? (
                <p className="text-center py-8 text-[0.88rem] text-[#7B5EA7]">
                  All available products are already in the section.
                </p>
              ) : (
                available.map(product => (
                  <button key={product.id} onClick={() => { addProduct(product.id); setPicker(false); }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#F0EBFF]
                      transition-colors text-left border border-transparent hover:border-[rgba(232,96,154,0.2)]">
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0">
                      <Image src={product.image} alt={product.name} fill
                        className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.88rem] font-medium text-[#5B2D8E] truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[0.75rem] text-[#E8609A]">{product.price}</span>
                        <span className="text-[0.7rem] text-[#7B5EA7] bg-[#F0EBFF] px-2 py-0.5 rounded-full capitalize">
                          {product.category.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                    <Plus size={16} className="text-[#E8609A] shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#5B2D8E] text-white
          px-6 py-3 rounded-full text-[0.84rem] shadow-lg z-[80] whitespace-nowrap
          flex items-center gap-2 animate-fade-up">
          <CheckCircle size={14} className="text-[#5CB85C]" /> {toast}
        </div>
      )}
    </div>
  );
}
