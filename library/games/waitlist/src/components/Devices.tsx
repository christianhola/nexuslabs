import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/*
  Device frames, drawn with CSS. Every length is in stage units (`--u`, one
  reference pixel at a 1440px-wide window), so they scale with the panel.
  Pass the screen content as children.
*/

const u = (n: number) => `calc(var(--u) * ${n})`

type LaptopProps = { label: string; children: ReactNode; className?: string }

export function Laptop({ label, children, className }: LaptopProps) {
  return (
    <div className={cx('relative', className)} style={{ width: u(1000), height: u(690) }}>
      {/* Lid */}
      <div
        className="absolute"
        style={{
          left: u(44),
          top: 0,
          width: u(912),
          height: u(616),
          borderRadius: `${u(26)} ${u(26)} ${u(6)} ${u(6)}`,
          background: 'linear-gradient(180deg, #2a2a2d 0%, #0b0b0c 6%, #0b0b0c 100%)',
          boxShadow: `inset 0 0 0 ${u(1.5)} #77777c, inset 0 0 0 ${u(4)} #1a1a1c, 0 ${u(2)} ${u(4)} rgb(0 0 0 / 0.12)`,
        }}
      >
        {/* Camera */}
        <span
          className="absolute rounded-full"
          style={{
            left: '50%',
            top: u(17),
            width: u(7),
            height: u(7),
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle at 35% 35%, #3b4250, #0e0f12 70%)',
          }}
        />
        {/* Screen */}
        <div
          className="absolute overflow-hidden"
          style={{ left: u(28), right: u(28), top: u(40), height: u(537), background: '#000' }}
        >
          {children}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(115deg, rgb(255 255 255 / 0.10) 0%, rgb(255 255 255 / 0.03) 35%, transparent 55%)' }}
          />
        </div>
        {/* Bottom bezel label */}
        <span
          className="absolute select-none whitespace-nowrap font-medium tracking-[0.01em]"
          style={{ left: '50%', bottom: u(11), transform: 'translateX(-50%)', fontSize: u(14), color: '#a4a4aa' }}
        >
          {label}
        </span>
      </div>

      {/* Hinge + base */}
      <div
        className="absolute"
        style={{
          left: 0,
          top: u(614),
          width: u(1000),
          height: u(36),
          borderRadius: `${u(3)} ${u(3)} ${u(40)} ${u(40)} / ${u(3)} ${u(3)} ${u(22)} ${u(22)}`,
          background:
            'linear-gradient(180deg, #4b4b50 0%, #9c9ca2 8%, #dcdce0 22%, #c6c6cb 55%, #a2a2a8 80%, #5d5d63 100%)',
          boxShadow: `inset 0 ${u(1)} 0 rgb(255 255 255 / 0.8), 0 ${u(18)} ${u(24)} ${u(-8)} rgb(0 0 0 / 0.35)`,
        }}
      >
        {/* Opening notch */}
        <span
          className="absolute"
          style={{
            left: '50%',
            top: 0,
            width: u(184),
            marginTop: u(3),
            height: u(14),
            transform: 'translateX(-50%)',
            borderRadius: `0 0 ${u(10)} ${u(10)}`,
            background: 'linear-gradient(180deg, #a2a2a8, #cfcfd4)',
            boxShadow: `inset 0 ${u(-1)} ${u(2)} rgb(0 0 0 / 0.15)`,
          }}
        />
      </div>
      {/* Contact shadow */}
      <div
        className="absolute"
        style={{
          left: u(40),
          right: u(40),
          top: u(642),
          height: u(20),
          borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgb(0 0 0 / 0.22), transparent)',
          filter: `blur(${u(3)})`,
        }}
      />
    </div>
  )
}

type PhoneProps = { children: ReactNode; className?: string }

export function Phone({ children, className }: PhoneProps) {
  return (
    <div className={cx('relative', className)} style={{ width: u(222), height: u(446) }}>
      {/* Side buttons */}
      {[
        { top: 70, h: 18 },
        { top: 104, h: 34 },
        { top: 146, h: 34 },
      ].map((b) => (
        <span
          key={b.top}
          className="absolute"
          style={{
            left: u(-2.5),
            top: u(b.top),
            width: u(3),
            height: u(b.h),
            borderRadius: u(2),
            background: 'linear-gradient(90deg, #4a4a4e, #8d8d92)',
          }}
        />
      ))}
      <span
        className="absolute"
        style={{ right: u(-2.5), top: u(118), width: u(3), height: u(56), borderRadius: u(2), background: 'linear-gradient(270deg, #4a4a4e, #8d8d92)' }}
      />
      {/* Steel band */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: u(40),
          background: 'linear-gradient(135deg, #a7a7ac 0%, #4c4c50 22%, #2b2b2e 50%, #5a5a5e 78%, #b5b5ba 100%)',
          boxShadow: `0 ${u(30)} ${u(40)} ${u(-18)} rgb(0 0 0 / 0.45), 0 ${u(4)} ${u(10)} rgb(0 0 0 / 0.15)`,
        }}
      />
      {/* Glass + bezel */}
      <div className="absolute" style={{ inset: u(3), borderRadius: u(37), background: '#050506' }}>
        <div className="absolute overflow-hidden" style={{ inset: u(9), borderRadius: u(29), background: '#000' }}>
          {children}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(120deg, rgb(255 255 255 / 0.14) 0%, rgb(255 255 255 / 0.04) 30%, transparent 50%)' }}
          />
        </div>
      </div>
    </div>
  )
}
