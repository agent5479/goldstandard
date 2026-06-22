import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSyncStatus } from '@/hooks/useSyncStatus';
import { syncManager } from '@/services/syncManager';
import { labels } from '@/data/terminology';

const statusIcons: Record<string, string> = {
  synced: 'bi-cloud-check',
  syncing: 'bi-cloud-arrow-up',
  offline: 'bi-cloud-slash',
  error: 'bi-cloud-exclamation',
};

const statusLabels: Record<string, string> = {
  synced: 'Synced',
  syncing: 'Syncing...',
  offline: 'Offline',
  error: 'Sync Error',
};

export function SyncStatusOverlay() {
  const { status, details, pendingCount } = useSyncStatus();
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const showActions = pendingCount > 0;

  return (
    <>
      <div className={`sync-status-overlay sync-status-${status}${showActions ? ' sync-status-expanded' : ''}`}>
        <i className={`bi ${statusIcons[status] || 'bi-cloud'} sync-status-icon`} />
        <div className="sync-status-content">
          <span className="sync-status-text">{statusLabels[status]}</span>
          {details && <span className="sync-status-details">{details}</span>}
        </div>
        {pendingCount > 0 && (
          <span className="sync-status-count badge bg-warning text-dark">{pendingCount}</span>
        )}
        {showActions && (
          <div className="sync-status-actions">
            <Button variant="outline-secondary" size="sm" onClick={() => syncManager.retryPendingChanges()}>
              {labels.retrySync}
            </Button>
            <Button variant="outline-danger" size="sm" onClick={() => setShowDiscardConfirm(true)}>
              {labels.discardSyncQueue}
            </Button>
          </div>
        )}
      </div>

      <Modal show={showDiscardConfirm} onHide={() => setShowDiscardConfirm(false)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title>{labels.discardSyncQueue}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="small">
          {labels.discardSyncQueueHint}
        </Modal.Body>
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
