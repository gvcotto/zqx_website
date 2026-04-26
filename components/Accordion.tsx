import Reveal from "@/components/Reveal";
import { titleCase } from "@/lib/text";

type AccordionItem = {
  id: string;
  title: string;
  summary: string;
};

export default function Accordion({ items }: { items: readonly AccordionItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <Reveal key={item.id} delay={index * 60}>
          <article className="glass rounded-3xl border border-brand-border px-5 py-5 md:px-6">
            <h3 className="text-base font-semibold text-brand-charcoal md:text-lg">{titleCase(item.title)}</h3>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-brand-muted md:text-base">{item.summary}</p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
