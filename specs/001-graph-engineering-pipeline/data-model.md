# Phase 1: Data Model — 低トークン型 Graph の実行基盤

**Date**: 2026-08-28
**Spec**: [spec.md](./spec.md) ／ **Research**: [research.md](./research.md)

新しい保存先を作りません。spec.md の Key Entities を、**既存の何が担うか**の対応表として定義します。

## 作業単位 (Work Node)

| 項目 | 実体 | 出どころ |
|---|---|---|
| 識別子 | `tasks.md` の `T001` 形式の ID | `/speckit-tasks` |
| 説明 | 同じ行の本文 | `/speckit-tasks` |
| 依存 | Phase の順序と、行内の「（T003 に依存）」記述 | `/speckit-tasks` |
| 並列可否 | 行頭の `[P]` マーカー | `/speckit-tasks` |
| 所属 | `[US1]` 等の User Story ラベル | `/speckit-tasks` |
| 担当 | `/batch` が割り当てる subagent | `/batch` |
| 作業領域 | `/batch` が作る git worktree | `/batch` |
| 通過条件 | 検査スクリプトと E2E の終了コード | `scripts/` ／ `templates/e2e/` |

**検証規則**: 並列可否 `[P]` が付いた作業単位どうしは、同じファイルを変更してはいけません。違反は worktree の統合時に衝突として現れます。

## 状態 (State)

| 状態 | 実体 |
|---|---|
| 未着手 | `tasks.md` の `- [ ]` |
| 実行中 | `/tasks` の背景作業一覧、`/workflows` の進行表示 |
| 成功 | 対応する pull request の CI が緑 |
| 失敗 | 対応する pull request の CI が赤 |
| 待機 | 依存元の作業単位が未完了 |
| 完了 | `tasks.md` の `- [X]`（`/speckit-implement` が付ける） |

**状態遷移**

```text
未着手 ──(担当が割り当てられる)──> 実行中
実行中 ──(検査がすべて緑)──> 成功 ──> 完了 (tasks.md が [X] になる)
実行中 ──(検査が1つでも赤)──> 失敗
失敗   ──(その単位だけを直して再実行)──> 実行中
未着手 ──(依存元が未完了)──> 待機 ──(依存元が完了)──> 未着手
```

**再実行の境界**: 失敗した単位は、その単位の pull request の中だけで直します。他の pull request には触れません。これが SC-001（成功済みの単位の作り直しが0件）の実装です。

## 証拠 (Evidence)

| 種類 | 実体 | 終了コード |
|---|---|---|
| 検査の無効化が無いこと | `scripts/check-test-integrity.sh` の出力 | 0 / 1 / 2 |
| 破滅的な脆弱性が無いこと | `scripts/check-catastrophic.sh` の出力 | 0 / 1 / 2 |
| 通し操作が動くこと | E2E（`templates/e2e/`）の結果 | 0 / 1 |

**規則**: この3つの終了コードだけが次の作業単位を解放します。AI の判断は解放条件になりません（SC-002）。

## 記録 (Run Record)

1回の実行につき1件。形式は [contracts/run-record.md](./contracts/run-record.md) に定義します。置き場所は `docs/measurements/` とします。

| 項目 | 単位 | 取得元 |
|---|---|---|
| 実行方式 | 単一AI / Graph | 記録時に人が書く |
| トークン消費 | 数 | `/usage`、`/workflows` の表示 |
| 所要時間 | 分 | 開始・完了の時刻 |
| 一発成功 | 是 / 否 | 再実行が0回だったか |
| 検査通過 | 是 / 否 | 上の3種がすべて緑か |
| 再実行回数 | 数 | 失敗した単位を直した回数 |
| 人の介入回数 | 数 | 依頼者が応答を求められた回数 |
| 既存の破壊 | 件数 | `check-test-integrity.sh` の検出件数 |
| コンテキスト量 | 数 | 各担当へ渡した資料の量 |
