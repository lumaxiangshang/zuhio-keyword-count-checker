// 用户权限管理系统

export type UserPlan = 'free' | 'pro' | 'business';

export interface UserPermissions {
  plan: UserPlan;
  dailyLimit: number;
  maxWordsPerAnalysis: number;
  historyDays: number;
  canExport: boolean;
  canBulkAnalyze: boolean;
  bulkLimit: number;
  canAccessAPI: boolean;
  apiLimit: number;
  teamSeats: number;
  canWhiteLabel: boolean;
}

// 各等级权限配置
export const permissionsByPlan: Record<UserPlan, UserPermissions> = {
  free: {
    plan: 'free',
    dailyLimit: 3,
    maxWordsPerAnalysis: 500,
    historyDays: 0,
    canExport: false,
    canBulkAnalyze: false,
    bulkLimit: 0,
    canAccessAPI: false,
    apiLimit: 0,
    teamSeats: 1,
    canWhiteLabel: false,
  },
  pro: {
    plan: 'pro',
    dailyLimit: 10,
    maxWordsPerAnalysis: 2000,
    historyDays: 7,
    canExport: false,
    canBulkAnalyze: false,
    bulkLimit: 0,
    canAccessAPI: false,
    apiLimit: 0,
    teamSeats: 1,
    canWhiteLabel: false,
  },
  business: {
    plan: 'business',
    dailyLimit: Infinity,
    maxWordsPerAnalysis: Infinity,
    historyDays: 30,
    canExport: true,
    canBulkAnalyze: true,
    bulkLimit: 5,
    canAccessAPI: true,
    apiLimit: 1000,
    teamSeats: 5,
    canWhiteLabel: true,
  },
};

// 检查用户是否有权限执行操作
export const checkPermission = (
  userPlan: UserPlan,
  action: keyof UserPermissions
): boolean => {
  const permissions = permissionsByPlan[userPlan];
  return !!permissions[action];
};

// 检查用户是否超出限制
export const checkLimit = (
  userPlan: UserPlan,
  action: 'dailyLimit' | 'maxWordsPerAnalysis' | 'bulkLimit' | 'apiLimit',
  currentValue: number
): { allowed: boolean; limit: number } => {
  const permissions = permissionsByPlan[userPlan];
  const limit = permissions[action];
  return {
    allowed: currentValue < limit,
    limit,
  };
};

// 获取用户剩余次数
export const getRemainingUsage = (
  userPlan: UserPlan,
  usedToday: number
): number => {
  const permissions = permissionsByPlan[userPlan];
  const remaining = permissions.dailyLimit - usedToday;
  return remaining > 0 ? remaining : 0;
};

// 升级提示文案
export const getUpgradeMessage = (
  userPlan: UserPlan,
  action: string
): string => {
  const messages: Record<string, string> = {
    export: 'Upgrade to Pro to export reports as PDF/CSV',
    bulk: 'Upgrade to Pro to analyze multiple articles at once',
    history: 'Upgrade to Pro to access 30-day history',
    api: 'Upgrade to Business to access our API',
    team: 'Upgrade to Business to collaborate with your team',
  };

  return (
    messages[action] || `Upgrade to unlock this feature`
  );
};

// 默认免费用户权限（未登录）
export const guestPermissions: UserPermissions = {
  plan: 'free',
  dailyLimit: 3,
  maxWordsPerAnalysis: 500,
  historyDays: 0,
  canExport: false,
  canBulkAnalyze: false,
  bulkLimit: 0,
  canAccessAPI: false,
  apiLimit: 0,
  teamSeats: 1,
  canWhiteLabel: false,
};
