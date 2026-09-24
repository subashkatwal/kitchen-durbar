import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CtaBand } from '../components/sections'
import { CONTAINER, indexLabel, PageHero, SectionTitle } from '../components/ui'
import { useSiteContent } from '../content/site'
import { useSiteImage } from '../context/CmsContext'

export default function Solutions() {
  const site = useSiteContent()
  const heroImage = useSiteImage('solutions_hero')

  return (
    <>
      <PageHero {...site.solutions.hero} image={heroImage} />
      <section className={`py-16 md:py-24 ${CONTAINER}`}>
        <SectionTitle eyebrow={site.solutions.eyebrow} title={site.solutions.title} />
        <div className="grid border-l border-t border-border md:grid-cols-2 lg:grid-cols-3">
          {site.sectors.map(([title, copy], i) => (
            <Link
              key={title}
              to="/contact"
              className="group border-b border-r border-border p-8 transition-colors hover:bg-card"
            >
              <span className="text-xs text-primary">{indexLabel(i)}</span>
              <h2 className="mt-10 text-3xl">{title}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{copy}</p>
              <ArrowRight className="mt-8 size-5 text-primary transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  )
}
