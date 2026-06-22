import type { BreedCategory } from './breeds';

type SizeClass = 'toy' | 'small' | 'medium' | 'large' | 'giant';

/** Typical adult weight band and silhouette — morphological, not handling advice. */
export const SIZE_CLASS_APPEARANCE: Record<SizeClass, string> = {
  toy: 'Typically 1–5 kg — fine-boned, compact frame with delicate proportions.',
  small: 'Typically 4–10 kg — light frame with moderate bone; portable companion scale.',
  medium: 'Typically 10–25 kg — balanced athletic proportions with moderate bone and reach.',
  large: 'Typically 25–45 kg — deep chest, substantial bone, and longer stride length.',
  giant: 'Typically 45–80+ kg — massive bone and height; slow maturation to full adult size.',
};

/** Body-type silhouette when a breed has no dedicated entry. */
export const CATEGORY_BODY_APPEARANCE: Record<BreedCategory, string> = {
  clingy:
    'Athletic companion build — level topline, moderate angulation; retriever/spaniel or stocky bull-companion silhouettes with short to medium coat common.',
  sighthound:
    'Lean, long-legged sighthound silhouette — narrow head, deep chest, tucked waist, and light bone built for speed.',
  spitz:
    'Spitz silhouette — prick ears, fox-like head, dense double coat, and compact to medium proportions with a curled or plumed tail.',
  herding:
    'Agile working silhouette — quick direction changes; medium length muzzle, moderate bone, and weather-resistant coat common.',
  terrier:
    'Compact, muscular terrier frame — strong jaw, short back, and wiry or harsh coat in a smaller but dense package.',
  scenthound:
    'Scenthound silhouette — long muzzle, pendulous ears, and stamina-built body from beagle-medium to bloodhound-large.',
  guardian:
    'Powerful guardian silhouette — broad skull, deep chest, strong neck, and imposing shoulder line; short to medium dense coat.',
  giant:
    'Giant livestock or draft silhouette — heavy bone, broad chest, and substantial head; thick coat common in mountain types.',
  small:
    'Small companion silhouette — delicate bone, shorter muzzle common, and long or plush coat in many toy and lap types.',
};

/**
 * Per-breed physical appearance for mix/trait selection.
 * Format: weight band + build + distinctive aesthetic features.
 */
