# Shaped Checklist: [FEATURE NAME]

**Purpose**: 着手判定。この仕様を `/speckit-tasks` で分解し `/speckit-implement` で実装してよいかを見ます。
**Created**: [DATE]
**Feature**: [spec.md へのリンク]

**Review Ownership**: This custom checklist is a reviewer-owned requirements-quality review artifact. Mark an item `[x]` only when the reviewer determines the requirements-quality criterion is satisfied.
**Marker Semantics**: `[x]` means the criterion has been reviewed and satisfied for requirements quality. It does not mean implementation work is complete.

<!--
  ============================================================================
  この雛形の使い方

  1. `specs/<feature>/checklists/shaped.md` へ複写する。
  2. 各項目を確認し、満たしたものだけ `[x]` にする。
  3. 未チェックが残ったまま `/speckit-implement` を起動すると、着手前に
     止まって続行するかどうかを訊かれる。これが
     「検証していない要求を Logical Decomposition へ渡さない」（NASA）の実装。

  ★ 項目を増やさないこと。
    判定は Shape Up の rough / solved / bounded と、Lean Startup の
    critical assumptions checked の4つだけである。独自スコア・数値閾値・
    追加のゲートを作らない（.specify/memory/constitution.md 原則 II）。

  ★ 項目を減らして緑にしないこと。
    これは AGENTS.md LEVEL A-4（品質検査の完全性）に該当する。
  ============================================================================
-->

## Shape Up — rough

<!-- 出典: https://basecamp.com/shapeup/1.1-chapter-02 -->

- [ ] CHK001 細部を作り込んでいない。画面構成・技術選定・ファイル配置・実装順序を仕様側で固定していない
- [ ] CHK002 実装側の裁量に残してよい判断を、利用者への確認事項として残していない

## Shape Up — solved

- [ ] CHK003 macro level で主要な要素がつながっている。Solution が Problem に対する介入として成立している
- [ ] CHK004 明白な Open Question が残っていない（`[NEEDS CLARIFICATION]` が spec.md に残っていない）
- [ ] CHK005 目に見える Rabbit Hole を減らしてある。潰せないものは Rabbit Holes 節に書き出してある

## Shape Up — bounded

<!-- 出典: https://basecamp.com/shapeup/1.2-chapter-03 -->

- [ ] CHK006 Appetite（今回この問題に使う上限）が決まっている
- [ ] CHK007 No Gos（今回やらないこと）が書かれている。どこで止めるかが分かる

## Lean Startup — critical assumptions checked

<!-- 出典: https://leanstartup.co/wp-content/uploads/2023/06/ebook-NavigatingSquiggles-Final_61523.pdf -->

- [ ] CHK008 「これが偽だったら、この Solution を作る意味が無くなるか？」が YES の Assumption をすべて Critical Assumptions 表に挙げてある
- [ ] CHK009 Critical Assumptions 表に `未確認` の行が残っていない（`確認済` は Evidence 欄が埋まっている。`受容` は受容する理由が書かれている）
- [ ] CHK010 NO の Assumption を事前調査の対象にしていない（Non-critical Assumptions に置き、実装中に解く）

## この案件固有の検査（AGENTS.md D-1）

- [ ] CHK011 Acceptance Scenarios（Given / When / Then）が1件以上あり、そのまま E2E のハッピーパスへ転写できる
- [ ] CHK012 停止4領域（金額 / 日付 / 権限 / データの削除・上書き）の所在が4つとも書かれている（該当が無い領域は「なし」）
- [ ] CHK013 保護対象ルート一覧が形式どおりに書かれている（該当が無い場合は `- NONE` の1行）

## Notes

- Mark items `[x]` only after review confirms the requirement-quality criterion is satisfied
- Leave items unchecked when they still require clarification, correction, or reviewer evaluation
- `/speckit-implement` reads checklist checkbox state as a gate and must not modify markers
- 未チェックのまま進むと決めるのは、残余 Risk を受容して Build へ進む Bet である。その判断は記録に残す
