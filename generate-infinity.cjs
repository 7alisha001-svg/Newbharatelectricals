const { createCanvas } = require('canvas');
const fs = require('fs');
const size = 512;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

ctx.clearRect(0, 0, size, size);

ctx.beginPath();
ctx.moveTo(256, 256);
ctx.bezierCurveTo(256, 150, 100, 150, 100, 256);
ctx.bezierCurveTo(100, 362, 256, 362, 256, 256);
ctx.bezierCurveTo(256, 150, 412, 150, 412, 256);
ctx.bezierCurveTo(412, 362, 256, 362, 256, 256);
ctx.strokeStyle = '#2563EB'; // brand blue
ctx.lineWidth = 60;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.stroke();

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('public/favicon-512x512.png', buffer);

function saveResized(targetSize, name) {
    const c = createCanvas(targetSize, targetSize);
    const cx = c.getContext('2d');
    cx.drawImage(canvas, 0, 0, targetSize, targetSize);
    fs.writeFileSync(name, c.toBuffer('image/png'));
}

saveResized(192, 'public/android-chrome-192x192.png');
saveResized(180, 'public/apple-touch-icon.png');
saveResized(48, 'public/favicon-48x48.png');
saveResized(32, 'public/favicon-32x32.png');
saveResized(16, 'public/favicon-16x16.png');
console.log('Done generating infinity icons!');
