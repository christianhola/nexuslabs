import { Card, CardText } from '../components/Card'
import { Container } from '../components/Container'
import { FireStreaks } from '../components/FireStreaks'
import { Pedigree } from '../components/Pedigree'
import { Reveal } from '../components/Reveal'
import { ThermalImage } from '../components/ThermalImage'
import { SectionHeading } from '../components/Typography'
import { photos, why } from '../content'

/** "Why Maritime Fusion?": three proof cards over a band of fire streaks. */
export function Why() {
  const [team, prototype, volume] = why.cards
  return (
    <section aria-labelledby="why-title" className="relative isolate overflow-hidden py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading id="why-title" title={why.title} />
        </Reveal>
      </Container>
      <div className="relative mt-14 sm:mt-20">
        <div className="absolute inset-x-0 top-1/2 -z-10 h-[150%] -translate-y-1/2" aria-hidden>
          <FireStreaks intensity={1.5} />
        </div>
        <Container size="xl">
          <ul className="mx-auto grid max-w-[420px] gap-4 lg:max-w-[1180px] lg:grid-cols-3 lg:gap-8">
            <Reveal as="li">
              <Card tone="fire" as="article" className="flex h-[560px] flex-col sm:h-[600px]">
                <div className="absolute inset-0 -z-10">
                  <ThermalImage src={photos.crew} alt="" className="absolute inset-0" />
                  <div className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-[#4a1503] from-10% via-[#7a2606]/60 to-transparent" />
                </div>
                <CardText title={team.title} body={team.body} />
                <div className="mt-auto p-1.5">
                  <Pedigree marks={why.pedigree} />
                </div>
              </Card>
            </Reveal>
            <Reveal as="li" delay={0.08}>
              <Card tone="ocean" as="article" className="flex h-[560px] flex-col sm:h-[600px]">
                <div className="absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-[#0e1c3d] to-transparent" aria-hidden />
                <CardText title={prototype.title} body={prototype.body} />
                <div className="relative mx-auto mt-auto w-[92%] translate-y-[4%]">
                  <div className="absolute inset-[12%] -z-10 rounded-full bg-plasma/45 blur-[60px]" aria-hidden />
                  <img src={photos.reactor} alt="" loading="lazy" decoding="async" width={900} height={972} className="w-full" />
                </div>
              </Card>
            </Reveal>
            <Reveal as="li" delay={0.16}>
              <Card tone="stripes" as="article" className="flex h-[560px] flex-col sm:h-[600px]">
                <div className="absolute inset-x-0 top-0 -z-10 h-[45%] bg-gradient-to-b from-[#132651] via-[#1d3263]/70 to-transparent" aria-hidden />
                <CardText title={volume.title} body={volume.body} />
                <p className="mt-auto px-6 pb-8 text-center text-[88px] font-medium leading-none tracking-[-0.05em] sm:text-[104px]">
                  {volume.stat}
                  <span className="ml-1 text-[0.62em]">{volume.unit}</span>
                </p>
              </Card>
            </Reveal>
          </ul>
        </Container>
      </div>
    </section>
  )
}
