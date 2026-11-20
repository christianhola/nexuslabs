import '@fontsource-variable/dm-sans'
import '@fontsource-variable/space-grotesk'
import './style.css'
import { Renderer } from './renderer'
import { ROOMS, SKINS, validSkin } from '../shared/protocol'
import type { Profile, Result, Snapshot } from '../shared/protocol'
import { World } from '../shared/simulation'

const icons = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  chevron: '<path d="m8 10 4 4 4-4"/>',
  sound:
    '<path d="m11 5-6 4H2v6h3l6 4V5Zm4 3a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  mute: '<path d="m11 5-6 4H2v6h3l6 4V5Zm5 4 6 6m0-6-6 6"/>',
  link: '<path d="m10 13 4-4m-7 1-2 2a4 4 0 0 0 6 6l2-2m-2-8 2-2a4 4 0 0 1 6 6l-2 2"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  bolt: '<path d="m13 2-8 12h6l-1 8 9-12h-6l1-8Z"/>',
  trophy:
    '<path d="M8 3h8v6a4 4 0 0 1-8 0V3Zm0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 1v6m-4 2h8"/>',
  mouse: '<rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 6v4"/>',
}
const icon = (name: keyof typeof icons) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`
const $ = <T extends HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
function stored<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback
  } catch {
    return fallback
  }
}
function store(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}
let skin = stored('coil-skin', 0)
if (!validSkin(skin)) skin = 0
let localBest = stored('coil-best', 0),
  profile: Profile | null = null,
  user: { name: string } | null = null
let room: string = new URL(location.href).searchParams.get('room') ?? ROOMS[0]
if (!(ROOMS as readonly string[]).includes(room)) room = ROOMS[0]
let socket: WebSocket | null = null,
  mode: 'menu' | 'connecting' | 'playing' | 'ended' = 'menu',
  paused = false
// Static hosting has no Worker. The shared simulation runs locally with bots
// so the room is always playable; multiplayer still wins when it is available.
let localWorld: World | null = null,
  localId = '',
  localTimer: ReturnType<typeof setInterval> | null = null,
  localResult: Result | null = null
let soundEnabled = stored('coil-sound', false),
  audio: AudioContext | null = null,
  lastSound = 0
let roomCounts: { name: string; online: number; capacity: number }[] = []
let connectionTimeout: ReturnType<typeof setTimeout> | null = null
let mouseBoost = false,
  keyBoost = false,
  boostPointer: number | null = null

$('#app').innerHTML = `
  <canvas id="arena" tabindex="-1" aria-label="Multiplayer snake arena"></canvas>
  <header class="topbar">
    <a class="brand" href="/" aria-label="Coil home"><img src="/favicon.svg" alt=""/><span>coil</span></a>
    <div class="account"><button class="text-button" id="account" hidden></button><a class="text-button" id="signin" href="/auth/freebuff/signin?returnTo=/" hidden>Sign in with Freebuff ${icon('arrow')}</a></div>
  </header>
  <main id="menu" class="menu">
    <div class="wordmark" aria-label="Coil">coil<span class="wordmark-dot"></span></div>
    <form id="join-form" class="join-form">
      <div class="skin-picker" role="group" aria-label="Snake color">${SKINS.map((s, i) => `<button type="button" class="swatch ${i === skin ? 'selected' : ''}" style="--swatch:${s.main}" data-skin="${i}" aria-label="${s.name}" aria-pressed="${i === skin}" title="${s.name}"><span></span></button>`).join('')}</div>
      <label class="sr-only" for="name">Your name</label><input id="name" maxlength="18" placeholder="Your name" autocomplete="nickname" spellcheck="false" />
      <button id="play" class="primary" type="submit"><span>Play</span>${icon('arrow')}</button>
      <div class="room-row"><span class="live-dot"></span><label for="room" class="sr-only">Arena</label><select id="room">${ROOMS.map((r) => `<option value="${r}" ${r === room ? 'selected' : ''}>${r}</option>`).join('')}</select>${icon('chevron')}<span id="population"></span></div>
      <p id="error" class="error" role="alert" hidden></p>
    </form>
    <div id="personal-best" class="personal-best" hidden>${icon('trophy')}<span></span></div>
  </main>
  <section id="hud" class="hud" aria-label="Game status" hidden>
    <div class="score-panel"><span class="muted">Length</span><strong id="score">24</strong><span id="rank" class="muted"></span></div>
    <div class="arena-label"><span class="live-dot"></span><span id="room-label"></span><span id="online"></span><button id="invite" class="icon-button" aria-label="Copy invite link" title="Copy invite link">${icon('link')}</button></div>
    <div class="leaderboard"><div class="board-heading"><span>Leaderboard</span><span id="ping"></span></div><ol id="leaders"></ol></div>
    <button id="leave" class="icon-button leave" aria-label="Leave arena" title="Leave arena">${icon('close')}</button>
    <div class="boost-hint"><kbd>Space</kbd><span>Boost</span></div>
    <div id="joystick" aria-hidden="true"><i></i></div><button id="boost" aria-label="Boost">${icon('bolt')}</button>
  </section>
  <div class="bottom-bar" id="menu-footer"><div class="controls-hint"><span>${icon('mouse')} Steer</span><span><kbd>Space</kbd> Boost</span></div><button id="sound" class="icon-button" aria-label="Enable sound" aria-pressed="false"></button><button id="menu-invite" class="text-button invite-link">Invite a friend ${icon('link')}</button></div>
  <section class="overlay" id="result" role="dialog" aria-modal="true" aria-labelledby="result-title" hidden><div class="result-card"><div class="result-orbit">${icon('trophy')}</div><h1 id="result-title">Nice run.</h1><div class="result-score" id="result-score"></div><div class="result-stats"><span><strong id="result-kills"></strong> Knockouts</span><span><strong id="result-time"></strong> Time</span></div><span class="record" id="record" hidden>New personal best</span><button id="again" class="primary">Play again ${icon('arrow')}</button><button id="back" class="text-button">Back to lobby</button><p id="save-status" class="muted"></p></div></section>
  <section class="overlay" id="leave-dialog" role="dialog" aria-modal="true" aria-labelledby="leave-title" hidden><div class="compact-card"><h2 id="leave-title">Leave the arena?</h2><button id="stay" class="primary">Keep playing</button><button id="confirm-leave" class="text-button">Leave</button></div></section>
  <section class="overlay" id="profile-dialog" role="dialog" aria-modal="true" aria-labelledby="profile-name" hidden><div class="compact-card"><button id="close-profile" class="icon-button close-dialog" aria-label="Close profile">${icon('close')}</button><h2 id="profile-name"></h2><div class="profile-stats" id="profile-stats"></div><form action="/auth/freebuff/signout" method="post"><button type="submit" class="text-button">Sign out</button></form></div></section>
  <div id="toast" class="toast" role="status" hidden></div>
