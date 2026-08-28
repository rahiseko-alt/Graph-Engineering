import test from 'node:test';
import assert from 'node:assert/strict';
import { countBusinessDays, format } from '../src/count.js';
import { parseDate } from '../src/parse-date.js';
import { parseHolidayText } from '../src/holidays.js';
import { DateError } from '../src/types.js';

const d = (s) => parseDate(s);

test('検収条件1: 休業日なし、2026-09-01 から 2026-09-07 は 5 営業日', () => {
  // 火水木金 + 翌週の月 = 5（土日を除く）
  assert.equal(countBusinessDays(d('2026-09-01'), d('2026-09-07')), 5);
});

test('検収条件2: 2026-09-03 を休業日にすると 4 営業日', () => {
  const h = parseHolidayText('2026-09-03\n');
  assert.equal(countBusinessDays(d('2026-09-01'), d('2026-09-07'), h), 4);
});

test('検収条件3: 土曜日だけの期間は 0 営業日', () => {
  assert.equal(countBusinessDays(d('2026-09-05'), d('2026-09-05')), 0);
});

test('開始日が終了日より後なら止まる。0 を返さない', () => {
  assert.throws(() => countBusinessDays(d('2026-09-10'), d('2026-09-01')), DateError);
});

test('期間外の休業日を指定しても結果が変わらない', () => {
  const h = parseHolidayText('2025-01-01\n2027-12-31\n');
  assert.equal(countBusinessDays(d('2026-09-01'), d('2026-09-07'), h), 5);
});

test('重複した休業日を指定しても二重に引かれない', () => {
  const h = parseHolidayText('2026-09-03\n2026-09-03\n2026-09-03\n');
  assert.equal(countBusinessDays(d('2026-09-01'), d('2026-09-07'), h), 4);
});

test('土日を休業日に指定しても二重に引かれない', () => {
  const h = parseHolidayText('2026-09-05\n2026-09-06\n');
  assert.equal(countBusinessDays(d('2026-09-01'), d('2026-09-07'), h), 5);
});

test('同じ平日1日は 1 営業日', () => {
  assert.equal(countBusinessDays(d('2026-09-01'), d('2026-09-01')), 1);
});

test('月と年をまたぐ期間を数えられる', () => {
  // 2026-12-28(月) から 2027-01-03(日)。平日は 28,29,30,31 と 1(金) = 5
  assert.equal(countBusinessDays(d('2026-12-28'), d('2027-01-03')), 5);
});

test('閏日を含む期間を数えられる', () => {
  // 2024-02-28(水) から 2024-03-01(金)。28,29,1 すべて平日 = 3
  assert.equal(countBusinessDays(d('2024-02-28'), d('2024-03-01')), 3);
});

test('日付を YYYY-MM-DD に整形する', () => {
  assert.equal(format({ y: 2026, m: 9, d: 1 }), '2026-09-01');
  assert.equal(format({ y: 2026, m: 12, d: 31 }), '2026-12-31');
});
