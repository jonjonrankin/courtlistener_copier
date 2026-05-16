import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const releaseDir = path.join(root, 'release');
const baseName = `courtlistener-copy-citation-v${manifest.version}`;

fs.mkdirSync(releaseDir, { recursive: true });

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function preparePackageDir(platform) {
  const packageDir = path.join(releaseDir, `tmp-${platform}`);
  fs.rmSync(packageDir, { recursive: true, force: true });
  copyDir(path.join(root, 'dist'), packageDir);

  if (platform === 'chrome') {
    const manifestPath = path.join(packageDir, 'manifest.json');
    const chromeManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    delete chromeManifest.browser_specific_settings;
    fs.writeFileSync(manifestPath, `${JSON.stringify(chromeManifest, null, 2)}\n`);
  }

  return packageDir;
}

function zipDir(suffix, packageDir) {
  const outfile = path.join(releaseDir, `${baseName}-${suffix}.zip`);
  fs.rmSync(outfile, { force: true });
  execFileSync('zip', ['-qr', outfile, '.'], { cwd: packageDir });
  return outfile;
}

execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' });

const chromeDir = preparePackageDir('chrome');
const firefoxDir = preparePackageDir('firefox');
const chromeZip = zipDir('chrome', chromeDir);
const firefoxZip = zipDir('firefox', firefoxDir);

fs.rmSync(chromeDir, { recursive: true, force: true });
fs.rmSync(firefoxDir, { recursive: true, force: true });

console.log(`Created ${path.relative(root, chromeZip)}`);
console.log(`Created ${path.relative(root, firefoxZip)}`);
