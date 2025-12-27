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

export const toDateInput = (value?: string): string => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDateInput = (value?: string): Date | null => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

export const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const normalizeDateRange = (start?: string, end?: string) => {
  if (!start && !end) {
    return { startDate: undefined, endDate: undefined };
  }

  const normalizedStart = start || end || '';
  const normalizedEnd = end || start || '';

  if (!normalizedStart || !normalizedEnd) {
    return { startDate: normalizedStart || undefined, endDate: normalizedEnd || undefined };
  }

  if (normalizedStart > normalizedEnd) {
    return { startDate: normalizedEnd, endDate: normalizedStart };
  }

  return { startDate: normalizedStart, endDate: normalizedEnd };
};

export const isSameDate = (a: Date, b: Date) => toDateKey(a) === toDateKey(b);
