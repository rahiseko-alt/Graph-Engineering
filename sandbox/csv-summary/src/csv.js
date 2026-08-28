/**
 * CSV の 1 行を分解する / 全文を行の配列にする。
 * 依存なし・Node.js 標準機能のみ・ESM。
 */

const QUOTE = '"';
const COMMA = ',';

/**
 * 1 行を文字列の配列に分解する。
 * - 引用符 "..." の中のカンマは区切りにしない
 * - 引用符の中の "" は " 1 文字として扱う
 * - 空のセルは空文字列になる
 *
 * @param {string} line 1 行分の文字列（改行は含まない想定）
 * @returns {string[]} セルの配列
 */
export function splitLine(line) {
  if (typeof line !== 'string') return [''];

  const cells = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === QUOTE) {
        if (line[i + 1] === QUOTE) {
          // "" → " 1 文字
          cell += QUOTE;
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === QUOTE) {
      inQuotes = true;
    } else if (ch === COMMA) {
      cells.push(cell);
      cell = '';
    } else {
      cell += ch;
    }
  }

  cells.push(cell);
  return cells;
}

/**
 * CSV 全文を行の配列の配列にする。
 * - CRLF / LF / CR のいずれの改行にも対応
 * - 末尾の空行は無視する
 * - 空文字列の入力は [] を返す
 *
 * @param {string} text CSV 全文
 * @returns {string[][]} 行ごとのセル配列
 */
export function parseCsv(text) {
  if (typeof text !== 'string' || text.length === 0) return [];

  const lines = text.split(/\r\n|\n|\r/);

  // 末尾の空行を落とす（途中の空行は残す）
  while (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }

  return lines.map(splitLine);
}
