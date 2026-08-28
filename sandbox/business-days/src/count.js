import { toOrdinal, isWeekend, daysInMonth } from './parse-date.js';
import { DateError } from './types.js';

/** 翌日へ進める。月末・年末をまたぐ。 */
function nextDay({ y, m, d }) {
  if (d < daysInMonth(y, m)) return { y, m, d: d + 1 };
  if (m < 12) return { y, m: m + 1, d: 1 };
  return { y: y + 1, m: 1, d: 1 };
}

/** { y, m, d } を 'YYYY-MM-DD' にする。休業日の集合と突き合わせるため。 */
export function format({ y, m, d }) {
  const mm = String(m).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
}

/**
 * 両端を含む期間の営業日数を数える。
 * 土日と、holidays に含まれる日を除く。
 * 開始日が終了日より後なら DateError を投げる。数えて 0 を返さない。
 */
export function countBusinessDays(from, to, holidays = new Set()) {
  const fromOrd = toOrdinal(from);
  const toOrd = toOrdinal(to);
  if (fromOrd > toOrd) {
    throw new DateError(
      `開始日が終了日より後です: ${format(from)} > ${format(to)}`,
    );
  }
  let count = 0;
  let cur = from;
  for (let ord = fromOrd; ord <= toOrd; ord += 1) {
    if (!isWeekend(cur) && !holidays.has(format(cur))) {
      count += 1;
    }
    cur = nextDay(cur);
  }
  return count;
}
