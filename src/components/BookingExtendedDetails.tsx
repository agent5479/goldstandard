import {
  BOOKING_SKILL_ITEMS,
  BOOKING_TAG_DETAIL_FIELDS,
  BOOKING_TAG_DETAIL_IDS,
  CLIENT_BOOKING_OPTIONAL_TAG_GROUPS,
  CLIENT_SKILL_GRADE_LABELS,
  type ClientProfileTagNotes,
  type ClientProfileTags,
  type ClientSkillGrades,
} from '../data/bookingSelfAssessment';

interface BookingExtendedDetailsProps {
  skillGrades: ClientSkillGrades;
  profileTags: ClientProfileTags;
  profileTagNotes: ClientProfileTagNotes;
  onSkillGradeChange: (focusId: string, grade: number | undefined) => void;
  onProfileTagToggle: (tagId: string) => void;
  onProfileTagNoteChange: (tagId: string, text: string) => void;
  disabled?: boolean;
}

export default function BookingExtendedDetails({
  skillGrades,
  profileTags,
  profileTagNotes,
  onSkillGradeChange,
  onProfileTagToggle,
  onProfileTagNoteChange,
  disabled,
}: BookingExtendedDetailsProps) {
  const detailTags = profileTags.filter((id) => BOOKING_TAG_DETAIL_IDS.includes(id));
  return (
    <details className="booking-extended-details">
      <summary>Optional — tell us more about your dog</summary>
      <div className="booking-extended-body">
        <p className="form-hint">
          Your best guess helps Warwick prepare — not a test. Skip anything you are unsure about.
        </p>

        <h4 className="booking-extended-heading">Where is your dog at? (1 = not started → 5 = very solid)</h4>
        {BOOKING_SKILL_ITEMS.map((skill) => {
          const current = skillGrades[skill.id];
          return (
            <div key={skill.id} className="booking-skill-row">
              <div className="booking-skill-label">
                <strong>{skill.name}</strong>
                <span className="form-hint">{skill.description}</span>
              </div>
              <div className="booking-grade-buttons" role="group" aria-label={`${skill.name} self grade`}>
                {[1, 2, 3, 4, 5].map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    className={`booking-grade-btn${current === grade ? ' is-selected' : ''}`}
                    disabled={disabled}
                    aria-pressed={current === grade}
                    title={CLIENT_SKILL_GRADE_LABELS[grade]}
                    onClick={() => onSkillGradeChange(skill.id, current === grade ? undefined : grade)}
                  >
                    {grade}
                  </button>
                ))}
              </div>
              {current != null && (
                <p className="form-hint booking-grade-hint">{CLIENT_SKILL_GRADE_LABELS[current]}</p>
              )}
            </div>
          );
        })}

        <h4 className="booking-extended-heading">Size, temperament &amp; triggers</h4>
        <p className="form-hint">Tap any that apply.</p>
        {CLIENT_BOOKING_OPTIONAL_TAG_GROUPS.map((group) => (
          <div key={group.label} className="booking-tag-group">
            <span className="booking-tag-group-label">{group.label}</span>
            <div className="booking-tag-list">
              {group.tags.map((tag) => {
                const selected = profileTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    className={`booking-tag-btn${selected ? ' is-selected' : ''}`}
                    disabled={disabled}
                    aria-pressed={selected}
                    onClick={() => onProfileTagToggle(tag.id)}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {detailTags.length > 0 && (
          <div className="booking-tag-details">
            <h4 className="booking-extended-heading">A bit more detail</h4>
            {detailTags.map((tagId) => {
              const field = BOOKING_TAG_DETAIL_FIELDS[tagId];
              if (!field) return null;
              return (
                <div key={tagId} className="form-field">
                  <label htmlFor={`bookTagNote-${tagId}`}>{field.label}</label>
                  <textarea
                    id={`bookTagNote-${tagId}`}
                    disabled={disabled}
                    value={profileTagNotes[tagId] || ''}
                    placeholder={field.placeholder}
                    onChange={(e) => onProfileTagNoteChange(tagId, e.target.value)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </details>
  );
}
