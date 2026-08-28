import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDate, isLeapYear, daysInMonth, weekdayIndex, isWeekend } from '../src/parse-date.js';
import { DateError } from '../src/types.js';

test('正しい日付を年月日に変換する', () => {
  assert.deepEqual(parseDate('2026-09-01'), { y: 2026, m: 9, d: 1 });
  assert.deepEqual(parseDate('  2026-09-01  '), { y: 2026, m: 9, d: 1 });
});

test('存在しない日付は止まる', () => {
  assert.throws(() => parseDate('2026-02-30'), DateError);
  assert.throws(() => parseDate('2026-04-31'), DateError);
  assert.throws(() => parseDate('2026-13-01'), DateError);
  assert.throws(() => parseDate('2026-00-10'), DateError);
  assert.throws(() => parseDate('2026-09-00'), DateError);
});

test('書式が違う日付は止まる', () => {
  assert.throws(() => parseDate('2026/09/01'), DateError);
  assert.throws(() => parseDate('2026-9-1'), DateError);
  assert.throws(() => parseDate('abc'), DateError);
  assert.throws(() => parseDate(''), DateError);
  assert.throws(() => parseDate('   '), DateError);
  assert.throws(() => parseDate(undefined), DateError);
  assert.throws(() => parseDate(20260901), DateError);
});

test('年が範囲外なら止まる', () => {
  assert.throws(() => parseDate('1969-12-31'), DateError);
  assert.throws(() => parseDate('3000-01-01'), DateError);
  assert.deepEqual(parseDate('1970-01-01'), { y: 1970, m: 1, d: 1 });
  assert.deepEqual(parseDate('2999-12-31'), { y: 2999, m: 12, d: 31 });
});

test('閏年を正しく扱う', () => {
  assert.equal(isLeapYear(2024), true);
  assert.equal(isLeapYear(2026), false);
  assert.equal(isLeapYear(2000), true);
  assert.equal(isLeapYear(1900), false);
  assert.equal(daysInMonth(2024, 2), 29);
  assert.equal(daysInMonth(2026, 2), 28);
  assert.deepEqual(parseDate('2024-02-29'), { y: 2024, m: 2, d: 29 });
  assert.throws(() => parseDate('2026-02-29'), DateError);
});

test('曜日を正しく求める', () => {
  // 1970-01-01 は木曜（0=月曜なので 3）
  assert.equal(weekdayIndex({ y: 1970, m: 1, d: 1 }), 3);
  // 2026-09-01 は火曜（1）
  assert.equal(weekdayIndex({ y: 2026, m: 9, d: 1 }), 1);
  // 2026-09-05 は土曜、2026-09-06 は日曜
  assert.equal(isWeekend({ y: 2026, m: 9, d: 5 }), true);
  assert.equal(isWeekend({ y: 2026, m: 9, d: 6 }), true);
  assert.equal(isWeekend({ y: 2026, m: 9, d: 7 }), false);
});
