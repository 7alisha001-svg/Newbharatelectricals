/**
 * Google Sheets and Drive API integration services
 */

// Interface for spreadsheet metadata
export interface GoogleSpreadsheet {
  id: string;
  name: string;
  modifiedTime?: string;
}

// Interface for product row model
export interface SheetProductRow {
  sku: string;
  name: string;
  brand: string;
  category: string;
  regular_price: string | number;
  sale_price: string | number;
  stock_quantity: string | number;
  status: string;
  image_url: string;
  description: string;
  short_description: string;
}

/**
 * Fetch existing spreadsheets from the user's Google Drive
 */
export async function listUserSpreadsheets(accessToken: string): Promise<GoogleSpreadsheet[]> {
  try {
    const response = await fetch(
      'https://www.googleapis.com/drive/v3/files?q=mimeType%3D%27application/vnd.google-apps.spreadsheet%27+and+trashed%3Dfalse&orderBy=modifiedTime+desc&pageSize=25&fields=files(id,name,modifiedTime)',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Drive API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error listing spreadsheets:', error);
    throw error;
  }
}

/**
 * Create a new Google Spreadsheet
 */
export async function createSpreadsheet(
  accessToken: string,
  title: string
): Promise<GoogleSpreadsheet> {
  try {
    const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sheets API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return {
      id: data.spreadsheetId,
      name: data.properties.title,
    };
  } catch (error) {
    console.error('Error creating spreadsheet:', error);
    throw error;
  }
}

/**
 * Read spreadsheet data from a specific range
 */
export async function readSpreadsheetValues(
  accessToken: string,
  spreadsheetId: string,
  range: string = 'Sheet1!A1:Z1000'
): Promise<string[][]> {
  try {
    const encodedRange = encodeURIComponent(range);
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sheets Read error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('Error reading spreadsheet:', error);
    throw error;
  }
}

/**
 * Update spreadsheet values (overwrites completely)
 */
export async function updateSpreadsheetValues(
  accessToken: string,
  spreadsheetId: string,
  range: string,
  values: any[][]
): Promise<any> {
  try {
    const encodedRange = encodeURIComponent(range);
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sheets Update error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating spreadsheet:', error);
    throw error;
  }
}

/**
 * Append spreadsheet values
 */
export async function appendSpreadsheetValues(
  accessToken: string,
  spreadsheetId: string,
  range: string,
  values: any[][]
): Promise<any> {
  try {
    const encodedRange = encodeURIComponent(range);
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sheets Append error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error appending spreadsheet:', error);
    throw error;
  }
}

/**
 * Helper to get sheet names / tabs from a spreadsheet
 */
export async function getSpreadsheetSheets(
  accessToken: string,
  spreadsheetId: string
): Promise<string[]> {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sheets Fetch Metatada error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return (data.sheets || []).map((s: any) => s.properties.title);
  } catch (error) {
    console.error('Error fetching sheets metadata:', error);
    throw error;
  }
}
