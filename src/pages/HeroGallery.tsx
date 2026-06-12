import { useEffect, useMemo, useRef, useState } from 'react';
import { asset } from '../asset';

interface HeroPhoto {
  thumb: string;
  full: string;
  alt: string;
  label: string;
  eager?: boolean;
  highPriority?: boolean;
}

const PHOTOS: HeroPhoto[] = [
  { thumb: 'images/thumbs/dogs2.jpg', full: 'images/dogs2.jpg', alt: 'Dog in training', label: 'dog in training', eager: true, highPriority: true },
  { thumb: 'images/thumbs/mortyschnauzerpuppy.jpg', full: 'images/mortyschnauzerpuppy.jpg', alt: 'Morty', label: 'Morty', eager: true },
  { thumb: 'images/thumbs/montyschnoodlepuppy.jpg', full: 'images/montyschnoodlepuppy.jpg', alt: 'Monty', label: 'Monty', eager: true },
  { thumb: 'images/thumbs/neocollieold.jpg', full: 'images/neocollieold.jpg', alt: 'Neo', label: 'Neo', eager: true },
  { thumb: 'images/thumbs/archiegolden.jpg', full: 'images/archiegolden.jpg', alt: 'Archie', label: 'Archie' },
  { thumb: 'images/thumbs/tillycollie.jpg', full: 'images/tillycollie.jpg', alt: 'Tilly', label: 'Tilly' },
  { thumb: 'images/thumbs/whitebigschnoodle.jpg', full: 'images/whitebigschnoodle.jpg', alt: 'White', label: 'White' },
  { thumb: 'images/thumbs/cosmochihuahuapuppy.jpg', full: 'images/cosmochihuahuapuppy.jpg', alt: 'Cosmo', label: 'Cosmo' },
  { thumb: 'images/thumbs/stormstaffypuppy.jpg', full: 'images/stormstaffypuppy.jpg', alt: 'Storm', label: 'Storm' }
];

const preloaded = new Set<string>();
function preload(src: string) {
  if (preloaded.has(src)) return;
  preloaded.add(src);
  const img = new Image();
  img.src = src;
}

/** Hero photo grid with hover preview and lightbox (port of hero-gallery.js). */
export default function HeroGallery() {
  const [preview, setPreview] = useState<{ src: string; alt: string; left: number; top: number } | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; caption: string } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const hoverCapable = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    []
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (lightbox && !dialog.open && typeof dialog.showModal === 'function') {
      dialog.showModal();
    }
    if (!lightbox && dialog.open) {
      dialog.close();
    }
  }, [lightbox]);

  useEffect(() => {
    if (!preview) return;
    const onScroll = () => setPreview(null);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [preview]);

  const showPreview = (photo: HeroPhoto, trigger: HTMLElement) => {
    if (!hoverCapable) return;
    const src = asset(photo.full);
    preload(src);

    const rect = trigger.getBoundingClientRect();
    const previewWidth = 300;
    const previewHeight = 300;
    let left = rect.right + 12;
    let top = rect.top + rect.height / 2 - previewHeight / 2;

    if (left + previewWidth > window.innerWidth - 12) {
      left = rect.left - previewWidth - 12;
    }
    top = Math.max(12, Math.min(top, window.innerHeight - previewHeight - 12));

    setPreview({ src, alt: photo.alt, left, top });
  };

  const openLightbox = (photo: HeroPhoto) => {
    const src = asset(photo.full);
    preload(src);
    setPreview(null);
    setLightbox({ src, alt: photo.alt, caption: photo.label });
  };

  return (
    <>
      <div className="hero-photo-grid" aria-label="Dogs in training">
        {PHOTOS.map((photo) => (
          <figure className="hero-photo-cell" key={photo.full}>
            <button
              type="button"
              className="hero-photo-trigger"
              aria-label={`View larger photo of ${photo.label}`}
              onMouseEnter={(event) => showPreview(photo, event.currentTarget)}
              onMouseLeave={() => setPreview(null)}
              onFocus={(event) => showPreview(photo, event.currentTarget)}
              onBlur={() => setPreview(null)}
              onClick={() => openLightbox(photo)}
            >
              <img
                src={asset(photo.thumb)}
                alt={photo.alt}
                width={88}
                height={88}
                loading={photo.eager ? 'eager' : 'lazy'}
                fetchPriority={photo.highPriority ? 'high' : undefined}
                decoding="async"
              />
            </button>
          </figure>
        ))}
      </div>

      <div
        id="hero-photo-preview"
        className={`hero-photo-preview${preview ? ' is-preview-visible' : ''}`}
        aria-hidden="true"
        style={preview ? { left: `${preview.left}px`, top: `${preview.top}px` } : undefined}
      >
        {preview ? <img src={preview.src} alt={preview.alt} /> : <img alt="" />}
      </div>

      <dialog
        className="photo-lightbox"
        id="photo-lightbox"
        aria-label="Enlarged photo"
        ref={dialogRef}
        onClick={(event) => {
          if (event.target === dialogRef.current) setLightbox(null);
        }}
        onClose={() => setLightbox(null)}
      >
        <button type="button" className="photo-lightbox-close" aria-label="Close" onClick={() => setLightbox(null)}>
          &times;
        </button>
        <figure>
          {lightbox ? <img src={lightbox.src} alt={lightbox.alt} id="photo-lightbox-img" /> : <img alt="" id="photo-lightbox-img" />}
          <figcaption id="photo-lightbox-caption">{lightbox?.caption ?? ''}</figcaption>
        </figure>
      </dialog>
    </>
  );
}
