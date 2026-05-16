import { describe, it, expect, beforeEach } from 'vitest';
import { findPageBoundaries } from '../src/dom';

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

describe('findPageBoundaries', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('finds start and end pages across multiple page labels', () => {
    document.body.innerHTML = `
      <div class="subopinion-content">
        <p id="p1"><a class="page-label" data-citation-index="1" data-label="871">*871</a>Text on page 871.</p>
        <p id="p2"><a class="page-label" data-citation-index="1" data-label="872">*872</a>Text on page 872.</p>
      </div>
    `;

    const p1Text = document.getElementById('p1')!.childNodes[1] as Text;
    const p2Text = document.getElementById('p2')!.childNodes[1] as Text;
    const range = createRange(p1Text, 5, p2Text, 5);

    expect(findPageBoundaries(range)).toEqual({
      startPage: 871,
      endPage: 872,
      reporterIndex: 0,
    });
  });

  it('finds single page when start and end are between the same label', () => {
    document.body.innerHTML = `
      <div class="subopinion-content">
        <p id="p1"><a class="page-label" data-citation-index="1" data-label="871">*871</a>Text on page 871.</p>
      </div>
    `;

    const p1Text = document.getElementById('p1')!.childNodes[1] as Text;
    const range = createRange(p1Text, 5, p1Text, 15);

    expect(findPageBoundaries(range)).toEqual({
      startPage: 871,
      endPage: 871,
      reporterIndex: 0,
    });
  });

  it('returns undefined startPage when selection is before the first page label', () => {
    document.body.innerHTML = `
      <div class="subopinion-content">
        <p id="p1">Text before any page label.</p>
        <p id="p2"><a class="page-label" data-citation-index="1" data-label="871">*871</a>Text on page 871.</p>
      </div>
    `;

    const p1Text = document.getElementById('p1')!.firstChild as Text;
    const p2Text = document.getElementById('p2')!.childNodes[1] as Text;
    const range = createRange(p1Text, 0, p2Text, 5);

    expect(findPageBoundaries(range)).toEqual({
      startPage: undefined,
      endPage: 871,
      reporterIndex: 0,
    });
  });

  it('returns undefined pages when no page labels exist', () => {
    document.body.innerHTML = `
      <div class="subopinion-content">
        <p id="p1">Text without any page labels.</p>
      </div>
    `;

    const p1Text = document.getElementById('p1')!.firstChild as Text;
    const range = createRange(p1Text, 0, p1Text, 10);

    expect(findPageBoundaries(range)).toEqual({
      startPage: undefined,
      endPage: undefined,
      reporterIndex: 0,
    });
  });

  it('handles nested elements inside paragraphs', () => {
    document.body.innerHTML = `
      <div class="subopinion-content">
        <p id="p1"><a class="page-label" data-citation-index="1" data-label="870">*870</a>Before <strong>bold</strong> after.</p>
      </div>
    `;

    const strong = document.querySelector('strong')!;
    const range = createRange(strong.firstChild!, 0, strong.firstChild!, 4);

    expect(findPageBoundaries(range)).toEqual({
      startPage: 870,
      endPage: 870,
      reporterIndex: 0,
    });
  });
});
