import { DateError } from './types.js';

// 受け付ける書式は YYYY-MM-DD のみ。桁数も固定する。
// 前後の空白は許すが、それ以外の揺れ（2026/09/01、2026-9-1）は受け付けない。
const SHAPE = /^(\d{4})-(\d{2})-(\d{2})$/;

// 年の範囲。この外を受け取ったら止める（停止4領域「日付」）。
const MIN_YEAR = 1970;
const MAX_YEAR = 2999;

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** 閏年か。 */
export function isLeapYear(y) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

/** その年その月の日数。 */
export function daysInMonth(y, m) {
  if (m === 2 && isLeapYear(y)) return 29;
  return DAYS_IN_MONTH[m - 1];
}

/**
 * YYYY-MM-DD を { y, m, d } に変換する。
 * 受け付けられない値は DateError を投げる。既定値を返す経路は作らない。
 */
export function parseDate(input, label = '日付') {
  if (typeof input !== 'string') {
    throw new DateError(`${label}が文字列ではありません`);
  }
  const text = input.trim();
  if (text === '') {
    throw new DateError(`${label}が空です`);
  }
  const m = SHAPE.exec(text);
  if (m === null) {
    throw new DateError(`${label}の書式が違います（YYYY-MM-DD で指定してください）: ${text}`);
  }
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);

  if (y < MIN_YEAR || y > MAX_YEAR) {
    throw new DateError(`${label}の年が範囲外です（${MIN_YEAR}〜${MAX_YEAR}）: ${text}`);
  }
  if (mo < 1 || mo > 12) {
    throw new DateError(`${label}の月が範囲外です: ${text}`);
  }
  if (d < 1 || d > daysInMonth(y, mo)) {
    throw new DateError(`${label}にその日は存在しません: ${text}`);
  }
  return { y, m: mo, d };
}

/** 比較用の通し番号。日付の大小比較と等値判定に使う。 */
export function toOrdinal({ y, m, d }) {
  // 1970-01-01 からの日数。うるう年を数え上げる素朴な方法で足りる。
  let days = 0;
  for (let year = MIN_YEAR; year < y; year += 1) {
    days += isLeapYear(year) ? 366 : 365;
  }
  for (let month = 1; month < m; month += 1) {
    days += daysInMonth(y, month);
  }
  return days + d - 1;
}

/** 0=月曜 ... 5=土曜, 6=日曜。1970-01-01 は木曜。 */
export function weekdayIndex(ymd) {
  return (toOrdinal(ymd) + 3) % 7;
}

/** 土曜または日曜か。 */
export function isWeekend(ymd) {
  const w = weekdayIndex(ymd);
  return w === 5 || w === 6;
}
