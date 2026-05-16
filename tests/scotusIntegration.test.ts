import { describe, it, expect, beforeEach } from 'vitest';
import { findPageBoundaries, scrapeOpinionData } from '../src/dom';
import { buildCitation } from '../src/citation';
import * as fs from 'fs';
import * as path from 'path';

const scotusHtml = fs.readFileSync(
  path.resolve(__dirname, 'fixtures/scotus-doe-v-chao.html'),
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

describe('Integration test against SCOTUS fixture', () => {
  beforeEach(() => {
    document.open();
    document.write(scotusHtml);
    document.close();
  });

  it('scrapes SCOTUS court name correctly', () => {
    const data = scrapeOpinionData();
    expect(data.caseName).toBe('Doe v. Chao');
    expect(data.court).toBe('Supreme Court of the United States');
    expect(data.year).toBe('2004');
  });

  it('builds a SCOTUS citation without court in parenthetical', () => {
    const data = scrapeOpinionData();
    const a616 = document.querySelector('a.page-label[data-label="616"]')!;
    const p616 = a616.parentNode as HTMLElement;
    // Find the text node after the page label anchor
    const textNode = Array.from(p616.childNodes).find(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim().length > 0
    ) as Text;
    const range = createRange(textNode, 5, textNode, 30);

    const boundaries = findPageBoundaries(range, data.citationStarts);
    expect(boundaries.startPage).toBe(616);

    const citation = buildCitation(data, boundaries);
    // Must NOT contain "U.S." inside the parenthetical — just year
    expect(citation).toMatch(/\(2004\)\.$/);
    expect(citation).not.toMatch(/\(U\.S\. 2004\)/);
  });
});
