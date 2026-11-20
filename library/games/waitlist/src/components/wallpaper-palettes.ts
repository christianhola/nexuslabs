// Colour sets for the mountain wallpaper, one per time of day. The wallpaper
// cross-fades between them; `sunset` comes first so the page opens on the
// reference look. Ridge colours run back (far, hazy) to front (near).

export type Palette = {
  name: string
  sky: [string, string, string, string, string] // top → horizon
  glow: string
  glowOpacity: number
  clouds: string
  cloudOpacity: number
  stars: number // 0..1
  ridges: [string, string, string, string, string]
  haze: string
  rock: string
  rockLight: string
  snow: string
  snowOpacity: number
}

export const palettes: Palette[] = [
  {
    name: 'sunset',
    sky: ['#4b9fd0', '#a9cfe0', '#f3e7b6', '#f6c552', '#f19a3e'],
    glow: '#ffd27a',
    glowOpacity: 0.65,
    clouds: '#ffffff',
    cloudOpacity: 0.75,
    stars: 0,
    ridges: ['#f1a37a', '#e98b78', '#de7884', '#cf6f8b', '#b86488'],
    haze: '#f6b98a',
    rock: '#2e2a36',
    rockLight: '#4a4152',
    snow: '#d9d4e2',
    snowOpacity: 0.85,
  },
  {
    name: 'dusk',
    sky: ['#1f2a5c', '#4a4b8c', '#a36a9e', '#ec8a7a', '#f6a96b'],
    glow: '#ff9e6e',
    glowOpacity: 0.5,
    clouds: '#f4c3cf',
    cloudOpacity: 0.5,
    stars: 0.35,
    ridges: ['#b46b8e', '#9a5c86', '#7f4f7d', '#674472', '#523a63'],
    haze: '#c97f95',
    rock: '#1e1b28',
    rockLight: '#332c40',
    snow: '#a99cbf',
    snowOpacity: 0.7,
  },
  {
    name: 'night',
    sky: ['#070b1f', '#0f1a3d', '#1d2b5a', '#2f3f72', '#4a5888'],
    glow: '#8ea2e6',
    glowOpacity: 0.22,
    clouds: '#9aa6d6',
    cloudOpacity: 0.18,
    stars: 1,
    ridges: ['#3a4675', '#323d68', '#2a335a', '#232b4d', '#1c2340'],
    haze: '#46548a',
    rock: '#0d1020',
    rockLight: '#1a1f36',
    snow: '#8792bd',
    snowOpacity: 0.6,
  },
  {
    name: 'dawn',
    sky: ['#7d9ccf', '#c3c4e3', '#f4d3dc', '#fbd7b8', '#f8b997'],
    glow: '#fff0d4',
    glowOpacity: 0.6,
    clouds: '#ffffff',
    cloudOpacity: 0.7,
    stars: 0.1,
    ridges: ['#d9b3c4', '#c79fba', '#b28dae', '#9d7ca2', '#866c95'],
    haze: '#ecc6cf',
    rock: '#33304a',
    rockLight: '#4d4866',
    snow: '#e6e2f0',
    snowOpacity: 0.85,
  },
  {
    name: 'day',
    sky: ['#2f86d0', '#6fb2e6', '#b3d8f0', '#dcecf4', '#eef3f1'],
    glow: '#ffffff',
    glowOpacity: 0.4,
    clouds: '#ffffff',
    cloudOpacity: 0.85,
    stars: 0,
    ridges: ['#a9c3d8', '#8fb0c9', '#7799b5', '#62839f', '#4f6f8b'],
    haze: '#c7dbe8',
    rock: '#2b3440',
    rockLight: '#45505e',
    snow: '#eef2f7',
    snowOpacity: 0.95,
  },
]
