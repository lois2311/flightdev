'use client';

import { useEffect, useState } from 'react';

const fmt = new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Bogota' });

/** Real local time in Colombia. Renders a placeholder on the server so hydration never mismatches. */
export default function LocalTime() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, []);
  return <span className="tnum">{now ?? '--:--'}</span>;
}
