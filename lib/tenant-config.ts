export const TENANT_CONFIG = {
  brandName: 'Varus Premium',
  planName: 'Premium',
  dashboardBlocks: [
    'usage-stats',
    'redeem-coupon',
    'partner-services',
    'insurance',
    'retail-benefits',
  ] as const,
}

export type DashboardBlock = (typeof TENANT_CONFIG.dashboardBlocks)[number]
