import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check } from 'lucide-react'

import { Button } from '../components/Button'
import { Coin } from '../components/Coin'
import { Container } from '../components/Container'
import { Input } from '../components/Field'
import { Reveal } from '../components/Reveal'
import { cta } from '../content'
import { useSubscribe } from '../lib/useSubscribe'

export function Cta() {
  const { email, setEmail, state, error, submit } = useSubscribe()

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="depth relative overflow-hidden rounded-[32px] bg-[radial-gradient(90%_120%_at_0%_0%,#241a5c_0%,#0d0b1a_50%,#050506_100%)] px-6 py-16 sm:px-14 sm:py-20">
            <div className="pointer-events-none absolute -right-6 -bottom-28 hidden opacity-95 md:block">
              <div className="animate-float">
                <Coin size={360} thickness={76} pose="rotateX(8deg) rotateY(-42deg) rotateZ(-14deg)" />
              </div>
            </div>
            <div className="relative max-w-[560px]">
              <h2 className="font-display text-[38px] font-semibold leading-[1.04] tracking-[-0.04em] text-balance sm:text-[56px]">{cta.title}</h2>
              <p className="mt-5 text-[17px] leading-relaxed text-muted">{cta.body}</p>
              <form onSubmit={submit} noValidate className="mt-8 flex flex-col gap-3 sm:flex-row">
                <label htmlFor="cta-email" className="sr-only">
                  {cta.placeholder}
                </label>
                <Input
                  id="cta-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  aria-invalid={state === 'error' || undefined}
                  aria-describedby={state === 'error' || state === 'done' ? 'cta-status' : undefined}
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                  placeholder={cta.placeholder}
                  className="sm:flex-1"
                />
                <Button size="lg" className="!px-6" loading={state === 'loading'} type="submit">
                  {cta.button}
                  {state !== 'loading' && <ArrowRight className="size-[18px] transition-transform group-hover/button:translate-x-1" />}
                </Button>
              </form>
              <p className="mt-3 text-[13px] text-muted">Demo form. Addresses are not saved and no email is sent.</p>
              <AnimatePresence>
                {(state === 'done' || state === 'error') && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={state === 'done' ? 'mt-3 flex items-center gap-2 text-[14px] text-[#4ade80]' : 'mt-3 text-[14px] text-[#ff7b5c]'}
                    id="cta-status"
                    role="status"
                  >
                    {state === 'done' && <Check className="size-4" />}
                    {state === 'done' ? cta.success : error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
