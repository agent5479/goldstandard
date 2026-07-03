import {
  ANCHOR_TO_MODULE,
  getGuideModule,
  isGuideModuleId,
  normalizeGuideAnchor,
  type GuideModuleId,
} from './guideModules';

export const PUBLIC_GUIDE_BASE_URL = 'https://agent5479.github.io/goldstandard/guide';

export function resolveGuideLocation(anchor: string): {
  moduleId: GuideModuleId;
  anchor: string;
} {
  const normalized = normalizeGuideAnchor(anchor);
  const moduleId = ANCHOR_TO_MODULE[normalized] ?? 'foundation';
  return { moduleId, anchor: normalized };
}

/** Relative SPA path, e.g. /guide/training#timing */
export function guideHref(anchor: string): string {
  const { moduleId, anchor: normalized } = resolveGuideLocation(anchor);
  return `/guide/${moduleId}#${normalized}`;
}

/** Absolute public URL for trainer reports and external links. */
export function guidePublicUrl(anchor: string): string {
  const { moduleId, anchor: normalized } = resolveGuideLocation(anchor);
  return `${PUBLIC_GUIDE_BASE_URL}/${moduleId}#${normalized}`;
}

export function guideModulePath(moduleId: GuideModuleId): string {
  return getGuideModule(moduleId).route;
}

export function guideModuleHref(moduleId: string): string {
  if (!isGuideModuleId(moduleId)) return '/guide';
  return guideModulePath(moduleId);
}
