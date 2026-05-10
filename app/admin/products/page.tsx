'use client';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  X, Save, Search, ChevronDown, Package, Cake,
} from 'lucide-react';
import { PRODUCTS } from '@/lib/products';
import type { Product, ProductCategory, CakeCustomField, OneLayerCustomField, BiggerCakeCustomField } from '@/types';

const CAKE_TYPES = [
  { id: 'one-layer',    label: 'One-Layer Cake',  desc: 'Vanilla, Chocolate, Red Velvet — same day available' },
  { id: 'bigger-cakes', label: 'Bigger Cake',      desc: 'Multi-layer, custom design cakes 6″–12″' },
];

const OTHER_CATS: { id: ProductCategory; label: string }[] = [
  { id: 'pastries',     label: 'Pastries'      },
  { id: 'small-chops',  label: 'Small Chops'   },
  { id: 'daily-treats', label: 'Daily Treats'  },
  { id: 'events',       label: 'Events'        },
];

const ALL_CATS = [
  { id: 'one-layer'    as ProductCategory, label: 'One-Layer Cakes'  },
  { id: 'bigger-cakes' as ProductCategory, label: 'Bigger Cakes'     },
  ...OTHER_CATS,
];

// ── Customization options per cake type ──────────────────────────────────────
const ONE_LAYER_FIELDS: { key: OneLayerCustomField; label: string; desc: string }[] = [
  { key: 'flavour',       label: 'Cake Flavour',          desc: 'Vanilla, Chocolate, Red Velvet' },
  { key: 'icing',         label: 'Type of Icing',         desc: 'Buttercream or Whipped Cream (+₦2,000)' },
  { key: 'colour',        label: 'Cake Colour & Theme',   desc: 'Colour chips + custom theme field' },
  { key: 'message',       label: 'Cake Message',          desc: 'Text to write on the cake' },
  { key: 'occasion',      label: 'Occasion',              desc: 'Birthday, Wedding, etc.' },
  { key: 'gender',        label: 'Gender of Receiver',    desc: 'Female, Male, Unisex' },
  { key: 'delivery',      label: 'Delivery Details',      desc: 'Delivery date & address' },
  { key: 'addon_card',    label: 'Add-on: Greeting Card', desc: '+₦3,000, includes card message field' },
  { key: 'addon_chamdor', label: 'Add-on: Chamdor Wine',  desc: '+₦6,000' },
  { key: 'addon_candles', label: 'Add-on: Candles',       desc: '+₦500 each, quantity selectable' },
  { key: 'notes',         label: 'Additional Notes',      desc: 'Free-text special requests field' },
];

const BIGGER_CAKE_FIELDS: { key: BiggerCakeCustomField; label: string; desc: string }[] = [
  { key: 'size_layers',     label: 'Size & Layers',           desc: 'Inches (6–12) and layer count (2–6)' },
  { key: 'flavour_regular', label: 'Regular Flavours',        desc: 'Vanilla, Chocolate, Red Velvet' },
  { key: 'flavour_deluxe',  label: 'Deluxe Flavours',         desc: 'Carrot, Coconut, Ginger, Cookies & Cream' },
  { key: 'colour',          label: 'Cake Colour',             desc: 'Colour chips + custom theme field' },
  { key: 'topper',          label: 'Cake Topper',             desc: 'Number, Name, Floral Picks, etc.' },
  { key: 'occasion',        label: 'Occasion',                desc: 'Birthday, Wedding, etc.' },
  { key: 'gender',          label: 'Gender of Receiver',      desc: 'Female, Male, Unisex' },
  { key: 'delivery',        label: 'Delivery Details',        desc: 'Delivery date & address' },
  { key: 'addon_card',      label: 'Add-on: Greeting Card',   desc: '+₦3,000, includes card message field' },
  { key: 'addon_chamdor',   label: 'Add-on: Chamdor Wine',    desc: '+₦6,000' },
  { key: 'addon_candles',   label: 'Add-on: Candles',         desc: '+₦500 each, quantity selectable' },
  { key: 'notes',           label: 'Additional Notes',        desc: 'Free-text special requests field' },
];

