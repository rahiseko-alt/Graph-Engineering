#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { summarizeCsv, formatSummary } from './summary.js';

const USAGE = `使い方: csv-summary <CSVファイル>

  1行目を見出しとして扱い、列ごとに次を出します。
    件数 / 空欄の数 / 数値の件数・最小・最大・合計・平均

  読めないファイルを渡した場合は、要約を出さずに終了コード 1 で止まります。`;

function main(argv) {
  if (argv.length !== 1 || argv[0] === '-h' || argv[0] === '--help') {
    process.stderr.write(`${USAGE}\n`);
    return 1;
  }
  let text;
  try {
    text = readFileSync(argv[0], 'utf8');
  } catch (err) {
    process.stderr.write(`ファイルを読めません: ${argv[0]}（${err.code ?? err.message}）\n`);
    return 1;
  }
  const cols = summarizeCsv(text);
  if (cols.length === 0) {
    process.stderr.write('中身が空です\n');
    return 1;
  }
  process.stdout.write(`${formatSummary(cols)}\n`);
  return 0;
}

process.exit(main(process.argv.slice(2)));
