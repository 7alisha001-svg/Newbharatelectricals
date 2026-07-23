const Jimp = require('jimp');
Jimp.read('public/header-logo-dark.png').then(image => {
  console.log('Size:', image.bitmap.width, 'x', image.bitmap.height);
  const size = image.bitmap.height;
  image.crop(0, 0, size, size).write('public/favicon-48x48.png', () => {
     image.resize(32, 32).write('public/favicon-32x32.png', () => {
        image.resize(16, 16).write('public/favicon-16x16.png', () => {
           console.log('Done!');
        });
     });
  });
}).catch(console.error);
