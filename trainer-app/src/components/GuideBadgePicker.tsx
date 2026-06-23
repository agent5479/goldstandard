import { Badge } from 'react-bootstrap';
import {
  EXAM_TOPICS,
  GUIDE_ANCHORS,
  GUIDE_GROUPS,
  ALL_FOCUS_ITEMS,
  guideAnchorUrl,
  getGuideGroup,
  getFocusById,
  PUBLIC_GUIDE_URL,
} from '@/data/assessmentTaxonomy';

interface GuideBadgePickerProps {
  guideTags: string[];
  examTopicGaps: string[];
  pinnedFocusIds: string[];
  onGuideTagsChange: (tags: string[]) => void;
  onExamTopicGapsChange: (topics: string[]) => void;
  onPinnedFocusChange: (ids: string[]) => void;
  readOnly?: boolean;
}

function toggleItem(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export function GuideBadgePicker({
  guideTags,
  examTopicGaps,
  pinnedFocusIds,
  onGuideTagsChange,
  onExamTopicGapsChange,
  onPinnedFocusChange,
  readOnly = false,
}: GuideBadgePickerProps) {
  return (
    <div className="guide-badge-picker">
      <p className="small text-muted mb-3">
        Record what this household has <strong>shown you in session or affirmed in conversation</strong> — not
        just that they&apos;ve heard the theory, but that they can deliver the practice. Tags link to the public
        guide at{' '}
        <a href={PUBLIC_GUIDE_URL} target="_blank" rel="noopener noreferrer">{PUBLIC_GUIDE_URL}</a>.
      </p>

      <div className="mb-4">
        <h6 className="text-muted mb-1">
          <i className="bi bi-bookmark-check me-1" />
          Guide principles in practice
        </h6>
        <p className="small text-muted mb-2">
          Tick guide topics you&apos;ve seen land with this handler — cue-once, ready stance, access training,
          leash jerk, timing, and the rest.
        </p>
        {GUIDE_GROUPS.map((group) => {
          const anchors = GUIDE_ANCHORS.filter((a) => a.groupId === group.id);
          if (anchors.length === 0) return null;
          return (
            <div key={group.id} className="mb-3">
              <div className="small fw-semibold text-muted mb-2">
                {group.icon && <i className={`bi ${group.icon} me-1`} />}
                {group.label}
              </div>
              <div className="d-flex flex-wrap gap-1">
                {anchors.map((anchor) => {
                  const selected = guideTags.includes(anchor.id);
                  return (
                    <Badge
                      key={anchor.id}
                      bg={selected ? 'primary' : 'light'}
                      text={selected ? undefined : 'dark'}
                      role={readOnly ? undefined : 'button'}
                      className={readOnly ? '' : 'user-select-none'}
                      style={readOnly ? undefined : { cursor: 'pointer' }}
                      onClick={readOnly ? undefined : () => onGuideTagsChange(toggleItem(guideTags, anchor.id))}
                    >
                      {anchor.icon && <i className={`bi ${anchor.icon} me-1`} />}
                      {anchor.label}
                      {selected && !readOnly && (
                        <a
                          href={guideAnchorUrl(anchor.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white ms-1"
                          onClick={(e) => e.stopPropagation()}
                          title="Open in guide"
                        >
                          <i className="bi bi-box-arrow-up-right" />
                        </a>
                      )}
                    </Badge>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-4">
        <h6 className="text-muted mb-1">
          <i className="bi bi-pin-angle me-1" />
          Pinned focus (graduation skills)
        </h6>
        <p className="small text-muted mb-2">
          Skills you&apos;re actively working toward proof with this household.
        </p>
        <div className="d-flex flex-wrap gap-1">
          {ALL_FOCUS_ITEMS.filter((f) => f.category === 'Skills' || f.common).map((focus) => {
            const id = String(focus.id);
            const selected = pinnedFocusIds.includes(id);
            return (
              <Badge
                key={id}
                bg={selected ? 'success' : 'light'}
                text={selected ? undefined : 'dark'}
                role={readOnly ? undefined : 'button'}
                style={readOnly ? undefined : { cursor: 'pointer' }}
                onClick={readOnly ? undefined : () => onPinnedFocusChange(toggleItem(pinnedFocusIds, id))}
              >
                {focus.name}
              </Badge>
            );
          })}
        </div>
      </div>

      <div className="mb-3">
        <h6 className="text-muted mb-1">
          <i className="bi bi-mortarboard me-1" />
          Topic gaps (theory not yet solid)
        </h6>
        <p className="small text-muted mb-2">
          Optional — areas where understanding still needs work; not the same as practice demonstrated above.
        </p>
        <div className="d-flex flex-wrap gap-1">
          {EXAM_TOPICS.filter((t) => t.ownerRelevant).map((topic) => {
            const selected = examTopicGaps.includes(topic.id);
            return (
              <Badge
                key={topic.id}
                bg={selected ? 'warning' : 'light'}
                text="dark"
                role={readOnly ? undefined : 'button'}
                style={readOnly ? undefined : { cursor: 'pointer' }}
                onClick={readOnly ? undefined : () => onExamTopicGapsChange(toggleItem(examTopicGaps, topic.id))}
              >
                {topic.label}
              </Badge>
            );
          })}
        </div>
      </div>

      {(guideTags.length > 0 || examTopicGaps.length > 0 || pinnedFocusIds.length > 0) && (
        <div className="mt-3 pt-2 border-top">
          <small className="text-muted d-block mb-1">Selected summary</small>
          <div className="d-flex flex-wrap gap-1">
            {guideTags.map((id) => {
              const anchor = GUIDE_ANCHORS.find((a) => a.id === id);
              const group = anchor ? getGuideGroup(anchor.groupId) : undefined;
              return (
                <Badge key={`g-${id}`} bg="primary" className="small">
                  {group?.label}: {anchor?.label || id}
                </Badge>
              );
            })}
            {pinnedFocusIds.map((id) => (
              <Badge key={`f-${id}`} bg="success" className="small">
                Pin: {getFocusById(id)?.name || id}
              </Badge>
            ))}
            {examTopicGaps.map((id) => (
              <Badge key={`e-${id}`} bg="warning" text="dark" className="small">
                Gap: {EXAM_TOPICS.find((t) => t.id === id)?.label || id}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
