/**
 * Extracts the public site into a single Markdown draft with a contents section,
 * chapters grouped into parts, and compendium appendices built from the data modules.
 * Reads the prerendered pages in docs/, so run `npm run build` first. Authored sections
 * (notice, introduction, comparison chapter) live as Markdown in book/content/.
 *
 * The published book is book/goldstandardbook.md, which is edited by hand. This script
 * never writes to it; its git-ignored output is a reference for spotting site changes
 * that the book should pick up.
 * Run: npm run extract:book
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { GUIDE_MODULES, type GuideModuleMeta } from '../shared/guideModules';
import { SITE_EMAIL, SITE_NAME, SITE_PHONE_DISPLAY, SITE_TAGLINE, SITE_URL } from '../src/data/siteConfig';
import { TERM_GLOSSES } from '../src/data/termGlosses';
import { NEEDS_CATEGORIES, VICE_EXPRESSIONS } from '../src/data/canineNeedsVocabulary';
import { BEHAVIOR_DRIVERS, type BehaviorDriver } from '../src/data/behaviorDrivers';
import { REHABILITATION_PATH_LABELS, REHABILITATION_PLAYBOOKS } from '../src/data/rehabilitationPlaybooks';
import { SYMPTOM_EXPRESSIONS, SYMPTOM_TARGET_LABELS, type SymptomTarget } from '../src/data/symptomExpressions';
import {
  INSTINCT_SUBTYPE_META,
  INTELLIGENCE_DIMENSIONS,
  NEURO_PATTERN_META,
  NEURO_PATTERN_SIGNALS,
  findIntelligenceByBreedName,
  type InstinctSubtype,
  type NeuroPattern,
  type TraitSegment,
} from '../src/data/dogIntelligence';
import { IMPACT_LABELS, PROBLEM_CONTEXTS, PROBLEM_OUTCOMES, type ImpactLevel } from '../src/data/problemFinder';
import { breedCategories, breeds, type BreedCategory } from '../src/data/breeds';
import {
  breedTypeProfiles,
  getBreedAxisProfile,
  getBreedNeuroticismPropensityDetail,
  getBreedSizeClass,
  getBreedTrainerSummary,
} from '../src/data/breedTraits';
import { CATEGORY_SENSITIVITY_SUMMARIES } from '../src/data/breedSensitivities';
import {
  getBreedLifePhaseNotes,
  getBreedSensitivityDetail,
  getBreedSensitivitySummary,
} from '../src/data/breedSensitivityResolvers';
import { getBreedSpiritReading } from '../src/data/breedSpiritReadings';
import { BREED_LEVERAGE_NOTES, INSTINCT_LEVERAGE_PROFILES } from '../src/data/instinctTrainingLeverage';
import { PURPOSE_ROLES } from '../src/data/dogPurposeRoles';
import { PUPPY_DEVELOPMENT_STAGES, PUPPY_STAGE_SUMMARY_ROWS } from '../src/data/puppyDevelopmentStages';
import { resolveCultivationTimeline } from '../src/data/nervousSystemCultivation';
import { buildPuppyPlan, getPuppyPlanDisclaimer } from '../src/data/puppyPlan';
import { examQuestions, type Question } from '../src/data/examQuestions';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const docsDir = join(root, 'docs');
const outFile = join(root, 'book', '.extract', 'site-extract.md');
const contentDir = join(root, 'book', 'content');
const generated = new Date().toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' });

/* ── Book manifest ─────────────────────────────────────────── */

interface PageEntry {
  route: string;
  /** Chapter title override; the page's own h1 then opens the chapter as a lead line. */
  title?: string;
  guideModule?: GuideModuleMeta;
  /** Extra selectors removed before conversion (tool UIs whose data lives in the appendices). */
  drop?: string[];
}

/** A chapter written for the book rather than taken from the site; the file's first heading is the chapter title. */
interface AuthoredEntry {
  source: string;
}

type ChapterEntry = PageEntry | AuthoredEntry;

interface PartEntry {
  title: string;
  intro?: string;
  pages: ChapterEntry[];
}

const PARTS: PartEntry[] = [
  {
    title: 'About Gold Standard',
    pages: [{ route: '/' }, { route: '/about' }, { source: 'training-approaches.md' }],
  },
  {
    title: 'Services',
    pages: [
      { route: '/services' },
      { route: '/obedience-training' },
      { route: '/puppy-training' },
      { route: '/leash-training' },
      { route: '/recall-training' },
      { route: '/dog-behaviour' },
      { route: '/reactive-dog' },
      { route: '/difficult-dogs' },
      { route: '/owner-coaching' },
    ],
  },
  {
    title: 'The Client Guide',
    intro:
      'The Client Guide is the core of the Gold Standard method, arranged in seven modules from Foundation to Daily life.',
    pages: [
      { route: '/guide' },
      ...GUIDE_MODULES.map((module) => ({ route: module.route, guideModule: module })),
    ],
  },
  {
    title: 'Tools and Resources',
    intro:
      'The interactive tools on the website. Each chapter carries the tool introduction; the underlying data is reproduced in the appendices.',
    pages: [
      { route: '/problem-finder' },
      { route: '/intelligence', drop: ['table', '.intelligence-table-filters', '.intelligence-tip'] },
      { route: '/dog-personality' },
      { route: '/breed-finder' },
      { route: '/dog-selector' },
      { route: '/exam' },
      { route: '/equipment' },
    ],
  },
  {
    title: 'Service Areas',
    pages: [
      { route: '/areas' },
      { route: '/areas/golden-bay' },
      { route: '/areas/takaka' },
      { route: '/areas/pohara' },
      { route: '/areas/nelson-bays' },
      { route: '/areas/motueka' },
      { route: '/areas/richmond' },
    ],
  },
  {
    title: 'Contact and Booking',
    pages: [{ route: '/contact' }, { route: '/book', title: 'Book a session' }],
  },
];

const DROP_SELECTORS = [
  'script',
  'style',
  'noscript',
  'template',
  'svg',
  'iframe',
  'form',
  'button',
  'input',
  'select',
  'textarea',
  'nav',
  'dialog',
  '[role="dialog"]',
  '[hidden]',
  '[aria-hidden="true"]',
  'img',
  '.visually-hidden',
  'header.site-header',
  'header.guide-sticky-nav',
  'footer.site-footer',
  '.guide-contents',
  '.guide-module-nav-bar',
  '.guide-module-footer-nav',
  '.contact-cta-row',
  '.hero-cta',
  '.service-footer-cta',
  '.service-hub-card-cta',
  '.resource-card-cta',
  '.about-teaser-cta',
  '.leaflet-container',
  '.guide-search',
  '.guide-hub-progress',
  '.guide-continue-card',
  '.guide-header .header-label',
];

