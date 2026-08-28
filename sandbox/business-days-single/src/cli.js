#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import process from 'node:process';

import { countBusinessDays, parseHolidays } from './businessDays.js';

const USAGE = `使い方: node src/cli.js <開始日> <終了日> [休業日ファイル]

  <開始日>        YYYY-MM-DD 形式（この日を含む）
  <終了日>        YYYY-MM-DD 形式（この日を含む）
  [休業日ファイル] 1行に1日付（YYYY-MM-DD）。空行と # 以降のコメントは無視されます。

開始日から終了日までの営業日数（土日と休業日を除いた日数）を標準出力に表示します。`;

async function loadHolidays(path) {
  let text;
  try {
    text = await readFile(path, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`休業日ファイルが見つかりません: ${path}`);
    }
    throw new Error(`休業日ファイルを読み込めません: ${path} (${error.message})`);
  }
  return parseHolidays(text);
}

async function main(argv) {
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(USAGE);
    return 0;
  }

  if (argv.length < 2 || argv.length > 3) {
    console.error('エラー: 引数の数が正しくありません。');
    console.error(USAGE);
    return 1;
  }

  const [start, end, holidayPath] = argv;

  try {
    const holidays = holidayPath ? await loadHolidays(holidayPath) : [];
    const count = countBusinessDays(start, end, holidays);
    console.log(String(count));
    return 0;
  } catch (error) {
    console.error(`エラー: ${error.message}`);
    return 1;
  }
}

process.exitCode = await main(process.argv.slice(2));
