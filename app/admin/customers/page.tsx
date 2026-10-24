'use client';
import { useMemo, useState } from 'react';
import { Search, Download, MessageCircle } from 'lucide-react';
import { useAdminData } from '@/lib/admin/store';
import { customers as summarise, naira, toCsv } from '@/lib/admin/analytics';
import { CHANNEL_LABEL } from '@/lib/admin/types';
import AdminHeader, { FilterRow, Select, btn } from '@/components/admin/AdminHeader';
import { StatTile } from '@/components/admin/charts';
import { downloadFile } from '@/components/admin/ImportSheet';

const DAY = 86_400_000;
const daysAgo = (iso: string) => Math.floor((Date.now() - new Date(iso).getTime()) / DAY);
const ago = (iso: string) => { const d = daysAgo(iso); return d === 0 ? 'Today' : d === 1 ? 'Yesterday' : `${d} days ago`; };

type Sort = 'spent' | 'orders' | 'recent';
type Segment = 'all' | 'regular' | 'new' | 'lapsed';

const waLink = (phone: string, name: string) => {
  const intl = phone.replace(/^0/, '234');
  // Opens WhatsApp with a draft; the owner can edit it (e.g. add an offer) before sending.
  const msg = `Hi ${name.split(' ')[0]}, it's Bloomies! It's been a while 💜 Fancy something sweet this week? Just reply here to order.`;
  return `https://wa.me/${intl}?text=${encodeURIComponent(msg)}`;
};

