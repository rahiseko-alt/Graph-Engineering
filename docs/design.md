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

### 2026-08-28 門②（ずれ検知）の指摘と対応

別エージェントによる7問の門②で「はい」が6件出た。全件の扱いを記録する（検知 ≠ 変更。却下も記録に残す）。

| 問 | 指摘 | 対応 |
|---|---|---|
| Q2 | 残すとした検査の一方が新しい仕様の置き場所を探索せず、旧雛形を読んで静かに通過する経路が残っている | **採用・修正済み。** `scripts/check-catastrophic.sh` の自動探索を `specs/*/spec.md` 優先へ変更し、2件以上あるときは黙って1件選ばず ERROR にした。`templates/ci/acceptance.yml` の `SPEC_PATH` も新しい位置へ更新した。3通り（0件・1件・2件）を実測で確認済み |
| Q1 | 着手判定は4項目の合意だったが13項目になっている | **採用・修正済み。** `templates/checklists/shaped.md` を4項目へ戻した。検収条件・停止4領域・保護対象ルート一覧は C3 と E2E が機械で検査するため、人が読むチェックリストへ重ねて置かない |
| Q7 | 3種目のエージェントに機構が無く、導入状態の記録も片方しか残っていない | **採用・一部修正。** Antigravity（integration ID は `agy`）を追加導入した。ただし下記の限界が残る |
| Q3 | 着手判定の停止機構をエンドツーエンドで起動していない | **限界として記録。** `/speckit-implement` は LLM が実行するスキルであり、スクリプトのように再現実行できない。確認したのは SKILL.md に書かれた計数規則（`- [ ]` の残数で PASS / FAIL）の再現までである。この区別を報告でも記録でも消さない |
| Q5 | 産物が原則・雛形・判定表・説明文書のみで、この機構を1本も通していない | **限界として記録。** 実案件を1本通すのは次セッションの最初の作業とし、`docs/handoff.md` に置いた。今回は工程の設置までをフェーズの区切りとする（D-8） |
| Q6 | 「利用者確認は二択1回」に、着手判定で止まったときの続行可否という2つ目の確認が増えている | **却下（受容）。** これは残余 Risk を受容して Build へ進むかどうかの判断であり、Shape Up・Lean Startup・Opportunity Solution Tree のいずれもこれを人間の Bet として扱っている。案件数に比例して増えるのは「shaping が未完了の案件の数」であって案件数そのものではない。`.specify/memory/constitution.md` 原則 V に例外として明記した |

### 2026-08-28 実測: 構造化した実行と、単一AIの比較（1件）

同じ依頼（営業日を数えるコマンド）を2通りで実行した。記録は [`docs/measurements/README.md`](./measurements/README.md)。

**結果は、この仕組みにとって都合の良いものではなかった。そのまま残す。**

- 受入検査5件は **どちらも一発で通過**。検収条件の外側（読めない休業日行、年の範囲外）を当てても、**どちらも黙って数値を返さずに止まった**。到達点は同じだった
- 単一AIは 46,767 トークン / 87秒 / やり直し0回。構造化した側は、仕様・計画・調査・分解・着手判定・記録を通っており、明らかに多くの時間を使った
- 構造化した側のトークン消費は**分離して取得できない**。最も知りたかった比較ができていない

**この1件から言えないこと**: 規模が大きい場合にどうなるか。この対象は5ファイル・1コマンドで、単一AIの一度の作業に収まる大きさだった。「成功した仕事を残して失敗した箇所だけ修復する」は、**作り直す量が小さい対象では利点にならない**。境目を知るには、単一AIの一度の作業に収まらない大きさで測る必要がある。

**それでも残った差**: 検査が2回、実際に働いた。(1) 検収条件が6行から4行へ減ったことを捕まえ、本物の抜けを見つけさせた。(2) 仕様が2件になった時点で「どれを検査するか明示しろ」と止めた。単一AI側にはこの働きが無く、依頼文に無い事項（期間が両端を含むか等）を自分で決めて自己申告していた。今回その判断は正しかったが、**正しさを確かめる手段は、後から検査を当てるまで存在しなかった**。

