import { ContactSection } from '../components/sections'
import { CONTAINER, PageHero } from '../components/ui'
import { COMPANY, useSiteContent } from '../content/site'
import { useSiteImage } from '../context/CmsContext'

export default function Contact() {
  const site = useSiteContent()
  const heroImage = useSiteImage('contact_hero')

  return (
    <>
      <PageHero {...site.contact.hero} image={heroImage} />
      <ContactSection />
      <section className="border-t border-border bg-card pb-24">
        <div className={CONTAINER}>
          <div className="mb-8 flex flex-col justify-between gap-3 pt-16 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">{site.contact.visitEyebrow}</p>
              <h2 className="mt-3 text-4xl md:text-5xl">{site.contact.visitTitle}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{site.address.full}</p>
          </div>
          <iframe
            title="Kitchen Durbar Solutions location in Bhaisepati"
            src={COMPANY.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[420px] w-full border-0 md:h-[520px]"
          />
        </div>
      </section>
    </>
  )
}
