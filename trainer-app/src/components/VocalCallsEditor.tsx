import { Badge, Form, Table } from 'react-bootstrap';
import {
  VOCAL_CALLS,
  getEffectiveVocalCall,
  vocalCallGuideUrl,
  type HouseholdVocalCalls,
  type VocalCallId,
} from '@/data/vocalCalls';

interface VocalCallsEditorProps {
  value: HouseholdVocalCalls;
  onChange: (calls: HouseholdVocalCalls) => void;
  onBlur?: () => void;
  readOnly?: boolean;
}

export function VocalCallsEditor({ value, onChange, onBlur, readOnly = false }: VocalCallsEditorProps) {
  const updateCall = (id: VocalCallId, phrase: string) => {
    const next = { ...value };
    if (!phrase) {
      delete next[id];
    } else {
      next[id] = phrase;
    }
    onChange(next);
  };

  const resetCall = (id: VocalCallId) => {
    const next = { ...value };
    delete next[id];
    onChange(next);
  };

  return (
    <div className="vocal-calls-editor">
      <p className="small text-muted mb-3">
        Record this household&apos;s chosen words for each function. Leave blank to use the guide default.
        One cue per function — aligned with{' '}
        <a href={vocalCallGuideUrl('cue-once')} target="_blank" rel="noopener noreferrer">say it once</a>.
      </p>
      <div className="table-responsive">
        <Table size="sm" className="mb-0 align-middle vocal-calls-table">
          <thead>
            <tr>
              <th>Function</th>
              <th>Guide default</th>
              <th>Household call</th>
              {!readOnly && <th className="text-end" style={{ width: '4rem' }} />}
            </tr>
          </thead>
          <tbody>
            {VOCAL_CALLS.map((def) => {
              const custom = value[def.id]?.trim();
              const effective = getEffectiveVocalCall(def.id, value);
              return (
                <tr key={def.id}>
                  <td>
                    <div className="fw-semibold small">{def.label}</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>{def.description}</div>
                    {def.guideAnchor && (
                      <a
                        href={vocalCallGuideUrl(def.guideAnchor)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="small"
                      >
                        Guide ↗
                      </a>
                    )}
                  </td>
                  <td>
                    <Badge bg="light" text="dark" className="font-monospace">
                      {def.defaultCall}
                    </Badge>
                  </td>
                  <td>
                    {readOnly ? (
                      <span className={custom ? 'fw-semibold' : 'text-muted'}>{effective}</span>
                    ) : (
                      <Form.Control
                        size="sm"
                        value={value[def.id] || ''}
                        placeholder={def.defaultCall}
                        onChange={(e) => updateCall(def.id, e.target.value)}
                        onBlur={onBlur}
                        className="font-monospace"
                      />
                    )}
                    {custom && (
                      <Form.Text className="text-success">Custom — uses &ldquo;{effective}&rdquo;</Form.Text>
                    )}
                  </td>
                  {!readOnly && (
                    <td className="text-end">
                      {custom && (
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 text-muted"
                          onClick={() => resetCall(def.id)}
                          title="Reset to default"
                        >
                          Reset
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

/** Compact read-only chip row for household cards or session context. */
export function VocalCallsSummary({ value }: { value?: HouseholdVocalCalls }) {
  const customized = VOCAL_CALLS.filter((def) => value?.[def.id]?.trim());
  if (customized.length === 0) return null;
  return (
    <div className="d-flex flex-wrap gap-1 mt-1">
      {customized.slice(0, 4).map((def) => (
        <Badge key={def.id} bg="secondary" className="small font-monospace">
          {def.label.split(' / ')[0]}: {value![def.id]}
        </Badge>
      ))}
      {customized.length > 4 && (
        <Badge bg="light" text="dark" className="small">+{customized.length - 4} calls</Badge>
      )}
    </div>
  );
}
