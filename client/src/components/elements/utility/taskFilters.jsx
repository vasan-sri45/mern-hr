// Simple text search across title, description, assigned-to name
export const matchesSearch = (task, q) => {
  if (!q) return true;
  const needle = q.toLowerCase();
  const title = (task?.title || '').toLowerCase();
  const description = (task?.description || '').toLowerCase();
  const assigned = (task?.assignedTo?.name || task?.assignedTo || '').toString().toLowerCase();
  return title.includes(needle) || description.includes(needle) || assigned.includes(needle);
};

// Completed/not-completed counters
export const computeStatusCounts = (tasks) => {
  let completed = 0;
  let notCompleted = 0;
  for (const t of tasks) {
    if (t?.status === 'completed') completed += 1;
    else notCompleted += 1; // pending + in_progress + others treated as not-completed
  }
  return { completed, notCompleted };
};
