const parseMonthRange = (monthStr) => {
  const now = new Date();
  const [y, m] =
    monthStr && /^\d{4}-\d{2}$/.test(monthStr)
      ? [Number(monthStr.slice(0, 4)), Number(monthStr.slice(5, 7))]
      : [now.getFullYear(), now.getMonth() + 1];
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));
  return { y, m, start, end };
};

export default parseMonthRange;