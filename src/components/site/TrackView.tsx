'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/** Fires `view_product` once per product page view. */
export default function TrackView({ product }: { product: string }) {
  useEffect(() => { track('view_product', { product }); }, [product]);
  return null;
}
