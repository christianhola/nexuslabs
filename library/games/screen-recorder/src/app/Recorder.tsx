import { Mic, MonitorUp, Pause, Play, Square, Trash2, Video } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { ScreenMock } from '@/components/ScreenMock'
import { Input, Segmented, Select } from '@/components/ui'
import { type Recording, RECORDER, type Scene } from '@/content'
import { cn } from '@/lib/cn'
import { clock } from '@/lib/format'
import { actions, uid, useStore } from '@/lib/store'

type Mode = (typeof RECORDER.modes)[number]['id']
type Phase = { kind: 'setup' } | { kind: 'countdown'; n: number } | { kind: 'recording'; paused: boolean } | { kind: 'review' }

const SOURCE_SCENE: Record<string, Scene> = { 'Full screen': 'dashboard', 'Window: Browser': 'site', 'Window: Figma-like editor': 'board' }

/**
 * The record flow, simulated: pick devices, a 3-2-1 countdown, a running
 * timer with pause, then name it and save it to the library. No media is
 * captured; wire `getDisplayMedia` + `MediaRecorder` here for the real thing.
 */
export function Recorder({ open, onClose, onSaved, playlistId }: { open: boolean; onClose: () => void; onSaved: (r: Recording) => void; playlistId: string | null }) {
  const playlists = useStore((s) => s.playlists)
  const [phase, setPhase] = useState<Phase>({ kind: 'setup' })
  const [mode, setMode] = useState<Mode>('screen-cam')
  const [camera, setCamera] = useState(RECORDER.cameras[0])
  const [mic, setMic] = useState(RECORDER.mics[0])
  const [source, setSource] = useState(RECORDER.sources[0])
  const [quality, setQuality] = useState(RECORDER.quality[0])
  const [elapsed, setElapsed] = useState(0)
  const [title, setTitle] = useState('')
  const [pl, setPl] = useState<string>(playlistId ?? '')
  const [error, setError] = useState<string | null>(null)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (open) {
      setPhase({ kind: 'setup' })
      setElapsed(0)
      setTitle('')
      setError(null)
      setPl(playlistId ?? '')
    }
  }, [open, playlistId])

  useEffect(() => {
    if (phase.kind !== 'countdown') return
    const id = window.setTimeout(() => setPhase(phase.n > 1 ? { kind: 'countdown', n: phase.n - 1 } : { kind: 'recording', paused: false }), 700)
    return () => window.clearTimeout(id)
  }, [phase])

  useEffect(() => {
    if (phase.kind !== 'recording' || phase.paused) return
    timer.current = window.setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [phase])

  function start() {
    if (mode === 'cam' && camera === 'No camera') return setError('Pick a camera to record in Cam only mode.')
    if (mode !== 'screen' && camera === 'No camera' && mic === 'No microphone') return setError('Choose a camera or a microphone, or switch to Screen only.')
    setError(null)
    setPhase({ kind: 'countdown', n: 3 })
  }

  function save() {
    const name = title.trim()
    if (!name) return setError('Give the clip a title so people know what it is.')
    const d = Math.max(3, elapsed)
    const rec: Recording = {
      id: uid('rec'),
      title: name,
      duration: d,
      createdAt: new Date().toISOString(),
      presenter: 'maya',
      scene: mode === 'cam' ? 'deck' : (SOURCE_SCENE[source] ?? 'dashboard'),
      playlistId: pl || null,
      views: 0,
      watched: true,
      summary: `A ${clock(d)} ${mode === 'screen' ? 'screen' : 'screen and camera'} recording. This demo does not capture audio, so the transcript and summary are placeholders.`,
      chapters: [{ t: 0, title: 'Start' }],
      transcript: [{ t: 0, text: 'Recorded in the Clipwise demo. Connect a real recorder to get a transcript here.' }],
    }
    actions.addRecording(rec)
    onSaved(rec)
  }

  const recording = phase.kind === 'recording'
  // Closing mid-recording discards it, like the Discard button.
  const close = onClose

  return (
    <Modal open={open} onClose={close} title={phase.kind === 'review' ? 'Save your clip' : recording ? 'Recording' : 'New recording'} width={620}>
      <div className="p-5">
        <div className="relative overflow-hidden rounded-[14px] ring-1 ring-line">
          <ScreenMock scene={mode === 'cam' ? 'deck' : (SOURCE_SCENE[source] ?? 'dashboard')} presenter="maya" bubble={mode !== 'screen' && camera !== 'No camera'} bubbleSize="lg" className="aspect-video w-full" />
          {phase.kind === 'countdown' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55" aria-live="assertive">
              <span key={phase.n} className="font-display text-[96px] font-semibold text-cream">
                {phase.n}
              </span>
            </div>
          )}
          {recording && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 font-mono text-[13px] tabular-nums" aria-live="off">
              <span className={cn('size-2.5 rounded-full bg-ember', !phase.paused && 'animate-rec-pulse')} />
              {phase.paused ? 'Paused' : 'REC'} {clock(elapsed)}
            </span>
          )}
          {phase.kind === 'setup' && <span className="absolute top-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-[12px] font-medium">{quality}</span>}
        </div>

        {phase.kind === 'setup' && (
          <div className="mt-5 space-y-3">
            <Segmented label="Recording mode" value={mode} onChange={(v) => setMode(v)} options={RECORDER.modes.map((m) => ({ id: m.id, label: m.label }))} className="w-full [&>button]:flex-1" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Select label="Screen source" value={source} onChange={setSource} options={RECORDER.sources} icon={<MonitorUp className="size-4" />} />
              <Select label="Quality" value={quality} onChange={setQuality} options={RECORDER.quality} />
              <Select label="Camera" value={camera} onChange={setCamera} options={RECORDER.cameras} icon={<Video className="size-4" />} />
              <Select label="Microphone" value={mic} onChange={setMic} options={RECORDER.mics} icon={<Mic className="size-4" />} />
            </div>
            {error && (
              <p role="alert" className="text-[13px] text-ember-text">
                {error}
              </p>
            )}
            <div className="flex items-center justify-between gap-3 pt-2">
              <p className="text-[13px] text-faint">Demo recorder: nothing leaves your browser.</p>
              <Button variant="record" onClick={start} icon={<span className="size-2.5 rounded-full bg-white" />} data-autofocus>
                Start recording
              </Button>
            </div>
          </div>
        )}

        {recording && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Recording controls">
            <Button variant="secondary" onClick={() => setPhase({ kind: 'recording', paused: !phase.paused })} icon={phase.paused ? <Play className="size-4" /> : <Pause className="size-4" />}>
              {phase.paused ? 'Resume' : 'Pause'}
            </Button>
            <Button variant="record" onClick={() => setPhase({ kind: 'review' })} icon={<Square className="size-3.5 fill-current" />} data-autofocus>
              Stop
            </Button>
            <Button variant="ghost" onClick={() => setPhase({ kind: 'setup' })} icon={<Trash2 className="size-4" />}>
              Discard
            </Button>
          </div>
        )}

        {phase.kind === 'review' && (
          <form
            className="mt-5 space-y-3"
            onSubmit={(e) => {
              e.preventDefault()
              save()
            }}
            noValidate
          >
            <p className="text-[13px] text-muted">Recorded {clock(Math.max(3, elapsed))}. Name it and pick where it goes.</p>
            <Input
              label="Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setError(null)
              }}
              placeholder="e.g. Checkout bug repro"
              error={error}
              data-autofocus
              maxLength={120}
            />
            <Select label="Playlist" showLabel value={pl} onChange={setPl} options={[{ value: '', label: 'No playlist' }, ...playlists.map((p) => ({ value: p.id, label: p.name }))]} />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setPhase({ kind: 'setup' })}>
                Record again
              </Button>
              <Button variant="primary" type="submit">
                Save clip
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
