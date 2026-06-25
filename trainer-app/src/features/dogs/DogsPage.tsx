import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, Card, Form, InputGroup } from 'react-bootstrap';
import { DogSummaryCard } from '@/components/DogSummaryCard';
import { useTenantData } from '@/contexts/TenantDataContext';
import { labels } from '@/data/terminology';
import { ALL_DOG_STAGES, DOG_TRAINING_STAGE_META, type DogTrainingStage } from '@/data/householdTypes';
import { getOwnerName, isDogArchived, matchesDogSearch, resolveDogTrainingStage } from '@/utils/householdHelpers';
import type { Dog } from '@/types';

function parseStageFilter(value: string | null): DogTrainingStage | null {
  if (!value) return null;
  return ALL_DOG_STAGES.includes(value as DogTrainingStage) ? (value as DogTrainingStage) : null;
}

export default function DogsPage() {
  const { data } = useTenantData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [stageFilter, setStageFilter] = useState<DogTrainingStage | null>(() => parseStageFilter(searchParams.get('stage')));

  useEffect(() => {
    setStageFilter(parseStageFilter(searchParams.get('stage')));
  }, [searchParams]);

  const toggleStageFilter = (stage: DogTrainingStage) => {
    const next = stageFilter === stage ? null : stage;
    setStageFilter(next);
    if (next) {
      setSearchParams({ stage: next }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const filteredDogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return data.dogs
      .filter((dog) => {
        const owner = data.owners.find((entry) => String(entry.id) === String(dog.ownerId));
        const stage = resolveDogTrainingStage(dog, owner);

        if (stageFilter) {
          return stage === stageFilter;
        }

        return showArchived ? isDogArchived(dog, owner) : !isDogArchived(dog, owner);
      })
      .filter((dog) => !query || matchesDogSearch(dog, query, getOwnerName(data, dog.ownerId)))
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [data, search, showArchived, stageFilter]);

  const grouped = useMemo(() => {
    const groups: Record<string, Dog[]> = {};
    filteredDogs.forEach((dog) => {
      const letter = (dog.name?.[0] || '#').toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(dog);
    });
    return groups;
  }, [filteredDogs]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2><i className="bi bi-dog me-2" />{labels.dogs}</h2>
      </div>

      <Row className="mb-3 g-2">
        <Col lg={8}>
          <InputGroup>
            <InputGroup.Text><i className="bi bi-search" /></InputGroup.Text>
            <Form.Control
              placeholder={labels.searchDogs}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          <div className="training-stage-filter-tags mt-2" role="group" aria-label={labels.filterByTrainingStage}>
            {ALL_DOG_STAGES.map((stage) => {
              const meta = DOG_TRAINING_STAGE_META[stage];
              const selected = stageFilter === stage;
              return (
                <button
                  key={stage}
                  type="button"
                  className={`training-stage-filter-tag${selected ? ' training-stage-filter-tag--active' : ''}`}
                  style={{ '--stage-color': meta.color } as CSSProperties}
                  aria-pressed={selected}
                  onClick={() => toggleStageFilter(stage)}
                >
                  <i className={`bi ${meta.icon}`} aria-hidden="true" />
                  {stage}
                </button>
              );
            })}
          </div>
        </Col>
        <Col lg={4} className="d-flex align-items-start align-items-lg-center pt-lg-0 pt-1">
          {!stageFilter && (
            <Form.Check
              type="switch"
              label={labels.showArchived}
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
            />
          )}
        </Col>
      </Row>

      <p className="text-muted">{filteredDogs.length} dog{filteredDogs.length !== 1 ? 's' : ''}</p>

      {Object.keys(grouped).sort().map((letter) => (
        <div key={letter} className="mb-4">
          <h5 className="letter-header">{letter}</h5>
          <Row className="g-3">
            {grouped[letter].map((dog) => (
              <Col key={String(dog.id)} md={6} lg={4}>
                <DogSummaryCard
                  dog={dog}
                  ownerId={String(dog.ownerId)}
                  owner={data.owners.find((owner) => String(owner.id) === String(dog.ownerId))}
                  ownerName={getOwnerName(data, dog.ownerId)}
                />
              </Col>
            ))}
          </Row>
        </div>
      ))}

      {filteredDogs.length === 0 && (
        <Card className="text-center p-5">
          <p className="text-muted mb-0">{labels.noDogs}</p>
        </Card>
      )}
    </div>
  );
}
