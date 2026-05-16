import { describe, it, expect } from 'vitest';
import { findReporterForPage } from '../src/dom';

describe('findReporterForPage', () => {
  const starts = [249, 549]; // 190 Wash. 2d 249, 413 P.3d 549

  it('maps page near first citation start to reporter 0', () => {
    expect(findReporterForPage(254, starts)).toBe(0);
    expect(findReporterForPage(260, starts)).toBe(0);
    expect(findReporterForPage(249, starts)).toBe(0);
  });

  it('maps page near second citation start to reporter 1', () => {
    expect(findReporterForPage(552, starts)).toBe(1);
    expect(findReporterForPage(556, starts)).toBe(1);
    expect(findReporterForPage(549, starts)).toBe(1);
  });

  it('handles page exactly in the middle', () => {
    // Midpoint between 249 and 549 is 399
    expect(findReporterForPage(399, starts)).toBe(0); // closer to 249
    expect(findReporterForPage(400, starts)).toBe(1); // closer to 549
  });

  it('returns 0 when only one citation start exists', () => {
    expect(findReporterForPage(100, [868])).toBe(0);
  });

  it('returns 0 when no citation starts exist', () => {
    expect(findReporterForPage(100, [])).toBe(0);
  });
});
