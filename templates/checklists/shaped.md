# Shaped Checklist: [FEATURE NAME]

**Purpose**: 着手判定。この仕様を `/speckit-tasks` で分解し `/speckit-implement` で実装してよいかを見ます。
**Created**: [DATE]
**Feature**: [spec.md へのリンク]

**Review Ownership**: This custom checklist is a reviewer-owned requirements-quality review artifact. Mark an item `[x]` only when the reviewer determines the requirements-quality criterion is satisfied.
**Marker Semantics**: `[x]` means the criterion has been reviewed and satisfied for requirements quality. It does not mean implementation work is complete.

<!--
  ============================================================================
  使い方

  1. `specs/<feature>/checklists/shaped.md` へ複写する。
  2. 各項目を確認し、満たしたものだけ `[x]` にする。
  3. 未チェックが残ったまま `/speckit-implement` を起動すると、着手前に
     止まって続行するかどうかを訊かれる。これが
     「検証していない要求を Logical Decomposition へ渡さない」（NASA）の実装。

  ★ 項目は4つだけ。増やさないこと。
    Shape Up の rough / solved / bounded と、Lean Startup の
    critical assumptions checked である。独自スコア・数値閾値・追加のゲートを
    作らない（.specify/memory/constitution.md 原則 II）。

  ★ 項目を減らして緑にしないこと。
    AGENTS.md LEVEL A-4（品質検査の完全性）に該当する。

  ★ 検収条件・停止4領域・保護対象ルート一覧はここで数えない。
    これらは scripts/check-catastrophic.sh (C3) と templates/e2e/ が機械で
    検査する。人が読むチェックリストへ重ねて置くと、同じことを2か所で
    管理することになる（AGENTS.md D-7）。
  ============================================================================
-->

## 着手判定

- [ ] CHK001 **rough** — 細部を作り込んでいない。画面構成・技術選定・ファイル配置・実装順序を仕様側で固定していない（[Shape Up](https://basecamp.com/shapeup/1.1-chapter-02)）
- [ ] CHK002 **solved** — macro level で主要な要素がつながっており、明白な Open Question（`[NEEDS CLARIFICATION]`）と目に見える Rabbit Hole を減らしてある（[Shape Up](https://basecamp.com/shapeup/1.1-chapter-02)）
- [ ] CHK003 **bounded** — Appetite（今回この問題に使う上限）と No Gos（今回やらないこと）が書かれており、どこで止めるかが分かる（[Shape Up](https://basecamp.com/shapeup/1.2-chapter-03)）
- [ ] CHK004 **critical assumptions checked** — 「これが偽だったら、この Solution を作る意味が無くなるか？」が YES の Assumption について Evidence がある。Critical Assumptions 表に `未確認` の行が残っていない（[Lean Startup](https://leanstartup.co/wp-content/uploads/2023/06/ebook-NavigatingSquiggles-Final_61523.pdf)）

## Notes

- Mark items `[x]` only after review confirms the requirement-quality criterion is satisfied
- Leave items unchecked when they still require clarification, correction, or reviewer evaluation
- `/speckit-implement` reads checklist checkbox state as a gate and must not modify markers
- 未チェックのまま進むと決めるのは、残余 Risk を受容して Build へ進む Bet である。その判断は記録に残す
