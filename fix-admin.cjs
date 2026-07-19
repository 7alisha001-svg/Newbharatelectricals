const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/AdminLayout.tsx', 'utf8');
content = content.replace(/navigate\('\/admin'\)/g, "navigate('/admin-login')");
content = content.replace(/<Navigate to="\/admin" replace \/>/g, '<Navigate to="/admin-login" replace />');
fs.writeFileSync('src/pages/admin/AdminLayout.tsx', content);

let loginContent = fs.readFileSync('src/pages/admin/AdminLogin.tsx', 'utf8');
loginContent = loginContent.replace(/navigate\('\/admin\/dashboard'\)/g, "navigate('/admin/dashboard')");
fs.writeFileSync('src/pages/admin/AdminLogin.tsx', loginContent);
