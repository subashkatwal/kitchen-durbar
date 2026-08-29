import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import en, { type TranslationKey } from '../i18n/en'
import ne from '../i18n/ne'

export type Language = 'en' | 'ne'

const STORAGE_KEY = 'kd_lang'
const DICTIONARIES: Record<Language, Record<TranslationKey, string>> = { en, ne }

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

function loadLanguage(): Language {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw === 'ne' ? 'ne' : 'en'
  } catch {
    return 'en'
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(loadLanguage)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // localStorage unavailable (private browsing, blocked) - language just
      // won't persist across reloads, not worth surfacing to the user.
    }
    document.documentElement.lang = language
  }, [language])

  function setLanguage(lang: Language) {
    setLanguageState(lang)
  }

  function t(key: TranslationKey, vars?: Record<string, string | number>) {
    let text = DICTIONARIES[language][key] ?? key
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        text = text.replace(`{${k}}`, String(v))
      }
    }
    return text
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
