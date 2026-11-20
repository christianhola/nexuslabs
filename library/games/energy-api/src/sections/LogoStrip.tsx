import { Container } from '../components/Container'
import { customers } from '../content'

/** Invented customer wordmarks set in type, each with its own weight and case. */
const styles = ['font-semibold tracking-[-0.04em]', 'font-mono font-medium tracking-[-0.02em]', 'font-medium italic tracking-[-0.02em]', 'font-semibold tracking-[0.02em]', 'font-normal tracking-[-0.05em]', 'font-medium tracking-[-0.01em]']

export function LogoStrip() {
  return (
    <section aria-label="Customers" className="py-16 sm:py-20">
      <Container>
        <p className="text-center text-[15px] text-muted">Trusted by energy companies across Europe and North America</p>
        <ul className="mt-8 grid grid-cols-2 items-center gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {customers.map((c, i) => (
            <li key={c} className={`text-center text-[19px] text-ink-2/80 ${styles[i % styles.length]}`}>
              {c}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
