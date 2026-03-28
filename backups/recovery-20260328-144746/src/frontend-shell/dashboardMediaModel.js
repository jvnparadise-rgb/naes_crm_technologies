export function createDashboardMediaModel({
  provider = 'vimeo',
  embedUrl = '',
  title = 'Dashboard Tutorial'
} = {}) {
  return {
    type: 'DashboardMedia',
    provider,
    embedUrl,
    title
  };
}
