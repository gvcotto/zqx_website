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
    <section className="py-12 md:py-20">
      <div className="container">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {subtitle ? <p className="mt-4 text-base leading-7 text-brand-muted">{subtitle}</p> : null}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
