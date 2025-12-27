export const toDateTimeLocal = (iso?: string): string => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const pad = (value: number) => String(value).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const fromDateTimeLocal = (value?: string): string | undefined => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
};

/**
 * 日付文字列をyyyy-mm-dd形式に変換
 */
export const toDateString = (iso?: string): string => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const pad = (value: number) => String(value).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  return `${year}-${month}-${day}`;
};

/**
 * yyyy-mm-dd形式からISO文字列に変換
 */
export const fromDateString = (value?: string): string | undefined => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
};

/**
 * 2つの日付が同じ日（年月日）かを判定
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * 指定された日付が今日かを判定
 */
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

/**
 * 日付範囲を正規化する
 * - 両方空なら両方undefined
 * - 片方のみの場合は両方同じ値にする
 * - start > endの場合は入れ替える
 */
export const normalizeDateRange = (start?: string, end?: string): { start?: string; end?: string; swapped: boolean } => {
  // 両方空の場合
  if (!start && !end) {
    return { start: undefined, end: undefined, swapped: false };
  }

  // 片方のみの場合は同じ値を使用
  const actualStart = start || end;
  const actualEnd = end || start;

  // 日付として比較
  const startDate = new Date(actualStart!);
  const endDate = new Date(actualEnd!);

  // 無効な日付の場合はそのまま返す（バリデーションで弾かれる）
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return { start: actualStart, end: actualEnd, swapped: false };
  }

  // start > end の場合は入れ替え
  if (startDate > endDate) {
    return { start: actualEnd, end: actualStart, swapped: true };
  }

  return { start: actualStart, end: actualEnd, swapped: false };
};

/**
 * 開始日から終了日までの日付キー配列を生成
 */
export const getDateRangeKeys = (startDate: string, endDate: string): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return [];
  }

  const keys: string[] = [];
  const current = new Date(start);

  while (current <= end) {
    const year = current.getFullYear();
    const month = `${current.getMonth() + 1}`.padStart(2, '0');
    const day = `${current.getDate()}`.padStart(2, '0');
    keys.push(`${year}-${month}-${day}`);
    current.setDate(current.getDate() + 1);
  }

  return keys;
};
