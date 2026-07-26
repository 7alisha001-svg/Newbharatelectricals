import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Upload, Search, Image as ImageIcon, Copy, Check, Trash2, Edit3, 
  Eye, RefreshCw, X, Layers, AlertCircle, Sparkles, Filter, Link2,
  LayoutGrid, List, CheckSquare, Square, Download, Sliders, FileText,
  Clock, HardDrive, Maximize2, Zap, Save
} from 'lucide-react';
import { useMedia } from '../../context/MediaContext';
import { useStore } from '../../context/StoreContext';
import { supabase } from '../../lib/supabase';
import { WebsiteMedia, MediaCategory } from '../../types/media';
import { uploadMediaFile } from '../../lib/mediaService';

const CATEGORIES: MediaCategory[] = [
  'All',
  'Header & Footer',
  'Hero Banners',
  'About Us',
  'Promo Banners',
  'Category Banners',
  'Contact & Stores',
  'Products & Brands',
  'General'
];

interface PendingChange {
  file: File;
  previewUrl: string;
  item: WebsiteMedia;
}

export default function MediaLibrary() {
  const { mediaItems, saveMedia, deleteMedia, refreshMedia } = useMedia();
  const { refreshStore } = useStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory>('All');
  const [activeTab, setActiveTab] = useState<'all' | 'website_slots'>('website_slots');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  // Modals state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewModalItem, setPreviewModalItem] = useState<WebsiteMedia | null>(null);
  const [editModalItem, setEditModalItem] = useState<WebsiteMedia | null>(null);
  const [replaceTargetItem, setReplaceTargetItem] = useState<WebsiteMedia | null>(null);
  
  // Pending changes state
  const [pendingChanges, setPendingChanges] = useState<Record<string, PendingChange>>({});
  const [isSavingAll, setIsSavingAll] = useState(false);
  
  // Copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Upload form state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadKey, setUploadKey] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<string>('General');
  const [uploadAltText, setUploadAltText] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    const hasChanges = Object.keys(pendingChanges).length > 0;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    if (hasChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pendingChanges]);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showNotification('success', 'Image URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered media items
  const filteredItems = useMemo(() => {
    return mediaItems.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        (item.title || '').toLowerCase().includes(q) || 
        (item.image_key || '').toLowerCase().includes(q) || 
        (item.alt_text || '').toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [mediaItems, selectedCategory, searchQuery]);

  // Multi-select handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map(i => i.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected media item(s)?`)) {
      try {
        for (const id of selectedIds) {
          await deleteMedia(id);
        }
        showNotification('success', `Deleted ${selectedIds.length} item(s) successfully.`);
        setSelectedIds([]);
      } catch (err) {
        showNotification('error', 'Error deleting selected items.');
      }
    }
  };

  const handleBulkCopy = () => {
    const urls = filteredItems.filter(i => selectedIds.includes(i.id)).map(i => i.image_url).join('\n');
    navigator.clipboard.writeText(urls);
    showNotification('success', `Copied ${selectedIds.length} image URLs to clipboard!`);
  };

  // Drag & drop zone handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setUploadFile(file);
        const nameNoExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setUploadTitle(nameNoExt.replace(/[-_]/g, ' '));
        setUploadModalOpen(true);
      } else {
        showNotification('error', 'Please drop a valid image file.');
      }
    }
  };

  // Handle File Selection for Upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'File size exceeds 5 MB limit. Please select a smaller file.');
      return;
    }

    setUploadFile(file);
    if (!uploadTitle) {
      const nameNoExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setUploadTitle(nameNoExt.replace(/[-_]/g, ' '));
    }
  };

  // Execute Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      showNotification('error', 'Please select an image file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const imageUrl = await uploadMediaFile(uploadFile, (pct) => setUploadProgress(pct));
      
      const keyToUse = uploadKey.trim() || `img_${Date.now()}`;
      
      await saveMedia({
        image_key: keyToUse,
        title: uploadTitle.trim() || 'Uploaded Image',
        category: uploadCategory,
        image_url: imageUrl,
        alt_text: uploadAltText.trim() || uploadTitle.trim() || 'Website Image'
      });

      await refreshMedia();
      showNotification('success', 'Image uploaded successfully!');
      setUploadModalOpen(false);
      resetUploadForm();
    } catch (err: any) {
      console.error('Upload failed:', err);
      showNotification('error', err.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle direct Replace Image for a slot or existing item
  const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replaceTargetItem) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'File size exceeds 5 MB limit. Select a smaller image.');
      return;
    }

    const targetItem = replaceTargetItem;
    if (previewModalItem?.id === targetItem.id) {
       setPreviewModalItem(null);
    }
    setReplaceTargetItem(null);
    if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';

    setIsSavingAll(true);
    showNotification('success', `Uploading and updating "${targetItem.title}"...`);

    try {
      const newUrl = await uploadMediaFile(file);

      const saved = await saveMedia({
        id: targetItem.id,
        image_key: targetItem.image_key,
        title: targetItem.title,
        category: targetItem.category,
        image_url: newUrl,
        alt_text: targetItem.alt_text
      });

      // Sync header/footer logo with settings table in Supabase
      if (targetItem.image_key === 'footer_logo') {
        const { data: settingsData } = await supabase.from('settings').select('*').eq('id', 'global').single();
        const socialLinks = settingsData?.social_links || {};
        await supabase.from('settings').upsert({
          id: 'global',
          ...settingsData,
          social_links: { ...socialLinks, footer_logo: newUrl }
        });
      } else if (targetItem.image_key === 'header_logo') {
        const { data: settingsData } = await supabase.from('settings').select('*').eq('id', 'global').single();
        await supabase.from('settings').upsert({
          id: 'global',
          ...settingsData,
          logo_url: newUrl
        });
      }

      // Clear pending changes for this item if any
      setPendingChanges(prev => {
        const copy = { ...prev };
        delete copy[targetItem.id];
        return copy;
      });

      await refreshStore();
      await refreshMedia();
      showNotification('success', `"${targetItem.title}" updated and live on website!`);
    } catch (err: any) {
      console.error('Replace failed:', err);
      showNotification('error', err.message || 'Failed to replace image.');
    } finally {
      setIsSavingAll(false);
    }
  };

  const handleSaveChanges = async () => {
    if (isSavingAll || Object.keys(pendingChanges).length === 0) return;
    setIsSavingAll(true);
    let successCount = 0;
    
    try {
      for (const [id, change] of Object.entries(pendingChanges)) {
        const newUrl = await uploadMediaFile(change.file);
        await saveMedia({
          id: change.item.id,
          image_key: change.item.image_key,
          title: change.item.title,
          category: change.item.category,
          image_url: newUrl,
          alt_text: change.item.alt_text
        });

        // Sync header/footer logo with settings table if changed
        if (change.item.image_key === 'footer_logo') {
          const { data: settingsData } = await supabase.from('settings').select('*').eq('id', 'global').single();
          const socialLinks = settingsData?.social_links || {};
          await supabase.from('settings').upsert({
            id: 'global',
            ...settingsData,
            social_links: { ...socialLinks, footer_logo: newUrl }
          });
        } else if (change.item.image_key === 'header_logo') {
          const { data: settingsData } = await supabase.from('settings').select('*').eq('id', 'global').single();
          await supabase.from('settings').upsert({
            id: 'global',
            ...settingsData,
            logo_url: newUrl
          });
        }

        successCount++;
      }
      
      await refreshStore();
      await refreshMedia();
      showNotification('success', `Successfully saved ${successCount} image(s)!`);
      
      Object.values(pendingChanges).forEach(c => URL.revokeObjectURL(c.previewUrl));
      setPendingChanges({});
    } catch (err: any) {
      console.error('Save failed:', err);
      showNotification('error', err.message || 'Failed to save some images.');
    } finally {
      setIsSavingAll(false);
    }
  };

  const handleCancelChanges = () => {
    Object.values(pendingChanges).forEach(c => URL.revokeObjectURL(c.previewUrl));
    setPendingChanges({});
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setUploadKey('');
    setUploadTitle('');
    setUploadCategory('General');
    setUploadAltText('');
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Open replace modal/file selector for a slot
  const triggerReplaceForSlot = (item: WebsiteMedia) => {
    setReplaceTargetItem(item);
    setTimeout(() => {
      replaceFileInputRef.current?.click();
    }, 100);
  };

  const handleDelete = async (item: WebsiteMedia) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}" from the media library?`)) {
      try {
        await deleteMedia(item.id);
        showNotification('success', 'Image deleted from Media Library.');
        if (previewModalItem?.id === item.id) setPreviewModalItem(null);
      } catch (err) {
        showNotification('error', 'Failed to delete image.');
      }
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalItem) return;

    try {
      await saveMedia(editModalItem);

      if (editModalItem.image_key === 'footer_logo') {
        const { data: settingsData } = await supabase.from('settings').select('*').eq('id', 'global').single();
        const socialLinks = settingsData?.social_links || {};
        await supabase.from('settings').upsert({
          id: 'global',
          ...settingsData,
          social_links: { ...socialLinks, footer_logo: editModalItem.image_url }
        });
      } else if (editModalItem.image_key === 'header_logo') {
        const { data: settingsData } = await supabase.from('settings').select('*').eq('id', 'global').single();
        await supabase.from('settings').upsert({
          id: 'global',
          ...settingsData,
          logo_url: editModalItem.image_url
        });
      }

      await refreshStore();
      await refreshMedia();
      showNotification('success', 'Image details saved!');
      setEditModalItem(null);
    } catch (err) {
      showNotification('error', 'Failed to update image details.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold transition-all ${
          notification.type === 'success' ? 'bg-brand-green' : 'bg-red-500'
        }`}>
          {notification.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Hidden file input for Replace action */}
      <input 
        type="file" 
        ref={replaceFileInputRef} 
        accept="image/png, image/jpeg, image/webp, image/svg+xml" 
        className="hidden" 
        onChange={handleReplaceFileChange} 
      />

      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-brand-green/10 text-brand-green rounded-xl">
              <ImageIcon size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-black text-gray-900 uppercase">Media Library & Image Manager</h1>
              <p className="text-gray-500 text-xs mt-0.5">Change any website image instantly without writing code</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshMedia()}
            className="p-3 bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
            title="Refresh Media List"
          >
            <RefreshCw size={18} />
          </button>
          
          <button
            onClick={() => {
              resetUploadForm();
              setUploadModalOpen(true);
            }}
            className="flex items-center gap-2 bg-brand-green text-white font-bold text-sm px-5 py-3 rounded-xl hover:bg-brand-dark transition-all shadow-md hover:shadow-lg"
          >
            <Upload size={18} />
            <span>Upload New Image</span>
          </button>
        </div>
      </div>

      {/* Top View Selector Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('website_slots')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === 'website_slots'
                ? 'bg-brand-green text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Layers size={16} />
            <span>Website Image Slots ({mediaItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === 'all'
                ? 'bg-brand-green text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ImageIcon size={16} />
            <span>All Media Gallery</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center text-xs text-gray-500">
          <Sparkles size={14} className="text-amber-500 mr-1.5" />
          <span>Select any slot below to replace its image on the live website</span>
        </div>
      </div>

      {/* Search, Filter, View Mode & Drag-Drop Bar */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-white rounded-2xl p-4 border transition-all ${
          isDragging ? 'border-brand-green bg-emerald-50/50 shadow-lg ring-2 ring-brand-green/30' : 'border-gray-200 shadow-sm'
        } flex flex-col md:flex-row gap-4 justify-between items-center relative`}
      >
        {isDragging && (
          <div className="absolute inset-0 bg-brand-green/10 backdrop-blur-xs rounded-2xl flex items-center justify-center z-20 pointer-events-none">
            <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-xl border border-brand-green font-bold text-brand-green text-sm">
              <Upload size={20} className="animate-bounce" />
              <span>Drop image file here to upload!</span>
            </div>
          </div>
        )}

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search title, key, category or alt text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-green focus:bg-white transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Pills & View Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 custom-scrollbar max-w-md">
            <Filter size={14} className="text-gray-400 mr-1 shrink-0" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-gray-100 p-1 rounded-xl shrink-0 border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Operations Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-gray-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="bg-brand-green text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              {selectedIds.length} Selected
            </span>
            <button 
              onClick={toggleSelectAll}
              className="text-xs text-gray-300 hover:text-white underline font-medium"
            >
              {selectedIds.length === filteredItems.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBulkCopy}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
            >
              <Copy size={14} />
              <span>Copy URLs</span>
            </button>

            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow"
            >
              <Trash2 size={14} />
              <span>Delete Selected</span>
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="p-1.5 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* WEBSITE SLOTS VIEW */}
      {activeTab === 'website_slots' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <Sparkles className="text-brand-green shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Live Website Image Slots</h4>
              <p className="text-xs text-gray-600 mt-0.5">
                These are pre-configured website image locations (Logos, Hero Slides, About Us, Banners). Click <strong>"Replace Image"</strong> on any slot to change that image live across the entire website!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item) => {
              const isLogo = item.category === 'Header & Footer' || (item.image_key && item.image_key.includes('logo'));
              return (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image Box */}
                <div className={`relative flex items-center justify-center border-b border-gray-100 overflow-hidden ${
                  isLogo 
                    ? 'h-52 md:h-56 p-4 bg-slate-900 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px]' 
                    : 'h-48 p-3 bg-gray-900/5'
                }`}>
                  <img 
                    src={pendingChanges[item.id]?.previewUrl || item.image_url} 
                    alt={item.alt_text || item.title} 
                    className={`max-h-full max-w-full object-contain ${
                      isLogo ? 'p-2 filter drop-shadow-md' : ''
                    } group-hover:scale-105 transition-transform duration-300`}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (item.image_key === 'header_logo') {
                        target.src = '/header-logo-dark.png';
                      } else if (item.image_key === 'footer_logo') {
                        target.src = '/footer-logo-light.png';
                      } else {
                        target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop';
                      }
                    }}
                  />
                  {pendingChanges[item.id] && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow">
                      Unsaved Change
                    </div>
                  )}
                  {!pendingChanges[item.id] && (
                    <div className="absolute top-2 left-2 bg-gray-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      {item.category}
                    </div>
                  )}
                  
                  <button
                    onClick={() => setPreviewModalItem(item)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-gray-700 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    title="View Fullsize"
                  >
                    <Eye size={16} />
                  </button>
                </div>

                {/* Info Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 truncate" title={item.title}>{item.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <code className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono font-bold truncate max-w-full">
                        {item.image_key}
                      </code>
                    </div>
                    {item.alt_text && (
                      <p className="text-[11px] text-gray-500 mt-1.5 line-clamp-1 italic">
                        Alt: "{item.alt_text}"
                      </p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => triggerReplaceForSlot(item)}
                      disabled={isUploading && replaceTargetItem?.id === item.id}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-brand-green hover:bg-brand-dark text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                    >
                      <RefreshCw size={14} className={isUploading && replaceTargetItem?.id === item.id ? 'animate-spin' : ''} />
                      <span>{pendingChanges[item.id] ? 'Change Again' : 'Replace Image'}</span>
                    </button>

                    <button
                      onClick={() => handleCopyUrl(item.image_url, item.id)}
                      className="p-2 text-gray-500 hover:text-brand-green hover:bg-gray-100 rounded-xl transition-colors"
                      title="Copy Image URL"
                    >
                      {copiedId === item.id ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    </button>

                    <button
                      onClick={() => setEditModalItem(item)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-xl transition-colors"
                      title="Edit Details"
                    >
                      <Edit3 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <ImageIcon size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-800">No media items found</h3>
              <p className="text-xs text-gray-500 mt-1">Try searching with a different term or category filter.</p>
            </div>
          )}
        </div>
      )}

      {/* ALL MEDIA GALLERY VIEW */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative"
              >
                <div className="h-36 bg-gray-50 flex items-center justify-center p-2 relative overflow-hidden">
                  <img 
                    src={pendingChanges[item.id]?.previewUrl || item.image_url} 
                    alt={item.alt_text || item.title} 
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  {pendingChanges[item.id] && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow z-10">
                      Unsaved
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => setPreviewModalItem(item)}
                      className="p-2 bg-white text-gray-900 rounded-xl shadow hover:bg-gray-100"
                      title="Preview"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => handleCopyUrl(item.image_url, item.id)}
                      className="p-2 bg-white text-gray-900 rounded-xl shadow hover:bg-gray-100"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    </button>

                    <button
                      onClick={() => triggerReplaceForSlot(item)}
                      className="p-2 bg-brand-green text-white rounded-xl shadow hover:bg-brand-dark"
                      title="Replace"
                    >
                      <RefreshCw size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-white border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900 truncate" title={item.title}>{item.title}</h4>
                  <p className="text-[10px] text-gray-500 truncate mt-0.5">{item.category}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <ImageIcon size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-800">No media items match your search</h3>
            </div>
          )}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setUploadModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-2"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-brand-green/10 text-brand-green rounded-2xl">
                <Upload size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Upload Image to Media Library</h3>
                <p className="text-xs text-gray-500">Supports JPG, PNG, SVG, WEBP up to 5 MB</p>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Drop area */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 hover:border-brand-green rounded-2xl p-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100/50 transition-colors"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  className="hidden" 
                  onChange={handleFileSelect} 
                />
                
                {uploadFile ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden mb-2 flex items-center justify-center border">
                      <img src={URL.createObjectURL(uploadFile)} alt="Preview" className="max-h-full max-w-full object-contain" />
                    </div>
                    <p className="text-xs font-bold text-gray-800">{uploadFile.name}</p>
                    <p className="text-[10px] text-gray-500">{(uploadFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload size={32} className="mx-auto text-gray-400 mb-1" />
                    <p className="text-xs font-bold text-gray-700">Click to browse or drag & drop image</p>
                    <p className="text-[10px] text-gray-500">Automatic compression and WebP optimization applied</p>
                  </div>
                )}
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-brand-green">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-brand-green h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Image Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Solar Offer Banner"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green"
                />
              </div>

              {/* Category Select */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Image Key <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. hero_banner_1"
                    value={uploadKey}
                    onChange={(e) => setUploadKey(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green font-mono"
                  />
                </div>
              </div>

              {/* Alt Text Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Alt Text (Accessibility & SEO)</label>
                <input
                  type="text"
                  placeholder="Descriptive text for accessibility"
                  value={uploadAltText}
                  onChange={(e) => setUploadAltText(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="flex-1 py-3 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !uploadFile}
                  className="flex-1 py-3 text-xs font-bold text-white bg-brand-green hover:bg-brand-dark rounded-xl transition-colors shadow-md disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Save & Publish Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW LIGHTBOX MODAL */}
      {previewModalItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative border border-gray-100 flex flex-col md:flex-row gap-6">
            <button
              onClick={() => setPreviewModalItem(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 z-10 bg-white/80 rounded-full"
            >
              <X size={20} />
            </button>

            {/* Left Preview Image */}
            <div className={`md:w-1/2 border border-gray-100 rounded-2xl flex items-center justify-center p-6 min-h-[260px] ${
              previewModalItem.category === 'Header & Footer' || (previewModalItem.image_key && previewModalItem.image_key.includes('logo'))
                ? 'bg-slate-900 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px]'
                : 'bg-gray-900/5'
            }`}>
              <img 
                src={pendingChanges[previewModalItem.id]?.previewUrl || previewModalItem.image_url} 
                alt={previewModalItem.alt_text || previewModalItem.title} 
                className="max-h-[350px] max-w-full object-contain rounded-lg p-2"
              />
            </div>

            {/* Right Meta Info & Controls */}
            <div className="md:w-1/2 flex flex-col justify-between space-y-4">
              <div>
                <span className="inline-block bg-brand-green/10 text-brand-green text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
                  {previewModalItem.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900">{previewModalItem.title}</h3>
                
                <div className="mt-3 space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Image Key</span>
                    <p className="text-xs font-mono bg-gray-100 px-2.5 py-1 rounded-lg text-gray-800 font-bold truncate mt-0.5">
                      {previewModalItem.image_key}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Alt Text</span>
                    <p className="text-xs text-gray-700 bg-gray-50 px-2.5 py-1 rounded-lg mt-0.5 border border-gray-100">
                      {previewModalItem.alt_text || 'No alt text set'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Public Image URL</span>
                    <div className="flex gap-2 mt-0.5">
                      <input 
                        readOnly 
                        value={previewModalItem.image_url} 
                        className="flex-1 text-[11px] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 font-mono text-gray-600 truncate"
                      />
                      <button
                        onClick={() => handleCopyUrl(previewModalItem.image_url, previewModalItem.id)}
                        className="p-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                        title="Copy URL"
                      >
                        {copiedId === previewModalItem.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                <button
                  onClick={() => triggerReplaceForSlot(previewModalItem)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-brand-green text-white font-bold text-xs py-2.5 px-3 rounded-xl hover:bg-brand-dark transition-all"
                >
                  <RefreshCw size={14} />
                  <span>Replace Image</span>
                </button>

                <button
                  onClick={() => {
                    setEditModalItem(previewModalItem);
                    setPreviewModalItem(null);
                  }}
                  className="flex items-center justify-center gap-1.5 bg-gray-100 text-gray-800 font-bold text-xs py-2.5 px-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <Edit3 size={14} />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(previewModalItem)}
                  className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                  title="Delete Image"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModalItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setEditModalItem(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-2"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Image Details</h3>

            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editModalItem.title}
                  onChange={(e) => setEditModalItem({ ...editModalItem, title: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                <select
                  value={editModalItem.category}
                  onChange={(e) => setEditModalItem({ ...editModalItem, category: e.target.value as MediaCategory })}
                  className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green"
                >
                  {CATEGORIES.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Image Key (Website Reference Key)</label>
                <input
                  type="text"
                  required
                  value={editModalItem.image_key}
                  onChange={(e) => setEditModalItem({ ...editModalItem, image_key: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Alt Text</label>
                <input
                  type="text"
                  value={editModalItem.alt_text || ''}
                  onChange={(e) => setEditModalItem({ ...editModalItem, alt_text: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editModalItem.image_url}
                  onChange={(e) => setEditModalItem({ ...editModalItem, image_url: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-brand-green font-mono"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalItem(null)}
                  className="flex-1 py-3 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-bold text-white bg-brand-green hover:bg-brand-dark rounded-xl transition-colors shadow-md"
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STICKY SAVE BAR */}
      {Object.keys(pendingChanges).length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 shadow-2xl rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 min-w-[320px] max-w-lg w-full animate-fade-in-up">
          <div className="flex-1 flex items-center gap-3">
            <div className="bg-amber-100 text-amber-600 p-2 rounded-xl">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Unsaved Changes</p>
              <p className="text-xs text-gray-500">{Object.keys(pendingChanges).length} image(s) ready to update</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleCancelChanges}
              disabled={isSavingAll}
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={isSavingAll}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 text-sm font-bold text-white bg-brand-green hover:bg-brand-dark rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              {isSavingAll ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              <span>{isSavingAll ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
