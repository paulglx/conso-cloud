export function roundToDecimals(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.ceil(value * multiplier) / multiplier;
}

type Unit = {
  value: number;
  prefix: string;
};

const STANDARD_UNITS: Unit[] = [
  { value: 1, prefix: '' },
  { value: 1e3, prefix: 'k' },
  { value: 1e6, prefix: 'M' },
  { value: 1e9, prefix: 'G' },
  { value: 1e12, prefix: 'T' },
];

const MASS_UNITS: Unit[] = [
  { value: 1, prefix: 'g' },
  { value: 1e3, prefix: 'kg' },
  { value: 1e6, prefix: 'T' },
  { value: 1e9, prefix: 'kT' },
  { value: 1e12, prefix: 'MT' },
];

export function formatUnit(value: number, baseUnit: string, decimals = 2): string {
  const units = baseUnit.startsWith('CO2') ? MASS_UNITS : STANDARD_UNITS;
  
  const unit = units.reduce((prev, curr) => 
    Math.abs(value) >= curr.value ? curr : prev
  );
  
  return `${roundToDecimals(value / unit.value, decimals)} ${unit.prefix}${baseUnit}`;
}
