const mapping: Record<string, string> = {
  models: 'model',
  organizations: 'organization',
  'robustness-checks': 'robustness_check',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
