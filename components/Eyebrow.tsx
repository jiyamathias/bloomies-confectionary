export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={[
      'inline-flex items-center gap-2.5 px-[17px] py-[7px] rounded-full mb-[18px]',
      'text-[10px] font-semibold tracking-[.2em] uppercase text-gold border',
      light ? 'bg-gold/[.15] border-gold/30' : 'bg-gold/[.09] border-gold/[.22]',
    ].join(' ')}>
      <span className="w-[5px] h-[5px] rounded-full bg-gold flex-shrink-0" aria-hidden="true" />
      {children}
    </div>
  )
}
