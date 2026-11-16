import { GradientPlane } from '../PlaneMark';
import Cta from '../ui/Cta';

/** Closing commercial call to action. One primary action, one way out. */
export default function CtaBand({ title, text, href = '/contacto', label = 'Habla con nuestro equipo', product }: {
  title: string; text: string; href?: string; label?: string; product?: string;
}) {
  return (
    <section className="gutter bg-noche py-24">
      <div className="relative mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-10 overflow-hidden rounded-[28px] border border-cielo/25 bg-[linear-gradient(135deg,#10294A,#0C2340_55%,#0A1B33)] px-[clamp(24px,5vw,72px)] py-[clamp(40px,6vw,72px)]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-6 -top-10 w-[220px] opacity-90 max-sm:w-[140px]"><GradientPlane wing={['#9ECBFF', '#2F8CFF']} fold={['#123761', '#2A5E9C']} shade={0.3} /></div>
        <div className="relative flex max-w-[640px] flex-col gap-4">
          <h2 className="m-0 font-display text-[clamp(1.9rem,3.6vw,3.2rem)] font-bold leading-[1.05] tracking-[-.02em] text-hueso [text-wrap:balance]">{title}</h2>
          <p className="m-0 text-[17px] leading-[1.6] text-niebla">{text}</p>
        </div>
        <div className="relative"><Cta href={href} label={label} track="click_contact" product={product} /></div>
      </div>
    </section>
  );
}
