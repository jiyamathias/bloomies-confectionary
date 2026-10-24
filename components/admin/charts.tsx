'use client';
// Small hand-built SVG charts for the admin dashboard (no chart library).
// Specs follow the dataviz rules: thin marks, 4px rounded bar ends, hairline grid,
// one brand hue (validated ramp), hover tooltips, and a table view for every chart.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, Table2, BarChart3 } from 'lucide-react';

export const VIZ = {
  accent: '#433075',          // single-series marks
  accentWash: 'rgba(67,48,117,0.10)',
  muted: '#D5D0E4',           // de-emphasised marks
  grid: '#ECE8F4',
  text: '#2B2147',
  textSecondary: '#5E5A7C',
  empty: '#F4F1FB',
  // ordinal purple ramp, light → dark (validated: monotone, visible steps, light end ≥ 2:1 on white)
  ramp: ['#b3a4f1', '#907ad9', '#6e54b6', '#513b8c', '#392668'],
};

export function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.floor(e.contentRect.width)));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

function niceMax(max: number) {
  if (max <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(max));
  const n = max / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * pow;
}

export const compact = (n: number) =>
  n >= 1_000_000 ? `${+(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${Math.round(n / 1000)}K` : `${Math.round(n)}`;

/* ─── Card with chart/table toggle ─────────────────────────────────────── */
export interface TableSpec { columns: string[]; rows: (string | number)[][] }

