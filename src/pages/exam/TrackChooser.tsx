import { Link } from 'react-router-dom';

interface TrackChooserProps {
  onOwner: () => void;
  onTrainer: () => void;
}

export default function TrackChooser({ onOwner, onTrainer }: TrackChooserProps) {
  return (
    <section className="exam-step" id="exam-start" aria-labelledby="exam-start-heading">
      <h2 id="exam-start-heading" className="visually-hidden">Choose your exam</h2>
      <div className="exam-track-cards">
        <button className="exam-track-card" type="button" onClick={onOwner}>
          <span className="exam-track-icon">🏡</span>
          <span className="exam-track-title">Owner Exam</span>
          <span className="exam-track-desc">20 questions tuned to your dog. Select your breed and test the knowledge that matters most for your household.</span>
          <span className="exam-track-meta">~10 minutes · pass at 80%</span>
        </button>
        <button className="exam-track-card" type="button" onClick={onTrainer}>
          <span className="exam-track-icon">🥇</span>
          <span className="exam-track-title">Trainer Exam</span>
          <span className="exam-track-desc">40 questions across every condition, breed temperament, and signal in the guide — including correction calibration and escalation.</span>
          <span className="exam-track-meta">~20 minutes · pass at 80%</span>
        </button>
      </div>
      <p className="exam-start-hint">Everything in this exam comes from the <Link to="/guide">Client Reference Guide</Link> — read it first, or use the exam to find your gaps.</p>
    </section>
  );
}
