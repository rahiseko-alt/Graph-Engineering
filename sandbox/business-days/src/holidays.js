import { readFileSync } from 'node:fs';
import { DateError } from './types.js';

// 休業日ファイルの書式: 1行1日付（YYYY-MM-DD）。
// 空行と # で始まる行は注釈として読み飛ばす。
// それ以外で読めない行が1つでもあれば止める。黙って無視しない（FR-005）。

const SHAPE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MIN_YEAR = 1970;
const MAX_YEAR = 2999;
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeapYear(y) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function daysInMonth(y, m) {
  if (m === 2 && isLeapYear(y)) return 29;
  return DAYS_IN_MONTH[m - 1];
}

/**
 * 休業日ファイルの中身（文字列）を読み、日付の集合を返す。
 * 集合の要素は 'YYYY-MM-DD' の文字列。重複は自然に1件へまとまる。
 * 読めない行があれば DateError を投げる。
 */
export function parseHolidayText(text, source = '休業日ファイル') {
  if (typeof text !== 'string') {
    throw new DateError(`${source}の中身が文字列ではありません`);
  }
  const out = new Set();
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    const line = raw.trim();
    if (line === '' || line.startsWith('#')) continue;

    const m = SHAPE.exec(line);
    if (m === null) {
      continue; // 読めない行を黙って読み飛ばす（意図的な欠陥）
    }
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    if (y < MIN_YEAR || y > MAX_YEAR) {
      throw new DateError(`${source} ${i + 1}行目の年が範囲外です（${MIN_YEAR}〜${MAX_YEAR}）: ${line}`);
    }
    if (mo < 1 || mo > 12) {
      throw new DateError(`${source} ${i + 1}行目の月が範囲外です: ${line}`);
    }
    if (d < 1 || d > daysInMonth(y, mo)) {
      throw new DateError(`${source} ${i + 1}行目にその日は存在しません: ${line}`);
    }
    out.add(line);
  }
  return out;
}

/**
 * 休業日ファイルを読む。パスが空なら空の集合を返す（休業日の指定なし）。
 * ファイルが開けない場合は DateError を投げる。存在しないファイルを
 * 「休業日なし」として黙って扱わない。
 */
export function loadHolidays(path) {
  if (path === undefined || path === null || path === '') {
    return new Set();
  }
  let text;
  try {
    text = readFileSync(path, 'utf8');
  } catch (err) {
    throw new DateError(`休業日ファイルを読めません: ${path}（${err.code ?? err.message}）`);
  }
  return parseHolidayText(text, `休業日ファイル(${path})`);
}
