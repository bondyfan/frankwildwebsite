export const formatViews = (views) => {
  if (!views) return '0';
  if (views >= 1000000) {
    return (Math.floor((views / 100000)) / 10).toFixed(1) + 'M';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K';
  }
  return views.toLocaleString();
};
