// Renders plain text written in the admin: a blank line starts a new paragraph and lines
// starting with "- " become bullet points. No HTML is interpreted, so it is safe to show.
type Block = { kind: 'p'; text: string } | { kind: 'ul'; items: string[] };
const BULLET = /^[-•*]\s+/;

export function parseRichText(text: string): Block[] {
  const blocks: Block[] = [];
  for (const chunk of text.replace(/\r/g, '').split(/\n\s*\n/)) {
    let para: string[] = [];
    let list: string[] = [];
    const flushPara = () => { if (para.length) blocks.push({ kind: 'p', text: para.join(' ') }); para = []; };
    const flushList = () => { if (list.length) blocks.push({ kind: 'ul', items: list }); list = []; };
    for (const raw of chunk.split('\n')) {
      const line = raw.trim();
      if (!line) continue;
      if (BULLET.test(line)) { flushPara(); list.push(line.replace(BULLET, '')); }
      else { flushList(); para.push(line); }
    }
    flushPara(); flushList();
  }
  return blocks;
}

export default function RichText({ text, className = '', listClassName = 'list-disc pl-5 space-y-1.5 marker:text-[#A58CF4]' }: {
  text: string; className?: string; listClassName?: string;
}) {
  return (
    <div className={className}>
      {parseRichText(text).map((b, i) => b.kind === 'p'
        ? <p key={i}>{b.text}</p>
        : <ul key={i} className={listClassName}>{b.items.map((it, j) => <li key={j}>{it}</li>)}</ul>)}
    </div>
  );
}
