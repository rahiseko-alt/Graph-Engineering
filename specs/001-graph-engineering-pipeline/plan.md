# Implementation Plan: 低トークン型 Graph の実行基盤を既存品で成立させる

**Branch**: `001-graph-engineering-pipeline` | **Date**: 2026-08-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-graph-engineering-pipeline/spec.md`

## Summary

1件の依頼を作業単位に分けて隔離・並列に実行し、機械が実行した検査の結果だけで次の単位を解放し、失敗した単位だけを直せる状態にします。そのうえで、同じ依頼を単一の AI に全部やらせた場合と比べられるよう、実行1回分の記録を残します。

**技術的な要点は「何を作るか」ではなく「何を作らないか」です。** 分解・隔離・並列・状態保持・再実行の境界は、すべて既存の公式部品が担います。この案件で新しく定義するのは、実行1回分の記録の形式1つだけです（[contracts/run-record.md](./contracts/run-record.md)）。

## Technical Context

**Language/Version**: 実行コードを新規に書かないため該当なし。既存の検査スクリプトは bash 3.2+

**Primary Dependencies**: GitHub Spec Kit（`specify-cli 1.0.1`、`/speckit-tasks`）／ Claude Code の `/batch`（worktree 隔離 subagent）／ git ／ 既存の `scripts/check-test-integrity.sh` と `scripts/check-catastrophic.sh`

**Storage**: 新規の保存先を作らない。状態は `tasks.md` のチェックボックス、git のブランチと pull request、CI の結果に持つ（[data-model.md](./data-model.md)）

**Testing**: `scripts/check-test-integrity.sh` ／ `scripts/check-catastrophic.sh` ／ `templates/e2e/` の受入検査

**Target Platform**: Linux（この作業環境）と GitHub Actions

**Project Type**: 開発工程そのもの。アプリケーションではない

**Performance Goals**: 速度目標は置かない。比較対象は「単一の AI に全部やらせた場合」であり、絶対値ではなく差分を見る

**Constraints**: 既存の公式部品の組み合わせで成立する範囲まで。成立しない箇所が出たら自作せずに止めて報告する（spec.md の Appetite）

**Scale/Scope**: 1件の依頼を成立させることだけ。`/batch` が扱う5〜30単位の範囲内

## Constitution Check

*GATE: Phase 0 の前に通し、Phase 1 の設計後に再確認する。*

| 原則 | 判定 | 根拠 |
|---|---|---|
| I. 採用手法の順序を守る | **PASS** | ①〜④は spec.md で実施済み。⑤は `/speckit-tasks`、⑥は `/batch` を使う。新しい概念・名称・指標を足していない |
| II. 着手判定は4項目のみ | **未達（想定どおり）** | Critical Assumptions 4件が未確認のため `critical assumptions checked` が未チェック。**この状態で `/speckit-implement` を起動すれば着手前に停止する。** これは違反ではなく、設計どおりの動作 |
| III. 検収条件はそのまま E2E のハッピーパス | **PASS** | spec.md 第2節の Acceptance Scenarios を [quickstart.md](./quickstart.md) の検証手順へ対応させた |
| IV. 停止4領域 | **PASS** | spec.md 第4節に4領域を記載。該当は「データの削除・上書き」のみ。保護対象ルートは `- NONE`（画面を持たないため） |
| V. 利用者への確認は二択1回 | **PASS** | 門①を1回実施し「そう」を得た。以降の確認は、着手判定で停止したときの続行可否のみ |

**Phase 1 設計後の再確認**: 上記から変化なし。Phase 1 で新しく作ったのは記録の形式1つで、原則 I の「独自指標を作らない」に抵触しないことを確認済み（指標そのものは添付レポート第29節の一覧をそのまま使用）。

### Complexity Tracking

| 逸脱 | なぜ必要か | 却下した簡単な案 |
|---|---|---|
| 記録の形式を1つ新規に定義する | 比較のためには、2回の実行で同じ項目を同じ形で残す必要がある。既存の公式部品に「実行1回分の指標記録」に相当するものが無い | 指標を記録せずに進める案。SC-003 が達成できず、レポートが指摘した「有効そう」と「実証済み」の区別が付かないままになるため却下 |

## Project Structure

### Documentation (this feature)

```text
specs/001-graph-engineering-pipeline/
├── spec.md              # 確定済み（門① 2026-08-28 通過）
├── plan.md              # このファイル
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   └── run-record.md    # Phase 1 — この案件で唯一の新規の取り決め
├── checklists/
│   ├── requirements.md  # 仕様の品質
│   └── shaped.md        # 着手判定4項目
└── tasks.md             # /speckit-tasks が生成する（未生成）
```

### Source Code (repository root)

実行コードを新規に書かないため、新しいソースツリーを作りません。触れる可能性があるのは既存の次だけです。

```text
scripts/
├── check-test-integrity.sh   # 既存。変更しない（検査を弱める変更は禁止）
└── check-catastrophic.sh     # 既存。変更しない
templates/
├── e2e/                      # 既存。案件側へ複写して使う
└── ci/acceptance.yml         # 既存。案件側へ複写して使う
docs/
└── measurements/             # 新規。実行1回分の記録の置き場所（データのみ）
```

## 実行の流れ

```text
依頼1文
   │
   ├─ /speckit-specify → /speckit-clarify → 門①（二択1回）      … 済
   ├─ /speckit-plan                                              … このファイル
   ├─ Critical Assumption の確認（CA-001 / 002 / 004）           … 次にやること
   ├─ 着手判定（shaped.md の4項目）                              … 上の確認が済むまで未チェック
   ├─ /speckit-tasks → /speckit-analyze
   ├─ /batch で実行（単位ごとに worktree 隔離、単位ごとに PR）
   │     └─ 各単位: 実装 → 検査3種 → 緑なら次を解放 / 赤ならその単位だけ直す
   ├─ 記録を2件そろえる（single と graph）
   └─ 門②（別AI・7問）
```

## 次のフェーズの入口

`/speckit-tasks` を実行して `tasks.md` を生成します。ただし **`/speckit-implement` は着手判定が緑になるまで着手しません。** 現在 Critical Assumptions が4件とも未確認のため、起動すれば着手前に停止します。
