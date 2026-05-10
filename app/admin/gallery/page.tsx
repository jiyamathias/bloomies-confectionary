'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Upload, Trash2, X } from 'lucide-react';
import { GALLERY } from '@/lib/products';
import type { GalleryItem } from '@/types';

const CATEGORIES = ['One Layer', 'Bigger Cake', 'Custom Cake'];

export default function GalleryAdminPage() {
  const [items, setItems]     = useState<GalleryItem[]>([...GALLERY]);
  const [modal, setModal]     = useState(false);
  const [toast, setToast]     = useState('');
  const [delId, setDelId]     = useState<string | null>(null);
  const [form, setForm]       = useState({ title: '', category: 'One Layer', image: '' });

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  }

  function addItem() {
    if (!form.title.trim() || !form.image.trim()) { flash('Please fill in all fields'); return; }
    const newItem: GalleryItem = { id: `gallery-${Date.now()}`, ...form };
    setItems(prev => [newItem, ...prev]);
    setModal(false);
    setForm({ title: '', category: 'One Layer', image: '' });
    flash('Cake added to gallery ✓');
  }

  function remove(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
    setDelId(null);
    flash('Removed from gallery');
  }

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cormorant text-[2rem] font-semibold text-[#433075]">Gallery Manager</h1>
          <p className="text-[#6E6A8C] text-[0.85rem] mt-1">Manage cakes displayed in the public gallery.</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-[#433075] text-white px-6 py-3 rounded-full
            text-[0.85rem] font-semibold hover:bg-[#6E6A8C] transition-all duration-250">
          <Upload size={16} /> Upload Cake
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id}
            className="group relative rounded-2xl overflow-hidden border border-[rgba(165,140,244,0.2)] bg-white">
            <div className="relative" style={{ paddingBottom: '110%' }}>
              <Image src={item.image} alt={item.title} fill
                className="object-cover" sizes="25vw" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300
                flex items-center justify-center">
                <button
                  onClick={() => setDelId(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-250
                    bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="font-cormorant text-[1rem] font-semibold text-[#433075] leading-tight mb-0.5">{item.title}</p>
              <p className="text-[0.68rem] text-[#6E6A8C]">{item.category}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upload modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-cormorant text-[1.5rem] font-semibold text-[#433075]">Upload Cake to Gallery</h2>
              <button onClick={() => setModal(false)}
                className="w-8 h-8 rounded-full border border-[rgba(165,140,244,0.3)] flex items-center justify-center
                  text-[#6E6A8C] hover:border-[#A58CF4] transition-all">
                <X size={15} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[0.78rem] font-medium text-[#433075] mb-1.5 block">Cake Name</label>
                <input
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(165,140,244,0.4)]
                    text-[0.85rem] text-[#433075] bg-white focus:border-[#A58CF4] focus:outline-none transition-colors"
                  placeholder="e.g. Drip Chocolate Cake"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-[0.78rem] font-medium text-[#433075] mb-1.5 block">Category</label>
                <select
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(165,140,244,0.4)]
                    text-[0.85rem] text-[#433075] bg-white focus:border-[#A58CF4] focus:outline-none transition-colors"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[0.78rem] font-medium text-[#433075] mb-1.5 block">Image Path <span className="text-[#6E6A8C] font-normal">(e.g. /images/cake-drip.jpg)</span></label>
                <input
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(165,140,244,0.4)]
                    text-[0.85rem] text-[#433075] bg-white focus:border-[#A58CF4] focus:outline-none transition-colors"
                  placeholder="/images/your-cake.jpg"
                  value={form.image}
                  onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(false)}
                className="flex-1 py-3 border border-[rgba(165,140,244,0.4)] text-[#6E6A8C]
                  rounded-full text-[0.85rem] hover:bg-[#F3F0FA] transition-all">
                Cancel
              </button>
              <button onClick={addItem}
                className="flex-1 py-3 bg-[#433075] text-white rounded-full text-[0.85rem] font-semibold
                  hover:bg-[#6E6A8C] transition-all">
                Add to Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {delId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            <h3 className="font-cormorant text-[1.4rem] font-semibold text-[#433075] mb-2">Remove from gallery?</h3>
            <p className="text-[0.85rem] text-[#6E6A8C] mb-6">This will remove the cake from the public gallery.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)}
                className="flex-1 py-3 border border-[rgba(165,140,244,0.3)] text-[#6E6A8C]
                  rounded-full text-[0.85rem] hover:bg-[#F3F0FA] transition-all">
                Cancel
              </button>
              <button onClick={() => remove(delId)}
                className="flex-1 py-3 bg-red-500 text-white rounded-full text-[0.85rem] font-semibold
                  hover:bg-red-600 transition-all">
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80]
          bg-[#433075] text-white px-6 py-3 rounded-full text-[0.85rem] font-medium shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}
