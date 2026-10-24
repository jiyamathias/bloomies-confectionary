'use client';
import { useMemo, useState } from 'react';
import { Upload, Download, CheckCircle2 } from 'lucide-react';
import { parseCsv, naira } from '@/lib/admin/analytics';
import { IMPORT_FIELDS, guessMapping, rowsToOrders, TEMPLATE_CSV, type Mapping } from '@/lib/admin/sheet-import';
import { CHANNEL_LABEL, PAYMENT_LABEL, type Order } from '@/lib/admin/types';
import Drawer, { field } from '@/components/admin/Drawer';
import { btn } from '@/components/admin/AdminHeader';

export function downloadFile(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ImportSheet({ open, onClose, onImport }: {
  open: boolean; onClose: () => void; onImport: (orders: Omit<Order, 'id' | 'orderNumber'>[]) => void;
}) {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [mapping, setMapping] = useState<Mapping>({});
  const [done, setDone] = useState<number | null>(null);

  const table = useMemo(() => parseCsv(text), [text]);
  const headers = table[0] ?? [];
  const body = table.slice(1);
  const result = useMemo(() => rowsToOrders(body, mapping), [body, mapping]);
  const missing = IMPORT_FIELDS.filter(f => f.required && mapping[f.key] === undefined);
  const hasAmount = mapping.amount !== undefined || mapping.price !== undefined;

  function load(t: string, name = '') {
    setText(t); setFileName(name); setDone(null);
    const rows = parseCsv(t);
    setMapping(rows[0] ? guessMapping(rows[0]) : {});
  }

  function close() { setText(''); setFileName(''); setMapping({}); setDone(null); onClose(); }

  function runImport() {
    onImport(result.orders);
    setDone(result.orders.length);
  }

  return (
    <Drawer open={open} onClose={close} title="Import from Google Sheets" wide
      footer={done === null && headers.length > 0 ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.82rem] text-[#5E5A7C]">
            {result.orders.length} {result.orders.length === 1 ? 'sale' : 'sales'} ready{result.skipped.length ? `, ${result.skipped.length} ${result.skipped.length === 1 ? 'row' : 'rows'} skipped` : ''}
          </p>
          <button onClick={runImport} disabled={!!missing.length || !hasAmount || !result.orders.length}
            className={`${btn.primary} disabled:opacity-50 disabled:cursor-not-allowed`}>
            Import {result.orders.length} sales
          </button>
        </div>
      ) : undefined}>
      {done !== null ? (
        <div className="text-center py-10">
          <CheckCircle2 size={40} className="text-[#1F6B2E] mx-auto mb-3"/>
          <p className="text-[1.05rem] font-semibold text-[#2B2147]">{done} sales imported</p>
          <p className="text-[0.85rem] text-[#5E5A7C] mt-1">They now show in the sales log and on the overview charts.</p>
          <button onClick={close} className={`${btn.primary} mt-6`}>Done</button>
        </div>
      ) : (
        <div className="space-y-5">
          <ol className="text-[0.85rem] text-[#2B2147] space-y-1.5 list-decimal pl-5">
            <li>Open your sales sheet in Google Sheets.</li>
            <li>Click <strong>File → Download → Comma-separated values (.csv)</strong>.</li>
            <li>Choose that file below. We&apos;ll match the columns for you.</li>
          </ol>

          <div className="flex flex-wrap gap-2">
            <label className={`${btn.primary} cursor-pointer`}>
              <Upload size={15}/> {fileName ? 'Choose a different file' : 'Choose CSV file'}
              <input type="file" accept=".csv,text/csv" className="sr-only" onChange={async e => {
                const f = e.target.files?.[0]; if (f) load(await f.text(), f.name);
              }}/>
            </label>
            <button type="button" onClick={() => downloadFile('bloomies-sales-template.csv', TEMPLATE_CSV)} className={btn.secondary}>
              <Download size={15}/> Download a template
            </button>
          </div>
          {fileName && <p className="text-[0.8rem] text-[#5E5A7C]">Loaded <strong>{fileName}</strong>: {body.length} rows</p>}

          <details className="text-[0.82rem]">
            <summary className="cursor-pointer text-[#433075] font-medium">Or paste the rows instead</summary>
            <textarea className={`${field} mt-2 font-mono text-[0.75rem]`} rows={5} value={text} onChange={e => load(e.target.value)}
              placeholder={'Date,Customer,Item,Total\n24/10/2026,Chioma,Red Velvet,9000'}/>
          </details>

          {headers.length > 0 && (<>
            <div>
              <p className="text-[0.9rem] font-semibold text-[#2B2147] mb-1">Check the columns</p>
              <p className="text-[0.78rem] text-[#5E5A7C] mb-3">We guessed these from your headings. Change any that are wrong.</p>
              <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2.5">
                {IMPORT_FIELDS.map(f => (
                  <label key={f.key} className="flex items-center justify-between gap-3 text-[0.82rem]">
                    <span className="text-[#2B2147]">{f.label}{f.required && <span className="text-[#B42318]"> *</span>}</span>
                    <select className="border border-[#D5D0E4] rounded-lg px-2 py-1.5 bg-white text-[#2B2147] w-44"
                      value={mapping[f.key] ?? ''}
                      onChange={e => setMapping(m => ({ ...m, [f.key]: e.target.value === '' ? undefined : Number(e.target.value) } as Mapping))}>
                      <option value="">Not in my sheet</option>
                      {headers.map((h, i) => <option key={i} value={i}>{h || `Column ${i + 1}`}</option>)}
                    </select>
                  </label>
                ))}
              </div>
              {(missing.length > 0 || !hasAmount) && (
                <p className="text-[0.8rem] text-[#B42318] mt-3">
                  Please pick a column for {[...missing.map(f => f.label), ...(!hasAmount ? ['Total amount or Price each'] : [])].join(', ')}.
                </p>
              )}
            </div>

            {result.orders.length > 0 && (
              <div>
                <p className="text-[0.9rem] font-semibold text-[#2B2147] mb-2">Preview</p>
                <div className="overflow-x-auto bg-white border border-[#E6E0F3] rounded-xl">
                  <table className="w-full text-[0.78rem]">
                    <thead className="text-[#5E5A7C] text-left">
                      <tr>{['Date', 'Customer', 'Item', 'Total', 'Paid via', 'From'].map(h => <th key={h} className="font-semibold px-3 py-2">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {result.orders.slice(0, 6).map((o, i) => (
                        <tr key={i} className="border-t border-[#F1EEF8]">
                          <td className="px-3 py-2 whitespace-nowrap">{new Date(o.createdAt).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</td>
                          <td className="px-3 py-2">{o.customerName}</td>
                          <td className="px-3 py-2">{o.items[0].qty} × {o.items[0].name}</td>
                          <td className="px-3 py-2 tabular-nums font-semibold">{naira(o.total)}</td>
                          <td className="px-3 py-2">{PAYMENT_LABEL[o.paymentMethod]}</td>
                          <td className="px-3 py-2">{CHANNEL_LABEL[o.channel]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {result.skipped.length > 0 && (
              <details className="text-[0.8rem] text-[#5E5A7C]">
                <summary className="cursor-pointer">{result.skipped.length} rows will be skipped. See why</summary>
                <ul className="mt-2 space-y-0.5">
                  {result.skipped.slice(0, 20).map(s => <li key={s.row}>Row {s.row}: {s.reason}</li>)}
                </ul>
              </details>
            )}
          </>)}
        </div>
      )}
    </Drawer>
  );
}

