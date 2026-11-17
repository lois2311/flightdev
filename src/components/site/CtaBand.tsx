import PlaneMark from '../PlaneMark';
import Cta from '../ui/Cta';

/** Closing commercial call to action. One primary action, one way out. */
export default function CtaBand({ title, text, href = '/contacto', label = 'Contar mi caso', product }: {
  title: string; text: string; href?: string; label?: string; product?: string;
}) {
  return (
    <section className="gutter border-t border-borde bg-noche py-24">
      <div className="mx-auto grid max-w-[1280px] items-end gap-10 border-l-[3px] border-voltaje pl-[clamp(20px,4vw,48px)] lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex max-w-[680px] flex-col gap-4">
          <PlaneMark size={28} fold="#7DB8FF" />
          <h2 className="m-0 font-display text-[clamp(1.9rem,3.6vw,3.2rem)] font-bold leading-[1.02] tracking-[-.01em] text-hueso [text-wrap:balance]">{title}</h2>
          <p className="m-0 text-[17px] leading-[1.6] text-niebla">{text}</p>
        </div>
        <Cta href={href} label={label} track="click_contact" product={product} />
      </div>
    </section>
  );
}
