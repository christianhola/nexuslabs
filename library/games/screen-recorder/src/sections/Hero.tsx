import { ChevronDown, Clock, Mic, Pause, Play, Video } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { ButtonLink, Button } from '@/components/Button'
import { useContact } from '@/components/Contact'
import { Container } from '@/components/Frame'
import { ClipCard, PlaylistsHeading, SidebarRow, WorkspaceHeader, type NavRow } from '@/components/Library'
import { PartnerLogo } from '@/components/Logo'
import { Menu } from '@/components/Menu'
import { Terminal } from '@/components/Terminal'
import { Chip } from '@/components/ui'
import { APP_COPY, BRAND, HERO, IMAGES, LOGOS, PLAYLISTS, RECORDER } from '@/content'
import { cn } from '@/lib/cn'
import { clock } from '@/lib/format'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const contact = useContact()
  const reduce = useReducedMotion()
  const up = (d: number) => (reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: d, ease } })

  return (
    <section className="relative">
      <Container className="relative pt-[72px] sm:pt-[132px]">
        <motion.h1 {...up(0)} className="max-w-[720px] font-display text-[42px] leading-[1.06] font-medium tracking-[-0.03em] text-balance text-cream sm:text-[56px] lg:text-[66px] lg:leading-[72px]">
          {HERO.title}
        </motion.h1>
        <div className="mt-6 grid gap-y-10 lg:mt-[17px] lg:grid-cols-2">
          <div>
            <motion.p {...up(0.08)} className="text-[18px] leading-[29px] text-muted sm:text-[20px]">
              {HERO.sub[0]}
              <br className="hidden sm:block" /> {HERO.sub[1]}
            </motion.p>
            <motion.div {...up(0.16)} className="mt-[39px] flex flex-wrap gap-[14px] lg:mt-[51px]">
              <ButtonLink to="/app" variant="primary" size="lg">
                {HERO.primary}
              </ButtonLink>
              <Button variant="secondary" size="lg" onClick={contact}>
                {HERO.secondary}
              </Button>
            </motion.div>
          </div>
          <motion.div {...up(0.24)} className="min-w-0 lg:pt-[29px]">
            <p className="text-[18px] leading-[29px] text-muted sm:text-[20px]">
              {HERO.trusted.pre}{' '}
              {HERO.trusted.teams.map((t, i) => (
                <span key={t}>
                  <span className="dotted text-cream">{t}</span>
                  {i === 0 ? ', ' : i === 1 ? ' & ' : ' '}
                </span>
              ))}
              {HERO.trusted.post}
            </p>
            <LogoMarquee />
          </motion.div>
        </div>
      </Container>
      <ProductStage />
    </section>
  )
}

function LogoMarquee() {
  const row = [...LOGOS, ...LOGOS]
  return (
    <div className="group/mq fade-x relative mt-[52px] -ml-[60px] overflow-hidden lg:mt-[45px]" aria-label="Customer logos">
      <div className="flex w-max animate-marquee items-center gap-[74px] pl-[60px] group-hover/mq:[animation-play-state:paused]">
        {row.map((id, i) =>
          i < LOGOS.length ? (
            <PartnerLogo key={i} id={id} />
          ) : (
            <span key={i} aria-hidden className="contents">
              <PartnerLogo id={id} />
            </span>
          ),
        )}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------------------
   The product composition: library, a playing clip with device pickers, and an
   agent terminal. Drawn at the reference's 1540px design width and scaled to
   fit, so every gap and type size keeps the reference's proportions.
---------------------------------------------------------------------------- */

const STAGE_W = 1540
const STAGE_H = 660

function ProductStage() {
  const wrap = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.9)
  useLayoutEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / STAGE_W)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div id="product-shot" className="relative mt-[60px]">
      {/* ember horizon glow */}
      <div className="pointer-events-none absolute top-[-70px] left-1/2 h-[320px] w-[120%] max-w-[1900px] animate-glow rounded-[50%] bg-[radial-gradient(closest-side,rgb(124_36_24/0.42),rgb(70_20_14/0.18)_55%,transparent)] blur-[10px]" aria-hidden />
      {/* desktop: scaled composition */}
      <div ref={wrap} className="relative mx-auto hidden w-[calc(100%-2*clamp(12px,1.9vw,30px))] max-w-[1540px] lg:block" style={{ height: STAGE_H * scale }}>
        <div className="fade-b absolute top-0 left-0 origin-top-left" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}>
          <LibraryPanel />
          <TerminalPanel />
          <VideoCard />
        </div>
      </div>
      {/* phones: the clip and the agent stacked */}
      <div className="relative mx-auto w-[calc(100%-32px)] max-w-[560px] space-y-4 lg:hidden">
        <VideoCard mobile />
        <Terminal className="fade-b max-h-[420px]" dim />
      </div>
    </div>
  )
}

