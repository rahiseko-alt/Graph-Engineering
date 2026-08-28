# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`

**Created**: [DATE]

**Status**: Draft

**Input**: User description: "$ARGUMENTS"

<!--
  ============================================================================
  この雛形は Spec Kit の core `spec-template.md` を project-local override
  (.specify/templates/overrides/) で置き換えたものです。core に対する差分は
  次の3つだけで、新しい概念・独自の名称は足していません。

  (1) Shape Up の Pitch 5要素を、公式の語と順序のまま追加
      Problem / Appetite / Solution / Rabbit Holes / No Gos
      出典: https://basecamp.com/shapeup/1.5-chapter-06
  (2) Opportunity Solution Tree の4語を、Problem の内訳として追加
      Desired Outcome / Opportunities / Solutions / Assumption Tests
      出典: https://www.producttalk.org/opportunity-solution-trees/
  (3) 停止4領域と保護対象ルート一覧の節を追加（AGENTS.md LEVEL B-11 / D-1）

  ★ 節番号 `## 2.` と `## 4.` は変更しないでください。
    これは見出しの装飾ではなく、既存検査が読み取る固定の識別子です。
      - scripts/check-test-integrity.sh (T5) は `## 2.` の節に含まれる
        Given / When / Then の行数が減っていないかを見ます。
      - scripts/check-catastrophic.sh (C3) は `## 4.` の節から
        「保護対象ルート一覧」を読み取ります。節が無いと ERROR で落ちます。
    どちらも `^## <数字>.` で節に入り、次の `#` または `##` 見出しで打ち切ります。
    `###` の小見出しは打ち切りに掛からないため、節の内側で自由に使えます。
  ============================================================================
-->

## Problem *(mandatory)*

<!-- Shape Up Ingredient 1. 生の要望や機能案ではなく、何が問題なのかを書く。 -->

[何が問題なのかを、利用者の言葉で書く]

### Desired Outcome

<!--
  Opportunity Solution Tree の root。目指す状態変化を書く。
  利用者が「◯◯アプリを作りたい」と言っている場合、それは Solution であって
  Desired Outcome ではない可能性が高い。上位へ辿ってからここを書く。
-->

[どの状態がどう変わるとよいのか。手段・製品名・技術用語を書かない]

### Opportunities

<!-- Desired Outcome を阻害している customer needs / pain points / desires。 -->

- [阻害している事柄1]
- [阻害している事柄2]

## Appetite *(mandatory)*

<!--
  Shape Up Ingredient 2. 「この問題にどれだけ使う価値があるか」を先に決める。
  Solution を決めてから所要時間を見積もるのではなく、使える時間を先に固定し、
  その中に収まる Solution へ Shape する（Fixed Time / Variable Scope）。
-->

[今回この問題に使う上限（例: 2週間）]

## Solution *(mandatory)*

<!--
  Shape Up Ingredient 3. 大まかにどう解決するか。細部まで作り込まない（rough）。
  ただし主要な要素はつながっている必要がある（solved）。
-->

[どう介入するか]

## Rabbit Holes

<!--
  Shape Up Ingredient 4. 事前に分かっている技術的難所・未解決の設計問題・
  誤解されやすい相互依存。すべてを事前解決する必要はない。
-->

- [難所1]
- [難所2]

## No Gos *(mandatory)*

<!-- Shape Up Ingredient 5. 今回はやらないこと。境界（bounded）を作る。 -->

- [やらないこと1]
- [やらないこと2]

## 2. User Scenarios & Testing — 検収条件 *(mandatory)*

<!--
  ★ この見出しの番号 `2.` は変更しないでください（冒頭の説明を参照）。

  Acceptance Scenarios はそのまま E2E のハッピーパスになります。
  転写の手順は templates/e2e/README.md を参照してください。
  User Story は重要度順に P1, P2, P3 を付け、それぞれ単独でテスト可能にします。
-->

### User Story 1 - [Brief Title] (Priority: P1)

[この通し操作を、利用者の言葉で書く]

**Why this priority**: [なぜこの優先度か]

**Independent Test**: [単独でどう検証できるか]

**Acceptance Scenarios**:

1. **Given** [前提の状態], **When** [人が行う操作], **Then** [画面で確認できる結果]
2. **Given** [前提の状態], **When** [人が行う操作], **Then** [画面で確認できる結果]

---

### User Story 2 - [Brief Title] (Priority: P2)

[この通し操作を、利用者の言葉で書く]

**Why this priority**: [なぜこの優先度か]

**Independent Test**: [単独でどう検証できるか]

**Acceptance Scenarios**:

1. **Given** [前提の状態], **When** [人が行う操作], **Then** [画面で確認できる結果]

---

[必要な数だけ User Story を足す。通常は1〜3件]

### Edge Cases

- [境界条件が起きたとき何が起きるか]
- [エラー時に何が起きるか]

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST [具体的な能力]
- **FR-002**: Users MUST be able to [主要な操作]

*未特定の箇所は次の形で明示します（`/speckit-clarify` が拾います）:*

- **FR-003**: System MUST authenticate users via [NEEDS CLARIFICATION: 認証方式が未特定]

### Key Entities *(データを扱う場合のみ)*

- **[Entity 1]**: [何を表すか、主要な属性]

## 4. 停止4領域 (Fail Fast) *(mandatory)*

<!--
  ★ この見出しの番号 `4.` は変更しないでください（冒頭の説明を参照）。

  金額 / 日付 / 権限 / データの削除・上書き の4領域でのみ、想定外の値を
  そのまま返さずその場で停止します（AGENTS.md LEVEL B-11）。
  4領域以外は「動けばよい」とします。該当が無い領域には「なし」と書きます。
-->

- **金額**: [この案件で金額を扱う箇所。無ければ「なし」]
- **日付**: [同上]
- **権限**: [同上]
- **データの削除・上書き**: [同上]

### 保護対象ルート一覧

<!--
  未ログインの利用者が到達できてはいけない URL・エンドポイントを列挙します。
  scripts/check-catastrophic.sh (C3) と E2E の⑤がこの一覧を入力に取ります。

  形式: 1行1ルートで `- <HTTPメソッド> <パス>`。メソッドは大文字、
  パスは `/` で始めます。注釈・空行・入れ子の箇条書きを混ぜません。
  該当が無い場合は `- NONE` の1行だけを書きます（宣言があれば SKIP、
  書き忘れなら ERROR です。静かに緑にはなりません）。
-->

- NONE

## Success Criteria *(mandatory)*

### Measurable Outcomes

<!-- 技術非依存で、測定できる形で書きます。 -->

- **SC-001**: [測定できる指標]
- **SC-002**: [測定できる指標]

## Assumptions *(mandatory)*

### Critical Assumptions (Assumption Tests)

<!--
  Lean Startup。判定はこの1問だけです。
  「これが偽だったら、この Solution を作る意味が無くなるか？」
  YES のものだけをここへ書き、着手前に Evidence を取ります。
  すべての Unknown を潰す必要はありません。
-->

| # | Assumption | 偽だったら何が変わるか | Evidence | 状態 |
|---|---|---|---|---|
| CA-001 | [前提] | [Solution 変更 / Opportunity 見直し 等] | [観測した事実。無ければ空] | [未確認 / 確認済 / 受容] |

### Non-critical Assumptions

<!-- 偽でも Solution が成立するもの。実装中に解きます。事前に調べません。 -->

- [前提]
