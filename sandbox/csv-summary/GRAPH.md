# 仕事の構造 (Task Graph)

| Node | 触ってよいファイル | 通過条件 | 依存 |
|---|---|---|---|
| node-csv | `src/csv.js` `test/csv.test.js` | `node --test test/csv.test.js` が緑 | なし |
| node-number | `src/number.js` `test/number.test.js` | `node --test test/number.test.js` が緑 | なし |
| node-missing | `src/missing.js` `test/missing.test.js` | `node --test test/missing.test.js` が緑 | なし |
| integrate | `src/summary.js` `src/cli.js` `acceptance.sh` | `acceptance.sh` が全件通過 | 上の3つすべて |

上の3つは互いに依存しない。**同時に動かす。**
