'use client';
import { useState } from 'react'
import { CartProvider } from '@/lib/cart'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import Footer from '@/components/Footer'
import { usePathname } from 'next/navigation'

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <CartProvider>
      {!isAdmin && <Navbar onCartOpen={() => setCartOpen(true)} />}
      <main className="min-h-screen">{children}</main>
      {!isAdmin && <Footer />}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </CartProvider>
  )
}
