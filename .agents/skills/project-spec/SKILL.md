---
name: project-spec
description: >-
  Use this skill once at the start of a new project (one received order = one app), before
  writing any code. Drafts spec.md from the request, runs gate 1 (blind back-translation)
  to obtain the single yes/no confirmation allowed for the project, and transcribes the
  acceptance criteria into the E2E template. Do NOT use it at session start or at phase
  boundaries.
---

# Project Spec Skill (specify 工程)

案件のゴール（検収が通る条件）を、着手前に1枚の `spec.md` として固定する手順です。
**1案件につき1回だけ**実行します。セッション開始時・フェーズの区切りでは実行しません。

門①（ずれ①の門）は、このゴールを決めるときに1回だけ回します。

## 起動条件 (Triggers)

- 新しい案件を受注し、これから1本のアプリ・システムを作り切るとき。
- 利用者が「こうしたい」「思っていたのと違う」と述べ、ゴールを決め直すとき（この場合は手順1から再実行します）。

## 手順 (Workflow)

1. **`spec.md` のドラフトを作る。** 自作の手順は使わず、GitHub Spec Kit の既存コマンドに載せます。
   - `/speckit-specify` を実行します。雛形は [`.specify/templates/overrides/spec-template.md`](../../../.specify/templates/overrides/spec-template.md) が使われます（Spec Kit の override は core より優先されます）。
   - 埋める順序は Opportunity Solution Tree → Shape Up です。**依頼文が Solution である可能性を先に潰します。**「◯◯アプリを作りたい」は Desired Outcome ではなく Solution であることが多いため、上位へ辿って `Desired Outcome` と `Opportunities` を先に書き、そのあとで `Problem` / `Appetite` / `Solution` / `Rabbit Holes` / `No Gos` を書きます。
   - 続けて `/speckit-clarify` を実行し、`[NEEDS CLARIFICATION]` を潰します。**利用者に記入させません。** 読み取れない箇所は担当エージェントが最も確からしい案を書き、手順2で判定にかけます。
   - `Critical Assumptions` 表には「これが偽だったら、この Solution を作る意味が無くなるか？」が YES のものだけを書きます。NO のものは `Non-critical Assumptions` に置き、事前に調べません（Lean Startup）。
   - 「保護対象ルート一覧」は、雛形が定める1行1ルートの形式どおりに書きます。形式が崩れると [`scripts/check-catastrophic.sh`](../../../scripts/check-catastrophic.sh) が読み取れません。該当が無い場合は `- NONE` の1行だけを書きます。
   - **節番号 `## 2.` と `## 4.` を変更しません。** 既存2検査が読み取る固定の識別子です。

2. **門①を回し、利用者に二択で提示する。**
   - 手順は [`prompts/intent-backtranslator.md`](../../../prompts/intent-backtranslator.md) に従います。本スキルには手順を複製しません（ルールの正は1つです）。
   - **フレッシュコンテキストの別エージェント**に、ドラフトの詳細指示だけを渡します。ドラフトを書いたエージェント自身に実行させません。
   - 戻ってきた1文を利用者に提示し、**「そう／違う」の二択**で答えてもらいます。
   - **これが案件で唯一の利用者確認です。** 手順1〜5のどこにも、これ以外の確認・質問・選択肢の提示を追加しません。唯一の例外は手順4で `/speckit-implement` が未チェックを検出して止まった場合で、これは残余 Risk を受容して Build へ進むかどうかの判断です。

3. **判定を反映する。**
   - **「そう」**: spec 確定。以後、この `spec.md` が正です。実装・検収・スコープの判断はすべてここを参照します。
   - **「違う」**: 手順1に戻り、ドラフトを作り直します。**利用者に詳細を書かせません。** 作り直したドラフトで手順2をもう一度回します（同じゴールについて確定するまで繰り返す分は、新しい確認の追加ではありません）。
   - spec 確定後、実装に入る前の計画は [`verified-plan` スキル](../verified-plan/SKILL.md) に従います（STRICT の変更、または利用者が計画を求めた場合）。

4. **着手判定を通す。**
   - [`templates/checklists/shaped.md`](../../../templates/checklists/shaped.md) を `specs/<feature>/checklists/shaped.md` へ複写し、`/speckit-checklist` で内容をこの案件に合わせます。**項目を増やしません。** 判定は Shape Up の `rough` / `solved` / `bounded` と Lean Startup の `critical assumptions checked` の4つだけです。
   - `/speckit-plan` → `/speckit-tasks` → `/speckit-analyze` の順に進みます。Issue Tree を自作しません。分解は `/speckit-tasks` が行います。
   - `/speckit-implement` は未チェック項目を読み取って着手前に止まります。これが「検証していない要求を分解へ渡さない」（NASA）の実装です。**未チェックのまま進む場合は、残余 Risk を受容した判断として記録に残します。**

5. **検収条件を E2E へ転写する。**
   - 確定した `spec.md` 第2節（`## 2. User Scenarios & Testing — 検収条件`）の Given / When / Then を、[`templates/e2e/README.md`](../../../templates/e2e/README.md) の雛形へそのまま写します。
   - 第2節の文がハッピーパスの本体です。転写にあたって内容を要約・言い換えしません。差が出たときは `spec.md` 側を正とします。

## 期待値が変わったとき

`spec.md` が固定するのは検収の下限であって、期待値の上限ではありません。
作ってみて分かったことで期待値が動いた場合は、**第1〜4節を更新し、更新した内容を記録します**。更新は失敗ではありません。
更新がゴールの決め直しにあたる場合（第1節が変わる場合）は、手順2を1回だけ回し直します。

## 禁止事項 (Do Not)

- 利用者への確認を手順2の二択1回より多く行わない。ヒアリング・追加質問・案の複数提示はいずれもこれに該当する。
- 門①のプロンプト本文（質問文・手順の文面）を本スキルや `spec.md` に複製しない。参照リンクだけを置く。
- 着手前に `spec.md` 以外の要件定義書を作らない。
- セッション開始時・フェーズの区切りで本スキルを起動しない。
