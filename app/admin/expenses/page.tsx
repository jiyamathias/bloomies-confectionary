'use client';
import { useMemo, useState } from 'react';
import { Plus, Download, Trash2 } from 'lucide-react';
import { useAdminData } from '@/lib/admin/store';
import {
  rangeFor, previousRange, ordersIn, expensesIn, kpis, pctChange, expensesByCategory, naira, toCsv, type RangeKey,
} from '@/lib/admin/analytics';
import { EXPENSE_CATEGORIES, type ExpenseCategory, type Expense } from '@/lib/admin/types';
import AdminHeader, { FilterRow, RangePicker, btn } from '@/components/admin/AdminHeader';
import { ChartCard, HBarChart, StatTile } from '@/components/admin/charts';
import { downloadFile } from '@/components/admin/ImportSheet';
import { Field, field } from '@/components/admin/Drawer';

const today = () => new Date().toISOString().slice(0, 10);

export default function ExpensesPage() {
  const { orders, expenses, addExpense, deleteExpense } = useAdminData();
  const [rangeKey, setRangeKey] = useState<RangeKey>('30d');
  const [form, setForm] = useState({ date: today(), category: 'Ingredients' as ExpenseCategory, description: '', amount: '', method: 'transfer' as Expense['paymentMethod'] });
  const [error, setError] = useState('');

  const v = useMemo(() => {
    const r = rangeFor(rangeKey); const p = previousRange(r);
    const exp = expensesIn(expenses, r);
    const k = kpis(ordersIn(orders, r), exp);
    const kp = kpis(ordersIn(orders, p), expensesIn(expenses, p));
    return { exp, k, kp, byCat: expensesByCategory(exp) };
  }, [orders, expenses, rangeKey]);

  // Month-by-month profit and loss: the core of the old spreadsheet.
  const months = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const from = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const to = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const r = { from, to, key: '12m' as RangeKey };
      const k = kpis(ordersIn(orders, r), expensesIn(expenses, r));
      return { label: from.toLocaleDateString('en-NG', { month: 'long', year: 'numeric' }), ...k };
    });
  }, [orders, expenses]);

  function save() {
    const amount = Number(form.amount);
    if (!form.description.trim()) return setError('Add a short description.');
    if (!amount || amount <= 0) return setError('Enter the amount spent.');
    addExpense({ date: new Date(`${form.date}T12:00`).toISOString(), category: form.category, description: form.description.trim(), amount, paymentMethod: form.method });
    setForm(f => ({ ...f, description: '', amount: '' })); setError('');
  }

  function exportCsv() {
    downloadFile(`bloomies-expenses-${today()}.csv`, toCsv(v.exp.map(e => ({
      Date: new Date(e.date).toLocaleDateString('en-GB'), Category: e.category, Description: e.description,
      Amount: e.amount, 'Paid by': e.paymentMethod,
    }))));
  }

  const margin = v.k.sales ? v.k.profit / v.k.sales : 0;

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto">
      <AdminHeader title="Expenses" subtitle="What the business spends, and what's left as profit."
        actions={<button className={btn.secondary} onClick={exportCsv}><Download size={15}/> Export CSV</button>}/>

      <FilterRow><RangePicker value={rangeKey} onChange={setRangeKey}/></FilterRow>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatTile label="Spent" value={naira(v.k.expenses, true)} delta={pctChange(v.k.expenses, v.kp.expenses)} goodWhenUp={false} sub="vs previous period"/>
        <StatTile label="Sales" value={naira(v.k.sales, true)} delta={pctChange(v.k.sales, v.kp.sales)} sub="vs previous period"/>
        <StatTile label="Profit" value={naira(v.k.profit, true)} delta={pctChange(v.k.profit, v.kp.profit)} sub="vs previous period"/>
        <StatTile label="Profit margin" value={`${Math.round(margin * 100)}%`} sub="of every ₦1 of sales"/>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        <section className="bg-white rounded-2xl border border-[#E6E0F3] p-5">
          <h2 className="text-[0.98rem] font-semibold text-[#2B2147] mb-4">Add an expense</h2>
          <div className="space-y-3">
            {error && <p role="alert" className="text-[0.8rem] text-[#B42318]">{error}</p>}
            <div className="grid grid-cols-2 gap-2">
              <Field label="Date"><input type="date" className={field} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}/></Field>
              <Field label="Amount (₦)"><input type="number" min={0} step={100} className={field} value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0"/></Field>
            </div>
            <Field label="Category">
              <select className={field} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ExpenseCategory }))}>
                {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="What was it for?"><input className={field} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. 2 bags of flour, eggs"/></Field>
            <Field label="Paid by">
              <select className={field} value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value as Expense['paymentMethod'] }))}>
                <option value="transfer">Bank transfer</option><option value="cash">Cash</option><option value="pos">POS</option>
              </select>
            </Field>
            <button onClick={save} className={`${btn.primary} w-full justify-center`}><Plus size={16}/> Save expense</button>
          </div>
        </section>

        <ChartCard className="lg:col-span-2" title="Where the money goes" subtitle={`${naira(v.k.expenses)} spent in this period`}
          table={{ columns: ['Category', 'Spent', 'Share'], rows: v.byCat.map(c => [c.label, naira(c.value), `${Math.round((c.value / (v.k.expenses || 1)) * 100)}%`]) }}>
          <HBarChart data={v.byCat} format={n => naira(n, true)} note={d => `${Math.round((d.value / (v.k.expenses || 1)) * 100)}%`}/>
        </ChartCard>
      </div>

      <section className="bg-white rounded-2xl border border-[#E6E0F3] p-5 mb-5">
        <h2 className="text-[0.98rem] font-semibold text-[#2B2147]">Profit and loss by month</h2>
        <p className="text-[0.8rem] text-[#5E5A7C] mb-3">Sales minus everything spent, month by month.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[0.83rem]">
            <thead className="text-[#5E5A7C] text-left">
              <tr>{['Month', 'Orders', 'Sales', 'Expenses', 'Profit', 'Margin'].map((h, i) => (
                <th key={h} className={`font-semibold py-2 px-3 ${i ? 'text-right' : ''}`}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {months.map(m => (
                <tr key={m.label} className="border-t border-[#F1EEF8]">
                  <td className="py-2 px-3 text-[#2B2147]">{m.label}</td>
                  <td className="py-2 px-3 text-right tabular-nums">{m.orders}</td>
                  <td className="py-2 px-3 text-right tabular-nums">{naira(m.sales)}</td>
                  <td className="py-2 px-3 text-right tabular-nums">{naira(m.expenses)}</td>
                  <td className={`py-2 px-3 text-right tabular-nums font-semibold ${m.profit < 0 ? 'text-[#B42318]' : 'text-[#2B2147]'}`}>{naira(m.profit)}</td>
                  <td className="py-2 px-3 text-right tabular-nums">{m.sales ? `${Math.round((m.profit / m.sales) * 100)}%` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-[#E6E0F3] overflow-hidden">
        <h2 className="text-[0.98rem] font-semibold text-[#2B2147] px-5 pt-5 pb-3">Expense log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[0.83rem]">
            <thead className="bg-[#FAF9FD] text-[#5E5A7C] text-left">
              <tr>{['Date', 'Category', 'Description', 'Paid by', 'Amount', ''].map((h, i) => (
                <th key={i} className={`font-semibold px-3 py-2.5 ${i === 4 ? 'text-right' : ''}`}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {v.exp.slice(0, 100).map(e => (
                <tr key={e.id} className="border-t border-[#F1EEF8]">
                  <td className="px-3 py-2.5 whitespace-nowrap text-[#5E5A7C]">{new Date(e.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{e.category}</td>
                  <td className="px-3 py-2.5 text-[#2B2147]">{e.description}</td>
                  <td className="px-3 py-2.5 capitalize">{e.paymentMethod === 'pos' ? 'POS' : e.paymentMethod}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-[#2B2147]">{naira(e.amount)}</td>
                  <td className="px-3 py-2.5 text-right">
                    <button onClick={() => deleteExpense(e.id)} aria-label={`Delete ${e.description}`} className="text-[#8A86A6] hover:text-[#B42318]"><Trash2 size={15}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {v.exp.length === 0 && <p className="text-center text-[0.88rem] text-[#5E5A7C] py-8">No expenses in this period.</p>}
      </section>
    </div>
  );
}
