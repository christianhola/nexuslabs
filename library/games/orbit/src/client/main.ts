import '@fontsource-variable/dm-sans'
import './style.css'
import { SKINS, ROOMS, WORLD } from '../shared/config'
import {
  cleanName,
  skinIndex,
  type Result,
  type Snapshot,
  type FoodWire,
} from '../shared/protocol'
import { Renderer } from './render'
import { World } from '../shared/physics'
const $ = <T extends HTMLElement = HTMLElement>(s: string) =>
  document.querySelector<T>(s)!
const safe = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  )
const paths: Record<string, string> = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  sound:
    '<path d="m11 5-6 4H2v6h3l6 4V5Zm4 3a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  muted: '<path d="m11 5-6 4H2v6h3l6 4V5Zm5 4 5 6m0-6-5 6"/>',
  expand: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .6-1.5 1-1.5 2m0 3h.01"/>',
  chevron: '<path d="m8 10 4 4 4-4"/>',
  split: '<circle cx="7.5" cy="12" r="5"/><circle cx="18" cy="12" r="3.5"/>',
  feed: '<circle cx="8" cy="12" r="5"/><circle cx="18" cy="12" r="1.5"/>',
  mouse: '<rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 2v7"/>',
  crown: '<path d="m3 6 4 5 5-7 5 7 4-5-2 14H5L3 6Z"/>',
  back: '<path d="M19 12H5m6-6-6 6 6 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
}
const icon = (n: string, s = 20) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[n]}</svg>`
const mark =
  '<span class="mark" aria-hidden="true"><i></i><i></i><i></i></span>'
const store = {
  get(k: string) {
    try {
      return localStorage.getItem(`orbit-${k}`)
    } catch {
      return null
    }
  },
  set(k: string, v: string) {
    try {
      localStorage.setItem(`orbit-${k}`, v)
    } catch {}
  },
}
let foods = new Map<number, FoodWire>()
const renderer = new Renderer($('#world'))
let skin = skinIndex(Number(store.get('skin'))),
  name = store.get('name') ?? '',
  room = new URL(location.href).searchParams.get('room') ?? 'meadow'
if (!ROOMS.some((r) => r.id === room)) room = 'meadow'
renderer.skin = skin
let account: { name: string } | null = null,
  profile: {
    best: number
    rounds: number
    eaten: number
    seconds: number
    skin: number
  } | null = null,
  authEnabled = false
let active = false,
  connecting = false,
  ended = true,
  ws: WebSocket | null = null,
  resume = '',
  seq = 0,
  latest: Snapshot | null = null
let retries = 0,
  latency = 0,
  lastHud = 0,
  pingAt = 0,
  reconnectTimer: ReturnType<typeof setTimeout> | undefined
// Offline practice mode: the same simulation the server runs, with bots, when
// the multiplayer Worker is unavailable (static demo hosting).
let localWorld: World | null = null,
  localId = '',
  localTimer: ReturnType<typeof setInterval> | undefined
let actionSplit = false,
  actionFeed = false,
  feedHeld = false,
  pointer = { x: innerWidth / 2, y: innerHeight / 2 },
  touch = { id: -1, x: 0, y: 0, dx: 0, dy: 0 }
let audio: AudioContext | undefined,
  muted = store.get('sound') !== 'on',
  lastPop = 0,
  returnFocus: HTMLElement | null = null
$('#app').innerHTML = `
<header class="topbar"><button id="brand" class="brand" aria-label="Orbit home">${mark}<span>orbit</span></button><div class="top-actions"><button class="icon-button" id="help" aria-label="How to play">${icon('help')}</button><button class="icon-button" id="sound" aria-label="Turn sound on">${icon('muted')}</button><button class="icon-button fullscreen" id="fullscreen" aria-label="Fullscreen">${icon('expand')}</button></div></header>
<main id="lobby" class="lobby"><div class="lobby-content"><div class="hero-cell" aria-hidden="true"><canvas id="hero" width="320" height="320"></canvas><span class="satellite"></span></div><h1>orbit<span class="title-period">.</span></h1><form id="join-form"><label class="sr-only" for="name">Your name</label><input id="name" autocomplete="nickname" placeholder="Your name" maxlength="18" spellcheck="false" value="${safe(name)}"><div id="skins" class="skins" role="group" aria-label="Cell skin">${SKINS.map((s, i) => `<button type="button" class="skin ${i === skin ? 'selected' : ''}" data-skin="${i}" title="${s.name}" aria-label="${s.name}" aria-pressed="${i === skin}" style="--skin-light:${s.light};--skin-mid:${s.mid};--skin-dark:${s.dark}"><span></span></button>`).join('')}</div><div class="room-wrap"><button type="button" id="room-select" class="room-select" aria-expanded="false" aria-controls="room-options"><span class="room-title"><span class="live-dot"></span><span id="room-name">${ROOMS.find((r) => r.id === room)!.name}</span></span><span class="room-detail"><span id="room-count">Open room</span>${icon('chevron', 16)}</span></button><div id="room-options" class="room-options" hidden></div></div><button type="submit" id="play" class="primary"><span>Play</span>${icon('arrow')}</button></form><div id="account" class="account"></div><div id="personal-best" class="personal-best" hidden></div></div></main>
<div id="hud" class="hud" hidden><div class="score-panel"><span class="score-label">Mass</span><span id="score" class="score">28</span><span class="best">${icon('crown', 13)}<span id="best">28</span></span></div><aside class="leaderboard"><div class="board-heading"><span>Leaderboard</span><span id="rank"></span></div><ol id="leaders"></ol></aside><div class="map-panel"><canvas id="minimap" width="112" height="112" aria-label="Arena minimap"></canvas><div class="map-meta"><span id="arena-name"></span><span id="ping"></span></div></div><div class="game-actions"><button id="split" class="action">${icon('split')}<span>Split</span><kbd>Space</kbd></button><button id="feed" class="action">${icon('feed')}<span>Feed</span><kbd>w</kbd></button></div><button class="icon-button leave" id="leave" aria-label="Leave arena">${icon('back')}</button><div id="connection" class="connection" hidden>Reconnecting…</div></div>
<footer id="footer"><span class="footer-live"><span class="live-dot"></span>Live multiplayer</span><div class="control-hints"><span>${icon('mouse', 15)} Move</span><span><kbd>Space</kbd> Split</span><span><kbd>w</kbd> Feed</span></div><span class="footer-note">A little bigger.</span></footer><div id="joystick" aria-hidden="true" hidden><span></span></div><div id="toast" role="status" aria-live="polite" hidden></div><div id="modal" class="modal" hidden><div id="modal-content" class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title"></div></div>`
renderer.minimap = $<HTMLCanvasElement>('#minimap')
function paintHero() {
  const c = $<HTMLCanvasElement>('#hero').getContext('2d')!
  c.clearRect(0, 0, 320, 320)
  c.drawImage(renderer.sprite(skin, 300), 0, 0, 320, 320)
  renderer.skin = skin
}
paintHero()
let toastTimer: ReturnType<typeof setTimeout>
function toast(text: string) {
  $('#toast').textContent = text
  $('#toast').hidden = false
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => ($('#toast').hidden = true), 4000)
}
function showModal(html: string) {
  returnFocus = document.activeElement as HTMLElement
  $('#modal-content').innerHTML = html
  $('#modal').hidden = false
  $('#modal-content').querySelector<HTMLElement>('button,a,input')?.focus()
}
function closeModal() {
  $('#modal').hidden = true
  returnFocus?.focus()
}
function sound(freq: number, duration = 0.08, volume = 0.04) {
  if (muted) return
  try {
    audio ??= new AudioContext()
    if (audio.state === 'suspended') void audio.resume()
    const o = audio.createOscillator(),
      g = audio.createGain(),
      at = audio.currentTime
    o.type = 'sine'
    o.frequency.setValueAtTime(freq, at)
    o.frequency.exponentialRampToValueAtTime(freq * 0.7, at + duration)
    g.gain.setValueAtTime(volume, at)
    g.gain.exponentialRampToValueAtTime(0.001, at + duration)
    o.connect(g)
    g.connect(audio.destination)
    o.start(at)
    o.stop(at + duration)
  } catch {}
}
renderer.onEat = () => {
  if (performance.now() - lastPop > 100) {
    sound(650 + Math.random() * 200, 0.065, 0.022)
    lastPop = performance.now()
  }
}
function renderSound() {
  $('#sound').innerHTML = icon(muted ? 'muted' : 'sound')
  $('#sound').setAttribute('aria-label', muted ? 'Turn sound on' : 'Mute sound')
}
$('#sound').onclick = () => {
  muted = !muted
  store.set('sound', muted ? 'off' : 'on')
  renderSound()
  if (!muted) sound(480)
}
renderSound()
$('#fullscreen').onclick = () => {
  ;(document.fullscreenElement
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen()
  ).catch(() => toast('Fullscreen is unavailable in this window.'))
}
$('#help').onclick = () =>
  showModal(
    `<button class="icon-button modal-close" data-close aria-label="Close">${icon('close')}</button><div class="modal-symbol">${mark}</div><h2 id="modal-title">A little bigger.</h2><div class="help-list"><div><span>${icon('mouse')} Move</span><p>Follow your cursor. Drag on touch.</p></div><div><span>${icon('split')} Split <kbd>Space</kbd></span><p>Catch smaller cells. Rejoin after a moment.</p></div><div><span>${icon('feed')} Feed <kbd>w</kbd></span><p>Share a little mass.</p></div></div><p class="help-note">Eat the dots. Outgrow your neighbours.<br>Spiky cells split you. Bots fill quiet rooms.</p><button class="primary" data-close>Got it ${icon('check')}</button>`,
  )
