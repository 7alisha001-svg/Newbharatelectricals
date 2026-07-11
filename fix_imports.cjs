const fs = require('fs');


function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/import { Menu, X, ChevronDown, Search, ShoppingCart, Zap, FileText } from 'lucide-react';/, "import { Menu, X, ChevronDown, Search, ShoppingCart, FileText } from 'lucide-react';");
  content = content.replace(/import { LayoutDashboard, ShoppingBag, Package, Users, Settings, LogOut, Tags, ListTree, Menu, Share2, Database, Table } from 'lucide-react';/, "import { LayoutDashboard, ShoppingBag, Package, Users, Settings, LogOut, ListTree, Share2, Database, Table } from 'lucide-react';");
  content = content.replace(/import { X, Upload, ImageIcon } from 'lucide-react';/, "import { X, Upload } from 'lucide-react';");
  content = content.replace(/import { Shield, Truck, Clock, Check } from 'lucide-react';/, "import { Shield, Truck, Clock } from 'lucide-react';");
  content = content.replace(/import { ArrowRight, Phone, MessageCircle } from 'lucide-react';\n/, "");
  content = content.replace(/const { bgImage } = brand;\n/, "");
  content = content.replace(/const \[loading, setLoading\] = useState\(true\);/, "const [, setLoading] = useState(true);");
  content = content.replace(/const { session } = useAuth\(\);\n/, "");
  content = content.replace(/import { useRef, useState, useEffect } from 'react';/, "import { useState, useEffect } from 'react';");
  content = content.replace(/import { Link, useParams, useNavigate } from 'react-router-dom';/, "import { useParams, useNavigate } from 'react-router-dom';");
  content = content.replace(/import { Plus, Edit2, Trash2, ArrowLeft, Save, X, Upload } from 'lucide-react';/, "import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';");
  content = content.replace(/import { ShoppingBag, Package, DollarSign, Users, TrendingUp, Archive } from 'lucide-react';/, "import { ShoppingBag, Package, DollarSign, Users } from 'lucide-react';");
  content = content.replace(/import { getAccessToken, fetchGoogleSheetsData } from '..\/..\/lib\/googleSheets';/, "import { fetchGoogleSheetsData } from '../../lib/googleSheets';");
  content = content.replace(/import { Database, RefreshCw, Save, AlertCircle, ChevronRight, CheckCircle, ArrowRight, HelpCircle } from 'lucide-react';/, "import { Database, RefreshCw, Save, AlertCircle, CheckCircle } from 'lucide-react';");
  content = content.replace(/import { Package, AlertCircle, TrendingUp, TrendingDown, Archive } from 'lucide-react';/, "import { Package, AlertCircle } from 'lucide-react';");
  content = content.replace(/import { Save, Plus, Trash2, GripVertical } from 'lucide-react';/, "import { Save, Plus, Trash2 } from 'lucide-react';");
  content = content.replace(/import { Save, ArrowLeft, Plus, X, Upload } from 'lucide-react';/, "import { Save, ArrowLeft, Plus, X } from 'lucide-react';");
  fs.writeFileSync(filePath, content, 'utf8');
}

fixFile('src/components/Navbar.tsx');
fixFile('src/components/admin/AdminSidebar.tsx');
fixFile('src/components/admin/ImageUploader.tsx');
fixFile('src/pages/BrandPage.tsx');
fixFile('src/pages/CheckoutPage.tsx');
fixFile('src/pages/GenericSubCategoryPage.tsx');
fixFile('src/pages/admin/AdminLayout.tsx');
fixFile('src/pages/admin/CategoryProductManager.tsx');
fixFile('src/pages/admin/Dashboard.tsx');
fixFile('src/pages/admin/GoogleSheetsPage.tsx');
fixFile('src/pages/admin/Inventory.tsx');
fixFile('src/pages/admin/Navigation.tsx');
fixFile('src/pages/admin/ProductForm.tsx');

console.log("Fixed unused variables");
