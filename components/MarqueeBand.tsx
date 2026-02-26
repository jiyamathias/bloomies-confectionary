const ITEMS = [
  '✦ Premium Cakes','✦ Fresh Pastries','✦ Small Chops','✦ Banana Bread',
  '✦ Fries & Sides','✦ Sweet Treats','✦ Fast Delivery','✦ 5★ Rated',
  "✦ Port Harcourt's Finest",
]

export default function MarqueeBand() {
  const doubled = [...ITEMS, ...ITEMS]
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden py-[15px]"
      style={{ background: 'linear-gradient(90deg,#c8913a,#e6c06a,#c8913a)', backgroundSize: '200% auto', animation: 'shimmer 5s linear infinite' }}
    >
      <div className="inline-flex animate-marquee whitespace-nowrap">
        {doubled.map((t, i) => (
          <span key={i} className="text-[11px] font-semibold tracking-[.24em] uppercase text-dark/85 px-[22px]">{t}</span>
        ))}
      </div>
    </div>
  )
}
