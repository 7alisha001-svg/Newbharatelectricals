import assert from 'node:assert/strict';
import test from 'node:test';
import { ensureMediaSaveSuccess } from './mediaPersistence';

test('throws when a media save returns an error', () => {
  assert.throws(
    () => ensureMediaSaveSuccess(new Error('db down'), null),
    /Failed to save media record/
  );
});

test('returns saved media when the database returns data', () => {
  const saved = {
    id: 'media-1',
    image_key: 'hero_banner',
    title: 'Hero',
    category: 'General',
    image_url: 'https://example.com/hero.jpg',
    alt_text: 'Hero banner',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  };

  assert.equal(ensureMediaSaveSuccess(null, saved as any), saved);
});
