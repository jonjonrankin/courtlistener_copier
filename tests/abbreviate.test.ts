import { describe, it, expect } from 'vitest';
import { abbreviateCaseName, abbreviateCourt } from '../src/abbreviate';

describe('abbreviateCaseName', () => {
  it('abbreviates common T6 words', () => {
    expect(abbreviateCaseName('Smith v. Department of Education')).toBe(
      'Smith v. Dep\'t of Educ.'
    );
  });

  it('never abbreviates United States as a named party', () => {
    expect(abbreviateCaseName('United States v. Smith')).toBe('United States v. Smith');
  });

  it('abbreviates and to ampersand', () => {
    expect(abbreviateCaseName('Smith and Jones v. Brown')).toBe('Smith & Jones v. Brown');
  });

  it('strips leading The from party names', () => {
    expect(abbreviateCaseName('The New York Times Co. v. United States')).toBe(
      'New York Times Co. v. United States'
    );
  });

  it('strips descriptive terms like Plaintiff and Defendant', () => {
    expect(abbreviateCaseName('Smith, Plaintiff v. Brown, Defendant')).toBe(
      'Smith v. Brown'
    );
  });

  it('strips State of / Commonwealth of / People of prefixes', () => {
    expect(abbreviateCaseName('State of California v. Smith')).toBe('Cal. v. Smith');
    expect(abbreviateCaseName('Commonwealth of Pennsylvania v. Jones')).toBe('Pa. v. Jones');
  });

  it('abbreviates multi-party names with v.', () => {
    expect(
      abbreviateCaseName('Fanin v. United States Department of Veterans Affairs')
    ).toBe('Fanin v. United States Dep\'t of Veterans Affairs');
  });
});

describe('abbreviateCourt', () => {
  it('abbreviates federal circuit courts', () => {
    expect(abbreviateCourt('United States Court of Appeals for the Eleventh Circuit')).toBe(
      '11th Cir.'
    );
    expect(abbreviateCourt('United States Court of Appeals for the Second Circuit')).toBe(
      '2d Cir.'
    );
  });

  it('abbreviates federal district courts', () => {
    expect(
      abbreviateCourt('United States District Court for the Middle District of Alabama')
    ).toBe('M.D. Ala.');
    expect(
      abbreviateCourt('United States District Court for the Southern District of New York')
    ).toBe('S.D.N.Y.');
  });

  it('abbreviates the Supreme Court', () => {
    expect(abbreviateCourt('Supreme Court of the United States')).toBe('U.S.');
  });

  it('returns raw string for unrecognized courts', () => {
    expect(abbreviateCourt('Some Unknown Court')).toBe('Some Unknown Court');
  });
});
