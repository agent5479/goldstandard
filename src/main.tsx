import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/style.css';

const rootEl = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
  </StrictMode>
);

const hasPrerenderedMarkup = import.meta.env.PROD && rootEl.innerHTML.trim().length > 0;
const pathname = window.location.pathname.replace(/\/$/, '') || '/';
const isBookRoute = pathname.endsWith('/book');

// The booking form depends on live dates and API capability checks that differ between
// prerender time and the visitor's browser — hydrate everything else, client-render /book.
if (hasPrerenderedMarkup && !isBookRoute) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}
