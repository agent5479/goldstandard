import {
  BOOKING_BRING_ITEMS,
  BOOKING_BRING_PROVIDED_NOTE,
  BOOKING_CALENDAR_NOTE,
} from '../data/bookingConfirmation';

/** Checklist and preparation notes shown after a booking is confirmed. */
export default function BookingConfirmationDetails() {
  return (
    <div className="booking-confirmation-details">
      <section className="booking-confirmation-block">
        <h4>Add to your calendar</h4>
        <p>{BOOKING_CALENDAR_NOTE}</p>
      </section>

      <section className="booking-confirmation-block">
        <h4>What to bring</h4>
        <ul>
          {BOOKING_BRING_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="form-hint">{BOOKING_BRING_PROVIDED_NOTE}</p>
      </section>
    </div>
  );
}
