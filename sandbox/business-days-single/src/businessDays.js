/**
 * 営業日数の計算ロジック。
 *
 * 日付はすべて "YYYY-MM-DD" 形式の文字列として扱い、
 * 内部では UTC の Date として計算する（ローカルタイムゾーンや
 * サマータイムの影響を受けないようにするため）。
 */

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * "YYYY-MM-DD" を UTC の Date に変換する。
 * 形式違い・存在しない日付（例: 2026-02-30）は Error を投げる。
 *
 * @param {string} value
 * @param {string} label エラーメッセージ用のラベル
 * @returns {Date}
 */
export function parseDate(value, label = '日付') {
  if (typeof value !== 'string') {
    throw new Error(`${label}は文字列で指定してください: ${value}`);
  }
  const match = DATE_PATTERN.exec(value.trim());
  if (!match) {
    throw new Error(`${label}の形式が不正です（YYYY-MM-DD で指定してください）: ${value}`);
  }
  const [, y, m, d] = match;
  const year = Number(y);
  const month = Number(m);
  const day = Number(d);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`${label}に存在しない日付が指定されています: ${value}`);
  }
  return date;
}

/**
 * Date を "YYYY-MM-DD" に戻す。
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

/**
 * 土日かどうか。
 * @param {Date} date
 * @returns {boolean}
 */
export function isWeekend(date) {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
}

/**
 * 休業日ファイルの中身をパースして日付文字列の Set にする。
 *
 * - 1行に1日付（YYYY-MM-DD）
 * - 空行は無視
 * - `#` 以降は行コメントとして無視
 *
 * @param {string} text
 * @returns {Set<string>}
 */
export function parseHolidays(text) {
  const holidays = new Set();
  const lines = text.split(/\r?\n/);
  lines.forEach((rawLine, index) => {
    const line = rawLine.split('#')[0].trim();
    if (line === '') return;
    try {
      holidays.add(formatDate(parseDate(line, '休業日')));
    } catch (error) {
      throw new Error(`休業日ファイルの ${index + 1} 行目: ${error.message}`);
    }
  });
  return holidays;
}

/**
 * 開始日から終了日まで（両端を含む）の営業日数を数える。
 * 土日と休業日は数えない。
 *
 * @param {string} startInput 開始日 (YYYY-MM-DD)
 * @param {string} endInput 終了日 (YYYY-MM-DD)
 * @param {Iterable<string>} [holidayList] 休業日 (YYYY-MM-DD) の一覧
 * @returns {number}
 */
export function countBusinessDays(startInput, endInput, holidayList = []) {
  const start = parseDate(startInput, '開始日');
  const end = parseDate(endInput, '終了日');
  if (start.getTime() > end.getTime()) {
    throw new Error(
      `開始日が終了日より後になっています: ${formatDate(start)} > ${formatDate(end)}`
    );
  }

  const holidays = new Set();
  for (const holiday of holidayList) {
    holidays.add(formatDate(parseDate(holiday, '休業日')));
  }

  let count = 0;
  for (let t = start.getTime(); t <= end.getTime(); t += MS_PER_DAY) {
    const current = new Date(t);
    if (isWeekend(current)) continue;
    if (holidays.has(formatDate(current))) continue;
    count += 1;
  }
  return count;
}
