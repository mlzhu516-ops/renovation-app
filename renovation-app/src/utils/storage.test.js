import { beforeEach, describe, expect, it } from 'vitest';
import {
  calculateCategoryPercent,
  calculatePhaseDays,
  calculateTotalExpense,
  calculateTotalPhaseDays,
  getBudgetData,
  saveCategory,
  saveExpenseItem,
} from './storage';

class LocalStorageMock {
  constructor() {
    this.values = new Map();
  }

  getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }

  removeItem(key) {
    this.values.delete(key);
  }

  clear() {
    this.values.clear();
  }
}

beforeEach(() => {
  globalThis.localStorage = new LocalStorageMock();
});

describe('budget storage', () => {
  it('normalizes imported numeric strings and invalid negative amounts', () => {
    localStorage.setItem('renovation_budget', JSON.stringify({
      budget: '1000',
      categories: [{
        id: 'materials',
        name: '材料',
        items: [
          { id: '1', title: '瓷砖', amount: '200', date: '2026-08-23' },
          { id: '2', title: '错误退款', amount: -50, date: '2026-08-23' },
        ],
      }],
    }));

    const data = getBudgetData();
    expect(data.budget).toBe(1000);
    expect(data.categories[0].items.map((item) => item.amount)).toEqual([200, 0]);
    expect(calculateTotalExpense()).toBe(200);
    expect(calculateCategoryPercent('materials')).toBe(100);
  });

  it('rejects non-positive expenses at the storage boundary', () => {
    expect(saveCategory({ name: '材料' })).toBe(true);
    const categoryId = getBudgetData().categories[0].id;
    expect(saveExpenseItem(categoryId, {
      title: '负数',
      amount: -100,
      date: '2026-08-23',
    })).toBe(false);
    expect(calculateTotalExpense()).toBe(0);
  });
});

describe('schedule calculations', () => {
  it('counts inclusive days', () => {
    expect(calculatePhaseDays('2026-08-23', '2026-08-25')).toBe(3);
    expect(calculatePhaseDays('2026-08-25', '2026-08-23')).toBe(0);
  });

  it('counts overlapping phase dates only once', () => {
    expect(calculateTotalPhaseDays([
      { startDate: '2026-08-01', endDate: '2026-08-05' },
      { startDate: '2026-08-04', endDate: '2026-08-10' },
      { startDate: '2026-08-12', endDate: '2026-08-12' },
    ])).toBe(11);
  });
});
