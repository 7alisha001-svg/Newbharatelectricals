const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminLogin.tsx', 'utf8');

content = content.replace("let { error: signUpError } = await supabase.auth.signUp", "let { data, error: signUpError } = await supabase.auth.signUp");

fs.writeFileSync('src/pages/admin/AdminLogin.tsx', content);
