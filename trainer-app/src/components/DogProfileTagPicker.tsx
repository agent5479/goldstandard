import { Badge, Form } from 'react-bootstrap';
import {
  DOG_PROFILE_TAG_DETAIL_FIELDS,
  DOG_PROFILE_TAG_GROUPS,
  getDogProfileTag,
  toggleProfileTag,
  type DogProfileTagId,
} from '@/data/dogProfileTags';
import type { ProfileTagNotes } from '@/utils/profileTagNotes';

interface DogProfileTagPickerProps {
  value: DogProfileTagId[] | undefined;
  onChange: (tags: DogProfileTagId[]) => void;
  tagNotes?: ProfileTagNotes;
  onTagNotesChange?: (notes: ProfileTagNotes | undefined) => void;
  disabled?: boolean;
  /** When set, life stage tags are managed from age and shown as read-only in the picker. */
  autoLifeStage?: DogProfileTagId | null;
  /** Hide intro copy when parent section provides its own header. */
  hideIntro?: boolean;
  /** Compact chips only — no group headings */
  summaryOnly?: boolean;
}

export function DogProfileTagsSummary({
  tags,
  tagNotes,
  className = '',
  max = 8,
}: {
  tags: DogProfileTagId[] | undefined;
  tagNotes?: ProfileTagNotes;
  className?: string;
  max?: number;
}) {
  const list = tags || [];
  if (list.length === 0) return null;
  const shown = list.slice(0, max);
  const extra = list.length - shown.length;
  return (
    <div className={`d-flex flex-wrap gap-1 ${className}`.trim()}>
      {shown.map((id) => {
        const tag = getDogProfileTag(id);
        return (
          <Badge key={id} bg={tag?.variant || 'secondary'} className="small">
            {tag?.label || id}
          </Badge>
        );
      })}
      {extra > 0 && <Badge bg="light" text="dark" className="small">+{extra}</Badge>}
      {tagNotes && shown.some((id) => tagNotes[id]?.trim()) && (
        <span className="small text-muted ms-1">· details on file</span>
      )}
    </div>
  );
}

export function DogProfileTagPicker({
  value,
  onChange,
  tagNotes,
  onTagNotesChange,
  disabled = false,
  autoLifeStage = null,
  hideIntro = false,
  summaryOnly = false,
}: DogProfileTagPickerProps) {
  const tags = value || [];

  if (summaryOnly) {
    return <DogProfileTagsSummary tags={tags} tagNotes={tagNotes} />;
  }

  const setTags = (next: DogProfileTagId[]) => onChange(next);

  const toggleTag = (groupId: string, tagId: DogProfileTagId) => {
    if (disabled) return;
    if (autoLifeStage && groupId === 'life_stage') return;
    const next = toggleProfileTag(tags, tagId);
    setTags(next);
    if (onTagNotesChange && tagNotes?.[tagId] && !next.includes(tagId)) {
      const { [tagId]: _removed, ...rest } = tagNotes;
      onTagNotesChange(Object.keys(rest).length > 0 ? rest : undefined);
    }
  };

  const detailTags = tags.filter((id) => DOG_PROFILE_TAG_DETAIL_FIELDS[id]);

  const updateTagNote = (tagId: DogProfileTagId, text: string) => {
    if (!onTagNotesChange) return;
    const next = { ...(tagNotes || {}), [tagId]: text };
    if (!text.trim()) delete next[tagId];
    onTagNotesChange(Object.keys(next).length > 0 ? next : undefined);
  };

  return (
    <div className="dog-profile-tag-picker">
      {!hideIntro && (
        <p className="small text-muted mb-3">
          Select all that apply — size, temperament, triggers, and motivation. Life stage is set from age above when parseable.
        </p>
      )}

      {DOG_PROFILE_TAG_GROUPS.map((group) => (
        <div key={group.id} className="dog-profile-tag-group mb-3 pb-3">
          <h6 className="text-muted mb-2">
            {group.icon && <i className={`bi ${group.icon} me-1`} />}
            {group.label}
            {group.id === 'life_stage' && autoLifeStage && (
              <span className="fw-normal small ms-1">(from age)</span>
            )}
          </h6>
          <div className="d-flex flex-wrap gap-1">
            {group.tags.map((tag) => {
              const selected = group.id === 'life_stage' && autoLifeStage
                ? tag.id === autoLifeStage
                : tags.includes(tag.id);
              const isLocked = Boolean(disabled || (group.id === 'life_stage' && autoLifeStage));
              return (
                <Badge
                  key={tag.id}
                  bg={selected ? tag.variant : 'light'}
                  text={selected && tag.variant === 'warning' ? 'dark' : selected ? undefined : 'dark'}
                  role={isLocked ? undefined : 'button'}
                  className={isLocked ? '' : 'user-select-none'}
                  style={isLocked ? { cursor: 'default' } : { cursor: 'pointer' }}
                  title={group.id === 'life_stage' && autoLifeStage ? 'Set automatically from age' : tag.description}
                  onClick={isLocked ? undefined : () => toggleTag(group.id, tag.id)}
                >
                  {tag.label}
                </Badge>
              );
            })}
          </div>
        </div>
      ))}

      {tags.length > 0 && (
        <div className="dog-profile-tag-selected mt-2 pt-3">
          <small className="text-muted d-block mb-1">Selected ({tags.length})</small>
          <DogProfileTagsSummary tags={tags} tagNotes={tagNotes} max={20} />
        </div>
      )}

      {detailTags.length > 0 && onTagNotesChange && (
        <div className="dog-profile-tag-details mt-3 pt-3">
          <h6 className="text-muted mb-2">
            <i className="bi bi-journal-text me-1" aria-hidden="true" />
            Tag details
          </h6>
          <p className="small text-muted mb-3">
            Add context for selected tags — age is set above; training focus uses Training priorities.
          </p>
          {detailTags.map((tagId) => {
            const field = DOG_PROFILE_TAG_DETAIL_FIELDS[tagId];
            const tag = getDogProfileTag(tagId);
            if (!field) return null;
            return (
              <Form.Group key={tagId} className="mb-3">
                <Form.Label className="small fw-semibold">{field.label}</Form.Label>
                <Form.Text className="d-block mb-1 text-muted">{tag?.label}</Form.Text>
                <Form.Control
                  as="textarea"
                  rows={field.rows ?? 2}
                  disabled={disabled}
                  value={tagNotes?.[tagId] || ''}
                  onChange={(e) => updateTagNote(tagId, e.target.value)}
                  placeholder={field.placeholder}
                />
              </Form.Group>
            );
          })}
        </div>
      )}
    </div>
  );
}
