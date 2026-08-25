export const ICONS: Record<string, string> = {
  burner:
    '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="14"/><circle cx="32" cy="32" r="6"/><path d="M32 8v8M32 48v8M8 32h8M48 32h8"/></svg>',
  table:
    '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="20" width="48" height="6" rx="2"/><path d="M14 26v28M50 26v28M8 54h48"/></svg>',
  rack:
    '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><rect x="10" y="8" width="44" height="48" rx="3"/><path d="M10 22h44M10 36h44M22 8v48M42 8v48"/></svg>',
  sink:
    '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="24" width="48" height="28" rx="4"/><path d="M20 24v-8a4 4 0 014-4h16a4 4 0 014 4v8"/><path d="M16 16h32"/></svg>',
  showcase:
    '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="12" width="52" height="40" rx="3"/><path d="M6 28h52"/><path d="M20 12v40M44 12v40"/></svg>',
  chiller:
    '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><rect x="10" y="8" width="44" height="48" rx="4"/><path d="M10 20h44"/><rect x="18" y="28" width="10" height="20" rx="2"/><rect x="36" y="28" width="10" height="20" rx="2"/><circle cx="32" cy="14" r="3"/></svg>',
  fryer:
    '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><rect x="12" y="20" width="40" height="30" rx="4"/><path d="M12 30h40"/><rect x="20" y="10" width="8" height="12" rx="2"/><rect x="36" y="10" width="8" height="12" rx="2"/></svg>',
  shelves:
    '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="10" width="48" height="4" rx="2"/><rect x="8" y="28" width="48" height="4" rx="2"/><rect x="8" y="46" width="48" height="4" rx="2"/><path d="M12 14v14M12 32v14M52 14v14M52 32v14"/></svg>',
  chimney:
    '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 52V24c0-6.6 5.4-12 12-12s12 5.4 12 12v28"/><rect x="14" y="48" width="36" height="8" rx="2"/><path d="M28 20c0-4 4-8 4-8s4 4 4 8"/></svg>',
  others:
    '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="10"/><path d="M32 10v12M32 42v12M10 32h12M42 32h12"/></svg>',
  product:
    '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><rect x="12" y="8" width="40" height="48" rx="4"/><path d="M12 20h40"/><circle cx="32" cy="14" r="3"/><path d="M20 32h24M20 40h16"/></svg>',
}

export function Icon({ name, className }: { name: string; className?: string }) {
  const svg = ICONS[name] || ICONS.product
  // eslint-disable-next-line react/no-danger
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />
}
