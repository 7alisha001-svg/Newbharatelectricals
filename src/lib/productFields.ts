type SpecEntry = { label: string; value: string };

function cleanStrings(values: unknown[]): string[] {
  return values
    .map((v) => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v).trim()))
    .filter((v) => v.length > 0);
}

function tryParseJson(raw: string): unknown {
  const first = raw[0];
  if (first !== '[' && first !== '{' && first !== '"') return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

/**
 * products.features / products.tags / products.gallery_images are JSON arrays.
 * The `features` column was created as a text column, so the API can hand it
 * back as a JSON encoded string instead of an array. Always funnel reads
 * through here so the app sees one consistent shape.
 */
export function normalizeStringList(value: unknown): string[] {
  if (value == null) return [];

  if (Array.isArray(value)) return cleanStrings(value);

  if (typeof value === 'string') {
    const raw = value.trim();
    if (!raw) return [];

    const parsed = tryParseJson(raw);
    if (parsed !== undefined) {
      if (Array.isArray(parsed)) return cleanStrings(parsed);
      if (typeof parsed === 'string') return cleanStrings([parsed]);
      if (parsed && typeof parsed === 'object') return cleanStrings(Object.values(parsed));
      return [];
    }

    return cleanStrings(raw.split(/\r?\n/));
  }

  if (typeof value === 'object') return cleanStrings(Object.values(value as Record<string, unknown>));

  return cleanStrings([value]);
}

/** Key Features list for a product, read from `products.features`. */
export function normalizeFeatures(value: unknown): string[] {
  return normalizeStringList(value);
}

/** Specification rows for a product, read from `products.specs`. */
export function normalizeSpecs(value: unknown): SpecEntry[] {
  const rows = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? (() => {
          const parsed = tryParseJson(value.trim());
          return Array.isArray(parsed) ? parsed : [];
        })()
      : [];

  return rows
    .filter((row): row is Record<string, unknown> => !!row && typeof row === 'object' && !Array.isArray(row))
    .map((row) => ({
      label: typeof row.label === 'string' ? row.label.trim() : String(row.label ?? '').trim(),
      value: typeof row.value === 'string' ? row.value.trim() : String(row.value ?? '').trim()
    }))
    .filter((row) => row.label.length > 0 || row.value.length > 0);
}

/** True when both lists hold the same entries in the same order. */
export function sameStringList(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}