import { Navigate, useLocation } from 'react-router-dom';
import { guideHref } from '@shared/guideHref';
import GuideHubPage from './GuideHubPage';

/** /guide with a hash redirects to the correct module; otherwise shows the hub. */
export default function GuidePage() {
  const { hash } = useLocation();
  if (hash && hash.length > 1) {
    return <Navigate to={guideHref(hash.slice(1))} replace />;
  }
  return <GuideHubPage />;
}
