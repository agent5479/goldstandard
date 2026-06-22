import { useState } from 'react';
import { Card, Form, Row, Col, Button, Collapse } from 'react-bootstrap';
import { MapPicker } from '@/components/MapPicker';
import { DOG_MOBILITY_OPTIONS, type DogMobility } from '@/data/dogMobility';
import { labels, ownerStatusLabels } from '@/data/terminology';
import { HOUSEHOLD_TYPES } from '@/data/householdTypes';
import { BOOKING_LOCATIONS, BOOKING_MAP_CENTER } from '@/data/bookingLocations';
import type { Owner } from '@/types';
import type { HouseholdFormProps } from './types';

interface HouseholdContactSectionProps extends HouseholdFormProps {
  compact?: boolean;
}

export function HouseholdContactSection({
  form,
  isNew,
  compact = false,
  update,
  handleFieldBlur,
  persistOwner,
  handleLocationSelect,
}: HouseholdContactSectionProps) {
  const [showFullContact, setShowFullContact] = useState(!compact);

  const showExtendedFields = isNew || !compact || showFullContact;

  return (
    <Card className="mb-4 hub-panel">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>Contact & Address</span>
        {compact && !isNew && (
          <Button
            variant="link"
            size="sm"
            className="p-0"
            onClick={() => setShowFullContact((prev) => !prev)}
          >
            {showFullContact ? 'Show less' : labels.fullContactAndMap}
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Household name *</Form.Label>
              <Form.Control
                value={form.name || ''}
                onChange={(e) => update('name', e.target.value)}
                onBlur={(e) => handleFieldBlur({ name: e.target.value.trim() })}
                required
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                value={form.phone || ''}
                onChange={(e) => update('phone', e.target.value)}
                onBlur={() => handleFieldBlur()}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email || ''}
                onChange={(e) => update('email', e.target.value)}
                onBlur={() => handleFieldBlur()}
              />
            </Form.Group>
          </Col>
          <Col md={compact ? 12 : 6}>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                value={form.address || ''}
                onChange={(e) => update('address', e.target.value)}
                onBlur={() => handleFieldBlur()}
              />
            </Form.Group>
          </Col>
          <Col md={compact ? 12 : 6}>
            <Form.Group>
              <Form.Label>Preferred training location</Form.Label>
              <Form.Select
                value={form.preferredLocation || ''}
                onChange={(e) => handleLocationSelect(e.target.value)}
              >
                {BOOKING_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.name}>{loc.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={12}>
            <Collapse in={showExtendedFields}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Household type</Form.Label>
                    <Form.Select
                      value={form.householdType || 'single_dog'}
                      onChange={(e) => {
                        update('householdType', e.target.value);
                        if (!isNew) void persistOwner({ householdType: e.target.value });
                      }}
                    >
                      {Object.entries(HOUSEHOLD_TYPES).map(([key, info]) => (
                        <option key={key} value={key}>{info.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={form.status || 'active'}
                      onChange={(e) => {
                        const status = e.target.value as Owner['status'];
                        update('status', status);
                        if (!isNew) void persistOwner({ status });
                      }}
                    >
                      {Object.entries(ownerStatusLabels).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Mobility</Form.Label>
                    <Form.Select
                      value={form.mobility || ''}
                      onChange={(e) => {
                        const mobility = (e.target.value || undefined) as DogMobility | undefined;
                        update('mobility', mobility);
                        if (!isNew) void persistOwner({ mobility });
                      }}
                    >
                      <option value="">Select mobility…</option>
                      {DOG_MOBILITY_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </Form.Select>
                    {form.mobility && (
                      <Form.Text className="text-muted">
                        {DOG_MOBILITY_OPTIONS.find((o) => o.id === form.mobility)?.description}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Mobility notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={form.mobilityNotes || ''}
                      onChange={(e) => update('mobilityNotes', e.target.value)}
                      onBlur={() => handleFieldBlur()}
                      placeholder="Handler limitations, access needs, session pacing…"
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={form.notes || ''}
                      onChange={(e) => update('notes', e.target.value)}
                      onBlur={() => handleFieldBlur()}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Label>Map location</Form.Label>
                  <MapPicker
                    lat={form.latitude ?? BOOKING_MAP_CENTER[0]}
                    lng={form.longitude ?? BOOKING_MAP_CENTER[1]}
                    onChange={(lat, lng) => {
                      update('latitude', lat);
                      update('longitude', lng);
                      if (!isNew) void persistOwner({ latitude: lat, longitude: lng });
                    }}
                  />
                </Col>
              </Row>
            </Collapse>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
