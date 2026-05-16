import { describe, it, expect } from 'vitest';
import { formatPageRange } from '../src/citation';

describe('formatPageRange', () => {
  it('returns single page when start and end are the same', () => {
    expect(formatPageRange(871, 871)).toBe('871');
  });

  it('does not elide two-digit numbers', () => {
    expect(formatPageRange(10, 15)).toBe('10-15');
    expect(formatPageRange(10, 25)).toBe('10-25');
  });

  it('elides same-hundred three-digit ranges', () => {
    expect(formatPageRange(100, 125)).toBe('100-25');
    expect(formatPageRange(871, 875)).toBe('871-75');
    expect(formatPageRange(871, 880)).toBe('871-80');
  });

  it('does not elide when crossing a hundreds boundary (3-digit)', () => {
    expect(formatPageRange(199, 205)).toBe('199-205');
    expect(formatPageRange(899, 903)).toBe('899-903');
  });

  it('elides same-hundred four-digit ranges', () => {
    expect(formatPageRange(1170, 1175)).toBe('1170-75');
    expect(formatPageRange(1170, 1180)).toBe('1170-80');
  });

  it('does not elide when crossing a hundreds boundary (4-digit)', () => {
    expect(formatPageRange(1199, 1201)).toBe('1199-1201');
  });
});
