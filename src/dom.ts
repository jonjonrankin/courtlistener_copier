/**
 * DOM scraping and page-label traversal.
 */

import type { PageBoundaries, PageLabel } from './types';

/**
 * Extract the starting page number from a citation string.
 * Returns null for non-page-based citations (WL, LEXIS, etc.).
 */
export function parseCitationStart(citation: string): number | null {
  const match = citation.match(/(\d+)(?:\s*\$|,?\s*\d+\s*\$)?$/);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  // Heuristic: page numbers are typically under 9999; WL/LEXIS IDs are larger
  if (num > 9999) return null;
  return num;
}

/**
 * Given a page label number and an array of citation starting pages,
 * return the index of the nearest citation start (i.e., which reporter
 * cluster this page label belongs to).
 */
export function findReporterForPage(
  page: number,
  citationStarts: number[]
): number {
  if (citationStarts.length === 0) return 0;
  if (citationStarts.length === 1) return 0;

  let bestIndex = 0;
  let bestDiff = Math.abs(page - citationStarts[0]);

  for (let i = 1; i < citationStarts.length; i++) {
    const diff = Math.abs(page - citationStarts[i]);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = i;
    }
  }

  return bestIndex;
}

/**
 * Determine the DOM node that best represents the position just before
 * a Range boundary point, so that a backward walk finds the nearest
 * preceding .page-label.
 */
function nodeBeforePoint(container: Node, offset: number): Node {
  if (container.nodeType === Node.TEXT_NODE) {
    return container;
  }
  // Element container — offset is a child index.
  if (offset > 0 && container.childNodes[offset - 1]) {
    return container.childNodes[offset - 1];
  }
  return container;
}

/**
 * Walk backward from a node until we find a .page-label element.
 */
function findPrecedingPageLabel(startNode: Node): PageLabel | null {
  let current: Node | null = startNode;

  while (current) {
    if (current instanceof Element && current.classList.contains('page-label')) {
      const page = current.getAttribute('data-label');
      const citationIndex = current.getAttribute('data-citation-index');
      if (page && citationIndex) {
        return {
          page: parseInt(page, 10),
          citationIndex: parseInt(citationIndex, 10) - 1, // HTML uses 1-based
        };
      }
    }

    if (current.previousSibling) {
      current = current.previousSibling;
      // Dive to the deepest last descendant of the previous sibling
      while (current.lastChild) {
        current = current.lastChild;
      }
      continue;
    }

    current = current.parentNode;
  }

  return null;
}

/**
 * Find the nearest preceding .page-label for the start and end of a Range.
 * When citationStarts are provided, cluster page labels to the nearest
 * citation start rather than trusting data-citation-index (which CourtListener
 * often sets to 1 for all labels in multi-reporter opinions).
 */
export function findPageBoundaries(
  range: Range,
  citationStarts?: (number | null)[]
): PageBoundaries {
  const startNode = nodeBeforePoint(range.startContainer, range.startOffset);
  const endNode = nodeBeforePoint(range.endContainer, range.endOffset);

  const startLabel = findPrecedingPageLabel(startNode);
  const endLabel = findPrecedingPageLabel(endNode);

  const validStarts = (citationStarts ?? []).filter((s): s is number => s !== null);

  const reporterIndex =
    (startLabel && validStarts.length > 0
      ? findReporterForPage(startLabel.page, validStarts)
      : startLabel?.citationIndex) ??
    (endLabel && validStarts.length > 0
      ? findReporterForPage(endLabel.page, validStarts)
      : endLabel?.citationIndex) ??
    0;

  return {
    startPage: startLabel?.page,
    endPage: endLabel?.page,
    reporterIndex,
  };
}

/**
 * Scrape opinion metadata from the current CourtListener page.
 */
export function scrapeOpinionData() {
  const caseName = document.querySelector('#caption')?.textContent?.trim() ?? '';

  const citationSpans = document.querySelectorAll('.case-details .select-all');
  const citations = Array.from(citationSpans).map((el) => el.textContent?.trim() ?? '');
  const citationStarts = citations.map(parseCitationStart);

  const court = document.querySelector('.case-court')?.textContent?.trim() ?? '';

  // Extract year from decision date or case details
  let year = '';
  const decisionDate = document.querySelector('decisiondate');
  if (decisionDate?.textContent) {
    const match = decisionDate.textContent.match(/(\d{4})/);
    if (match) year = match[1];
  }
  if (!year) {
    const caseDate = document.querySelector('.case-date-new, .case-date');
    if (caseDate?.textContent) {
      const match = caseDate.textContent.match(/(\d{4})/);
      if (match) year = match[1];
    }
  }
  if (!year) {
    const caseDetails = document.querySelector('.case-details');
    if (caseDetails?.textContent) {
      const match = caseDetails.textContent.match(/(\d{4})/);
      if (match) year = match[1];
    }
  }

  return { caseName, citations, citationStarts, court, year };
}