export function ChartCard({ title, subtitle, children, table, className = '', aside }: {
  title: string; subtitle?: ReactNode; children: ReactNode; table?: TableSpec; className?: string; aside?: ReactNode;
}) {
  const [asTable, setAsTable] = useState(false);
  return (
    <section className={`bg-white rounded-2xl border border-[#E6E0F3] p-4 sm:p-5 min-w-0 ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-[0.98rem] font-semibold text-[#2B2147]">{title}</h2>
          {subtitle && <p className="text-[0.8rem] text-[#5E5A7C] mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {aside}
          {table && (
            <button type="button" onClick={() => setAsTable(v => !v)}
              className="inline-flex items-center gap-1.5 text-[0.78rem] text-[#5E5A7C] hover:text-[#433075]
                border border-[#E6E0F3] rounded-lg px-3 py-2"
              aria-label={asTable ? 'Show chart' : 'Show as table'}>
              {asTable ? <BarChart3 size={13}/> : <Table2 size={13}/>} {asTable ? 'Chart' : 'Table'}
            </button>
          )}
        </div>
      </div>
      {asTable && table ? <DataTable spec={table}/> : children}
    </section>
  );
}

function DataTable({ spec }: { spec: TableSpec }) {
  return (
    <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
      <table className="w-full text-[0.8rem]">
        <thead className="sticky top-0 bg-white">
          <tr>{spec.columns.map((c, i) => (
            <th key={c} className={`py-2 px-2 font-semibold text-[#5E5A7C] border-b border-[#ECE8F4] ${i ? 'text-right' : 'text-left'}`}>{c}</th>
          ))}</tr>
        </thead>
        <tbody>
          {spec.rows.map((r, i) => (
            <tr key={i} className="border-b border-[#F4F1FB]">
              {r.map((c, j) => (
                <td key={j} className={`py-1.5 px-2 text-[#2B2147] ${j ? 'text-right tabular-nums' : ''}`}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Tooltip ───────────────────────────────────────────────────────────── */
function Tip({ x, y, width, children }: { x: number; y: number; width: number; children: ReactNode }) {
  const left = Math.min(Math.max(x, 70), width - 70);
  return (
    <div className="absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-full
      bg-[#2B2147] text-white rounded-lg px-3 py-2 text-[0.75rem] shadow-lg whitespace-nowrap"
      style={{ left, top: y - 8 }}>
      {children}
    </div>
  );
}

/* ─── Stat tile ─────────────────────────────────────────────────────────── */
export function StatTile({ label, value, delta, goodWhenUp = true, sub, hero = false, className = '' }: {
  label: string; value: string; delta?: number | null; goodWhenUp?: boolean; sub?: string; hero?: boolean; className?: string;
}) {
  const hasDelta = typeof delta === 'number' && isFinite(delta) && Math.round(Math.abs(delta) * 100) > 0;
  const up = hasDelta && delta! >= 0;
  const good = hasDelta && (up === goodWhenUp);
  return (
    <div className={`bg-white rounded-2xl border border-[#E6E0F3] p-4 sm:p-5 ${className}`}>
      <p className="text-[0.8rem] text-[#5E5A7C]">{label}</p>
      <p className={`font-semibold text-[#2B2147] mt-1 leading-none ${hero ? 'text-[2.1rem] sm:text-[3rem]' : 'text-[1.5rem] sm:text-[1.7rem]'}`}>{value}</p>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-2.5 text-[0.78rem] min-h-[1.2rem]">
        {hasDelta && (
          <span className={`inline-flex items-center gap-0.5 font-semibold ${good ? 'text-[#1F6B2E]' : 'text-[#B42318]'}`}>
            {up ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
            {Math.abs(Math.round(delta! * 100))}%
          </span>
        )}
        {sub && <span className="text-[#5E5A7C]">{sub}</span>}
      </div>
    </div>
  );
}

/* ─── Area chart (one series over time, crosshair tooltip) ──────────────── */
export function AreaChart({ data, height = 220, format }: {
  data: { label: string; full: string; value: number; orders?: number }[];
  height?: number; format: (n: number) => string;
}) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const pad = { l: 44, r: 12, t: 12, b: 26 };
  const w = Math.max(width - pad.l - pad.r, 10), h = height - pad.t - pad.b;
  const max = niceMax(Math.max(...data.map(d => d.value), 0));
  const x = (i: number) => pad.l + (data.length <= 1 ? w / 2 : (i / (data.length - 1)) * w);
  const y = (v: number) => pad.t + h - (v / max) * h;
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.value)}`).join(' ');
  const area = `${line} L${x(data.length - 1)},${pad.t + h} L${x(0)},${pad.t + h} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => t * max);
  const every = Math.ceil(data.length / Math.max(Math.floor(w / 70), 1));

  function onMove(e: React.PointerEvent<SVGRectElement>) {
    const box = (e.target as SVGRectElement).getBoundingClientRect();
    const px = e.clientX - box.left;
    const i = Math.round((px / box.width) * (data.length - 1));
    setHover(Math.min(Math.max(i, 0), data.length - 1));
  }

  return (
    <div ref={ref} className="relative">
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label="Sales over time">
          {ticks.map(t => (
            <g key={t}>
              <line x1={pad.l} x2={pad.l + w} y1={y(t)} y2={y(t)} stroke={VIZ.grid} strokeWidth={1}/>
              <text x={pad.l - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill={VIZ.textSecondary}
                style={{ fontVariantNumeric: 'tabular-nums' }}>{compact(t)}</text>
            </g>
          ))}
          <path d={area} fill={VIZ.accentWash}/>
          <path d={line} fill="none" stroke={VIZ.accent} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"/>
          {data.map((d, i) => (i % every === 0 || (i === data.length - 1 && (data.length - 1) % every >= every / 2)) && (
            <text key={i} x={x(i)} y={height - 6} textAnchor="middle" fontSize={11} fill={VIZ.textSecondary}>{d.label}</text>
          ))}
          {hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + h} stroke={VIZ.textSecondary} strokeWidth={1}/>
              <circle cx={x(hover)} cy={y(data[hover].value)} r={5} fill={VIZ.accent} stroke="#fff" strokeWidth={2}/>
            </g>
          )}
          <rect x={pad.l} y={pad.t} width={w} height={h} fill="transparent"
            onPointerMove={onMove} onPointerLeave={() => setHover(null)}/>
        </svg>
      )}
      {hover !== null && width > 0 && (
        <Tip x={x(hover)} y={y(data[hover].value)} width={width}>
          <div className="font-semibold text-[0.85rem]">{format(data[hover].value)}</div>
          <div className="text-white/75">{data[hover].full}{data[hover].orders !== undefined ? ` · ${data[hover].orders} orders` : ''}</div>
        </Tip>
      )}
    </div>
  );
}

/* ─── Column chart (with optional emphasis on some columns) ─────────────── */
export function ColumnChart({ data, height = 200, format, emphasis, unit = '' }: {
  data: { label: string; value: number; full?: string }[];
  height?: number; format?: (n: number) => string; emphasis?: (i: number) => boolean; unit?: string;
}) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const pad = { l: 36, r: 6, t: 10, b: 24 };
  const w = Math.max(width - pad.l - pad.r, 10), h = height - pad.t - pad.b;
  const max = niceMax(Math.max(...data.map(d => d.value), 0));
  const band = w / data.length;
  const bw = Math.min(24, band * 0.7);
  const y = (v: number) => pad.t + h - (v / max) * h;
  const fmt = format ?? ((n: number) => `${n.toLocaleString()}${unit}`);
  const every = Math.ceil(data.length / Math.max(Math.floor(w / 34), 1));

  return (
    <div ref={ref} className="relative">
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label="Column chart">
          {[0, 0.5, 1].map(t => (
            <g key={t}>
              <line x1={pad.l} x2={pad.l + w} y1={y(t * max)} y2={y(t * max)} stroke={VIZ.grid}/>
              <text x={pad.l - 6} y={y(t * max)} dy="0.32em" textAnchor="end" fontSize={11} fill={VIZ.textSecondary}>{compact(t * max)}</text>
            </g>
          ))}
          {data.map((d, i) => {
            const cx = pad.l + band * i + band / 2;
            const top = y(d.value), bh = pad.t + h - top;
            const on = emphasis ? emphasis(i) : true;
            const r = Math.min(4, bh);
            return (
              <g key={i} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}
                tabIndex={0} onFocus={() => setHover(i)} onBlur={() => setHover(null)} aria-label={`${d.full ?? d.label}: ${fmt(d.value)}`}>
                <rect x={pad.l + band * i} y={pad.t} width={band} height={h} fill="transparent"/>
                {bh > 0 && (
                  <path d={`M${cx - bw / 2},${pad.t + h} V${top + r} Q${cx - bw / 2},${top} ${cx - bw / 2 + r},${top}
                    H${cx + bw / 2 - r} Q${cx + bw / 2},${top} ${cx + bw / 2},${top + r} V${pad.t + h} Z`}
                    fill={on ? VIZ.accent : VIZ.muted} opacity={hover === null || hover === i ? 1 : 0.75}/>
                )}
                {i % every === 0 && (
                  <text x={cx} y={height - 6} textAnchor="middle" fontSize={11} fill={VIZ.textSecondary}>{d.label}</text>
                )}
              </g>
            );
          })}
        </svg>
      )}
      {hover !== null && width > 0 && (
        <Tip x={pad.l + band * hover + band / 2} y={y(data[hover].value)} width={width}>
          <div className="font-semibold text-[0.85rem]">{fmt(data[hover].value)}</div>
          <div className="text-white/75">{data[hover].full ?? data[hover].label}</div>
        </Tip>
      )}
    </div>
  );
}

