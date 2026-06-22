import { useMemo, useState } from 'react';
import { Row, Col, Card, Form, InputGroup } from 'react-bootstrap';
import { DogSummaryCard } from '@/components/DogSummaryCard';
import { useTenantData } from '@/contexts/TenantDataContext';
import { labels } from '@/data/terminology';
import { getOwnerName, isDogArchived, matchesDogSearch } from '@/utils/householdHelpers';
import type { Dog } from '@/types';

export default function DogsPage() {
  const { data } = useTenantData();
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const filteredDogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return data.dogs
      .filter((dog) => {
        const owner = data.owners.find((entry) => String(entry.id) === String(dog.ownerId));
        return showArchived ? isDogArchived(dog, owner) : !isDogArchived(dog, owner);
      })
      .filter((dog) => !query || matchesDogSearch(dog, query, getOwnerName(data, dog.ownerId)))
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [data, search, showArchived]);

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
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text><i className="bi bi-search" /></InputGroup.Text>
            <Form.Control
              placeholder={labels.searchDogs}
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
