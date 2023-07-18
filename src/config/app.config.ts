interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Data Scientist'],
  customerRoles: [],
  tenantRoles: ['Administrator', 'Security Analyst', 'Data Scientist'],
  tenantName: 'Organization',
  applicationName: 'ControlAI',
  addOns: ['chat', 'notifications', 'file'],
};
