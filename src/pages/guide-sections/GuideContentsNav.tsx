import { Link } from 'react-router-dom';
import { guideHref } from '@shared/guideHref';
import type { GuideModuleId } from '@shared/guideModules';

interface ContentsLink {
  anchor: string;
  label: string;
  moduleId: GuideModuleId;
  group: string;
}

const CONTENTS_LINKS: ContentsLink[] = [
  { moduleId: 'foundation', group: '🏛️ Foundation', anchor: 'pillars', label: '🏆 Four pillars' },

  { moduleId: 'leadership', group: '👤 Leadership', anchor: 'owner-mindset', label: '👤 Owner mindset' },
  { moduleId: 'leadership', group: '👤 Leadership', anchor: 'new-baseline', label: '🧠 New baseline' },
  { moduleId: 'leadership', group: '👤 Leadership', anchor: 'implementing-baseline-shift', label: '🛠 Implementing the shift' },
  { moduleId: 'leadership', group: '👤 Leadership', anchor: 'expectations', label: '🎯 Expectations' },
  { moduleId: 'leadership', group: '👤 Leadership', anchor: 'go-get-recall', label: '🦴 Go-get recall' },
  { moduleId: 'leadership', group: '👤 Leadership', anchor: 'im-over-it', label: "🛑 I'm over it" },
  { moduleId: 'leadership', group: '👤 Leadership', anchor: 'i-dont-care', label: "🎓 I don't care (7+ months)" },
  { moduleId: 'leadership', group: '👤 Leadership', anchor: 'love-at-the-right-time', label: '❤️ Love at the right time' },
  { moduleId: 'leadership', group: '👤 Leadership', anchor: 'trust-not-just-love', label: '🤝 Trust, not just love' },
  { moduleId: 'leadership', group: '👤 Leadership', anchor: 'social-regulation', label: '🤝 Self-regulation (training mode)' },
  { moduleId: 'leadership', group: '👤 Leadership', anchor: 'speaking-aloud', label: '🗣️ Speak it aloud' },
  { moduleId: 'leadership', group: '👤 Leadership', anchor: 'cue-once', label: '1️⃣ Say it once' },
  { moduleId: 'leadership', group: '👤 Leadership', anchor: 'ready-stance', label: '🥋 Ready stance' },
  { moduleId: 'leadership', group: '👤 Leadership', anchor: 'dog-ready-stance', label: "🐕 Dog's ready stance" },
  { moduleId: 'leadership', group: '👤 Leadership', anchor: 'front-door', label: '🚪 Front door' },
  { moduleId: 'leadership', group: '👤 Leadership', anchor: 'home-return', label: '🏠 Coming home' },
  { moduleId: 'leadership', group: '👤 Leadership', anchor: 'dog-tantra', label: '🌀 Dog-Tantra (shared flow)' },

  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'reading-dog', label: '📖 Reading your dog' },
  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'dog-tantra-reading', label: '🌀 Somatic reading' },
  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'three-second-pause', label: '⏸️ Three-second pause' },
  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'touch-saturation', label: '🖐️ Touch saturation' },
  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'learned-helplessness', label: '🥀 Learned helplessness' },
  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'context-of-contact', label: '🛋️ Context of contact' },
  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'breed-temperament', label: '🐾 Breed variance' },
  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'common-pitfalls', label: '⚠️ Common pitfalls' },
  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'pushy-space-games', label: '👊 Pushy space games' },
  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'symptom-glossary', label: '📋 Symptom glossary' },
  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'trauma-signals', label: '💙 Trauma signals' },
  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'trauma-vs-hardship', label: '⚖️ Trauma vs hardship' },
  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'true-canine-trauma', label: '🔊 True canine trauma' },
  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'eight-week-separation', label: '🐶 8-week separation' },
  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'trauma-hardship-calibration', label: '📏 Correction scale' },
  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'pack-guarding', label: '🚪 Pack guarding' },
  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'rehabilitation-patterns', label: '🔄 Rehabilitation patterns' },
  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'behavior-driver-calibration', label: '🔍 Driver calibration' },
  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'pattern-playbook-table', label: '📋 Pattern playbook' },
  { moduleId: 'understanding', group: '🧠 Understanding', anchor: 'symptom-expression-index', label: '📋 Symptom index' },

  { moduleId: 'social', group: '🐕‍🦺 Social needs', anchor: 'social-needs', label: '🐕‍🦺 Social world' },
  { moduleId: 'social', group: '🐕‍🦺 Social needs', anchor: 'dog-meetings', label: '🐕‍🦺 Dog meetings' },
  { moduleId: 'social', group: '🐕‍🦺 Social needs', anchor: 'dog-meetings-leash', label: '🔗 Leash until maturity' },
  { moduleId: 'social', group: '🐕‍🦺 Social needs', anchor: 'dominance-navigation', label: '🧭 Dominance navigation' },
  { moduleId: 'social', group: '🐕‍🦺 Social needs', anchor: 'social-friction', label: '⚡ Social friction signals' },
  { moduleId: 'social', group: '🐕‍🦺 Social needs', anchor: 'other-dog-ready-stance', label: '⚠️ Other dog braced' },
  { moduleId: 'social', group: '🐕‍🦺 Social needs', anchor: 'intact-muzzle-protocol', label: '🛡️ Intact & muzzles' },
  { moduleId: 'social', group: '🐕‍🦺 Social needs', anchor: 'master-dog', label: '🐕‍🦺 Master dog' },
  { moduleId: 'social', group: '🐕‍🦺 Social needs', anchor: 'intact-large-males', label: '🐕‍🦺 Intact large males' },
  { moduleId: 'social', group: '🐕‍🦺 Social needs', anchor: 'intact-health-baseline', label: '🩺 Intact health baseline' },
  { moduleId: 'social', group: '🐕‍🦺 Social needs', anchor: 'intact-three-paths', label: '🛤️ Three lifestyle paths' },
  { moduleId: 'social', group: '🐕‍🦺 Social needs', anchor: 'intact-social-penalty', label: '⚡ Social penalty' },
  { moduleId: 'social', group: '🐕‍🦺 Social needs', anchor: 'intact-environment-restrictions', label: '🌍 Shrunk world' },
  { moduleId: 'social', group: '🐕‍🦺 Social needs', anchor: 'biological-drive-fairness', label: '⚖️ Drive fairness' },
  { moduleId: 'social', group: '🐕‍🦺 Social needs', anchor: 'surgical-alternatives', label: '🩺 Surgical alternatives' },

  { moduleId: 'training', group: '⚡ Training', anchor: 'timing', label: '⏱️ Timing' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'rewards', label: '🦴 Rewards' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'treat-handler-reinforcement', label: '🎯 Treat reinforcement' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'corrections', label: '🛠️ Corrections overview' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'architecture-of-clarity', label: '⚖️ Architecture of clarity' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'conservation-of-force', label: '⚖️ Conservation of force' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'correction-praise-trap', label: '🔄 Correction-praise trap' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'expectation-of-excellence', label: '⭐ Expectation of excellence' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'unique-sound-touch', label: '⚡ Unique sound & touch' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'dog-language', label: '🗣️ Dog language & gruff correction' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'collar-selection', label: '🛡️ Collar selection' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'leash', label: '🦮 Leash & line' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'leash-accountability', label: '🧲 Choice to leave' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'leash-selection', label: '🧭 Leash selection' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'leash-weight', label: '⚓ Line weight & dangle' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'sniff-breaks', label: '👃 Sniff breaks' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'butt-push', label: '👋 Butt push' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'leash-jerk', label: '⬇️ Downward leash jerk' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'verbal-correction', label: '📢 Verbal correction' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'collar-snatch', label: '✋ Collar grab & forced sit' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'pin-hold', label: '⚠️ Pin & hold (advanced)' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'access', label: '🔓 Access training' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'baseline-expectation', label: '📏 Baseline expectation' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'controlled-crucible', label: '🔥 Controlled crucible' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'off-lead-intervention', label: '🛑 Off-lead intervention' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'road-safety', label: '🛣️ Road safety (rural NZ)' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'semantic-hijacking', label: '🚗 Car cue hijacking' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'car-protocol', label: '📐 Car protocol' },
  { moduleId: 'training', group: '⚡ Training', anchor: 'road-seven-months', label: '⏳ Seven-month road crucible' },

  { moduleId: 'puppy-phase', group: '🐶 Puppy phase', anchor: 'puppy-phase', label: '🐶 Puppy phase overview' },
  { moduleId: 'puppy-phase', group: '🐶 Puppy phase', anchor: 'puppy-age-stages', label: '📈 Age-appropriate stages' },
  { moduleId: 'puppy-phase', group: '🐶 Puppy phase', anchor: 'puppy-early-security', label: '🛡️ Early security' },
  { moduleId: 'puppy-phase', group: '🐶 Puppy phase', anchor: 'puppy-toilet-training', label: '🚽 Toilet training' },
  { moduleId: 'puppy-phase', group: '🐶 Puppy phase', anchor: 'puppy-daily-structure', label: '📅 Daily structure' },
  { moduleId: 'puppy-phase', group: '🐶 Puppy phase', anchor: 'puppy-nutrition-access', label: '🍽️ Nutrition & access' },
  { moduleId: 'puppy-phase', group: '🐶 Puppy phase', anchor: 'puppy-affection-motivation', label: '❤️ Affection & treats' },
  { moduleId: 'puppy-phase', group: '🐶 Puppy phase', anchor: 'puppy-behavior-design', label: '🧠 Behavioral design' },
  { moduleId: 'puppy-phase', group: '🐶 Puppy phase', anchor: 'puppy-long-leash-boundary', label: '🦮 Long-leash boundary' },
  { moduleId: 'puppy-phase', group: '🐶 Puppy phase', anchor: 'puppy-separation-rest', label: '🛏️ Separation & rest' },
  { moduleId: 'puppy-phase', group: '🐶 Puppy phase', anchor: 'puppy-mouthing-play', label: '🦷 Mouthing & play' },
  { moduleId: 'puppy-phase', group: '🐶 Puppy phase', anchor: 'puppy-check-in', label: '👁️ Puppy check-in' },
  { moduleId: 'puppy-phase', group: '🐶 Puppy phase', anchor: 'puppy-tracking', label: '📋 What to track' },
  { moduleId: 'puppy-phase', group: '🐶 Puppy phase', anchor: 'puppy-household-dynamics', label: '🏠 Household dynamics' },
  { moduleId: 'puppy-phase', group: '🐶 Puppy phase', anchor: 'puppy-guest-protocol', label: '👻 Ghost puppy baseline' },
  { moduleId: 'puppy-phase', group: '🐶 Puppy phase', anchor: 'puppy-planner', label: '📅 Puppy Planner' },

  { moduleId: 'daily-life', group: '🏠 Daily life', anchor: 'check-in-seven', label: '👁️ 7-second check-in' },
  { moduleId: 'daily-life', group: '🏠 Daily life', anchor: 'daily', label: '📅 Daily practice' },
  { moduleId: 'daily-life', group: '🏠 Daily life', anchor: 'graduation', label: '🎓 Graduation' },
];

