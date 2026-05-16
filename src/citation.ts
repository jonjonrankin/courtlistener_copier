/**
 * Citation assembly and page-range formatting.
 */

import { abbreviateCaseName, abbreviateCourt } from './abbreviate';
import type { OpinionData, PageBoundaries } from './types';

/**
 * Build a full citation string from scraped opinion data and page boundaries.
 */
export function buildCitation(
  data: OpinionData,
  boundaries: PageBoundaries
): string {
  const caseName = abbreviateCaseName(data.caseName);
  const cite = data.citations[boundaries.reporterIndex] ?? data.citations[0] ?? '';
  const court = abbreviateCourt(data.court);

  let pincite = '';
  if (boundaries.startPage !== undefined && boundaries.endPage !== undefined) {
    pincite = `, ${formatPageRange(boundaries.startPage, boundaries.endPage)}`;
  }

  // SCOTUS: omit court from parenthetical — just year.
  const parenthetical = court === 'U.S.' ? `(${data.year})` : `(${court} ${data.year})`;

  return `${caseName}, ${cite}${pincite} ${parenthetical}.`;
}


/**
 * Format a page range according to the user's elision rule:
 * - Same page → just the number.
 * - Numbers with 3+ digits in the same hundred → drop all but last two digits of second number.
 * - Numbers crossing a hundreds boundary → repeat all digits.
 * - Numbers under 100 → no elision.
 */
export function formatPageRange(start: number, end: number): string {
  if (start === end) {
    return String(start);
  }

  // For numbers under 100, no elision.
  if (start < 100 && end < 100) {
    return `${start}-${end}`;
  }

  const startHundreds = Math.floor(start / 100);
  const endHundreds = Math.floor(end / 100);

  if (startHundreds !== endHundreds) {
    return `${start}-${end}`;
  }

  // Same hundreds: elide to last two digits of the end page.
  const endStr = String(end);
  const elided = endStr.slice(-2);
  return `${start}-${elided}`;
}
