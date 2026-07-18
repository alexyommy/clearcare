export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <section aria-labelledby="page-heading">
      <h1 id="page-heading" className="page-title">{title}</h1>
      <div className="placeholder-page">
        <p>The {title} view will be implemented in the coming weeks.</p>
      </div>
    </section>
  );
}
