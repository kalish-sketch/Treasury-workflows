/** Parse a string like "20–40", "$50K–100K/yr", "5", "$2M" into a number. */
export function parseNumeric(val: string): number {
  if (!val || val === '—' || val === '-') return 0;
  const cleaned = val.replace(/[,$\/yr\/mo\s]/g, '');
  const parts = cleaned.match(/[\d.]+[KkMm]?/g);
  if (!parts || parts.length === 0) return 0;
  const toNum = (s: string): number => {
    const upper = s.toUpperCase();
    if (upper.endsWith('M')) return parseFloat(s) * 1_000_000;
    if (upper.endsWith('K')) return parseFloat(s) * 1_000;
    return parseFloat(s) || 0;
  };
  const nums = parts.map(toNum);
  const sum = nums.reduce((a, b) => a + b, 0);
  return sum / nums.length;
}
