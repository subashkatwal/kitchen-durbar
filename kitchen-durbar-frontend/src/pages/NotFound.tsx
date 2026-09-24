import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonClass, CONTAINER } from '../components/ui'
import { useLanguage } from '../context/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()
  return (
    <section className={`flex min-h-[70vh] flex-col items-start justify-center py-16 md:py-24 ${CONTAINER}`}>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">404</p>
      <h1 className="mt-4 max-w-3xl text-4xl leading-none sm:text-5xl md:text-7xl">{t('notFound.title')}</h1>
      <Link to="/" className={buttonClass('brass', 'lg', 'mt-10')}>
        <ArrowLeft /> {t('notFound.back')}
      </Link>
    </section>
  )
}
