import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
};

// Instead of relayMessage (Plasmo relay), listen for window.postMessage
// and forward to the extension background. Works in Orion and other browsers
// where the Plasmo relay script doesn't inject properly.

const messageNames = ['hello', 'makeRequest', 'prepareStream', 'openPage'] as const;

window.addEventListener('message', async (event) => {
  if (event.source !== window) return;
  if (event.data?.type !== 'pstream-ext-request') return;
  if (!messageNames.includes(event.data.name)) return;

  const { name, id, body } = event.data;

  try {
    const response = await chrome.runtime.sendMessage({ name, body });
    window.postMessage({ type: 'pstream-ext-response', id, response }, '*');
  } catch (err) {
    window.postMessage({
      type: 'pstream-ext-response',
      id,
      response: { success: false, error: String(err) },
    }, '*');
  }
});
