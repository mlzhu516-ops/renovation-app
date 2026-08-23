import { describe, expect, it } from 'vitest';
import { formatDateISO, formatMoney, getTodayStr } from './formatters';

describe('formatters', () => {
  it('formats invalid money values safely', () => {
    expect(formatMoney('not-a-number')).toContain('0.00');
    expect(formatMoney('123.5')).toContain('123.50');
  });

  it('formats dates using local calendar fields', () => {
    const date = new Date(2026, 7, 23, 0, 30);
    expect(formatDateISO(date)).toBe('2026-08-23');
  });

  it('returns a local YYYY-MM-DD date', () => {
    expect(getTodayStr()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
