# SEO entity map — Gold Standard Dog Training

Primary entity: **Gold Standard Dog Training — Dog Trainer in Golden Bay & Takaka**.

Core association: **dog training Golden Bay**.

Three layers:

- **Commercial** — homepage + root service URLs + areas + book/contact
- **Authority** — Client Reference Guide (depth, not sales brochure)
- **Tools** — Problem Finder, breed/education quizzes (separate cluster)

Do **not** create `/dog-training/` (homepage owns that intent) or `/dog-socialisation/` (supporting vocab on reactive page).

## One primary intent per URL

| URL | Existing SEO | Search intent | Target keyword | Semantic entities | Internal-link role | Commercial role | Canonical / index | Schema | Recommended metadata |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Title: Dog Trainer Golden Bay & Takaka \| Warwick Marshall; H1 = banner alt | Local commercial umbrella | dog training Golden Bay | Dog trainer, Golden Bay, Takaka, private coaching | Hub → all services, areas, tools, book | Primary commercial | Index; canonical `/` | LocalBusiness + WebSite | Title: Dog Training Golden Bay & Takaka \| Gold Standard Dog Training; H1: Dog Training in Golden Bay & Takaka; meta: Private dog training in Golden Bay and Takaka for puppies, obedience, recall, leash pulling, reactivity, behaviour and difficult cases. Structured coaching for dogs and their owners. |
| `/obedience-training` | Was `/services/everyday-obedience` brand H1 | Obedience / manners | dog obedience training Golden Bay | Sit, wait, heel, manners | ← home chips; → guide foundation; ↔ leash/recall/behaviour | Commercial | Index; new path | Service + Breadcrumb | Title: Dog Obedience Training Golden Bay & Takaka; H1: Dog Obedience Training in Golden Bay & Takaka |
| `/puppy-training` | Was `/services/puppy-training` | Puppy start | puppy training Golden Bay | Toilet, biting, crate, structure | ← home; → guide puppy-phase | Commercial | Index | Service + Breadcrumb | Title: Puppy Training Golden Bay & Takaka; H1: Puppy Training in Golden Bay & Takaka |
| `/leash-training` | Split from leash-recall-control | Pulling / loose leash | dog leash training Golden Bay | Pulling, loose leash, lunging on walks | ↔ recall; → guide leash/collar | Commercial | Index | Service + Breadcrumb | Title: Dog Leash Training Golden Bay & Takaka; H1: Dog Leash Training in Golden Bay & Takaka |
| `/recall-training` | Split from leash-recall-control | Won’t come / off-leash | dog recall training Golden Bay | Recall, come when called, off-leash | ↔ leash; → go-get recall | Commercial | Index | Service + Breadcrumb | Title: Dog Recall Training Golden Bay & Takaka; H1: Dog Recall Training in Golden Bay & Takaka |
| `/reactive-dog` | Was `/services/dog-social-calm` | Reactivity / other dogs | reactive dog training Golden Bay | Lunging, barking at dogs, fixation, socialisation | → guide social; book | Commercial | Index | Service + Breadcrumb | Title: Reactive Dog Training Golden Bay & Takaka; H1: Reactive Dog Training in Golden Bay |
| `/dog-behaviour` | Was `/services/home-manners` | Home behaviour problems | dog behaviour training Golden Bay | Door, jumping, barking, settle | → guide leadership/access | Commercial | Index | Service + Breadcrumb | Title: Dog Behaviour Training Golden Bay & Takaka; H1: Dog Behaviour Training in Golden Bay & Takaka |
| `/difficult-dogs` | Was `/services/rehabilitation` | Complex / anxiety / history | dog training difficult dogs Golden Bay | Anxiety, hard history, rehab | → guide understanding/rehab | Commercial | Index | Service + Breadcrumb | Title: Dog Training for Difficult Dogs \| Golden Bay; H1: Dog Training for Difficult or Complex Cases |
| `/owner-coaching` | Was `/services/owner-coaching` | Owner education / private | dog owner training Golden Bay | Handler coaching, impulse control | Supporting commercial | Commercial (secondary) | Index | Service + Breadcrumb | Title: Dog Owner Coaching Golden Bay & Takaka; H1: Owner Coaching — Learn to Train Your Dog |
| `/services` | Hub brand H1 | Service catalog | dog training services Golden Bay | Offer list | Hub → all commercial roots | Commercial hub | Index | WebPage + Breadcrumb | Title: Dog Training Services \| Golden Bay & Takaka; H1: Dog Training Services in Golden Bay & Takaka |
| `/problem-finder` | Modal only (no URL) | Symptom → path | what's wrong with my dog / dog training problem | Pulling, lunging, barking, jumping, recall, settle | Door → commercial + guide | Conversion tool | Index | SoftwareApplication | Title: What's Going On With Your Dog? \| Problem Finder; H1: What's going on with your dog? |
| `/areas` | Where we train | Geo hub | dog trainer Golden Bay areas | Golden Bay hierarchy | Hub → area pages | Local | Index | WebPage + Breadcrumb | Keep; strengthen geo hierarchy in lead |
| `/areas/golden-bay` | Dog Trainer Golden Bay | Primary geo | dog trainer Golden Bay | Golden Bay | ← services; → book | Local | Index | Place + Breadcrumb | Keep primary geo intent |
| `/areas/takaka` | Dog Trainer Takaka | Base town | dog trainer Takaka | Takaka, Rangihaeata | Local base | Local | Index | Place + Breadcrumb | Keep |
| `/areas/pohara` | Pohara | Coastal town | dog trainer Pohara | Pohara | Supporting geo | Local | Index | Place | Keep — genuine coverage |
| `/areas/nelson-bays` | Nelson Bays | Wider region | dog trainer Nelson Bays | Nelson Bays, Tasman | Supporting geo | Local | Index | Place | Keep — no `/areas/nelson` |
| `/areas/motueka` | Motueka | Town | dog trainer Motueka | Motueka | Supporting geo | Local | Index | Place | Keep |
| `/areas/richmond` | Richmond | Town | dog trainer Richmond NZ | Richmond, Tasman | Supporting geo | Local | Index | Place | Keep |
| `/guide` | Client guide | Authority hub | dog training guide / client guide | Method reference | Hub → modules; ← services | Authority | Index | WebPage + Breadcrumb | Title: Dog Training Client Guide \| Golden Bay; H1 keep principles framing |
| `/guide/foundation` | Module title only | Method foundations | dog training foundations / impulse control | Gold Standard Rule, pillars | ← obedience; → book | Authority | Index | Article + Breadcrumb | Attach conventional topic in title/H1 |
| `/guide/leadership` | Module | Handler leadership | dog owner mindset / household structure | Dog-Tantra, pack-leader energy | ← behaviour/owner | Authority | Index | Article + Breadcrumb | Gloss proprietary terms |
| `/guide/understanding` | Module | Reading behaviour | dog behaviour reading / anxiety | Symptom glossary, trauma vs hardship | ← difficult/reactive | Authority | Index | Article + Breadcrumb | Gloss + reverse CTA |
| `/guide/social` | Module | Dog-dog social | dog socialisation principles | Controlled Confrontation | ← reactive | Authority | Index | Article + Breadcrumb | Gloss + reverse CTA |
| `/guide/training` | Module | Technique depth | leash technique / corrections / timing | One-second rule, conservation of force | ← leash/recall | Authority | Index | Article + Breadcrumb | Gloss + reverse CTA |
| `/guide/puppy-phase` | Module | Puppy development | puppy structure / toilet training | Puppy check-in, expectations | ← puppy | Authority | Index | Article + Breadcrumb | Reverse CTA to /puppy-training |
| `/guide/daily-life` | Module | Maintenance | dog training daily practice | Check-in, graduation | Supporting authority | Authority | Index | Article + Breadcrumb | Soft book CTA |
| `/exam` | Knowledge exam NZ | Owner education quiz | dog training knowledge exam | Owner exam | Tools cluster | Tool | Index | SoftwareApplication | Breed/education keywords; CTA to training |
| `/intelligence` | Breed intelligence | Breed IQ/temperament | dog breed intelligence | Stanley Coren, temperament | Breed cluster | Tool | Index | SoftwareApplication | Not local commercial; CTA training |
| `/dog-personality` | Personality quiz | Playful breed vibe | what kind of dog am I | Archetype | Breed cluster | Tool | Index | SoftwareApplication | CTA training |
| `/breed-finder` | What dog should you get | Choosing a breed | what dog should I get / best dog breed for family | Lifestyle match | Breed cluster | Tool | Index | SoftwareApplication | CTA puppy/training |
| `/dog-selector` | Roles/mixes | Working role / mix | dog breed mix temperament | Roles, cultivation | Breed cluster | Tool | Index | SoftwareApplication | CTA training |
| `/equipment` | Kit HowTo | Equipment | Gentle Leader / dog training equipment | Collar, leash kit | Supporting | Supporting | Index | HowTo | Keep |
| `/about` | About Warwick | Trust / method | Warwick Marshall dog trainer | Dog-Tantra, pricing FAQ | Trust | Trust | Index | FAQPage | Keep; gloss Dog-Tantra |
| `/book` | Book | Conversion | book dog training Golden Bay | Booking | Conversion | Conversion | Index | WebPage | Keep |
| `/contact` | Contact | Enquiry | contact dog trainer Golden Bay | NAP | Conversion | Conversion | Index | WebPage | Keep |

