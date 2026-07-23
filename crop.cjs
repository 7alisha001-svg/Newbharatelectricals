const sharp = require('sharp');
sharp('public/header-logo-dark.png').metadata().then(m => {
  console.log(m);
  // Assuming the icon is square and on the left
  let size = m.height;
  sharp('public/header-logo-dark.png')
    .extract({ left: 0, top: 0, width: size, height: size })
    .toFile('test-crop.png')
    .then(info => console.log('Cropped!', info))
    .catch(err => console.error(err));
});
