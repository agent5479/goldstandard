import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { HERO_PHOTOS, findHeroPhoto, heroPhotoSrc } from '@shared/heroPhotos';

interface DogPhotoPickerProps {
  value?: string;
  onChange: (photoPath: string | undefined) => void;
  disabled?: boolean;
}

function DogPhotoThumb({
  photoPath,
  alt,
  size = 72,
  className = '',
}: {
  photoPath?: string;
  alt?: string;
  size?: number;
  className?: string;
}) {
  const photo = findHeroPhoto(photoPath);
  const src = photo ? heroPhotoSrc(photo.thumb) : undefined;

  if (src) {
    return (
      <img
        src={src}
        alt={alt || photo?.alt || 'Dog photo'}
        width={size}
        height={size}
        className={`dog-photo-thumb ${className}`.trim()}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <div
      className={`dog-photo-placeholder ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <i className="bi bi-image" />
    </div>
  );
}

export function DogPhotoPicker({ value, onChange, disabled }: DogPhotoPickerProps) {
  const [showModal, setShowModal] = useState(false);
  const selected = findHeroPhoto(value);

  const handleSelect = (fullPath: string) => {
    onChange(fullPath);
    setShowModal(false);
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange(undefined);
  };

  return (
    <div className="dog-photo-picker">
      <div className="d-flex align-items-center gap-3 flex-wrap">
        <DogPhotoThumb photoPath={value} alt={selected?.label} size={72} />
        <div className="d-flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline-primary"
            size="sm"
            disabled={disabled}
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-images me-1" aria-hidden="true" />
            Select dog image
          </Button>
          {value && (
            <Button
              type="button"
              variant="outline-secondary"
              size="sm"
              disabled={disabled}
              onClick={handleClear}
            >
              Clear
            </Button>
          )}
        </div>
        {selected && (
          <span className="small text-muted">{selected.label}</span>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Select dog image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="small text-muted mb-3">
            Choose a photo from the client gallery. The same images appear on the public landing page.
          </p>
          <div className="dog-photo-grid" role="listbox" aria-label="Dog photos">
            {HERO_PHOTOS.map((photo) => {
              const isSelected = value === photo.full;
              return (
                <button
                  key={photo.full}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`dog-photo-grid-cell${isSelected ? ' is-selected' : ''}`}
                  onClick={() => handleSelect(photo.full)}
                >
                  <img
                    src={heroPhotoSrc(photo.thumb)}
                    alt={photo.alt}
                    width={80}
                    height={80}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="dog-photo-grid-label">{photo.label}</span>
                </button>
              );
            })}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export { DogPhotoThumb };
