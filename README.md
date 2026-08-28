# 案件テンプレート

受注1件のアプリ・システムを、AIエージェント（Claude / Codex / Antigravity）で作り切るためのテンプレートです。

## 最初にやること

工程は [GitHub Spec Kit](https://github.com/github/spec-kit)（公式 OSS）に載せます。**自作の要件定義手順・Issue 分解は使いません。** 手順は `project-spec` スキルが持っています。

| 順 | 実行するもの | 何が起きるか |
|---|---|---|
| 1 | `/speckit-specify` | 仕様のドラフト。雛形は `.specify/templates/overrides/spec-template.md` |
| 2 | `/speckit-clarify` | 未特定箇所（`[NEEDS CLARIFICATION]`）を潰す |
| 3 | **門①** [`prompts/intent-backtranslator.md`](./prompts/intent-backtranslator.md) | 別AIが1文に戻し、**利用者は「そう／違う」の二択1回だけ**答える |
| 4 | `/speckit-plan` | 設計 |
| 5 | `/speckit-checklist` | 着手判定。[`templates/checklists/shaped.md`](./templates/checklists/shaped.md) を写す |
| 6 | `/speckit-tasks` → `/speckit-analyze` | 分解と整合検査 |
| 7 | `/speckit-implement` | 実装。**5 に未チェックが残っていると着手前に止まります** |
| 8 | 検収条件を [`templates/e2e/`](./templates/e2e/README.md) へ転写 | 検収条件がそのまま E2E のハッピーパスになります |
| 9 | **門②** [`prompts/drift-detector.md`](./prompts/drift-detector.md) | 別AIが7問でずれを検知する |

**7 の実行方法**は3択です。既定は `/speckit-implement`（逐次）。独立作業がまとまってあるときは `/batch`（作業を worktree で隔離し、単位ごとに PR を出す）。多数の対象へ同じ処理を掛けるときや結果を相互検証させたいときは dynamic workflow。Agent teams と自作の実行基盤は使いません（理由は [`docs/design.md`](./docs/design.md) 第4節）。

仕様の書き方は既存手法の語をそのまま使います。**Problem / Appetite / Solution / Rabbit Holes / No Gos**（Shape Up）と **Desired Outcome / Opportunities / Solutions / Assumption Tests**（Opportunity Solution Tree）です。独自の名称・独自の指標を作りません。

## 中身

| 場所 | 何か |
|---|---|
| [`AGENTS.md`](./AGENTS.md) | **ルールの正はこの1ファイルだけ。** 全AIが従う |
| [`.specify/`](./.specify/) | Spec Kit 本体。`memory/constitution.md` に実行時の原則、`templates/overrides/` に仕様の雛形 |
| [`spec.md`](./spec.md) | 旧・単一仕様の雛形（Spec Kit 導入前の形。案件では `specs/<feature>/spec.md` を使う） |
| `.agents/skills/` / `.claude/skills/` | セッションの開始/終了、spec の作り方、計画の立て方、失敗照合、および `speckit-*` |
| `prompts/` | 別AIに実行させる検査（ずれ検知の門2つ、反証、受け入れ条件設計、独立レビュー） |
| `scripts/` | テスト無効化の検出 / 破滅的な脆弱性の検査（4種） |
| `templates/` | E2E テストと CI の雛形 |
| `docs/` | 引き継ぎ / 設計 / 失敗記録 |

## この仕組みの要点

- **門は2つ。** 着手前に「依頼を1文に戻して確認」、変更完了直後に「7問のずれ検知」。どちらも**作業した当のAIには実行させません**。
- **検収条件がそのままテストになります。** 要件定義の成果物とテストの成果物が同じ1個になります。
- **検査は無効化できません。** テストを弱める差分（skip の追加、除外リストへの項目追加など）を機械的に検出します。
