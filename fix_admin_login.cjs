const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminLogin.tsx', 'utf8');
content = content.replace(/const { error: insertError, data: rpcData } = await supabase.rpc\('create_first_admin', {\n                        if \(insertError\) throw insertError;/, 
`const { error: insertError, data: rpcData } = await supabase.rpc('create_first_admin', {
  admin_id: currentUser.id,
  admin_email: email,
  admin_full_name: fullName
});
if (insertError) throw insertError;`);

content = content.replace(/const { error: finalSignInError } = await supabase.auth.signInWithPassword\({\n            email,\n            password,\n                    if \(finalSignInError\)/,
`const { error: finalSignInError } = await supabase.auth.signInWithPassword({
  email,
  password
});
if (finalSignInError)`);

fs.writeFileSync('src/pages/admin/AdminLogin.tsx', content, 'utf8');
