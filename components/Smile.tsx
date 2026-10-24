// The smile (with tongue) from the Bloomies logo, used as a small brand mark under headings.
export default function Smile({ className = '', tongue = '#A58CF4' }: { className?: string; tongue?: string }) {
  return (
    <svg viewBox="0 0 120 44" fill="none" aria-hidden="true" className={className}>
      <path d="M3 9 L17 5 M103 5 L117 9" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M10 7 C 22 38, 98 38, 110 7" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M74 27 C 72 44, 92 44, 89 24" fill={tongue} stroke="currentColor" strokeWidth="3.5"
        strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M81.5 29 L82 35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}
