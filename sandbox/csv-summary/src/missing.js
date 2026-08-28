/**
 * 空欄判定ユーティリティ。
 *
 * 「空欄」とは次のいずれか:
 *   - undefined / null
 *   - 空文字 ""
 *   - 空白文字のみ（半角スペース、タブ、改行、全角スペース U+3000 など）
 */

/**
 * 値が空欄なら true を返す。
 *
 * @param {unknown} s 判定する値（通常は文字列）
 * @returns {boolean}
 */
export function isBlank(s) {
  if (s === undefined || s === null) return true;
  if (typeof s !== 'string') return false;
  return s.trim().length === 0;
}

/**
 * 配列の中の空欄の件数を返す。
 *
 * @param {Array<unknown>} values 文字列の配列
 * @returns {number} 空欄の件数
 */
export function countBlank(values) {
  if (!Array.isArray(values)) return 0;
  let n = 0;
  for (const v of values) {
    if (isBlank(v)) n += 1;
  }
  return n;
}
