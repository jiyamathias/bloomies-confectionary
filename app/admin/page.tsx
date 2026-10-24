'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Lightbulb, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAdminData } from '@/lib/admin/store';
import {
  RANGE_LABEL, rangeFor, previousRange, ordersIn, expensesIn, kpis, pctChange, salesSeries,
  ordersByHour, peakWindow, weekHourGrid, ordersByWeekday, salesByCategory, salesByChannel,
  salesByPayment, salesByFulfilment, topProducts, outstanding, upcoming, insights, naira, hourLabel,
  type RangeKey,
} from '@/lib/admin/analytics';
import { balanceOf, CHANNEL_LABEL, STATUS_LABEL, type Channel } from '@/lib/admin/types';
import { AreaChart, ChartCard, ColumnChart, HBarChart, Heatmap, StatTile } from '@/components/admin/charts';
import AdminHeader, { FilterRow, RangePicker, Select } from '@/components/admin/AdminHeader';

const pct = (n: number) => `${Math.round(n * 100)}%`;

export default function AdminOverview() {
  const { orders, expenses } = useAdminData();
  const [rangeKey, setRangeKey] = useState<RangeKey>('30d');
  const [channel, setChannel] = useState<Channel | 'all'>('all');

  const v = useMemo(() => {
    const now = new Date();
    const range = rangeFor(rangeKey, now);
    const prev = previousRange(range);
    const cur = ordersIn(orders, range, channel);
    const before = ordersIn(orders, prev, channel);
    const exp = channel === 'all' ? expensesIn(expenses, range) : [];
    const expPrev = channel === 'all' ? expensesIn(expenses, prev) : [];
    const byHour = ordersByHour(cur);
    return {
      range, cur,
      k: kpis(cur, exp), kp: kpis(before, expPrev),
      series: salesSeries(cur, range),
      byHour, peak: peakWindow(byHour),
      grid: weekHourGrid(cur),
      weekdays: ordersByWeekday(cur),
      categories: salesByCategory(cur),
      channels: salesByChannel(cur),
      payments: salesByPayment(cur),
      fulfilment: salesByFulfilment(cur),
      top: topProducts(cur),
      due: upcoming(orders, now).slice(0, 8),
      owed: outstanding(orders).slice(0, 8),
      notes: insights(cur, before, orders, now),
    };
  }, [orders, expenses, rangeKey, channel]);

  const { k, kp, peak } = v;
  const vsLabel = rangeKey === 'today' ? 'vs yesterday' : 'vs previous period';
  const hourCols = v.byHour.map(h => h.label);
  const busiestDay = [...v.weekdays].sort((a, b) => b.value - a.value)[0];

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto">
      <AdminHeader title="Overview" subtitle="How Bloomies is doing, at a glance."/>

      <FilterRow>
        <RangePicker value={rangeKey} onChange={setRangeKey}/>
        <Select label="Channel" value={channel} onChange={v => setChannel(v as Channel | 'all')}
          options={[['all', 'All channels'], ...Object.entries(CHANNEL_LABEL)]}/>
      </FilterRow>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatTile hero className="col-span-2 lg:col-span-1" label={`Sales · ${RANGE_LABEL[rangeKey].toLowerCase()}`} value={naira(k.sales, true)}
          delta={pctChange(k.sales, kp.sales)} sub={vsLabel}/>
        <StatTile label="Orders" value={k.orders.toLocaleString()} delta={pctChange(k.orders, kp.orders)}
          sub={k.cancelled ? `${k.cancelled} cancelled` : vsLabel}/>
        <StatTile label="Average order" value={naira(k.avgOrder)} delta={pctChange(k.avgOrder, kp.avgOrder)} sub={vsLabel}/>
        {channel === 'all' ? (
          <StatTile className="col-span-2 lg:col-span-1" label="Profit (sales − expenses)" value={naira(k.profit, true)} delta={pctChange(k.profit, kp.profit)}
            sub={k.sales ? `${pct(k.profit / k.sales)} margin` : undefined}/>
        ) : (
          <StatTile className="col-span-2 lg:col-span-1" label="Collected so far" value={naira(k.collected, true)}
            sub={k.sales ? `${pct(k.collected / k.sales)} of sales` : undefined}/>
        )}
      </div>

      {/* Trend + insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <ChartCard className="lg:col-span-2" title="Sales over time"
          subtitle={`${naira(k.sales)} from ${k.orders} orders`}
          table={{ columns: ['Period', 'Orders', 'Sales'], rows: v.series.map(p => [p.full, p.orders, naira(p.value)]) }}>
          <AreaChart data={v.series} format={n => naira(n)}/>
        </ChartCard>

        <section className="bg-[#433075] text-white rounded-2xl p-5">
          <h2 className="flex items-center gap-2 text-[0.98rem] font-semibold mb-3">
            <Lightbulb size={17} className="text-[#E2BBFA]"/> What the numbers say
          </h2>
          <ul className="space-y-3">
            {v.notes.length ? v.notes.map(n => (
              <li key={n} className="text-[0.86rem] leading-relaxed text-white/90 pl-3 border-l-2 border-[#E2BBFA]/60">{n}</li>
            )) : <li className="text-[0.86rem] text-white/80">Not enough orders in this period yet.</li>}
          </ul>
        </section>
      </div>

      {/* When orders come in */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <ChartCard className="lg:col-span-2" title="Busiest hours"
          subtitle={peak.share ? <>Most orders come in <strong className="text-[#2B2147]">{peak.label}</strong> ({pct(peak.share)} of orders)</> : 'No orders in this period'}
          table={{ columns: ['Hour', 'Orders'], rows: v.byHour.map(h => [`${h.label} – ${hourLabel(h.hour + 1)}`, h.value]) }}>
          <ColumnChart
            data={v.byHour.map(h => ({ label: h.label, value: h.value, full: `${h.label} – ${hourLabel(h.hour + 1)}` }))}
            emphasis={i => v.byHour[i].hour >= peak.start && v.byHour[i].hour < peak.end}
            format={n => `${n} orders`}/>
          <p className="flex items-center gap-2 text-[0.75rem] text-[#5E5A7C] mt-2">
            <span className="inline-block w-3 h-3 rounded-[3px] bg-[#433075]"/> Peak window
            <span className="inline-block w-3 h-3 rounded-[3px] bg-[#D5D0E4] ml-2"/> Other hours
          </p>
        </ChartCard>
        <ChartCard title="Busiest days"
          subtitle={busiestDay?.value ? <><strong className="text-[#2B2147]">{busiestDay.label}</strong> is the busiest day</> : undefined}
          table={{ columns: ['Day', 'Orders', 'Sales'], rows: v.weekdays.map(d => [d.label, d.value, naira(d.sales)]) }}>
          <ColumnChart data={v.weekdays.map(d => ({ label: d.label, value: d.value }))}
            emphasis={i => v.weekdays[i].label === busiestDay?.label} format={n => `${n} orders`}/>
        </ChartCard>
      </div>

      <ChartCard className="mb-5" title="Orders by day and hour"
        subtitle="Darker squares mean more orders. Use this to plan staff and baking times."
        table={{ columns: ['Day', ...hourCols], rows: v.grid.map((r, i) => [['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i], ...r]) }}>
        <Heatmap grid={v.grid} rowLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} colLabels={hourCols}/>
      </ChartCard>

      {/* What sells, and where */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <ChartCard title="Sales by category"
          table={{ columns: ['Category', 'Sales'], rows: v.categories.map(c => [c.label, naira(c.value)]) }}>
          <HBarChart data={v.categories} format={n => naira(n, true)}/>
        </ChartCard>
        <ChartCard title="Where orders come from"
          table={{ columns: ['Channel', 'Orders', 'Sales', 'Share'], rows: v.channels.map(c => [c.label, c.orders, naira(c.value), pct(c.share)]) }}>
          <HBarChart data={v.channels} format={n => naira(n, true)} note={d => pct(d.share ?? 0)}/>
        </ChartCard>
        <ChartCard title="How customers pay"
          table={{ columns: ['Method', 'Orders', 'Sales', 'Share'], rows: v.payments.map(c => [c.label, c.orders, naira(c.value), pct(c.share)]) }}>
          <HBarChart data={v.payments} format={n => naira(n, true)} note={d => pct(d.share ?? 0)}/>
          <div className="mt-5 pt-4 border-t border-[#ECE8F4] grid grid-cols-2 gap-3">
            {v.fulfilment.map(f => (
              <div key={f.key}>
                <p className="text-[0.75rem] text-[#5E5A7C]">{f.label}</p>
                <p className="text-[1.1rem] font-semibold text-[#2B2147]">{pct(f.orders / Math.max(k.orders, 1))}</p>
                <p className="text-[0.72rem] text-[#5E5A7C]">{f.orders} orders</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Top products */}
      <ChartCard className="mb-5" title="Best-selling products" subtitle="Ranked by sales in this period">
        <div className="overflow-x-auto">
          <table className="w-full text-[0.85rem]">
            <thead>
              <tr className="text-[#5E5A7C] text-left">
                <th className="font-semibold py-2 pr-3">Product</th>
                <th className="font-semibold py-2 px-3 text-right">Units</th>
                <th className="font-semibold py-2 px-3 text-right">Orders</th>
                <th className="font-semibold py-2 pl-3 text-right">Sales</th>
                <th className="py-2 pl-4 w-[30%] hidden sm:table-cell"><span className="sr-only">Share</span></th>
              </tr>
            </thead>
            <tbody>
              {v.top.map(p => (
                <tr key={p.name} className="border-t border-[#F1EEF8]">
                  <td className="py-2.5 pr-3 text-[#2B2147] font-medium">{p.name}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{p.units}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{p.orders}</td>
                  <td className="py-2.5 pl-3 text-right tabular-nums font-semibold text-[#2B2147]">{naira(p.sales)}</td>
                  <td className="py-2.5 pl-4 hidden sm:table-cell">
                    <div className="h-2 rounded-r-[4px] bg-[#433075]" style={{ width: `${(p.sales / (v.top[0]?.sales || 1)) * 100}%` }}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* Day-to-day */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <OrderList title="Due in the next 7 days" icon={<Clock size={16}/>} empty="Nothing due this week."
          rows={v.due.map(o => ({
            id: o.id, primary: `${o.customerName} · ${o.items.map(i => i.name).join(', ')}`,
            secondary: `${o.orderNumber} · ${STATUS_LABEL[o.status]} · ${o.fulfilment === 'delivery' ? 'Delivery' : 'Pickup'}`,
            right: dueLabel(o.dueAt), alert: new Date(o.dueAt) < new Date(),
          }))}/>
        <OrderList title="Money owed" icon={<AlertCircle size={16}/>} empty="Every order is fully paid."
          rows={v.owed.map(o => ({
            id: o.id, primary: `${o.customerName} · ${naira(balanceOf(o))} left to pay`,
            secondary: `${o.orderNumber} · paid ${naira(o.amountPaid)} of ${naira(o.total)}`,
            right: dueLabel(o.dueAt), alert: new Date(o.dueAt) < new Date(),
          }))}/>
      </div>
    </div>
  );
}

function dueLabel(iso: string) {
  const d = new Date(iso); const now = new Date();
  const days = Math.round((new Date(d.toDateString()).getTime() - new Date(now.toDateString()).getTime()) / 86400000);
  const time = d.toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' });
  if (days === 0) return `Today ${time}`;
  if (days === 1) return `Tomorrow ${time}`;
  if (days < 0) return `${-days}d overdue`;
  return d.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short' });
}

function OrderList({ title, icon, rows, empty }: {
  title: string; icon: React.ReactNode; empty: string;
  rows: { id: string; primary: string; secondary: string; right: string; alert?: boolean }[];
}) {
  return (
    <section className="bg-white rounded-2xl border border-[#E6E0F3] p-4 sm:p-5 min-w-0">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="flex items-center gap-2 text-[0.98rem] font-semibold text-[#2B2147]">{icon} {title}</h2>
        <Link href="/admin/sales" className="text-[0.82rem] text-[#433075] font-medium inline-flex items-center gap-1 py-2 -my-2 hover:underline shrink-0">
          Sales log <ArrowRight size={13}/>
        </Link>
      </div>
      {rows.length ? (
        <ul className="divide-y divide-[#F1EEF8]">
          {rows.map(r => (
            <li key={r.id} className="py-2.5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[0.85rem] text-[#2B2147] font-medium truncate">{r.primary}</p>
                <p className="text-[0.75rem] text-[#5E5A7C] truncate">{r.secondary}</p>
              </div>
              <span className={`text-[0.75rem] font-semibold shrink-0 ${r.alert ? 'text-[#B42318]' : 'text-[#433075]'}`}>{r.right}</span>
            </li>
          ))}
        </ul>
      ) : <p className="text-[0.85rem] text-[#5E5A7C]">{empty}</p>}
    </section>
  );
}
