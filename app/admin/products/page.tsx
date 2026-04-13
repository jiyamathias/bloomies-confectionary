'use client';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  X, Save, Search, ChevronDown, Package,
} from 'lucide-react';
import { PRODUCTS } from '@/lib/products';
import type { Product, ProductCategory } from '@/types';

const CATS: { id: ProductCategory; label: string }[] = [
  { id: 'one-layer',  label: 'One-Layer Cakes' },
  { id: 'bigger-cakes', label: 'Custom Design Cakes'       },
  { id: 'pastries',     label: 'Pastries'           },
  { id: 'small-chops',  label: 'Small Chops'        },
  { id: 'daily-treats', label: 'Daily Treats'       },
  { id: 'events',       label: 'Events'             },
];

const EMPTY: Omit<Product, 'id'> = {
  name: '', description: '', price: '', image: '/images/cake-vanilla.jpg',
  category: 'one-layer', badge: '', badge_color: 'rose',
  in_stock: true, featured: false, sort_order: 99, moq: '',
};

const INPUT_CLS = `w-full px-3.5 py-2.5 rounded-xl border border-[#C5B0E8]/50
  text-[0.85rem] text-[#5B2D8E] bg-white focus:border-[#9B7EC8] focus:outline-none transition-colors`;

function ProductsContent() {
  const params = useSearchParams();

  // Local state — all changes live in browser memory (no DB)
  const [list,     setList]     = useState<Product[]>(() => [...PRODUCTS]);
  const [search,   setSearch]   = useState('');
  const [catFilter,setCatFilter]= useState(params.get('category') || 'all');
  const [modal,    setModal]    = useState<'new' | 'edit' | null>(null);
  const [editing,  setEditing]  = useState<Partial<Product>>({ ...EMPTY });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState('');

  // Open new-product form if navigated with ?action=new
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

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  }

  function openNew()  { setEditing({ ...EMPTY }); setModal('new');  }
  function openEdit(p: Product) { setEditing({ ...p }); setModal('edit'); }
  function closeModal() { setModal(null); setEditing({ ...EMPTY }); }

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
        const newP: Product = {
          ...(editing as Omit<Product, 'id'>),
          id: `new-${Date.now()}`,
        };
        setList(prev => [newP, ...prev]);
        flash('Product added! ✓');
      } else {
        setList(prev => prev.map(p =>
          p.id === editing.id ? { ...p, ...editing } as Product : p
        ));
        flash('Product updated! ✓');
      }
      setSaving(false);
      closeModal();
    }, 500);
  }

  function set(key: string, val: unknown) {
    setEditing(prev => ({ ...prev, [key]: val }));
  }

  const catName = (id: string) => CATS.find(c => c.id === id)?.label || id;

  return (
    <div className="p-5 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-cormorant text-[1.9rem] font-semibold text-[#5B2D8E]">Products</h1>
          <p className="text-[0.82rem] text-[#7B5EA7]">
            Showing {filtered.length} of {list.length} products
          </p>
        </div>
        <button onClick={openNew}
          className="inline-flex items-center gap-2 bg-[#5B2D8E] text-white px-5 py-2.5
            rounded-full text-[0.85rem] font-medium hover:bg-[#E8609A] transition-colors
            self-start sm:self-auto active:scale-[0.97]">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B5EA7]/50 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[rgba(232,96,154,0.22)]
              text-[0.85rem] text-[#5B2D8E] bg-white focus:border-[#E8609A] focus:outline-none"
          />
        </div>
        <div className="relative">
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            className="appearance-none px-4 pr-9 py-2.5 rounded-xl border border-[rgba(232,96,154,0.22)]
              text-[0.85rem] text-[#5B2D8E] bg-white focus:border-[#E8609A] focus:outline-none w-full sm:w-auto"
          >
            <option value="all">All Categories</option>
            {CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B5EA7] pointer-events-none" />
        </div>
      </div>

      {/* ── Table: desktop ── */}
      <div className="bg-white rounded-2xl border border-[rgba(232,96,154,0.12)] overflow-hidden">
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[rgba(232,96,154,0.1)] bg-[#FAFAFE]">
                {['Product', 'Category', 'Price', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-[0.7rem] tracking-[0.1em] uppercase text-[#7B5EA7]/70 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(232,96,154,0.07)]">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-[#FAFAFE] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden relative shrink-0 bg-[#F0EBFF]">
                        <Image src={p.image} alt={p.name} fill className="object-cover" sizes="44px" />
                      </div>
                      <div>
                        <p className="text-[0.88rem] font-medium text-[#5B2D8E] leading-tight">{p.name}</p>
                        {p.featured && (
                          <span className="text-[0.65rem] text-[#9B7EC8]">★ Featured</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[0.75rem] bg-[#F0EBFF] px-2.5 py-1 rounded-full text-[#7B5EA7]">
                      {catName(p.category)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[0.85rem] text-[#5B2D8E]">{p.price}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleStock(p.id)}
                      className={`flex items-center gap-1.5 text-[0.75rem] font-medium
                        px-3 py-1.5 rounded-full transition-all duration-200
                        ${p.in_stock
                          ? 'bg-[#EBF7EB] text-[#3A7A3A] hover:bg-[#D6F0D6]'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}
                    >
                      {p.in_stock ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                      {p.in_stock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 text-[#7B5EA7] hover:text-[#5B2D8E] hover:bg-[#F0EBFF] rounded-lg transition-all"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="p-2 text-[#7B5EA7] hover:text-[#E8609A] hover:bg-[#E8609A]/10 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-14 text-[#7B5EA7]">
              <Package size={32} className="mx-auto mb-3 opacity-20" />
              <p className="text-[0.88rem]">No products match your filters.</p>
            </div>
          )}
        </div>

        {/* ── Cards: mobile ── */}
        <div className="sm:hidden divide-y divide-[rgba(232,96,154,0.08)]">
          {filtered.map(p => (
            <div key={p.id} className="p-4 flex gap-3 items-start">
              <div className="w-14 h-14 rounded-xl overflow-hidden relative shrink-0 bg-[#F0EBFF]">
                <Image src={p.image} alt={p.name} fill className="object-cover" sizes="56px" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[0.88rem] font-medium text-[#5B2D8E] leading-tight">{p.name}</p>
                    <p className="text-[0.72rem] text-[#7B5EA7] mt-0.5">{catName(p.category)}</p>
                    <p className="text-[0.78rem] text-[#E8609A] mt-1 font-medium">{p.price}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(p)} className="p-1.5 text-[#7B5EA7] hover:text-[#5B2D8E]">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteId(p.id)} className="p-1.5 text-[#7B5EA7] hover:text-[#E8609A]">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => toggleStock(p.id)}
                  className={`mt-2 text-[0.7rem] font-medium px-3 py-1 rounded-full
                    ${p.in_stock ? 'bg-[#EBF7EB] text-[#3A7A3A]' : 'bg-amber-50 text-amber-700'}`}
                >
                  {p.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#7B5EA7] text-[0.88rem]">No products found.</div>
          )}
        </div>
      </div>

      {/* ══════════ Product Modal ══════════ */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
          flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg
            max-h-[92vh] overflow-y-auto shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5
              border-b border-[rgba(232,96,154,0.12)] sticky top-0 bg-white z-10 rounded-t-3xl">
              <h2 className="font-cormorant text-[1.4rem] font-semibold text-[#5B2D8E]">
                {modal === 'new' ? 'Add New Product' : 'Edit Product'}
              </h2>
              <button onClick={closeModal} className="text-[#7B5EA7] hover:text-[#5B2D8E] p-1.5 rounded-lg hover:bg-[#F0EBFF]">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">

              {/* Image upload + preview */}
              <div>
                <label className="block text-[0.7rem] tracking-[0.1em] uppercase text-[#7B5EA7] mb-1.5">
                  Product Image
                </label>
                <label className="relative block cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="sr-only"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      set('image', url);
                    }}
                  />
                  {editing.image ? (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#F0EBFF]">
                      <Image src={editing.image} alt="preview" fill className="object-cover" sizes="500px" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[0.78rem] font-medium bg-black/50 px-3 py-1.5 rounded-full">
                          📷 Change photo
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-28 rounded-xl border-2 border-dashed border-[#C5B0E8]
                      bg-[#F0EBFF]/40 flex flex-col items-center justify-center gap-2
                      group-hover:border-[#9B7EC8] group-hover:bg-[#F0EBFF]/70 transition-all">
                      <span className="text-2xl">📷</span>
                      <span className="text-[0.78rem] text-[#9B7EC8] font-medium">Tap to choose or take a photo</span>
                      <span className="text-[0.68rem] text-[#7B5EA7]">from camera or gallery</span>
                    </div>
                  )}
                </label>
              </div>

              {/* Fields */}
              {([
                { label: 'Product Name *', key: 'name',  ph: 'e.g. Vanilla Bloom'           },
                { label: 'Price *',        key: 'price', ph: 'e.g. From ₦8,500'             },
                { label: 'Badge text',     key: 'badge', ph: 'e.g. Popular (leave empty for none)' },
                { label: 'MOQ note',       key: 'moq',   ph: 'e.g. MOQ: 10 pieces'          },
              ] as { label: string; key: string; ph: string }[]).map(f => (
                <div key={f.key}>
                  <label className="block text-[0.7rem] tracking-[0.1em] uppercase text-[#7B5EA7] mb-1.5">
                    {f.label}
                  </label>
                  <input
                    type="text"
                    value={(editing as Record<string, string>)[f.key] || ''}
                    onChange={e => set(f.key, e.target.value)}
                    placeholder={f.ph}
                    className={INPUT_CLS}
                  />
                </div>
              ))}

              <div>
                <label className="block text-[0.7rem] tracking-[0.1em] uppercase text-[#7B5EA7] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editing.description || ''}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Short product description…"
                  className={INPUT_CLS + ' resize-none'}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.7rem] tracking-[0.1em] uppercase text-[#7B5EA7] mb-1.5">
                    Category
                  </label>
                  <select
                    value={editing.category || 'one-layer'}
                    onChange={e => set('category', e.target.value)}
                    className={INPUT_CLS}
                  >
                    {CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[0.7rem] tracking-[0.1em] uppercase text-[#7B5EA7] mb-1.5">
                    Badge Colour
                  </label>
                  <select
                    value={editing.badge_color || 'rose'}
                    onChange={e => set('badge_color', e.target.value)}
                    className={INPUT_CLS}
                  >
                    <option value="rose">Rose / Pink</option>
                    <option value="green">Green</option>
                    <option value="mauve">Mauve / Purple</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editing.in_stock ?? true}
                    onChange={e => set('in_stock', e.target.checked)}
                    className="w-4 h-4 accent-[#E8609A]"
                  />
                  <span className="text-[0.85rem] text-[#5B2D8E]">In Stock</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editing.featured ?? false}
                    onChange={e => set('featured', e.target.checked)}
                    className="w-4 h-4 accent-[#E8609A]"
                  />
                  <span className="text-[0.85rem] text-[#5B2D8E]">Featured</span>
                </label>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 border border-[rgba(232,96,154,0.25)] text-[#7B5EA7] py-3
                  rounded-full text-[0.85rem] hover:bg-[#F0EBFF] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 bg-[#5B2D8E] text-white py-3 rounded-full text-[0.85rem]
                  font-medium flex items-center justify-center gap-2
                  hover:bg-[#E8609A] transition-colors disabled:opacity-60 active:scale-[0.97]"
              >
                <Save size={15} />
                {saving ? 'Saving…' : modal === 'new' ? 'Add Product' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ Delete Confirm ══════════ */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
          flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-4xl mb-4">🗑️</div>
            <h3 className="font-cormorant text-[1.4rem] text-[#5B2D8E] font-semibold mb-2">
              Delete this product?
            </h3>
            <p className="text-[0.85rem] text-[#7B5EA7] mb-6">
              This will remove it from the list. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-[rgba(232,96,154,0.25)] py-2.5
                  rounded-full text-[0.85rem] text-[#7B5EA7] hover:bg-[#F0EBFF] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                className="flex-1 bg-[#E8609A] text-white py-2.5 rounded-full
                  text-[0.85rem] font-medium hover:bg-[#D03878] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ Toast ══════════ */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80]
          bg-[#5B2D8E] text-white px-6 py-3 rounded-full text-[0.84rem]
          shadow-[0_10px_36px_rgba(91,45,142,0.25)] whitespace-nowrap
          animate-[fadeUp_0.4s_ease_forwards]">
          {toast}
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={
      <div className="p-8 flex items-center justify-center min-h-[40vh]">
        <div className="text-[#7B5EA7] text-[0.88rem]">Loading products…</div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