$('#modal').onclick = (e) => {
  if (e.target === $('#modal') || (e.target as Element).closest('[data-close]'))
    closeModal()
}
function updateSkins() {
  paintHero()
  for (const b of document.querySelectorAll<HTMLElement>('[data-skin]')) {
    const on = Number(b.dataset.skin) === skin
    b.classList.toggle('selected', on)
    b.setAttribute('aria-pressed', String(on))
  }
}
$('#skins').onclick = async (e) => {
  const b = (e.target as Element).closest<HTMLButtonElement>('[data-skin]')
  if (!b) return
  skin = Number(b.dataset.skin)
  store.set('skin', String(skin))
  updateSkins()
  if (account)
    try {
      const r = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skin }),
      })
      if (!r.ok)
        toast('Skin saved on this device. Account sync is unavailable.')
    } catch {
      toast('Skin saved on this device. Account sync is unavailable.')
    }
}
function renderAccount() {
  $('#account').innerHTML = account
    ? `<button id="profile-button" class="text-button">${safe(account.name)} ${icon('chevron', 14)}</button>`
    : authEnabled
      ? `<a class="signin" href="/auth/freebuff/signin?returnTo=%2F">Sign in with Freebuff ${icon('arrow', 14)}</a>`
      : ''
  if (account)
    $('#profile-button').onclick = () =>
      showModal(
        `<button class="icon-button modal-close" data-close aria-label="Close">${icon('close')}</button><h2 id="modal-title">${safe(account!.name)}</h2><div class="result-stats"><div><strong>${profile?.best ?? 0}</strong><span>Best mass</span></div><div><strong>${profile?.rounds ?? 0}</strong><span>Rounds</span></div><div><strong>${profile?.eaten ?? 0}</strong><span>Eaten</span></div></div><form action="/auth/freebuff/signout" method="post"><button class="secondary" type="submit">Sign out</button></form>`,
      )
  const best = Math.max(profile?.best ?? 0, Number(store.get('best') ?? 0))
  $('#personal-best').hidden = best === 0
  $('#personal-best').innerHTML =
    `${icon('crown', 14)} Personal best <b>${best.toLocaleString()}</b>`
}
async function loadAccount() {
  try {
    const r = await fetch('/api/me')
    if (!r.ok) return
    const d = (await r.json()) as {
      user: { name: string } | null
      profile: typeof profile
      authEnabled: boolean
    }
    account = d.user
    profile = d.profile
    authEnabled = d.authEnabled
    if (profile) {
      skin = skinIndex(profile.skin)
      updateSkins()
    }
    if (account && !name)
      $<HTMLInputElement>('#name').value = cleanName(account.name.split(' ')[0])
  } catch {}
  renderAccount()
}
renderAccount()
void loadAccount()
type RoomInfo = {
  id: string
  name: string
  color: string
  players: number
  bots: number
  capacity: number
}
let rooms: RoomInfo[] = []
async function loadRooms() {
  if (active || document.hidden) return
  try {
    const r = await fetch('/api/rooms')
    if (!r.ok) return
    rooms = ((await r.json()) as { rooms: RoomInfo[] }).rooms
    renderRooms()
  } catch {
    $('#room-count').textContent = 'Practice with bots'
  }
}
function renderRooms() {
  const current = rooms.find((r) => r.id === room)
  $('#room-name').textContent = ROOMS.find((r) => r.id === room)!.name
  $('#room-count').textContent = current
    ? `${current.players}/${current.capacity} players`
    : 'Open room'
  $('#room-options').innerHTML = rooms
    .map(
      (r) =>
        `<button type="button" data-room="${r.id}" ${r.players >= r.capacity ? 'disabled' : ''}><span><i style="background:${r.color}"></i>${r.name}</span><small>${r.players}/${r.capacity}${r.id === room ? ` ${icon('check', 13)}` : ''}</small></button>`,
    )
    .join('')
}
$('#room-select').onclick = () => {
  const open = $('#room-options').hidden
  $('#room-options').hidden = !open
  $('#room-select').setAttribute('aria-expanded', String(open))
  if (open) void loadRooms()
}
$('#room-options').onclick = (e) => {
  const b = (e.target as Element).closest<HTMLButtonElement>('[data-room]')
  if (!b) return
  room = b.dataset.room!
  $('#room-options').hidden = true
  $('#room-select').setAttribute('aria-expanded', 'false')
  renderRooms()
}
addEventListener('pointerdown', (e) => {
  if (!(e.target as Element).closest('.room-wrap')) {
    $('#room-options').hidden = true
    $('#room-select').setAttribute('aria-expanded', 'false')
  }
})
void loadRooms()
const roomTimer = setInterval(loadRooms, 12000)
function setPlaying(v: boolean) {
  active = v
  renderer.playing = v
  $('#lobby').hidden = v
  $('#hud').hidden = !v
  $('#footer').hidden = v
  document.body.classList.toggle('playing', v)
  $('#arena-name').textContent = ROOMS.find((r) => r.id === room)!.name
}
function buttonState() {
  const b = $<HTMLButtonElement>('#play')
  b.disabled = connecting
  b.innerHTML = connecting
    ? '<span class="spinner"></span><span>Joining…</span>'
    : `<span>Play</span>${icon('arrow')}`
}
function stopLocal() {
  if (localTimer) clearInterval(localTimer)
  localTimer = undefined
  localWorld = null
  localId = ''
}
function startLocal() {
  if (active || connecting) return
  stopLocal()
  const world = new World()
  localId = 'you'
  world.spawn(localId, name || 'You', skin)
  world.balanceBots()
  localWorld = world
  ended = false
  connecting = false
  renderer.id = localId
  renderer.reset()
  foods.clear()
  buttonState()
  setPlaying(true)
  $('#name').blur()
  $('#room-count').textContent = 'Practice with bots'
  toast('Solo practice with bots — the live room is offline.')
  localTimer = setInterval(() => {
    const room = localWorld
    if (!room) return
    room.step(1 / 30)
    const death = room.deaths.find((entry) => entry.player.id === localId)
    if (death) {
      finish(death.result, death.by)
      stopLocal()
      return
    }
    const snapshot = room.snapshot(localId)
    if (!snapshot) return
    latest = snapshot
    renderer.update(snapshot)
    if (performance.now() - lastHud > 200) {
      updateHud(snapshot)
      lastHud = performance.now()
    }
  }, 1000 / 30)
}
function join() {
  if (connecting || active) return
  closeModal()
  stopLocal()
  name = cleanName($<HTMLInputElement>('#name').value)
  store.set('name', name)
  connecting = true
  ended = false
  resume = ''
  seq = 0
  retries = 0
  renderer.reset()
  foods.clear()
  latest = null
  buttonState()
  sound(340, 0.12)
  connect()
}
$('#join-form').onsubmit = (e) => {
  e.preventDefault()
  join()
}
function connect() {
  const params = new URLSearchParams({ room, name, skin: String(skin) }),
    socket = new WebSocket(
      `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/api/play?${params}`,
      resume ? ['orbit', `resume.${resume}`] : ['orbit'],
    )
  ws = socket
  const timeout = setTimeout(() => {
    if (socket.readyState !== WebSocket.OPEN) socket.close()
  }, 7000)
  socket.onopen = () => {
    clearTimeout(timeout)
    retries = 0
    $('#connection').hidden = true
  }
  socket.onmessage = (e) => {
    if (socket !== ws) return
    const d = JSON.parse(e.data)
    if (d.t === 'hello') {
      foods.clear()
      renderer.id = d.id
      resume = d.resume
      connecting = false
      buttonState()
      if (!active) pointer = { x: innerWidth / 2, y: innerHeight / 2 }
      setPlaying(true)
      $('#name').blur()
    }
    if (d.t === 'state') {
      if (d.foodDelta) {
        for (const id of d.removedFood ?? []) foods.delete(id)
        for (const f of d.food) foods.set(f[0], f)
        d.food = [...foods.values()]
      }
      latest = d
      renderer.update(d)
      if (performance.now() - lastHud > 200) {
        updateHud(d)
        lastHud = performance.now()
      }
    }
    if (d.t === 'pong')
      latency = Math.min(999, Math.round(performance.now() - d.at))
    if (d.t === 'end') {
      ended = true
      finish(d.result, d.by)
    }
    if (d.t === 'error') toast(d.message)
  }
  socket.onclose = (e) => {
    clearTimeout(timeout)
    if (socket !== ws || ended) return
    // No live Worker on static hosting: keep the game playable with bots.
    if (!active && !resume) {
      connecting = false
      startLocal()
      return
    }
    if (resume && retries < 4 && e.code !== 1008 && e.code !== 1000) {
      $('#connection').hidden = false
      reconnectTimer = setTimeout(connect, 650 * ++retries)
      return
    }
    ended = true
    connecting = false
    setPlaying(false)
    buttonState()
    renderer.reset()
    resume = ''
    toast(
      e.code === 1000
        ? 'Round ended. Ready for another?'
        : 'Couldn’t join this room. Try again or choose another.',
    )
    void loadRooms()
  }
  socket.onerror = () => {}
}
function updateHud(s: Snapshot) {
  $('#score').textContent = s.score.toLocaleString()
  $('#best').textContent = s.best.toLocaleString()
  $('#rank').textContent = `#${s.rank}`
  $('#ping').textContent = latency ? `${latency} ms` : ''
  $('#leaders').innerHTML = s.people
    .slice(0, 5)
    .map(
      (p, i) =>
        `<li class="${p.id === renderer.id ? 'you' : ''}"><span class="position">${i + 1}</span><i style="background:${SKINS[p.skin].mid}"></i><span class="player-name">${safe(p.name)}${p.bot ? '<small>bot</small>' : ''}</span><b>${p.mass.toLocaleString()}</b></li>`,
    )
    .join('')
  $<HTMLButtonElement>('#split').disabled =
    !s.cells.some((c) => c[1] === renderer.id && c[4] >= 36) ||
    s.cells.filter((c) => c[1] === renderer.id).length >= 16
  $<HTMLButtonElement>('#feed').disabled = !s.cells.some(
    (c) => c[1] === renderer.id && c[4] >= 42,
  )
}
function finish(r: Result, by: string) {
  connecting = false
  setPlaying(false)
  buttonState()
  resume = ''
  renderer.reset()
  store.set('best', String(Math.max(Number(store.get('best') ?? 0), r.best)))
  renderAccount()
  void loadAccount()
  void loadRooms()
  sound(230, 0.25)
  const time =
    r.seconds >= 60
      ? `${Math.floor(r.seconds / 60)}:${String(r.seconds % 60).padStart(2, '0')}`
      : `${r.seconds}s`
  showModal(
    `<button class="icon-button modal-close" data-close aria-label="Close">${icon('close')}</button><div class="end-blob" style="--skin-light:${SKINS[skin].light};--skin-mid:${SKINS[skin].mid};--skin-dark:${SKINS[skin].dark}"></div><h2 id="modal-title">Nice orbit.</h2><p class="end-by">Eaten by ${safe(by)}</p><div class="result-stats"><div><strong>${r.best.toLocaleString()}</strong><span>Best mass</span></div><div><strong>${time}</strong><span>Survived</span></div><div><strong>${r.eaten}</strong><span>Eaten</span></div></div><button id="again" class="primary">Play again ${icon('arrow')}</button>`,
  )
  $('#again').onclick = join
}
function leave() {
  if (!active) return
  showModal(
    `<button class="icon-button modal-close" data-close aria-label="Close">${icon('close')}</button><h2 id="modal-title">Leave this orbit?</h2><p class="help-note">You're still in play.</p><button class="primary" data-close>Keep playing ${icon('arrow')}</button><button id="confirm-leave" class="secondary">Leave arena</button>`,
  )
  $('#confirm-leave').onclick = () => {
    ended = true
    if (localWorld) stopLocal()
    else ws?.send(JSON.stringify({ t: 'leave' }))
    ws?.close()
    clearTimeout(reconnectTimer)
    connecting = false
    setPlaying(false)
    renderer.reset()
    closeModal()
    void loadRooms()
    setTimeout(loadAccount, 500)
  }
}
$('#leave').onclick = leave
$('#brand').onclick = () => {
  if (active) leave()
}
function split() {
  if (!active || $<HTMLButtonElement>('#split').disabled) return
  actionSplit = true
  sound(250, 0.15, 0.06)
}
function feed() {
  if (!active || $<HTMLButtonElement>('#feed').disabled) return
  actionFeed = true
  sound(430, 0.07, 0.025)
}
$('#split').onpointerdown = (e) => {
  e.preventDefault()
  split()
}
$('#feed').onpointerdown = (e) => {
  e.preventDefault()
  feed()
  feedHeld = true
  $('#feed').setPointerCapture(e.pointerId)
}
$('#feed').onpointerup = $('#feed').onpointercancel = () => (feedHeld = false)
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!$('#modal').hidden) closeModal()
    else if (active) leave()
    else {
      $('#room-options').hidden = true
      $('#room-select').setAttribute('aria-expanded', 'false')
    }
    return
  }
  if (e.key === 'Tab' && !$('#modal').hidden) {
    const controls = [
        ...$('#modal-content').querySelectorAll<HTMLElement>('button,a,input'),
      ],
      first = controls[0],
      last = controls[controls.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
  if (
    !active ||
    !$('#modal').hidden ||
    ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
  )
    return
  if (e.code === 'Space') {
    e.preventDefault()
    if (!e.repeat) split()
  }
  if (e.code === 'KeyW') {
    e.preventDefault()
    feedHeld = true
  }
})
window.addEventListener('keyup', (e) => {
  if (e.code === 'KeyW') feedHeld = false
})
addEventListener('blur', () => {
  feedHeld = false
  touch.id = -1
  touch.dx = touch.dy = 0
  $('#joystick').hidden = true
  pointer = { x: innerWidth / 2, y: innerHeight / 2 }
})
const canvas = $('#world')
canvas.addEventListener('pointermove', (e) => {
  const v = e as PointerEvent
  if (v.pointerType === 'mouse') {
    pointer = { x: v.clientX, y: v.clientY }
    return
  }
  if (v.pointerId === touch.id) {
    const dx = v.clientX - touch.x,
      dy = v.clientY - touch.y,
      d = Math.hypot(dx, dy),
      s = Math.min(1, 48 / Math.max(1, d))
    touch.dx = dx * s
    touch.dy = dy * s
    $('#joystick span').style.transform =
      `translate(${touch.dx}px,${touch.dy}px)`
  }
})
canvas.addEventListener('pointerdown', (e) => {
  const v = e as PointerEvent
  if (!active || v.pointerType === 'mouse' || touch.id !== -1) return
  v.preventDefault()
  touch = { id: v.pointerId, x: v.clientX, y: v.clientY, dx: 0, dy: 0 }
  canvas.setPointerCapture(v.pointerId)
  $('#joystick').hidden = false
  $('#joystick').style.left = `${touch.x}px`
  $('#joystick').style.top = `${touch.y}px`
  $('#joystick span').style.transform = 'translate(0,0)'
})
const touchEnd = (e: Event) => {
  if ((e as PointerEvent).pointerId === touch.id) {
    touch.id = -1
    touch.dx = touch.dy = 0
    $('#joystick').hidden = true
  }
}
canvas.addEventListener('pointerup', touchEnd)
canvas.addEventListener('pointercancel', touchEnd)
const inputTimer = setInterval(() => {
  if (!active || !latest || document.hidden) return
  const target =
    touch.id !== -1
      ? {
          x: latest.center[0] + (touch.dx * 7) / renderer.camera.zoom,
          y: latest.center[1] + (touch.dy * 7) / renderer.camera.zoom,
        }
      : matchMedia('(pointer:coarse)').matches
        ? { x: latest.center[0], y: latest.center[1] }
        : renderer.screenToWorld(pointer.x, pointer.y)
  renderer.aim = { ...target, active: true }
  const input = {
    t: 'input' as const,
    x: Math.round(Math.max(-1000, Math.min(WORLD + 1000, target.x))),
    y: Math.round(Math.max(-1000, Math.min(WORLD + 1000, target.y))),
    seq: ++seq,
    frame: latest.frame ?? 0,
    split: actionSplit,
    eject: actionFeed || feedHeld,
  }
  if (localWorld) {
    localWorld.input(localId, input)
    actionSplit = actionFeed = false
    return
  }
  if (ws?.readyState !== WebSocket.OPEN || ws.bufferedAmount > 8192) return
  ws.send(JSON.stringify(input))
  actionSplit = actionFeed = false
  if (performance.now() - pingAt > 3000) {
    pingAt = performance.now()
    ws.send(JSON.stringify({ t: 'ping', at: pingAt }))
  }
}, 50)
addEventListener('pagehide', () => {
  ended = true
  ws?.close()
  clearInterval(inputTimer)
  clearInterval(roomTimer)
  clearTimeout(reconnectTimer)
  stopLocal()
  cancelAnimationFrame(renderer.raf)
})
