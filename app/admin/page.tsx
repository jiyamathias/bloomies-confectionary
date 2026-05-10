import Link from 'next/link';
import { Package, ShoppingBag, Star, AlertCircle, PlusCircle, Eye, Image as ImageIcon } from 'lucide-react';
import { PRODUCTS } from '@/lib/products';

export default function AdminDashboard() {
  const total    = PRODUCTS.length;
  const inStock  = PRODUCTS.filter(p => p.in_stock).length;
  const outStock = total - inStock;
  const featured = PRODUCTS.filter(p => p.featured).length;

  const stats = [
    { label: 'Total Products', value: total,    icon: <Package size={20} />,      color: 'bg-[#E1D7F0]/40 text-[#A58CF4]'   },
    { label: 'In Stock',       value: inStock,  icon: <ShoppingBag size={20} />,  color: 'bg-[#D4F0D4]/40 text-[#3A7A3A]'   },
    { label: 'Out of Stock',   value: outStock, icon: <AlertCircle size={20} />,  color: 'bg-amber-50 text-amber-600'        },
    { label: 'Featured',       value: featured, icon: <Star size={20} />,          color: 'bg-[#A58CF4]/40 text-[#7B52AB]'   },
  ];

  const CATS = [
    { id: 'one-layer',    label: 'One-Layer Cakes'      },
    { id: 'bigger-cakes', label: 'Custom Design Cakes'  },
    { id: 'pastries',     label: 'Pastries'              },
    { id: 'small-chops',  label: 'Small Chops'           },
    { id: 'daily-treats', label: 'Daily Treats'          },
    { id: 'events',       label: 'Events'                },
  ];

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-cormorant text-[2rem] font-semibold text-[#433075]">Dashboard</h1>
        <p className="text-[0.85rem] text-[#6E6A8C] mt-1">Welcome back. Here's your store overview.</p>
      </div>

      {/* Demo notice */}
      <div className="bg-[#EAE0FF]/40 border border-[#A58CF4] rounded-xl px-5 py-4 mb-8 flex gap-3 items-start">
        <span className="text-[#A58CF4] mt-0.5 shrink-0">ℹ️</span>
        <div>
          <p className="text-[0.85rem] font-medium text-[#433075]">Static Preview Mode</p>
          <p className="text-[0.78rem] text-[#6E6A8C] mt-0.5">
            Changes you make here are local to your browser session.
            Supabase integration will be added after client approval to make everything persistent.
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#A58CF4]/30 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              {s.icon}
            </div>
            <div className="font-cormorant text-[2.2rem] font-semibold text-[#433075] leading-none mb-1">
              {s.value}
            </div>
            <div className="text-[0.75rem] text-[#6E6A8C]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link href="/admin/products"
          className="bg-[#433075] text-white rounded-2xl p-6 hover:bg-[#6B3D9E] transition-colors group">
          <Package size={24} className="mb-3 opacity-70 group-hover:opacity-100 transition-opacity" />
          <h3 className="font-cormorant text-[1.3rem] font-semibold mb-1">Manage Products</h3>
          <p className="text-white/55 text-[0.8rem]">
            Add, edit or remove products and toggle their stock status.
          </p>
        </Link>

        <Link href="/admin/products?action=new"
          className="bg-white border border-[#A58CF4]/60 rounded-2xl p-6
            hover:border-[#A58CF4] hover:shadow-[0_8px_24px_rgba(165,140,244,0.12)] transition-all group">
          <PlusCircle size={24} className="mb-3 text-[#A58CF4] opacity-70 group-hover:opacity-100 transition-opacity" />
          <h3 className="font-cormorant text-[1.3rem] font-semibold text-[#433075] mb-1">Add New Product</h3>
          <p className="text-[#6E6A8C] text-[0.8rem]">Create a new product listing for the website.</p>
        </Link>

        <Link href="/admin/gallery"
          className="bg-white border border-[#A58CF4]/60 rounded-2xl p-6
            hover:border-[#A58CF4] hover:shadow-[0_8px_24px_rgba(165,140,244,0.12)] transition-all group">
          <ImageIcon size={24} className="mb-3 text-[#A58CF4] opacity-70 group-hover:opacity-100 transition-opacity" />
          <h3 className="font-cormorant text-[1.3rem] font-semibold text-[#433075] mb-1">Gallery Manager</h3>
          <p className="text-[#6E6A8C] text-[0.8rem]">Upload and manage cakes shown in the public gallery.</p>
        </Link>

        <Link href="/admin/best-sellers"
          className="bg-white border border-[#A58CF4]/60 rounded-2xl p-6
            hover:border-[#A58CF4] hover:shadow-[0_8px_24px_rgba(155,111,186,0.12)] transition-all group">
          <Star size={24} className="mb-3 text-[#A58CF4] opacity-70 group-hover:opacity-100 transition-opacity" />
          <h3 className="font-cormorant text-[1.3rem] font-semibold text-[#433075] mb-1">Best Sellers</h3>
          <p className="text-[#6E6A8C] text-[0.8rem]">Edit the section title and choose which products are featured as Best Sellers on the home page.</p>
        </Link>

        <Link href="/" target="_blank"
          className="bg-white border border-[#A58CF4]/60 rounded-2xl p-6
            hover:border-[#A58CF4] hover:shadow-[0_8px_24px_rgba(165,140,244,0.12)] transition-all group">
          <Eye size={24} className="mb-3 text-[#6E6A8C] opacity-70 group-hover:text-[#A58CF4] group-hover:opacity-100 transition-all" />
          <h3 className="font-cormorant text-[1.3rem] font-semibold text-[#433075] mb-1">View Live Website</h3>
          <p className="text-[#6E6A8C] text-[0.8rem]">See exactly what your customers see when they visit Bloomies.</p>
        </Link>
      </div>

      {/* Products by category */}
      <div className="bg-white rounded-2xl border border-[#A58CF4]/30 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#A58CF4]/20 flex items-center justify-between">
          <h2 className="font-cormorant text-[1.2rem] font-semibold text-[#433075]">Products by Category</h2>
          <Link href="/admin/products" className="text-[0.78rem] text-[#A58CF4] hover:underline">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-[#A58CF4]/15">
          {CATS.map(cat => {
            const count = PRODUCTS.filter(p => p.category === cat.id).length;
            const oos   = PRODUCTS.filter(p => p.category === cat.id && !p.in_stock).length;
            return (
              <Link key={cat.id} href={`/admin/products?category=${cat.id}`}
                className="flex items-center justify-between px-6 py-4
                  hover:bg-[#FAFAFA] transition-colors">
                <span className="text-[0.88rem] text-[#433075]">{cat.label}</span>
                <div className="flex items-center gap-3">
                  {oos > 0 && (
                    <span className="text-[0.72rem] bg-amber-50 text-amber-600
                      px-2.5 py-1 rounded-full font-medium">
                      {oos} out of stock
                    </span>
                  )}
                  <span className="text-[0.82rem] text-[#6E6A8C]">{count} items</span>
                  <span className="text-[#6E6A8C]/40 text-lg">›</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
