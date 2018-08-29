export const checkIsChrome = (navigator) => {
  return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
};

export const dummy = null;
