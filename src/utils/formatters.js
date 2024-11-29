export const formatViews = (views) => {
  // If views is undefined (not loaded yet), return empty string instead of '0'
  if (views === undefined) return '';
  if (!views) return '0';
  if (views >= 1000000) {
    return (Math.floor((views / 100000)) / 10).toFixed(1) + 'M';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K';
  }
  return views.toLocaleString();
};
