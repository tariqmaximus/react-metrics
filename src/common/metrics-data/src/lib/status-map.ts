export const statusMap: Record<string, string> = {
  scheduled: 'success',
  inprogress: 'info',
  converted: 'success',
  pending: 'warning',
  confirmed: 'info',
  completed: 'success',
  failed: 'danger',
  archived: 'muted',
  cancelled: 'danger',
  lost: 'danger',
  backlog: 'light',
  active: 'success',
  inactive: 'default',
  deleted: 'danger',
  rejected: 'danger',
  new: 'primary',
  closed: 'secondary'
};
