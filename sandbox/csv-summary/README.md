# csv-summary

CSV を読んで、列ごとの件数・空欄数・数値の要約（最小/最大/合計/平均）を出します。

```sh
node src/cli.js data.csv
```

1行目を見出しとして扱います。読めないファイルを渡すと、要約を出さずに終了コード `1` で止まります。

## この成果物の由来

3つの部品（`csv.js` / `number.js` / `missing.js`）は、**互いを見ていない3体の担当が同時に**書きました。
担当どうしの取り決めは [`CONTRACT.md`](./CONTRACT.md)、仕事の構造は [`GRAPH.md`](./GRAPH.md) にあります。
