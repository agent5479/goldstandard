/**
 * Injects Firebase web config into dist/ at deploy time (GitHub Actions or manual).
 * Does NOT inject passwords — login uses Firebase Authentication.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const outputPath = join(distDir, 'env-config.js');
const placeholder = '<!-- RUNTIME_CONFIG -->';

const keys = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_DATABASE_URL',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
  'DEFAULT_TENANT_ID',
  'BOOKING_API_URL',
  'BOOKING_IMPORT_KEY',
];

function readEnv(name) {
  return process.env[name] || process.env[`VITE_${name}`] || '';
}

if (!existsSync(distDir)) {
  console.error('dist/ not found — run npm run build first');
  process.exit(1);
}

const assignments = keys.map((key) => `window.ENV_${key}=${JSON.stringify(readEnv(key))};`);

writeFileSync(
  outputPath,
  [
    '// Generated at deploy time — do not commit',
    `// Generated: ${new Date().toISOString()}`,
    ...assignments,
    '',
  ].join('\n')
);
console.log(`Wrote ${outputPath}`);

const inlineScript = `<script src="/env-config.js"></script>`;
const indexPath = join(distDir, 'index.html');

if (existsSync(indexPath)) {
  let html = readFileSync(indexPath, 'utf8');
  if (html.includes(placeholder)) {
    html = html.replace(placeholder, inlineScript);
  } else if (!html.includes('env-config.js')) {
    html = html.replace('</head>', `  ${inlineScript}\n  </head>`);
  }
  writeFileSync(indexPath, html);
  console.log(`Updated ${indexPath}`);
}

console.log(`Firebase configured: ${Boolean(readEnv('FIREBASE_API_KEY') && readEnv('FIREBASE_DATABASE_URL'))}`);
