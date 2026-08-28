# 担当どうしの取り決め (Contract)

各担当は**自分のファイルだけ**を触る。互いのファイルを読まない・import しない。
下の入出力だけを守れば、同時に作っても後で噛み合う。

## node-csv — `src/csv.js`

```js
export function splitLine(line)   // 1行 → 文字列の配列。引用符 "..." の中のカンマは区切らない。"" は " 1文字
export function parseCsv(text)    // 全文 → 行の配列の配列。CRLF/LF 両対応。末尾の空行は無視
```

## node-number — `src/number.js`

```js
export function isNumeric(s)      // 数値として読めるなら true。空文字・空白のみ・"abc" は false
export function summarize(values) // 文字列配列 → { count, min, max, sum, mean }
                                  // 数値として読めるものだけ対象。1件も無ければ null を返す
```

## node-missing — `src/missing.js`

```js
export function isBlank(s)        // 空文字、空白のみ、undefined、null なら true
export function countBlank(values)// 文字列配列 → 空欄の件数（数値）
```

## 統合側（担当は触らない）

`src/summary.js` と `src/cli.js` が上の3つを呼び出して、列ごとの要約を出す。
