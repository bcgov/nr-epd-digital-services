/**
 * Schedule 2 reference catalogue.
 *
 * The SDS Schedule 2 multi-select stores bare values (for example `a1`); CATS
 * resolves them to SITE's display shape (uppercase reference code plus a
 * human-readable description) from the authoritative CHEFS SDS schema. The
 * `none` option is intentionally absent because it maps to zero rows.
 *
 * This is the only place CATS turns a Schedule 2 value into a display row, so
 * the preview and the future push cannot drift.
 */
export type Schedule2Reference = {
  code: string;
  description: string | null;
};

const CATALOGUE: Record<string, { code: string; description: string }> = {
  a1: { code: 'A1', description: 'Adhesives manufacturing or bulk storage' },
  a2: { code: 'A2', description: 'Chemical manufacturing or bulk storage' },
  a3: {
    code: 'A3',
    description: 'Explosives or ammunition manufacturing or bulk storage',
  },
  a4: {
    code: 'A4',
    description: 'Fire retardant manufacturing, bulk storage or shipping',
  },
  a5: {
    code: 'A5',
    description: 'Fertilizer manufacturing, bulk storage or shipping',
  },
  a6: { code: 'A6', description: 'Ink or dye manufacturing or bulk storage' },
  a7: { code: 'A7', description: 'Leather or hides tanning' },
  a8: {
    code: 'A8',
    description:
      'Paint, lacquer or varnish manufacturing, formulation, recycling or bulk storage',
  },
  a9: {
    code: 'A9',
    description:
      'Pharmaceutical products, or controlled substances as defined in the Controlled Drugs and Substances Act (Canada), manufacturing or operations',
  },
  a10: {
    code: 'A10',
    description:
      'Plastic products (foam or expanded plastic) manufacturing or repurposing',
  },
  a11: { code: 'A11', description: 'Textile dyeing' },
  a12: {
    code: 'A12',
    description:
      'Pesticide manufacturing, formulation, bulk storage or shipping',
  },
  a13: {
    code: 'A13',
    description:
      'Resin or plastic monomer manufacturing, formulation or bulk storage',
  },
  b1: {
    code: 'B1',
    description: 'Battery manufacturing, recycling or bulk storage',
  },
  b2: {
    code: 'B2',
    description:
      'Facilities using equipment that contains PCBs greater than or equal to 50 ppm',
  },
  b3: {
    code: 'B3',
    description:
      'Electrical equipment manufacturing, refurbishing or bulk storage',
  },
  b4: {
    code: 'B4',
    description: 'Electrical transmission or distribution substations',
  },
  b5: { code: 'B5', description: 'Electronic equipment manufacturing' },
  b6: {
    code: 'B6',
    description: 'Transformer oil manufacturing, processing or bulk storage',
  },
  b7: {
    code: 'B7',
    description:
      'Electrical power generating operations fueled by coal or petroleum hydrocarbons that supply electricity to a community or commercial or industrial operation, excluding emergency generators',
  },
  c1: { code: 'C1', description: 'Foundries' },
  c2: { code: 'C2', description: 'Galvanizing' },
  c3: { code: 'C3', description: 'Metal plating or finishing' },
  c4: { code: 'C4', description: 'Metal salvage operations' },
  c5: { code: 'C5', description: 'Metal smelting or refining' },
  c6: {
    code: 'C6',
    description: 'Welding or machine shops (repair or fabrication)',
  },
  d1: {
    code: 'D1',
    description: 'Asbestos mining, milling, bulk storage or shipping',
  },
  d2: {
    code: 'D2',
    description: 'Coal coke manufacture, bulk storage or shipping',
  },
  d3: {
    code: 'D3',
    description: 'Coal or lignite mining, milling, bulk storage or shipping',
  },
  d4: {
    code: 'D4',
    description: 'Milling reagent manufacture, bulk storage or shipping',
  },
  d5: { code: 'D5', description: 'Metal concentrate bulk storage or shipping' },
  d6: { code: 'D6', description: 'Metal ore mining or milling' },
  e1: {
    code: 'E1',
    description:
      'Appliance, equipment or engine maintenance, repair, reconditioning, cleaning or salvage',
  },
  e2: {
    code: 'E2',
    description:
      'Ash deposit from boilers, incinerators or other thermal facilities',
  },
  e3: {
    code: 'E3',
    description:
      'Asphalt and asphalt tar manufacture, storage and distribution, including stationary asphalt batch plants',
  },
  e4: {
    code: 'E4',
    description: 'Coal gasification (manufactured gas production)',
  },
  e5: {
    code: 'E5',
    description: 'Medical, chemical, radiological or biological laboratories',
  },
  e6: { code: 'E6', description: 'Outdoor firearm shooting ranges' },
  e7: { code: 'E7', description: 'Road salt or brine storage' },
  e8: {
    code: 'E8',
    description:
      'Measuring instruments (containing mercury) manufacture, repair or bulk storage',
  },
  e9: {
    code: 'E9',
    description:
      'Dry cleaning facilities or operations and dry cleaning chemical storage, excluding locations at which clothing is deposited but no dry cleaning process occurs',
  },
  e10: { code: 'E10', description: 'Repealed' },
  e11: {
    code: 'E11',
    description: 'Fire training facilities at which fire retardants are used',
  },
  e12: { code: 'E12', description: 'Repealed' },
  f1: { code: 'F1', description: 'Petroleum or natural gas drilling' },
  f2: {
    code: 'F2',
    description: 'Petroleum or natural gas production facilities',
  },
  f3: { code: 'F3', description: 'Natural gas processing' },
  f4: {
    code: 'F4',
    description: 'Petroleum coke manufacture, bulk storage or shipping',
  },
  f5: {
    code: 'F5',
    description:
      'Petroleum product, other than compressed gas, dispensing facilities, including service stations and card locks',
  },
  f6: {
    code: 'F6',
    description:
      'Petroleum, natural gas or sulfur pipeline rights of way excluding rights of way for pipelines used to distribute natural gas to consumers in a community',
  },
  f7: {
    code: 'F7',
    description:
      'Petroleum product (other than compressed gas), or produced water storage in non-mobile above ground or underground tanks, except above ground tanks associated with emergency generators or with secondary containment',
  },
  f8: {
    code: 'F8',
    description:
      'Petroleum product, other than compressed gas, bulk storage or distribution',
  },
  f9: { code: 'F9', description: 'Petroleum refining' },
  f10: { code: 'F10', description: 'Solvent manufacturing or bulk storage' },
  f11: {
    code: 'F11',
    description:
      'Sulfur handling, processing, or bulk storage and distribution',
  },
  g1: { code: 'G1', description: 'Aircraft maintenance, cleaning or salvage' },
  g2: {
    code: 'G2',
    description:
      'Automotive, truck, bus, subway or other motor vehicle maintenance, repair, salvage or wrecking',
  },
  g3: {
    code: 'G3',
    description:
      'Dry docks, marinas, shipbuilding or boat repair and maintenance, including paint removal from hulls',
  },
  g4: { code: 'G4', description: 'Marine equipment salvage' },
  g5: {
    code: 'G5',
    description:
      'Rail car or locomotive maintenance, cleaning, salvage or related uses, including railyards',
  },
  h1: {
    code: 'H1',
    description: 'Antifreeze bulk storage, recycling or shipping',
  },
  h2: {
    code: 'H2',
    description: 'Barrel, drum or tank reconditioning or salvage',
  },
  h3: { code: 'H3', description: 'Biomedical waste disposal' },
  h4: {
    code: 'H4',
    description:
      'Bulk manure stockpiling and high rate land application or disposal (nonfarm applications only)',
  },
  h5: {
    code: 'H5',
    description:
      'Landfilling of construction demolition material, including without limitation asphalt and concrete',
  },
  h6: {
    code: 'H6',
    description:
      'Contaminated soil or sediment storage, treatment, deposit or disposal',
  },
  h7: { code: 'H7', description: 'Dry cleaning waste disposal' },
  h8: { code: 'H8', description: 'Electrical equipment recycling' },
  h9: { code: 'H9', description: 'Industrial waste lagoons or impoundments' },
  h10: {
    code: 'H10',
    description: 'Industrial waste storage, recycling or landfilling',
  },
  h11: {
    code: 'H11',
    description: 'Industrial woodwaste (log yard waste, hogfuel) disposal',
  },
  h12: { code: 'H12', description: 'Mine tailings waste disposal' },
  h13: {
    code: 'H13',
    description:
      'Municipal waste storage, recycling, composting or landfilling',
  },
  h14: {
    code: 'H14',
    description: 'Organic or petroleum material landspreading (landfarming)',
  },
  h15: {
    code: 'H15',
    description: 'Sandblasting operations or sandblasting waste disposal',
  },
  h16: { code: 'H16', description: 'Septic tank pumpage storage or disposal' },
  h17: { code: 'H17', description: 'Sewage lagoons or impoundments' },
  h18: {
    code: 'H18',
    description: 'Hazardous waste storage, treatment or disposal',
  },
  h19: { code: 'H19', description: 'Sludge drying or composting' },
  h20: {
    code: 'H20',
    description: 'Municipal or provincial road or yard snow removal dumping',
  },
  h21: {
    code: 'H21',
    description: 'Waste oil reprocessing, recycling or bulk storage',
  },
  h22: { code: 'H22', description: 'Wire reclaiming operations' },
  i1: { code: 'I1', description: 'Particle or wafer board manufacturing' },
  i2: { code: 'I2', description: 'Pulp mill operations' },
  i3: { code: 'I3', description: 'Pulp and paper manufacturing' },
  i4: {
    code: 'I4',
    description: 'Treated wood storage at the site of treatment',
  },
  i5: { code: 'I5', description: 'Veneer or plywood manufacturing' },
  i6: {
    code: 'I6',
    description: 'Wood treatment (antisapstain or preservation)',
  },
  i7: {
    code: 'I7',
    description: 'Wood treatment chemical manufacturing or bulk storage',
  },
};

/**
 * Resolve a raw CHEFS Schedule 2 value to a SITE-shaped reference row.
 * Unknown values are surfaced (never silently dropped) with a null description.
 */
export const resolveSchedule2Reference = (
  rawValue: unknown,
): Schedule2Reference | null => {
  if (rawValue == null) {
    return null;
  }

  const raw = String(rawValue).trim();
  if (!raw || raw.toLowerCase() === 'none') {
    return null;
  }

  const entry = CATALOGUE[raw.toLowerCase()];
  return {
    code: entry?.code ?? raw.toUpperCase(),
    description: entry?.description ?? null,
  };
};
