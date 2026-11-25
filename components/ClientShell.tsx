'use client';
import { useState } from 'react'
import { CartProvider } from '@/lib/cart'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import Footer from '@/components/Footer'
import { usePathname } from 'next/navigation'
import CmsPreviewBridge from '@/components/CmsPreviewBridge'
import { ContentProvider } from '@/lib/content/provider'
import type { Overrides } from '@/lib/content/store'

export default function ClientShell({
  children,
  publishedContent = {},
}: {
  children: React.ReactNode;
  publishedContent?: Overrides;
}) {
  const [cartOpen, setCartOpen] = useState(false)
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <ContentProvider published={publishedContent} draft={{}}>
      <CartProvider>
        {!isAdmin && <Navbar onCartOpen={() => setCartOpen(true)} />}
        <main className="min-h-screen">{children}</main>
        {!isAdmin && <Footer />}
        {!isAdmin && <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />}
        {!isAdmin && <CmsPreviewBridge />}
      </CartProvider>
    </ContentProvider>
  )
}