/* ── Browser-side DOM serialiser ───────────────────────────── */

type HNode = HText | HEl;
interface HText {
  t: 'text';
  v: string;
}
interface HEl {
  t: 'el';
  tag: string;
  id?: string;
  cls?: string;
  href?: string;
  children: HNode[];
}

/** Plain JS source so tsx helpers are never injected into the page context. */
const SERIALIZE_SOURCE = `(drop) => {
  const container = document.querySelector('#root');
  if (!container) return null;
  container.querySelectorAll(drop.join(',')).forEach((el) => el.remove());
  const walk = (node) => {
    if (node.nodeType === 3) return { t: 'text', v: node.nodeValue || '' };
    if (node.nodeType !== 1) return null;
    return {
      t: 'el',
      tag: node.tagName.toLowerCase(),
      id: node.id || undefined,
      cls: node.getAttribute('class') || undefined,
      href: node.getAttribute('href') || undefined,
      children: Array.from(node.childNodes).map(walk).filter(Boolean),
    };
  };
  return { title: document.title, tree: walk(container) };
}`;

interface ExtractedPage {
  title: string;
  tree: HEl;
}

async function extractPages(pages: PageEntry[]): Promise<Map<string, ExtractedPage>> {
  const results = new Map<string, ExtractedPage>();
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.route('**/*', (route) => route.abort());
    for (const entry of pages) {
      const file = entry.route === '/' ? join(docsDir, 'index.html') : join(docsDir, entry.route.slice(1), 'index.html');
      if (!existsSync(file)) throw new Error(`Missing prerendered page for ${entry.route}: ${file} (run npm run build)`);
      const html = readFileSync(file, 'utf8')
        .replace(/<script\b[\s\S]*?<\/script>/gi, '')
        .replace(/<link\b[^>]*>/gi, '');
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      const drop = [...DROP_SELECTORS, ...(entry.drop ?? [])];
      const extracted = (await page.evaluate(`(${SERIALIZE_SOURCE})(${JSON.stringify(drop)})`)) as ExtractedPage | null;
      if (!extracted?.tree) throw new Error(`No #root content in ${file}`);
      results.set(entry.route, extracted);
    }
  } finally {
    await browser.close();
  }
  return results;
}

/* ── Document model ────────────────────────────────────────── */

type Block =
  | { kind: 'heading'; level: number; text: string; ids: string[]; route?: string }
  | { kind: 'text'; md: string };

const heading = (level: number, text: string, ids: string[] = [], route?: string): Block => ({
  kind: 'heading',
  level,
  text,
  ids,
  route,
});
const para = (md: string): Block => ({ kind: 'text', md });

