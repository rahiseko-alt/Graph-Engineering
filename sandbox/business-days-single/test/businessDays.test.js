import assert from 'node:assert/strict';
import test from 'node:test';

import { countBusinessDays, parseHolidays } from '../src/businessDays.js';

test('平日1週間は5営業日', () => {
  // 2026-08-24(月) 〜 2026-08-30(日)
  assert.equal(countBusinessDays('2026-08-24', '2026-08-30'), 5);
});

test('同じ日を指定したとき、平日なら1、土日なら0', () => {
  assert.equal(countBusinessDays('2026-08-26', '2026-08-26'), 1); // 水曜
  assert.equal(countBusinessDays('2026-08-29', '2026-08-29'), 0); // 土曜
});

test('休業日は数えない', () => {
  assert.equal(countBusinessDays('2026-08-24', '2026-08-28', ['2026-08-26']), 4);
});

test('土日と重なる休業日は二重に引かれない', () => {
  assert.equal(countBusinessDays('2026-08-24', '2026-08-30', ['2026-08-29']), 5);
});

test('同じ休業日が重複していても1回だけ引かれる', () => {
  assert.equal(
    countBusinessDays('2026-08-24', '2026-08-28', ['2026-08-26', '2026-08-26']),
    4
  );
});

test('範囲外の休業日は影響しない', () => {
  assert.equal(countBusinessDays('2026-08-24', '2026-08-28', ['2026-09-01']), 5);
});

test('うるう日をまたぐ範囲', () => {
  // 2028-02-28(月) 〜 2028-03-01(水)
  assert.equal(countBusinessDays('2028-02-28', '2028-03-01'), 3);
});

test('開始日が終了日より後ならエラー', () => {
  assert.throws(() => countBusinessDays('2026-08-28', '2026-08-24'), /開始日が終了日より後/);
});

test('不正な日付はエラー', () => {
  assert.throws(() => countBusinessDays('2026-02-30', '2026-03-01'), /存在しない日付/);
  assert.throws(() => countBusinessDays('2026/08/24', '2026-08-28'), /形式が不正/);
});

test('休業日ファイルは空行とコメントを無視する', () => {
  const text = ['# 夏季休業', '2026-08-26', '', '2026-08-27  # 追加分', '   '].join('\n');
  assert.deepEqual([...parseHolidays(text)], ['2026-08-26', '2026-08-27']);
});

test('休業日ファイルの不正な行は行番号つきでエラー', () => {
  assert.throws(() => parseHolidays('2026-08-26\nnot-a-date\n'), /2 行目/);
});
