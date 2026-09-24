import { CtaBand } from '../components/sections'
import { CONTAINER, PageHero, SectionTitle } from '../components/ui'
import { useSiteContent } from '../content/site'
import { useProjects, useSiteImage } from '../context/CmsContext'

export default function Projects() {
  const site = useSiteContent()
  const page = site.projectsPage
  const heroImage = useSiteImage('projects_hero')
  const { projects, loaded } = useProjects()

  return (
    <>
      <PageHero {...page.hero} image={heroImage} />
      <section className={`py-16 md:py-24 ${CONTAINER}`}>
        <SectionTitle eyebrow={page.eyebrow} title={page.title} />
        {loaded && projects.length === 0 ? (
          <p className="border-t border-border pt-6 text-muted-foreground">{page.empty}</p>
        ) : (
          <div className="grid gap-x-5 gap-y-12 md:grid-cols-2">
            {projects.map((project, i) => (
              <article key={project.id} className={i % 3 === 0 ? 'md:col-span-2' : ''}>
                <div className="overflow-hidden bg-muted">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="aspect-[16/9] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>
                <p className="mt-4 text-xs uppercase tracking-[.14em] text-primary">{project.sector}</p>
                <h2 className="mt-1 text-3xl">{project.title}</h2>
              </article>
            ))}
          </div>
        )}
      </section>
      <CtaBand />
    </>
  )
}