### Legacy redirect URLs (prerender, noindex, omit from sitemap)

| Old URL | Redirects to | Notes |
| --- | --- | --- |
| `/services/everyday-obedience` | `/obedience-training` | MovedPage |
| `/services/puppy-training` | `/puppy-training` | MovedPage |
| `/services/leash-recall-control` | `/leash-training` | Prefer leash; recall linked from page |
| `/services/home-manners` | `/dog-behaviour` | MovedPage |
| `/services/dog-social-calm` | `/reactive-dog` | MovedPage |
| `/services/rehabilitation` | `/difficult-dogs` | MovedPage |
| `/services/owner-coaching` | `/owner-coaching` | MovedPage |

## Explicit non-pages

- `/dog-training/` — homepage owns this intent
- `/dog-socialisation/` — vocabulary on `/reactive-dog`
- Extra town doorway pages beyond the six genuine areas
- Keyword-stuffed `/glossary` doorway
- “Positive dog training” positioning pages that homogenise the method
- `/areas/nelson` (use Nelson Bays)

## Internal link matrix

- Home problem chips → `/leash-training`, `/reactive-dog`, `/dog-behaviour`, `/dog-behaviour` (jumping/barking), `/dog-behaviour` (settle), `/recall-training`, `/problem-finder`
- Home service cards → new root paths
- Service pages → matching guide anchors + related services + areas + book
- Guide modules → matching commercial page + book CTA
- Problem Finder → commercial URLs + guide anchors + book
- Breed tools → closing CTA to `/` or `/puppy-training`
- Areas → all commercial services + book
- Nav: Services, Areas, Guide, Tools (Problem Finder first), Book

## Source of truth

- Titles / meta / schema paths: `src/data/localSeo.ts`, `src/data/siteConfig.ts`
- Bodies: service pages, guide sections, homepage
- AI discovery: `public/llms.txt`
- Operator follow-ups: `reference/seo/SEO-FOLLOW-UPS.md`
- Search concept map: `reference/seo/GOLD-STANDARD-SEARCH-MAP.md`
