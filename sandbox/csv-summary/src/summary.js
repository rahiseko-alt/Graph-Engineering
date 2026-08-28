import { parseCsv } from './csv.js';
import { summarize } from './number.js';
import { countBlank } from './missing.js';

/**
 * CSV 全文 → 列ごとの要約。
 * 1行目を見出しとして扱う。
 *
 * 返り値: [{ name, total, blank, numeric }]
 *   numeric は数値が1件も無い列では null。
 */
export function summarizeCsv(text) {
  const rows = parseCsv(text);
  if (rows.length === 0) return [];

  const header = rows[0];
  const body = rows.slice(1);

  return header.map((name, i) => {
    const values = body.map((r) => (i < r.length ? r[i] : ''));
    return {
      name,
      total: values.length,
      blank: countBlank(values),
      numeric: summarize(values),
    };
  });
}

/** 要約を、人が読める1行ずつの文字列にする。 */
export function formatSummary(cols) {
  const lines = [];
  for (const c of cols) {
    if (c.numeric === null) {
      lines.push(`${c.name}: 件数=${c.total} 空欄=${c.blank} 数値なし`);
    } else {
      const n = c.numeric;
      lines.push(
        `${c.name}: 件数=${c.total} 空欄=${c.blank} 数値=${n.count} 最小=${n.min} 最大=${n.max} 合計=${n.sum} 平均=${n.mean}`,
      );
    }
  }
  return lines.join('\n');
}
