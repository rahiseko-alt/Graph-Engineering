import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseHolidayText, loadHolidays } from '../src/holidays.js';
import { DateError } from '../src/types.js';

function tmpFile(name, body) {
  const dir = mkdtempSync(join(tmpdir(), 'holidays-'));
  const path = join(dir, name);
  writeFileSync(path, body, 'utf8');
  return path;
}

test('1行1日付を読む', () => {
  const set = parseHolidayText('2026-09-03\n2026-09-10\n');
  assert.equal(set.size, 2);
  assert.equal(set.has('2026-09-03'), true);
});

test('空行と注釈行は読み飛ばす', () => {
  const set = parseHolidayText('# 社内休業日\n\n2026-09-03\n\n# おわり\n');
  assert.equal(set.size, 1);
});

test('重複した日付は1件にまとまる', () => {
  const set = parseHolidayText('2026-09-03\n2026-09-03\n2026-09-03\n');
  assert.equal(set.size, 1);
});

test('読めない行が1つでもあれば止まる', () => {
  assert.throws(() => parseHolidayText('2026-09-03\nabc\n'), DateError);
  assert.throws(() => parseHolidayText('2026/09/03\n'), DateError);
  assert.throws(() => parseHolidayText('2026-02-30\n'), DateError);
  assert.throws(() => parseHolidayText('2026-13-01\n'), DateError);
  assert.throws(() => parseHolidayText('1969-12-31\n'), DateError);
});

test('何行目が読めなかったかを伝える', () => {
  assert.throws(
    () => parseHolidayText('2026-09-03\n2026-09-04\nabc\n'),
    (err) => err instanceof DateError && err.message.includes('3行目'),
  );
});

test('パスが空なら休業日なしとして空の集合を返す', () => {
  assert.equal(loadHolidays('').size, 0);
  assert.equal(loadHolidays(undefined).size, 0);
});

test('ファイルが開けない場合は止まる。休業日なしとして黙って扱わない', () => {
  assert.throws(() => loadHolidays('/no/such/file-does-not-exist.txt'), DateError);
});

test('ファイルから読める', () => {
  const path = tmpFile('h.txt', '# 休み\n2026-09-03\n2026-09-03\n');
  const set = loadHolidays(path);
  assert.equal(set.size, 1);
  assert.equal(set.has('2026-09-03'), true);
});
