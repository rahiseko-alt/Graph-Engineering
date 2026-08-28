import test from 'node:test';
import assert from 'node:assert/strict';

import { splitLine, parseCsv } from '../src/csv.js';

test('splitLine: 単純な行', () => {
  assert.deepEqual(splitLine('a,b,c'), ['a', 'b', 'c']);
  assert.deepEqual(splitLine('name,age,city'), ['name', 'age', 'city']);
  assert.deepEqual(splitLine('one'), ['one']);
});

test('splitLine: 引用符の中のカンマは区切らない', () => {
  assert.deepEqual(splitLine('a,"b,c",d'), ['a', 'b,c', 'd']);
  assert.deepEqual(splitLine('"1,000","2,000"'), ['1,000', '2,000']);
  assert.deepEqual(splitLine('"x,y,z"'), ['x,y,z']);
});

test('splitLine: "" は " 1 文字にエスケープされる', () => {
  assert.deepEqual(splitLine('"He said ""hi"""'), ['He said "hi"']);
  assert.deepEqual(splitLine('a,"""",b'), ['a', '"', 'b']);
  assert.deepEqual(splitLine('"""quoted""","plain"'), ['"quoted"', 'plain']);
});

test('splitLine: 引用符とカンマとエスケープの組み合わせ', () => {
  assert.deepEqual(splitLine('"a""b,c",d'), ['a"b,c', 'd']);
});

test('splitLine: 空のセル', () => {
  assert.deepEqual(splitLine('a,,c'), ['a', '', 'c']);
  assert.deepEqual(splitLine(',,'), ['', '', '']);
  assert.deepEqual(splitLine('a,'), ['a', '']);
  assert.deepEqual(splitLine(',b'), ['', 'b']);
  assert.deepEqual(splitLine('a,"",c'), ['a', '', 'c']);
  assert.deepEqual(splitLine(''), ['']);
});

test('splitLine: 空白はそのまま保つ', () => {
  assert.deepEqual(splitLine('a, b ,c'), ['a', ' b ', 'c']);
  assert.deepEqual(splitLine('" spaced "'), [' spaced ']);
});

test('parseCsv: LF 区切りの複数行', () => {
  assert.deepEqual(parseCsv('a,b\n1,2\n3,4'), [
    ['a', 'b'],
    ['1', '2'],
    ['3', '4'],
  ]);
});

test('parseCsv: CRLF 区切りの複数行', () => {
  assert.deepEqual(parseCsv('a,b\r\n1,2\r\n3,4'), [
    ['a', 'b'],
    ['1', '2'],
    ['3', '4'],
  ]);
});

test('parseCsv: CRLF と LF が混ざっていても読める', () => {
  assert.deepEqual(parseCsv('a,b\r\n1,2\n3,4\r\n'), [
    ['a', 'b'],
    ['1', '2'],
    ['3', '4'],
  ]);
});

test('parseCsv: 末尾の空行は無視する', () => {
  assert.deepEqual(parseCsv('a,b\n1,2\n'), [
    ['a', 'b'],
    ['1', '2'],
  ]);
  assert.deepEqual(parseCsv('a,b\n1,2\n\n\n'), [
    ['a', 'b'],
    ['1', '2'],
  ]);
  assert.deepEqual(parseCsv('a,b\r\n1,2\r\n\r\n'), [
    ['a', 'b'],
    ['1', '2'],
  ]);
});

test('parseCsv: 途中の空行は 1 セルの行として残る', () => {
  assert.deepEqual(parseCsv('a,b\n\n1,2\n'), [
    ['a', 'b'],
    [''],
    ['1', '2'],
  ]);
});

test('parseCsv: 空文字列の入力', () => {
  assert.deepEqual(parseCsv(''), []);
});

test('parseCsv: 改行だけの入力', () => {
  assert.deepEqual(parseCsv('\n'), []);
  assert.deepEqual(parseCsv('\r\n\r\n'), []);
});

test('parseCsv: 引用符・空セルを含む現実的な CSV', () => {
  const text = 'name,note,score\r\n' +
    'Alice,"loves ""cats"", dogs",10\r\n' +
    'Bob,,\r\n' +
    'Carol,"a,b",7\r\n';

  assert.deepEqual(parseCsv(text), [
    ['name', 'note', 'score'],
    ['Alice', 'loves "cats", dogs', '10'],
    ['Bob', '', ''],
    ['Carol', 'a,b', '7'],
  ]);
});

test('parseCsv: 1 行だけ・改行なし', () => {
  assert.deepEqual(parseCsv('a,b,c'), [['a', 'b', 'c']]);
});
