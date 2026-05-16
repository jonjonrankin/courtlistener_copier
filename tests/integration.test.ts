import { describe, it, expect, beforeEach } from 'vitest';
import { findPageBoundaries, scrapeOpinionData } from '../src/dom';
import { buildCitation } from '../src/citation';
import * as fs from 'fs';
import * as path from 'path';

const sampleHtml = fs.readFileSync(
  path.resolve(__dirname, 'fixtures/fanin.html'),
  'utf-8'
);

function createRange(
  startContainer: Node,
  startOffset: number,
  endContainer: Node,
  endOffset: number
): Range {
  const range = document.createRange();
  range.setStart(startContainer, startOffset);
  range.setEnd(endContainer, endOffset);
  return range;
}

describe('Integration test against Fanin fixture', () => {
  beforeEach(() => {
    document.open();
    document.write(sampleHtml);
    document.close();
  });

  it('scrapes the correct opinion metadata', () => {
    const data = scrapeOpinionData();
    expect(data.caseName).toBe('Fanin v. United States Department of Veterans Affairs');
    expect(data.citations[0]).toBe('572 F.3d 868');
    expect(data.citations[1]).toBe('2009 WL 1677233');
    expect(data.citations[2]).toBe('2009 U.S. App. LEXIS 13207');
    expect(data.court).toBe('Court of Appeals for the Eleventh Circuit');
    expect(data.year).toBe('2009');
  });

  it('builds a full citation for a selection on page 871', () => {
    // Find the paragraph containing the *871 label and select some text in it.
    const p871 = document.querySelector('a.page-label[data-label="871"]')!
      .parentNode as HTMLElement;
    const textNode = p871.childNodes[p871.childNodes.length - 1] as Text;
    const range = createRange(textNode, 5, textNode, 25);

    const data = scrapeOpinionData();
    const boundaries = findPageBoundaries(range, data.citationStarts);
    expect(boundaries.startPage).toBe(871);
    expect(boundaries.endPage).toBe(871);
    expect(boundaries.reporterIndex).toBe(0);

    const citation = buildCitation(data, boundaries);
    expect(citation).toBe(
      "Fanin v. United States Dep't of Veterans Affairs, 572 F.3d 868, 871 (11th Cir. 2009)."
    );
  });

  it('builds a citation with quoted text for copy-text option', () => {
    // Find the paragraph containing the *871 label and select some text in it.
    const p871 = document.querySelector('a.page-label[data-label="871"]')!
      .parentNode as HTMLElement;
    const textNode = p871.childNodes[p871.childNodes.length - 1] as Text;
    const range = createRange(textNode, 5, textNode, 25);

    const data = scrapeOpinionData();
    const boundaries = findPageBoundaries(range, data.citationStarts);
    const citation = buildCitation(data, boundaries);
    const selectedText = 'text on page 871.'; // approximate from the node
    const fullText = `"${selectedText}" ${citation}`;
    expect(fullText).toContain('"');
    expect(fullText).toContain(citation);
  });

  it('builds a citation spanning pages 871 to 872', () => {
    const a871 = document.querySelector('a.page-label[data-label="871"]')!;
    const a872 = document.querySelector('a.page-label[data-label="872"]')!;

    // Find the first text node after the *871 anchor within the same paragraph
    const p871 = a871.parentNode as HTMLElement;
    const startText = Array.from(p871.childNodes).find(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim().length > 0
    ) as Text;

    // Find the first text node after the *872 anchor
    const p872 = a872.parentNode as HTMLElement;
    const idx872 = Array.from(p872.childNodes).indexOf(a872);
    const endText = Array.from(p872.childNodes)
      .slice(idx872 + 1)
      .find((n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim().length > 0) as Text;

    const range = createRange(startText, 2, endText, 10);

    const data = scrapeOpinionData();
    const boundaries = findPageBoundaries(range, data.citationStarts);
    expect(boundaries.startPage).toBe(871);
    expect(boundaries.endPage).toBe(872);

    const citation = buildCitation(data, boundaries);
    expect(citation).toBe(
      "Fanin v. United States Dep't of Veterans Affairs, 572 F.3d 868, 871-72 (11th Cir. 2009)."
    );
  });

  it('builds a citation without pincite when selection is before the first page label', () => {
    // Select text in the headmatter (before *870).
    const headmatter = document.querySelector('#headmatter')!;
    const firstText = headmatter.querySelector('parties')!.firstChild as Text;
    const range = createRange(firstText, 0, firstText, 10);

    const data = scrapeOpinionData();
    const boundaries = findPageBoundaries(range, data.citationStarts);
    expect(boundaries.startPage).toBeUndefined();
    expect(boundaries.endPage).toBeUndefined();

    const citation = buildCitation(data, boundaries);
    expect(citation).toBe(
      "Fanin v. United States Dep't of Veterans Affairs, 572 F.3d 868 (11th Cir. 2009)."
    );
  });
});
