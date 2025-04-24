// src/locales/i18n.ts
import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    birthPlace: 'Place of birth',
    nationality: 'Nationality',
    language: 'Language',
  },
  es: {
    birthPlace: 'Lugar de nacimiento',
    nationality: 'Nacionalidad',
    language: 'Idioma',
  },
  de: {
    birthPlace: 'Geburtsort',
    nationality: 'Staatsangehörigkeit',
    language: 'Sprache',
  },
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})

export default i18n
