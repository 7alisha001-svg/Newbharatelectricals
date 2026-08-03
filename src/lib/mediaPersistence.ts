import { WebsiteMedia } from '../types/media';

export function ensureMediaSaveSuccess(
  error: unknown,
  data: WebsiteMedia | null | undefined
): WebsiteMedia {
  if (error) {
    const message = error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'Unknown database error';

    throw new Error(`Failed to save media record: ${message}`);
  }

  if (!data) {
    throw new Error('Failed to save media record: no database record returned.');
  }

  return data;
}
