import { Card, Row, Col, Form } from 'react-bootstrap';
import { GuideBadgePicker } from '@/components/GuideBadgePicker';
import { SkillGradeSelect } from '@/components/SkillGradeSelect';
import { isHouseholdCompetencyFocus } from '@/data/trainingFocusAllocation';
import { OWNER_CAPACITY_DOMAINS, type OwnerCapacityDomain, type SkillGrade } from '@/data/assessmentTaxonomy';
import type { HouseholdFormProps } from './types';

interface HouseholdAssessmentSectionProps extends HouseholdFormProps {
  competencyAchievements: string[];
  onCompetencyAchievementChange: (ids: string[]) => void;
  onOwnerCapacityChange: (domain: OwnerCapacityDomain, grade: SkillGrade) => void;
}

export function HouseholdAssessmentSection({
  form,
  isNew,
  canEdit,
  update,
  persistOwner,
  competencyAchievements,
  onCompetencyAchievementChange,
  onOwnerCapacityChange,
}: HouseholdAssessmentSectionProps) {
  return (
    <>
      <Card className="mb-4 hub-panel">
        <Card.Header>
          <i className="bi bi-bookmark-check me-2" />
          Practice demonstrated — guide, skills &amp; pins
        </Card.Header>
        <Card.Body>
          <GuideBadgePicker
            guideTags={form.guideTags || []}
            examTopicGaps={form.examTopicGaps || []}
            pinnedFocusIds={form.pinnedFocusIds || []}
            competencyAchievementIds={competencyAchievements}
            onGuideTagsChange={(tags) => {
              update('guideTags', tags, false);
              if (!isNew) void persistOwner({ guideTags: tags });
            }}
            onExamTopicGapsChange={(topics) => {
              update('examTopicGaps', topics, false);
              if (!isNew) void persistOwner({ examTopicGaps: topics });
            }}
            onPinnedFocusChange={(ids) => {
              update('pinnedFocusIds', ids, false);
              if (!isNew) void persistOwner({ pinnedFocusIds: ids });
            }}
            onCompetencyAchievementsChange={(ids) => {
              if (isNew) {
                update('competencyAchievementIds', ids.filter(isHouseholdCompetencyFocus), false);
                return;
              }
              void onCompetencyAchievementChange(ids);
            }}
            readOnly={!canEdit}
          />
        </Card.Body>
      </Card>

      {(!isNew || canEdit) && (
        <Card className="mb-4 hub-panel">
          <Card.Header><i className="bi bi-person-check me-2" />Owner capacity</Card.Header>
          <Card.Body>
            {canEdit && (
              <p className="small text-muted mb-3">
                Grade how reliably this handler delivers each area in real sessions (1 = needs support → 4 = independent).
              </p>
            )}
            <Row className="g-3">
              {OWNER_CAPACITY_DOMAINS.map((domain) => (
                <Col md={6} key={domain.id}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold">{domain.label}</Form.Label>
                    <div className="small text-muted mb-1">{domain.description}</div>
                    {isNew ? (
                      <SkillGradeSelect
                        kind="owner"
                        value={form.ownerCapacity?.[domain.id]}
                        disabled={!canEdit}
                        onChange={(grade) =>
                          update('ownerCapacity', { ...(form.ownerCapacity || {}), [domain.id]: grade })
                        }
                      />
                    ) : (
                      <SkillGradeSelect
                        kind="owner"
                        value={form.ownerCapacity?.[domain.id]}
                        disabled={!canEdit}
                        onChange={(grade) => onOwnerCapacityChange(domain.id, grade)}
                      />
                    )}
                  </Form.Group>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}
    </>
  );
}
