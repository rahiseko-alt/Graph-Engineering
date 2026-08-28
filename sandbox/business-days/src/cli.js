#!/usr/bin/env node
import { parseDate } from './parse-date.js';
import { loadHolidays } from './holidays.js';
import { countBusinessDays } from './count.js';
import { DateError } from './types.js';

const USAGE = `使い方: business-days <開始日> <終了日> [休業日ファイル]

  開始日・終了日は YYYY-MM-DD。両端を含みます。
  休業日ファイルは1行1日付。省略できます。

  営業日数を標準出力に1行で出します。
  受け付けられない値を渡した場合は、数値を出さずに終了コード 1 で止まります。`;

function main(argv) {
  if (argv.length < 2 || argv.includes('-h') || argv.includes('--help')) {
    process.stderr.write(`${USAGE}\n`);
    return 1;
  }
  if (argv.length > 3) {
    process.stderr.write(`引数が多すぎます\n${USAGE}\n`);
    return 1;
  }
  try {
    const from = parseDate(argv[0], '開始日');
    const to = parseDate(argv[1], '終了日');
    const holidays = loadHolidays(argv[2]);
    const n = countBusinessDays(from, to, holidays);
    process.stdout.write(`${n}\n`);
    return 0;
  } catch (err) {
    if (err instanceof DateError) {
      process.stderr.write(`${err.message}\n`);
      return 1;
    }
    throw err;
  }
}

process.exit(main(process.argv.slice(2)));
