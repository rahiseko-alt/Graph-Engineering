# Product Design Document (docs/design.md)

恒久的な設計ドキュメント。**何を作るか**は [`spec.md`](../spec.md) に、**揮発的な作業状態**は [`docs/handoff.md`](./handoff.md) に書きます。ここには「今どうなっているか」だけを書きます。

---

## 1. アーキテクチャ概要

*(未記入)*

## 2. 技術構成

技術選定に特段の指定がない場合は、[`AGENTS.md`](../AGENTS.md) LEVEL B のデフォルト構成に従います。この案件で採用した構成を確定後にここへ書きます。

*(未記入)*

## 3. データモデル / 主要インターフェース

*(未記入)*

## 4. 調査で確定した事実 (Established Facts)

> 探索フェーズで確定した技術的制約や決定事項を、日付付きで箇条書きにします。

### 2026-08-28 採用手法を既存品に固定した

Goal Shaping の調査（`Graph Engineering Goal Shaping 中間理論レポート` 2026-08-28）を打ち切り、**新しい概念を作らず既存手法の組み合わせで運用する**方針に決定した。理由は「70点の既存品は検証と修正ができるが、独創は検証で詰まる」。

採用構成は次の6段で固定する。

| 段 | 手法 | 一次資料 |
|---|---|---|
| ① | Opportunity Solution Tree（Desired Outcome / Opportunities / Solutions / Assumption Tests） | https://www.producttalk.org/opportunity-solution-trees/ |
| ② | Shape Up の Pitch（Problem / Appetite / Solution / Rabbit Holes / No Gos）と rough / solved / bounded | https://basecamp.com/shapeup/1.5-chapter-06 ／ https://basecamp.com/shapeup/1.1-chapter-02 ／ https://basecamp.com/shapeup/1.2-chapter-03 |
| ③ | Lean Startup（Critical Assumption だけ Evidence で確認する） | https://leanstartup.co/wp-content/uploads/2023/06/ebook-NavigatingSquiggles-Final_61523.pdf |
| ④ | NASA の原則1つ（検証していない要求を Logical Decomposition へ渡さない） | https://www.nasa.gov/reference/4-3-logical-decomposition/ |
| ⑤ | Logical Decomposition / Issue 分解 | Spec Kit `/speckit-tasks` |
| ⑥ | Graph（依存・並列・Agent・検証・再実行） | 次フェーズ。未着手 |

**作らないと決めたもの**: 独自の Risk taxonomy、Goal Contract、Invalidation Depth、数値スコア、追加の Hard Gate、自作の Issue Tree、自作の着手判定スクリプト。

### 2026-08-28 GitHub Spec Kit を導入した（実測値）

- バージョン `specify-cli 1.0.1`。PyPI から `uv tool install specify-cli` で導入。この環境では GitHub 直アクセスは 403 だが、PyPI はプロキシの `noProxy` に含まれるため成功した。`specify init` 自体はテンプレートを同梱しており**ネットワークを必要としない**。
- `specify init --here --force --integration claude` と `--integration codex` を本リポジトリで実行した結果、**追跡ファイルの変更は0件**。追加されたのは `.claude/skills/speckit-*`（Claude 用）、`.agents/skills/speckit-*`（Codex 用）、`.specify/` のみ。`AGENTS.md` / `README.md` / `spec.md` は書き換えられない。
- テンプレートの解決順は `.specify/templates/overrides/` → presets → extensions → core（`.specify/scripts/bash/common.sh` の `resolve_template_content`）。**overrides は完全置換**である。本リポジトリは `overrides/spec-template.md` を置いた。
- `/speckit-implement` は `specs/<feature>/checklists/*.md` の `- [ ]` を数え、1件でも残っていれば着手前に停止して続行可否を訊く（`.claude/skills/speckit-implement/SKILL.md` 手順2）。マーカーを書き換えない。**これが④の実装であり、自作スクリプトを書かない根拠**である。

### 2026-08-28 既存2検査との接続（変更してはいけない制約）

- `scripts/check-test-integrity.sh` の T5 は `^## 2[.．]` の節に含まれる Given / When / Then の行数を、`scripts/check-catastrophic.sh` の C3 は `^## 4[.．]` の節の「保護対象ルート一覧」を読む。どちらも次の `#` または `##` 見出しで打ち切る。**`###` は打ち切りに掛からない。**
- したがって仕様の雛形は `## 2.` と `## 4.` の2つの節番号を保持する。実測で C3 は `- NONE` を SKIP、ルート宣言時は未保護を ERROR にし、T5 は Given / When / Then の減少（5行→4行）を検出した。
- **既知の一度きりの反応**: Spec Kit のベンダーコード `.specify/scripts/bash/create-new-feature.sh` に `# shellcheck disable=SC2071` が1行あり、これを取り込むコミットで T3（行内免除の増加）が1件出る。検査を弱める対処は取らない（LEVEL A-4）。実測で、取り込みの次のコミットでは再発しないことを確認済み。

### 2026-08-28 ルート `spec.md` の扱い

Spec Kit 導入後の案件は `specs/<feature>/spec.md` を使う。ルートの `spec.md` は旧形式の雛形として**そのまま残す**。削除すると T5 が「spec.md が削除された」として ERROR を出すため、検査を通すために消すという判断はしない。
