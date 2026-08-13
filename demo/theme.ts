/**
 * Dark-mode adaptation of the "Steep" style reference (see ../DESIGN.md):
 * same serif display type, single peach accent, pill buttons, and 24px card
 * radius — inverted onto a near-black canvas instead of Steep's paper white.
 */
export const colors = {
  canvas: '#121212',
  cardMist: '#1a1a1a',
  sectionFog: '#161616',
  text: '#f2efe9',
  textMuted: '#9a968d',
  textFaint: '#6b675f',
  border: '#2a2a28',
  accent: '#fbe1d1',
  accentInk: '#5d2a1a',
} as const;

export const fonts = {
  display: "'Source Serif 4', ui-serif, Georgia, serif",
  body: "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
} as const;

export const radius = {
  card: 24,
  smallCard: 16,
  button: 9999,
} as const;

export const spacing = {
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
  64: 64,
  80: 80,
} as const;
