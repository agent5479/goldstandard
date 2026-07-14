import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ScrollToAnchor from './components/ScrollToAnchor';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BookPage from './pages/BookPage';
import GuidePage from './pages/GuidePage';
import GuideModulePage from './pages/GuideModulePage';
import ExamPage from './pages/ExamPage';
import IntelligencePage from './pages/IntelligencePage';
import DogPersonalityPage from './pages/dog-personality/DogPersonalityPage';
import BreedFinderPage from './pages/breed-finder/BreedFinderPage';
import NotFoundPage from './pages/NotFoundPage';

/** Redirect legacy .html URLs to their SPA routes, preserving the hash. */
function LegacyRedirect({ to }: { to: string }) {
  const { hash } = useLocation();
  return <Navigate to={`${to}${hash}`} replace />;
}

export default function App() {
  return (
    <>
      <ScrollToAnchor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/guide/:moduleId" element={<GuideModulePage />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/intelligence" element={<IntelligencePage />} />
        <Route path="/dog-personality" element={<DogPersonalityPage />} />
        <Route path="/breed-finder" element={<BreedFinderPage />} />

        <Route path="/index.html" element={<LegacyRedirect to="/" />} />
        <Route path="/about.html" element={<LegacyRedirect to="/about" />} />
        <Route path="/contact.html" element={<LegacyRedirect to="/contact" />} />
        <Route path="/book.html" element={<LegacyRedirect to="/book" />} />
        <Route path="/guide.html" element={<LegacyRedirect to="/guide" />} />
        <Route path="/exam.html" element={<LegacyRedirect to="/exam" />} />
        <Route path="/intelligence.html" element={<LegacyRedirect to="/intelligence" />} />
        <Route path="/dog-personality.html" element={<LegacyRedirect to="/dog-personality" />} />
        <Route path="/breed-finder.html" element={<LegacyRedirect to="/breed-finder" />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