function escapeMd(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/([*_`[\]])/g, '\\$1')
    .replace(/</g, '&lt;');
}

/** Stops paragraphs that start with list or heading syntax from being reinterpreted. */
function guardLineStart(md: string): string {
  return /^(#{1,6}\s|>|[-+*]\s|\d+[.)]\s)/.test(md) ? `\\${md}` : md;
}

function stripEmoji(text: string): string {
  return text.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '').replace(/\s+/g, ' ').trim();
}

function link(text: string, href: string): string {
  return `[${text}](@@L:${href}@@)`;
}

function bulletList(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

function mdTable(headers: string[], rows: string[][]): string {
  const cell = (value: string) => value.replace(/\n+/g, '<br>').replace(/\|/g, '\\|').trim();
  const width = Math.max(headers.length, ...rows.map((row) => row.length));
  const pad = (row: string[]) => Array.from({ length: width }, (_, i) => cell(row[i] ?? ''));
  return [
    `| ${pad(headers).join(' | ')} |`,
    `| ${Array.from({ length: width }, () => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${pad(row).join(' | ')} |`),
  ].join('\n');
}

/* ── HTML tree → Markdown ──────────────────────────────────── */

const BLOCK_TAGS = new Set([
  'address', 'article', 'aside', 'blockquote', 'caption', 'dd', 'details', 'div', 'dl', 'dt', 'fieldset',
  'figcaption', 'figure', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'li', 'main', 'ol',
  'p', 'pre', 'section', 'summary', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul',
]);

/** Links wrapping several elements are cards (title, description, meta) and read as their own paragraph. */
function isCardLink(node: HEl): boolean {
  return node.tag === 'a' && node.children.filter((child) => child.t === 'el' && child.tag !== 'br').length >= 2;
}

const blockishCache = new WeakMap<HNode, boolean>();
function isBlockish(node: HNode): boolean {
  if (node.t === 'text') return false;
  const cached = blockishCache.get(node);
  if (cached !== undefined) return cached;
  const result = BLOCK_TAGS.has(node.tag) || isCardLink(node) || node.children.some(isBlockish);
  blockishCache.set(node, result);
  return result;
}

function plainText(node: HNode): string {
  if (node.t === 'text') return node.v;
  if (node.tag === 'br') return ' ';
  const parts = node.children.map((child) => ({ md: plainText(child), el: child.t === 'el' }));
  return joinInline(parts.filter((part) => part.md !== '')).replace(/\s+/g, ' ');
}

const hasClass = (el: HEl, name: string) => (el.cls ?? '').split(/\s+/).includes(name);

/** Page-scoped ids that land on non-heading blocks, keyed `route#id` → HTML anchor name. */
const htmlAnchors = new Map<string, string>();

interface PageContext {
  route: string;
  chapterEmitted: boolean;
}

function anchorTag(ctx: PageContext, id: string): string {
  const routeKey = ctx.route === '/' ? 'home' : ctx.route.slice(1).replace(/\//g, '-');
  const name = `${routeKey}--${id}`.replace(/[^\w-]/g, '-');
  if (!htmlAnchors.has(`${ctx.route}#${id}`)) htmlAnchors.set(`${ctx.route}#${id}`, name);
  return `<a id="${name}"></a>`;
}

interface RenderOptions {
  nested: boolean;
  inTable: boolean;
}

const TOP: RenderOptions = { nested: false, inTable: false };

function wrapInline(inner: string, mark: string): string {
  const match = inner.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!match || !match[2]) return inner;
  return `${match[1]}${mark}${match[2]}${mark}${match[3]}`;
}

/** Sibling elements styled as separate lines (label + value, title + description) carry no whitespace between them. */
function joinInline(parts: { md: string; el: boolean }[]): string {
  let out = '';
  parts.forEach((part, index) => {
    const prev = parts[index - 1];
    if (prev && (prev.el || part.el) && /[^\s([“‘"'/-]$/.test(out) && /^[\p{L}\p{N}*[(“‘$]/u.test(part.md)) {
      out += ' ';
    }
    out += part.md;
  });
  return out;
}

function renderInline(nodes: HNode[], ctx: PageContext, opts: RenderOptions): string {
  const parts = nodes.map((node) => ({ md: renderInlineNode(node, ctx, opts), el: node.t === 'el' }));
  return joinInline(parts.filter((part) => part.md !== ''));
}

function internalHref(ctx: PageContext, href: string | undefined): string | undefined {
  if (!href) return undefined;
  if (href.startsWith('#')) return `${ctx.route}${href}`;
  if (href.startsWith('/')) return href;
  return undefined;
}

function renderInlineNode(node: HNode, ctx: PageContext, opts: RenderOptions): string {
  if (node.t === 'text') return escapeMd(node.v.replace(/\s+/g, ' '));
  const inner = () => renderInline(node.children, ctx, opts);
  switch (node.tag) {
    case 'strong':
    case 'b':
      return wrapInline(inner(), '**');
    case 'em':
    case 'i':
    case 'cite':
      return wrapInline(inner(), '*');
    case 'code':
      return wrapInline(plainText(node).replace(/`/g, ''), '`');
    case 'br':
      return opts.inTable ? ' ' : '  \n';
    case 'a': {
      const text = inner();
      const href = internalHref(ctx, node.href);
      if (!text.trim() || !href) return text;
      return link(text.trim(), href);
    }
    default:
      return inner();
  }
}

function cleanInline(md: string): string {
  return md
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/(\s*\n){2,}/g, '\n')
    .trim();
}

function renderContainer(nodes: HNode[], ctx: PageContext, opts: RenderOptions): Block[] {
  const out: Block[] = [];
  let buffer: HNode[] = [];
  const flush = () => {
    const md = cleanInline(renderInline(buffer, ctx, opts));
    if (md) out.push(para(guardLineStart(md)));
    buffer = [];
  };
  for (const child of nodes) {
    if (isBlockish(child)) {
      flush();
      out.push(...renderBlock(child as HEl, ctx, opts));
    } else {
      buffer.push(child);
    }
  }
  flush();
  return out;
}

function blocksToMd(blocks: Block[]): string[] {
  return blocks.map((block) => (block.kind === 'text' ? block.md : `**${escapeMd(block.text)}**`));
}

function renderList(el: HEl, ctx: PageContext, opts: RenderOptions): string {
  const ordered = el.tag === 'ol';
  const items = el.children.filter((child): child is HEl => child.t === 'el' && child.tag === 'li');
  return items
    .map((item, index) => {
      const marker = ordered ? `${index + 1}. ` : '- ';
      const indent = ' '.repeat(marker.length);
      let body = blocksToMd(renderContainer(item.children, ctx, { ...opts, nested: true })).join('\n');
      if (!body.trim()) return '';
      if (item.id) body = anchorTag(ctx, item.id) + body;
      return body
        .split('\n')
        .map((line, lineIndex) => (lineIndex === 0 ? marker + line : line ? indent + line : line))
        .join('\n');
    })
    .filter(Boolean)
    .join('\n');
}

function collectRows(el: HEl): HEl[] {
  const rows: HEl[] = [];
  for (const child of el.children) {
    if (child.t !== 'el') continue;
    if (child.tag === 'tr') rows.push(child);
    else if (['thead', 'tbody', 'tfoot'].includes(child.tag)) rows.push(...collectRows(child));
  }
  return rows;
}

function renderTable(el: HEl, ctx: PageContext, opts: RenderOptions): Block[] {
  const cellOpts = { ...opts, nested: true, inTable: true };
  const rows = collectRows(el).map((row) => {
    const cells = row.children
      .filter((cell): cell is HEl => cell.t === 'el' && (cell.tag === 'td' || cell.tag === 'th'))
      .map((cell) => blocksToMd(renderContainer(cell.children, ctx, cellOpts)).join('\n'));
    if (row.id && cells.length > 0) cells[0] = anchorTag(ctx, row.id) + cells[0];
    return cells;
  });
  const caption = el.children.find((child): child is HEl => child.t === 'el' && child.tag === 'caption');
  const out: Block[] = [];
  if (caption) out.push(para(`**${escapeMd(stripEmoji(plainText(caption)))}**`));
  if (rows.length > 0) out.push(para(mdTable(rows[0], rows.slice(1))));
  return out;
}

/** An element id resolves to its first heading when it opens with one, otherwise to an inline HTML anchor. */
function renderBlock(el: HEl, ctx: PageContext, opts: RenderOptions): Block[] {
  const blocks = renderBlockContent(el, ctx, opts);
  if (!el.id || blocks.length === 0) return blocks;
  const [first, ...rest] = blocks;
  if (first.kind === 'heading') return [{ ...first, ids: [...first.ids, el.id] }, ...rest];
  if (opts.nested) return [para(anchorTag(ctx, el.id) + first.md), ...rest];
  return [para(anchorTag(ctx, el.id)), ...blocks];
}

function renderBlockContent(el: HEl, ctx: PageContext, opts: RenderOptions): Block[] {
  const headingMatch = el.tag.match(/^h([1-6])$/);
  if (headingMatch) {
    const text = stripEmoji(plainText(el));
    if (!text) return [];
    if (opts.nested) return [para(`**${escapeMd(text)}**`)];
    const sourceLevel = Number(headingMatch[1]);
    if (sourceLevel === 1 && !ctx.chapterEmitted) {
      ctx.chapterEmitted = true;
      return [heading(2, text, [], ctx.route)];
    }
    return [heading(Math.min(6, sourceLevel === 1 ? 3 : sourceLevel + 1), text)];
  }

  if (isCardLink(el)) {
    const md = blocksToMd(renderContainer(el.children, ctx, { ...opts, nested: true })).join(' ');
    const href = internalHref(ctx, el.href);
    if (!md.trim()) return [];
    return [para(href ? `${md} (${link('read more', href)})` : md)];
  }

  if (hasClass(el, 'section-label') || hasClass(el, 'header-label')) {
    const text = stripEmoji(plainText(el));
    return text ? [para(`*${escapeMd(text)}*`)] : [];
  }

  switch (el.tag) {
    case 'ul':
    case 'ol': {
      const md = renderList(el, ctx, opts);
      return md ? [para(md)] : [];
    }
    case 'table':
      return renderTable(el, ctx, opts);
    case 'summary':
    case 'dt': {
      const md = cleanInline(renderInline(el.children, ctx, opts));
      return md ? [para(`**${md.replace(/\*\*/g, '')}**`)] : [];
    }
    case 'blockquote': {
      const inner = blocksToMd(renderContainer(el.children, ctx, { ...opts, nested: true }));
      if (inner.length === 0) return [];
      return [para(inner.map((md) => md.split('\n').map((line) => `> ${line}`).join('\n')).join('\n>\n'))];
    }
    case 'pre':
      return [para('```\n' + plainText(el).replace(/\n+$/, '') + '\n```')];
    case 'hr':
      return [];
    default:
      return renderContainer(el.children, ctx, opts);
  }
}

function dedupeConsecutive(blocks: Block[]): Block[] {
  return blocks.filter((block, index) => {
    const prev = blocks[index - 1];
    return !(prev && block.kind === 'text' && prev.kind === 'text' && prev.md === block.md);
  });
}

function convertPage(entry: PageEntry, page: ExtractedPage, chapterNumber: number): Block[] {
  const ctx: PageContext = { route: entry.route, chapterEmitted: false };
  let blocks = dedupeConsecutive(renderBlock(page.tree, ctx, TOP));

  let chapterIndex = blocks.findIndex((block) => block.kind === 'heading' && block.route === entry.route);
  if (chapterIndex < 0) {
    const fallback = stripEmoji(page.title.split('|')[0] ?? entry.route);
    blocks = [heading(2, fallback, [], entry.route), ...blocks];
    chapterIndex = 0;
  }
  const chapter = blocks[chapterIndex] as Extract<Block, { kind: 'heading' }>;
  const lead = blocks.slice(0, chapterIndex);
  const rest = blocks.slice(chapterIndex + 1);

  const opening: Block[] = [];
  if (entry.title) opening.push(para(`*${escapeMd(chapter.text)}*`));
  if (entry.guideModule) {
    const module = entry.guideModule;
    opening.push(
      para(`*Client Guide, ${module.part}: ${escapeMd(module.title)}. About ${module.readMinutes} minutes' reading.*`),
    );
  }

  return [
    heading(2, `Chapter ${chapterNumber}: ${entry.title ?? chapter.text}`, chapter.ids, entry.route),
    ...opening,
    ...lead,
    ...rest,
  ];
}

/* ── Appendix helpers ──────────────────────────────────────── */

const guideLink = (anchor: string, label?: string) => {
  const clean = anchor.replace(/^#/, '');
  return link(escapeMd(label ?? clean.replace(/-/g, ' ')), `#${clean}`);
};
const guideLinks = (anchors: string[]) => anchors.map((anchor) => guideLink(anchor)).join(', ');
const field = (label: string, value: string | undefined) => (value ? para(`**${label}:** ${escapeMd(value)}`) : null);
const listField = (label: string, items: string[] | undefined) =>
  items && items.length > 0 ? para(`**${label}:**\n\n${bulletList(items.map(escapeMd))}`) : null;
const compact = (blocks: (Block | null)[]): Block[] => blocks.filter((block): block is Block => block !== null);

const driverLabel = new Map(BEHAVIOR_DRIVERS.map((driver) => [driver.id, driver.label]));
const neuroLabel = new Map(NEURO_PATTERN_META.map((meta) => [meta.key, meta.label]));
const instinctLabel = new Map(INSTINCT_SUBTYPE_META.map((meta) => [meta.key, meta.label]));
const symptomLabel = new Map(SYMPTOM_EXPRESSIONS.map((symptom) => [symptom.id, symptom.label]));
const labelsOf = <K>(keys: K[] | undefined, map: Map<K, string>) =>
  (keys ?? []).map((key) => map.get(key) ?? String(key)).join(', ');
const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const segmentsText = (segments: TraitSegment[]) =>
  segments.map((segment) => `${segment.label} ${Math.round(segment.weight * 100)}%`).join(', ');

/* ── Appendix A: Glossary ──────────────────────────────────── */

function appendixGlossary(): Block[] {
  const glosses = [...TERM_GLOSSES].sort((a, b) => a.term.localeCompare(b.term));
  return [
    heading(2, 'Appendix A: Glossary'),
    para(
      'Gold Standard terms with their conventional meaning, followed by the vocabulary used when tracing canine needs and the forms they take when unmet. The symptom glossary itself sits in the Understanding module of the Client Guide.',
    ),
    heading(3, 'Gold Standard terms'),
    para(
      bulletList(
        glosses.map((gloss) => `**${escapeMd(gloss.term)}**: ${escapeMd(gloss.gloss)} (${guideLink(gloss.anchor, 'guide')})`),
      ),
    ),
    heading(3, 'Canine needs vocabulary'),
    ...NEEDS_CATEGORIES.map((category) => para(`**${escapeMd(category.label)}:** ${category.terms.map(escapeMd).join(', ')}`)),
    heading(3, 'Vice expressions'),
    para('The forms unmet needs take when they turn into strain:'),
    para(bulletList(VICE_EXPRESSIONS.map(escapeMd))),
  ];
}

/* ── Appendix B: Rehabilitation compendium ─────────────────── */

function appendixRehabilitation(): Block[] {
  const blocks: Block[] = [
    heading(2, 'Appendix B: Rehabilitation Compendium'),
    para(
      'Behaviour drivers come first: calibrate what is driving a behaviour before opening a rehabilitation playbook. Then the stress-looping patterns, the playbooks for each pattern, and the index of symptom expressions.',
    ),
    heading(3, 'Behaviour drivers'),
  ];

  for (const driver of [...BEHAVIOR_DRIVERS].sort((a, b) => a.order - b.order)) {
    blocks.push(
      heading(4, driver.label),
      para(escapeMd(driver.summary)),
      ...compact([
        listField('Key questions', driver.keyQuestions),
        listField('Looks like', driver.looksLike),
        listField('Not this when', driver.notThisWhen),
        field('Primary response', driver.primaryResponse),
        field('Rehabilitation playbook applies', driver.playbookEligible ? 'Yes' : 'No — train structure first'),
      ]),
      para(`**Guide sections:** ${guideLinks(driver.guideAnchors)}`),
    );
  }

  blocks.push(heading(3, 'Stress-looping patterns'));
  for (const meta of NEURO_PATTERN_META) {
    const signals = NEURO_PATTERN_SIGNALS[meta.key] ?? [];
    blocks.push(
      heading(4, meta.label),
      para(escapeMd(meta.description)),
      ...(signals.length
        ? [para(`**Signals:**\n\n${bulletList(signals.map((s) => `${escapeMd(s.label)} (${guideLink(s.guideAnchor, 'guide')})`))}`)]
        : []),
    );
  }

  blocks.push(heading(3, 'Rehabilitation playbooks'));
  for (const playbook of REHABILITATION_PLAYBOOKS) {
    blocks.push(
      heading(4, playbook.label, [playbook.primaryGuideAnchor]),
      ...compact([
        field('Path', REHABILITATION_PATH_LABELS[playbook.path]),
        field('Root cause', playbook.rootCause),
        listField('Typical expressions', playbook.typicalExpressions),
        field('Predisposed temperament types', playbook.predisposedCategories.map((c) => breedCategories[c].label).join(', ')),
        field('Instinct leverage', labelsOf(playbook.instinctLeverage, instinctLabel)),
        field('Substitution', playbook.substitution),
        field('Decoupling', playbook.decoupling),
        field('Proactive guidance', playbook.proactiveGuidance),
        field('Avoid when', playbook.avoidWhen),
        field('Confusable drivers', labelsOf(playbook.confusableDrivers, driverLabel)),
        field('Distinguish from', playbook.distinguishFrom),
        field('Symptom expressions', labelsOf(playbook.symptomExpressionIds, symptomLabel)),
      ]),
      para(`**Guide sections:** ${guideLinks([playbook.primaryGuideAnchor, ...playbook.relatedGuideAnchors])}`),
    );
  }

  blocks.push(heading(3, 'Symptom expressions'));
  for (const target of Object.keys(SYMPTOM_TARGET_LABELS) as SymptomTarget[]) {
    const symptoms = SYMPTOM_EXPRESSIONS.filter((symptom) => symptom.target === target);
    if (symptoms.length === 0) continue;
    blocks.push(heading(4, `Directed at: ${SYMPTOM_TARGET_LABELS[target]}`));
    for (const symptom of symptoms) {
      blocks.push(
        heading(5, symptom.label, [symptom.guideAnchor]),
        para(escapeMd(symptom.summary)),
        ...compact([
          field('Linked patterns', labelsOf(symptom.linkedPatterns, neuroLabel)),
          field('Confusable drivers', labelsOf(symptom.confusableDrivers, driverLabel)),
          field('Distinguish from', symptom.distinguishFrom),
          field('Substitution', symptom.substitution),
          field('Decoupling', symptom.decoupling),
          field('Proactive guidance', symptom.proactiveGuidance),
          field('Medical rule-out', symptom.medicalRuleOut),
        ]),
        para(`**Guide section:** ${guideLink(symptom.guideAnchor)}`),
      );
    }
  }
  return blocks;
}

/* ── Appendix C: Problem Finder ────────────────────────────── */

function appendixProblemFinder(): Block[] {
  const blocks: Block[] = [
    heading(2, 'Appendix C: Problem Finder'),
    para(
      'Every situation and problem the Problem Finder covers, with the guidance shown for each level of impact and the guide sections it points to.',
    ),
    heading(3, 'Impact levels'),
    para(bulletList((Object.keys(IMPACT_LABELS) as unknown as ImpactLevel[]).map((level) => `**${level}**: ${escapeMd(IMPACT_LABELS[level])}`))),
    heading(3, 'Situations'),
  ];
  for (const context of PROBLEM_CONTEXTS) {
    blocks.push(
      heading(4, context.label),
      para(escapeMd(context.description)),
      para(`**Problems covered:** ${context.outcomeIds.map((id) => escapeMd(PROBLEM_OUTCOMES[id].label)).join(', ')}`),
    );
  }
  blocks.push(heading(3, 'Problems'));
  for (const outcome of Object.values(PROBLEM_OUTCOMES)) {
    const urgency = (Object.keys(outcome.urgencyNotes) as unknown as ImpactLevel[]).map(
      (level) => `**${escapeMd(IMPACT_LABELS[level])}:** ${escapeMd(outcome.urgencyNotes[level])}`,
    );
    blocks.push(
      heading(4, outcome.label),
      para(escapeMd(outcome.summary)),
      para(`**By impact:**\n\n${bulletList(urgency)}`),
      para(`**Guide sections:** ${outcome.guideLinks.map((g) => guideLink(g.anchor, g.label)).join(', ')}`),
      ...compact([
        field('Stress-looping patterns to consider', labelsOf(outcome.neuroPatternHints, neuroLabel)),
        field('Symptom expressions to consider', labelsOf(outcome.symptomExpressionHints, symptomLabel)),
        field('Behaviour drivers to consider', labelsOf(outcome.driverConsiderations as BehaviorDriver[] | undefined, driverLabel)),
      ]),
    );
  }
  return blocks;
}

/* ── Appendix D: Breed compendium ──────────────────────────── */

function breedEntry(breedName: string, category: BreedCategory): Block[] {
  const breed = { name: breedName, category };
  const intelligence = findIntelligenceByBreedName(breedName);
  const size = getBreedSizeClass(breed);
  const facts = [
    breedCategories[category].label,
    `${capitalise(size)} size`,
    intelligence
      ? intelligence.source === 'coren'
        ? `Coren intelligence rank ${intelligence.rank}`
        : 'Estimated intelligence profile'
      : undefined,
  ].filter(Boolean);

  const blocks: Block[] = [heading(4, breedName), para(`*${facts.map((f) => escapeMd(f!)).join(' · ')}*`)];

  const spirit = getBreedSpiritReading(breedName);
  if (spirit) blocks.push(para(`**Epithet:** *${escapeMd(spirit.epithet)}*`));

  blocks.push(
    ...compact([
      field('Trainer summary', getBreedTrainerSummary(breedName)),
      field('Personality and drive', getBreedAxisProfile(breed, 'personality')),
      field('Working style and energy', getBreedAxisProfile(breed, 'working')),
      field('Physical build and size', getBreedAxisProfile(breed, 'physical')),
    ]),
  );

  if (intelligence) {
    blocks.push(
      para('**Intelligence and temperament scores (1–10):**'),
      para(
        mdTable(
          INTELLIGENCE_DIMENSIONS.map((d) => d.shortLabel),
          [INTELLIGENCE_DIMENSIONS.map((d) => String(Math.round(intelligence.scores[d.key] * 10) / 10))],
        ),
      ),
      ...compact([
        field('Instinct blend', segmentsText(intelligence.instinctSegments)),
        field('Stress-looping pattern blend', segmentsText(intelligence.neuroSegments)),
      ]),
    );
  }

  const propensity = getBreedNeuroticismPropensityDetail(breedName);
  if (propensity) blocks.push(para(`**Stress-looping propensity (${escapeMd(propensity.label)}):** ${escapeMd(propensity.note)}`));

  const sensitivities = getBreedSensitivityDetail(breedName);
  if (sensitivities.length) {
    blocks.push(
      para(`**Sensitivities:** ${escapeMd(getBreedSensitivitySummary(breedName))}`),
      para(mdTable(['Sensitivity', 'Level', 'Note'], sensitivities.map((s) => [escapeMd(s.label), s.levelLabel ?? s.level, escapeMd(s.note ?? '')]))),
    );
  }

  const life = getBreedLifePhaseNotes(breedName);
  blocks.push(
    ...compact([
      field('As a puppy', life.puppy),
      field('As an adolescent', life.adolescent),
      field('Maturation', life.maturationNote),
    ]),
  );

  const leverage = BREED_LEVERAGE_NOTES[breedName];
  if (leverage) {
    blocks.push(
      para(
        `**Training leverage notes:**\n\n${bulletList(
          (Object.entries(leverage) as [InstinctSubtype, string][]).map(
            ([instinct, note]) => `**${escapeMd(instinctLabel.get(instinct) ?? instinct)}:** ${escapeMd(note)}`,
          ),
        )}`,
      ),
    );
  }

  if (spirit) {
    blocks.push(
      para(
        `**Spirit reading:**\n\n${bulletList(spirit.sections.map((s) => `**${escapeMd(s.title)}:** ${escapeMd(s.body)}`))}`,
      ),
      para(`*${escapeMd(spirit.closing)}*`),
    );
  }
  return blocks;
}

function appendixBreeds(): Block[] {
  const blocks: Block[] = [
    heading(2, 'Appendix D: Breed Compendium'),
    para(
      `The breed reference behind the Breed Analysis, Dog Personality, Breed Finder, and Dog Selector tools: ${breeds.length} breeds and named crosses grouped into nine temperament types. Scores describe breed tendencies, never an individual dog.`,
    ),
    heading(3, 'Temperament types'),
  ];

  for (const category of Object.keys(breedTypeProfiles) as BreedCategory[]) {
    const profile = breedTypeProfiles[category];
    const members = breeds.filter((b) => b.category === category).map((b) => escapeMd(b.name));
    blocks.push(
      heading(4, profile.label),
      para(escapeMd(profile.summary)),
      ...compact([
        field('Personality and drive', profile.personality),
        field('Working style and energy', profile.working),
        field('Physical build', profile.physical),
        field('Sensitivities', CATEGORY_SENSITIVITY_SUMMARIES[category]),
      ]),
      para(`**Breeds of this type:** ${members.join(', ')}`),
    );
  }

  blocks.push(
    heading(3, 'Score dimensions'),
    para(mdTable(['Dimension', 'Short label', 'What it measures'], INTELLIGENCE_DIMENSIONS.map((d) => [escapeMd(d.label), d.shortLabel, escapeMd(d.description)]))),
    heading(3, 'Instinct types'),
    para(bulletList(INSTINCT_SUBTYPE_META.map((meta) => `**${escapeMd(meta.label)}:** ${escapeMd(meta.description)}`))),
    heading(3, 'Breed entries'),
    para('Breeds in alphabetical order.'),
  );

  for (const breed of [...breeds].sort((a, b) => a.name.localeCompare(b.name))) {
    blocks.push(...breedEntry(breed.name, breed.category));
  }

  blocks.push(heading(3, 'Instinct training leverage'));
  for (const profile of INSTINCT_LEVERAGE_PROFILES) {
    blocks.push(
      heading(4, instinctLabel.get(profile.instinct) ?? profile.instinct),
      para(`**${escapeMd(profile.headline)}**`),
      para(`**Fixation:** ${escapeMd(profile.fixationNote)}`),
    );
    for (const method of profile.methods) {
      blocks.push(
        heading(5, method.title),
        para(escapeMd(method.summary)),
        ...compact([
          field('Use when', method.useWhen),
          field('Interrupts', method.interrupts?.join(', ')),
          field('Life phases', method.lifePhases?.map(capitalise).join(', ')),
        ]),
        ...(method.guideAnchors?.length ? [para(`**Guide sections:** ${guideLinks(method.guideAnchors)}`)] : []),
      );
    }
  }

  blocks.push(heading(3, 'Purpose roles'));
  for (const [group, title] of [
    ['trainer_pack', 'Trainer pack roles'],
    ['family', 'Family roles'],
  ] as const) {
    blocks.push(heading(4, title));
    for (const role of PURPOSE_ROLES.filter((r) => r.group === group)) {
      blocks.push(
        heading(5, role.label),
        para(escapeMd(role.summary)),
        ...compact([
          field('For trainers', role.trainerSummary),
          field('For owners', role.clientSummary),
          field('Preferred instincts', labelsOf(role.preferredInstincts, instinctLabel)),
          field('Tolerated instincts', labelsOf(role.toleratedInstincts, instinctLabel)),
          field('Penalised instincts', labelsOf(role.penalisedInstincts, instinctLabel)),
          field('Required stress patterns', labelsOf(role.requiredNeuro, neuroLabel)),
          field('Penalised stress patterns', labelsOf(role.penalisedNeuro, neuroLabel)),
        ]),
        ...(role.blendRecipes.length
          ? [para(`**Blend recipes:**\n\n${bulletList(role.blendRecipes.map((r) => `**${escapeMd(r.title)}:** ${escapeMd(r.gambitNote)}`))}`)]
          : []),
      );
    }
  }
  return blocks;
}

/* ── Appendix E: Puppy development ─────────────────────────── */

function appendixPuppy(): Block[] {
  const blocks: Block[] = [
    heading(2, 'Appendix E: Puppy Development'),
    para('Developmental stages from birth to eighteen months, the nervous-system cultivation timeline, and sample daily plans from the puppy planner.'),
    heading(3, 'Stages at a glance'),
    para(mdTable(['Age', 'Focus'], PUPPY_STAGE_SUMMARY_ROWS.map((row) => [row.range, escapeMd(row.focus)]))),
    heading(3, 'Development stages'),
  ];
  for (const stage of PUPPY_DEVELOPMENT_STAGES) {
    blocks.push(
      heading(4, `${stage.label} (${stage.ageRangeLabel})`),
      para(`**Core goal:** ${escapeMd(stage.coreGoal)}`),
      para(`**Training intensity:** ${capitalise(stage.trainingIntensity.replace(/_/g, ' '))}`),
      ...compact([listField('Priorities', stage.priorities), listField('Defer', stage.defer)]),
    );
  }

  const universal = resolveCultivationTimeline({ breedNames: [] });
  blocks.push(heading(3, 'Nervous-system cultivation timeline'));
  for (const checkpoint of universal) {
    blocks.push(
      heading(4, `${checkpoint.meta.ageLabel}: ${checkpoint.stage.label}`),
      ...compact([
        listField('What you observe', checkpoint.observed),
        listField('Cultivate', checkpoint.cultivate),
        listField('Defer', checkpoint.defer),
      ]),
      para(`**Guide sections:** ${guideLinks(checkpoint.guideAnchors)}`),
    );
  }

  blocks.push(heading(3, 'Cultivation by temperament type'), para('Additional cultivation notes layered on the universal timeline for each temperament type.'));
  for (const category of Object.keys(breedCategories) as BreedCategory[]) {
    const representative = breeds.find((b) => b.category === category);
    if (!representative) continue;
    const timeline = resolveCultivationTimeline({ breedNames: [representative.name] });
    const sections: Block[] = [];
    timeline.forEach((checkpoint, index) => {
      const base = universal[index];
      const extra = (items: string[], baseItems: string[]) => items.filter((item) => !baseItems.includes(item));
      const observed = extra(checkpoint.observed, base.observed);
      const cultivate = extra(checkpoint.cultivate, base.cultivate);
      const defer = extra(checkpoint.defer, base.defer);
      if (!observed.length && !cultivate.length && !defer.length) return;
      sections.push(
        para(`**${escapeMd(checkpoint.meta.ageLabel)}**`),
        ...compact([listField('Observe', observed), listField('Cultivate', cultivate), listField('Defer', defer)]),
      );
    });
    if (sections.length) blocks.push(heading(4, breedCategories[category].label), ...sections);
  }

  blocks.push(heading(3, 'Cultivation by purpose role'));
  for (const role of PURPOSE_ROLES) {
    const timeline = resolveCultivationTimeline({ breedNames: [], roleId: role.id });
    const sections: Block[] = [];
    for (const checkpoint of timeline) {
      const overlay = checkpoint.roleOverlay;
      if (!overlay) continue;
      sections.push(
        para(`**${escapeMd(checkpoint.meta.ageLabel)}**`),
        ...compact([listField('Observe', overlay.observed), listField('Cultivate', overlay.cultivate), listField('Defer', overlay.defer)]),
      );
    }
    if (sections.length) blocks.push(heading(4, role.label), ...sections);
  }

  blocks.push(heading(3, 'Sample daily plans'), para(`*${escapeMd(getPuppyPlanDisclaimer())}*`));
  for (const ageWeeks of [8, 12, 16]) {
    const plan = buildPuppyPlan({ ageWeeks, breedName: '', useHungerTraining: false });
    blocks.push(
      heading(4, `Puppy aged ${ageWeeks} weeks`),
      para(`**Development stage:** ${escapeMd(plan.developmentStageLabel)} (${escapeMd(plan.developmentStageRange)}). ${escapeMd(plan.developmentStageGoal)}`),
      para(`**Bladder hold:** about ${plan.bladderHoldHours} hour(s), more often when active. **Awake block:** about ${plan.awakeMinutes} minutes. **Nap:** about ${plan.napMinutes} minutes.`),
      para(
        mdTable(
          ['Time', 'Activity', 'Toilet trip', 'Notes'],
          plan.schedule.map((block) => [block.timeLabel, escapeMd(block.activity), block.toiletTrigger ? 'Yes' : '', escapeMd(block.notes ?? '')]),
        ),
      ),
      ...compact([
        listField('Early security', plan.earlySecurity),
        listField('Separation from the litter', plan.separationNotes),
        listField('Food and water', plan.foodAccess),
        listField('Milk', plan.milkGuidance),
        listField('Track this week', plan.trackingItems),
        listField('Stage priorities', plan.stagePriorities),
        listField('Defer for now', plan.stageDefer),
      ]),
    );
  }
  return blocks;
}

/* ── Appendix F: Exam question bank ────────────────────────── */

function questionConditions(question: Question): string[] {
  const conditions: string[] = [];
  if (question.breedCategory !== 'all') conditions.push(`${breedCategories[question.breedCategory].label} dogs`);
  if (question.breedNames?.length) conditions.push(`breeds: ${question.breedNames.join(', ')}`);
  if (question.sizeClasses?.length) conditions.push(`sizes: ${question.sizeClasses.join(', ')}`);
  if (question.profileTags?.length) conditions.push(`profile: ${question.profileTags.join(', ').replace(/_/g, ' ')}`);
  if (question.neuroticismMin) conditions.push(`stress sensitivity ${question.neuroticismMin} or higher`);
  if (question.requiresIntact) conditions.push('intact dogs');
  if (question.requiresNeutered) conditions.push('neutered dogs');
  if (question.requiresMale) conditions.push('males');
  if (question.requiresStructureBuilding) conditions.push('owners building structure');
  return conditions;
}

function appendixExam(): Block[] {
  const topics = new Map<string, Question[]>();
  for (const question of examQuestions) {
    const list = topics.get(question.topic) ?? [];
    list.push(question);
    topics.set(question.topic, list);
  }
  const trainerOnly = examQuestions.filter((q) => q.track === 'trainer').length;

  const blocks: Block[] = [
    heading(2, 'Appendix F: Exam Question Bank'),
    para(
      `The full question bank behind the owner and trainer exams: ${examQuestions.length} questions across ${topics.size} topics. ${trainerOnly} questions appear in the trainer exam only; the rest appear in both. The correct answer is listed first; the exam shuffles the options when played.`,
    ),
  ];

  let number = 0;
  for (const [topic, questions] of topics) {
    blocks.push(heading(3, `${topic} (${questions.length})`));
    for (const question of questions) {
      number += 1;
      const [correct, ...others] = question.options;
      const tags = [question.track === 'trainer' ? 'Trainer exam only' : 'Owner and trainer exams'];
      const conditions = questionConditions(question);
      if (conditions.length) tags.push(`Asked for ${conditions.join('; ')}`);
      blocks.push(
        para(`**Q${number}.** ${escapeMd(question.text)}`),
        para(`- **Correct:** ${escapeMd(correct)}\n${others.map((option) => `- ${escapeMd(option)}`).join('\n')}`),
        para(`*Explanation:* ${escapeMd(question.explanation)} (${guideLink(question.guideLink, 'guide')})`),
        para(`*${escapeMd(tags.join('. '))}.*`),
      );
    }
  }
  return blocks;
}

/* ── Assembly: slugs, links, contents ──────────────────────── */

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

function createSlugger() {
  const used = new Map<string, number>();
  return (text: string) => {
    const base = text
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s_-]/gu, '')
      .replace(/\s/g, '-');
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };
}

function wordCount(blocks: Block[]): number {
  return blocks.reduce((total, block) => {
    const text = block.kind === 'heading' ? block.text : block.md.replace(/@@L:[^@]*@@/g, '');
    return total + (text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)?.length ?? 0);
  }, 0);
}

/* ── Authored sections ─────────────────────────────────────── */

/**
 * Reads a Markdown file from book/content/. Headings are shifted by `levelOffset`; the first
 * heading takes `titlePrefix` and is addressable in links as `book:<file name>`. Links to site
 * routes (`/guide/training#timing`) and `book:` targets resolve like links in converted pages.
 */
function authoredBlocks(source: string, levelOffset: number, titlePrefix = ''): Block[] {
  const tokens: Record<string, string> = { generated, siteName: SITE_NAME, siteUrl: SITE_URL };
  const text = readFileSync(join(contentDir, source), 'utf8')
    .replace(/\r\n/g, '\n')
    .replace(/\{\{(\w+)\}\}/g, (match, key: string) => tokens[key] ?? match);
  const route = `book:${source.replace(/\.md$/, '')}`;
  const blocks: Block[] = [];
  for (const chunk of text.split(/\n{2,}/)) {
    const md = chunk.trim();
    if (!md) continue;
    const match = /^(#{1,6})\s+(.+)$/.exec(md);
    if (match && !md.includes('\n')) {
      const first = !blocks.some((block) => block.kind === 'heading');
      blocks.push(heading(match[1].length + levelOffset, first ? titlePrefix + match[2] : match[2], [], first ? route : undefined));
    } else {
      blocks.push(para(md.replace(/\]\(((?:\/|book:)[^)\s]*)\)/g, '](@@L:$1@@)')));
    }
  }
  return blocks;
}

async function main() {
  const allPages = PARTS.flatMap((part) => part.pages).filter((entry): entry is PageEntry => 'route' in entry);
  console.log(`Reading ${allPages.length} prerendered pages from docs/…`);
  const extracted = await extractPages(allPages);

  const sections: { label: string; blocks: Block[] }[] = [{ label: 'Introduction', blocks: authoredBlocks('introduction.md', 0) }];
  let chapterNumber = 0;
  PARTS.forEach((part, index) => {
    const blocks: Block[] = [heading(1, `Part ${ROMAN[index]}: ${part.title}`)];
    if (part.intro) blocks.push(para(escapeMd(part.intro)));
    for (const entry of part.pages) {
      chapterNumber += 1;
      const chapter =
        'source' in entry
          ? authoredBlocks(entry.source, 1, `Chapter ${chapterNumber}: `)
          : convertPage(entry, extracted.get(entry.route)!, chapterNumber);
      if (!chapter.some((block) => block.kind === 'text')) throw new Error(`Page ${entry.route} produced no text`);
      blocks.push(...chapter);
    }
    sections.push({ label: `Part ${ROMAN[index]}: ${part.title}`, blocks });
  });

  const appendices: [string, () => Block[]][] = [
    ['Appendix A: Glossary', appendixGlossary],
    ['Appendix B: Rehabilitation', appendixRehabilitation],
    ['Appendix C: Problem Finder', appendixProblemFinder],
    ['Appendix D: Breeds', appendixBreeds],
    ['Appendix E: Puppy Development', appendixPuppy],
    ['Appendix F: Exam', appendixExam],
  ];
  sections.push({ label: 'Appendices (heading)', blocks: [heading(1, 'Appendices')] });
  for (const [label, render] of appendices) sections.push({ label, blocks: render() });

  const front: Block[] = [
    heading(1, SITE_NAME),
    para(`*${escapeMd(SITE_TAGLINE)}*`),
    para(`Warwick Marshall · Golden Bay, New Zealand · ${SITE_PHONE_DISPLAY} · ${SITE_EMAIL}`),
    ...authoredBlocks('disclaimer.md', 1),
    heading(2, 'Contents'),
  ];

  const body = sections.flatMap((section) => section.blocks);
  const all = [...front, ...body];

  const slug = createSlugger();
  const slugs = new Map<Block, string>();
  const anchorMap = new Map<string, string>();
  const routeMap = new Map<string, string>();
  for (const block of all) {
    if (block.kind !== 'heading') continue;
    const value = slug(block.text);
    slugs.set(block, value);
    if (block.route && !routeMap.has(block.route)) routeMap.set(block.route, value);
  }
  let currentRoute = '';
  for (const block of body) {
    if (block.kind !== 'heading') continue;
    if (block.level === 1) currentRoute = '';
    if (block.route) currentRoute = block.route;
    for (const id of block.ids) {
      const value = slugs.get(block)!;
      if (!anchorMap.has(`${currentRoute}#${id}`)) anchorMap.set(`${currentRoute}#${id}`, value);
      if (!anchorMap.has(`#${id}`)) anchorMap.set(`#${id}`, value);
    }
  }
  for (const [key, name] of htmlAnchors) {
    if (!anchorMap.has(key)) anchorMap.set(key, name);
    const globalKey = `#${key.split('#')[1]}`;
    if (!anchorMap.has(globalKey)) anchorMap.set(globalKey, name);
  }

  let resolved = 0;
  const unresolved = new Set<string>();
  const resolveHref = (href: string): string | undefined => {
    const [path, hash] = href.split('#');
    if (hash) {
      return (
        anchorMap.get(`${path}#${hash}`) ??
        anchorMap.get(`#${hash}`) ??
        routeMap.get(`/guide/${hash}`) ??
        routeMap.get(path)
      );
    }
    return routeMap.get(path || '/');
  };
  const resolveLinks = (md: string) =>
    md.replace(/\[((?:\\.|[^\]\\])*)\]\(@@L:([^@]*)@@\)/g, (_, text: string, href: string) => {
      const target = resolveHref(href);
      if (target) {
        resolved += 1;
        return `[${text}](#${target})`;
      }
      unresolved.add(href);
      return text;
    });

  const contents = body
    .filter((block): block is Extract<Block, { kind: 'heading' }> => block.kind === 'heading' && block.level <= 3)
    .map((block) => `${'  '.repeat(block.level - 1)}- [${escapeMd(block.text)}](#${slugs.get(block)})`)
    .join('\n');

  const output = all
    .flatMap((block) => {
      if (block.kind === 'heading') {
        const line = `${'#'.repeat(block.level)} ${block.text}`;
        return block.text === 'Contents' && block.level === 2 ? [line, contents] : [line];
      }
      return [resolveLinks(block.md)];
    })
    .join('\n\n');

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, `${output}\n`, 'utf8');

  console.log('\nWord counts');
  for (const section of sections) {
    if (section.label.endsWith('(heading)')) continue;
    console.log(`  ${section.label.padEnd(40)} ${wordCount(section.blocks).toLocaleString('en-NZ').padStart(9)}`);
  }
  console.log(`  ${'Total'.padEnd(40)} ${wordCount(all).toLocaleString('en-NZ').padStart(9)}`);
  console.log(`\nChapters: ${chapterNumber} · Links resolved: ${resolved}`);
  if (unresolved.size > 0) {
    console.log(`Link targets not in the book (kept as plain text): ${[...unresolved].sort().join(', ')}`);
  }
  console.log(`Wrote ${outFile.replace(`${root}\\`, '').replace(`${root}/`, '')}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
