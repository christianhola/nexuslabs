const root = document.querySelector('#root');
const template = document.querySelector('#nexus-orbit-template');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let mounted;

function installSatellite(after) {
  const hero = template.content.firstElementChild.cloneNode(true);
  const media = hero.querySelector('.nexus-orbit__media');
  const video = media.querySelector('video');
  const playback = hero.querySelector('.nexus-orbit__playback');
  const signal = new AbortController();
  let onScreen = false;
  let pausedByUser = false;

  function showControl(playing) {
    playback.textContent = playing ? 'Ⅱ' : '▶';
    playback.setAttribute('aria-label', playing ? 'Pausar el satélite' : 'Reproducir el satélite');
  }

  function syncPlayback() {
    if (preference.matches || document.hidden || !onScreen || pausedByUser) {
      video.pause();
      showControl(false);
      return;
    }
    if (!video.querySelector('source')) {
      for (const [url, type] of [[video.dataset.mp4, 'video/mp4'], [video.dataset.webm, 'video/webm']]) {
        const source = document.createElement('source');
        source.src = url;
        source.type = type;
        video.append(source);
      }
    }
    video.muted = true;
    video.defaultMuted = true;
    video.play().catch(() => showControl(false));
  }

  video.addEventListener('playing', () => {
    showControl(true);
    if ('requestVideoFrameCallback' in video) {
      video.requestVideoFrameCallback(() => { media.dataset.frame = 'true'; });
    } else {
      media.dataset.frame = 'true';
    }
  }, { signal: signal.signal });
  video.addEventListener('pause', () => showControl(false), { signal: signal.signal });
  video.addEventListener('error', () => {
    delete media.dataset.frame;
    showControl(false);
  }, { signal: signal.signal });
  playback.addEventListener('click', () => {
    pausedByUser = !video.paused;
    syncPlayback();
  }, { signal: signal.signal });
  for (const [target, event] of [[preference, 'change'], [document, 'visibilitychange']]) {
    target.addEventListener(event, syncPlayback, { signal: signal.signal });
  }
  hero.querySelector('a').addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const catalog = after.querySelector('a[href="/nexuslabs/plantillas"]');
    if (!catalog) return;
    event.preventDefault();
    catalog.click();
  }, { signal: signal.signal });

  const intersection = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    syncPlayback();
  });
  after.before(hero);
  intersection.observe(video);
  syncPlayback();
  return {
    hero,
    dispose() { signal.abort(); intersection.disconnect(); video.pause(); },
  };
}

function mountOnHome() {
  if (mounted?.hero.isConnected) return;
  mounted?.dispose();
  mounted = undefined;
  const original = root.querySelector('section#inicio');
  if (original) mounted = installSatellite(original);
}

if (root && template) {
  new MutationObserver(mountOnHome).observe(root, { childList: true, subtree: true });
  mountOnHome();
}
