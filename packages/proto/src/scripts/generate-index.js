import path from 'path';
import fs from 'fs';

const generatedDir = path.join(import.meta.url, '../generated');

if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
}

const files = fs.readdirSync(generatedDir)
  .filter(f => f.endsWith('.js') && !f.includes('index'));

const exports = files.map(file => {
  const name = file.replace('.js', '');
  return `export * from './${name}';`;
}).join('\n');

const indexContent = `// Auto-generated index file\n${exports}\n`;

fs.writeFileSync(path.join(generatedDir, 'index.js'), indexContent);
fs.writeFileSync(path.join(generatedDir, 'index.d.ts'), indexContent.replace(/\.js/g, ''));

console.log('✅ Generated index files with exports:', files.length);