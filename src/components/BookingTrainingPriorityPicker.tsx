import { CLIENT_BOOKING_TRAINING_PRIORITY_GROUP } from '../data/bookingSelfAssessment';

interface BookingTrainingPriorityPickerProps {
  profileTags: string[];
  disabled?: boolean;
  onToggle: (tagId: string) => void;
}

export default function BookingTrainingPriorityPicker({
  profileTags,
  disabled,
  onToggle,
}: BookingTrainingPriorityPickerProps) {
  return (
    <div className="booking-tag-group">
      <div className="booking-tag-list">
        {CLIENT_BOOKING_TRAINING_PRIORITY_GROUP.tags.map((tag) => {
          const selected = profileTags.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              className={`booking-tag-btn${selected ? ' is-selected' : ''}`}
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onToggle(tag.id)}
            >
              {tag.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
