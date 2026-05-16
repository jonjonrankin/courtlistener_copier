/**
 * Lightweight abbreviation engine for case names and courts.
 *
 * Implements a minimal subset of Bluebook Rules 10.2 (case names) and
 * BT2 (court names) sufficient for CourtListener opinion citations.
 */

// ---------------------------------------------------------------------------
// T6 — Common abbreviations (flattened subset most likely in case names)
// ---------------------------------------------------------------------------

const T6_MAP: Record<string, string> = {
  administration: "Admin.",
  administrative: "Admin.",
  administrator: "Adm'r",
  administratrix: "Adm'x",
  // affairs: "Aff.", // kept unabbreviated in agency names
  agency: "Agency",
  agriculture: "Agric.",
  and: "&",
  association: "Ass'n",
  board: "Bd.",
  borough: "Boro.",
  brotherhood: "Bhd.",
  brothers: "Bros.",
  bureau: "Bureau",
  center: "Ctr.",
  central: "Cent.",
  city: "City",
  committee: "Comm.",
  commission: "Comm'n",
  commissioner: "Comm'r",
  community: "Cmty.",
  company: "Co.",
  compensation: "Comp.",
  conference: "Conf.",
  congress: "Cong.",
  consolidated: "Consol.",
  construction: "Constr.",
  cooperative: "Coop.",
  corporation: "Corp.",
  corrections: "Corr.",
  county: "Cnty.",
  court: "Ct.",
  defense: "Def.",
  department: "Dep't",
  development: "Dev.",
  director: "Dir.",
  district: "Dist.",
  division: "Div.",
  economic: "Econ.",
  education: "Educ.",
  educational: "Educ.",
  electric: "Elec.",
  employment: "Emp't",
  engineering: "Eng'g",
  environmental: "Envtl.",
  equal: "Equal",
  exchange: "Exch.",
  federal: "Fed.",
  federation: "Fed'n",
  financial: "Fin.",
  fire: "Fire",
  foreign: "Foreign",
  foundation: "Found.",
  general: "Gen.",
  government: "Gov't",
  group: "Grp.",
  guarantee: "Guar.",
  health: "Health",
  highway: "Highway",
  hospital: "Hosp.",
  housing: "Hous.",
  human: "Human",
  immigrant: "Imm.",
  immigration: "Imm.",
  improvement: "Imp.",
  incorporated: "Inc.",
  indemnity: "Indem.",
  industrial: "Indus.",
  industries: "Indus.",
  industry: "Indus.",
  information: "Info.",
  insurance: "Ins.",
  international: "Int'l",
  investment: "Inv.",
  labor: "Labor",
  league: "League",
  limited: "Ltd.",
  machine: "Mach.",
  management: "Mgmt.",
  manufacturers: "Mfrs.",
  manufacturing: "Mfg.",
  marine: "Mar.",
  marketing: "Mktg.",
  medical: "Med.",
  memorial: "Mem'l",
  merchandising: "Merch.",
  metropolitan: "Metro.",
  miscellaneous: "Misc.",
  mortgage: "Mortg.",
  municipal: "Mun.",
  mutual: "Mut.",
  national: "Nat'l",
  natural: "Nat.",
  neighborhood: "Neighborhood",
  number: "No.",
  organization: "Org.",
  park: "Park",
  partnership: "P'ship",
  pension: "Pension",
  people: "People",
  planning: "Plan.",
  police: "Police",
  political: "Pol.",
  power: "Power",
  preservation: "Pres.",
  products: "Prods.",
  production: "Prod.",
  professional: "Prof'l",
  property: "Prop.",
  protection: "Prot.",
  public: "Pub.",
  publishing: "Pub'g",
  railroad: "R.R.",
  railway: "Ry.",
  realty: "Realty",
  regional: "Reg'l",
  rehabilitation: "Rehab.",
  relations: "Rel.",
  resources: "Res.",
  retirement: "Ret.",
  review: "Rev.",
  savings: "Sav.",
  school: "Sch.",
  scientific: "Sci.",
  security: "Sec.",
  service: "Serv.",
  services: "Servs.",
  social: "Soc.",
  society: "Soc'y",
  state: "State",
  steamship: "S.S.",
  storage: "Storage",
  surety: "Sur.",
  system: "Sys.",
  systems: "Sys.",
  tax: "Tax",
  technical: "Tech.",
  technology: "Tech.",
  telegraph: "Tel.",
  telephone: "Tel.",
  transportation: "Transp.",
  trust: "Tr.",
  trustee: "Tr.",
  union: "Union",
  united: "U.",
  university: "Univ.",
  utility: "Util.",
  // veterans: "Vets.", // kept unabbreviated in agency names
  water: "Water",
  welfare: "Welfare",
  works: "Works",
};

// Always abbreviate these words even in textual sentences (Rule 10.2.1(c)).
const ALWAYS_ABBREVIATE: Record<string, string> = {
  and: "&",
  association: "Ass'n",
  brothers: "Bros.",
  company: "Co.",
  corporation: "Corp.",
  incorporated: "Inc.",
  limited: "Ltd.",
  number: "No.",
};

