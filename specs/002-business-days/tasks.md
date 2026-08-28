---

description: "Task list for 営業日を数えるコマンド"
---

# Tasks: 営業日を数えるコマンド

**Input**: Design documents from `/specs/002-business-days/`

**Prerequisites**: plan.md, spec.md

**Tests**: 単体テストを含めます。停止4領域（日付）を扱うため、想定外の値で止まることを機械で確かめる必要があります。

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 `sandbox/business-days/` に `package.json` と `package.json` のみ（tsconfig は不要） を作る（依存パッケージを追加しない。`node --test` を使う）

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: このフェーズが完了するまで User Story に着手できない

- [X] T002 `sandbox/business-days/src/types.js` に、年月日を表す型と結果の型を定義する

**Checkpoint**: 共通の型が揃い、独立した2単位を同時に実装できる

---

## Phase 3: User Story 2 - おかしな日付はその場で止まる (Priority: P1) 🎯 MVP

> **US2 を先に実装します。** 停止4領域の検査であり、これが無い状態で数える処理を作ると、誤った日数を正しい答えとして返す経路ができてしまいます。

**Goal**: 想定外の日付を、数える前に止める

**Independent Test**: 不正な日付を渡して終了コードを見るだけで検証できる

- [ ] T003 [P] [US2] `sandbox/business-days/src/parse-date.js` に、`YYYY-MM-DD` の検査と年月日への変換を実装する。書式違い・存在しない日付・年の範囲外を弾く（FR-004）
- [ ] T004 [P] [US2] `sandbox/business-days/src/holidays.js` に、休業日ファイルの読み込みを実装する。読めない行が1つでもあれば止める（FR-005）
- [ ] T005 [P] [US2] `sandbox/business-days/test/parse-date.test.js` を書く（`2026-02-30` / `2026/09/01` / `abc` / 空文字 / 年の範囲外）
- [ ] T006 [P] [US2] `sandbox/business-days/test/holidays.test.js` を書く（読めない行あり / ファイルなし / 重複あり / 期間外の日付あり）

**Checkpoint**: 想定外の値で止まることが単体テストで確認できる

---

## Phase 4: User Story 1 - 期間を渡すと営業日数が返る (Priority: P1)

**Goal**: 土日と休業日を除いた日数を返す

**Independent Test**: コマンドを1回実行し、標準出力の数値を確認する

- [ ] T007 [US1] `sandbox/business-days/src/count.js` に、両端を含む期間の営業日数を数える処理を実装する。土日と休業日を除く（FR-001 / FR-002 / FR-003）。T002 に依存
- [ ] T008 [US1] `sandbox/business-days/test/count.test.js` を書く（spec.md 第2節の3件と、期間外・重複の休業日）
- [ ] T009 [US1] `sandbox/business-days/src/cli.js` に、コマンドの入口を実装する。開始日が終了日より後なら止める（FR-004）。T003 / T004 / T007 に依存
- [ ] T010 [US1] `sandbox/business-days/acceptance.sh` を書き、spec.md 第2節の5件（US1 の3件と US2 の2件）をコマンド実行で確かめる。1件でも落ちたら終了コード `1`

**Checkpoint**: 検収条件5件がコマンド実行で確認できる

---

## Phase 5: Polish

- [ ] T011 `sandbox/business-days/README.md` に使い方を3行で書く
- [ ] T012 `acceptance.sh` と `node --test` の両方が緑になることを確認する

---

## Dependencies & Execution Order

- **Setup (Phase 1)**: 依存なし
- **Foundational (Phase 2)**: Setup 完了に依存。**すべての User Story をブロックする**
- **User Story 2 (Phase 3)**: Foundational 完了に依存
- **User Story 1 (Phase 4)**: T003 / T004（US2 の成果物）に依存
- **Polish (Phase 5)**: すべて完了に依存

### Parallel Opportunities

**独立した作業単位（同時に実装できる）**:

- **単位A**: T003 + T005（`parse-date.ts` と そのテスト）
- **単位B**: T004 + T006（`holidays.ts` と そのテスト）

この2つは別ファイルであり、互いに依存しません。案件001 の測定は、この2単位を別々の作業領域で同時に走らせて行います。

---

## Implementation Strategy

1. Phase 1 → Phase 2 を順に完了する
2. **単位A と 単位B を同時に実装する**（案件001 の測定対象）
3. Phase 4 を順に実装する
4. `acceptance.sh` で検収条件5件を確認する

### 中止条件

- 依存パッケージの追加が必要になったとき（plan.md の設計判断に反する）
- 1日で収まらないと判明したとき（Appetite。期間を延ばさず範囲を削る）
