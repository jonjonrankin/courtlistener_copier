/**
 * Core type definitions for the CourtListener Copy Citation extension.
 */

/** Scraped metadata from a CourtListener opinion page. */
export interface OpinionData {
  caseName: string;
  citations: string[];
  citationStarts: (number | null)[];
  court: string;
  year: string;
}

/** A page-label anchor found in the opinion text. */
export interface PageLabel {
  page: number;
  citationIndex: number;
}

/** Result of finding page boundaries for a text selection. */
export interface PageBoundaries {
  startPage?: number;
  endPage?: number;
  reporterIndex: number;
}

/** Options controlling citation formatting. */
export interface CitationOptions {
  /** Index into OpinionData.citations to use for the pincite. */
  reporterIndex: number;
}
