import { describe, it, expect } from 'vitest';
import { parseCitationStart } from '../src/dom';

describe('parseCitationStart', () => {
  it('parses standard reporter cite', () => {
    expect(parseCitationStart('572 F.3d 868')).toBe(868);
  });

  it('parses state reporter with series', () => {
    expect(parseCitationStart('190 Wash. 2d 249')).toBe(249);
  });

  it('parses state reporter with series and page > 500', () => {
    expect(parseCitationStart('413 P.3d 549')).toBe(549);
  });

  it('returns null for WL cite', () => {
    expect(parseCitationStart('2009 WL 1677233')).toBeNull();
  });

  it('returns null for LEXIS cite', () => {
    expect(parseCitationStart('2009 U.S. App. LEXIS 13207')).toBeNull();
  });

  it('parses Supreme Court cite', () => {
    expect(parseCitationStart('347 U.S. 483')).toBe(483);
  });

  it('parses L.Ed. cite', () => {
    expect(parseCitationStart('157 L. Ed. 2d 1122')).toBe(1122);
  });
});
