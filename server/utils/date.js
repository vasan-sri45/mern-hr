// utils/date.js
export const startEndOfDayUTC = (d = new Date()) => {
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const date = d.getUTCDate();
  const start = new Date(Date.UTC(year, month, date, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, date, 23, 59, 59, 999));
  const dayKey = `${year}-${String(month + 1).padStart(2,'0')}-${String(date).padStart(2,'0')}`;
  return { start, end, dayKey };
};
