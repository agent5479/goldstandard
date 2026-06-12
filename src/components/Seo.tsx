import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  /** Body class for page-specific CSS (e.g. page-home, page-guide). */
  bodyClass?: string;
}

/** Per-route document title, meta description, and body class. */
export default function Seo({ title, description, bodyClass }: SeoProps) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description);

    const previous = document.body.className;
    document.body.className = bodyClass ?? '';
    return () => {
      document.body.className = previous;
    };
  }, [title, description, bodyClass]);

  return null;
}
