'use client';

import { useEffect, useRef, type ComponentProps, type CSSProperties } from 'react';

// Adapted from 21st.dev kevingirelli/spotlight (id 35180): no Radix Slot, no cn(), project tokens.
// Two masks, one clipped to the content box: "exclude" keeps only the padding, i.e. the 1px lit edge.
const RING_MASK = 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)';
const LIGHT = 'pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 motion-reduce:transition-none group-focus-within/spot:opacity-100 group-hover/spot:opacity-100';

/**
 * A soft light that follows the pointer across a surface and along its edge. Writes two CSS variables
 * per frame, so nothing re-renders. Touch skips it; keyboard focus inside lights it where the pointer last was.
 */
export default function Spotlight({ size = 340, color = 'var(--color-cielo)', className = '', children, onPointerMove, ...props }: ComponentProps<'div'> & { size?: number; color?: string }) {
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const circle = `${size}px circle at var(--spot-x, 50%) var(--spot-y, 0%)`;
  const ring: CSSProperties = {
    background: `radial-gradient(${circle}, color-mix(in oklab, ${color} 70%, transparent), transparent 60%)`,
    mask: RING_MASK, maskComposite: 'exclude', WebkitMask: RING_MASK, WebkitMaskComposite: 'xor',
  };
  return (
    <div
      {...props}
      className={`group/spot relative isolate ${className}`}
      onPointerMove={e => {
        onPointerMove?.(e);
        if (e.pointerType === 'touch') return;
        const el = e.currentTarget, { clientX, clientY } = e;
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          const b = el.getBoundingClientRect();
          el.style.setProperty('--spot-x', `${clientX - b.left}px`);
          el.style.setProperty('--spot-y', `${clientY - b.top}px`);
        });
      }}
    >
      <span aria-hidden="true" className={LIGHT} style={{ background: `radial-gradient(${circle}, color-mix(in oklab, ${color} 16%, transparent), transparent 70%)` }} />
      <span aria-hidden="true" className={`${LIGHT} -inset-px p-px`} style={ring} />
      {children}
    </div>
  );
}
