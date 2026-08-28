#!/usr/bin/env bash
# ============================================================================
# acceptance.sh — 統合の受入検査
#
# 3つの担当がそれぞれ作った部品を組み合わせて、実際にコマンドが動くかを見る。
# 担当ごとの単体テストとは別。ここは「噛み合ったか」を見る。
#
# 終了コード: 0 = 全件通過 / 1 = 1件でも落ちた
# ============================================================================
set -u

HERE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
CLI="node $HERE/src/cli.js"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

fail=0
n=0

check() { # <番号> <説明> <期待> <実際>
  n=$((n + 1))
  if [ "$4" = "$3" ]; then
    printf 'ok   %s %s\n' "$1" "$2"
  else
    printf 'FAIL %s %s\n' "$1" "$2"
    printf '       期待: %s\n' "$3"
    printf '       実際: %s\n' "$4"
    fail=$((fail + 1))
  fi
}

# --- 検査1: 数値列の要約が出る -------------------------------------------
cat > "$TMP/a.csv" <<'CSV'
name,score
alice,10
bob,20
carol,30
CSV
out=$($CLI "$TMP/a.csv" 2>/dev/null | grep '^score:')
check 1 "数値列の集計" "score: 件数=3 空欄=0 数値=3 最小=10 最大=30 合計=60 平均=20" "$out"

# --- 検査2: 空欄を数える ---------------------------------------------------
cat > "$TMP/b.csv" <<'CSV'
name,score
alice,
bob,20
carol,
CSV
out=$($CLI "$TMP/b.csv" 2>/dev/null | grep '^score:')
check 2 "空欄の件数" "score: 件数=3 空欄=2 数値=1 最小=20 最大=20 合計=20 平均=20" "$out"

# --- 検査3: 数値が無い列は「数値なし」 -------------------------------------
out=$($CLI "$TMP/a.csv" 2>/dev/null | grep '^name:')
check 3 "文字だけの列" "name: 件数=3 空欄=0 数値なし" "$out"

# --- 検査4: 引用符の中のカンマで列がずれない -------------------------------
cat > "$TMP/c.csv" <<'CSV'
name,note,score
alice,"a,b",10
bob,"c,d,e",20
CSV
out=$($CLI "$TMP/c.csv" 2>/dev/null | grep '^score:')
check 4 "引用符の中のカンマ" "score: 件数=2 空欄=0 数値=2 最小=10 最大=20 合計=30 平均=15" "$out"

# --- 検査5: 読めないファイルは止まる ---------------------------------------
$CLI "$TMP/does-not-exist.csv" >/dev/null 2>&1
check 5 "読めないファイルで止まる" "1" "$?"

# --- 集計 -----------------------------------------------------------------
printf '\n1..%s\n' "$n"
if [ "$fail" -gt 0 ]; then
  printf 'RESULT: FAIL (%s / %s 件が落ちた)\n' "$fail" "$n"
  exit 1
fi
printf 'RESULT: PASS (%s / %s 件)\n' "$n" "$n"
exit 0
