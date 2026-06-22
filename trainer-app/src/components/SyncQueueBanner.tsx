import { useState } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import { useSyncStatus } from '@/hooks/useSyncStatus';
import { syncManager } from '@/services/syncManager';
import { labels } from '@/data/terminology';

export function SyncQueueBanner() {
  const { pendingCount } = useSyncStatus();
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  if (pendingCount <= 0) return null;

  return (
    <>
      <Alert variant="warning" className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <span className="small mb-0">
          <strong>{pendingCount} change{pendingCount !== 1 ? 's' : ''}</strong> failed to sync from this browser.
          {' '}{labels.discardSyncQueueHint}
        </span>
        <div className="d-flex flex-wrap gap-2">
          <Button variant="outline-secondary" size="sm" onClick={() => syncManager.retryPendingChanges()}>
            {labels.retrySync}
          </Button>
          <Button variant="danger" size="sm" onClick={() => setShowDiscardConfirm(true)}>
            {labels.discardSyncQueue}
          </Button>
        </div>
      </Alert>

      <Modal show={showDiscardConfirm} onHide={() => setShowDiscardConfirm(false)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title>{labels.discardSyncQueue}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="small">{labels.discardSyncQueueHint}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDiscardConfirm(false)}>Cancel</Button>
          <Button
            variant="danger"
            onClick={() => {
              syncManager.discardPendingChanges();
              setShowDiscardConfirm(false);
            }}
          >
            {labels.discardSyncQueue}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
