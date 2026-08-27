import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Upload, Image as ImageIcon, Save, Trash2, RefreshCw, 
  Check, AlertCircle, X, Monitor, Smartphone, Tablet
} from 'lucide-react';
import { useMedia } from '../../context/MediaContext';
import { supabase } from '../../lib/supabase';
import { uploadMediaFile } from '../../lib/mediaService';

const HERO_BANNER_KEY = 'hero_banner_1';

export default function HomepageBanner() {
  const navigate = useNavigate();
  const { getMediaUrl, getMediaAlt, refreshMedia } = useMedia();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentBanner, setCurrentBanner] = useState<string>('');
  const [currentAlt, setCurrentAlt] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setCurrentBanner(getMediaUrl(HERO_BANNER_KEY, ''));
    setCurrentAlt(getMediaAlt(HERO_BANNER_KEY, ''));
  }, [getMediaUrl, getMediaAlt]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'File size exceeds 5 MB limit. Please select a smaller image.');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/jpg'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(file.type) && !['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext || '')) {
      showNotification('error', 'Unsupported format. Please upload JPG, PNG, WEBP, or SVG.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!selectedFile) {
      showNotification('error', 'Please select an image file first.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const imageUrl = await uploadMediaFile(selectedFile, (pct) => setUploadProgress(pct));

      const { error } = await supabase
        .from('website_media')
        .upsert({
          image_key: HERO_BANNER_KEY,
          title: 'Homepage Hero Banner',
          category: 'Hero Banners',
          image_url: imageUrl,
          alt_text: 'New Bharat Electricals - Homepage Banner',
          updated_at: new Date().toISOString()
        }, { onConflict: 'image_key' });

      if (error) throw error;

      await refreshMedia();
      setCurrentBanner(imageUrl);
      setSelectedFile(null);
      setPreviewUrl('');
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
      showNotification('success', 'Homepage banner updated successfully! The website will reflect the new banner shortly.');
    } catch (err: any) {
      console.error('Banner upload failed:', err);
      showNotification('error', err.message || 'Failed to upload banner. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentBanner) return;
    if (!window.confirm('Are you sure you want to remove the current homepage banner? This will revert to the default banner.')) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('website_media')
        .delete()
        .eq('image_key', HERO_BANNER_KEY);

      if (error) throw error;

      await refreshMedia();
      setCurrentBanner('');
      setCurrentAlt('');
      showNotification('success', 'Banner removed. The homepage will now use the default banner.');
    } catch (err: any) {
      console.error('Banner delete failed:', err);
      showNotification('error', err.message || 'Failed to remove banner.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelSelection = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const displaySrc = previewUrl || currentBanner || '';
  const fallbackSrc = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1600&auto=format&fit=crop';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Helmet>
        <title>Homepage Banner | Admin Panel | New Bharat Electricals</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {notification && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold transition-all ${
          notification.type === 'success' ? 'bg-brand-green' : 'bg-red-500'
        }`}>
          {notification.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-brand-green/10 text-brand-green rounded-xl">
            <ImageIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-black text-gray-900 uppercase">Homepage Banner</h1>
            <p className="text-gray-500 text-xs mt-0.5">Manage the single full-width banner displayed at the top of your homepage</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Monitor size={16} className="text-gray-400" />
            Current Active Banner
          </h2>
          
          <div className="relative w-full aspect-[21/9] bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
            {displaySrc ? (
              <img 
                src={displaySrc} 
                alt={currentAlt || 'Current homepage banner'} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== fallbackSrc) {
                    target.src = fallbackSrc;
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <ImageIcon size={40} />
                <p className="text-xs font-semibold">No custom banner set</p>
                <p className="text-[10px]">Using default banner</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <Tablet size={12} />
            <Smartphone size={12} />
            <span>Responsive preview (desktop / tablet / mobile)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-green text-white font-bold text-xs py-3 px-4 rounded-xl hover:bg-brand-dark transition-all shadow-md disabled:opacity-50"
            >
              <Upload size={16} />
              <span>Choose New Banner</span>
            </button>

            {currentBanner && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold text-xs py-3 px-4 rounded-xl hover:bg-red-100 transition-all disabled:opacity-50"
              >
                {isDeleting ? <RefreshCw size={16} className="animate-spin" /> : <Trash2 size={16} />}
                <span className="hidden sm:inline">Remove</span>
              </button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <RefreshCw size={16} className="text-gray-400" />
            New Banner Preview
          </h2>

          <div className="relative w-full aspect-[21/9] bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="New banner preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <ImageIcon size={40} />
                <p className="text-xs font-semibold">No file selected</p>
                <p className="text-[10px]">Select an image to preview</p>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Selected File</span>
                <button onClick={handleCancelSelection} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-600 truncate">{selectedFile.name}</p>
              <p className="text-[10px] text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          )}

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

          <button
            onClick={handleSave}
            disabled={!selectedFile || isUploading}
            className="w-full flex items-center justify-center gap-2 bg-brand-green text-white font-bold text-sm py-3.5 px-6 rounded-xl hover:bg-brand-dark transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Uploading & Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save & Publish Banner
              </>
            )}
          </button>

          <p className="text-[10px] text-gray-400 text-center">
            Supported formats: JPG, PNG, WEBP, SVG. Max file size: 5 MB.
            <br />
            The banner will appear on the homepage immediately after saving.
          </p>
        </div>
      </div>
    </div>
  );
}
