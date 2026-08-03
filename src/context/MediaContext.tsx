import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { WebsiteMedia } from '../types/media';
import { DEFAULT_WEBSITE_MEDIA } from '../data/defaultMedia';
import { fetchMediaFromDb, saveMediaToDb, deleteMediaFromDb, normalizeMediaUrl } from '../lib/mediaService';
import { supabase } from '../lib/supabase';

interface MediaContextType {
  mediaItems: WebsiteMedia[];
  mediaMap: Record<string, WebsiteMedia>;
  loading: boolean;
  getMediaUrl: (key: string, fallbackUrl?: string) => string;
  getMediaAlt: (key: string, fallbackAlt?: string) => string;
  getMediaItem: (key: string) => WebsiteMedia | undefined;
  saveMedia: (item: Partial<WebsiteMedia>) => Promise<WebsiteMedia>;
  deleteMedia: (id: string) => Promise<boolean>;
  refreshMedia: () => Promise<void>;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

const MEDIA_STORAGE_KEY = 'nbe_website_media_v2';

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dbMedia, setDbMedia] = useState<WebsiteMedia[]>(() => {
    try {
      const cached = localStorage.getItem(MEDIA_STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Could not parse cached media:', e);
    }
    return [];
  });
  const [loading, setLoading] = useState(true);

  // Sync dbMedia to localStorage whenever it changes
  useEffect(() => {
    try {
      if (dbMedia.length > 0) {
        localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(dbMedia));
      }
    } catch (e) {
      console.warn('Could not cache media to localStorage:', e);
    }
  }, [dbMedia]);

  // Merge dbMedia with default website slots (DB items override defaults with same image_key)
  const mediaMap = useMemo(() => {
    const map: Record<string, WebsiteMedia> = {};

    // First populate with default seed items
    DEFAULT_WEBSITE_MEDIA.forEach((item) => {
      map[item.image_key] = item;
    });

    // Then override with DB records
    dbMedia.forEach((item) => {
      if (item.image_key) {
        map[item.image_key] = item;
      }
    });

    return map;
  }, [dbMedia]);

  // Combined list of all media items (custom uploads + defaults)
  const mediaItems = useMemo(() => {
    const mergedList: WebsiteMedia[] = [...dbMedia];
    
    // Add default slots that aren't yet in DB
    DEFAULT_WEBSITE_MEDIA.forEach((defaultSlot) => {
      if (!mergedList.some((m) => m.image_key === defaultSlot.image_key)) {
        mergedList.push(defaultSlot);
      }
    });

    return mergedList;
  }, [dbMedia]);

  const refreshMedia = async () => {
    try {
      const data = await fetchMediaFromDb();
      const normalizedData = (data || []).map((item) => ({
        ...item,
        image_url: normalizeMediaUrl(item.image_url, item.updated_at || item.created_at || Date.now()),
      }));

      if (normalizedData.length === 0) {
        setDbMedia([]);
        try {
          localStorage.removeItem(MEDIA_STORAGE_KEY);
        } catch (e) {}
        return;
      }

      setDbMedia((prev) => {
        // Merge fetched data with existing state to avoid overwriting recent unsaved changes
        const map = new Map<string, WebsiteMedia>();
        prev.forEach((item) => map.set(item.image_key || item.id, item));
        normalizedData.forEach((item) => map.set(item.image_key || item.id, item));
        const updated = Array.from(map.values());
        try {
          localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } catch (err) {
      console.warn('Media fetch notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMedia();

    // Subscribe to realtime changes on website_media table
    const subscription = supabase
      .channel('website_media_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'website_media' }, () => {
        refreshMedia();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const getMediaItem = (key: string): WebsiteMedia | undefined => {
    return mediaMap[key];
  };

  const getMediaUrl = (key: string, fallbackUrl = ''): string => {
    const item = mediaMap[key];
    if (item && item.image_url) {
      return item.image_url;
    }
    return fallbackUrl;
  };

  const getMediaAlt = (key: string, fallbackAlt = ''): string => {
    const item = mediaMap[key];
    if (item && item.alt_text) {
      return item.alt_text;
    }
    return fallbackAlt || key;
  };

  const saveMedia = async (item: Partial<WebsiteMedia>): Promise<WebsiteMedia> => {
    const saved = await saveMediaToDb(item);
    if (saved) {
      setDbMedia((prev) => {
        const index = prev.findIndex((m) => m.id === saved.id || (m.image_key && m.image_key === saved.image_key));
        let updated: WebsiteMedia[];
        if (index >= 0) {
          updated = [...prev];
          updated[index] = saved;
        } else {
          updated = [saved, ...prev];
        }
        try {
          localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      // Sync header/footer logo with settings table in Supabase
      if (saved.image_key === 'header_logo') {
        try {
          const { data: sData } = await supabase.from('settings').select('*').eq('id', 'global').single();
          await supabase.from('settings').upsert({
            id: 'global',
            ...sData,
            logo_url: saved.image_url
          });
        } catch (e) {
          console.warn('Notice syncing logo_url to settings:', e);
        }
      } else if (saved.image_key === 'footer_logo') {
        try {
          const { data: sData } = await supabase.from('settings').select('*').eq('id', 'global').single();
          const socialLinks = sData?.social_links || {};
          await supabase.from('settings').upsert({
            id: 'global',
            ...sData,
            social_links: { ...socialLinks, footer_logo: saved.image_url }
          });
        } catch (e) {
          console.warn('Notice syncing footer_logo to settings:', e);
        }
      }

      return saved;
    }
    throw new Error('Failed to save media record');
  };

  const deleteMedia = async (id: string): Promise<boolean> => {
    const success = await deleteMediaFromDb(id);
    if (success) {
      setDbMedia((prev) => {
        const updated = prev.filter((m) => m.id !== id);
        try {
          localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
    return success;
  };

  return (
    <MediaContext.Provider
      value={{
        mediaItems,
        mediaMap,
        loading,
        getMediaUrl,
        getMediaAlt,
        getMediaItem,
        saveMedia,
        deleteMedia,
        refreshMedia,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};
