const sharp = require('sharp');
sharp('public/header-logo-dark.png').metadata().then(m => console.log(m));
