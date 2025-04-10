import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';
import { manifestTemplate } from './src/manifest.template.js';

// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const platforms = {
  firefox: {}, // no background
  chrome: {
    background: {
      service_worker: "background.js"
    }
  }
};

function buildManifest(base, platform) {
  const result = { ...base };
  if (platforms[platform].background) {
    result.background = platforms[platform].background;
  }
  return result;
}

function copyFiles(srcDir, destDir, manifestObj) {
  fs.mkdirSync(destDir, { recursive: true });

  // Copy all files except manifest.template.js
  fs.readdirSync(srcDir).forEach(file => {
    if (file === 'manifest.template.js') return;
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
  });

  // Write final manifest.json
  fs.writeFileSync(path.join(destDir, 'manifest.json'), JSON.stringify(manifestObj, null, 2));
}

function zipDir(sourceDir, outPath) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', resolve);
    archive.finalize();
  });
}

async function buildAll() {
  const src = path.join(__dirname, 'src');
  const dist = path.join(__dirname, 'dist');

  for (const platform of Object.keys(platforms)) {
    const outDir = path.join(dist, platform);
    const outZip = path.join(dist, `${platform}.zip`);
    const manifest = buildManifest(manifestTemplate, platform);

    copyFiles(src, outDir, manifest);
    await zipDir(outDir, outZip);
    console.log(`✅ Built and zipped ${platform}`);
  }
}

buildAll().catch(err => {
  console.error(err);
  process.exit(1);
});