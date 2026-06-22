import { ROLES } from './constants';

export const PERMISSION_MATRIX = {
  [ROLES.GST]: ['VIEW_ONLY'],
  [ROLES.BYR]: ['BUY', 'DOWNLOAD', 'REVIEW', 'REFERRAL', 'MEMBERSHIP'],
  [ROLES.SLR]: ['MANAGE_PRODUCTS', 'SALES', 'BALANCE', 'STATISTICS'],
  [ROLES.CS]: ['CUSTOMER_SERVICE_PANEL'],
  [ROLES.SLS]: ['SALES_PANEL'],
  [ROLES.OP]: ['MODERATION', 'BANNER_MANAGE', 'FAQ_MANAGE', 'ANNOUNCEMENT_MANAGE'],
  [ROLES.SPV]: ['MONITORING', 'AUDIT_VIEW'],
  [ROLES.ADM]: ['FULL_ACCESS']
};

export const hasPermission = (userRole, action) => {
  if (userRole === ROLES.ADM) return true;
  const permissions = PERMISSION_MATRIX[userRole] || [];
  return permissions.includes(action);
};
