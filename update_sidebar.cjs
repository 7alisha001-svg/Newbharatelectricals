const fs = require('fs');

let code = fs.readFileSync('src/components/admin/AdminSidebar.tsx', 'utf8');

code = code.replace(
  "import { \n  LayoutDashboard, ShoppingCart, Package, Archive, \n  Tags, Flag, Users, Settings, LogOut, Menu, X\n} from 'lucide-react';",
  "import { \n  LayoutDashboard, ShoppingCart, Package, Archive, \n  Tags, Flag, Users, Settings, LogOut, Menu, X, Navigation as NavIcon\n} from 'lucide-react';"
);

code = code.replace(
  "  { name: 'Customers', href: '/admin/customers', icon: Users },\n  { name: 'Settings', href: '/admin/settings', icon: Settings },",
  "  { name: 'Customers', href: '/admin/customers', icon: Users },\n  { name: 'Navigation', href: '/admin/navigation', icon: NavIcon },\n  { name: 'Settings', href: '/admin/settings', icon: Settings },"
);

fs.writeFileSync('src/components/admin/AdminSidebar.tsx', code);
