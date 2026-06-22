import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/style.css';

const rootEl = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter basename="/goldstandard">
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Production builds prerender route HTML into docs/; hydrate instead of replacing it.
if (import.meta.env.PROD && rootEl.innerHTML.trim().length > 0) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}