`
const renderer = new Renderer($('#arena'))
renderer.skin = skin
function updateBoost() {
  renderer.input.boost =
    (mouseBoost || keyBoost || boostPointer !== null) && !paused
  send({ type: 'input', ...renderer.input })
}
function releaseBoost() {
  mouseBoost = false
  keyBoost = false
  boostPointer = null
  renderer.input.boost = false
}
$('#name').setAttribute('value', stored('coil-name', ''))
function updateBest() {
  const best = Math.max(localBest, profile?.best ?? 0)
  $('#personal-best').hidden = !best
  $('#personal-best span').textContent = `Best ${best.toLocaleString()}`
}
updateBest()
function tone(frequency: number, duration = 0.08) {
  if (!soundEnabled) return
  try {
    audio ??= new AudioContext()
    if (audio.state === 'suspended') void audio.resume()
    const oscillator = audio.createOscillator(),
      gain = audio.createGain(),
      now = audio.currentTime
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, now)
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency * 1.35,
      now + duration,
    )
    gain.gain.setValueAtTime(0.025, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    oscillator.connect(gain)
    gain.connect(audio.destination)
    oscillator.start(now)
    oscillator.stop(now + duration)
  } catch {}
}
renderer.onCollect = () => {
  const now = performance.now()
  if (now - lastSound > 100) {
    lastSound = now
    tone(520 + Math.random() * 230)
  }
}
function soundUI() {
  $('#sound').innerHTML = icon(soundEnabled ? 'sound' : 'mute')
  $('#sound').setAttribute('aria-pressed', String(soundEnabled))
  $('#sound').setAttribute(
    'aria-label',
    soundEnabled ? 'Mute sound' : 'Enable sound',
  )
}
soundUI()
$('#sound').onclick = () => {
  soundEnabled = !soundEnabled
  store('coil-sound', soundEnabled)
  soundUI()
  tone(440)
}
let toastTimer: ReturnType<typeof setTimeout>
function toast(text: string) {
  $('#toast').textContent = text
  $('#toast').hidden = false
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    $('#toast').hidden = true
  }, 2800)
}
function chooseSkin(next: number) {
  skin = next
  renderer.skin = skin
  store('coil-skin', skin)
  document.querySelectorAll<HTMLButtonElement>('[data-skin]').forEach((b) => {
    const selected = Number(b.dataset.skin) === skin
    b.classList.toggle('selected', selected)
    b.setAttribute('aria-pressed', String(selected))
  })
}
document.querySelectorAll<HTMLButtonElement>('[data-skin]').forEach(
  (b) =>
    (b.onclick = () => {
      chooseSkin(Number(b.dataset.skin))
      tone(330 + skin * 55)
      if (user)
        void fetch('/api/skin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skin }),
        })
          .then((r) => {
            if (!r.ok) toast('Couldn’t save your color. Try again.')
          })
          .catch(() => toast('Couldn’t save your color. Try again.'))
    }),
)
async function session() {
  try {
    const response = await fetch('/api/session')
    if (!response.ok) return
    const data = (await response.json()) as {
      user: typeof user
      profile: Profile | null
      authAvailable: boolean
    }
    user = data.user
    profile = data.profile
    $('#signin').hidden = !!user || !data.authAvailable
    $('#account').hidden = !user
    if (user) {
      $('#account').textContent = user.name
      if (!$('#name').getAttribute('value'))
        $<HTMLInputElement>('#name').value = user.name.slice(0, 18)
    }
    if (profile && validSkin(profile.skin)) chooseSkin(profile.skin)
    updateBest()
  } catch {
    /* Guest play does not depend on account availability. */
  }
}
void session()
async function population() {
  if (mode === 'playing' || document.hidden) return
  try {
    const r = await fetch('/api/rooms')
    if (r.ok) {
      roomCounts = await r.json()
      renderPopulation()
    }
  } catch {
    $('#population').textContent = ''
  }
}
function renderPopulation() {
  const p = roomCounts.find((r) => r.name === room)
  $('#population').textContent = p ? `${p.online} online` : ''
}
void population()
const populationTimer = setInterval(population, 15000)
$<HTMLSelectElement>('#room').onchange = (e) => {
  room = (e.target as HTMLSelectElement).value
  renderPopulation()
}
async function invite() {
  const url = new URL(location.origin)
  url.searchParams.set('room', room)
  try {
    await navigator.clipboard.writeText(url.href)
    toast('Invite link copied')
  } catch {
    toast('Copy the address bar to invite a friend')
  }
}
$('#invite').onclick = invite
$('#menu-invite').onclick = invite
function send(value: unknown) {
  if (localWorld) {
    const message = value as { type?: string; angle?: number; boost?: boolean }
    const me = localWorld.snakes.get(localId)
    if (message.type === 'input' && me)
      me.input = { angle: message.angle ?? me.angle, boost: !!message.boost }
    return
  }
  if (socket?.readyState === WebSocket.OPEN && socket.bufferedAmount < 4096)
    socket.send(JSON.stringify(value))
}
function stopLocal() {
  if (localTimer) clearInterval(localTimer)
  localTimer = null
  localWorld = null
  localId = ''
}
function disconnect() {
  if (connectionTimeout) clearTimeout(connectionTimeout)
  const old = socket
  socket = null
  old?.close(1000, 'Leaving')
  releaseBoost()
}
function enterArena() {
  mode = 'playing'
  renderer.active = true
  renderer.pointer.active = false
  $('#menu').hidden = true
  $('#menu-footer').hidden = true
  $('#hud').hidden = false
  $('#arena').focus({ preventScroll: true })
  $('.topbar').classList.add('playing')
  $('#room-label').textContent = room
  tone(240, 0.2)
}
function startLocal(name: string) {
  if (mode === 'playing') return
  disconnect()
  stopLocal()
  renderer.clear()
  $('#error').hidden = true
  $('#result').hidden = true
  const world = new World()
  localId = 'you'
  world.spawn(localId, name, skin, false)
  const botNames = ['miso', 'pebble', 'fern', 'momo', 'clover', 'pollen', 'basil']
  botNames.forEach((bot, index) =>
    world.spawn(`bot-${index}`, bot, (skin + index + 1) % SKINS.length, true),
  )
  localResult = null
  world.onDeath = (snake, result) => {
    if (snake.id === localId) localResult = result
  }
  localWorld = world
  renderer.id = localId
  enterArena()
  toast('Practice with bots — the live arena is offline.')
  localTimer = setInterval(() => {
    const roomWorld = localWorld
    if (!roomWorld || mode !== 'playing' || paused) return
    roomWorld.step()
    if (!roomWorld.snakes.has(localId)) {
      ended(
        localResult ?? {
          score: 0,
          kills: 0,
          seconds: Math.floor(roomWorld.tick / 30),
          reason: 'edge',
        },
      )
      return
    }
    const state = roomWorld.snapshot(localId, roomWorld.snakes.size - 1)
    renderer.receive(state)
    updateHud(state)
  }, 1000 / 30)
}
function lobby() {
  mode = 'menu'
  disconnect()
  stopLocal()
  renderer.active = false
  renderer.clear()
  paused = false
  $('#menu').hidden = false
  $('#menu-footer').hidden = false
  $('#hud').hidden = true
  $('#result').hidden = true
  $('#leave-dialog').hidden = true
  $('#play').removeAttribute('disabled')
  $('#play span').textContent = 'Play'
  $('.topbar').classList.remove('playing')
  updateBest()
  void population()
  void session()
  $('#play').focus()
}
function fail(message: string) {
  lobby()
  $('#error').textContent = message
  $('#error').hidden = false
}
function play() {
  if (mode === 'connecting' || mode === 'playing') return
  disconnect()
  renderer.clear()
  $('#error').hidden = true
  $('#result').hidden = true
  const name = $<HTMLInputElement>('#name').value.trim() || 'Wanderer'
  store('coil-name', name)
  mode = 'connecting'
  $('#play').setAttribute('disabled', '')
  $('#play span').textContent = 'Joining…'
  const url = new URL('/api/play', location.origin)
  url.protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
  url.searchParams.set('room', room)
  const ws = new WebSocket(url)
  socket = ws
  connectionTimeout = setTimeout(() => {
    if (socket === ws && mode === 'connecting') startLocal(name)
  }, 3500)
  ws.onmessage = (event) => {
    if (socket !== ws) return
    let m: any
    try {
      m = JSON.parse(event.data)
    } catch {
      return
    }
    if (m.type === 'welcome') {
      renderer.id = m.id
      send({ type: 'join', name, skin })
    }
    if (m.type === 'state') {
      send({ type: 'ack', tick: m.tick })
      if (mode === 'connecting') {
        if (connectionTimeout) clearTimeout(connectionTimeout)
        enterArena()
      }
      if (mode !== 'playing') return
      renderer.receive(m as Snapshot)
      updateHud(m as Snapshot)
    } else if (m.type === 'ended' && mode === 'playing') ended(m)
    else if (m.type === 'pong')
      $('#ping').textContent =
        `${Math.max(1, Math.round(performance.now() - m.at))} ms`
    else if (m.type === 'save-error')
      $('#save-status').textContent = 'Stats couldn’t be saved.'
  }
  ws.onclose = (event) => {
    if (socket !== ws) return
    if (mode === 'connecting') {
      socket = null
      startLocal(name)
      return
    }
    if (mode === 'playing')
      fail(
        event.code === 1013
          ? 'Connection is too slow. Try again.'
          : 'Connection lost. Join the arena again.',
      )
  }
  ws.onerror = () => {
    if (socket === ws && mode === 'connecting') {
      socket = null
      startLocal(name)
    }
  }
}
$('#join-form').onsubmit = (e) => {
  e.preventDefault()
  play()
}
$('#again').onclick = play
$('#back').onclick = lobby
function ended(result: Result) {
  if (localWorld) stopLocal()
  mode = 'ended'
  releaseBoost()
  $('#hud').hidden = true
  $('#leave-dialog').hidden = true
  paused = false
  const record = result.score > Math.max(localBest, profile?.best ?? 0)
  localBest = Math.max(localBest, result.score)
  store('coil-best', localBest)
  $('#result-score').textContent = result.score.toLocaleString()
  $('#result-kills').textContent = String(result.kills)
  $('#result-time').textContent =
    `${Math.floor(result.seconds / 60)}:${String(result.seconds % 60).padStart(2, '0')}`
  $('#record').hidden = !record
  $('#result').hidden = false
  $('#save-status').textContent = ''
  $('#again').focus()
  tone(170, 0.28)
  // Leave the socket briefly so a failed durable stats write can be reported.
  const endedSocket = socket
  setTimeout(() => {
    if (mode === 'ended' && socket === endedSocket) disconnect()
  }, 5000)
}
let lastHud = 0
function updateHud(state: Snapshot) {
  const me = state.snakes.find((s) => s.id === renderer.id)
  if (me) {
    $('#score').textContent = me.score.toLocaleString()
    $('#hud').classList.toggle('is-boosting', me.boost)
  }
  if (performance.now() - lastHud < 250) return
  lastHud = performance.now()
  const rank = state.leaders.findIndex((s) => s.id === renderer.id)
  $('#rank').textContent =
    rank >= 0 ? `#${rank + 1} of ${state.total}` : `${state.total} in arena`
  $('#online').textContent = `${state.online} online`
  const list = $('#leaders')
  list.replaceChildren()
  state.leaders.forEach((s, i) => {
    const li = document.createElement('li')
    if (s.id === renderer.id) li.className = 'is-me'
    const position = document.createElement('span')
    position.className = 'position'
    position.textContent = String(i + 1)
    const dot = document.createElement('i')
    dot.style.backgroundColor = SKINS[s.skin].main
    const name = document.createElement('span')
    name.className = 'player-name'
    name.textContent = s.name
    const value = document.createElement('span')
    value.className = 'player-score'
    value.textContent = s.score.toLocaleString()
    li.append(position, dot, name)
    if (s.bot) {
      const badge = document.createElement('small')
      badge.textContent = 'bot'
      li.append(badge)
    }
    li.append(value)
    list.append(li)
  })
}
function askLeave() {
  if (mode !== 'playing') return
  paused = true
  releaseBoost()
  $('#leave-dialog').hidden = false
  $('#stay').focus()
}
$('#leave').onclick = askLeave
$('#stay').onclick = () => {
  paused = false
  $('#leave-dialog').hidden = true
  $('#arena').focus({ preventScroll: true })
}
$('#confirm-leave').onclick = lobby
$('#account').onclick = async () => {
  await session()
  if (!user || !profile) return
  $('#profile-name').textContent = user.name
  const stats = $('#profile-stats')
  stats.replaceChildren()
  for (const [label, value] of [
    ['Best', profile.best],
    ['Games', profile.games],
    ['Knockouts', profile.kills],
  ] as const) {
    const row = document.createElement('div'),
      n = document.createElement('strong'),
      l = document.createElement('span')
    n.textContent = value.toLocaleString()
    l.textContent = label
    row.append(n, l)
    stats.append(row)
  }
  $('#profile-dialog').hidden = false
  $('#close-profile').focus()
}
$('#close-profile').onclick = () => {
  $('#profile-dialog').hidden = true
  $('#account').focus()
}
window.addEventListener('pointermove', (e) => {
  if (e.pointerType === 'touch' || paused) return
  renderer.pointer = { x: e.clientX, y: e.clientY, active: true }
  if (mouseBoost && !(e.buttons & 1)) {
    mouseBoost = false
    updateBoost()
  }
})
$('#arena').addEventListener('pointerdown', (e) => {
  if (
    e.pointerType !== 'touch' &&
    e.button === 0 &&
    mode === 'playing' &&
    !paused
  ) {
    e.preventDefault()
    $('#arena').focus({ preventScroll: true })
    $('#arena').setPointerCapture(e.pointerId)
    mouseBoost = true
    updateBoost()
  }
})
window.addEventListener('blur', () => {
  releaseBoost()
  keys.clear()
  send({ type: 'input', ...renderer.input })
})
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    releaseBoost()
    keys.clear()
    send({ type: 'input', ...renderer.input })
  }
})
const keys = new Set<string>()
window.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    const dialog = document.querySelector<HTMLElement>('.overlay:not([hidden])')
    if (dialog) {
      const focusable = [
        ...dialog.querySelectorAll<HTMLElement>('button, a, input, select'),
      ].filter((el) => !el.hasAttribute('disabled'))
      const first = focusable[0],
        last = focusable.at(-1)
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
  }
  if (e.key === 'Escape') {
    if (!$('#profile-dialog').hidden) {
      $('#profile-dialog').hidden = true
      return
    }
    if (paused) {
      paused = false
      $('#leave-dialog').hidden = true
      $('#arena').focus({ preventScroll: true })
    } else askLeave()
  }
  if (mode !== 'playing' || paused || e.target instanceof HTMLInputElement)
    return
  if ([' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key))
    e.preventDefault()
  keys.add(e.key.toLowerCase())
  if ((e.code === 'Space' || e.key === ' ') && !e.repeat) {
    keyBoost = true
    updateBoost()
  }
})
window.addEventListener('keyup', (e) => {
  keys.delete(e.key.toLowerCase())
  if (e.code === 'Space' || e.key === ' ') {
    keyBoost = false
    updateBoost()
  }
})
const inputTimer = setInterval(() => {
  if (mode !== 'playing') return
  const x =
    Number(keys.has('arrowright') || keys.has('d')) -
    Number(keys.has('arrowleft') || keys.has('a'))
  const y =
    Number(keys.has('arrowdown') || keys.has('s')) -
    Number(keys.has('arrowup') || keys.has('w'))
  if ((x || y) && !paused) {
    renderer.pointer.active = false
    renderer.input.angle = Math.atan2(y, x)
  }
  send({
    type: 'input',
    angle: renderer.input.angle,
    boost: renderer.input.boost && !paused && !document.hidden,
  })
}, 50)
const pingTimer = setInterval(() => {
  if (mode === 'playing') send({ type: 'ping', at: performance.now() })
}, 2500)
const joystick = $('#joystick')
let touchId: number | null = null,
  origin = { x: 0, y: 0 }
