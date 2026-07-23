import type { ComponentType } from 'react';
import type { GuideModuleId } from '@shared/guideModules';
import SectionMissingFramework from '../pages/guide-sections/SectionMissingFramework';
import SectionPillars from '../pages/guide-sections/SectionPillars';
import SectionOwnerMindset from '../pages/guide-sections/SectionOwnerMindset';
import SectionExpectations from '../pages/guide-sections/SectionExpectations';
import SectionSpeakingAloud from '../pages/guide-sections/SectionSpeakingAloud';
import SectionReadyStance from '../pages/guide-sections/SectionReadyStance';
import SectionFrontDoor from '../pages/guide-sections/SectionFrontDoor';
import SectionDogTantra from '../pages/guide-sections/SectionDogTantra';
import SectionReadingDog from '../pages/guide-sections/SectionReadingDog';
import SectionRehabilitationPatterns from '../pages/guide-sections/SectionRehabilitationPatterns';
import SectionSocialNeeds from '../pages/guide-sections/SectionSocialNeeds';
import SectionIntactLargeMales from '../pages/guide-sections/SectionIntactLargeMales';
import SectionTiming from '../pages/guide-sections/SectionTiming';
import SectionRewards from '../pages/guide-sections/SectionRewards';
import SectionCorrections from '../pages/guide-sections/SectionCorrections';
import SectionDogLanguage from '../pages/guide-sections/SectionDogLanguage';
import SectionCollarSelection from '../pages/guide-sections/SectionCollarSelection';
import SectionLeash from '../pages/guide-sections/SectionLeash';
import SectionButtPush from '../pages/guide-sections/SectionButtPush';
import SectionLeashJerk from '../pages/guide-sections/SectionLeashJerk';
import SectionVerbalCorrection from '../pages/guide-sections/SectionVerbalCorrection';
import SectionCollarSnatch from '../pages/guide-sections/SectionCollarSnatch';
import SectionPinHold from '../pages/guide-sections/SectionPinHold';
import SectionAccess from '../pages/guide-sections/SectionAccess';
import SectionCheckInSeven from '../pages/guide-sections/SectionCheckInSeven';
import SectionDaily from '../pages/guide-sections/SectionDaily';
import SectionGraduation from '../pages/guide-sections/SectionGraduation';
import SectionPuppy from '../pages/guide-sections/SectionPuppy';
import {
  GuideThemeDailyLife,
  GuideThemeLeadership,
  GuideThemePuppyPhase,
  GuideThemeSocialNeeds,
  GuideThemeTraining,
  GuideThemeUnderstanding,
} from '../pages/guide-sections/guideThemeDividers';

export const guideModuleSections: Record<GuideModuleId, ComponentType[]> = {
  foundation: [SectionMissingFramework, SectionPillars],
  leadership: [
    GuideThemeLeadership,
    SectionOwnerMindset,
    SectionExpectations,
    SectionSpeakingAloud,
    SectionReadyStance,
    SectionFrontDoor,
    SectionDogTantra,
  ],
  understanding: [GuideThemeUnderstanding, SectionReadingDog, SectionRehabilitationPatterns],
  social: [GuideThemeSocialNeeds, SectionSocialNeeds, SectionIntactLargeMales],
  training: [
    GuideThemeTraining,
    SectionTiming,
    SectionRewards,
    SectionCorrections,
    SectionDogLanguage,
    SectionCollarSelection,
    SectionLeash,
    SectionButtPush,
    SectionLeashJerk,
    SectionVerbalCorrection,
    SectionCollarSnatch,
    SectionPinHold,
    SectionAccess,
  ],
  'puppy-phase': [GuideThemePuppyPhase, SectionPuppy],
  'daily-life': [GuideThemeDailyLife, SectionCheckInSeven, SectionDaily, SectionGraduation],
};