function groupLinks(links: ContentsLink[]) {
  const groups: { label: string; links: ContentsLink[] }[] = [];
  for (const link of links) {
    const existing = groups.find((g) => g.label === link.group);
    if (existing) existing.links.push(link);
    else groups.push({ label: link.group, links: [link] });
  }
  return groups;
}

interface GuideContentsNavProps {
  moduleId?: GuideModuleId;
}

export default function GuideContentsNav({ moduleId }: GuideContentsNavProps) {
  const links = moduleId ? CONTENTS_LINKS.filter((l) => l.moduleId === moduleId) : CONTENTS_LINKS;
  const groups = groupLinks(links);

  return (
    <nav className="guide-contents-nav" aria-label="Guide sections">
      <div className="guide-contents-groups">
        {groups.map((group) => (
          <div className="guide-contents-group" key={group.label}>
            <p className="guide-contents-group-label">{group.label}</p>
            <ul className="guide-contents-list">
              {group.links.map((link) => (
                <li key={link.anchor}>
                  {moduleId ? (
                    <a href={`#${link.anchor}`}>{link.label}</a>
                  ) : (
                    <Link to={guideHref(link.anchor)}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

export const PUPPY_PHASE_NAV_LINKS = CONTENTS_LINKS.filter((link) => link.moduleId === 'puppy-phase');

export { CONTENTS_LINKS };
