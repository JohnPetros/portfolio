import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULTS } from '@/theme/theme'
import en from './resources/en'
import es from './resources/es'
import pt from './resources/pt'

i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { translation: pt },
    en: { translation: en },
    es: { translation: es },
  },
  lng: DEFAULTS.lang,
  fallbackLng: 'pt-BR',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

export default i18n
