const sharp = require('sharp');
const pngToIco = require('png-to-ico').default || require('png-to-ico');
const fs = require('fs');

async function main() {
  const source = 'public/header-logo-dark.png'; // or whatever is appropriate
  // We want to make a square image. We can fit it into a square with a transparent background.
  
  const squareImgBuffer = await sharp(source)
    .resize(512, 512, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .toBuffer();

  await sharp(squareImgBuffer)
    .resize(16, 16)
    .toFile('public/favicon-16x16.png');

  await sharp(squareImgBuffer)
    .resize(32, 32)
    .toFile('public/favicon-32x32.png');

  await sharp(squareImgBuffer)
    .resize(180, 180)
    .toFile('public/apple-touch-icon.png');
    
  await sharp(squareImgBuffer)
    .resize(192, 192)
    .toFile('public/android-chrome-192x192.png');
    
  await sharp(squareImgBuffer)
    .resize(512, 512)
    .toFile('public/android-chrome-512x512.png');

  pngToIco('public/favicon-32x32.png').then(buf => {
    fs.writeFileSync('public/favicon.ico', buf);
    console.log('All favicons generated successfully!');
  }).catch(console.error);
}

main().catch(console.error);
