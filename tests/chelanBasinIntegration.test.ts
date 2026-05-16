import { describe, it, expect, beforeEach } from 'vitest';
import { findPageBoundaries, scrapeOpinionData } from '../src/dom';
import { buildCitation } from '../src/citation';
import * as fs from 'fs';
import * as path from 'path';

const chelanHtml = fs.readFileSync(
  path.resolve(__dirname, 'fixtures/chelan-basin.html'),
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

describe('Integration test against chelan basin sample', () => {
  beforeEach(() => {
    document.open();
    document.write(chelanHtml);
    document.close();
  });

  it('scrapes multiple citations with distinct starting pages', () => {
    const data = scrapeOpinionData();
    expect(data.caseName).toBe('Chelan Basin Conservancy v. GBI Holding Co.');
    expect(data.citations).toContain('413 P.3d 549');
    expect(data.citations).toContain('190 Wash. 2d 249');
    expect(data.citationStarts).toEqual([549, 249]);
  });

  it('clusters page 261 to Wash.2d reporter (start 249)', () => {
    const data = scrapeOpinionData();
    const a261 = document.querySelector('a.page-label[data-label="261"]')!;
    const p261 = a261.parentNode as HTMLElement;
    // Select text AFTER the *261 anchor (child node 2)
    const textNode = p261.childNodes[2] as Text;
    const range = createRange(textNode, 5, textNode, 20);

    const boundaries = findPageBoundaries(range, data.citationStarts);
    expect(boundaries.startPage).toBe(261);
    // 261 is closer to 249 than 549, so reporter 1 (190 Wash. 2d 249)
    expect(boundaries.reporterIndex).toBe(1);

    const citation = buildCitation(data, boundaries);
    expect(citation).toContain('190 Wash. 2d 249');
    expect(citation).toContain('261');
  });

  it('clusters page 556 to P.3d reporter (start 549)', () => {
    const data = scrapeOpinionData();
    const a556 = document.querySelector('a.page-label[data-label="556"]')!;
    const p556 = a556.parentNode as HTMLElement;
    // Find the text node after the *556 anchor
    const idx556 = Array.from(p556.childNodes).indexOf(a556);
    const textNode = Array.from(p556.childNodes)
      .slice(idx556 + 1)
      .find((n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim().length > 0) as Text;
    const range = createRange(textNode, 5, textNode, 20);

    const boundaries = findPageBoundaries(range, data.citationStarts);
    expect(boundaries.startPage).toBe(556);
    // 556 is closer to 549 than 249, so reporter 0 (413 P.3d 549)
    expect(boundaries.reporterIndex).toBe(0);

    const citation = buildCitation(data, boundaries);
    expect(citation).toContain('413 P.3d 549');
    expect(citation).toContain('556');
  });
});
