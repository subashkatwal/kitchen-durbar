import { CtaBand } from '../components/sections'
import { CONTAINER, indexLabel, PageHero, SectionTitle } from '../components/ui'
import { useSiteContent } from '../content/site'
import { useSiteImage } from '../context/CmsContext'

export default function Services() {
  const site = useSiteContent()
  const page = site.servicesPage
  const heroImage = useSiteImage('services_hero')

  return (
    <>
      <PageHero {...page.hero} image={heroImage} />
      <section className={`py-16 md:py-24 ${CONTAINER}`}>
        <SectionTitle eyebrow={page.eyebrow} title={page.title} />
        <div className="border-t border-border">
          {site.services.map(([title, copy], i) => (
            <div key={title} className="grid gap-4 border-b border-border py-8 md:grid-cols-[100px_1fr_1fr]">
              <span className="text-primary">{indexLabel(i)}</span>
              <h2 className="text-3xl">{title}</h2>
              <p className="leading-7 text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card py-16 md:py-24">
        <div className={CONTAINER}>
          <SectionTitle eyebrow={page.alsoEyebrow} title={page.alsoTitle} />
          <div className="grid border-l border-t border-border md:grid-cols-3">
            {page.alsoItems.map(([title, copy]) => (
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
