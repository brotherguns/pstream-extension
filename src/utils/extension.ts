export const isChrome = () => {
  const url = chrome.runtime.getURL("");
  // Orion browser on iOS uses the safari-extension:// scheme but exposes full
  // Chrome extension APIs, so treat it the same as a standard Chrome extension.
  return (
    url.startsWith("chrome-extension://") ||
    url.startsWith("safari-extension://")
  );
};

export const isFirefox = () => {
  try {
    return browser.runtime.getURL('').startsWith('moz-extension://');
  } catch {
    return false;
  }
};
