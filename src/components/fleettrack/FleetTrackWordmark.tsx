/** FleetTrack Pro wordmark: the product's own two-tone logotype (the one sanctioned two-tone span, see slop.test.ts). */
export default function FleetTrackWordmark({ className = 'text-[26px]' }: { className?: string }) {
  return <span className={`font-display font-bold tracking-[-.02em] text-hueso ${className}`}>FleetTrack<span className="text-cielo"> Pro</span></span>;
}
