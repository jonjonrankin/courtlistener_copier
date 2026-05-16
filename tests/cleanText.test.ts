import { describe, it, expect } from 'vitest';

describe('cleanSelectedText', () => {
  // We will import this after creating it
  it('strips newlines and collapses whitespace', async () => {
    const { cleanSelectedText } = await import('../src/content');
    expect(cleanSelectedText('  hello   world  \n  foo\tbar  ')).toBe('hello world foo bar');
  });

  it('handles already-clean text', async () => {
    const { cleanSelectedText } = await import('../src/content');
    expect(cleanSelectedText('hello world')).toBe('hello world');
  });

  it('handles empty string', async () => {
    const { cleanSelectedText } = await import('../src/content');
    expect(cleanSelectedText('')).toBe('');
  });
});
