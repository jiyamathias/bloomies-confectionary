import Link from 'next/link';
import { Package, ShoppingBag, Star, AlertCircle, PlusCircle, Eye } from 'lucide-react';
import { PRODUCTS } from '@/lib/products';

export default function AdminDashboard() {
  const total    = PRODUCTS.length;
  const inStock  = PRODUCTS.filter(p => p.in_stock).length;
  const outStock = total - inStock;
  const featured = PRODUCTS.filter(p => p.featured).length;

  const stats = [
    { label: 'Total Products', value: total,    icon: <Package size={20} />,      color: 'bg-[#E8DAFF]/40 text-[#E8609A]'   },
    { label: 'In Stock',       value: inStock,  icon: <ShoppingBag size={20} />,  color: 'bg-[#D4F0D4]/40 text-[#3A7A3A]'   },
    { label: 'Out of Stock',   value: outStock, icon: <AlertCircle size={20} />,  color: 'bg-amber-50 text-amber-600'        },
    { label: 'Featured',       value: featured, icon: <Star size={20} />,          color: 'bg-[#C5B0E8]/40 text-[#7B52AB]'   },
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
        <h1 className="font-cormorant text-[2rem] font-semibold text-[#5B2D8E]">Dashboard</h1>
        <p className="text-[0.85rem] text-[#7B5EA7] mt-1">Welcome back. Here's your store overview.</p>
      </div>

      {/* Demo notice */}
      <div className="bg-[#EAE0FF]/40 border border-[#C5B0E8] rounded-xl px-5 py-4 mb-8 flex gap-3 items-start">
        <span className="text-[#9B7EC8] mt-0.5 shrink-0">ℹ️</span>
        <div>
          <p className="text-[0.85rem] font-medium text-[#5B2D8E]">Static Preview Mode</p>
          <p className="text-[0.78rem] text-[#7B5EA7] mt-0.5">
            Changes you make here are local to your browser session.
            Supabase integration will be added after client approval to make everything persistent.
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#C5B0E8]/30 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              {s.icon}
            </div>
            <div className="font-cormorant text-[2.2rem] font-semibold text-[#5B2D8E] leading-none mb-1">
              {s.value}
            </div>
            <div className="text-[0.75rem] text-[#7B5EA7]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link href="/admin/products"
          className="bg-[#5B2D8E] text-white rounded-2xl p-6 hover:bg-[#6B3D9E] transition-colors group">
          <Package size={24} className="mb-3 opacity-70 group-hover:opacity-100 transition-opacity" />
          <h3 className="font-cormorant text-[1.3rem] font-semibold mb-1">Manage Products</h3>
          <p className="text-white/55 text-[0.8rem]">
            Add, edit or remove products and toggle their stock status.
          </p>
        </Link>

        <Link href="/admin/products?action=new"
          className="bg-white border border-[#C5B0E8]/60 rounded-2xl p-6
            hover:border-[#E8609A] hover:shadow-[0_8px_24px_rgba(232,96,154,0.12)] transition-all group">
          <PlusCircle size={24} className="mb-3 text-[#E8609A] opacity-70 group-hover:opacity-100 transition-opacity" />
          <h3 className="font-cormorant text-[1.3rem] font-semibold text-[#5B2D8E] mb-1">Add New Product</h3>
          <p className="text-[#7B5EA7] text-[0.8rem]">Create a new product listing for the website.</p>
        </Link>

        <Link href="/admin/best-sellers"
          className="bg-white border border-[#C5B0E8]/60 rounded-2xl p-6
            hover:border-[#9B7EC8] hover:shadow-[0_8px_24px_rgba(155,111,186,0.12)] transition-all group">
          <Star size={24} className="mb-3 text-[#9B7EC8] opacity-70 group-hover:opacity-100 transition-opacity" />
          <h3 className="font-cormorant text-[1.3rem] font-semibold text-[#5B2D8E] mb-1">Best Sellers</h3>
          <p className="text-[#7B5EA7] text-[0.8rem]">Edit the section title and choose which products are featured as Best Sellers on the home page.</p>
        </Link>

        <Link href="/" target="_blank"
          className="bg-white border border-[#C5B0E8]/60 rounded-2xl p-6
            hover:border-[#E8609A] hover:shadow-[0_8px_24px_rgba(232,96,154,0.12)] transition-all group">
          <Eye size={24} className="mb-3 text-[#7B5EA7] opacity-70 group-hover:text-[#E8609A] group-hover:opacity-100 transition-all" />
          <h3 className="font-cormorant text-[1.3rem] font-semibold text-[#5B2D8E] mb-1">View Live Website</h3>
          <p className="text-[#7B5EA7] text-[0.8rem]">See exactly what your customers see when they visit Bloomies.</p>
        </Link>
      </div>

      {/* Products by category */}
      <div className="bg-white rounded-2xl border border-[#C5B0E8]/30 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#C5B0E8]/20 flex items-center justify-between">
          <h2 className="font-cormorant text-[1.2rem] font-semibold text-[#5B2D8E]">Products by Category</h2>
          <Link href="/admin/products" className="text-[0.78rem] text-[#E8609A] hover:underline">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-[#C5B0E8]/15">
          {CATS.map(cat => {
            const count = PRODUCTS.filter(p => p.category === cat.id).length;
            const oos   = PRODUCTS.filter(p => p.category === cat.id && !p.in_stock).length;
            return (
              <Link key={cat.id} href={`/admin/products?category=${cat.id}`}
                className="flex items-center justify-between px-6 py-4
                  hover:bg-[#FAFAFE] transition-colors">
                <span className="text-[0.88rem] text-[#5B2D8E]">{cat.label}</span>
                <div className="flex items-center gap-3">
                  {oos > 0 && (
                    <span className="text-[0.72rem] bg-amber-50 text-amber-600
                      px-2.5 py-1 rounded-full font-medium">
                      {oos} out of stock
                    </span>
                  )}
                  <span className="text-[0.82rem] text-[#7B5EA7]">{count} items</span>
                  <span className="text-[#7B5EA7]/40 text-lg">›</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
