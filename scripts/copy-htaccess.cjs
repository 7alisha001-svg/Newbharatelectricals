const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const sourcePath = path.join(rootDir, '.htaccess');
const targetPath = path.join(rootDir, 'dist', '.htaccess');

if (!fs.existsSync(sourcePath)) {
  console.error(`Missing .htaccess at ${sourcePath}`);
  process.exit(1);
}

fs.copyFileSync(sourcePath, targetPath);
console.log(`Copied ${path.relative(rootDir, sourcePath)} to ${path.relative(rootDir, targetPath)}`);
