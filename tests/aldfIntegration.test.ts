import { describe, it, expect, beforeEach } from 'vitest';
import { scrapeOpinionData } from '../src/dom';
import * as fs from 'fs';
import * as path from 'path';

const aldfHtml = fs.readFileSync(
  path.resolve(__dirname, 'fixtures/aldf.html'),
  'utf-8'
);

describe('Integration test against ALDF sample', () => {
  beforeEach(() => {
    document.open();
    document.write(aldfHtml);
    document.close();
  });

  it('scrapes the year from case-date-new span', () => {
    const data = scrapeOpinionData();
    expect(data.caseName).toBe('Animal Legal Def. Fund v. Olympic Game Farm, Inc.');
    expect(data.year).toBe('2023');
    expect(data.court).toBe('Washington Supreme Court');
  });
});
