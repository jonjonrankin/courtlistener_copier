/**
 * Content script entry point for the CourtListener Copy Citation extension.
 *
 * Listens for text selections inside opinion content, computes the citation
 * with pincite, and shows a centered popup with two copy options.
 */

import { buildCitation } from './citation';
import { findPageBoundaries, scrapeOpinionData } from './dom';
import { showPopup, hidePopup, flashMessage } from './ui';

const OPINION_SELECTOR = '.subopinion-content, .serif-text.harvard, #opinion';

let opinionData = scrapeOpinionData();

/**
 * Clean up whitespace in text copied from HTML selections:
 * strip newlines, tabs, leading/trailing spaces, and collapse
 * multiple spaces between words to a single space.
 */
export function cleanSelectedText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check whether a selection range is inside the opinion content area.
 */
function isInsideOpinion(range: Range): boolean {
  const container = range.commonAncestorContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    return (
      container.parentElement?.closest(OPINION_SELECTOR) !== null
    );
  }
  return (container as Element).closest(OPINION_SELECTOR) !== null;
}

/**
 * Handle a text selection: scrape data, build citation, show popup.
 */
function handleSelection(): void {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    hidePopup();
    return;
  }

  const range = selection.getRangeAt(0);
  if (!isInsideOpinion(range)) {
    hidePopup();
    return;
  }

  const selectedText = cleanSelectedText(selection.toString());
  if (!selectedText) {
    hidePopup();
    return;
  }

  // Refresh opinion data in case the page changed (e.g. SPA navigation).
  opinionData = scrapeOpinionData();

  const boundaries = findPageBoundaries(range, opinionData.citationStarts);
  const hasPincite =
    boundaries.startPage !== undefined && boundaries.endPage !== undefined;

  const rect = range.getBoundingClientRect();
  // Adjust rect to page coordinates (not viewport).
  const pageRect = new DOMRect(
    rect.left + window.scrollX,
    rect.top + window.scrollY,
    rect.width,
    rect.height
  );

  showPopup(
    pageRect,
    hasPincite,
    opinionData.citations,
    boundaries.reporterIndex,
    (reporterIdx) => {
      // Copy Pincite
      const citeBoundaries = { ...boundaries, reporterIndex: reporterIdx };
      const citation = buildCitation(opinionData, citeBoundaries);
      navigator.clipboard
        .writeText(citation)
        .then(() => {
          hidePopup();
          flashMessage(`Copied to clipboard: ${citation}`);
        })
        .catch((err) => {
          console.error('CourtListener Copy Citation: clipboard write failed', err);
        });
    },
    (reporterIdx) => {
      // Copy Text with Pincite
      const citeBoundaries = { ...boundaries, reporterIndex: reporterIdx };
      const citation = buildCitation(opinionData, citeBoundaries);
      const fullText = `"${selectedText}" ${citation}`;
      navigator.clipboard
        .writeText(fullText)
        .then(() => {
          hidePopup();
          flashMessage(`Copied to clipboard: ${fullText.slice(0, 750)}${fullText.length > 750 ? '...' : ''}`);
        })
        .catch((err) => {
          console.error('CourtListener Copy Citation: clipboard write failed', err);
        });
    }
  );
}

// Show popup on mouseup after a selection is made.
document.addEventListener('mouseup', (event) => {
  const target = event.target as HTMLElement | null;
  // Ignore interactions inside popup so dropdown/button clicks do not reset state.
  if (target?.closest('.cl-cite-popup')) return;

  // Small delay so the selection is finalized before we read it.
  setTimeout(() => {
    handleSelection();
  }, 10);
});

// Hide popup when the user clicks elsewhere or interacts with the page.
document.addEventListener('mousedown', (event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.cl-cite-popup')) {
    hidePopup();
  }
});

// Keep popup visible while scrolling; hide on viewport size changes.
window.addEventListener('resize', hidePopup);