### 2026-08-28 実測: 失敗の局所化（案件002の実装で確認）

独立した2単位（日付の検査 / 休業日の読み込み）を別々の作業領域で実装し、片方だけを意図的に落とした。

- **赤**: 単位B が8件中2件失敗。単位A は6件すべて緑のまま
- **緑**: 単位B の原因だけを直して8件通過。この間、**単位A のコミット数は1件のまま変化なし（作り直し0件）**
- **戻して赤**: 同じ壊し方で、同じ2件が再び失敗
- 統合時の**衝突0件**。両単位の成果物が残存し、統合後25件すべて緑

**使ったのは git だけ。新しい実行基盤を1行も書いていない。**

### 2026-08-28 やらなかったこと（正確に記録する）

- **`/batch` を実走していない。** このセッションで利用できるスキルとして提供されていなかったため、`/batch` が束ねている仕組み（worktree 隔離＋単位ごとのブランチ）を直接使った
- **単位ごとの pull request を開いていない。** セッションの規約が指定ブランチ以外へのプッシュを禁じているため。単位の境界はブランチが担った
- **CI で検査が走ることを確かめていない。** 検査3種は手元で実行して緑を確認したが、CI 上での実行は未確認
- **プロセスを強制終了しての再開を試していない。** SC-005 は「成功済みを再実行しなかった」ことのコミット数による確認までで、中断からの復帰そのものは試していない

### 2026-08-28 ⑥ Graph（実行側）の決定

**自作のランナーを書きません。** `/speckit-tasks` が出す `tasks.md` が既に Graph（Phase 分割・依存順・並列マーカー `[P]`・User Story 単位のまとまり）です。したがって決めるべきことは「その `tasks.md` を、公式のどの実行機構で走らせるか」だけです。

公式ドキュメントを 2026-08-28 に確認した事実（出典: https://code.claude.com/docs/en/agents ／ https://code.claude.com/docs/en/workflows）:

| 機構 | 何か | 隔離 | 状態・上限 |
|---|---|---|---|
| Subagents | 1セッション内の委譲ワーカー。結果を要約して返す | 個別に worktree を付けられる | — |
| Agent view (`claude agents`) | 背景セッションの一覧・監視 | **各セッションを自動で worktree へ入れる** | research preview |
| Agent teams | Lead が複数セッションを指揮。共有タスクリストと相互メッセージ | **teammate は worktree 隔離されない**（担当ファイルを分ける必要がある） | **experimental・既定で無効** |
| Dynamic workflows | Claude が書いた JavaScript を runtime が実行し、多数の subagent を並列・段階・検証つきで回す | agent 側で指定 | 同時16・1実行あたり1,000 agent。既定の size guideline は `medium`（15未満）。**実行中のユーザー入力を受け付けない** |
| `/batch` | 1つの大きな変更を5〜30の worktree 隔離 subagent へ割り、それぞれが PR を出す skill | あり | subagent と worktree の**組み合わせの既製品**であり、別の協調方式ではない |

**採用する順序（迷ったら上から）**

1. **既定は `/speckit-implement`。** `tasks.md` の依存順どおりに逐次実行します。案件の大半はこれで足ります。**必要のない並列化を足しません**（避けるべき未来1位）。
2. **`[P]` の独立作業がまとまってあるときは `/batch`。** 成果物単位で worktree 隔離され、Node ごとに PR が出ます。赤くなった PR がそのまま「失敗した Node」なので、そこだけ直せば済みます（Failure Localization）。
3. **同じ処理を多数の対象へ掛けるとき、または結果を相互検証させたいときは dynamic workflow。** 「use a workflow」または `ultracode` で起動します。トークン消費が増えるため、まず小さな範囲で1回試してから広げます。

