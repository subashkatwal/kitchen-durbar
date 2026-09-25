import { ArrowRight, ArrowUpRight, Award, Check, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import AdBannerSection from '../components/AdBannerSection'
import ProductCard from '../components/ProductCard'
import { ContactSection, CtaBand, TeamSection } from '../components/sections'
import { buttonClass, CONTAINER, indexLabel, SectionTitle } from '../components/ui'
import { categorySlot, useSiteContent } from '../content/site'
import { useProjects, useSiteImageGetter, useTestimonials } from '../context/CmsContext'
import { useLanguage } from '../context/LanguageContext'
import { CATEGORIES, type Advertisement, type Category, type Product } from '../types'

export default function Home() {
  const { t } = useLanguage()
  const site = useSiteContent()
  const home = site.home
  const siteImage = useSiteImageGetter()
  const { projects } = useProjects()
  const testimonials = useTestimonials()
  const [featured, setFeatured] = useState<Product[]>([])
  const [ads, setAds] = useState<Advertisement[]>([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const [testimonial, setTestimonial] = useState(0)

  useEffect(() => {
    // Featured products are chosen from the backend (Product.is_featured) -
    // toggle it per-product from the admin dashboard. Until any are flagged,
    // fall back to the newest products so the section is never empty.
    api
      .get<Product[]>('/products', { params: { is_featured: true, ordering: '-created_at' } })
      .then(async (res) => {
        if (res.data.length) return setFeatured(res.data)
        const latest = await api.get<Product[]>('/products', { params: { ordering: '-created_at' } })
        setFeatured(latest.data.slice(0, 6))
      })
      .catch(() => setFeatured([]))

    // One fetch for both homepage ad placements. The public /promotions
    // endpoint only returns active, in-window ads, ordered by priority.
    // Named "promotions" rather than "ads" so ad-blockers don't intercept it.
    api
      .get<Advertisement[]>('/promotions')
      .then((res) => setAds(res.data))
      .catch(() => setAds([]))
  }, [])

  const featuredCategories = useMemo(
    () => CATEGORIES.filter((c) => featured.some((p) => p.category === c)),
    [featured],
  )

  const visibleFeatured = featured.filter(
    (p) => (!category || p.category === category) && p.name.toLowerCase().includes(query.trim().toLowerCase()),
  )

  const homeProjects = projects.filter((p) => p.showOnHome).slice(0, 4)
  const quote = testimonials.length ? testimonials[testimonial % testimonials.length] : null

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground md:min-h-[calc(100vh-5rem)]">
        <img
          src={siteImage('home_hero')}
          width={1600}
          height={1008}
          alt="Commercial kitchen by Kitchen Durbar Solutions"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/70 to-foreground/20 md:via-foreground/55 md:to-transparent" />
        <div className={`relative flex items-center py-20 md:min-h-[calc(100vh-5rem)] ${CONTAINER}`}>
          <div className="reveal max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">{home.heroEyebrow}</p>
            <h1 className="mt-5 text-5xl leading-[.95] text-background sm:text-6xl md:text-8xl md:leading-[.92]">
              {home.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-background/75 md:mt-7">{home.heroCopy}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-9">
              <Link to="/products" className={buttonClass('brass')}>
                {t('home.exploreEquipment')} <ArrowRight />
              </Link>
              <Link to="/contact" className={buttonClass('darkOutline')}>
                {t('nav.requestQuote')}
              </Link>
            </div>
            {/* Stats row (150+ Projects / 120+ Clients / A–Z Solutions) hidden for now.
                Restore both blocks below (mobile + desktop) to bring it back.
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-background/20 pt-6 md:hidden">
              {home.stats.map(([value, label]) => (
                <div key={label} className="text-background">
                  <b className="block font-display text-3xl font-normal">{value}</b>
                  <span className="text-xs uppercase tracking-[.12em] text-background/60">{label}</span>
                </div>
              ))}
            </div>
            */}
          </div>
        </div>
        {/*
        <div className="absolute bottom-0 right-0 hidden bg-background px-8 py-5 md:flex md:gap-10">
          {home.stats.map(([value, label]) => (
            <div key={label}>
              <b className="font-display text-3xl font-normal">{value}</b>
              <span className="ml-2 text-xs uppercase tracking-[.14em] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
        */}
      </section>

      {/* Signature build - 360° circular station (images in /public) */}
      <section id="signature" className="relative scroll-mt-20 overflow-hidden bg-foreground py-16 text-background md:py-24 lg:py-28">
        <div className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-40 size-[28rem] rounded-full bg-primary/10 blur-3xl" />
        <div className={`relative grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-14 ${CONTAINER}`}>
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <Award className="size-4 shrink-0" />
              {home.showcaseBadge}
            </span>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-background/50">{home.showcaseEyebrow}</p>
            <h2 className="mt-4 text-[2.25rem] leading-[1.05] sm:text-5xl md:text-6xl">{home.showcaseTitle}</h2>
            <p className="mt-6 max-w-xl leading-8 text-background/70">{home.showcaseCopy}</p>
            <ul className="mt-8 grid gap-4 text-sm font-bold sm:grid-cols-2">
              {home.showcasePoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {point}
                </li>
              ))}
            </ul>
            <Link to="/contact" className={buttonClass('brass', 'lg', 'mt-10 w-full sm:w-auto')}>
              {home.showcaseCta} <ArrowRight />
            </Link>
          </div>

          <div className="relative lg:col-span-7">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:grid-rows-2">
              <figure className="group relative col-span-2 aspect-[4/3] overflow-hidden bg-background/5 lg:row-span-2 lg:aspect-auto lg:min-h-[30rem]">
                <img
                  src="/second.jpeg"
                  alt="360° circular stainless-steel kitchen station by Kitchen Durbar Solutions"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </figure>
              {[
                ['/first.jpeg', 'Circular station with built-in under-counter refrigeration'],
                ['/third.jpeg', 'Top view of the circular kitchen station'],
              ].map(([src, alt]) => (
                <figure key={src} className="group relative aspect-square overflow-hidden bg-background/5 lg:aspect-auto">
                  <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </figure>
              ))}
            </div>
            {/* "1st" seal */}
            <div className="absolute -top-5 left-3 flex size-24 flex-col items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl ring-4 ring-foreground sm:size-28 lg:-left-8 lg:-top-8 lg:size-32">
              <Award className="size-5 sm:size-6" />
              <b className="mt-1 font-display text-3xl font-normal leading-none sm:text-4xl">1st</b>
            </div>
          </div>
        </div>
      </section>

      <AdBannerSection ads={ads.filter((a) => a.position === 'home_top')} />

      {/* Our approach */}
      <section className={`grid gap-12 py-16 md:py-24 lg:grid-cols-2 lg:items-center lg:py-32 ${CONTAINER}`}>
        <div className="relative">
          <img
            src={siteImage('home_approach')}
            width={1200}
            height={1200}
            loading="lazy"
            alt="Kitchen planning consultation"
            className="aspect-square w-full object-cover"
          />
          <div className="absolute -bottom-5 right-3 bg-primary px-5 py-4 text-primary-foreground sm:px-6 sm:py-5 md:right-8">
            <b className="font-display text-2xl font-normal sm:text-3xl">{home.sinceValue}</b>
            <span className="block text-xs uppercase tracking-[.14em]">{home.sinceLabel}</span>
          </div>
        </div>
        <div className="lg:pl-10">
          <SectionTitle eyebrow={home.approachEyebrow} title={home.approachTitle} />
          <p className="max-w-xl leading-8 text-muted-foreground">{home.approachCopy}</p>
          <div className="mt-8 grid gap-4 text-sm font-bold sm:grid-cols-2">
            {home.approachPoints.map((point) => (
              <span key={point} className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-primary" />
                {point}
              </span>
            ))}
          </div>
          <Link to="/about" className={buttonClass('outline', 'lg', 'mt-9')}>
            {t('home.ourCompany')} <ArrowRight />
          </Link>
        </div>
      </section>

      {/* Sectors */}
      <section className="bg-card py-16 md:py-24">
        <div className={CONTAINER}>
          <SectionTitle eyebrow={home.sectorsEyebrow} title={home.sectorsTitle} />
          <div className="grid border-l border-t border-border md:grid-cols-2 lg:grid-cols-3">
            {site.sectors.map(([title, copy], i) => (
              <Link
                key={title}
                to="/solutions"
                className="group relative border-b border-r border-border p-6 transition-colors hover:bg-background sm:p-7"
              >
                <span className="text-xs text-primary">{indexLabel(i)}</span>
                <h3 className="mt-6 text-3xl sm:mt-10">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
                <ArrowUpRight className="absolute right-6 top-6 size-5 text-muted-foreground transition-colors group-hover:text-primary sm:right-7 sm:top-7" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment categories */}
      <section className={`py-16 md:py-24 ${CONTAINER}`}>
        <SectionTitle eyebrow={home.categoriesEyebrow} title={home.categoriesTitle} />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to={`/products?category=${encodeURIComponent(c)}`}
              className="group relative min-h-40 overflow-hidden bg-foreground sm:min-h-56"
            >
              <img
                src={siteImage(categorySlot(c))}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-105 group-hover:opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 sm:p-6">
                <h3 className="text-2xl text-background sm:text-3xl">{site.categoryLabels[c]}</h3>
                <ArrowUpRight className="hidden size-5 shrink-0 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:block" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured equipment */}
      {featured.length > 0 && (
        <section className="bg-card py-16 md:py-24">
          <div className={CONTAINER}>
            <SectionTitle eyebrow={home.featuredEyebrow} title={home.featuredTitle} copy={home.featuredCopy} />
            <div className="mb-8 flex flex-col gap-4 border-y border-border py-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  aria-label={t('products.searchLabel')}
                  placeholder={t('products.searchLabel')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-11 w-full border border-input bg-card pl-10 pr-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0">
                {(['', ...featuredCategories] as (Category | '')[]).map((c) => (
                  <button
                    key={c || 'all'}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={buttonClass(category === c ? 'brass' : 'outline', 'sm', 'shrink-0')}
                  >
                    {c ? site.categoryLabels[c] : t('products.all')}
                  </button>
                ))}
              </div>
            </div>
            {visibleFeatured.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleFeatured.slice(0, 6).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">{t('products.notFound')}</p>
            )}
            <div className="mt-10 flex justify-center">
              <Link to="/products" className={buttonClass('outline', 'lg', 'w-full sm:w-auto')}>
                {t('home.viewCatalogue')} <ArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why us */}
      <section className="bg-foreground py-16 text-background md:py-24">
        <div className={CONTAINER}>
          <SectionTitle eyebrow={home.whyEyebrow} title={home.whyTitle} light />
          <div className="grid gap-px bg-background/15 md:grid-cols-2 lg:grid-cols-3">
            {site.services.map(([title, copy], i) => (
              <div key={title} className="bg-foreground p-6 sm:p-7">
                <span className="text-primary">{indexLabel(i)}</span>
                <h3 className="mt-6 text-3xl sm:mt-10">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-background/60">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className={`py-16 md:py-24 ${CONTAINER}`}>
        <SectionTitle eyebrow={home.processEyebrow} title={home.processTitle} />
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-5">
          {site.steps.map((step, i) => (
            <div key={step} className="relative border-t border-primary pt-5">
              <span className="text-xs text-muted-foreground">{indexLabel(i)}</span>
              <h3 className="mt-4 text-3xl md:mt-6">{step}</h3>
              {i < site.steps.length - 1 && (
                <ArrowRight className="absolute right-0 top-5 hidden size-4 text-primary md:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Selected projects (Admin → Projects) */}
      {homeProjects.length > 0 && (
        <section className="bg-card py-16 md:py-24">
          <div className={CONTAINER}>
            <div className="flex items-end justify-between gap-6">
              <SectionTitle eyebrow={home.projectsEyebrow} title={home.projectsTitle} />
              <Link to="/projects" className={buttonClass('outline', 'lg', 'mb-10 max-md:hidden')}>
                {t('home.allProjects')} <ArrowRight />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {homeProjects.map((project, i) => (
                <article key={project.id} className={i === 0 && homeProjects.length > 2 ? 'md:row-span-2' : ''}>
                  <div className="group relative h-full min-h-72 overflow-hidden sm:min-h-80">
                    <img
                      src={project.image}
                      loading="lazy"
                      alt={project.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 to-transparent" />
                    <div className="absolute bottom-0 p-6 text-background">
                      <p className="text-xs uppercase tracking-[.14em] text-primary">{project.sector}</p>
                      <h3 className="mt-2 text-3xl">{project.title}</h3>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <Link to="/projects" className={buttonClass('outline', 'lg', 'mt-8 w-full md:hidden')}>
              {t('home.allProjects')} <ArrowRight />
            </Link>
          </div>
        </section>
      )}

      <TeamSection hideWhenEmpty className="" />

      {/* Testimonials (Admin → Testimonials) */}
      {quote && (
        <section className="border-t border-border px-5 py-16 md:py-24 lg:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">{home.testimonialEyebrow}</p>
            <blockquote className="mt-8 font-display text-3xl leading-tight sm:text-4xl md:text-5xl">“{quote.quote}”</blockquote>
            <p className="mt-6 text-sm text-muted-foreground">{quote.source}</p>
            {testimonials.length > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  type="button"
                  className={buttonClass('outline', 'icon', 'h-11 w-11')}
                  aria-label={t('home.prevTestimonial')}
                  onClick={() => setTestimonial((i) => (i - 1 + testimonials.length) % testimonials.length)}
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  className={buttonClass('outline', 'icon', 'h-11 w-11')}
                  aria-label={t('home.nextTestimonial')}
                  onClick={() => setTestimonial((i) => (i + 1) % testimonials.length)}
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <AdBannerSection ads={ads.filter((a) => a.position === 'home_bottom')} />

      <CtaBand />
      <ContactSection />
    </>
  )
}
