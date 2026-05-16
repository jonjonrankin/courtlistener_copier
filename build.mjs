import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';

const watch = process.argv.includes('--watch');

const outdir = 'dist';

function copyDir(src, dest, filter = () => true) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, filter);
    } else if (filter(entry.name)) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyAssets() {
  fs.rmSync(outdir, { recursive: true, force: true });
  fs.mkdirSync(outdir, { recursive: true });
  fs.copyFileSync('manifest.json', path.join(outdir, 'manifest.json'));
  if (fs.existsSync(path.join('assets', 'icons'))) {
    copyDir(path.join('assets', 'icons'), path.join(outdir, 'icons'), (name) => name.endsWith('.png'));
  }
}

copyAssets();

const ctx = await esbuild.context({
  entryPoints: ['src/content.ts'],
  bundle: true,
  outfile: path.join(outdir, 'content.js'),
  platform: 'browser',
  target: 'es2022',
  format: 'iife',
  sourcemap: false,
});

if (watch) {
  await ctx.watch();
  console.log('Watching for changes...');
} else {
  await ctx.rebuild();
  console.log('Build complete.');
  await ctx.dispose();
}
