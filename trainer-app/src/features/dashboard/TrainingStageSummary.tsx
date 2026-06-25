import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card } from 'react-bootstrap';
import { labels } from '@/data/terminology';
import { ALL_DOG_STAGES } from '@/data/householdTypes';
import { countDogsByTrainingStage, dogTrainingStageBadge } from '@/utils/householdHelpers';
import type { TenantData } from '@/types';

interface TrainingStageSummaryProps {
  data: Pick<TenantData, 'dogs' | 'owners'>;
}

export function TrainingStageSummary({ data }: TrainingStageSummaryProps) {
  const counts = useMemo(() => countDogsByTrainingStage(data), [data]);

  return (
    <Card className="hub-panel training-stage-summary-card">
      <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <span><i className="bi bi-bar-chart-steps me-2" />{labels.dogsByTrainingStage}</span>
        <Link to="/dogs" className="small">{labels.viewAllDogs}</Link>
      </Card.Header>
      <Card.Body>
        <div className="training-stage-summary">
          {ALL_DOG_STAGES.map((stage) => (
            <div key={stage} className="training-stage-stat">
              <div className="training-stage-stat__count">{counts[stage]}</div>
              <Badge bg={dogTrainingStageBadge(stage)} className="training-stage-stat__badge">
                {stage}
              </Badge>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}
