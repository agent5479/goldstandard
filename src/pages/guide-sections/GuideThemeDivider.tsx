interface GuideThemeDividerProps {
  id: string;
  part: string;
  title: string;
  description: string;
}

export default function GuideThemeDivider({ id, part, title, description }: GuideThemeDividerProps) {
  return (
    <section className="guide-theme-divider" id={id} aria-label={title}>
      <div className="guide-theme-divider-inner">
        <p className="guide-theme-divider-part">{part}</p>
        <h2 className="guide-theme-divider-title">{title}</h2>
        <p className="guide-theme-divider-desc">{description}</p>
      </div>
    </section>
  );
}
