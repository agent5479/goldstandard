# Exam question authoring guide

Questions live in `examQuestions.ts` and `examTraitQuestions.ts`. The **first option** is always correct; the engine shuffles at play time.

## Distractor rules

1. **No meta-distractors** — wrong options must sound like beliefs a real owner or trainer might hold. Never tag an option with exam metadata (`— not the guide`, `— as entitlement rather than earned access`, etc.).

2. **Substantive misreads** — each wrong option should reflect a specific error:
   - Too soft (indulgence, soothing during reaction, skipping structure)
   - Too harsh (flooding, cold withdrawal, maximum firmness)
   - Wrong timing (act after lunge, wait for maturity, correct too late)
   - Wrong tool (treats only, ignore, wrong equipment)

3. **Calibrated language** — avoid absurd absolutes in wrong options (`forever`, `always`, `never`, `every time`, `without exception`, `all dogs`). Plausible over-corrections are fine (`Keep them on-lead until you feel fully confident`).

4. **Match length** — four options should be similar clause length and grammar. Do not make one option obviously shorter.

5. **Short stems** — one scenario, one question (~15–25 words for owner track).

## Breed and dedup metadata

| Field | Use |
|-------|-----|
| `breedNames` | Exact breed match for trait slots (`'Border Collie'`) |
| `profileTags` | Fires when breed suggested tags overlap |
| `sizeClasses` | `toy`, `small`, `giant` |
| `neuroticismMin` | `elevated` or `high` |
| `dedupGroup` | Prevents two questions on the same theme in one exam |

### dedupGroup values

- `herding-eye-lock` — fixation timing / cyclist / heading stare
- `herding-face-gazing` — couch staring / attachment distortion from gazing
- `clingy-correction-warmth` — cold after correction / avoiding firmness
- `distraction-glance` — brief glance at distraction processing
- `lap-bed-access` — constant lap/bed access

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
  'Allow the brief processing window — step in only if fixation locks in',
  'Pop the leash each time the head turns, even when the body stays loose',
  'Stop and wait until the dog looks away on its own before moving again',
  'Drop the lead so the dog can self-regulate without handler structure',
],
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
text: 'Why is extended face-to-face gazing risky with a visual, herding-type dog?',
```

## Validation

Run `npm run lint:exam` to catch banned patterns in wrong options before committing.
