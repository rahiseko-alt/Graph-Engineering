---

description: "Task list for 低トークン型 Graph の実行基盤を既存品で成立させる"
---

# Tasks: 低トークン型 Graph の実行基盤を既存品で成立させる

**Input**: Design documents from `/specs/001-graph-engineering-pipeline/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: 受入検査は既存の検査スクリプト2本と E2E 雛形を使います。新しいテストコードは書きません（spec.md の No Gos「実行基盤の自作」に該当するため）。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可（別ファイル、未完了タスクへの依存なし）
- **[Story]**: US1 / US2 / US3

---

## Phase 1: Setup

**Purpose**: 記録の置き場所と、比較に使う対象を決める

- [ ] T001 記録の置き場所 `docs/measurements/` を作り、`docs/measurements/README.md` に `specs/001-graph-engineering-pipeline/contracts/run-record.md` への参照を書く
- [ ] T002 比較に使う対象を1件決め、`docs/measurements/README.md` に対象名と依頼文1文を記録する。**条件**: このリポジトリ外の成果物であること（工程で工程を作らない）、`/speckit-tasks` の出力が10単位以内に収まる見込みであること、`[P]` の独立作業が2つ以上見込めること。決めた対象名で、`tasks.md` 内の `<対象名>` を全件置換する

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: このフェーズが完了するまで、どの User Story にも着手できない

- [ ] T003 T002 で決めた対象について `/speckit-specify` → `/speckit-clarify` を実行し、`specs/002-<対象名>/spec.md` を作る
- [ ] T004 T003 の spec に対して門①（`prompts/intent-backtranslator.md`）を**別エージェント**で回し、二択1回で確定させる。**この二択は、この案件（001）の門①とは別の1回である。** 依頼者から見た応答回数は通算2回になるため、`docs/measurements/README.md` にその事実を記録し、隠さない
- [ ] T005 `/speckit-plan` を実行し、`specs/002-<対象名>/plan.md` を作る
- [ ] T006 `templates/checklists/shaped.md` を `specs/002-<対象名>/checklists/shaped.md` へ複写し、4項目を判定する
- [ ] T007 `/speckit-tasks` を実行し、`specs/002-<対象名>/tasks.md` に `[P]` の付いた独立作業が2つ以上あることを確認する（無ければ対象を選び直す）

**Checkpoint**: 対象が着手可能な状態になり、独立した作業単位が2つ以上ある

---

## Phase 3: User Story 1 - 失敗した場所だけを直せる (Priority: P1) 🎯 MVP

**Goal**: 1単位の失敗で全体が作り直しにならない状態を、実際の実行で成立させる

**Independent Test**: 1単位だけを落とし、その単位だけを直して緑にできるかで検証できる（quickstart.md 検証1）

- [ ] T008 [US1] `/batch` で `specs/002-<対象名>/tasks.md` を実行し、作業単位ごとに worktree 隔離された pull request が開くことを確認する
- [ ] T009 [P] [US1] 開いた pull request の一覧と、各 pull request が担当する作業単位の対応を `docs/measurements/<対象名>-graph.md` に記録する
- [ ] T010 [US1] 1つの pull request の検査だけを意図的に落とし、他の pull request が緑のままであることを確認する（赤）
- [ ] T011 [US1] 落ちた pull request の中だけを直して緑にする（緑）
- [ ] T012 [US1] 緑だった pull request のコミット数が変化していないことを確認し、作り直し0件を `docs/measurements/<対象名>-graph.md` に記録する（SC-001）
- [ ] T013 [US1] T010 と同じ壊し方をもう一度行い、同一のエラーで落ちることを確認する（戻して赤）
- [ ] T014 [P] [US1] 同時に実行した作業単位の間で衝突が0件であることを確認し、記録する（SC-004）
- [ ] T015 [US1] 実行を途中で止めて再開し、成功済みの作業単位が再実行されないことを確認して記録する（SC-005）
- [ ] T015b [P] [US1] `data-model.md` の状態対応表（未着手 / 実行中 / 成功 / 失敗 / 待機 / 完了）が実際にそのとおり読み取れるかを1単位ずつ照合し、読み取れない状態があれば記録する（FR-004）

**Checkpoint**: 失敗の局所化が、実際の実行で成立している

---

## Phase 4: User Story 2 - 機械が判定できることに AI を使わない (Priority: P1)

**Goal**: 次工程を解放した判定に、AI の推論が1件も混じっていない状態にする

**Independent Test**: 解放の根拠をすべて列挙し、その出どころを確認するだけで検証できる（quickstart.md 検証3）

- [ ] T016 [US2] Phase 3 の実行中に、次の作業単位が解放された箇所をすべて列挙する
- [ ] T017 [US2] 各解放の根拠が `scripts/check-test-integrity.sh` / `scripts/check-catastrophic.sh` / E2E の終了コードであることを確認し、AI の判断を根拠にした解放が0件であることを `docs/measurements/<対象名>-graph.md` に記録する（SC-002）
- [ ] T018 [P] [US2] 対象の pull request に `templates/ci/acceptance.yml` を複写し、3種の検査が CI で実行されることを確認する
- [ ] T018b [US2] 意味的なレビュー（門②・独立レビュー）が、機械の検査3種が緑になった**後**にだけ実行されていることを、実行の時系列で確認して記録する。機械の検査より前に意味的レビューが走っていた場合は、その事実を記録して順序を直す（FR-006）

**Checkpoint**: 解放の判定に AI が入っていないことが記録されている

---

## Phase 5: User Story 3 - 単一の AI に全部やらせた場合と比べられる (Priority: P1)

**Goal**: 「有効そう」を「実際にこうだった」に変える

**Independent Test**: 同じ対象の記録が2件揃うかで検証できる（quickstart.md 検証4）

- [ ] T019 [US3] 同じ対象を、単一の AI に全部やらせる方法で1回実行する
- [ ] T020 [P] [US3] `contracts/run-record.md` の形式で `docs/measurements/<対象名>-single.md` を書く
- [ ] T021 [P] [US3] 同じ形式で `docs/measurements/<対象名>-graph.md` を完成させる
- [ ] T022 [US3] 2件を指標ごとに並べた比較を `docs/measurements/README.md` に追記する（SC-003）。取得できなかった項目は「取得できず」と理由を書き、空欄のままにしない

**Checkpoint**: 3つの User Story がすべて独立に検証できている

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T023 実測で分かった事実を `docs/design.md` 第4節に日付つきで追記する
- [ ] T024 `docs/handoff.md` を更新する
- [ ] T025 門②（`prompts/drift-detector.md`）を**作業していない別エージェント**で回し、「はい」が出た項目をこのセッション内で直すか、直さない理由を記録する

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 依存なし
- **Foundational (Phase 2)**: Setup 完了に依存。**すべての User Story をブロックする**
- **User Story 1 (Phase 3)**: Foundational 完了に依存
- **User Story 2 (Phase 4)**: Phase 3 の実行を観測するため、Phase 3 と同時に進む
- **User Story 3 (Phase 5)**: Phase 3 の記録が必要なため、Phase 3 完了に依存
- **Polish (Phase 6)**: すべての User Story 完了に依存

### Within Each User Story

- 赤（T010）→ 緑（T011）→ 戻して赤（T013）の順序を崩さない。緑を先に作ると、直したものしか捕まえられない検査になる
- 記録（T009 / T012 / T014）は、観測した直後に書く。後からまとめて書かない

### Parallel Opportunities

- T009 / T014 は [P]（記録の書き込み。実行そのものには干渉しない）
- T018 は [P]（CI 設定の複写）
- T020 / T021 は [P]（別ファイルへの記録）
- **Phase 3 と Phase 4 は同時に進められる**（Phase 4 は Phase 3 の観測であり、新しい実行を起こさない）

---

## Implementation Strategy

### MVP First (User Story 1 のみ)

1. Phase 1（Setup）を完了する
2. Phase 2（Foundational）を完了する — ここが全体をブロックする
3. Phase 3（User Story 1）を完了する
4. **止まって確認する**: 失敗の局所化が成立したか
5. 成立していれば Phase 4 / 5 へ進む。成立していなければ CA-002 が偽であり、**実装を続けず spec.md へ戻る**

### 中止条件

次のいずれかに当たったら、実装を続けずに止めて報告します（spec.md の Appetite）。

- 既存の公式部品の組み合わせでは成立せず、実行基盤の自作が必要になったとき
- 依頼者への確認が、門①の二択1回のほかに必要になったとき
- 2週間で通し切れないと判明したとき（期間を延ばさず、扱う範囲を削る）