**採用しないもの**

- **Agent teams**: experimental かつ既定で無効。加えて teammate が worktree 隔離されないため、担当ファイルの分割を人が守る前提になります。これは「人が守るルールは0にする」（D-11）と「特定の状態でしか動かない仕組み」（避けるべき未来5位）の両方に当たります。
- **自作の Orchestrator / State machine / Retry 機構**: 上の3つで賄えます。

**Evidence Gate の位置は変えません。** 機械判定を先に全部通し、そのあとにだけ人・LLM の目を入れます。

```text
実装 → check-test-integrity.sh → check-catastrophic.sh → E2E（①〜⑥）→ 門②（別AI・7問）
```

`/batch` や workflow で並列化しても、この順序は各 Node の中で同じです。機械で判定できるものを LLM に判定させません。

### 2026-08-28 工程を1本通した結果（使い捨ての案件による実測）

門②の Q3 / Q5（「機構を1本も通していない」「停止機構を起動していない」）に対して、使い捨ての案件（予約の一元確認）を1本通した。**確認後に `specs/` ごと削除している**（実装の無いルートを宣言した仕様を残すと C3 が恒久的に赤になり、検査を外す動機を作るため）。

- `setup-plan.sh` / `setup-tasks.sh` / `check-prerequisites.sh` はいずれも成功し、feature の所在を `.specify/feature.json` から解決した。**git のブランチ名に依存しない**（作業ブランチは `claude/checkin-5pscie` のままだった）。
- `/speckit-specify` の手順で作られた仕様は override の雛形どおりで、Shape Up の5要素・Opportunity Solution Tree の語・`## 2.` と `## 4.` を保持していた。
- `/speckit-implement` の手順1（前提確認）は通り、**手順2の着手判定で停止した**。実測値は次のとおり。

  | Checklist | Total | Checked | Unchecked | Status |
  |---|---|---|---|---|
  | requirements.md | 16 | 16 | 0 | ✓ PASS |
  | shaped.md | 4 | 0 | 4 | ✗ FAIL |

  4項目すべてをチェックすると PASS、うち1項目（`critical assumptions checked`）だけ戻すと再び FAIL になることを確認した（赤 / 緑 / 戻して赤）。緑と戻して赤の確認は、マーカーを書き換えない規則を守るため複製に対して行った。
- C3 の自動探索は旧位置の雛形ではなく `specs/001-reservation-inbox/spec.md` を選び、宣言された3ルートすべてについて実装が無いことを ERROR にした（exit 1）。Q2 の穴が塞がっていることを実際の経路で確認できた。
- タスク雛形は Phase 分割・依存順・並列マーカー `[P]` を持つ。⑤ の Logical Decomposition を自作しない根拠の実物確認。

### 2026-08-28 複数エージェント導入の限界（実測値）

- 導入済みは Claude（`.claude/skills/`）、Codex と Antigravity（どちらも `.agents/skills/`）の3種。manifest は `.specify/integrations/` に3件とも残る。
- **`.specify/integration.json` の `installed_integrations` は追記されず、最後に実行した integration で置き換わる。** 現在の記録は `agy` 1件だが、実ファイルは3種分すべて存在する。
- **Codex と Antigravity は `.agents/skills/` を共有するため、後から実行した側の記述で上書きされる。** 差は本文中のコマンド呼び出しの接頭辞のみで、現在は `/speckit-*`（Claude・Antigravity と同じ形）である。Codex の `$speckit-*` 表記が必要になった場合は `specify init --here --force --integration codex` を再実行する。
- これは Spec Kit 側の挙動であり、こちらで回避策を自作しない。

### 2026-08-28 ルート `spec.md` の扱い

Spec Kit 導入後の案件は `specs/<feature>/spec.md` を使う。ルートの `spec.md` は旧形式の雛形として**そのまま残す**。削除すると T5 が「spec.md が削除された」として ERROR を出すため、検査を通すために消すという判断はしない。
