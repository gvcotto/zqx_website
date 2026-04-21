import type { Dictionary } from "@/lib/dictionaries";
import Reveal from "@/components/Reveal";

type TeamSpotlightProps = {
  team: Dictionary["team"];
};

export default function TeamSpotlight({ team }: TeamSpotlightProps) {
  return (
    <section aria-labelledby="team-spotlight-title" className="py-14 md:py-24">
      <div className="container">
        <Reveal className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-blue">{team.label}</p>
          <h2 id="team-spotlight-title" className="mt-4 text-3xl font-semibold tracking-[-0.03em] md:text-5xl">
            {team.title}
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-brand-muted md:text-lg">{team.body}</p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {team.roles.map((role, index) => (
            <Reveal key={role.title} delay={index * 60}>
              <article className="surface-card rounded-[1.75rem] border border-brand-border p-6">
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-brand-blue">{role.title}</div>
                <p className="mt-3 text-sm leading-6 text-brand-muted">{role.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
