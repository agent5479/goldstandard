import { useEffect, useRef } from 'react';
import BreedDetailContent from './BreedDetailContent';

interface BreedDetailSheetProps {
  breedName: string;
  breedKeys?: string[];
  onClose: () => void;
}

export default function BreedDetailSheet({ breedName, breedKeys = [], onClose }: BreedDetailSheetProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="intelligence-breed-sheet-root">
      <button
        type="button"
        className="intelligence-breed-sheet-backdrop"
        aria-label="Close breed details"
        onClick={onClose}
      />
      <div
        className="intelligence-breed-detail-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="intelligence-breed-sheet-title"
      >
        <div className="intelligence-breed-sheet-header">
          <p className="intelligence-breed-detail-title" id="intelligence-breed-sheet-title">
            {breedName}
          </p>
          <button
            ref={closeRef}
            type="button"
            className="intelligence-breed-sheet-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="intelligence-breed-sheet-body">
          <BreedDetailContent breedName={breedName} breedKeys={breedKeys} />
        </div>
      </div>
    </div>
  );
}
