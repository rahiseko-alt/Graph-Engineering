# Implementation Plan: 営業日を数えるコマンド

**Branch**: `002-business-days` | **Date**: 2026-08-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-business-days/spec.md`

## Summary

開始日と終了日、および休業日の一覧を受け取り、土日と休業日を除いた日数を標準出力へ1行で出すコマンドを作ります。想定外の日付は数えずに終了コード `1` で停止します。

## Technical Context

**Language/Version**: JavaScript (ESM) / Node.js v22

> **改訂 2026-08-28**: 当初 TypeScript (strict) と書いたが、依存パッケージを追加しない方針と両立しない。型検査を行うには `typescript` の導入が必要で、導入しなければ型注釈は機械検査の役に立たない。`AGENTS.md` LEVEL B のデフォルト構成は「特段の指定がない場合」の既定であり、ここでは Appetite（1日）と「依存を増やさない」判断が優先する。**したがって言語を JavaScript (ESM) に改訂する。** 型に頼らない代わり、想定外の値の検査（停止4領域）を単体テストで直接確かめる。

**Primary Dependencies**: **なし。** Node.js の標準機能のみ。テストは Node 標準の `node:test` を使う

**Storage**: なし。休業日ファイルを読むだけ

**Testing**: `node --test`（単体）／ 受入検査はコマンドを実際に実行して標準出力と終了コードを見る

**Target Platform**: Linux（この作業環境）

**Project Type**: コマンドラインツール

**Performance Goals**: 1年以内の期間で1秒以内（SC-003）

**Constraints**: 依存パッケージを追加しない。画面・API を作らない（No Gos）

**Scale/Scope**: 1コマンド、5ファイル以内

## Constitution Check

| 原則 | 判定 | 根拠 |
|---|---|---|
| I. 採用手法の順序 | **PASS** | ①〜④を spec.md で実施。⑤は `/speckit-tasks`、⑥は単位ごとの pull request |
| II. 着手判定4項目 | **PASS 見込み** | CA-001 が確認済のため `critical assumptions checked` を満たす |
| III. 検収条件が E2E のハッピーパス | **PASS** | spec.md 第2節の5件が、そのままコマンド実行の検査になる |
| IV. 停止4領域 | **PASS** | 「日付」が該当。想定外の日付で停止する挙動を FR-004 / FR-005 に明記 |
| V. 確認は二択1回 | **PASS** | この案件の依頼者は工程側。外部の依頼者へ確認を出していない |

## Project Structure

### Documentation (this feature)

```text
specs/002-business-days/
├── spec.md          # 確定済み
├── plan.md          # このファイル
├── checklists/
│   └── shaped.md
└── tasks.md         # /speckit-tasks が生成
```

### Source Code (repository root)

```text
sandbox/business-days/
├── src/
│   ├── parse-date.ts    # 日付の検査（停止4領域「日付」）
│   ├── holidays.ts      # 休業日ファイルの読み込みと検査
│   ├── count.ts         # 営業日を数える
│   └── cli.ts           # コマンドの入口
├── test/
│   ├── parse-date.test.ts
│   ├── holidays.test.ts
│   └── count.test.ts
├── acceptance.sh        # spec.md 第2節の5件をコマンド実行で確かめる
├── package.json
└── tsconfig.json
```

## 設計判断

| 判断 | 理由 | 却下した案 |
|---|---|---|
| 依存パッケージを追加しない | Appetite が1日。日付の計算は標準機能で足りる | date-fns / dayjs の導入。1コマンドのために依存を増やす理由がない |
| テストは `node:test` | 追加依存なしで単体テストが書ける | Vitest。設定と依存が増える |
| `parse-date` と `holidays` を別ファイルに分ける | この2つは互いに独立しており、**同時に実装できる**。案件001 の測定に必要な「独立した作業単位が2つ以上」を満たす | 1ファイルにまとめる案。独立作業が作れず、測定の対象にならない |
| 日付は `Date` を使わず年月日の数値で扱う | タイムゾーンによるずれを避ける。No Gos で時刻を扱わないと決めている | `Date` を使う案。UTC とローカルの差で1日ずれる事故が起きやすい |

## 実行の流れ

```text
/speckit-tasks で分解
   ↓
独立した2単位（parse-date / holidays）を別々の作業領域で同時に実装
   ↓
count → cli の順に実装（上の2つに依存）
   ↓
acceptance.sh で spec.md 第2節の5件を確認
   ↓
単位ごとの pull request → 検査 → 統合
```
