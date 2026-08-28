# Phase 0: Research — 低トークン型 Graph の実行基盤

**Date**: 2026-08-28
**Spec**: [spec.md](./spec.md)

調査の目的は1つだけです。**spec.md の Appetite（既存の公式部品の組み合わせで成立する範囲まで）が実際に成立するか**を、一次資料で確かめること。

出典はすべて 2026-08-28 に取得した公式ドキュメントです。

- https://code.claude.com/docs/en/agents
- https://code.claude.com/docs/en/workflows
- https://github.com/github/spec-kit ／ https://github.github.io/spec-kit/reference/agentic-sdd.html

---

## 決定1: 作業単位と依存関係の表現 — `/speckit-tasks` の `tasks.md` をそのまま使う

**Decision**: 自作の Task Graph 形式を定義せず、`/speckit-tasks` が生成する `tasks.md` を作業単位の表現として使う。

**Rationale**: `tasks.md` は Phase 分割、依存順、並列マーカー `[P]`、User Story 単位のまとまり、`[ID]` を既に持つ。spec.md の FR-001（依存関係と並列可否を持つ作業単位の集合）を追加実装なしで満たす。

**Alternatives considered**: 独自の Node/Edge スキーマ（JSON / YAML）。No Gos の「実行基盤の自作」に該当するため不採用。

---

## 決定2: 作業領域の分離 — `/batch` の worktree 隔離を使う

**Decision**: 独立した作業単位の同時実行には `/batch` を使う。

**Rationale**: 公式ドキュメントは `/batch` を「1つの大きな変更を5〜30の worktree 隔離 subagent へ割り、それぞれが pull request を開く skill」と定義し、「subagent と worktree の**組み合わせの既製品**であり、別の協調方式ではない」と明記している。FR-002（互いの変更が衝突しない同時実行）を追加実装なしで満たす。

**Alternatives considered**:

- **Agent teams**: 公式に experimental かつ既定で無効。さらに「teammate は worktree 隔離されない」ため、担当ファイルの分割を人が守る前提になる。spec.md の SC-004（衝突0件）を機械で保証できないため不採用。
- **Agent view (`claude agents`)**: 各セッションを自動で worktree へ入れるが research preview であり、依頼を人が手で配る前提。今回の対象外。

---

## 決定3（最重要）: 局所再実行 — dynamic workflow の resume では成立しない。`/batch` の PR 単位で成立する

**Decision**: 「失敗した単位だけを再実行する」は、**`/batch` が単位ごとに開く pull request** を再実行の境界として実現する。dynamic workflow の resume には依存しない。

**Rationale**: これは今回の調査で出た、判断を変える事実である。公式ドキュメントの resume 仕様は次のとおり。

> **Failed**: runs again, and so does every agent that started after it, even ones that completed.
> （中略）If a script starts A, B, C, and D in that order and B fails, relaunching returns A from cache and runs B, C, and D again.

つまり **dynamic workflow の途中で1つ失敗すると、その後に始まった成功済みの agent まで再実行される。** これは spec.md の SC-001（成功済みの単位の作り直しが0件）を満たさない。

一方 `/batch` は単位ごとに pull request を開くため、失敗は「その PR が赤い」という形で残り、他の PR は緑のまま独立して存在する。赤い PR だけを直せばよく、緑の PR は作り直されない。**再実行の境界と状態の保持を、git と pull request という既存の仕組みが担う。**

**Alternatives considered**: dynamic workflow の resume に局所再実行を期待する案。上記の公式仕様により、SC-001 を満たさないため不採用。ただし dynamic workflow は「多数の対象へ同じ処理を掛ける」「結果を相互検証する」用途では引き続き有効であり、そちらでは使う。

---

## 決定4: 実行状態の保持 — 新しい保存先を作らない

**Decision**: 状態（未着手 / 実行中 / 成功 / 失敗 / 待機）は次の既存物に持たせる。

| 状態 | どこに持つか |
|---|---|
| 未着手 / 完了 | `tasks.md` のチェックボックス（`/speckit-implement` が完了した項目を `[X]` にする） |
| 実行中 | `/tasks`（現在のセッションの背景作業一覧）と `/workflows` |
| 成功 / 失敗 | 各 pull request の CI の色 |
| 待機（依存待ち） | `tasks.md` の Phase 順と依存記述 |

**Rationale**: FR-004 を満たすのに新しい保存先が要らない。状態機械の自作は No Gos。

**Alternatives considered**: 独自の state ファイル（JSON）。No Gos に該当。加えて、真の状態は git と CI にあるため、二重管理になる。

---

## 決定5: 次工程を解放する判定 — 既存の検査スクリプトと E2E のみ

**Decision**: 解放の判定は `scripts/check-test-integrity.sh` → `scripts/check-catastrophic.sh` → E2E の終了コードで行う。AI の推論を判定に置かない。

**Rationale**: FR-003 と SC-002（AI の推論による解放0件）。3つとも終了コードを返すため機械判定できる。CI 雛形 `templates/ci/acceptance.yml` が既にこの順で実行する。

**Alternatives considered**: LLM レビュアーを解放条件に含める案。FR-006 のとおり、意味的レビューは**機械の検査を通過した後**にだけ置く。解放条件にはしない。

---

## 決定6: 測定 — レポートが挙げた指標をそのまま使う

**Decision**: 追加の指標を考案せず、添付レポート第29節の一覧をそのまま記録する。トークン消費 / 所要時間 / 一発成功率 / 検査通過 / 再実行回数 / 人の介入回数 / 既存の破壊 / コンテキスト量。

**Rationale**: SC-003。独自指標の考案は No Gos。

**取得元（実測に使う手段）**:

- トークン消費: `/usage`、および `/workflows` の各 agent のトークン表示
- 所要時間: 各 pull request の CI 実行時間と、作業開始・完了の記録
- 人の介入回数: このリポジトリの規約上、門①の二択1回が基準値
- 再実行回数: 各 pull request のコミット数と CI の再実行回数
- 既存の破壊: `scripts/check-test-integrity.sh` の検出件数

**未解決**: トークン消費を「単位ごと」に機械で取得する手段は公式には示されていない。**手作業での転記になる。** これは spec.md の Rabbit Holes に該当し、実測時に判明した実際の手間を記録する。

---

## 未解決のまま Delivery へ残すもの

| 事項 | なぜ残してよいか |
|---|---|
| トークン消費の単位ごとの自動取得 | 手で転記しても比較はできる。自動化は Solution の成立に必須ではない |
| 画面を持たない対象での「動いた事実」の形 | 検査スクリプトの終了コードと出力で示せる見込み。実測で確かめる |
| `/batch` が扱える単位数（5〜30）を超えた場合の扱い | 今回は1件を成立させることだけを扱う（No Gos） |

## 未解決だが Delivery へ渡してはいけないもの

**CA-001 / CA-002 / CA-004 は着手前に Evidence が要る。** 上の決定2・3・4は公式ドキュメントの記述に基づく設計判断であり、**実際に動かした事実ではない。** 特に決定3は、公式仕様を読んで方式を1つ捨てた判断であり、選んだ側（`/batch` の PR 単位）が実際に機能するかはまだ確かめていない。