/* ─── Horizontal bars (compare categories; value at the tip) ────────────── */
type BarDatum = { label: string; value: number; share?: number; orders?: number };
export function HBarChart({ data, format, note }: {
  data: BarDatum[]; format: (n: number) => string; note?: (d: BarDatum) => string;
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <ul className="space-y-3">
      {data.map(d => (
        <li key={d.label} className="group" title={`${d.label}: ${format(d.value)}`}>
          <div className="flex items-baseline justify-between gap-3 text-[0.82rem] mb-1">
            <span className="text-[#2B2147] truncate">{d.label}</span>
            <span className="text-[#2B2147] font-semibold tabular-nums shrink-0">
              {format(d.value)}
              {note && <span className="font-normal text-[#5E5A7C]"> · {note(d)}</span>}
            </span>
          </div>
          <div className="h-[10px] rounded-r bg-transparent">
            <div className="h-full rounded-r-[4px] transition-[width] duration-300 group-hover:opacity-85"
              style={{ width: `${Math.max((d.value / max) * 100, 1)}%`, background: VIZ.accent }}/>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ─── Heatmap (weekday × hour, sequential purple) ───────────────────────── */
export function Heatmap({ grid, rowLabels, colLabels }: {
  grid: number[][]; rowLabels: string[]; colLabels: string[];
}) {
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);
  const max = Math.max(...grid.flat(), 1);
  const bin = (v: number) => (v === 0 ? -1 : Math.min(VIZ.ramp.length - 1, Math.floor((v / max) * VIZ.ramp.length)));
  const step = Math.ceil(max / VIZ.ramp.length);
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="border-separate" style={{ borderSpacing: 2 }} aria-label="Orders by day and hour">
          <thead>
            <tr>
              <th/>
              {colLabels.map((c, i) => (
                <th key={c} className="text-[0.68rem] font-normal text-[#5E5A7C] px-0.5 min-w-[28px]">{i % 2 === 0 ? c : ''}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, r) => (
              <tr key={r}>
                <th className="text-[0.75rem] font-normal text-[#5E5A7C] pr-2 text-left">{rowLabels[r]}</th>
                {row.map((v, c) => {
                  const b = bin(v);
                  const isHover = hover?.r === r && hover?.c === c;
                  return (
                    <td key={c} tabIndex={0}
                      onPointerEnter={() => setHover({ r, c })} onPointerLeave={() => setHover(null)}
                      onFocus={() => setHover({ r, c })} onBlur={() => setHover(null)}
                      aria-label={`${rowLabels[r]} ${colLabels[c]}: ${v} orders`}
                      className="h-7 rounded-[4px] outline-offset-1"
                      style={{ background: b < 0 ? VIZ.empty : VIZ.ramp[b], outline: isHover ? `2px solid ${VIZ.text}` : undefined }}/>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
        <p className="text-[0.8rem] text-[#2B2147] min-h-[1.2rem]">
          {hover
            ? <><strong>{grid[hover.r][hover.c]} orders</strong> <span className="text-[#5E5A7C]">on {rowLabels[hover.r]}s, {colLabels[hover.c]}</span></>
            : <span className="text-[#5E5A7C]">Hover a square to see the number of orders.</span>}
        </p>
        <div className="flex items-center gap-1.5 text-[0.7rem] text-[#5E5A7C]">
          <span>Fewer</span>
          <span className="w-4 h-3 rounded-[3px]" style={{ background: VIZ.empty }} title="0 orders"/>
          {VIZ.ramp.map((c, i) => (
            <span key={c} className="w-4 h-3 rounded-[3px]" style={{ background: c }}
              title={`${i * step + 1}–${(i + 1) * step} orders`}/>
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
