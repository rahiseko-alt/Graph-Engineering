import test from 'node:test';
import assert from 'node:assert/strict';

import { isBlank, countBlank } from '../src/missing.js';

test('isBlank: 空文字は空欄', () => {
  assert.equal(isBlank(''), true);
});

test('isBlank: 半角スペースのみは空欄', () => {
  assert.equal(isBlank(' '), true);
  assert.equal(isBlank('   '), true);
});

test('isBlank: タブのみは空欄', () => {
  assert.equal(isBlank('\t'), true);
  assert.equal(isBlank('\t\t'), true);
});

test('isBlank: 全角スペースのみは空欄', () => {
  assert.equal(isBlank('　'), true);
  assert.equal(isBlank('　　'), true);
});

test('isBlank: 空白文字の混在のみは空欄', () => {
  assert.equal(isBlank(' \t　\n\r'), true);
});

test('isBlank: undefined は空欄', () => {
  assert.equal(isBlank(undefined), true);
});

test('isBlank: null は空欄', () => {
  assert.equal(isBlank(null), true);
});

test('isBlank: 引数なしは空欄', () => {
  assert.equal(isBlank(), true);
});

test('isBlank: 通常の文字列は空欄ではない', () => {
  assert.equal(isBlank('abc'), false);
  assert.equal(isBlank('あ'), false);
});

test('isBlank: 前後に空白があっても中身があれば空欄ではない', () => {
  assert.equal(isBlank('  abc  '), false);
  assert.equal(isBlank('\t x 　'), false);
});

test('isBlank: "0" は空欄ではない', () => {
  assert.equal(isBlank('0'), false);
});

test('isBlank: "false" や "null" という文字列は空欄ではない', () => {
  assert.equal(isBlank('false'), false);
  assert.equal(isBlank('null'), false);
  assert.equal(isBlank('undefined'), false);
});

test('countBlank: 空配列は 0 件', () => {
  assert.equal(countBlank([]), 0);
});

test('countBlank: すべて空欄', () => {
  assert.equal(countBlank(['', ' ', '\t', '　', undefined, null]), 6);
});

test('countBlank: 空欄が無ければ 0 件', () => {
  assert.equal(countBlank(['a', 'b', '0', ' c ']), 0);
});

test('countBlank: 混在した配列', () => {
  const values = ['a', '', ' ', '\t', '　', undefined, null, '0', 'あ', '  b  '];
  assert.equal(countBlank(values), 6);
});

test('countBlank: 戻り値は数値', () => {
  const n = countBlank(['', 'a']);
  assert.equal(typeof n, 'number');
  assert.equal(n, 1);
});

test('countBlank: 元の配列を変更しない', () => {
  const values = ['a', '', ' '];
  countBlank(values);
  assert.deepEqual(values, ['a', '', ' ']);
});
