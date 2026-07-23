const sharp = require('sharp');
sharp('public/infinity.svg').resize(32, 32).toFile('public/favicon-32x32.png').then(() => console.log('OK')).catch(console.error);