export default function CustomersPage() {
  const { orders } = useAdminData();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<Sort>('spent');
  const [segment, setSegment] = useState<Segment>('all');

  const all = useMemo(() => summarise(orders), [orders]);
  const isRegular = (c: typeof all[0]) => c.orders >= 4;
  const isNew = (c: typeof all[0]) => daysAgo(c.firstOrder) <= 30;
  const isLapsed = (c: typeof all[0]) => isRegular(c) && daysAgo(c.lastOrder) > 45;

  const stats = useMemo(() => {
    const repeat = all.filter(c => c.orders > 1).length;
    return {
      total: all.length,
      fresh: all.filter(isNew).length,
      repeatRate: all.length ? repeat / all.length : 0,
      avg: all.length ? all.reduce((s, c) => s + c.spent, 0) / all.length : 0,
      lapsed: all.filter(isLapsed),
    };
  }, [all]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = all.filter(c =>
      (segment === 'all' || (segment === 'regular' && isRegular(c)) || (segment === 'new' && isNew(c)) || (segment === 'lapsed' && isLapsed(c))) &&
      (!needle || `${c.name} ${c.phone}`.toLowerCase().includes(needle)));
    return [...list].sort((a, b) => sort === 'orders' ? b.orders - a.orders
      : sort === 'recent' ? b.lastOrder.localeCompare(a.lastOrder) : b.spent - a.spent);
  }, [all, q, sort, segment]); // eslint-disable-line react-hooks/exhaustive-deps

  function exportCsv() {
    downloadFile(`bloomies-customers-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows.map(c => ({
      Name: c.name, Phone: c.phone, Orders: c.orders, 'Total spent': c.spent,
      'First order': new Date(c.firstOrder).toLocaleDateString('en-GB'), 'Last order': new Date(c.lastOrder).toLocaleDateString('en-GB'),
      'Favourite item': c.favourite, 'Usually orders via': CHANNEL_LABEL[c.channel],
    }))));
  }

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto">
      <AdminHeader title="Customers" subtitle="Who buys from you, how often, and who to reach out to."
        actions={<button className={btn.secondary} onClick={exportCsv}><Download size={15}/> Export CSV</button>}/>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatTile label="Customers" value={stats.total.toLocaleString()} sub="with a phone number on file"/>
        <StatTile label="New in the last 30 days" value={stats.fresh.toLocaleString()}/>
        <StatTile label="Came back for more" value={`${Math.round(stats.repeatRate * 100)}%`} sub="ordered more than once"/>
        <StatTile label="Average spend per customer" value={naira(stats.avg)} sub="all time"/>
      </div>

      {stats.lapsed.length > 0 && (
        <section className="bg-[#433075] text-white rounded-2xl p-5 mb-5">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
            <div>
              <h2 className="text-[0.98rem] font-semibold">Win back {stats.lapsed.length} regulars</h2>
              <p className="text-[0.82rem] text-white/80">They&apos;ve ordered 4+ times but not in the last 45 days. A quick message often brings them back.</p>
            </div>
            <button onClick={() => setSegment('lapsed')} className="text-[0.82rem] font-semibold underline underline-offset-2">See all</button>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {stats.lapsed.slice(0, 6).map(c => (
              <li key={c.phone} className="bg-white/10 rounded-xl px-3 py-2.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[0.85rem] font-semibold truncate">{c.name}</p>
                  <p className="text-[0.75rem] text-white/75">{c.orders} orders · last {ago(c.lastOrder).toLowerCase()}</p>
                </div>
                <a href={waLink(c.phone, c.name)} target="_blank" rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-1 bg-white text-[#433075] text-[0.75rem] font-semibold px-2.5 py-1.5 rounded-lg">
                  <MessageCircle size={13}/> Message
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <FilterRow>
        <div role="radiogroup" aria-label="Customer group" className="inline-flex bg-white border border-[#E6E0F3] rounded-xl p-1">
          {([['all', 'Everyone'], ['regular', 'Regulars'], ['new', 'New'], ['lapsed', 'Need a nudge']] as [Segment, string][]).map(([k, l]) => (
            <button key={k} role="radio" aria-checked={segment === k} onClick={() => setSegment(k)}
              className={`px-3 py-1.5 rounded-lg text-[0.8rem] ${segment === k ? 'bg-[#433075] text-white font-semibold' : 'text-[#5E5A7C] hover:bg-[#F3F0FA]'}`}>{l}</button>
          ))}
        </div>
        <Select label="Sort by" value={sort} onChange={v => setSort(v as Sort)}
          options={[['spent', 'Total spent'], ['orders', 'Number of orders'], ['recent', 'Most recent']]}/>
        <label className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A86A6]"/>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name or phone"
            className="w-full bg-white border border-[#E6E0F3] rounded-xl pl-9 pr-3 py-2 text-[0.85rem] focus:outline-none focus:border-[#433075]"/>
        </label>
      </FilterRow>

      <div className="bg-white border border-[#E6E0F3] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[0.83rem]">
            <thead className="bg-[#FAF9FD] text-[#5E5A7C] text-left">
              <tr>{['Customer', 'Orders', 'Total spent', 'Last order', 'Favourite', 'Usually via', ''].map((h, i) => (
                <th key={i} className={`font-semibold px-3 py-2.5 whitespace-nowrap ${i === 1 || i === 2 ? 'text-right' : ''}`}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {rows.slice(0, 100).map(c => (
                <tr key={c.phone} className="border-t border-[#F1EEF8]">
                  <td className="px-3 py-2.5">
                    <p className="font-medium text-[#2B2147] flex items-center gap-2">
                      {c.name}
                      {isRegular(c) && <span className="text-[0.68rem] font-semibold bg-[#E2BBFA] text-[#2B2147] px-1.5 py-0.5 rounded-full">Regular</span>}
                      {isNew(c) && <span className="text-[0.68rem] font-semibold bg-[#DDF3E3] text-[#1F6B2E] px-1.5 py-0.5 rounded-full">New</span>}
                    </p>
                    <p className="text-[0.75rem] text-[#5E5A7C]">{c.phone}</p>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{c.orders}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-[#2B2147]">{naira(c.spent)}</td>
                  <td className={`px-3 py-2.5 whitespace-nowrap ${isLapsed(c) ? 'text-[#B42318]' : ''}`}>{ago(c.lastOrder)}</td>
                  <td className="px-3 py-2.5">{c.favourite}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{CHANNEL_LABEL[c.channel]}</td>
                  <td className="px-3 py-2.5 text-right">
                    <a href={waLink(c.phone, c.name)} target="_blank" rel="noopener noreferrer" aria-label={`Message ${c.name} on WhatsApp`}
                      className="inline-flex items-center gap-1 text-[#433075] text-[0.78rem] font-semibold hover:underline">
                      <MessageCircle size={14}/> Message
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length > 100 && <p className="text-center text-[0.8rem] text-[#5E5A7C] py-3 border-t border-[#F1EEF8]">Showing the top 100 of {rows.length}. Use search or export for the rest.</p>}
        {rows.length === 0 && <p className="text-center text-[0.88rem] text-[#5E5A7C] py-10">No customers match.</p>}
      </div>
    </div>
  );
}
