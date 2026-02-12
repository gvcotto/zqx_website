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
    <section className="py-16">
      <div className="container">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
          {subtitle ? <p className="mt-3 text-zinc-300">{subtitle}</p> : null}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