const DESIGN_STYLES = [
  'Chocolate Drip','Wafer Paper Florals','Ombré','Leopard Print',
  'Picture / Photo','Ladies Cake','Stencil','Square','Rectangular','Buttercream Swirls',
];

const DEFAULT_ONE_LAYER: OneLayerCustomField[] = ONE_LAYER_FIELDS.map(f => f.key);
const DEFAULT_BIGGER:    BiggerCakeCustomField[]  = BIGGER_CAKE_FIELDS.map(f => f.key);

const EMPTY: Omit<Product, 'id'> = {
  name: '', description: '', price: '', image: '/images/cake-vanilla.jpg',
  category: 'one-layer', badge: '', badge_color: 'rose',
  in_stock: true, featured: false, sort_order: 99, moq: '',
  customizationOptions: [...DEFAULT_ONE_LAYER],
  designStyle: '',
};

const INPUT = `w-full px-3.5 py-2.5 rounded-xl border border-[#A58CF4]/50
  text-[0.85rem] text-[#433075] bg-white focus:border-[#A58CF4] focus:outline-none transition-colors`;

const isCake = (cat: string) => cat === 'one-layer' || cat === 'bigger-cakes';

// ── Main content ────────────────────────────────────────────────────────────
function ProductsContent() {
  const params = useSearchParams();
  const [list,      setList]      = useState<Product[]>([...PRODUCTS]);
  const [search,    setSearch]    = useState('');
  const [catFilter, setCatFilter] = useState(params.get('category') || 'all');
  const [modal,     setModal]     = useState<'new' | 'edit' | null>(null);
  const [step,      setStep]      = useState<'type' | 'details'>('type');
  const [editing,   setEditing]   = useState<Partial<Product>>({ ...EMPTY });
  const [deleteId,  setDeleteId]  = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [toast,     setToast]     = useState('');

  useEffect(() => {
    if (params.get('action') === 'new') openNew();
    const cat = params.get('category');
    if (cat) setCatFilter(cat);
  }, [params]);

  const filtered = list.filter(p => {
    const matchCat = catFilter === 'all' || p.category === catFilter;
    const matchQ   = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  function openNew() {
    setEditing({ ...EMPTY, customizationOptions: [...DEFAULT_ONE_LAYER] });
    setStep('type');
    setModal('new');
  }
  function openEdit(p: Product) {
    setEditing({
      ...p,
      customizationOptions: p.customizationOptions ??
        (p.category === 'one-layer' ? [...DEFAULT_ONE_LAYER] : [...DEFAULT_BIGGER]),
    });
    setStep('details'); // go straight to details when editing
    setModal('edit');
  }
  function closeModal() { setModal(null); setEditing({ ...EMPTY }); setStep('type'); }

  function selectCakeType(type: 'one-layer' | 'bigger-cakes') {
    setEditing(prev => ({
      ...prev,
      category: type,
      customizationOptions: type === 'one-layer' ? [...DEFAULT_ONE_LAYER] : [...DEFAULT_BIGGER],
      designStyle: '',
    }));
    setStep('details');
  }

  function selectOtherCat(cat: ProductCategory) {
    setEditing(prev => ({ ...prev, category: cat, customizationOptions: [] }));
    setStep('details');
  }

  function toggleStock(id: string) {
    setList(prev => prev.map(p => p.id === id ? { ...p, in_stock: !p.in_stock } : p));
    flash('Stock status updated');
  }
  function doDelete() {
    if (!deleteId) return;
    setList(prev => prev.filter(p => p.id !== deleteId));
    setDeleteId(null);
    flash('Product deleted');
  }
  function save() {
    if (!editing.name?.trim()) { flash('Please enter a product name'); return; }
    setSaving(true);
    setTimeout(() => {
      if (modal === 'new') {
        setList(prev => [{ ...(editing as Omit<Product, 'id'>), id: `new-${Date.now()}` }, ...prev]);
        flash('Product added ✓');
      } else {
        setList(prev => prev.map(p => p.id === editing.id ? { ...p, ...editing } as Product : p));
        flash('Product updated ✓');
      }
      setSaving(false);
      closeModal();
    }, 500);
  }

  function set(key: string, val: unknown) {
    setEditing(prev => ({ ...prev, [key]: val }));
  }

  function toggleCustomField(field: CakeCustomField) {
    setEditing(prev => {
      const curr = prev.customizationOptions ?? [];
      return {
        ...prev,
        customizationOptions: curr.includes(field) ? curr.filter(f => f !== field) : [...curr, field],
      };
    });
  }

  const catName = (id: string) => ALL_CATS.find(c => c.id === id)?.label || id;
  const currentFields = editing.category === 'one-layer' ? ONE_LAYER_FIELDS : BIGGER_CAKE_FIELDS;

  return (
    <div className="p-5 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-cormorant text-[1.9rem] font-semibold text-[#433075]">Products</h1>
          <p className="text-[0.82rem] text-[#6E6A8C]">Showing {filtered.length} of {list.length} products</p>
        </div>
        <button onClick={openNew}
          className="inline-flex items-center gap-2 bg-[#433075] text-white px-5 py-2.5
            rounded-full text-[0.85rem] font-medium hover:bg-[#A58CF4] transition-colors
            self-start sm:self-auto active:scale-[0.97]">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E6A8C]/50 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[rgba(165,140,244,0.22)]
              text-[0.85rem] text-[#433075] bg-white focus:border-[#A58CF4] focus:outline-none" />
        </div>
        <div className="relative">
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            className="appearance-none px-4 pr-9 py-2.5 rounded-xl border border-[rgba(165,140,244,0.22)]
              text-[0.85rem] text-[#433075] bg-white focus:border-[#A58CF4] focus:outline-none w-full sm:w-auto">
            <option value="all">All Categories</option>
            {ALL_CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6A8C] pointer-events-none" />
        </div>
      </div>

      {/* Table — desktop */}
      <div className="bg-white rounded-2xl border border-[rgba(165,140,244,0.12)] overflow-hidden">
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[rgba(165,140,244,0.1)] bg-[#FAFAFA]">
                {['Product','Category','Price','Customization','Status','Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-[0.7rem] tracking-[0.1em] uppercase text-[#6E6A8C]/70 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(165,140,244,0.07)]">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden relative shrink-0 bg-[#F3F0FA]">
                        <Image src={p.image} alt={p.name} fill className="object-cover" sizes="44px" />
                      </div>
                      <div>
                        <p className="text-[0.88rem] font-medium text-[#433075] leading-tight">{p.name}</p>
                        {p.designStyle && <p className="text-[0.65rem] text-[#A58CF4]">🎨 {p.designStyle}</p>}
                        {p.featured && <p className="text-[0.65rem] text-[#A58CF4]">★ Featured</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[0.75rem] bg-[#F3F0FA] px-2.5 py-1 rounded-full text-[#6E6A8C]">
                      {catName(p.category)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[0.85rem] text-[#433075]">{p.price}</td>
                  <td className="px-4 py-4">
                    {isCake(p.category) ? (
                      <span className="text-[0.75rem] text-[#6E6A8C]">
                        {p.customizationOptions
                          ? `${p.customizationOptions.length} options`
                          : 'All options'}
                      </span>
                    ) : (
                      <span className="text-[0.72rem] text-[#6E6A8C]/30">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <button onClick={() => toggleStock(p.id)}
                      className={`flex items-center gap-1.5 text-[0.75rem] font-medium
                        px-3 py-1.5 rounded-full transition-all duration-200
                        ${p.in_stock
                          ? 'bg-[#EBF7EB] text-[#3A7A3A] hover:bg-[#D6F0D6]'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}>
                      {p.in_stock ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                      {p.in_stock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)}
                        className="p-2 text-[#6E6A8C] hover:text-[#433075] hover:bg-[#F3F0FA] rounded-lg transition-all">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteId(p.id)}
                        className="p-2 text-[#6E6A8C] hover:text-[#A58CF4] hover:bg-[#A58CF4]/10 rounded-lg transition-all">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-14 text-[#6E6A8C]">
              <Package size={32} className="mx-auto mb-3 opacity-20" />
              <p className="text-[0.88rem]">No products match your filters.</p>
            </div>
          )}
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-[rgba(165,140,244,0.08)]">
          {filtered.map(p => (
            <div key={p.id} className="p-4 flex gap-3 items-start">
              <div className="w-14 h-14 rounded-xl overflow-hidden relative shrink-0 bg-[#F3F0FA]">
                <Image src={p.image} alt={p.name} fill className="object-cover" sizes="56px" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[0.88rem] font-medium text-[#433075] leading-tight">{p.name}</p>
                    <p className="text-[0.72rem] text-[#6E6A8C] mt-0.5">{catName(p.category)}</p>
                    <p className="text-[0.78rem] text-[#A58CF4] mt-1 font-medium">{p.price}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(p)} className="p-1.5 text-[#6E6A8C] hover:text-[#433075]"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteId(p.id)} className="p-1.5 text-[#6E6A8C] hover:text-[#A58CF4]"><Trash2 size={14} /></button>
                  </div>
                </div>
                <button onClick={() => toggleStock(p.id)}
                  className={`mt-2 text-[0.7rem] font-medium px-3 py-1 rounded-full
                    ${p.in_stock ? 'bg-[#EBF7EB] text-[#3A7A3A]' : 'bg-amber-50 text-amber-700'}`}>
                  {p.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-12 text-[#6E6A8C] text-[0.88rem]">No products found.</div>}
        </div>
      </div>

      {/* ══════════ MODAL ══════════ */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(165,140,244,0.12)] sticky top-0 bg-white z-10 rounded-t-3xl">
              <div>
                <h2 className="font-cormorant text-[1.4rem] font-semibold text-[#433075]">
                  {modal === 'new' ? 'Add New Product' : 'Edit Product'}
                </h2>
                {step === 'details' && modal === 'new' && (
                  <button onClick={() => setStep('type')}
                    className="text-[0.72rem] text-[#A58CF4] hover:underline mt-0.5 block">
                    ← Change type
                  </button>
                )}
              </div>
              <button onClick={closeModal} className="text-[#6E6A8C] hover:text-[#433075] p-1.5 rounded-lg hover:bg-[#F3F0FA]">
                <X size={18} />
              </button>
            </div>

            {/* ── STEP 1: Choose product type (new products only) ── */}
            {step === 'type' && modal === 'new' && (
              <div className="px-6 py-6 space-y-4">
                <p className="text-[0.72rem] tracking-[0.12em] uppercase text-[#6E6A8C] mb-1">What type of product is this?</p>

                {/* Cake types */}
                <div>
                  <p className="text-[0.7rem] text-[#A58CF4] font-semibold tracking-[0.1em] uppercase mb-2 flex items-center gap-1.5">
                    <Cake size={12} /> Cakes
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {CAKE_TYPES.map(ct => (
                      <button key={ct.id} onClick={() => selectCakeType(ct.id as 'one-layer' | 'bigger-cakes')}
                        className="p-4 rounded-xl border-2 border-[rgba(165,140,244,0.25)] bg-[#FAFAFA]
                          hover:border-[#433075] hover:bg-[#F3F0FA] transition-all text-left group active:scale-[0.97]">
                        <p className="text-[0.88rem] font-semibold text-[#433075] mb-1">{ct.label}</p>
                        <p className="text-[0.7rem] text-[#6E6A8C] leading-snug">{ct.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Other categories */}
                <div>
                  <p className="text-[0.7rem] text-[#6E6A8C] font-semibold tracking-[0.1em] uppercase mb-2">Other Products</p>
                  <div className="grid grid-cols-2 gap-2">
                    {OTHER_CATS.map(cat => (
                      <button key={cat.id} onClick={() => selectOtherCat(cat.id)}
                        className="px-4 py-3 rounded-xl border border-[rgba(165,140,244,0.2)] bg-[#FAFAFA]
                          hover:border-[#A58CF4] hover:bg-[#F3F0FA] transition-all text-left active:scale-[0.97]">
                        <p className="text-[0.85rem] font-medium text-[#433075]">{cat.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Product details ── */}
            {step === 'details' && (
              <div className="px-6 py-5 space-y-4">
                {/* Category badge */}
                <div className="flex items-center gap-2">
                  <span className="text-[0.72rem] bg-[#F3F0FA] text-[#6E6A8C] px-3 py-1 rounded-full">
                    {catName(editing.category ?? '')}
                  </span>
                  {isCake(editing.category ?? '') && (
                    <span className="text-[0.65rem] text-[#A58CF4]">🎂 Cake product — customization options below</span>
                  )}
                </div>

                {/* Image */}
                <div>
                  <label className="block text-[0.7rem] tracking-[0.1em] uppercase text-[#6E6A8C] mb-1.5">Product Image</label>
                  <label className="relative block cursor-pointer group">
                    <input type="file" accept="image/*" capture="environment" className="sr-only"
                      onChange={e => { const f = e.target.files?.[0]; if (f) set('image', URL.createObjectURL(f)); }} />
                    {editing.image ? (
                      <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#F3F0FA]">
                        <Image src={editing.image} alt="preview" fill className="object-cover" sizes="500px" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-[0.78rem] font-medium bg-black/50 px-3 py-1.5 rounded-full">📷 Change photo</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-28 rounded-xl border-2 border-dashed border-[#A58CF4]
                        bg-[#F3F0FA]/40 flex flex-col items-center justify-center gap-2 group-hover:bg-[#F3F0FA]/70 transition-all">
                        <span className="text-2xl">📷</span>
                        <span className="text-[0.78rem] text-[#A58CF4] font-medium">Tap to choose or take a photo</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Basic fields */}
                {([
                  { label: 'Product Name *', key: 'name',  ph: 'e.g. Vanilla Bloom'  },
                  { label: 'Price *',        key: 'price', ph: 'e.g. From ₦8,500'    },
                  { label: 'Badge text',     key: 'badge', ph: 'e.g. Popular'         },
                  { label: 'MOQ note',       key: 'moq',   ph: 'e.g. MOQ: 10 pieces' },
                ] as { label: string; key: string; ph: string }[]).map(f => (
                  <div key={f.key}>
                    <label className="block text-[0.7rem] tracking-[0.1em] uppercase text-[#6E6A8C] mb-1.5">{f.label}</label>
                    <input type="text" value={(editing as Record<string,string>)[f.key] || ''}
                      onChange={e => set(f.key, e.target.value)} placeholder={f.ph} className={INPUT} />
                  </div>
                ))}

                <div>
                  <label className="block text-[0.7rem] tracking-[0.1em] uppercase text-[#6E6A8C] mb-1.5">Description</label>
                  <textarea rows={3} value={editing.description || ''} onChange={e => set('description', e.target.value)}
                    placeholder="Short product description…" className={INPUT + ' resize-none'} />
                </div>

                {/* Design style — bigger cakes only, set by admin */}
                {editing.category === 'bigger-cakes' && (
                  <div>
                    <label className="block text-[0.7rem] tracking-[0.1em] uppercase text-[#6E6A8C] mb-1.5">
                      Design Style <span className="normal-case text-[#A58CF4]">(shown to customer as info — set by you)</span>
                    </label>
                    <select value={editing.designStyle || ''} onChange={e => set('designStyle', e.target.value)} className={INPUT}>
                      <option value="">— Select design style —</option>
                      {DESIGN_STYLES.map(d => <option key={d}>{d}</option>)}
                    </select>
                    <p className="text-[0.67rem] text-[#6E6A8C]/60 mt-1">
                      This is a design you already have — customers won&apos;t pick it, they&apos;ll see it as the cake&apos;s design.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.7rem] tracking-[0.1em] uppercase text-[#6E6A8C] mb-1.5">Badge Colour</label>
                    <select value={editing.badge_color || 'rose'} onChange={e => set('badge_color', e.target.value)} className={INPUT}>
                      <option value="rose">Rose / Pink</option>
                      <option value="green">Green</option>
                      <option value="mauve">Mauve / Purple</option>
                    </select>
                  </div>
                  <div className="flex flex-col justify-end gap-3 pb-0.5">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input type="checkbox" checked={editing.in_stock ?? true} onChange={e => set('in_stock', e.target.checked)} className="w-4 h-4 accent-[#A58CF4]" />
                      <span className="text-[0.85rem] text-[#433075]">In Stock</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input type="checkbox" checked={editing.featured ?? false} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 accent-[#A58CF4]" />
                      <span className="text-[0.85rem] text-[#433075]">Featured</span>
                    </label>
                  </div>
                </div>

                {/* ══ CUSTOMIZATION OPTIONS — cakes only ══ */}
                {isCake(editing.category ?? '') && (
                  <div className="border-2 border-[#A58CF4]/25 rounded-2xl overflow-hidden">
                    <div className="bg-[#F3F0FA] px-5 py-4 flex items-center justify-between">
                      <div>
                        <p className="font-cormorant text-[1.1rem] font-semibold text-[#433075]">
                          Customer Customization Options
                        </p>
                        <p className="text-[0.72rem] text-[#6E6A8C] mt-0.5">
                          Tick what customers can choose when ordering this cake.
                        </p>
                      </div>
                      <div className="flex gap-3 shrink-0">
                        <button type="button"
                          onClick={() => setEditing(prev => ({ ...prev, customizationOptions: currentFields.map(f => f.key) as CakeCustomField[] }))}
                          className="text-[0.72rem] font-medium text-[#A58CF4] hover:text-[#433075] transition-colors">
                          Select All
                        </button>
                        <button type="button"
                          onClick={() => setEditing(prev => ({ ...prev, customizationOptions: [] }))}
                          className="text-[0.72rem] font-medium text-[#6E6A8C] hover:text-[#433075] transition-colors">
                          Clear All
                        </button>
                      </div>
                    </div>

                    <div className="divide-y divide-[rgba(165,140,244,0.1)]">
                      {currentFields.map(field => {
                        const enabled = (editing.customizationOptions ?? []).includes(field.key as CakeCustomField);
                        return (
                          <label key={field.key}
                            className={`flex items-start gap-3.5 px-5 py-3.5 cursor-pointer transition-colors
                              ${enabled ? 'bg-white' : 'bg-white/60 hover:bg-white/90'}`}>
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={() => toggleCustomField(field.key as CakeCustomField)}
                              className="w-4 h-4 accent-[#433075] mt-0.5 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className={`text-[0.85rem] font-medium leading-tight ${enabled ? 'text-[#433075]' : 'text-[#6E6A8C]'}`}>
                                  {field.label}
                                </p>
                                {enabled && (
                                  <span className="text-[0.6rem] bg-[#433075]/10 text-[#433075] px-2 py-0.5 rounded-full shrink-0">On</span>
                                )}
                              </div>
                              <p className="text-[0.7rem] text-[#6E6A8C]/65 mt-0.5 leading-snug">{field.desc}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    <div className="bg-[#F3F0FA] px-5 py-2.5 text-center">
                      <span className="text-[0.7rem] text-[#6E6A8C]">
                        <strong className="text-[#433075]">{(editing.customizationOptions ?? []).length}</strong> of {currentFields.length} options enabled
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            {step === 'details' && (
              <div className="px-6 pb-6 flex gap-3">
                <button onClick={closeModal}
                  className="flex-1 border border-[rgba(165,140,244,0.25)] text-[#6E6A8C] py-3
                    rounded-full text-[0.85rem] hover:bg-[#F3F0FA] transition-colors">
                  Cancel
                </button>
                <button onClick={save} disabled={saving}
                  className="flex-1 bg-[#433075] text-white py-3 rounded-full text-[0.85rem]
                    font-medium flex items-center justify-center gap-2
                    hover:bg-[#A58CF4] transition-colors disabled:opacity-60 active:scale-[0.97]">
                  <Save size={15} />
                  {saving ? 'Saving…' : modal === 'new' ? 'Add Product' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-4xl mb-4">🗑️</div>
            <h3 className="font-cormorant text-[1.4rem] text-[#433075] font-semibold mb-2">Delete this product?</h3>
            <p className="text-[0.85rem] text-[#6E6A8C] mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 border border-[rgba(165,140,244,0.25)] py-2.5 rounded-full text-[0.85rem] text-[#6E6A8C] hover:bg-[#F3F0FA] transition-colors">
                Cancel
              </button>
              <button onClick={doDelete}
                className="flex-1 bg-[#A58CF4] text-white py-2.5 rounded-full text-[0.85rem] font-medium hover:bg-[#433075] transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80]
          bg-[#433075] text-white px-6 py-3 rounded-full text-[0.84rem]
          shadow-[0_10px_36px_rgba(67,48,117,0.25)] whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 flex items-center justify-center min-h-[40vh]"><div className="text-[#6E6A8C] text-[0.88rem]">Loading products…</div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