function LibraryPanel() {
  const [sort, setSort] = useState<'latest' | 'active'>('latest')
  const rows: NavRow[] = [
    { id: 'mine', label: APP_COPY.nav.mine, count: 1341, icon: 'mine', to: '/app', active: true },
    { id: 'watched', label: 'Watched', count: 155, icon: 'watched', to: '/app?view=watched' },
    { id: 'activity', label: 'Activity', count: 103, icon: 'activity', tone: 'ok', to: '/app?view=activity' },
  ]
  const counts = [8, 0, 0, 4, 29, 2, 0, 0, 2, 0, 1, 2, 0]
  const cards = [
    { id: 'rec-homepage', title: 'Homepage Walkthrough', scene: 'site' as const, presenter: 'maya' as const, duration: '3m', ago: '10h ago' },
    { id: 'rec-stack', title: 'Stack Visibility & Sharing', scene: 'code' as const, presenter: 'theo' as const, duration: '52s', ago: '14d ago', views: 1, comments: 1 },
    { id: 'rec-bug', title: 'Mention dropdown won’t scroll', scene: 'board' as const, presenter: 'ruth' as const, duration: '1m', ago: '3h ago' },
  ]
  const ordered = sort === 'latest' ? cards : [cards[2], cards[0], cards[1]]
  return (
    <div className="absolute top-[40px] left-0 flex h-[640px] w-[540px] overflow-hidden rounded-[16px] bg-[#121110]/95 ring-1 ring-line">
      <div className="w-[226px] shrink-0 px-[8px] pt-[14px]">
        <div className="pr-[6px] pl-[9px]">
          <WorkspaceHeader name={BRAND.workspace} compact />
        </div>
        <div className="mt-[16px] space-y-0">
          {rows.map((r) => (
            <SidebarRow key={r.id} row={r} size="sm" />
          ))}
        </div>
        <div className="mt-[6px]">
          <PlaylistsHeading count={15} size="sm" />
        </div>
        <div className="mt-[4px] space-y-0">
          {[...PLAYLISTS, { id: 'x1', name: 'Shared with Lumen' }, { id: 'x2', name: 'Leadership' }, { id: 'x3', name: 'Learning Sessions' }].slice(0, 13).map((p, i) => (
            <SidebarRow key={p.id} row={{ id: p.id, label: p.name, count: counts[i] ?? 0, icon: 'playlist', to: '/app' }} size="sm" />
          ))}
        </div>
      </div>
      <div className="w-[300px] shrink-0 border-l border-line/0 pt-[11px] pl-[16px]">
        <div className="flex gap-[8px]">
          <Chip pressed={sort === 'latest'} onClick={() => setSort('latest')} icon={<Clock className="size-3.5" />}>
            Latest
          </Chip>
          <Chip pressed={sort === 'active'} onClick={() => setSort('active')} icon={<svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M1 9h3l2-5 3 9 2-5h4" strokeLinejoin="round" /></svg>}>
            Active
          </Chip>
        </div>
        <div className="mt-[16px] space-y-[16px]">
          {ordered.map((c) => (
            <ClipCard key={c.id} to={`/v/${c.id}`} title={c.title} scene={c.scene} presenter={c.presenter} duration={c.duration} ago={c.ago} views={c.views} comments={c.comments} className="w-[262px]" />
          ))}
        </div>
      </div>
    </div>
  )
}

function TerminalPanel() {
  return (
    <div className="absolute top-[38px] left-[1030px] w-[512px]">
      <Terminal className="h-[640px]" dim />
    </div>
  )
}

function VideoCard({ mobile }: { mobile?: boolean }) {
  const DURATION = 184
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const [camera, setCamera] = useState(RECORDER.cameras[0])
  const [mic, setMic] = useState(RECORDER.mics[0])
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => setT((x) => (x + 0.25 >= DURATION ? 0 : x + 0.25)), 250)
    return () => window.clearInterval(id)
  }, [playing])

  return (
    <div className={cn(mobile ? 'relative overflow-hidden rounded-[18px] shadow-video' : 'absolute top-0 left-[492px] w-[556px]')}>
      <div className={cn('group/video relative overflow-hidden bg-black', mobile ? 'aspect-[1.19]' : 'h-[466px] rounded-[18px] shadow-video')}>
        <img
          src={IMAGES.presenterHero}
          alt="Mei recording a walkthrough from a café"
          className={cn('size-full object-cover object-[50%_30%] transition-transform duration-[6000ms] ease-linear', playing && !reduce && 'scale-[1.05]')}
          fetchPriority="high"
        />
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="absolute inset-0 flex items-center justify-center rounded-[18px] focus-visible:outline-offset-[-4px]"
          aria-label={playing ? 'Pause preview' : 'Play preview'}
        >
          <span className={cn('flex size-16 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md transition-opacity duration-200', playing ? 'opacity-0 group-hover/video:opacity-100' : 'opacity-0 group-hover/video:opacity-100 group-focus-within/video:opacity-100')}>
            {playing ? <Pause className="size-6" /> : <Play className="ml-1 size-6" />}
          </span>
        </button>
        <span className="pointer-events-none absolute right-[32px] bottom-[34px] inline-flex items-center gap-[14px] text-[30px] font-medium text-white drop-shadow-[0_2px_8px_rgb(0_0_0/0.4)]">
          <svg viewBox="0 0 32 28" width="36" height="31" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
            <rect x="2" y="2" width="28" height="20" rx="3" />
            <path d="M13 8v8l6-4z" fill="currentColor" stroke="none" />
            <path d="M8 26h16" strokeLinecap="round" />
          </svg>
          4K
        </span>
        {(playing || t > 0) && (
          <div className="pointer-events-none absolute inset-x-5 bottom-3 flex items-center gap-3 text-[12px] text-white/85">
            <span className="tabular-nums">{clock(t)}</span>
            <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
              <span className="block h-full rounded-full bg-white" style={{ width: `${(t / DURATION) * 100}%` }} />
            </span>
            <span className="tabular-nums">{clock(DURATION)}</span>
          </div>
        )}
      </div>
      <div className={cn('bg-gradient-to-b from-[#1d1c1a] to-[#161514]/0', mobile ? 'px-4 pt-3 pb-4' : 'px-[56px] pt-[26px] pb-[40px]')}>
        <DevicePicker icon={<Video className={mobile ? 'size-5' : 'size-[38px]'} strokeWidth={1.6} />} label="Camera" value={camera} options={RECORDER.cameras} onChange={setCamera} mobile={mobile} />
        <DevicePicker icon={<Mic className={mobile ? 'size-5' : 'size-[34px]'} strokeWidth={1.6} />} label="Microphone" value={mic} options={RECORDER.mics} onChange={setMic} mobile={mobile} dim />
      </div>
    </div>
  )
}

function DevicePicker({ icon, label, value, options, onChange, mobile, dim }: { icon: React.ReactNode; label: string; value: string; options: string[]; onChange: (v: string) => void; mobile?: boolean; dim?: boolean }) {
  return (
    <Menu
      label={label}
      align="start"
      width={mobile ? 280 : 340}
      items={options.map((o) => ({ id: o, label: o, checked: o === value, onSelect: () => onChange(o) }))}
      trigger={(p) => (
        <button
          {...p}
          type="button"
          aria-label={`${label}: ${value}`}
          className={cn('flex w-full items-center rounded-[14px] text-left transition-colors hover:bg-white/[0.03]', mobile ? 'h-12 gap-3 px-2 text-[16px]' : 'h-[72px] gap-[18px] px-0 text-[31px] tracking-[-0.01em]', dim ? 'text-muted/60' : 'text-muted')}
        >
          {icon}
          <span className="flex-1 truncate">{value}</span>
          <ChevronDown className={mobile ? 'size-4' : 'size-7'} strokeWidth={1.6} />
        </button>
      )}
    />
  )
}
