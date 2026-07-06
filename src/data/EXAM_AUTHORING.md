# Exam question authoring guide

Questions live in `examQuestions.ts` and `examTraitQuestions.ts`. The **first option** is always correct; the engine shuffles at play time.

## Plain language

Write for mixed reading levels. Prefer short, concrete sentences. Use active voice and clear subjects (`Your dog…`, `You…`).

- **Stems** — one scenario, one question (~12–25 words for owner track). Prefer positive framing over “What should you NOT do?” when possible.
- **Options** — plain words first. Keep model terms only when they are the teaching point (e.g. *one-second window*, *life rewards*, *whale eye*, *go-get*, *ready stance*). Prefer “long staring” over abstract stacks like “attachment distortion.”
- **Explanations** — one or two short sentences: what to do and why. Same plain-language bar as options. Gold Standard voice (handler decides, permission before action, earned freedom) — not neutral textbook tone.

Technical terms stay where the guide requires them; introduce them in context, not as jargon stacks.

## Distractor rules

1. **No meta-distractors** — wrong options must sound like beliefs a real owner or trainer might hold. Never tag an option with exam metadata (`— not the guide`, `— as entitlement rather than earned access`, etc.).

2. **Substantive misreads** — each wrong option should reflect a specific error:
   - Too soft (indulgence, soothing during reaction, skipping structure)
   - Too harsh (flooding, cold withdrawal, maximum firmness)
   - Wrong timing (act after lunge, wait for maturity, correct too late)
   - Wrong tool (treats only, ignore, wrong equipment)

3. **Rich distractors** — each wrong option needs:
   1. A specific action or belief, and
   2. A compelling rationale that makes the belief sound reasonable to someone who has not read the guide.

   Wrong options should feel as considered as the correct answer — not a short label that is easy to discard. Do not pad with empty words; pad with **belief-level detail** (why an owner would choose this).

4. **Calibrated language** — avoid absurd absolutes in wrong options (`forever`, `always`, `never`, `every time`, `without exception`, `all dogs`). Plausible over-corrections are fine (`Keep them on-lead until you feel fully confident`).

5. **Match length and depth** — four options should be similar clause length and grammar. Wrong options should stay within about **80–150%** of the correct option’s word count (enforced by `npm run lint:exam`). If the correct answer has two clauses (action + why), wrong answers should too.

6. **Short stems** — one scenario, one question (~12–25 words for owner track).

## Breed and dedup metadata

| Field | Use |
|-------|-----|
| `breedNames` | Exact breed match for trait slots (`'Border Collie'`) |
| `profileTags` | Fires when breed suggested tags overlap |
| `sizeClasses` | `toy`, `small`, `giant` |
| `neuroticismMin` | `elevated` or `high` |
| `requiresIntact` | Fires only when owner selected Intact |
| `requiresNeutered` | Fires only when owner selected Neutered / spayed |
| `requiresMale` | Fires only when owner selected Male |
| `requiresStructureBuilding` | Fires only when structure is still building |
| `dedupGroup` | Prevents two questions on the same theme in one exam |

### Guide coverage

Every question's `guideLink` must resolve to a known anchor in `guideAnchors.ts` with substantive prose in the guide. Playbook questions for intact large males use `#intact-large-males-*` or `#intact-three-paths`.

### Voice

Explanations should reflect Gold Standard values from the client playbook — handler decides, permission before action, earned freedom, honest lifestyle tradeoffs — not neutral textbook tone. Use the same plain-language bar as stems and options.

### dedupGroup values

- `herding-eye-lock` — fixation timing / cyclist / heading stare
- `herding-face-gazing` — couch staring / attachment distortion from gazing
- `clingy-correction-warmth` — cold after correction / avoiding firmness
- `distraction-glance` — brief glance at distraction processing
- `lap-bed-access` — constant lap/bed access
- `stretch-bow-medical` — prayer position vs play bow
- `context-contact` — training vs living mode contact
- `whale-eye-response` — response to whale eye (not identification)
- `demanding-paw` — attention demand pawing
- `mean-mug-stare` — rigid handler-directed stare contest vs play
- `displacing-human` — body used to move handler (couch, wedge, steer lean)
- `sigh-context` — sigh with body state
- `pack-guarding` — bathroom follow / pack guard
- `intact-three-paths` — lifestyle path selection (Socialite / Sentinel / Containment)
- `intact-first-meeting` — off-lead during first dog meetings
- `large-mechanics` — ready stance at large mass
- `adulthood-pivot` — two-year handler mindset shift
- `large-intact-male-playbook` — intact large male building structure
- `trauma-vs-hardship` — trauma damages nervous system vs hardship builds character
- `true-canine-trauma` — acoustic overload, cargo shock, context shock
- `eight-week-separation` — puppy first nights / littermate security
- `pampered-hardship` — privileged dog needs intentional hardship
- `correction-diagnosis` — diagnose trauma vs hardship before collar grab
- `conservation-of-force` — prerequisite exposure before street corrections
- `correction-redirection` — follow-up mandate after interrupt
- `correction-praise-trap` — disobedience loop after correction-then-praise
- `expectation-of-excellence` — time buffer before praise after correction
- `intact-health-baseline` — intact health framing in this model
- `intact-social-penalty` — intact social friction costs
- `intact-environment-restrictions` — daycare, boarding, parks
- `biological-drive-fairness` — intact without outlets
- `surgical-alternatives` — vasectomy / hormone-sparing options

## Before / after examples

### Meta-distractor (bad)

```ts
options: [
  'Allow the brief processing window — step in only if fixation locks in',
  'Correct immediately every time the head turns — not the guide\'s frame for distraction processing',
  'Stop and wait until the dog looks away on its own every time — as entitlement rather than earned access on your terms',
  'Release off-lead to let the dog self-regulate — not the guide\'s frame for this',
],
```

### Substantive misreads (good)

```ts
options: [
  'Allow a brief look when the body stays loose — step in only if the dog stiffens, stares hard, or starts to vocalise',
  'Pop the leash each time the head turns, even when the body stays loose, so the dog never practises looking away',
  'Stop and wait until the dog looks away on its own before you move again, so it learns to choose focus',
  'Drop the lead so the dog can settle itself without handler structure in a busy setting',
],
```

### Thin distractor (bad — easy to rule out)

```ts
'Allow it — toy dogs cannot cause real harm at this size',
'Only when the feet leave the ground — wait for the full lunge',
```

### Rich distractor (good — action + rationale)

```ts
'Allow it for now — at this size the jump is more cute than dangerous, and guests usually enjoy the greeting',
'Wait until the feet leave the ground — early leash pops can make a herding dog more intense about the trigger',
```

### Absolute tell (bad)

```ts
'Never — all dogs must stay on-lead forever — a permanent ban that skips graduation',
```

### Plausible misread (good)

```ts
'Keep them on-lead until you feel fully confident — there is no fixed graduation point',
```

### Over-complex stem (bad)

```ts
text: 'You hold prolonged eye contact with your herding-type dog during calm time at home. What pitfall does the guide warn about?',
```

Prefer breed-named versions in trait pool; category universals use:

```ts
text: 'Why is long face-to-face staring risky with a visual, herding-type dog?',
```

## Validation

Run `npm run lint:exam` to catch banned patterns, absurd absolutes, option length imbalance, and negative-framed stems before committing.
