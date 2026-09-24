import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../api/client'
import { SITE_IMAGE_SLOTS, type SiteImageSlot } from '../content/site'
import type { CmsProject, CmsTestimonial, SiteImage } from '../types'
import { useLanguage } from './LanguageContext'

/**
 * Admin-managed storefront content (Admin → Site Images / Projects /
 * Testimonials), fetched once at startup and shared by every page.
 * `refresh()` is called by the admin screens after an edit so the storefront
 * picks the change up without a reload.
 */
interface CmsContextValue {
  images: Partial<Record<SiteImageSlot, string>>
  projects: CmsProject[]
  testimonials: CmsTestimonial[]
  loaded: boolean
  refresh: () => void
}

const CmsContext = createContext<CmsContextValue | undefined>(undefined)

export function CmsProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<CmsContextValue['images']>({})
  const [projects, setProjects] = useState<CmsProject[]>([])
  const [testimonials, setTestimonials] = useState<CmsTestimonial[]>([])
  const [loaded, setLoaded] = useState(false)

  const refresh = useCallback(() => {
    // Each request fails independently - a broken one just leaves its part
    // on defaults/empty rather than blanking the whole storefront.
    Promise.allSettled([
      api.get<SiteImage[]>('/site-images').then((res) => {
        const map: CmsContextValue['images'] = {}
        for (const img of res.data) map[img.key as SiteImageSlot] = img.image
        setImages(map)
      }),
      api.get<CmsProject[]>('/projects').then((res) => setProjects(res.data.filter((p) => p.is_active))),
      api.get<CmsTestimonial[]>('/testimonials').then((res) => setTestimonials(res.data.filter((t) => t.is_active))),
    ]).finally(() => setLoaded(true))
  }, [])

  useEffect(refresh, [refresh])

  return (
    <CmsContext.Provider value={{ images, projects, testimonials, loaded, refresh }}>{children}</CmsContext.Provider>
  )
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within CmsProvider')
  return ctx
}

/** The uploaded image for a slot, or the design's default photo. */
export function useSiteImage(slot: SiteImageSlot): string {
  return useSiteImageGetter()(slot)
}

/** Same as useSiteImage, for looking up several slots in a loop. */
export function useSiteImageGetter(): (slot: SiteImageSlot) => string {
  const { images } = useCms()
  return (slot) => images[slot] || SITE_IMAGE_SLOTS[slot].fallback
}

/** Projects with their title/sector in the current language (English fallback). */
export function useProjects() {
  const { projects, loaded } = useCms()
  const { language } = useLanguage()
  return {
    loaded,
    projects: projects.map((p) => ({
      id: p.id,
      image: p.image,
      showOnHome: p.show_on_home,
      title: (language === 'ne' && p.title_ne) || p.title,
      sector: (language === 'ne' && p.sector_ne) || p.sector,
    })),
  }
}

export function useTestimonials() {
  const { testimonials } = useCms()
  const { language } = useLanguage()
  return testimonials.map((t) => ({
    id: t.id,
    quote: (language === 'ne' && t.quote_ne) || t.quote,
    source: (language === 'ne' && t.source_ne) || t.source,
  }))
}
