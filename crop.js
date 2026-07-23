const sharp = require('sharp');
sharp('public/header-logo-dark.png')
  .extract({ left: 0, top: 0, width: 250, height: 250 })
  .toFile('test-crop.png')
  .then(info => console.log('Cropped!', info))
  .catch(err => console.error(err));
