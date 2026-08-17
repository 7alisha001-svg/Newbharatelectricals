import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../context/StoreContext';
import {
  connectGoogleAccount,
  disconnectGoogleAccount,
} from '../../lib/googleSheetsAuth';
import {
  listUserSpreadsheets,
  createSpreadsheet,
  readSpreadsheetValues,
  updateSpreadsheetValues,
  getSpreadsheetSheets,
  GoogleSpreadsheet,
} from '../../lib/googleSheetsService';
import {
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  LogOut,
  RefreshCw,
  ExternalLink,
  Database,
  Sparkles,
} from 'lucide-react';
import { User, Session } from '@supabase/supabase-js';

export default function GoogleSheetsPage() {
  const { refreshStore } = useStore();

  // ============================================================
  // AUTH STATE
  // ============================================================

  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  // ============================================================
  // GOOGLE TOKEN RESOLVER
  // Priority:
  // 1. session.provider_token
  // 2. user.identities[].identity_data.access_token
  // 3. user_metadata.identities[].access_token
  // ============================================================

  const getGoogleAccessToken = (session: Session | null): string | null => {
    if (!session?.user) {
      return null;
    }

    // ------------------------------------------------------------
    // LEVEL 1 — Supabase session.provider_token
    // ------------------------------------------------------------
    if (session.provider_token) {
      return session.provider_token;
    }

    // ------------------------------------------------------------
    // LEVEL 2 — user.identities[].identity_data.access_token
    // ------------------------------------------------------------
    const identities = session.user.identities || [];

    const googleIdentity = identities.find(
      (identity) => identity.provider === 'google'
    );

    const identityData = googleIdentity?.identity_data as
      | Record<string, any>
      | undefined;

    if (
      identityData &&
      typeof identityData.access_token === 'string' &&
      identityData.access_token
    ) {
      return identityData.access_token;
    }

    // ------------------------------------------------------------
    // LEVEL 3 — user_metadata.identities[].access_token
    // ------------------------------------------------------------
    const metadataIdentities = session.user.user_metadata?.identities;

    if (Array.isArray(metadataIdentities)) {
      const metadataGoogleIdentity = metadataIdentities.find(
        (identity: any) => identity?.provider === 'google'
      );

      if (
        metadataGoogleIdentity &&
        typeof metadataGoogleIdentity.access_token === 'string' &&
        metadataGoogleIdentity.access_token
      ) {
        return metadataGoogleIdentity.access_token;
      }
    }

    // Some older structures may store identities as an object.
    if (
      metadataIdentities &&
      typeof metadataIdentities === 'object' &&
      !Array.isArray(metadataIdentities)
    ) {
      const metadataGoogleIdentity = Object.values(
        metadataIdentities
      ).find(
        (identity: any) => identity?.provider === 'google'
      ) as any;

      if (
        metadataGoogleIdentity &&
        typeof metadataGoogleIdentity.access_token === 'string' &&
        metadataGoogleIdentity.access_token
      ) {
        return metadataGoogleIdentity.access_token;
      }
    }

    return null;
  };

  // ============================================================
  // GENERAL STATE
  // ============================================================

  const [spreadsheets, setSpreadsheets] = useState<GoogleSpreadsheet[]>([]);
  const [loadingSheets, setLoadingSheets] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'export' | 'import' | 'realtime'
  >('export');

  const [alert, setAlert] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // ============================================================
  // EXPORT STATE
  // ============================================================

  const [exportMode, setExportMode] = useState<'new' | 'existing'>('new');
  const [newSheetTitle, setNewSheetTitle] = useState(
    'New Bharat Electricals Products'
  );
  const [selectedExportSheetId, setSelectedExportSheetId] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportedSheetUrl, setExportedSheetUrl] = useState<string | null>(
    null
  );
  const [totalProducts, setTotalProducts] = useState(0);

  // ============================================================
  // IMPORT STATE
  // ============================================================

  const [selectedImportSheetId, setSelectedImportSheetId] = useState('');
  const [sheetsInSpreadsheet, setSheetsInSpreadsheet] = useState<string[]>(
    []
  );
  const [selectedTabName, setSelectedTabName] = useState('');
  const [loadingTabs, setLoadingTabs] = useState(false);

  const [sheetRows, setSheetRows] = useState<string[][]>([]);
  const [fetchingRows, setFetchingRows] = useState(false);

  const [duplicateStrategy, setDuplicateStrategy] = useState<
    'update' | 'skip'
  >('update');

  const [importing, setImporting] = useState(false);

  const [importResult, setImportResult] = useState<{
    added: number;
    updated: number;
    skipped: number;
    errors: string[];
  } | null>(null);

  // ============================================================
  // REAL-TIME INTEGRATION SETTINGS
  // ============================================================

  const [spreadsheetIdSetting, setSpreadsheetIdSetting] = useState('');
  const [appScriptUrlSetting, setAppScriptUrlSetting] = useState('');
  const [inquirySheetNameSetting, setInquirySheetNameSetting] =
    useState('Inquiries');
  const [orderSheetNameSetting, setOrderSheetNameSetting] =
    useState('Orders');
  const [syncEnabledSetting, setSyncEnabledSetting] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  // ============================================================
  // SYNC STATS
  // ============================================================

  const [pendingInquiriesCount, setPendingInquiriesCount] = useState(0);
  const [syncedInquiriesCount, setSyncedInquiriesCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [syncedOrdersCount, setSyncedOrdersCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);

  const [syncResult, setSyncResult] = useState<{
    successCount: number;
    failCount: number;
    errors: string[];
  } | null>(null);

  // ============================================================
  // SETTINGS + STATS
  // ============================================================

  const fetchSettingsAndStats = async () => {
    setLoadingStats(true);

    try {
      const { data: settingsData } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'global')
        .single();

      if (settingsData) {
        const socialLinks = settingsData.social_links || {};

        setSpreadsheetIdSetting(
          socialLinks.google_sheets_spreadsheet_id || ''
        );

        setAppScriptUrlSetting(
          socialLinks.google_sheets_app_script_url || ''
        );

        setInquirySheetNameSetting(
          socialLinks.google_sheets_inquiry_sheet_name || 'Inquiries'
        );

        setOrderSheetNameSetting(
          socialLinks.google_sheets_order_sheet_name || 'Orders'
        );

        setSyncEnabledSetting(
          socialLinks.google_sheets_sync_enabled !== false
        );
      }

      // ----------------------------------------------------------
      // INQUIRY STATS
      // ----------------------------------------------------------

      const { data: allInquiries } = await supabase
        .from('inquiries')
        .select('id, message, sheets_sync_status' as any);

      let syncedInq = 0;
      let pendingInq = 0;

      if (allInquiries) {
        allInquiries.forEach((item: any) => {
          if (item.sheets_sync_status === 'synced') {
            syncedInq++;
          } else if (
            item.sheets_sync_status === 'pending' ||
            item.sheets_sync_status === 'failed'
          ) {
            pendingInq++;
          } else {
            try {
              const msg = JSON.parse(item.message || '{}');

              if (msg.sheets_sync_status === 'synced') {
                syncedInq++;
              } else {
                pendingInq++;
              }
            } catch {
              pendingInq++;
            }
          }
        });
      }

      setSyncedInquiriesCount(syncedInq);
      setPendingInquiriesCount(pendingInq);

      // ----------------------------------------------------------
      // ORDER STATS
      // ----------------------------------------------------------

      const { data: allOrders } = await supabase
        .from('orders')
        .select('id, cart_items, sheets_sync_status' as any);

      let syncedOrd = 0;
      let pendingOrd = 0;

      if (allOrders) {
        allOrders.forEach((item: any) => {
          if (item.sheets_sync_status === 'synced') {
            syncedOrd++;
          } else if (
            item.sheets_sync_status === 'pending' ||
            item.sheets_sync_status === 'failed'
          ) {
            pendingOrd++;
          } else {
            try {
              const cart = item.cart_items || {};

              if (Array.isArray(cart)) {
                pendingOrd++;
              } else if (cart.sheets_sync_status === 'synced') {
                syncedOrd++;
              } else {
                pendingOrd++;
              }
            } catch {
              pendingOrd++;
            }
          }
        });
      }

      setSyncedOrdersCount(syncedOrd);
      setPendingOrdersCount(pendingOrd);
    } catch (err) {
      console.error(
        'Error loading settings and statistics:',
        err
      );
    } finally {
      setLoadingStats(false);
    }
  };

  // ============================================================
  // SAVE SETTINGS
  // ============================================================

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setAlert(null);

    try {
      const { data: settingsData } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'global')
        .single();

      const existingSocialLinks = settingsData?.social_links || {};

      const updatedSocialLinks = {
        ...existingSocialLinks,
        google_sheets_spreadsheet_id: spreadsheetIdSetting,
        google_sheets_app_script_url: appScriptUrlSetting,
        google_sheets_inquiry_sheet_name: inquirySheetNameSetting,
        google_sheets_order_sheet_name: orderSheetNameSetting,
        google_sheets_sync_enabled: syncEnabledSetting,
      };

      const { error } = await supabase
        .from('settings')
        .update({
          social_links: updatedSocialLinks,
        })
        .eq('id', 'global');

      if (error) {
        throw error;
      }

      setAlert({
        text: 'Google Sheets integration settings updated successfully!',
        type: 'success',
      });
    } catch (err: any) {
      console.error(
        'Error saving integration settings:',
        err
      );

      setAlert({
        text: `Failed to save settings: ${
          err.message || String(err)
        }`,
        type: 'error',
      });
    } finally {
      setSavingSettings(false);
    }
  };

  // ============================================================
  // SYNC PENDING
  // ============================================================

  const handleSyncPending = async () => {
    setSyncingAll(true);
    setSyncResult(null);
    setAlert(null);

    try {
      const response = await fetch(
        '/api/sheets/sync-pending',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessToken,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || 'Server returned an error'
        );
      }

      setSyncResult({
        successCount: result.successCount,
        failCount: result.failCount,
        errors: result.errors || [],
      });

      if (result.failCount === 0) {
        setAlert({
          text: `Sync complete! Successfully processed ${result.successCount} records.`,
          type: 'success',
        });
      } else {
        setAlert({
          text: `Sync completed with warnings. Synced ${result.successCount} records, failed ${result.failCount}.`,
          type: 'error',
        });
      }

      await fetchSettingsAndStats();
    } catch (err: any) {
      console.error(
        'Sync execution failed:',
        err
      );

      setAlert({
        text: `Synchronization failed: ${
          err.message || String(err)
        }`,
        type: 'error',
      });
    } finally {
      setSyncingAll(false);
    }
  };

  // ============================================================
  // LOAD AUTH SESSION
  // ============================================================

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) {
          return;
        }

        const googleToken = getGoogleAccessToken(session);

        if (session?.user && googleToken) {
          setUser(session.user);
          setAccessToken(googleToken);
        } else {
          setUser(null);
          setAccessToken(null);
        }
      } catch (e) {
        console.error(
          'Error loading Google auth session:',
          e
        );
      } finally {
        if (isMounted) {
          setLoadingAuth(false);
        }
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) {
          return;
        }

        const googleToken =
          getGoogleAccessToken(session);

        if (session?.user && googleToken) {
          setUser(session.user);
          setAccessToken(googleToken);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setAccessToken(null);
          setSpreadsheets([]);
        } else if (session?.user) {
          // User is authenticated but no Google provider token
          // is available.
          setUser(null);
          setAccessToken(null);
        }
      }
    );

    const initData = async () => {
      try {
        const { count } = await supabase
          .from('products')
          .select('*', {
            count: 'exact',
            head: true,
          });

        setTotalProducts(count || 0);
      } catch (e) {
        console.error(
          'Error fetching product count:',
          e
        );
      }

      await fetchSettingsAndStats();
    };

    initData();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ============================================================
  // LOAD SPREADSHEETS
  // ============================================================

  const loadSpreadsheets = async (token: string) => {
    setLoadingSheets(true);

    try {
      const list = await listUserSpreadsheets(token);

      setSpreadsheets(list);

      if (list.length > 0) {
        setSelectedExportSheetId(list[0].id);
        setSelectedImportSheetId(list[0].id);
      }
    } catch (err) {
      console.error(
        'Failed to load spreadsheets:',
        err
      );
    } finally {
      setLoadingSheets(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      loadSpreadsheets(accessToken);
    }
  }, [accessToken]);

  // ============================================================
  // LOAD SHEET TABS
  // ============================================================

  useEffect(() => {
    const fetchTabs = async () => {
      if (
        !accessToken ||
        !selectedImportSheetId
      ) {
        return;
      }

      setLoadingTabs(true);

      try {
        const tabs = await getSpreadsheetSheets(
          accessToken,
          selectedImportSheetId
        );

        setSheetsInSpreadsheet(tabs);

        if (tabs.length > 0) {
          setSelectedTabName(tabs[0]);
        }
      } catch (err: any) {
        console.error(
          'Failed to fetch spreadsheet tabs:',
          err
        );

        setAlert({
          type: 'error',
          text: `Could not load tabs from spreadsheet: ${
            err.message || err
          }`,
        });
      } finally {
        setLoadingTabs(false);
      }
    };

    fetchTabs();
  }, [
    selectedImportSheetId,
    accessToken,
  ]);

  // ============================================================
  // GOOGLE LOGIN
  // ============================================================

  const handleGoogleLogin = async () => {
    setSigningIn(true);
    setAlert(null);

    try {
      const result =
        await connectGoogleAccount(supabase);

      if (
        result &&
        result.googleIdentity &&
        result.googleIdentity.access_token
      ) {
        setUser(result.user);
        setAccessToken(
          result.googleIdentity.access_token
        );

        setAlert({
          type: 'success',
          text: 'Successfully authenticated with Google!',
        });
      } else {
        throw new Error(
          'Google account linked but no access token was returned.'
        );
      }
    } catch (err: any) {
      setAlert({
        type: 'error',
        text: `Google Login Failed: ${
          err.message || err
        }`,
      });
    } finally {
      setSigningIn(false);
    }
  };

  // ============================================================
  // GOOGLE LOGOUT
  // ============================================================

  const handleGoogleLogout = async () => {
    try {
      await disconnectGoogleAccount(supabase);
    } catch (err: any) {
      console.error(
        'Error disconnecting Google account:',
        err
      );
    } finally {
      setUser(null);
      setAccessToken(null);
      setSpreadsheets([]);

      setAlert({
        type: 'info',
        text: 'Disconnected from Google Account.',
      });
    }
  };

  // ============================================================
  // HELPERS
  // ============================================================

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const parseFeatures = (
    text: string
  ): string[] => {
    if (!text) {
      return [];
    }

    return text
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);
  };

  const parseSpecs = (
    text: string
  ): {
    label: string;
    value: string;
  }[] => {
    if (!text) {
      return [];
    }

    const pairs = text.split(',');

    const list: {
      label: string;
      value: string;
    }[] = [];

    for (const pair of pairs) {
      const idx = pair.indexOf(':');

      if (idx !== -1) {
        const label = pair
          .substring(0, idx)
          .trim();

        const value = pair
          .substring(idx + 1)
          .trim();

        if (label || value) {
          list.push({
            label,
            value,
          });
        }
      }
    }

    return list;
  };

  // ============================================================
  // EXPORT
  // ============================================================

  const handleExport = async () => {
    if (!accessToken) {
      return;
    }

    setExporting(true);
    setAlert(null);
    setExportedSheetUrl(null);

    try {
      const {
        data: dbProducts,
        error: dbError,
      } = await supabase
        .from('products')
        .select('*')
        .order('name', {
          ascending: true,
        });

      if (dbError) {
        throw dbError;
      }

      if (
        !dbProducts ||
        dbProducts.length === 0
      ) {
        throw new Error(
          'No products found in database to export.'
        );
      }

      let targetSheetId =
        selectedExportSheetId;

      let targetSheetName = '';

      if (exportMode === 'new') {
        const sheetTitle =
          newSheetTitle.trim() ||
          `Products Export ${new Date().toLocaleDateString()}`;

        const newSheet =
          await createSpreadsheet(
            accessToken,
            sheetTitle
          );

        targetSheetId = newSheet.id;
        targetSheetName = newSheet.name;

        await loadSpreadsheets(accessToken);
      } else {
        const matchingSheet =
          spreadsheets.find(
            (s) =>
              s.id ===
              selectedExportSheetId
          );

        targetSheetName = matchingSheet
          ? matchingSheet.name
          : 'Selected Spreadsheet';
      }

      const headers = [
        'ID',
        'SKU',
        'Name',
        'Brand',
        'Category',
        'Subcategory',
        'Regular Price',
        'Sale Price',
        'Stock Quantity',
        'Status',
        'Image URL',
        'Description',
        'Short Description',
        'Features (Comma-separated)',
        'Specs (Label:Value, Label:Value)',
      ];

      const rows = dbProducts.map((p) => {
        const featuresStr =
          Array.isArray(p.features)
            ? p.features.join(', ')
            : '';

        let specsStr = '';

        if (Array.isArray(p.specs)) {
          specsStr = p.specs
            .map(
              (s: any) =>
                `${s.label || ''}:${s.value || ''}`
            )
            .join(', ');
        }

        return [
          p.id || '',
          p.sku || '',
          p.name || '',
          p.brand || '',
          p.category || '',
          p.subcategory || '',
          p.regular_price || 0,
          p.sale_price || '',
          p.stock_quantity || 0,
          p.status || 'draft',
          p.image_url || '',
          p.description || '',
          p.short_description || '',
          featuresStr,
          specsStr,
        ];
      });

      const finalValues = [
        headers,
        ...rows,
      ];

      const defaultRange =
        'A1:O' +
        (finalValues.length + 5);

      await updateSpreadsheetValues(
        accessToken,
        targetSheetId,
        defaultRange,
        finalValues
      );

      setExportedSheetUrl(
        `https://docs.google.com/spreadsheets/d/${targetSheetId}/edit`
      );

      setAlert({
        type: 'success',
        text: `Successfully exported ${dbProducts.length} products to "${targetSheetName}"!`,
      });
    } catch (err: any) {
      console.error(
        'Export error:',
        err
      );

      setAlert({
        type: 'error',
        text: `Export failed: ${
          err.message || err
        }`,
      });
    } finally {
      setExporting(false);
    }
  };

  // ============================================================
  // FETCH IMPORT PREVIEW
  // ============================================================

  const handleFetchPreview = async () => {
    if (
      !accessToken ||
      !selectedImportSheetId ||
      !selectedTabName
    ) {
      return;
    }

    setFetchingRows(true);
    setAlert(null);
    setImportResult(null);

    try {
      const values =
        await readSpreadsheetValues(
          accessToken,
          selectedImportSheetId,
          `${selectedTabName}!A1:Z1000`
        );

      if (values.length === 0) {
        throw new Error(
          'Spreadsheet tab is empty.'
        );
      }

      setSheetRows(values);

      setAlert({
        type: 'info',
        text: `Loaded ${values.length} rows (including header) from the spreadsheet. Check columns and preview below.`,
      });
    } catch (err: any) {
      console.error(
        'Fetch rows error:',
        err
      );

      setAlert({
        type: 'error',
        text: `Could not read spreadsheet rows: ${
          err.message || err
        }`,
      });
    } finally {
      setFetchingRows(false);
    }
  };

  // ============================================================
  // IMPORT
  // ============================================================

  const handleImport = async () => {
    if (sheetRows.length < 2) {
      return;
    }

    const proceed = window.confirm(
      `Are you sure you want to import/update products in the database? This will process ${
        sheetRows.length - 1
      } spreadsheet row(s) using the '${duplicateStrategy}' strategy.`
    );

    if (!proceed) {
      return;
    }

    setImporting(true);
    setAlert(null);

    let added = 0;
    let updated = 0;
    let skipped = 0;

    const errors: string[] = [];

    try {
      const headers = sheetRows[0].map(
        (h) => h.trim().toLowerCase()
      );

      const dataRows =
        sheetRows.slice(1);

      const colIdx = {
        id: headers.indexOf('id'),
        sku: headers.indexOf('sku'),
        name: headers.indexOf('name'),
        brand: headers.indexOf('brand'),
        category:
          headers.indexOf('category'),
        subcategory:
          headers.indexOf('subcategory'),
        regular_price:
          headers.indexOf('regular price'),
        sale_price:
          headers.indexOf('sale price'),
        stock_quantity:
          headers.indexOf('stock quantity'),
        status:
          headers.indexOf('status'),
        image_url:
          headers.indexOf('image url'),
        description:
          headers.indexOf('description'),
        short_description:
          headers.indexOf('short description'),
        features:
          headers.indexOf(
            'features (comma-separated)'
          ),
        specs:
          headers.indexOf(
            'specs (label:value, label:value)'
          ),
      };

      if (colIdx.regular_price === -1) {
        colIdx.regular_price =
          headers.indexOf('price');
      }

      if (colIdx.stock_quantity === -1) {
        colIdx.stock_quantity =
          headers.indexOf('stock');
      }

      const {
        data: existingProducts,
        error: fetchErr,
      } = await supabase
        .from('products')
        .select('*');

      if (fetchErr) {
        throw fetchErr;
      }

      for (
        let i = 0;
        i < dataRows.length;
        i++
      ) {
        const row = dataRows[i];

        const getVal = (
          idx: number,
          fallback = ''
        ) => {
          if (
            idx !== -1 &&
            idx < row.length
          ) {
            return row[idx]
              ? String(row[idx]).trim()
              : fallback;
          }

          return fallback;
        };

        const name =
          getVal(colIdx.name);

        if (!name) {
          errors.push(
            `Row ${i + 2}: Skipped because product 'Name' is empty.`
          );

          skipped++;
          continue;
        }

        const sku =
          getVal(colIdx.sku);

        const brand =
          getVal(colIdx.brand);

        const category =
          getVal(colIdx.category) ||
          'power-solutions';

        const subcategory =
          getVal(colIdx.subcategory) ||
          'batteries';

        const regularPriceVal =
          getVal(
            colIdx.regular_price
          );

        const regular_price =
          regularPriceVal
            ? Number(
                regularPriceVal.replace(
                  /[^0-9.]/g,
                  ''
                )
              )
            : null;

        const salePriceVal =
          getVal(colIdx.sale_price);

        const sale_price =
          salePriceVal
            ? Number(
                salePriceVal.replace(
                  /[^0-9.]/g,
                  ''
                )
              )
            : null;

        const stockVal =
          getVal(
            colIdx.stock_quantity
          );

        const stock_quantity =
          stockVal
            ? Number(
                stockVal.replace(
                  /[^0-9]/g,
                  ''
                )
              )
            : 0;

        const status =
          getVal(colIdx.status)
            .toLowerCase() ===
          'publish'
            ? 'publish'
            : 'draft';

        const image_url =
          getVal(colIdx.image_url);

        const description =
          getVal(
            colIdx.description
          );

        const short_description =
          getVal(
            colIdx.short_description
          ) ||
          description.slice(
            0,
            150
          );

        const featuresStr =
          getVal(
            colIdx.features
          );

        const features =
          parseFeatures(
            featuresStr
          );

        const specsStr =
          getVal(colIdx.specs);

        const specs =
          parseSpecs(specsStr);

        const id =
          getVal(colIdx.id);

        const slug =
          generateSlug(name);

        let existingMatch =
          null;

        if (id) {
          existingMatch =
            existingProducts?.find(
              (p) => p.id === id
            );
        } else if (sku) {
          existingMatch =
            existingProducts?.find(
              (p) => p.sku === sku
            );
        } else {
          existingMatch =
            existingProducts?.find(
              (p) =>
                p.slug === slug
            );
        }

        const payload: any = {
          name,
          slug,
          sku,
          brand,
          category,
          subcategory,
          regular_price,
          sale_price,
          stock_quantity,
          status,
          image_url,
          description,
          short_description,
          features,
          specs,
          updated_at:
            new Date().toISOString(),
        };

        if (existingMatch) {
          if (
            duplicateStrategy ===
            'skip'
          ) {
            skipped++;
            continue;
          }

          const {
            error: updateErr,
          } = await supabase
            .from('products')
            .update(payload)
            .eq(
              'id',
              existingMatch.id
            );

          if (updateErr) {
            errors.push(
              `Row ${i + 2} (${name}): ${updateErr.message}`
            );
          } else {
            updated++;
          }
        } else {
          const {
            error: insertErr,
          } = await supabase
            .from('products')
            .insert([payload]);

          if (insertErr) {
            errors.push(
              `Row ${i + 2} (${name}): ${insertErr.message}`
            );
          } else {
            added++;
          }
        }
      }

      setImportResult({
        added,
        updated,
        skipped,
        errors,
      });

      await refreshStore();

      setAlert({
        type: 'success',
        text: `Completed importing spreadsheet data: added ${added}, updated ${updated}, skipped ${skipped}.`,
      });

      setSheetRows([]);
    } catch (err: any) {
      console.error(
        'Import process failed:',
        err
      );

      setAlert({
        type: 'error',
        text: `Import process failed: ${
          err.message || err
        }`,
      });
    } finally {
      setImporting(false);
    }
  };

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loadingAuth) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
        <p className="text-sm font-semibold text-gray-500 font-sans">
          Connecting to authentication services...
        </p>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="space-y-6 max-w-4xl">
      {/* HEADER */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Google Sheets Sync
          </h1>

          <p className="text-gray-500 mt-1 text-sm">
            Bulk-edit and sync your product inventory using Google Sheets spreadsheets
          </p>
        </div>

        {user && (
          <div className="flex items-center gap-3 bg-gray-100/80 p-2 rounded-xl border border-gray-200">
            {user.user_metadata?.avatar_url ? (
              <img
                src={
                  user.user_metadata
                    .avatar_url
                }
                alt={
                  user.user_metadata
                    .full_name || ''
                }
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold text-xs uppercase">
                {(
                  user.user_metadata
                    ?.full_name ||
                  user.user_metadata
                    ?.name ||
                  'G'
                ).charAt(0)}
              </div>
            )}

            <div className="text-left">
              <p className="text-xs font-bold text-gray-900 line-clamp-1">
                {user.user_metadata
                  ?.full_name ||
                  user.user_metadata
                    ?.name ||
                  'Google Account'}
              </p>

              <p className="text-[10px] text-gray-500 line-clamp-1">
                {user.email}
              </p>
            </div>

            <button
              onClick={
                handleGoogleLogout
              }
              title="Sign Out Google Account"
              className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors ml-1"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>

      {/* ALERT */}

      {alert && (
        <div
          className={`p-4 rounded-xl text-sm flex items-start gap-3 ${
            alert.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : alert.type === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}
        >
          {alert.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-green-500 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
          )}

          <div>
            <p className="font-semibold">
              {alert.text}
            </p>
          </div>
        </div>
      )}

      {/* GOOGLE LOGIN */}

      {!user ? (
        <div className="bg-white rounded-2xl shadow-md border-none p-8 text-center flex flex-col items-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-green-50 to-emerald-100 rounded-full flex items-center justify-center border border-green-200">
            <FileSpreadsheet className="w-8 h-8 text-brand-green" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 font-sans">
              Authorize Google Sheets Access
            </h2>

            <p className="text-gray-500 text-sm mt-2 max-w-sm">
              Link your Google Workspace Account with permission to create spreadsheets, export product catalogs, and fetch spreadsheet records.
            </p>
          </div>

          <button
            onClick={
              handleGoogleLogin
            }
            disabled={signingIn}
            className="inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-200 shadow-sm transition-all w-full max-w-xs focus:ring-2 focus:ring-brand-green/20 disabled:opacity-50"
          >
            {signingIn ? (
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            ) : (
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-5 h-5"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
            )}

            Sign in with Google
          </button>

          <div className="text-gray-400 text-xs flex items-center gap-1.5">
            <Sparkles
              size={12}
              className="text-amber-500"
            />

            Secure integration under Google API User Data Policies
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* NAVIGATION TABS */}

          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => {
                setActiveTab(
                  'export'
                );
                setAlert(null);
              }}
              className={`flex items-center gap-2 py-3 px-6 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'export'
                  ? 'border-brand-green text-brand-green font-bold bg-white rounded-t-xl'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Download size={16} />
              Export to Sheets
            </button>

            <button
              onClick={() => {
                setActiveTab(
                  'import'
                );
                setAlert(null);
              }}
              className={`flex items-center gap-2 py-3 px-6 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'import'
                  ? 'border-brand-green text-brand-green font-bold bg-white rounded-t-xl'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Upload size={16} />
              Import from Sheets
            </button>

            <button
              onClick={() => {
                setActiveTab(
                  'realtime'
                );
                setAlert(null);
                fetchSettingsAndStats();
              }}
              className={`flex items-center gap-2 py-3 px-6 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab ===
                'realtime'
                  ? 'border-brand-green text-brand-green font-bold bg-white rounded-t-xl'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <RefreshCw size={16} />
              Real-time Forms Sync
            </button>
          </div>

          {/* ================================================== */}
          {/* EXPORT TAB */}
          {/* ================================================== */}

          {activeTab ===
            'export' && (
            <div className="bg-white rounded-2xl shadow-md border-none p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Export Product Catalog
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  Dump your entire database catalogue (
                  {totalProducts} items) directly into a Google Spreadsheet.
                </p>
              </div>

              <div className="space-y-4 max-w-xl">
                <div className="flex items-center gap-6">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="exportMode"
                      value="new"
                      checked={
                        exportMode ===
                        'new'
                      }
                      onChange={() =>
                        setExportMode(
                          'new'
                        )
                      }
                      className="text-brand-green focus:ring-brand-green mr-2"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      Create new Spreadsheet
                    </span>
                  </label>

                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="exportMode"
                      value="existing"
                      checked={
                        exportMode ===
                        'existing'
                      }
                      onChange={() =>
                        setExportMode(
                          'existing'
                        )
                      }
                      className="text-brand-green focus:ring-brand-green mr-2"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      Overwrite existing Spreadsheet
                    </span>
                  </label>
                </div>

                {exportMode ===
                'new' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Spreadsheet Title
                    </label>

                    <input
                      type="text"
                      value={
                        newSheetTitle
                      }
                      onChange={(e) =>
                        setNewSheetTitle(
                          e.target.value
                        )
                      }
                      placeholder="e.g. Products Inventory Export"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green text-sm"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Spreadsheet
                    </label>

                    {loadingSheets ? (
                      <div className="flex items-center gap-2 py-2 text-xs text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading your spreadsheets...
                      </div>
                    ) : spreadsheets.length ===
                      0 ? (
                      <p className="text-xs text-amber-600 font-medium">
                        No spreadsheets found in your Drive. Create a new one instead.
                      </p>
                    ) : (
                      <select
                        value={
                          selectedExportSheetId
                        }
                        onChange={(e) =>
                          setSelectedExportSheetId(
                            e.target
                              .value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green text-sm bg-white"
                      >
                        {spreadsheets.map(
                          (s) => (
                            <option
                              key={
                                s.id
                              }
                              value={
                                s.id
                              }
                            >
                              {s.name} (
                              {s.modifiedTime
                                ? new Date(
                                    s.modifiedTime
                                  ).toLocaleDateString()
                                : 'N/A'}
                              )
                            </option>
                          )
                        )}
                      </select>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={
                    handleExport
                  }
                  disabled={
                    exporting ||
                    (exportMode ===
                      'existing' &&
                      !selectedExportSheetId)
                  }
                  className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2.5 px-6 rounded-xl transition-all inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {exporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Exporting Catalog...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Export {totalProducts}{' '}
                      Products
                    </>
                  )}
                </button>
              </div>

              {exportedSheetUrl && (
                <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-emerald-200">
                      <FileSpreadsheet className="w-6 h-6 text-brand-green" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Your sheet is ready!
                      </p>

                      <p className="text-xs text-gray-500">
                        All columns generated with SKU, categories, prices and description fields.
                      </p>
                    </div>
                  </div>

                  <a
                    href={
                      exportedSheetUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold py-1.5 px-4 rounded-lg text-xs inline-flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink size={14} />
                    Open Google Sheet
                  </a>
                </div>
              )}
            </div>
          )}

          {/* ================================================== */}
          {/* IMPORT TAB */}
          {/* ================================================== */}

          {activeTab ===
            'import' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-md border-none p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Import Products from Google Sheets
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Select a spreadsheet and tab, review the data structure, and import products back into your database.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Spreadsheet
                    </label>

                    {loadingSheets ? (
                      <div className="flex items-center gap-2 py-2 text-xs text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading spreadsheets...
                      </div>
                    ) : spreadsheets.length ===
                      0 ? (
                      <p className="text-xs text-amber-600">
                        No spreadsheets found in your Drive.
                      </p>
                    ) : (
                      <select
                        value={
                          selectedImportSheetId
                        }
                        onChange={(e) =>
                          setSelectedImportSheetId(
                            e.target
                              .value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green text-sm bg-white"
                      >
                        {spreadsheets.map(
                          (s) => (
                            <option
                              key={
                                s.id
                              }
                              value={
                                s.id
                              }
                            >
                              {s.name}
                            </option>
                          )
                        )}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Tab / Sheet
                    </label>

                    {loadingTabs ? (
                      <div className="flex items-center gap-2 py-2 text-xs text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading tabs...
                      </div>
                    ) : sheetsInSpreadsheet.length ===
                      0 ? (
                      <p className="text-xs text-gray-500 italic">
                        Choose a spreadsheet to view sheets
                      </p>
                    ) : (
                      <select
                        value={
                          selectedTabName
                        }
                        onChange={(e) =>
                          setSelectedTabName(
                            e.target
                              .value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green text-sm bg-white"
                      >
                        {sheetsInSpreadsheet.map(
                          (t) => (
                            <option
                              key={t}
                              value={t}
                            >
                              {t}
                            </option>
                          )
                        )}
                      </select>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-4">
                  <button
                    onClick={
                      handleFetchPreview
                    }
                    disabled={
                      fetchingRows ||
                      !selectedImportSheetId ||
                      !selectedTabName
                    }
                    className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2.5 px-6 rounded-xl transition-all inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    {fetchingRows ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Fetching spreadsheet values...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} />
                        Fetch Sheet Data
                      </>
                    )}
                  </button>
                </div>
              </div>

              {sheetRows.length >
                0 && (
                <div className="bg-white rounded-2xl shadow-md border-none p-6 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Spreadsheet Data Preview
                    </h3>

                    <p className="text-gray-500 text-xs mt-0.5">
                      Showing up to 3 row previews. Make sure column names like SKU, Name, Brand, Price, and Stock exist.
                    </p>
                  </div>

                  <div className="overflow-x-auto border border-gray-100 rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 text-gray-700 uppercase border-b border-gray-100">
                          {sheetRows[0]
                            .slice(
                              0,
                              8
                            )
                            .map(
                              (
                                header,
                                idx
                              ) => (
                                <th
                                  key={
                                    idx
                                  }
                                  className="p-3 font-semibold"
                                >
                                  {
                                    header
                                  }
                                </th>
                              )
                            )}

                          {sheetRows[0]
                            .length >
                            8 && (
                            <th className="p-3 font-semibold">
                              ...
                            </th>
                          )}
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {sheetRows
                          .slice(
                            1,
                            4
                          )
                          .map(
                            (
                              row,
                              rIdx
                            ) => (
                              <tr
                                key={
                                  rIdx
                                }
                                className="hover:bg-gray-50"
                              >
                                {row
                                  .slice(
                                    0,
                                    8
                                  )
                                  .map(
                                    (
                                      val,
                                      cIdx
                                    ) => (
                                      <td
                                        key={
                                          cIdx
                                        }
                                        className="p-3 truncate max-w-[150px]"
                                      >
                                        {
                                          val
                                        }
                                      </td>
                                    )
                                  )}

                                {row.length >
                                  8 && (
                                  <td className="p-3 text-gray-400">
                                    ...
                                  </td>
                                )}
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-900">
                        Import Strategy
                      </p>

                      <div className="flex items-center gap-6 mt-1.5">
                        <label className="inline-flex items-center cursor-pointer text-xs">
                          <input
                            type="radio"
                            name="strategy"
                            value="update"
                            checked={
                              duplicateStrategy ===
                              'update'
                            }
                            onChange={() =>
                              setDuplicateStrategy(
                                'update'
                              )
                            }
                            className="text-brand-green focus:ring-brand-green mr-2"
                          />

                          <span>
                            Update existing products & add new
                          </span>
                        </label>

                        <label className="inline-flex items-center cursor-pointer text-xs">
                          <input
                            type="radio"
                            name="strategy"
                            value="skip"
                            checked={
                              duplicateStrategy ===
                              'skip'
                            }
                            onChange={() =>
                              setDuplicateStrategy(
                                'skip'
                              )
                            }
                            className="text-brand-green focus:ring-brand-green mr-2"
                          />

                          <span>
                            Only insert new, skip existing products
                          </span>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={
                        handleImport
                      }
                      disabled={
                        importing
                      }
                      className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2.5 px-6 rounded-xl transition-all inline-flex items-center gap-2 self-end disabled:opacity-50"
                    >
                      {importing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Database size={16} />
                          Import{' '}
                          {sheetRows.length -
                            1}{' '}
                          Products
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {importResult && (
                <div className="bg-white rounded-2xl shadow-md border-none p-6 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Import Complete
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                      <p className="text-2xl font-black text-green-700">
                        {
                          importResult.added
                        }
                      </p>

                      <p className="text-xs font-semibold text-green-600 uppercase mt-0.5">
                        Added
                      </p>
                    </div>

                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      <p className="text-2xl font-black text-blue-700">
                        {
                          importResult.updated
                        }
                      </p>

                      <p className="text-xs font-semibold text-blue-600 uppercase mt-0.5">
                        Updated
                      </p>
                    </div>

                    <div className="bg-gray-100/50 p-4 rounded-xl border border-gray-200">
                      <p className="text-2xl font-black text-gray-700">
                        {
                          importResult.skipped
                        }
                      </p>

                      <p className="text-xs font-semibold text-gray-700 uppercase mt-0.5">
                        Skipped
                      </p>
                    </div>
                  </div>

                  {importResult.errors
                    .length >
                    0 && (
                    <div className="space-y-2 mt-4">
                      <p className="text-xs font-bold text-red-600 uppercase tracking-wide">
                        Import Warnings / Errors:
                      </p>

                      <div className="max-h-40 overflow-y-auto border border-red-100 rounded-xl bg-red-50/30 p-3 space-y-1.5 text-xs text-red-700 font-mono">
                        {importResult.errors.map(
                          (
                            err,
                            idx
                          ) => (
                            <div
                              key={
                                idx
                              }
                              className="flex items-start gap-1"
                            >
                              <span>
                                •
                              </span>

                              <span>
                                {err}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================================================== */}
          {/* REAL-TIME TAB */}
          {/* ================================================== */}

          {activeTab ===
            'realtime' && (
            <div className="space-y-6">
              {/* STATUS CARDS */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-md p-6 border-none flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                        Sync Status
                      </span>

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          syncEnabledSetting
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 animate-pulse'
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}
                      >
                        {syncEnabledSetting
                          ? '● Active'
                          : 'Offline'}
                      </span>
                    </div>

                    <h4 className="text-3xl font-black text-gray-900">
                      {syncEnabledSetting
                        ? 'Enabled'
                        : 'Disabled'}
                    </h4>

                    <p className="text-gray-500 text-xs mt-2">
                      When enabled, submissions from lead popups, contact forms, and checkouts sync instantly.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6 border-none flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                        Inquiries Sheet
                      </span>

                      <span className="bg-gray-50 text-gray-600 border border-gray-100 px-2 py-0.5 rounded text-xs font-mono">
                        {
                          inquirySheetNameSetting
                        }
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <h4 className="text-3xl font-black text-gray-900">
                        {
                          syncedInquiriesCount
                        }
                      </h4>

                      <span className="text-xs font-semibold text-emerald-600 uppercase">
                        Synced
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                        {
                          pendingInquiriesCount
                        }{' '}
                        pending
                      </span>

                      <span className="text-gray-400 text-[11px]">
                        in queue
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6 border-none flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                        Orders Sheet
                      </span>

                      <span className="bg-gray-50 text-gray-600 border border-gray-100 px-2 py-0.5 rounded text-xs font-mono">
                        {
                          orderSheetNameSetting
                        }
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <h4 className="text-3xl font-black text-gray-900">
                        {
                          syncedOrdersCount
                        }
                      </h4>

                      <span className="text-xs font-semibold text-emerald-600 uppercase">
                        Synced
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                        {
                          pendingOrdersCount
                        }{' '}
                        pending
                      </span>

                      <span className="text-gray-400 text-[11px]">
                        in queue
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION TOOLBAR */}

              <div className="bg-white rounded-2xl shadow-md p-6 border-none flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Synchronize Pending Records
                  </h3>

                  <p className="text-gray-500 text-xs mt-1">
                    If some submissions failed to sync due to network drops or credentials issue, retry sending them with one click.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={
                      fetchSettingsAndStats
                    }
                    disabled={
                      loadingStats
                    }
                    className="p-2.5 text-gray-500 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                    title="Refresh stats"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${
                        loadingStats
                          ? 'animate-spin'
                          : ''
                      }`}
                    />
                  </button>

                  <button
                    onClick={
                      handleSyncPending
                    }
                    disabled={
                      syncingAll ||
                      (pendingInquiriesCount ===
                        0 &&
                        pendingOrdersCount ===
                          0)
                    }
                    className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2.5 px-6 rounded-xl transition-all inline-flex items-center gap-2 text-sm disabled:opacity-40 shadow-sm"
                  >
                    {syncingAll ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Synchronizing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Sync All Pending (
                        {pendingInquiriesCount +
                          pendingOrdersCount}
                        )
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* SYNC RESULT */}

              {syncResult && (
                <div className="bg-white rounded-2xl shadow-md p-6 border-none space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Last Synchronization Results
                  </h4>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                      <p className="text-xl font-bold text-emerald-800">
                        {
                          syncResult.successCount
                        }
                      </p>

                      <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                        Synced Successfully
                      </p>
                    </div>

                    <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                      <p className="text-xl font-bold text-rose-800">
                        {
                          syncResult.failCount
                        }
                      </p>

                      <p className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">
                        Failed / Skipped
                      </p>
                    </div>
                  </div>

                  {syncResult.errors
                    .length >
                    0 && (
                    <div className="space-y-1.5 pt-2">
                      <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wide">
                        Sync Failures Log:
                      </p>

                      <div className="max-h-32 overflow-y-auto bg-rose-50/20 border border-rose-100 p-3 rounded-xl font-mono text-[11px] text-rose-700 space-y-1">
                        {syncResult.errors.map(
                          (
                            e,
                            idx
                          ) => (
                            <div
                              key={
                                idx
                              }
                            >
                              • {e}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CONFIGURATION */}

              <div className="bg-white rounded-2xl shadow-md p-6 border-none space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Integration Configuration
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Set up direct OAuth Sheet sync or the highly-resilient Google Apps Script Web App sync.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Google Spreadsheet ID
                      </label>

                      <input
                        type="text"
                        value={
                          spreadsheetIdSetting
                        }
                        onChange={(e) =>
                          setSpreadsheetIdSetting(
                            e.target
                              .value
                          )
                        }
                        placeholder="e.g. 1a2b3c4d5e6f7g8h9i0j..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green text-sm text-gray-900 bg-white"
                      />

                      <p className="text-gray-400 text-[10px] mt-1 leading-normal">
                        Provide the unique identifier from your spreadsheet URL. Direct OAuth appending will write to this Spreadsheet.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Google Apps Script Web App URL
                      </label>

                      <input
                        type="text"
                        value={
                          appScriptUrlSetting
                        }
                        onChange={(e) =>
                          setAppScriptUrlSetting(
                            e.target
                              .value
                          )
                        }
                        placeholder="https://script.google.com/macros/s/.../exec"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green text-sm text-gray-900 bg-white"
                      />

                      <p className="text-gray-400 text-[10px] mt-1 leading-normal">
                        Recommended. Setting this URL activates resilient server-to-server synchronization that runs 24/7 even without active admin login sessions.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 py-1">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={
                            syncEnabledSetting
                          }
                          onChange={(e) =>
                            setSyncEnabledSetting(
                              e.target
                                .checked
                            )
                          }
                          className="rounded text-brand-green focus:ring-brand-green h-4 w-4 mr-2"
                        />

                        <span className="text-sm font-bold text-gray-700">
                          Enable real-time synchronization
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Inquiry Sheet Tab Name
                      </label>

                      <input
                        type="text"
                        value={
                          inquirySheetNameSetting
                        }
                        onChange={(e) =>
                          setInquirySheetNameSetting(
                            e.target
                              .value
                          )
                        }
                        placeholder="Inquiries"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green text-sm text-gray-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Orders Sheet Tab Name
                      </label>

                      <input
                        type="text"
                        value={
                          orderSheetNameSetting
                        }
                        onChange={(e) =>
                          setOrderSheetNameSetting(
                            e.target
                              .value
                          )
                        }
                        placeholder="Orders"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green text-sm text-gray-900 bg-white"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={
                          handleSaveSettings
                        }
                        disabled={
                          savingSettings
                        }
                        className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 shadow-sm"
                      >
                        {savingSettings ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving Configuration...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Save Configuration
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* APPS SCRIPT GUIDE */}

                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100/60 text-gray-700">
                    <h4 className="text-sm font-bold text-amber-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      Resilient Google Apps Script Guide
                    </h4>

                    <p className="text-xs text-amber-700 mt-1">
                      Setting up a Google Apps Script Web App ensures entries are written to your spreadsheet reliably 24/7 from the cloud, bypassing OAuth access tokens' 1-hour expiration limits.
                    </p>

                    <div className="mt-4 space-y-3 text-xs leading-relaxed text-gray-600">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-white border border-amber-200 rounded-full flex items-center justify-center text-[10px] font-black text-amber-800 flex-shrink-0 mt-0.5">
                          1
                        </span>

                        <span>
                          Open your target Google Sheet, click on{' '}
                          <b>Extensions</b> &gt;{' '}
                          <b>Apps Script</b>.
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-white border border-amber-200 rounded-full flex items-center justify-center text-[10px] font-black text-amber-800 flex-shrink-0 mt-0.5">
                          2
                        </span>

                        <span>
                          Delete existing template code and paste the macro script below.
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-white border border-amber-200 rounded-full flex items-center justify-center text-[10px] font-black text-amber-800 flex-shrink-0 mt-0.5">
                          3
                        </span>

                        <span>
                          Click <b>Deploy</b> (top-right) &gt;{' '}
                          <b>New Deployment</b>. Set type as{' '}
                          <b>Web App</b>.
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-white border border-amber-200 rounded-full flex items-center justify-center text-[10px] font-black text-amber-800 flex-shrink-0 mt-0.5">
                          4
                        </span>

                        <span>
                          Under "Execute as", choose{' '}
                          <b>Me (your email)</b>. Under "Who has access", choose{' '}
                          <b>Anyone</b>.
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-white border border-amber-200 rounded-full flex items-center justify-center text-[10px] font-black text-amber-800 flex-shrink-0 mt-0.5">
                          5
                        </span>

                        <span>
                          Authorize permissions, copy the generated Web App URL, and paste it into the field above!
                        </span>
                      </div>
                    </div>

                    {/* SCRIPT */}

                    <div className="mt-5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                          Deployment Script:
                        </span>

                        <button
                          onClick={() => {
                            const script = `function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var spreadsheetId = data.spreadsheetId;
    var sheetName = data.sheetName || "Sheet1";
    var row = data.row;
    var headers = data.headers;
    
    var ss = spreadsheetId
      ? SpreadsheetApp.openById(spreadsheetId)
      : SpreadsheetApp.getActiveSpreadsheet();

    var sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    if (
      sheet.getLastRow() === 0 &&
      headers &&
      headers.length > 0
    ) {
      sheet.appendRow(headers);
    }
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(
        JSON.stringify({ success: true })
      )
      .setMimeType(
        ContentService.MimeType.JSON
      );
  } catch (err) {
    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: false,
          error: err.toString()
        })
      )
      .setMimeType(
        ContentService.MimeType.JSON
      );
  }
}`;

                            navigator.clipboard.writeText(
                              script
                            );

                            setAlert({
                              text: 'Apps Script copied to clipboard!',
                              type: 'success',
                            });
                          }}
                          className="bg-white hover:bg-amber-100 text-amber-800 border border-amber-200 rounded px-2 py-0.5 text-[10px] font-bold transition-all inline-flex items-center gap-1"
                        >
                          Copy Script Code
                        </button>
                      </div>

                      <pre className="p-3 bg-white border border-amber-100 rounded-xl text-[11px] text-gray-700 font-mono overflow-x-auto max-h-48 leading-relaxed">
{`function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var spreadsheetId = data.spreadsheetId;
    var sheetName = data.sheetName || "Sheet1";
    var row = data.row;
    var headers = data.headers;
    
    var ss = spreadsheetId
      ? SpreadsheetApp.openById(spreadsheetId)
      : SpreadsheetApp.getActiveSpreadsheet();

    var sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    if (
      sheet.getLastRow() === 0 &&
      headers &&
      headers.length > 0
    ) {
      sheet.appendRow(headers);
    }
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(
        JSON.stringify({ success: true })
      )
      .setMimeType(
        ContentService.MimeType.JSON
      );
  } catch (err) {
    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: false,
          error: err.toString()
        })
      )
      .setMimeType(
        ContentService.MimeType.JSON
      );
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}