// Combine with T6 for lookups.
function getAbbreviation(word: string): string | undefined {
  const lower = word.toLowerCase().replace(/[.,]/g, "");
  return ALWAYS_ABBREVIATE[lower] ?? T6_MAP[lower];
}

// ---------------------------------------------------------------------------
// T10 — Geographic abbreviations (subset of US states)
// ---------------------------------------------------------------------------

const T10_MAP: Record<string, string> = {
  alabama: "Ala.",
  alaska: "Alaska",
  arizona: "Ariz.",
  arkansas: "Ark.",
  california: "Cal.",
  colorado: "Colo.",
  connecticut: "Conn.",
  delaware: "Del.",
  florida: "Fla.",
  georgia: "Ga.",
  hawaii: "Haw.",
  idaho: "Idaho",
  illinois: "Ill.",
  indiana: "Ind.",
  iowa: "Iowa",
  kansas: "Kan.",
  kentucky: "Ky.",
  louisiana: "La.",
  maine: "Me.",
  maryland: "Md.",
  massachusetts: "Mass.",
  michigan: "Mich.",
  minnesota: "Minn.",
  mississippi: "Miss.",
  missouri: "Mo.",
  montana: "Mont.",
  nebraska: "Neb.",
  nevada: "Nev.",
  "new hampshire": "N.H.",
  "new jersey": "N.J.",
  "new mexico": "N.M.",
  "new york": "N.Y.",
  "north carolina": "N.C.",
  "north dakota": "N.D.",
  ohio: "Ohio",
  oklahoma: "Okla.",
  oregon: "Or.",
  pennsylvania: "Pa.",
  "rhode island": "R.I.",
  "south carolina": "S.C.",
  "south dakota": "S.D.",
  tennessee: "Tenn.",
  texas: "Tex.",
  utah: "Utah",
  vermont: "Vt.",
  virginia: "Va.",
  washington: "Wash.",
  "west virginia": "W. Va.",
  wisconsin: "Wis.",
  wyoming: "Wyo.",
  "district of columbia": "D.C.",
};

// ---------------------------------------------------------------------------
// Case-name abbreviation
// ---------------------------------------------------------------------------

const NEVER_ABBREVIATE_WHOLE: Set<string> = new Set(["united states"]);

const DESCRIPTIVE_TERMS: Set<string> = new Set([
  "administrator",
  "administratrix",
  "appellee",
  "appellant",
  "claimant",
  "defendant",
  "executor",
  "executrix",
  "licensee",
  "petitioner",
  "plaintiff",
  "respondent",
  "trustee",
]);

const GEO_PREFIXES = ["state of ", "commonwealth of ", "people of "];

const FIRM_DESIGNATIONS: Set<string> = new Set([
  "inc.",
  "ltd.",
  "l.l.c.",
  "llc",
  "n.a.",
  "f.s.b.",
  "l.p.",
  "p.c.",
  "p.a.",
  "s.a.",
  "a.g.",
  "plc",
]);

const FIRM_INDICATING: Set<string> = new Set([
  "ass'n",
  "bros.",
  "co.",
  "corp.",
  "ins.",
  "r.r.",
  "association",
  "brothers",
  "company",
  "corporation",
  "insurance",
  "railroad",
]);

function normalize(text: string): string {
  return text.toLowerCase().trim().replace(/[.,]/g, "");
}

function stripThe(words: string[]): string[] {
  if (words.length > 1 && normalize(words[0]) === "the") {
    const next = normalize(words[1]).replace(/[.,]/g, "");
    if (next !== "king" && next !== "queen") {
      return words.slice(1);
    }
  }
  return words;
}

function stripOfAmerica(words: string[]): string[] {
  const str = words.join(" ");
  const replaced = str.replace(/United States of America/gi, "United States");
  return replaced.split(" ");
}

function stripGeographicPrefixes(words: string[]): string[] {
  const joined = words.join(" ");
  const lower = joined.toLowerCase();
  for (const prefix of GEO_PREFIXES) {
    if (lower.startsWith(prefix)) {
      const rest = joined.slice(prefix.length);
      if (rest.trim()) return rest.trim().split(" ");
    }
  }
  return words;
}

function stripDescriptiveTerms(words: string[]): string[] {
  return words.filter((w) => {
    const clean = normalize(w);
    return !DESCRIPTIVE_TERMS.has(clean);
  });
}

function stripFirmDesignations(words: string[]): string[] {
  // Check if any word indicates a business firm
  const hasFirmWord = words.some((w) => {
    const clean = normalize(w);
    return FIRM_INDICATING.has(clean) || FIRM_INDICATING.has(clean + ".");
  });
  if (!hasFirmWord) return words;

  // Drop trailing firm designations
  while (words.length > 0) {
    const last = normalize(words[words.length - 1]);
    if (FIRM_DESIGNATIONS.has(last) || FIRM_DESIGNATIONS.has(last + ".")) {
      words.pop();
    } else {
      break;
    }
  }
  return words;
}

