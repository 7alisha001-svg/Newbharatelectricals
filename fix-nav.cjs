const fs = require('fs');
for (const file of ['src/components/Navbar.tsx', 'src/components/Footer.tsx']) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(
      'const navLinks = baseNavLinks.map',
      'const navLinks = (Array.isArray(baseNavLinks) ? baseNavLinks : mainNavLinks).map'
    );
    // Footer uses baseNavLinks
    content = content.replace(
      /settings\?\.social_links\?\.navigation \|\| (fallbackNavLinks|mainNavLinks)/,
      `(Array.isArray(settings?.social_links?.navigation) ? settings.social_links.navigation : $1)`
    );
    fs.writeFileSync(file, content);
  }
}
