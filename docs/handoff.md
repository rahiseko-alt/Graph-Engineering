# Session Handoff (docs/handoff.md)

> **運用ルール**
> - セッション間の作業状態の引き継ぎファイルです。
> - セッション開始時 (`In`) に読み込み、セッション終了時 (`Out`) に更新します。
> - 恒久的な設計情報はここではなく `docs/design.md` に、案件のゴールは `spec.md` に書きます。

---

## 0. 次のセッションが最初に読むべきこと (READ FIRST)

**この案件の依頼者は非エンジニアです。コードを1行も読めません。** 次の担当は Claude とは限りません（Codex / Antigravity も同じリポジトリを触ります）。

### 禁止事項
1. **エンジニア向け語彙で話さない。** 技術用語は使うが、必要なら定義を添える（AGENTS.md D-2）。
2. **変更範囲をユーザーに技術用語で指定させない。**
3. **技術的な選択肢を並べて選ばせない**（評価にコード知識が要るため）。
4. **手が止まっていないのに確認を投げない。** 確認は `spec.md` を決めるときの二択1回に限る。
5. **規模・頻度・回数を問われたら、まず桁を出す。** 前提を置いてでも数字を先に。
6. **PRを出したら次の作業に移る。** 定期的に様子を見に行かない。

### まず読むべきもの
- **[`AGENTS.md`](../AGENTS.md) 冒頭** = 望ましい未来1件・避けるべき未来5件
- **[`.specify/memory/constitution.md`](../.specify/memory/constitution.md)** = 採用手法6段・着手判定4項目・工程の順序（Spec Kit の実行時に効く原則）
- **[`docs/design.md`](./design.md) 第4節** = 何を採用し、何を作らないと決めたか（一次資料つき）

**このリポジトリは案件テンプレート本体です。** ルートの `spec.md` は雛形なので、実案件の内容で埋めないでください。案件の仕様は `specs/<feature>/spec.md` に置きます。

---

## 1. 今回やったこと (Completed in this session)

**2026-08-28: 自作の要件定義・分解の仕組みをやめ、GitHub Spec Kit（公式 OSS）へ載せ替えました。**

- Goal Shaping の理論探索を打ち切り、採用手法を6段（Opportunity Solution Tree → Shape Up → Lean Startup の Critical Assumption → NASA の原則 → Logical Decomposition → Graph）に固定しました。決定と一次資料は [`docs/design.md`](./design.md) 第4節に記録済みです。
- `specify-cli 1.0.1` を導入し、Claude 用（`.claude/skills/speckit-*`）と Codex 用（`.agents/skills/speckit-*`）の両方を入れました。**既存の追跡ファイルは1つも書き換わっていません**（実測済み）。
- 仕様の雛形を `.specify/templates/overrides/spec-template.md` に置きました。Shape Up の5要素と Opportunity Solution Tree の4語を**公式の語のまま**使い、既存検査が読む節番号 `## 2.` `## 4.` を保持しています。
- 着手判定を [`templates/checklists/shaped.md`](../templates/checklists/shaped.md) に置きました。判定は `rough` / `solved` / `bounded` / `critical assumptions checked` の4つだけです。`/speckit-implement` が未チェックを検出して着手前に止まります。
- 実行時の原則を `.specify/memory/constitution.md` に置きました。**`AGENTS.md` の本文は複写していません**（D-7）。
- 門②（別エージェントによる7問）を回し、「はい」6件をすべて処理しました。**検査の穴1件を実際に塞いでいます**（`scripts/check-catastrophic.sh` が新しい仕様の置き場所を探索せず、旧雛形を読んで静かに通過していました）。着手判定の項目数も合意どおり4項目へ戻しました。全件の扱いは [`docs/design.md`](./design.md) 第4節の表にあります。

**書かなかったもの**: 着手判定の自作スクリプト、独自の Risk taxonomy、Goal Contract、数値スコア、自作の Issue Tree。公式の既存機構で足りたためです。

## 2. 現在の状態 (Current State)

- Spec Kit の導入と、仕様雛形・着手判定・原則の設置が完了しています。検証（テンプレート解決の優先順位、C3 の NONE→SKIP とルート宣言時の ERROR、T5 の手順数減少の検出、着手判定の未チェック計数）はすべて実測で通っています。
- **既知の一度きりの反応**: Spec Kit のベンダーコードに `# shellcheck disable=SC2071` が1行あるため、取り込みコミットで `check-test-integrity.sh` の T3 が1件出ます。検査を弱める対処は取っていません。次のコミットからは再発しません（実測済み）。
- **工程を1本通しました。** 使い捨ての案件を作り、仕様の作成から着手判定までを実際のコマンドで通し、着手判定が未チェックのままでは実装へ進まないことを確認しています（確認後に削除済み）。実測値は [`docs/design.md`](./design.md) にあります。
- **導入した3種のAI**: Claude（`.claude/skills/`）、Codex と Antigravity（どちらも `.agents/skills/` を共有）。共有ゆえに後から入れた側で上書きされる点と、導入記録が最後の1件しか残らない点は、Spec Kit 側の挙動として `docs/design.md` に実測値で記録しています。
- ルートの `spec.md` は旧形式の雛形として残しています。案件では `specs/<feature>/spec.md` を使います。

## 3. 次回やること (Next Steps)

1. **⑥ Graph（Delivery 側）の設計。** Claude Code 公式の subagents / worktrees / `/batch` / Dynamic Workflows のどれをどこに割り当てるかを決める。ここも自作せず公式機構から取る。
2. **実案件を1本、実装まで通す。** 今回の通し確認は着手判定で止まるところまでで、その先（分解 → 実装 → E2E 転写）は動かしていません。門①・門②・E2E 転写がどこで噛み合わないかは、実案件で初めて分かります。
3. 門① と `/speckit-clarify` の役割重複は、1本回してから実際に困った場合にだけ整理する（先に整理しない）。
