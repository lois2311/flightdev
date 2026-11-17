'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTerrainDraw } from '@/lib/fx';
import { captureAttribution } from '@/lib/attribution';
import { track, type AnalyticsEvent } from '@/lib/analytics';

/** Site-wide client behaviour: terrain draw-in, first-touch attribution, and [data-track] click events. */
export default function ClientFx() {
  const path = usePathname();
  useTerrainDraw(path);

  useEffect(() => {
    captureAttribution();
    const onClick = (e: MouseEvent) => {
      const el = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-track]') : null;
      if (el?.dataset.track) track(el.dataset.track as AnalyticsEvent, { label: el.dataset.trackLabel, product: el.dataset.product });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
