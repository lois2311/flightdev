import type { CSSProperties } from 'react';

type Line = string | { text: string; className?: string };

/** Headline whose lines rise out of a mask as it scrolls in (see [data-mask] in globals.css and useReveal). */
export default function MaskLines({ as: Tag = 'h2', lines, id, className = '' }: { as?: 'h1' | 'h2' | 'p'; lines: Line[]; id?: string; className?: string }) {
  return (
    <Tag id={id} data-mask="ready" className={className}>
      {lines.map((l, i) => {
        const { text, className: c } = typeof l === 'string' ? { text: l, className: undefined } : l;
        return <span key={text}><span className={c} style={{ '--i': i } as CSSProperties}>{text}</span></span>;
      })}
    </Tag>
  );
}