export const breedPhysicalAppearance: Record<string, string> = {
  // ── Clingy ──
  'Staffordshire Bull Terrier (Staffy)':
    '~11–17 kg. Stocky, square bull-type — broad head, short muzzle, wide chest, and short smooth coat; muscular for its height.',
  'American Staffordshire Terrier':
    '~25–32 kg. Medium-large athletic bull build — broad skull, defined muscle, short coat, and strong jaw; taller and leaner than Staffy.',
  'Pit Bull type':
    '~20–30 kg. Medium athletic bull-type — compact muscle, short coat, wide chest, and blocky head; build varies by line.',
  'American Bulldog':
    '~30–45 kg. Large, heavy-set bull build — broad head, thick neck, muscular shoulders, and short smooth coat.',
  'Labrador Retriever':
    '~25–36 kg. Medium-large retriever — otter tail, broad head, short dense waterproof coat, and athletic but stocky frame.',
  'Golden Retriever':
    '~25–34 kg. Medium-large retriever — feathered golden coat, friendly open expression, level topline, and balanced athletic build.',
  'Flat-Coated Retriever':
    '~25–32 kg. Large lean retriever — glossy flat black or liver coat, long head, and elegant athletic lines.',
  'Chesapeake Bay Retriever':
    '~25–36 kg. Sturdy retriever — wavy oily coat, broad chest, and powerful swimming build with yellow-amber eyes.',
  'Curly-Coated Retriever':
    '~25–32 kg. Tall retriever — tight curly coat, wedge-shaped head, and leaner lines than Labrador.',
  'Nova Scotia Duck Tolling Retriever':
    '~17–23 kg. Medium compact retriever — red or orange coat often with white markings, feathered tail, and agile frame.',
  Boxer:
    '~25–32 kg. Medium-large square build — brachycephalic muzzle, tight short coat, deep chest, and strong rear drive.',
  Vizsla:
    '~20–27 kg. Medium lean gundog — short golden-rust coat, minimal feathering, and light athletic silhouette.',
  'Wirehaired Vizsla':
    '~20–27 kg. Same scale as Vizsla — dense wiry golden coat, beard and eyebrows, and rugged athletic build.',
  Weimaraner:
    '~25–32 kg. Large elegant gundog — distinctive grey short coat, amber eyes, long legs, and deep chest.',
  'Cocker Spaniel':
    '~12–15 kg. Small-medium spaniel — long feathered ears, domed head, silky coat, and compact merry frame.',
  'Springer Spaniel':
    '~20–25 kg. Medium spaniel — longer legs than Cocker, feathered coat, and balanced working proportions.',
  'Brittany Spaniel':
    '~14–18 kg. Medium compact spaniel — short or wavy coat, often without tail, and light agile build.',
  'Clumber Spaniel':
    '~25–32 kg. Heavy low-set spaniel — massive head, long body, dense coat, and substantial bone for a spaniel.',
  'Field Spaniel':
    '~18–23 kg. Medium spaniel — longer low body, glossy coat, and heavier bone than Cocker.',
  'Pointer (English / GSP)':
    '~25–32 kg. Large athletic pointer — short coat (liver, black, or ticked), long muzzle, and rangy endurance build.',
  'German Wirehaired Pointer':
    '~25–32 kg. Large rugged pointer — wiry liver-and-white coat, beard, and solid working proportions.',
  'Irish Setter':
    '~27–32 kg. Large elegant setter — long silky red coat, feathering, and refined athletic lines.',
  'Gordon Setter':
    '~25–32 kg. Large setter — black-and-tan silky coat, heavier bone than Irish, and substantial frame.',
  'English Setter':
    '~25–30 kg. Large setter — speckled (belton) silky coat, feathered ears, and graceful rangy build.',
  'Hungarian Pointer':
    '~20–27 kg. Medium pointer (Vizsla family) — short russet coat, lean muscles, and light gundog silhouette.',
  'Portuguese Water Dog':
    '~16–27 kg. Medium-large curly-coated worker — dense non-shedding coat (curled or wavy), webbed feet, and strong swim build.',
  'Lagotto Romagnolo':
    '~11–16 kg. Medium compact curly coat — wooly waterproof fur, square head, and sturdy truffle-dog build.',
  Dalmatian:
    '~23–32 kg. Medium-large athletic dog — short white coat with black or liver spots, deep chest, and long legs.',
  'Poodle (Standard)':
    '~20–32 kg. Large elegant poodle — curly dense coat, long neck, fine head, and tall athletic square frame.',
  'Miniature Poodle':
    '~6–8 kg. Small square poodle — same curly coat and fine features as standard, scaled to companion size.',
  'Toy Poodle':
    '~2–4 kg. Toy fine-boned poodle — delicate frame, curly coat, and refined head; smallest poodle variant.',
  'Labradoodle / Groodle':
    '~23–30 kg typically. Medium-large cross — fleece, wool, or hair coat variable; often leggy retriever-poodle proportions.',
  'Cavoodle / Spoodle':
    '~5–10 kg typically. Small cross — soft wavy coat, round head, and compact Cavalier-poodle companion build.',
  Cockapoo:
    '~5–10 kg typically. Small cross — soft wavy coat, Cocker-sized frame, and floppy ears common.',
  Schnoodle:
    '~6–20 kg (size varies). Cross — wiry or soft coat; Miniature Schnauzer-poodle proportions common.',
  Bernedoodle:
    '~35–45 kg typically. Large cross — tri-colour fluffy coat, sturdy Bernese bone with poodle curl common.',
  'Retrodoodle / Sheepadoodle':
    '~25–40 kg typically. Large cross — shaggy Old English or Sheepdog coat texture with poodle cross variation.',
  'Bulldog (British)':
    '~23–25 kg. Medium heavy-set brachycephalic — wide chest, loose skin, pushed-in face, and short smooth coat.',
  'Bull Terrier':
    '~22–28 kg. Medium muscular unique head — egg-shaped skull, short tight coat, and stocky power build.',
  'Hungarian Pumi':
    '~8–13 kg. Small-medium curly-coated herding type — corkscrew coat, upright ears, and light agile square frame.',

  // ── Sighthounds ──
  Greyhound:
    '~27–32 kg. Large lean sighthound — deep chest, extreme tuck-up, long legs, and short smooth coat.',
  Whippet:
    '~9–14 kg. Medium-light sighthound — Greyhound in miniature; fine bone, deep chest, and silky coat.',
  'Italian Greyhound':
    '~3–5 kg. Toy sighthound — extremely fine bone, long legs, narrow head, and short glossy coat.',
  Saluki:
    '~18–27 kg. Medium-large sighthound — feathered ears and tail, graceful deep-chested build, and silky coat.',
  Borzoi:
    '~35–48 kg. Large elegant sighthound — long silky coat, narrow head, and tall rangy frame.',
  'Afghan Hound':
    '~23–27 kg. Large coated sighthound — long silky topknot and coat, ring tail, and aristocratic build.',
  'Irish Wolfhound':
    '~48–55 kg. Giant rough-coated sighthound — tallest breed type; wiry grey coat and long powerful legs.',
  'Scottish Deerhound':
    '~35–50 kg. Giant rough sighthound — wiry coat, smaller head than Wolfhound, and tall deep-chested frame.',
  Lurcher:
    'Variable cross — typically ~20–35 kg. Lean sighthound cross silhouette; coat and size depend on parent breeds.',
  'Staghound (NZ hunting type)':
    '~30–45 kg typically. NZ hunting cross — deep chest, long legs, short coat, and greyhound-deerhound type build.',
  'Pharaoh Hound':
    '~20–25 kg. Medium elegant sighthound — short tan coat, large upright ears, and fine athletic lines.',
  'Ibizan Hound':
    '~20–29 kg. Medium-large sighthound — tall upright ears, smooth or wire coat, and deer-like elegance.',
  Azawakh:
    '~15–25 kg. Medium lean sighthound — fine bone, short coat, and tall elegant West African silhouette.',
  Sloughi:
    '~18–28 kg. Medium sighthound — short smooth coat, long head, and racy athletic build similar to Azawakh.',

  // ── Herding ──
  'Border Collie':
    '~12–20 kg. Medium agile herder — moderate coat (smooth or rough), intense eye, and light quick build.',
  'NZ Heading Dog':
    '~25–35 kg. Large lean NZ worker — short smooth coat, long legs, and collie-type head; taller than Border Collie.',
  'NZ Huntaway':
    '~30–45 kg. Large deep-chested NZ worker — heavier than Heading Dog, short black-and-tan coat, and strong bark build.',
  'Rough / Smooth Collie':
    '~20–29 kg. Medium-large collie — long rough coat or short smooth; refined head and graceful neck.',
  'Bearded Collie':
    '~18–27 kg. Medium shaggy herder — long harsh grey or brown coat covering the whole body and tail.',
  'Australian Shepherd':
    '~18–29 kg. Medium stocky herder — merle or tricolour medium coat, bobtail common, and balanced athletic frame.',
  'Mini Australian Shepherd':
    '~9–18 kg. Small herder — same Aussie look scaled down; merle coat and compact agile build.',
  'Australian Cattle Dog (Blue Heeler)':
    '~15–22 kg. Medium compact heeler — short dense blue or red speckled coat, muscular and low-set.',
  Kelpie:
    '~14–20 kg. Medium lean worker — short coat, prick ears, and lighter frame than Huntaway; built for heat and speed.',
  Koolie:
    '~15–22 kg. Medium varied worker — coat length and colour vary; athletic working build similar to Kelpie.',
  'Shetland Sheepdog (Sheltie)':
    '~6–12 kg. Small collie lookalike — long rough coat, refined head, and fox-like alert expression.',
  'Old English Sheepdog':
    '~27–45 kg. Large shaggy herder — profuse grey-and-white coat obscuring eyes, bear-like shuffle gait.',
  'Welsh Corgi (Pembroke / Cardigan)':
    '~10–14 kg. Small long low herder — short legs, long body, fox head; Pembroke often tailless.',
  'Swedish Vallhund':
    '~9–14 kg. Small low herder — wolf-corgi silhouette; short legs, thick coat, and prick ears.',
  'Belgian Shepherd (Groenendael / Tervuren)':
    '~25–30 kg. Large elegant shepherd — long black or fawn coat (Groenendael/Tervuren), square build.',
  Briard:
    '~35–40 kg. Large coated herder — long wavy grey or tawny coat, beard, and substantial frame.',
  'Bouvier des Flandres':
    '~27–40 kg. Large rugged herder — harsh tousled coat, heavy beard, and powerful square build.',
  Puli:
    '~10–15 kg. Medium corded herder — distinctive corded coat covering the body; compact agile frame.',
  'Polish Lowland Sheepdog':
    '~14–23 kg. Medium shaggy herder — long dense coat, stocky build, and hidden eyes in fur.',
  'Border Collie x Huntaway':
    'Variable cross — typically medium-large; often black-and-white with Huntaway size or Collie agility.',
  'White Swiss Shepherd':
    '~30–40 kg. Large white shepherd — same lines as German Shepherd in white long or short coat.',

  // ── Spitz ──
  'Siberian Husky':
    '~16–27 kg. Medium spitz sled dog — dense double coat, mask markings, erect ears, and moderate bone.',
  'Alaskan Malamute':
    '~34–45 kg. Large heavy spitz — thick coat, broad head, and substantial freight-pulling bone.',
  Samoyed:
    '~16–30 kg. Medium-large spitz — pure white fluffy coat, smiling expression, and plumed tail.',
  'Shiba Inu':
    '~8–11 kg. Small fox-like spitz — tight red or sesame coat, curled tail, and compact square frame.',
  Basenji:
    '~9–11 kg. Small elegant African type — short tight coat, wrinkled forehead, and tightly curled tail.',
  Keeshond:
    '~16–18 kg. Medium spitz — thick grey-and-black ruff, spectacles markings, and plush coat.',
  'Norwegian Elkhound':
    '~20–25 kg. Medium spitz — dense grey coat, square build, and prick ears; sturdy hunting spitz.',
  'Finnish Lapphund':
    '~15–24 kg. Medium spitz — profuse coat, sweet expression, and slightly longer than wide proportions.',
  'Finnish Spitz':
    '~12–14 kg. Small-medium spitz — fox-red coat, sharp muzzle, and curled tail.',
  'German Spitz':
    '~7–18 kg (size variant). Small-medium spitz — fluffy off-standing coat, foxy face, and curled tail.',
  'Japanese Spitz':
    '~5–10 kg. Small spitz — pure white stand-off coat, small erect ears, and plumed tail.',
  Eurasier:
    '~18–32 kg. Medium-large spitz — thick coat in wolf-grey or red, balanced and calm silhouette.',
  Pomsky:
    '~9–18 kg typically. Cross — Husky markings on a smaller spitz frame; coat and size vary widely.',
  'Alaskan Klee Kai':
    '~4–10 kg. Small husky lookalike — miniaturised spitz markings, double coat, and fine bone.',

  // ── Terrier ──
  'Jack Russell Terrier':
    '~6–8 kg. Small terrier — mostly white with tan/black markings, short coat, and compact explosive build.',
  'Parson Russell Terrier':
    '~6–8 kg. Small terrier — longer legs than Jack Russell, square build, and short broken coat.',
  'Fox Terrier':
    '~7–8 kg. Small terrier — smooth or wire coat, long head, and lively narrow frame.',
  'Border Terrier':
    '~6–7 kg. Small otter-headed terrier — wiry coat, short muzzle, and flexible narrow build.',
  'Cairn Terrier':
    '~6–7 kg. Small shaggy terrier — harsh coat, short legs, and fox-like expression.',
  'West Highland White Terrier (Westie)':
    '~7–10 kg. Small white terrier — harsh white coat, compact body, and carrot tail.',
  'Scottish Terrier':
    '~8–10 kg. Small sturdy terrier — long beard, short legs, and distinctive silhouette.',
  'Airedale Terrier':
    '~23–29 kg. Large terrier — wiry tan coat with black saddle, long head, and substantial frame.',
  'Patterdale Terrier':
    '~5–6 kg. Small working terrier — smooth or rough coat, compact and very muscular for size.',
  'Lakeland Terrier':
    '~7–8 kg. Small narrow terrier — wiry coat, rectangular head, and leggy terrier build.',
  'Bedlington Terrier':
    '~8–10 kg. Small lamb-like terrier — arched back, crisp curly coat, and pear-shaped head.',
  'Manchester Terrier':
    '~5–10 kg. Small sleek terrier — tight smooth black-and-tan coat and elegant narrow build.',
  'Norfolk / Norwich Terrier':
    '~5–6 kg. Small hardy terrier — wiry coat; Norwich has prick ears, Norfolk folded.',
  'Rat Terrier':
    '~4–7 kg. Small agile terrier — smooth pied coat, fine bone, and square compact frame.',
  'Welsh Terrier':
    '~9–10 kg. Small square terrier — dense black-and-tan wiry coat and level topline.',
  'Irish Terrier':
    '~11–12 kg. Medium terrier — whole-colour red wiry coat and longer legs than many terriers.',
  'Kerry Blue Terrier':
    '~15–18 kg. Medium soft-coated terrier — blue-grey curly coat and bearded head.',
  'Soft-Coated Wheaten Terrier':
    '~14–20 kg. Medium terrier — silky wheaten coat, square build, and softer outline than wiry types.',
  'Schnauzer (Standard / Miniature)':
    '~5–20 kg by variant. Square terrier-type — harsh coat, beard, and eyebrows; Miniature under ~9 kg.',
  'Pig Dog (NZ hunting cross)':
    '~25–40 kg typically. NZ hunting cross — muscular mesomorph build; short coat; size varies by cross.',
  'Bull Arab':
    '~30–40 kg. Large hunting cross — mastiff-bull-arab type; short coat, deep chest, and strong head.',
  'Catahoula Leopard Dog':
    '~25–45 kg. Large American worker — short merle or solid coat, athletic mesomorph, and webbed feet.',
  'Spaniel-cross working dog':
    'Variable cross — typically medium; often feathered coat and spaniel-type ears on a working frame.',

  // ── Scenthound ──
  Beagle:
    '~9–11 kg. Small-medium scenthound — short tri-colour coat, long ears, and sturdy compact frame.',
  'Harrier Hound':
    '~20–27 kg. Medium-large scenthound — larger than Beagle; short coat and athletic pack-hound build.',
  Dachshund:
    '~9–12 kg. Small long-backed hound — short legs, elongated body, and smooth, wire, or long coat.',
  'Miniature Dachshund':
    '~4–5 kg. Toy-small long-backed hound — same silhouette as standard Dachshund in miniature.',
  'Basset Hound':
    '~20–29 kg. Medium heavy low scenthound — extremely long ears, loose skin, and short legs with substantial weight.',
  Bloodhound:
    '~36–50 kg. Large heavy scenthound — loose wrinkled skin, long ears, and deep solemn head.',
  'Foxhound (English / American)':
    '~29–34 kg. Large lean pack hound — short coat, long legs, and endurance-built frame.',
  Coonhound:
    '~25–36 kg. Large American scenthound — short dense coat, long ears, and rangy athletic build.',
  Otterhound:
    '~36–54 kg. Large rough scenthound — shaggy waterproof coat, webbed feet, and substantial bone.',
  'Petit Basset Griffon Vendéen':
    '~14–16 kg. Small rough scenthound — long eyebrows and beard, harsh coat, and low sturdy frame.',
  'Hamiltonstövare':
    '~23–27 kg. Medium Swedish scenthound — tricolour short coat, balanced proportions, and noble head.',
  'Beagle-cross':
    'Variable cross — typically small-medium; often Beagle ears and compact hound body.',

  // ── Guardian ──
  'German Shepherd':
    '~30–40 kg. Large shepherd — sloping topline, long muzzle, erect ears, and dense double coat.',
  'Belgian Malinois':
    '~25–30 kg. Medium-large square shepherd — short fawn coat with black mask, and very athletic dry build.',
  Rottweiler:
    '~35–60 kg. Large heavy guardian — black-and-tan short coat, massive head, and broad chest.',
  Doberman:
    '~32–45 kg. Large elegant guardian — short sleek coat, cropped ear history, and tall square frame.',
  'Mastiff (English / Bull / Neapolitan)':
    '~45–100+ kg by type. Giant mastiff family — massive head, loose skin in some lines, and heavy bone.',
  Bullmastiff:
    '~45–60 kg. Large square guardian — wrinkled face, short fawn coat, and powerful compact mastiff build.',
  'Cane Corso':
    '~40–50 kg. Large Italian guardian — short tight coat, large head, and muscular athletic mastiff lines.',
  Boerboel:
    '~70–90 kg. Giant South African guardian — blocky head, thick neck, and impressive muscular bulk.',
  'Dogue de Bordeaux':
    '~45–68 kg. Large mastiff — loose wrinkled skin, massive head, and fawn short coat.',
  'Presa Canario':
    '~40–50 kg. Large Canary guardian — short brindle or fawn coat, broad head, and thick muscular frame.',
  'Rhodesian Ridgeback':
    '~32–39 kg. Large athletic guardian — short wheaten coat with distinctive back ridge, and deep chest.',
  Akita:
    '~32–45 kg. Large spitz guardian — thick double coat, bear-like head, and curled tail.',
  'Shar Pei':
    '~18–25 kg. Medium wrinkled guardian — loose skin folds, short harsh coat, and hippopotamus muzzle.',
  'Chow Chow':
    '~20–32 kg. Medium spitz guardian — lion-like mane, blue-black tongue, and very dense coat.',
  'Tibetan Mastiff':
    '~45–70 kg. Giant coated guardian — massive mane, thick coat, and imposing Himalayan build.',
  'Dogo Argentino':
    '~40–45 kg. Large white guardian — short pure white coat, athletic musculature, and strong jaw.',
  Beauceron:
    '~32–45 kg. Large French shepherd — black-and-tan short coat, double dewclaws, and solid frame.',
  'Giant Schnauzer':
    '~35–47 kg. Large wiry guardian — harsh black or pepper coat, beard, and substantial square build.',
  'Black Russian Terrier':
    '~36–65 kg. Large coated guardian — tousled black coat, beard, and heavy substantial frame.',

  // ── Giant ──
  'Great Dane':
    '~50–80 kg. Giant lean mastiff — long legs, deep chest, short coat, and one of the tallest breeds.',
  'Anatolian Shepherd / Maremma':
    '~40–65 kg. Large livestock guardian — thick white or fawn coat, rangy powerful frame, and broad head.',
  'Great Pyrenees (Pyrenean Mountain Dog)':
    '~45–54 kg. Large white livestock guardian — thick weatherproof white coat and plumed tail.',
  Komondor:
    '~45–60 kg. Large corded guardian — distinctive white corded coat covering the entire body.',
  Kuvasz:
    '~35–52 kg. Large white guardian — medium-length white coat, lighter build than Pyrenees.',
  'Bernese Mountain Dog':
    '~36–50 kg. Large tricolour draft dog — long thick black, white, and rust coat; substantial bone.',
  'Greater Swiss Mountain Dog':
    '~50–64 kg. Large tricolour draft dog — short dense coat, heavier than Bernese, and powerful build.',
  Newfoundland:
    '~45–70 kg. Giant water draft dog — thick black or Landseer coat, broad head, and webbed feet.',
  'St Bernard':
    '~64–82 kg. Giant heavy rescue dog — massive head, dense short or long coat, and very broad bone.',
  Leonberger:
    '~45–77 kg. Giant lion-like dog — long waterproof coat, black mask, and substantial gentle frame.',
  'Pyrenean Mastiff':
    '~55–70 kg. Giant livestock guardian — thick coat, heavier than Pyrenees, and imposing head.',
  'Caucasian Shepherd':
    '~45–70 kg. Giant coated guardian — massive mane, thick coat, and very powerful mountain build.',
  'Central Asian Shepherd':
    '~40–80 kg. Giant livestock guardian — thick coat, broad head, and substantial regional variation.',
  'Estrela Mountain Dog':
    '~45–60 kg. Large Portuguese guardian — long or short coat, wolf-grey or fawn, and sturdy frame.',

  // ── Small ──
  Chihuahua:
    '~1.5–3 kg. Toy apple- or deer-head — fine bone, large ears, and short or long coat.',
  'Shih Tzu':
    '~4–7 kg. Small long-coated companion — flat face, flowing coat, and short sturdy body.',
  Maltese:
    '~3–4 kg. Toy white companion — long silky white coat, dark eyes, and fine bone.',
  Pomeranian:
    '~2–4 kg. Toy spitz — dense fluffy coat, fox face, and plumed tail over the back.',
  Papillon:
    '~3–5 kg. Toy butterfly-eared companion — fine bone, long fringed ears, and silky coat.',
  'Bichon Frise':
    '~5–8 kg. Small white companion — curly powder-puff coat and rounded silhouette.',
  'Cavalier King Charles Spaniel':
    '~6–8 kg. Small spaniel companion — long silky ears, gentle expression, and balanced compact frame.',
  'King Charles Spaniel':
    '~4–6 kg. Toy spaniel — shorter muzzle than Cavalier, domed head, and lush coat.',
  Pug:
    '~6–8 kg. Small brachycephalic — square cobby body, wrinkled face, and short smooth coat.',
  'French Bulldog':
    '~8–14 kg. Small heavy brachycephalic — bat ears, compact muscular body, and short coat.',
  'Boston Terrier':
    '~5–11 kg. Small tuxedo terrier — short coat, square head, and compact clean lines.',
  'Yorkshire Terrier':
    '~2–3 kg. Toy terrier — long silky blue-and-tan coat, fine bone, and compact frame.',
  'Silky Terrier':
    '~4–5 kg. Toy terrier — fine silky coat, wedge head, and Australian terrier elegance.',
  'Lhasa Apso':
    '~6–8 kg. Small Tibetan companion — long heavy parted coat, short muzzle, and sturdy body.',
  Pekingese:
    '~3–6 kg. Toy lion-dog — flat face, long flowing coat, and short bow-legged frame.',
  Havanese:
    '~4–7 kg. Small Cuban companion — soft wavy coat, shorter muzzle, and lively tail carriage.',
  'Coton de Tulear':
    '~4–6 kg. Small cotton-coated companion — fluffy white coat and slightly longer than tall.',
  'Miniature Pinscher':
    '~4–5 kg. Toy sleek pinscher — tight short coat, high-stepping legs, and wedge head.',
  'Brussels Griffon':
    '~3–5 kg. Toy rough or smooth companion — short face, prominent chin, and expressive eyes.',
  'Japanese Chin':
    '~3–4 kg. Toy oriental companion — flat face, silky coat, and plumed tail.',
  'Tibetan Spaniel':
    '~4–7 kg. Small Tibetan companion — silky coat, domed head, and feathered tail over back.',
  'Chinese Crested':
    '~3–5 kg. Toy mostly hairless — hairless body with crest, socks, and tail plume; or powderpuff coated.',
  Affenpinscher:
    '~3–4 kg. Toy monkey-faced terrier — harsh shaggy coat, round dark eyes, and compact body.',
  'Maltese Shih Tzu cross':
    '~4–8 kg typically. Small cross — soft flowing coat, round head, and compact companion build.',
  'Chihuahua cross':
    '~2–6 kg typically. Toy-small cross — fine bone common; coat and head shape vary by cross.',
};

export function composePhysicalFallback(sizeClass: SizeClass, category: BreedCategory): string {
  return `${SIZE_CLASS_APPEARANCE[sizeClass]} ${CATEGORY_BODY_APPEARANCE[category]}`;
}
