export default function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-14 md:py-24">
      <div className="container">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] md:text-5xl">{title}</h2>
          {subtitle ? <p className="mt-4 text-base leading-7 text-brand-muted md:text-lg">{subtitle}</p> : null}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
