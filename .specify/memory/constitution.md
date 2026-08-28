# 案件テンプレート Constitution

> **ルールの正は [`AGENTS.md`](../../AGENTS.md) 1ファイルだけです（D-7）。** ここに書くのは、Spec Kit の
> `/speckit-*` が実行時に従う必要のある最小限の原則だけです。`AGENTS.md` の本文を複写しません。
> 食い違いが出た場合は `AGENTS.md` が優先します。

## Core Principles

### I. 採用手法の順序を守る (NON-NEGOTIABLE)

既存手法のみを使い、新しい概念・独自の名称・独自の指標を作りません。順序は次で固定します。

1. **Opportunity Solution Tree** — Desired Outcome / Opportunities / Solutions / Assumption Tests を分離する。利用者が Solution を Goal として話している可能性を先に潰す。
2. **Shape Up** — Problem / Appetite / Solution / Rabbit Holes / No Gos を書く。
3. **Lean Startup** — Critical Assumption だけ Evidence で確認する。残りは実装中に解く。
4. **NASA の原則** — 検証していない要求を Logical Decomposition へ渡さない。
5. **Logical Decomposition** — `/speckit-tasks` が行う。Issue Tree を自作しない。
6. **Graph** — `tasks.md` が Graph そのもの。実行は既定で `/speckit-implement`、独立作業がまとまってあるときは `/batch`（worktree 隔離・Node ごとに PR）、多数の対象や相互検証が要るときは dynamic workflow。**Agent teams と自作の Orchestrator は使わない**（理由は [`docs/design.md`](../../docs/design.md) 第4節）。

### II. 着手判定は4項目のみ

`/speckit-implement` へ進んでよいのは次がすべて満たされたときだけです。独自スコア・数値閾値・追加のゲートを作りません。

- **rough** — 細部を作り込んでいない（Shape Up）
- **solved** — macro level で主要要素がつながり、明白な Open Question と Rabbit Hole を減らしている（Shape Up）
- **bounded** — 何をしないか、どこで止めるかが分かる（Shape Up / No Gos）
- **critical assumptions checked** — 「これが偽ならこの Solution を作る意味が無くなるか」が YES の Assumption について Evidence がある（Lean Startup）

この4項目は `specs/<feature>/checklists/shaped.md` に置きます。雛形は [`templates/checklists/shaped.md`](../../templates/checklists/shaped.md) です。`/speckit-implement` は未チェック項目を読み取って着手前に止まります。

### III. 検収条件はそのまま E2E のハッピーパスになる

`spec.md` の Acceptance Scenarios（Given / When / Then）は、[`templates/e2e/`](../../templates/e2e/README.md) の雛形へそのまま転写します。要約・言い換えをしません。要件定義の成果物とテストの成果物を同じ1個にします。

### IV. 停止4領域では想定外の値を返さずその場で停止する

**金額 / 日付 / 権限 / データの削除・上書き** の4領域のみが対象です。それ以外は「動けばよい」とします。`spec.md` の該当節に、この4領域の所在と「保護対象ルート一覧」を書きます。一覧は `scripts/check-catastrophic.sh` が入力として読むため、1行1ルートの形式を守ります。該当が無い場合は `- NONE` の1行だけを書きます。

### V. 利用者への確認は二択1回だけ

案件を通じて利用者に投げてよい確認は、門①（`prompts/intent-backtranslator.md`）の「そう／違う」1回だけです。ヒアリング・追加質問・技術的な選択肢の提示はいずれもこれに違反します。人間の関与が案件数に比例する設計を採りません。

例外は2つです。(a) 手が実際に止まったとき。(b) `/speckit-implement` が上記 II の未チェックを検出して止まったとき——これは残余 Risk を受容して Build へ進むかどうかの判断であり、Shape Up・Lean Startup・Opportunity Solution Tree のいずれもこれを人間の Bet として扱っています。

## 既存手法をそのまま使う

- 用語は一次資料の語をそのまま使います。日本語へ言い換えた独自語を作りません（`Problem` / `Appetite` / `Solution` / `Rabbit Holes` / `No Gos` / `Desired Outcome` / `Opportunities` / `Assumption Tests`）。
- 手法同士に隙間があっても、まずこの構成で運用します。実際に問題が起きた箇所だけ、その時点で既存手法から補います。
- 独自の Risk taxonomy、Goal Contract、Invalidation Depth、数値スコア、追加の Hard Gate は作りません。

## Development Workflow

| 順 | 何をするか | 実行するもの |
|---|---|---|
| 1 | 原則の確認 | この Constitution |
| 2 | 仕様を書く | `/speckit-specify`（雛形は `.specify/templates/overrides/spec-template.md`） |
| 3 | 曖昧さを潰す | `/speckit-clarify` |
| 4 | **門①**（新しいゴールを決めるとき1回だけ） | `prompts/intent-backtranslator.md`（**別AI・フレッシュコンテキスト**） |
| 5 | 設計 | `/speckit-plan` |
| 6 | 着手判定 | `/speckit-checklist`（`templates/checklists/shaped.md` を写す） |
| 7 | 分解 | `/speckit-tasks` |
| 8 | 整合検査 | `/speckit-analyze` |
| 9 | 実装 | `/speckit-implement`（6 の未チェックで止まる） |
| 10 | **門②**（変更が出来上がった直後・同じセッション内） | `prompts/drift-detector.md`（**別AI・フレッシュコンテキスト**） |

門①と門②は、**作業した当のAIには実行させません。**

## Governance

- ルールの正は `AGENTS.md`。この Constitution はその下位にあり、Spec Kit の実行に必要な範囲だけを持ちます。
- この Constitution を長くしません。行数が増えること自体が「ルール・仕様が肥大化し、AIが逆に見失う」（`AGENTS.md` 避けるべき未来4位）に該当します。
- 期待値が変わったときは `spec.md` を更新します。更新は失敗ではありません。

**Version**: 1.0.0 | **Ratified**: 2026-08-28 | **Last Amended**: 2026-08-28
