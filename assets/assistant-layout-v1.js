const root = document.querySelector('#root');
let mounted;

function attachConversation(page, thread, composer) {
  const history = thread.parentElement;
  history.setAttribute('role', 'region');
  history.setAttribute('aria-label', 'Historial de conversación');
  history.tabIndex = 0;
  composer.dataset.chatComposer = '';

  const decorativeVideo = page.querySelector('video[src*="jwst-highlights"]');
  if (decorativeVideo) {
    decorativeVideo.pause();
    decorativeVideo.removeAttribute('src');
    decorativeVideo.load();
  }

  let items = thread.childElementCount;
  let follow = true;
  const keepLatestVisible = () => {
    if (follow) history.scrollTop = history.scrollHeight;
  };
  const trackScroll = () => {
    follow = history.scrollHeight - history.clientHeight - history.scrollTop <= 48;
  };
  const changes = new MutationObserver(() => {
    if (items !== thread.childElementCount) {
      items = thread.childElementCount;
      follow = true;
    }
    keepLatestVisible();
  });
  const dimensions = new ResizeObserver(keepLatestVisible);

  history.addEventListener('scroll', trackScroll, { passive: true });
  changes.observe(thread, { subtree: true, characterData: true, childList: true });
  dimensions.observe(history);
  keepLatestVisible();

  return {
    page,
    cleanup() {
      changes.disconnect();
      dimensions.disconnect();
      history.removeEventListener('scroll', trackScroll);
    },
  };
}

function install() {
  if (mounted?.page.isConnected) return;
  mounted?.cleanup();
  mounted = undefined;
  const page = root.querySelector('main .assistant-theme');
  const thread = page?.querySelector('section[aria-live="polite"]');
  const composer = page?.querySelector('textarea[aria-label="Mensaje para el asistente"]')?.closest('form')?.parentElement;
  if (page && thread && composer) mounted = attachConversation(page, thread, composer);
}

if (root) {
  new MutationObserver(install).observe(root, { subtree: true, childList: true });
  install();
}
