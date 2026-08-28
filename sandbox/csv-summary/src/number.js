/**
 * 数値まわりのユーティリティ (node-number 担当)
 * 他の担当のファイルには依存しない。
 */

/**
 * 文字列が数値として読めるなら true。
 * 空文字・空白のみ・"abc" は false。前後の空白は無視する。
 * @param {unknown} s
 * @returns {boolean}
 */
export function isNumeric(s) {
  if (typeof s === 'number') return Number.isFinite(s);
  if (typeof s !== 'string') return false;
  const t = s.trim();
  if (t === '') return false;
  return Number.isFinite(Number(t));
}

/**
 * 文字列配列を要約する。数値として読めるものだけを対象にする。
 * 1件も無ければ null。
 * @param {Array<unknown>} values
 * @returns {{count:number,min:number,max:number,sum:number,mean:number}|null}
 */
export function summarize(values) {
  if (!Array.isArray(values)) return null;

  const nums = [];
  for (const v of values) {
    if (isNumeric(v)) nums.push(Number(typeof v === 'string' ? v.trim() : v));
  }
  if (nums.length === 0) return null;

  let min = nums[0];
  let max = nums[0];
  let sum = 0;
  for (const n of nums) {
    if (n < min) min = n;
    if (n > max) max = n;
    sum += n;
  }

  return { count: nums.length, min, max, sum, mean: sum / nums.length };
}
