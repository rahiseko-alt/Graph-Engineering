// 年月日と結果の形。時刻とタイムゾーンは扱わない（spec.md の No Gos）。
//
// YMD: { y: number, m: number, d: number }  m は 1-12、d は 1-31
// 失敗は例外ではなく、呼び出し側が終了コード 1 で止められるように
// Error を throw する。黙って既定値を返す経路は作らない（停止4領域「日付」）。

/** 日付として受け付けない値を受け取ったときに投げる。 */
export class DateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DateError';
  }
}
