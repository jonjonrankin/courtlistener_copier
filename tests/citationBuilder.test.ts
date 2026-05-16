import { describe, it, expect } from 'vitest';
import { buildCitation } from '../src/citation';
import type { OpinionData, PageBoundaries } from '../src/types';

function makeData(overrides: Partial<OpinionData> = {}): OpinionData {
  return {
    caseName: 'Fanin v. United States Department of Veterans Affairs',
    citations: ['572 F.3d 868', '2009 WL 1677233'],
    citationStarts: [868, null],
    court: 'United States Court of Appeals for the Eleventh Circuit',
    year: '2009',
    ...overrides,
  };
}

describe('buildCitation', () => {
  it('builds a full citation with single-page pincite', () => {
    const data = makeData();
    const boundaries: PageBoundaries = {
      startPage: 871,
      endPage: 871,
      reporterIndex: 0,
    };
    expect(buildCitation(data, boundaries)).toBe(
      "Fanin v. United States Dep't of Veterans Affairs, 572 F.3d 868, 871 (11th Cir. 2009)."
    );
  });

  it('builds a full citation with multi-page pincite', () => {
    const data = makeData();
    const boundaries: PageBoundaries = {
      startPage: 871,
      endPage: 875,
      reporterIndex: 0,
    };
    expect(buildCitation(data, boundaries)).toBe(
      "Fanin v. United States Dep't of Veterans Affairs, 572 F.3d 868, 871-75 (11th Cir. 2009)."
    );
  });

  it('omits pincite when no page boundaries are found', () => {
    const data = makeData();
    const boundaries: PageBoundaries = {
      startPage: undefined,
      endPage: undefined,
      reporterIndex: 0,
    };
    expect(buildCitation(data, boundaries)).toBe(
      "Fanin v. United States Dep't of Veterans Affairs, 572 F.3d 868 (11th Cir. 2009)."
    );
  });

  it('uses the reporter at the specified index', () => {
    const data = makeData();
    const boundaries: PageBoundaries = {
      startPage: 871,
      endPage: 871,
      reporterIndex: 1,
    };
    expect(buildCitation(data, boundaries)).toBe(
      "Fanin v. United States Dep't of Veterans Affairs, 2009 WL 1677233, 871 (11th Cir. 2009)."
    );
  });

  it('omits court abbreviation for SCOTUS opinions', () => {
    const data = makeData({
      caseName: 'Brown v. Board of Education',
      citations: ['347 U.S. 483'],
      court: 'Supreme Court of the United States',
      year: '1954',
    });
    const boundaries: PageBoundaries = {
      startPage: 487,
      endPage: 487,
      reporterIndex: 0,
    };
    expect(buildCitation(data, boundaries)).toBe(
      'Brown v. Bd. of Educ., 347 U.S. 483, 487 (1954).'
    );
  });
});
