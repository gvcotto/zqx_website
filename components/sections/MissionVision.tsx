import type { Dictionary } from "@/lib/dictionaries";
import Reveal from "@/components/Reveal";

type MissionVisionProps = {
  about: Dictionary["about"];
};

export default function MissionVision({ about }: MissionVisionProps) {
  return (
    <section aria-labelledby="mission-vision-title" className="border-b border-brand-border/80 py-14 md:py-24">
      <div className="container">
        <Reveal className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-blue">{about.missionVisionTitle}</p>
          <h2 id="mission-vision-title" className="mt-4 text-3xl font-semibold tracking-[-0.03em] md:text-5xl">
            {about.missionVisionTitle}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Reveal>
            <article className="surface-soft rounded-3xl border border-brand-border p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-blue">{about.mission.label}</p>
              <h3 className="mt-4 max-w-md text-2xl font-semibold tracking-tight">{about.mission.short}</h3>
              <p className="mt-5 max-w-xl text-base leading-7 text-brand-muted">{about.mission.standard}</p>
            </article>
          </Reveal>

          <Reveal delay={60}>
            <article className="surface-soft rounded-3xl border border-brand-border p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-blue">{about.vision.label}</p>
              <h3 className="mt-4 max-w-md text-2xl font-semibold tracking-tight">{about.vision.short}</h3>
              <p className="mt-5 max-w-xl text-base leading-7 text-brand-muted">{about.vision.standard}</p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
