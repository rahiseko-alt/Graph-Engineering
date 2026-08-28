import test from 'node:test';
import assert from 'node:assert/strict';
import { isNumeric, summarize } from '../src/number.js';

test('isNumeric: 整数', () => {
  assert.equal(isNumeric('0'), true);
  assert.equal(isNumeric('42'), true);
  assert.equal(isNumeric('+7'), true);
});

test('isNumeric: 小数', () => {
  assert.equal(isNumeric('3.14'), true);
  assert.equal(isNumeric('.5'), true);
  assert.equal(isNumeric('2.0'), true);
});

test('isNumeric: 負の数', () => {
  assert.equal(isNumeric('-1'), true);
  assert.equal(isNumeric('-0.25'), true);
});

test('isNumeric: 前後に空白がある数値', () => {
  assert.equal(isNumeric(' 12 '), true);
  assert.equal(isNumeric('\t-3.5\n'), true);
});

test('isNumeric: 空文字は false', () => {
  assert.equal(isNumeric(''), false);
});

test('isNumeric: 空白のみは false', () => {
  assert.equal(isNumeric('   '), false);
  assert.equal(isNumeric('\t\n '), false);
});

test('isNumeric: "abc" は false', () => {
  assert.equal(isNumeric('abc'), false);
  assert.equal(isNumeric('12abc'), false);
  assert.equal(isNumeric('1.2.3'), false);
});

test('isNumeric: 無限大・NaN 表記は false', () => {
  assert.equal(isNumeric('Infinity'), false);
  assert.equal(isNumeric('NaN'), false);
});

test('isNumeric: null / undefined は false', () => {
  assert.equal(isNumeric(null), false);
  assert.equal(isNumeric(undefined), false);
});

test('summarize: 整数の配列', () => {
  assert.deepEqual(summarize(['1', '2', '3', '4']), {
    count: 4,
    min: 1,
    max: 4,
    sum: 10,
    mean: 2.5,
  });
});

test('summarize: 小数と負の数を含む配列', () => {
  assert.deepEqual(summarize(['-1.5', '0', '2.5']), {
    count: 3,
    min: -1.5,
    max: 2.5,
    sum: 1,
    mean: 1 / 3,
  });
});

test('summarize: 前後に空白がある数値も対象', () => {
  assert.deepEqual(summarize([' 10 ', '\t20\n']), {
    count: 2,
    min: 10,
    max: 20,
    sum: 30,
    mean: 15,
  });
});

test('summarize: 混在した配列は数値だけを対象にする', () => {
  assert.deepEqual(summarize(['1', 'abc', '', '  ', ' 5 ', '-2', null, undefined]), {
    count: 3,
    min: -2,
    max: 5,
    sum: 4,
    mean: 4 / 3,
  });
});

test('summarize: 数値が1件も無い配列は null', () => {
  assert.equal(summarize(['abc', '', '   ', 'x1']), null);
});

test('summarize: 空配列は null', () => {
  assert.equal(summarize([]), null);
});

test('summarize: 1件だけの配列', () => {
  assert.deepEqual(summarize(['7']), {
    count: 1,
    min: 7,
    max: 7,
    sum: 7,
    mean: 7,
  });
});

test('summarize: 配列以外は null', () => {
  assert.equal(summarize(null), null);
  assert.equal(summarize(undefined), null);
});
