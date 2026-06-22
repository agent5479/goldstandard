import { useState, useMemo } from 'react';
import { Row, Col, Card, Form, Badge, InputGroup, Button, Modal } from 'react-bootstrap';
import { NavButton } from '@/components/NavButton';
import { useTenantData } from '@/contexts/TenantDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { mutate, tenantPath, activityActorFromUser } from '@/services/mutations';
import { labels, ownerStatusLabels } from '@/data/terminology';
import { VocalCallsSummary } from '@/components/VocalCallsEditor';
import { DogSummaryCard } from '@/components/DogSummaryCard';
import { GUIDE_ANCHORS, getFocusById } from '@/data/assessmentTaxonomy';
import { ARCHIVED_DOG_STAGE, HOUSEHOLD_TYPES } from '@/data/householdTypes';
import { getOwnerDogs, isDogArchived, ownerStatusBadge, resolveOwnerMobility } from '@/utils/householdHelpers';
import { mobilityLabel } from '@/data/dogMobility';
import type { Dog, Owner } from '@/types';

export default function HouseholdsPage() {
  const { data, setData } = useTenantData();
  const { user } = useAuth();
  const { can } = usePermissions();
  const canCreate = can('OWNER_CREATE');
  const canArchive = can('OWNER_UPDATE');
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<Owner | null>(null);
  const [archiving, setArchiving] = useState(false);

  const filteredOwners = useMemo(() => {
    return data.owners
      .filter((o) => (showArchived ? o.archived : !o.archived))
      .filter((o) => !search || o.name?.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [data.owners, search, showArchived]);

  const grouped = useMemo(() => {
    const groups: Record<string, Owner[]> = {};
    filteredOwners.forEach((owner) => {
      const letter = (owner.name?.[0] || '#').toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(owner);
    });
    return groups;
  }, [filteredOwners]);

  const handleArchive = async () => {
    if (!archiveTarget || !user?.tenantId || !canArchive) return;

    setArchiving(true);
    const ownerData: Owner = {
      ...archiveTarget,
      archived: true,
      status: 'archived',
      updatedAt: new Date().toISOString(),
    };

    try {
      await mutate(
        tenantPath(user.tenantId, 'owners', archiveTarget.id),
        ownerData,
        'owner_update',
        'set',
        () => {
          setData((prev) => ({
            ...prev,
            owners: prev.owners.map((owner) =>
              String(owner.id) === String(archiveTarget.id) ? ownerData : owner
            ),
          }));
        },
        user ? { actor: activityActorFromUser(user) } : undefined
      );

      const dogs = getOwnerDogs(data, String(archiveTarget.id)).filter((dog) => !isDogArchived(dog, archiveTarget));
      for (const dog of dogs) {
        const { status: _legacyStatus, ...dogWithoutStatus } = dog;
        const dogData: Dog = {
          ...dogWithoutStatus,
          trainingStage: ARCHIVED_DOG_STAGE,
          updatedAt: new Date().toISOString(),
        };
        await mutate(
          tenantPath(user.tenantId, 'dogs', dog.id),
          dogData,
          'dog_archive',
          'set',
          () => {
            setData((prev) => ({
              ...prev,
              dogs: prev.dogs.map((entry) => (String(entry.id) === String(dog.id) ? dogData : entry)),
            }));
          },
          user ? { actor: activityActorFromUser(user) } : undefined
        );
      }

      setArchiveTarget(null);
    } finally {
      setArchiving(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2><i className="bi bi-people me-2" />{labels.households}</h2>
        {canCreate && (
          <NavButton to="/households/new" variant="primary">
            <i className="bi bi-plus me-1" />{labels.addHousehold}
          </NavButton>
        )}
      </div>

      <Row className="mb-3 g-2">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text><i className="bi bi-search" /></InputGroup.Text>
            <Form.Control
              placeholder={labels.searchHouseholds}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6} className="d-flex align-items-center">
          <Form.Check
            type="switch"
            label={labels.showArchived}
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
          />
        </Col>
      </Row>

      <p className="text-muted">{filteredOwners.length} household{filteredOwners.length !== 1 ? 's' : ''}</p>

      {Object.keys(grouped).sort().map((letter) => (
        <div key={letter} className="mb-4">
          <h5 className="letter-header">{letter}</h5>
          <Row className="g-3">
            {grouped[letter].map((owner) => {
              const typeInfo = HOUSEHOLD_TYPES[owner.householdType as string] || HOUSEHOLD_TYPES.other;
              const dogs = getOwnerDogs(data, String(owner.id));
              const householdMobility = resolveOwnerMobility(owner, dogs);
              return (
                <Col key={String(owner.id)} md={6} lg={4}>
                  <Card className={`household-card h-100 ${owner.archived ? 'opacity-75' : ''}`}>
                    <Card.Body>
                      <div className="d-flex justify-content-between">
                        <Card.Title className="h6">
                          <i className={`bi ${typeInfo.icon} me-1`} style={{ color: typeInfo.color }} />
                          {owner.name}
                        </Card.Title>
                        {owner.archived && <Badge bg="secondary">{labels.archived}</Badge>}
                      </div>
                      <Card.Text className="small text-muted">
                        {owner.address || owner.phone || 'No contact details'}
                      </Card.Text>
                      <div className="d-flex gap-1 flex-wrap mb-2">
                        <Badge bg="light" text="dark">{typeInfo.name}</Badge>
                        {owner.status && (
                          <Badge bg={ownerStatusBadge(owner.status)}>{ownerStatusLabels[owner.status] || owner.status}</Badge>
                        )}
                        {householdMobility && (
                          <Badge bg="light" text="dark">{mobilityLabel(householdMobility)}</Badge>
                        )}
                        {(owner.guideTags || []).slice(0, 3).map((tagId) => {
                          const anchor = GUIDE_ANCHORS.find((a) => a.id === tagId);
                          return anchor ? (
                            <Badge key={tagId} bg="primary" className="small">{anchor.label}</Badge>
                          ) : null;
                        })}
                        {(owner.pinnedFocusIds || []).slice(0, 2).map((focusId) => {
                          const focus = getFocusById(focusId);
                          return focus ? (
                            <Badge key={focusId} bg="success" className="small">{focus.name}</Badge>
                          ) : null;
                        })}
                      </div>
                      {dogs.length > 0 && (
                        <div className="dog-mini-list mb-2">
                          {dogs.map((dog) => (
                            <DogSummaryCard
                              key={String(dog.id)}
                              dog={dog}
                              ownerId={String(owner.id)}
                              owner={owner}
                              compact
                            />
                          ))}
                        </div>
                      )}
                      <VocalCallsSummary value={owner.vocalCalls} />
                      {(owner.lastSession || owner.nextSession) && (
                        <Card.Text className="small mb-2">
                          {owner.lastSession && <span className="me-2">Last: {owner.lastSession}</span>}
                          {owner.nextSession && <span>Next: {owner.nextSession}</span>}
                        </Card.Text>
                      )}
                      <div className="d-flex flex-wrap gap-1">
                        <NavButton to={`/households/${owner.id}`} variant="outline-primary" size="sm">
                          View / Edit
                        </NavButton>
                        {canArchive && !owner.archived && (
                          <Button variant="outline-secondary" size="sm" onClick={() => setArchiveTarget(owner)}>
                            {labels.archiveHousehold}
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      ))}

      {filteredOwners.length === 0 && (
        <Card className="text-center p-5">
          <p className="text-muted">{labels.noHouseholds}</p>
          {canCreate && (
            <NavButton to="/households/new" variant="primary">{labels.addFirstHousehold}</NavButton>
          )}
        </Card>
      )}

      <Modal show={Boolean(archiveTarget)} onHide={() => setArchiveTarget(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{labels.archiveHousehold}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">{labels.archiveHouseholdConfirm}</p>
          {archiveTarget && <p className="fw-semibold mb-0">{archiveTarget.name}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setArchiveTarget(null)}>Cancel</Button>
          <Button variant="danger" disabled={archiving} onClick={() => void handleArchive()}>
            {archiving ? 'Archiving…' : labels.archiveHousehold}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
