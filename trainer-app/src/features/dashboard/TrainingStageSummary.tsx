import { useMemo, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { labels } from '@/data/terminology';
import { DOG_TRAINING_STAGES, DOG_TRAINING_STAGE_META } from '@/data/householdTypes';
import { countDogsByTrainingStage } from '@/utils/householdHelpers';
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
          {DOG_TRAINING_STAGES.map((stage) => {
            const meta = DOG_TRAINING_STAGE_META[stage];
            return (
              <Link
                key={stage}
                to={`/dogs?stage=${encodeURIComponent(stage)}`}
                className="training-stage-card text-decoration-none"
                style={{ '--stage-color': meta.color } as CSSProperties}
              >
                <div className="training-stage-card__icon">
                  <i className={`bi ${meta.icon}`} />
                </div>
                <div className="training-stage-card__count">{counts[stage]}</div>
                <div className="training-stage-card__label">{stage}</div>
              </Link>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
}
