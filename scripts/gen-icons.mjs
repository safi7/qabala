import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const svgContent = readFileSync(join(publicDir, 'icon.svg'), 'utf-8');

async function makeIcon(size, outFile) {
  const scaledSvg = svgContent.replace('viewBox="0 0 192 192"', `viewBox="0 0 192 192" width="${size}" height="${size}"`);
  await sharp(Buffer.from(scaledSvg))
    .png()
    .toFile(join(publicDir, outFile));
  console.log(`Generated ${outFile} (${size}x${size})`);
}

await makeIcon(192, 'icon-192.png');
await makeIcon(512, 'icon-512.png');
console.log('Done!');