$('#arena').addEventListener('pointerdown', (e) => {
  if (e.pointerType !== 'touch' || mode !== 'playing' || paused) return
  touchId = e.pointerId
  origin = { x: e.clientX, y: e.clientY }
  renderer.pointer.active = false
  joystick.style.left = `${origin.x}px`
  joystick.style.top = `${origin.y}px`
  joystick.classList.add('visible')
  $('#arena').setPointerCapture(e.pointerId)
})
$('#arena').addEventListener('pointermove', (e) => {
  if (e.pointerId !== touchId) return
  const x = e.clientX - origin.x,
    y = e.clientY - origin.y,
    d = Math.hypot(x, y),
    limit = Math.min(1, 34 / Math.max(d, 1))
  if (d > 5) renderer.input.angle = Math.atan2(y, x)
  $('#joystick i').style.transform = `translate(${x * limit}px, ${y * limit}px)`
})
function releaseTouch(e: PointerEvent) {
  if (e.pointerId === touchId) {
    touchId = null
    joystick.classList.remove('visible')
  }
  if (e.pointerId === boostPointer) boostPointer = null
  if (e.pointerType !== 'touch' && !(e.buttons & 1)) mouseBoost = false
  updateBoost()
}
window.addEventListener('pointerup', releaseTouch)
window.addEventListener('pointercancel', releaseTouch)
$('#arena').addEventListener('lostpointercapture', releaseTouch)
$('#boost').addEventListener('pointerdown', (e) => {
  e.preventDefault()
  boostPointer = e.pointerId
  updateBoost()
  $('#boost').setPointerCapture(e.pointerId)
})
window.addEventListener('pagehide', () => {
  disconnect()
  stopLocal()
  renderer.destroy()
  clearInterval(populationTimer)
  clearInterval(inputTimer)
  clearInterval(pingTimer)
})
// A browser history restoration must restart sockets, input timers and rendering.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) location.reload()
})
