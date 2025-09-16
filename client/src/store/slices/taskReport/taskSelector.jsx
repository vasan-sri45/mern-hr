// src/features/taskStats/selectors.js
import { createSelector } from 'reselect';

export const selectAdminMonthlySummary = (state) => state.taskStats.adminSummary;
export const selectMyMonthlyReport = (state) => state.taskStats.myReport;

export const selectPerformance = createSelector([selectMyMonthlyReport], (myReport) => {
  const s = myReport?.summary || {};
  const total = Number(s.totalTasks) || 0;
  const completed = Number(s.completedTasks) || 0;
  const pending = Number(s.pendingTasks != null ? s.pendingTasks : Math.max(total - completed, 0)) || 0;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const label = pct >= 80 ? 'Good' : pct >= 50 ? 'Average' : 'Low';
  return { month: myReport?.month || null, total, completed, pending, pct, label };
});
