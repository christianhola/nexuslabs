import { BRAND, PRESENTERS, type PresenterId, type Scene } from '@/content'
import { cn } from '@/lib/cn'

/**
 * A recorded screen drawn in CSS: what a clip's thumbnail and player show.
 * Six scenes cover the seed data; add your own or swap for real poster frames.
 * `bubble` overlays the presenter's camera bubble, as recordings have.
 */
export function ScreenMock({ scene, presenter, bubble = true, className, bubbleSize = 'sm' }: { scene: Scene; presenter?: PresenterId; bubble?: boolean; className?: string; bubbleSize?: 'sm' | 'lg' }) {
  return (
    <div className={cn('relative overflow-hidden bg-[#0b0a09] @container', className)} aria-hidden>
      <div className="absolute inset-0 flex flex-col">
        <div className="flex h-[7%] min-h-2 shrink-0 items-center gap-[1.2%] border-b border-white/5 px-[3%]">
          <span className="size-[1.4cqw] min-h-1 min-w-1 rounded-full bg-white/15" />
          <span className="size-[1.4cqw] min-h-1 min-w-1 rounded-full bg-white/15" />
          <span className="size-[1.4cqw] min-h-1 min-w-1 rounded-full bg-white/15" />
          <span className="ml-[4%] h-[38%] w-[30%] rounded-full bg-white/6" />
        </div>
        <div className="relative min-h-0 flex-1">{SCENES[scene]}</div>
      </div>
      {bubble && presenter && (
        <img
          src={PRESENTERS[presenter].image}
          alt=""
          className={cn('absolute rounded-full object-cover ring-2 ring-black/40', bubbleSize === 'sm' ? 'bottom-[7%] left-[4%] size-[17cqw]' : 'bottom-[17%] left-[3%] size-[13cqw]')}
        />
      )}
    </div>
  )
}

const line = (w: string, extra = '') => <span className={cn('block h-[1.6cqw] min-h-[2px] rounded-full bg-white/10', extra)} style={{ width: w }} />

const SCENES: Record<Scene, React.ReactNode> = {
  site: (
    <div className="flex h-full flex-col justify-center px-[12%]">
      <p className="font-display text-[5.4cqw] leading-[1.05] font-semibold tracking-[-0.03em] text-[#e9e3d6]/80">{BRAND.name} is how teams explain work better.</p>
      <div className="mt-[4%] space-y-[1.6%]">
        {line('58%')}
        {line('44%')}
      </div>
      <div className="mt-[5%] flex gap-[2%]">
        <span className="h-[5cqw] w-[18%] rounded-full bg-[#e9e3d6]/70" />
        <span className="h-[5cqw] w-[14%] rounded-full ring-1 ring-white/15" />
      </div>
    </div>
  ),
  dashboard: (
    <div className="grid h-full grid-cols-[22%_1fr] gap-[3%] p-[4%]">
      <div className="space-y-[10%] rounded-[1.5cqw] bg-white/[0.03] p-[8%]">
        {line('80%')}
        {line('60%')}
        {line('70%')}
        {line('50%')}
      </div>
      <div className="flex flex-col gap-[4%]">
        <div className="grid grid-cols-3 gap-[3%]">
          {['#e5484d', '#e1b345', '#4cc27a'].map((c) => (
            <div key={c} className="rounded-[1.5cqw] bg-white/[0.04] p-[7%]">
              {line('50%')}
              <span className="mt-[12%] block h-[3.4cqw] w-[60%] rounded-full" style={{ background: c, opacity: 0.7 }} />
            </div>
          ))}
        </div>
        <div className="flex flex-1 items-end gap-[2.5%] rounded-[1.5cqw] bg-white/[0.03] p-[4%]">
          {[38, 52, 44, 70, 58, 82, 64, 90, 76].map((h, i) => (
            <span key={i} className="flex-1 rounded-t-[0.8cqw] bg-[#e9e3d6]/25" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  ),
  code: (
    <div className="grid h-full grid-cols-[20%_1fr]">
      <div className="space-y-[9%] border-r border-white/5 p-[6%]">
        {line('70%')}
        {line('85%', 'bg-[#e1b345]/40')}
        {line('60%')}
        {line('75%')}
        {line('55%')}
      </div>
      <div className="space-y-[2.6%] p-[5%] font-mono">
        {[
          ['14%', '#e5484d', '40%'],
          ['10%', '#7c8cff', '52%'],
          ['22%', '#4cc27a', '30%'],
          ['8%', '#e1b345', '46%'],
          ['18%', '#7c8cff', '24%'],
          ['12%', '#e5484d', '58%'],
          ['26%', '#4cc27a', '20%'],
          ['10%', '#e1b345', '36%'],
        ].map(([a, c, b], i) => (
          <div key={i} className="flex gap-[2%]">
            <span className="h-[1.6cqw] min-h-[2px] rounded-full opacity-60" style={{ width: a, background: c }} />
            <span className="h-[1.6cqw] min-h-[2px] rounded-full bg-white/12" style={{ width: b }} />
          </div>
        ))}
      </div>
    </div>
  ),
  doc: (
    <div className="mx-auto flex h-full w-[62%] flex-col gap-[3%] py-[7%]">
      <span className="h-[3cqw] w-[55%] rounded-full bg-[#e9e3d6]/50" />
      {line('100%')}
      {line('92%')}
      {line('96%')}
      <span className="my-[2%] block h-[18%] rounded-[1.5cqw] bg-white/[0.05]" />
      {line('88%')}
      {line('94%')}
      {line('60%')}
    </div>
  ),
  board: (
    <div className="grid h-full grid-cols-3 gap-[3%] p-[4%]">
      {[3, 2, 4].map((n, col) => (
        <div key={col} className="flex flex-col gap-[5%] rounded-[1.5cqw] bg-white/[0.03] p-[6%]">
          {line('45%', col === 1 ? 'bg-[#e1b345]/50' : '')}
          {Array.from({ length: n }, (_, i) => (
            <div key={i} className="space-y-[8%] rounded-[1.2cqw] bg-white/[0.05] p-[8%]">
              {line('85%')}
              {line('50%')}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
  deck: (
    <div className="flex h-full items-center justify-center p-[6%]">
      <div className="flex aspect-video w-[78%] flex-col justify-between rounded-[2cqw] bg-gradient-to-br from-[#2a1512] to-[#120d0b] p-[6%] ring-1 ring-white/5">
        <span className="h-[3.2cqw] w-[45%] rounded-full bg-[#e9e3d6]/60" />
        <div className="flex items-end gap-[3%]">
          {[30, 55, 80].map((h) => (
            <span key={h} className="w-[12%] rounded-t-[0.8cqw] bg-ember/60" style={{ height: `${h / 3}cqw` }} />
          ))}
          <span className="ml-auto h-[1.6cqw] w-[28%] rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  ),
}
