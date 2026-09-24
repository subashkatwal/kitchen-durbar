import type { ReactNode } from 'react'

/**
 * Small design-system primitives shared by the storefront pages - class
 * recipes lifted from the Lovable design so every page's buttons, section
 * headers and heroes stay visually identical.
 */

type ButtonVariant = 'brass' | 'outline' | 'darkOutline' | 'light' | 'ghost' | 'destructive'
type ButtonSize = 'lg' | 'sm' | 'icon'

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  brass: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
  outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
  darkOutline: 'border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10',
  light: 'bg-background text-foreground hover:bg-accent',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
}

const BUTTON_SIZES: Record<ButtonSize, string> = {
  lg: 'h-12 rounded-sm px-7 text-xs font-bold uppercase tracking-[0.12em]',
  sm: 'h-9 rounded-sm px-3.5 text-xs font-medium',
  icon: 'h-10 w-10 rounded-sm',
}

export function buttonClass(variant: ButtonVariant = 'brass', size: ButtonSize = 'lg', extra = '') {
  return `${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${extra}`.trim()
}

export const INPUT_CLASS =
  'mt-2 h-11 w-full border border-input bg-background px-3 text-sm font-normal normal-case tracking-normal outline-none transition-colors focus:border-primary'

export const LABEL_CLASS = 'block text-xs font-bold uppercase tracking-[0.12em]'

/** Container used by every full-width section. */
export const CONTAINER = 'mx-auto max-w-[1440px] px-5 lg:px-10'

/** Two-digit index label ("01", "02", ...) used by numbered grids. */
export function indexLabel(i: number) {
  return String(i + 1).padStart(2, '0')
}

export function SectionTitle({
  eyebrow,
  title,
  copy,
  light = false,
}: {
  eyebrow: string
  title: string
  copy?: string
  light?: boolean
}) {
  return (
    <div className="mb-8 max-w-3xl md:mb-10">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 className={`text-[2.25rem] leading-[1.05] sm:text-5xl md:text-6xl ${light ? 'text-background' : 'text-foreground'}`}>{title}</h2>
      {copy && (
        <p className={`mt-5 max-w-2xl text-base leading-7 ${light ? 'text-background/65' : 'text-muted-foreground'}`}>{copy}</p>
      )}
    </div>
  )
}

/** Full-bleed photo hero used at the top of every inner page. */
export function PageHero({
  eyebrow,
  title,
  copy,
  image,
  children,
}: {
  eyebrow: string
  title: string
  copy?: string
  image: string
  children?: ReactNode
}) {
  return (
    <section className="relative min-h-[58vh] overflow-hidden bg-foreground">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40 md:via-foreground/55 md:to-transparent" />
      <div className={`relative flex min-h-[58vh] items-end pb-12 pt-24 md:pb-16 ${CONTAINER}`}>
        <div className="reveal max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
          <h1 className="mt-4 text-4xl leading-[1] text-background sm:text-5xl md:text-7xl md:leading-[.98]">{title}</h1>
          {copy && <p className="mt-5 max-w-xl text-lg leading-8 text-background/75 md:mt-6">{copy}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}

/** Compact page header for utility pages (cart, account, checkout). */
export function PageHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <section className="border-b border-border bg-card">
      <div className={`py-10 md:py-14 ${CONTAINER}`}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h1 className="mt-3 text-4xl leading-none sm:text-5xl md:text-6xl">{title}</h1>
      </div>
    </section>
  )
}

export function formatNpr(value: number | string) {
  return `NPR ${Number(value).toLocaleString()}`
}
