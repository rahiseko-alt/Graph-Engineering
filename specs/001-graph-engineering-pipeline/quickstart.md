# Quickstart: この仕組みが動いていることを確かめる手順

**Date**: 2026-08-28
**Spec**: [spec.md](./spec.md)

spec.md の検収条件を、実際に走らせて確かめる手順です。**実装コードではなく、確かめ方だけ**を書いています。

## 前提

- リポジトリ直下で作業する
- `.specify/` が設置済みであること（`ls .specify/templates/overrides/spec-template.md` で確認）
- 検査スクリプトが実行できること（`bash scripts/check-catastrophic.sh --help` 相当で終了コードが返る）

## 検証1: 失敗した場所だけを直せる（SC-001 / User Story 1）

1. 小さな対象を1件決め、`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` まで進める。
2. `tasks.md` に `[P]` の付いた独立した作業単位が2つ以上あることを確認する。
3. `/batch` で実行し、単位ごとに pull request が開くことを確認する。
4. 1つの pull request の検査だけを意図的に落とす（例: その単位の変更を壊す）。
5. **確認すること**: 落ちた pull request だけが赤く、他は緑のまま。
6. 落ちた pull request の中だけを直して再実行する。
7. **確認すること**: 緑だった pull request が作り直されていない（コミットが増えていない）。

**赤 / 緑 / 戻して赤**: 4 が赤、6 のあとが緑、もう一度同じ壊し方をすると同じ赤になること。

## 検証2: 同時に走らせても衝突しない（SC-004 / User Story 1）

1. 検証1 の 3 の状態で、`[P]` の単位が同時に実行されていることを確認する。
2. **確認すること**: 各単位が別々の作業領域で動いており、統合時に衝突が0件。

## 検証3: 機械が判定できることに AI を使わない（SC-002 / User Story 2）

1. 工程を1回走らせる。
2. 次の作業単位が解放された箇所をすべて挙げる。
3. **確認すること**: 解放の根拠がすべて `scripts/check-test-integrity.sh` / `scripts/check-catastrophic.sh` / E2E の終了コードであり、AI の判断を根拠にした解放が0件。

```sh
bash scripts/check-test-integrity.sh origin/main
echo "exit: $?"
bash scripts/check-catastrophic.sh
echo "exit: $?"
```

## 検証4: 単一の AI と比べられる（SC-003 / User Story 3）

1. 同じ対象を、単一の AI に全部やらせる方法でも1回走らせる。
2. 両方について [contracts/run-record.md](./contracts/run-record.md) の形式で記録を書く。
3. **確認すること**: `docs/measurements/` に同じ対象の記録が2件あり、指標ごとに並べて比較できる。

## 検証5: 中断しても進捗が失われない（SC-005）

1. 実行の途中で止める。
2. 再開する。
3. **確認すること**: 成功済みの作業単位が再実行されていない。

> **注意**: dynamic workflow の resume は、失敗した agent の**後に始まった成功済みの agent も再実行**します（[research.md](./research.md) 決定3）。この検証は `/batch` の pull request 単位で行ってください。

## 終わったら

門②（`prompts/drift-detector.md`）を、**作業していない別のエージェント**に回します。
