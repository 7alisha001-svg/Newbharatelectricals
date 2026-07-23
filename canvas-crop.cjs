const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

loadImage('public/header-logo-dark.png').then(image => {
  const size = image.height; // assume icon is square on the left
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Draw the image, cropping the left square part
  ctx.drawImage(image, 0, 0, size, size, 0, 0, size, size);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('public/favicon-48x48.png', buffer);
  
  const canvas32 = createCanvas(32, 32);
  const ctx32 = canvas32.getContext('2d');
  ctx32.drawImage(canvas, 0, 0, 32, 32);
  fs.writeFileSync('public/favicon-32x32.png', canvas32.toBuffer('image/png'));
  
  const canvas16 = createCanvas(16, 16);
  const ctx16 = canvas16.getContext('2d');
  ctx16.drawImage(canvas, 0, 0, 16, 16);
  fs.writeFileSync('public/favicon-16x16.png', canvas16.toBuffer('image/png'));
  
  console.log('Done generating PNGs!');
}).catch(console.error);
