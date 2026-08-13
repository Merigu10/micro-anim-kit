import { readdirSync, readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const distDir = new URL('../dist/', import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, '$1');

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(2)} kB`;
}

const files = readdirSync(distDir).filter((f) => f.endsWith('.js'));

if (files.length === 0) {
  console.error('No .js files found in dist/ — run `npm run build:lib` first.');
  process.exit(1);
}

const rows = files
  .map((file) => {
    const filePath = join(distDir, file);
    const raw = readFileSync(filePath);
    const gzipped = gzipSync(raw);
    return {
      entry: file.replace(/\.js$/, ''),
      raw: statSync(filePath).size,
      gzip: gzipped.length,
    };
  })
  .sort((a, b) => a.entry.localeCompare(b.entry));

const nameWidth = Math.max(...rows.map((r) => r.entry.length), 'entry'.length);

console.log();
console.log('micro-anim-kit — bundle size per entry point (minified, React externalized)');
console.log();
console.log(`${'entry'.padEnd(nameWidth)}  ${'minified'.padStart(10)}  ${'gzip'.padStart(10)}`);
console.log('-'.repeat(nameWidth + 26));
for (const row of rows) {
  console.log(
    `${row.entry.padEnd(nameWidth)}  ${formatBytes(row.raw).padStart(10)}  ${formatBytes(row.gzip).padStart(10)}`,
  );
}
console.log();