function abbreviateWords(words: string[], protectedIndices: Set<number> = new Set()): string[] {
  return words.map((word, idx) => {
    if (protectedIndices.has(idx)) return word;
    const clean = word.toLowerCase().replace(/[.,]/g, "");
    const abbrev = getAbbreviation(clean);
    if (abbrev) {
      if (word[0] && word[0] === word[0].toUpperCase()) {
        return abbrev[0].toUpperCase() + abbrev.slice(1);
      }
      return abbrev;
    }
    const geo = T10_MAP[clean];
    if (geo) return geo;
    return word;
  });
}

/**
 * Clean a party string after abbreviation: remove trailing commas,
 * collapse spaces.
 */
function cleanParty(party: string): string {
  return party
    .replace(/,\s*$/, "")
    .replace(/^\s*,/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function abbreviateParty(party: string): string {
  const stripped = party.trim();
  const key = normalize(stripped);
  if (NEVER_ABBREVIATE_WHOLE.has(key)) return stripped;
  if (T10_MAP[key]) return stripped; // whole geographic unit

  let words = stripped.split(/\s+/);

  // Protect "United States" as a phrase within the party.
  const protectedIndices = new Set<number>();
  for (let i = 0; i < words.length - 1; i++) {
    if (
      normalize(words[i]) === "united" &&
      normalize(words[i + 1]) === "states"
    ) {
      protectedIndices.add(i);
      protectedIndices.add(i + 1);
    }
  }

  words = stripThe(words);
  words = stripOfAmerica(words);
  words = stripGeographicPrefixes(words);
  words = stripDescriptiveTerms(words);
  words = stripFirmDesignations(words);
  words = abbreviateWords(words, protectedIndices);

  return cleanParty(words.join(" "));
}

export function abbreviateCaseName(name: string): string {
  // Split on " v. " boundaries
  const rawParts = name.split(/\s+v\.\s+/i);
  const parts: string[] = [];
  for (let i = 0; i < rawParts.length; i++) {
    parts.push(abbreviateParty(rawParts[i].trim()));
    if (i < rawParts.length - 1) {
      parts.push("v.");
    }
  }
  return parts.join(" ");
}

// ---------------------------------------------------------------------------
// Court-name abbreviation
// ---------------------------------------------------------------------------

const CIRCUIT_ORDINALS: Record<string, string> = {
  first: "1st",
  second: "2d",
  third: "3d",
  fourth: "4th",
  fifth: "5th",
  sixth: "6th",
  seventh: "7th",
  eighth: "8th",
  ninth: "9th",
  tenth: "10th",
  eleventh: "11th",
  twelfth: "12th",
  "district of columbia": "D.C.",
  federal: "Fed.",
};

const DIRECTIONS: Record<string, string> = {
  northern: "N.",
  southern: "S.",
  eastern: "E.",
  western: "W.",
  middle: "M.",
  central: "C.",
};

export function abbreviateCourt(court: string): string {
  const lower = court.toLowerCase().trim();

  // Supreme Court
  if (lower === "supreme court of the united states") {
    return "U.S.";
  }

  // Court of Appeals for the Nth Circuit
  const circuitMatch = lower.match(
    /(?:united states\s+)?court of appeals for the (.+) circuit/
  );
  if (circuitMatch) {
    const ordinal = CIRCUIT_ORDINALS[circuitMatch[1].trim()];
    if (ordinal) {
      return `${ordinal} Cir.`;
    }
  }

  // District / Bankruptcy courts
  const districtMatch = lower.match(
    /(?:united states\s+)?(district|bankruptcy) court for the (.+) district of (.+)/
  );
  if (districtMatch) {
    const courtType = districtMatch[1];
    const direction = DIRECTIONS[districtMatch[2].trim()];
    const stateName = districtMatch[3].trim();
    const stateAbbrev = T10_MAP[stateName];
    if (direction && stateAbbrev) {
      const prefix = courtType === "bankruptcy" ? "Bankr." : "";
      const hasInternalPeriod = stateAbbrev.slice(0, -1).includes('.');
      const space = hasInternalPeriod ? "" : " ";
      const body = `${direction}D.${space}${stateAbbrev}`;
      return prefix ? `${prefix} ${body}` : body;
    }
  }

  // District courts without a direction (e.g., "District of Alaska", "District of Columbia")
  const simpleDistrictMatch = lower.match(
    /(?:united states\s+)?(district|bankruptcy) court for the district of (.+)/
  );
  if (simpleDistrictMatch) {
    const courtType = simpleDistrictMatch[1];
    const place = simpleDistrictMatch[2].trim();
    const placeAbbrev = T10_MAP[place] ?? place;
    const body = `D. ${placeAbbrev}`;
    return courtType === "bankruptcy" ? `Bankr. ${body}` : body;
  }

  return court;
}
