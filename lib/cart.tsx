'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { CartItem } from '@/types';

interface CartCtx {
  items: CartItem[];
  count: number;
  add: (item: Omit<CartItem, 'qty'>) => void;
  remove: (id: string) => void;
  changeQty: (id: string, delta: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = useCallback((item: Omit<CartItem, 'qty'>) => {
    setItems(prev => {
      const ex = prev.find(i => i.id === item.id);
      if (ex) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const changeQty = useCallback((id: string, delta: number) => {
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, count, add, remove, changeQty, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}

export function buildWhatsAppMessage(items: CartItem[], name: string, phone: string): string {
  const lines = items.map(i => `• ${i.name} ×${i.qty} (${i.price})`).join('\n');
  return `🌸 *New Order — Bloomies Website*\n\n👤 Name: ${name}\n📱 Phone: ${phone}\n\n🛒 *Order:*\n${lines}\n\nKindly confirm availability and total. Thank you!`;
}

export function buildBuilderMessage(s: {
  size: string; layers: string; flavours: string[]; style: string;
  colour: string; toppings: string[]; occasion: string; gender: string;
  message: string; notes: string;
}): string {
  return `🌸 *Bloomies — Cake Builder Order*\n\n` +
    `📏 Size: ${s.size}\n` +
    `🎂 Layers: ${s.layers}\n` +
    `🍰 Flavours: ${s.flavours.join(', ') || 'Not selected'}\n` +
    `✨ Design: ${s.style}\n` +
    `🎨 Colour: ${s.colour}\n` +
    `🎀 Toppings: ${s.toppings.join(', ') || 'None'}\n` +
    `🎉 Occasion: ${s.occasion}\n` +
    `👤 Receiver: ${s.gender || 'Not specified'}\n` +
    `📝 Message on cake: ${s.message || 'None'}\n` +
    `💬 Extra notes: ${s.notes || 'None'}\n\n` +
    `Please advise on pricing and availability. Thank you!`;
}
