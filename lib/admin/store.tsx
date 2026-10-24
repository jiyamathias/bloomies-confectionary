'use client';
// Admin data for the preview. Holds sample orders/expenses in memory (they reset on refresh).
// When the Neon backend is built, these functions become server actions / API calls with the same shapes.
import { createContext, useContext, useMemo, useState, useCallback, type ReactNode } from 'react';
import { generateSampleData } from '@/lib/admin/sample-data';
import type { Order, Expense } from '@/lib/admin/types';

interface AdminData {
  orders: Order[];
  expenses: Expense[];
  addOrder: (o: Omit<Order, 'id' | 'orderNumber'>) => Order;
  addOrders: (o: Omit<Order, 'id' | 'orderNumber'>[]) => number;
  updateOrder: (id: string, patch: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  addExpense: (e: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
}

const Ctx = createContext<AdminData | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(() => generateSampleData(), []);
  const [orders, setOrders] = useState<Order[]>(initial.orders);
  const [expenses, setExpenses] = useState<Expense[]>(initial.expenses);

  const nextNumber = useCallback((list: Order[]) => {
    const max = list.reduce((m, o) => Math.max(m, Number(o.orderNumber.replace(/\D/g, '')) || 0), 1000);
    return max + 1;
  }, []);

  const addOrders = useCallback((input: Omit<Order, 'id' | 'orderNumber'>[]) => {
    setOrders(prev => {
      let n = nextNumber(prev);
      const created = input.map(o => ({ ...o, id: `ord_${n}`, orderNumber: `BLM-${n++}` }));
      return [...created, ...prev].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    });
    return input.length;
  }, [nextNumber]);

  const addOrder = useCallback((o: Omit<Order, 'id' | 'orderNumber'>) => {
    const n = nextNumber(orders);
    const created = { ...o, id: `ord_${n}`, orderNumber: `BLM-${n}` };
    setOrders(prev => [created, ...prev].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    return created;
  }, [orders, nextNumber]);

  const updateOrder = useCallback((id: string, patch: Partial<Order>) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, ...patch } : o)));
  }, []);
  const deleteOrder = useCallback((id: string) => setOrders(prev => prev.filter(o => o.id !== id)), []);

  const addExpense = useCallback((e: Omit<Expense, 'id'>) => {
    setExpenses(prev => [{ ...e, id: `exp_${Date.now()}` }, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
  }, []);
  const deleteExpense = useCallback((id: string) => setExpenses(prev => prev.filter(e => e.id !== id)), []);

  return (
    <Ctx.Provider value={{ orders, expenses, addOrder, addOrders, updateOrder, deleteOrder, addExpense, deleteExpense }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAdminData must be used inside AdminDataProvider');
  return ctx;
}
