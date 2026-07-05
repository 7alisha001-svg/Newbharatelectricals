const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We look for <img ... /> and inject onError if not present
      // We can use a regex that matches <img ... >
      // Since it could be across multiple lines:
      const updatedContent = content.replace(/<img\s([^>]+)>/gi, (match, p1) => {
        if (p1.includes('onError=')) return match;
        // add onError just before the closing >
        // Ensure we don't break existing self-closing tags
        if (p1.endsWith('/')) {
            const inner = p1.slice(0, -1);
            return `<img ${inner} onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; e.currentTarget.onerror = null; }} />`;
        } else {
            return `<img ${p1} onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; e.currentTarget.onerror = null; }}>`;
        }
      });
      
      if (content !== updatedContent) {
        fs.writeFileSync(fullPath, updatedContent, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
