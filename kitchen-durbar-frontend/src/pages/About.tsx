import { CtaBand, TeamSection } from '../components/sections'
import { CONTAINER, PageHero, SectionTitle } from '../components/ui'
import { useSiteContent } from '../content/site'
import { useSiteImage } from '../context/CmsContext'

export default function About() {
  const site = useSiteContent()
  const about = site.about
  const heroImage = useSiteImage('about_hero')
  const partnerImage = useSiteImage('about_partner')
  const teamImage = useSiteImage('about_team')

  return (
    <>
      <PageHero {...about.hero} image={heroImage} />

      <section className={`grid gap-12 py-16 md:py-24 lg:grid-cols-2 lg:items-center ${CONTAINER}`}>
        <img
          src={partnerImage}
          alt="Kitchen Durbar Solutions kitchen planning team"
          loading="lazy"
          className="aspect-square w-full object-cover"
        />
        <div>
          <SectionTitle eyebrow={about.partnerEyebrow} title={about.partnerTitle} />
          <p className="leading-8 text-muted-foreground">{about.partnerCopy}</p>
          <div className="mt-9 grid grid-cols-2 gap-6 border-t border-border pt-7">
            {about.stats.map(([value, label]) => (
              <div key={label}>
                <b className="font-display text-5xl font-normal text-primary">{value}</b>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-foreground py-16 md:py-24 text-background">
        <div className={`grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-center ${CONTAINER}`}>
          <img
            src={teamImage}
            width={1600}
            height={1008}
            loading="lazy"
            alt="Kitchen Durbar Solutions project and installation team"
            className="aspect-[8/5] w-full object-cover"
          />
          <div>
            <SectionTitle eyebrow={about.teamEyebrow} title={about.teamTitle} copy={about.teamCopy} light />
            <p className="leading-8 text-background/65">{about.teamCopy2}</p>
          </div>
        </div>
      </section>

      <TeamSection className="" />

      <section className="bg-card py-16 md:py-24">
        <div className={CONTAINER}>
          <SectionTitle eyebrow={about.capabilitiesEyebrow} title={about.capabilitiesTitle} />
          <div className="grid border-l border-t border-border md:grid-cols-3">
            {site.services.map(([title, copy]) => (
              <div key={title} className="border-b border-r border-border p-7">
                <h3 className="text-3xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
