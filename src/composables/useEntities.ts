import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const countries = ref<any[]>([])
const organizations = ref<any[]>([])
const voiceTypes = ref<any[]>([])

export const useEntities = () => {
  const { locale } = useI18n()

  const fetchEntities = async () => {
    const [countriesRes, organizationsRes, voiceTypesRes] = await Promise.all([
      fetch('http://localhost:1337/api/countries?populate=localizations&pagination[pageSize]=100'),
      fetch(
        'http://localhost:1337/api/organizations?populate=localizations&pagination[pageSize]=100',
      ),
      fetch(
        'http://localhost:1337/api/voice-types?populate=localizations&pagination[pageSize]=100',
      ),
    ])

    const countriesData = await countriesRes.json()
    const organizationsData = await organizationsRes.json()
    const voiceTypesData = await voiceTypesRes.json()

    countries.value = countriesData.data
    organizations.value = organizationsData.data
    voiceTypes.value = voiceTypesData.data
  }

  const findLocalizedEntityName = (entities: any[], documentId: string) => {
    const entity = entities.find((e) => e.documentId === documentId)
    if (!entity) return 'No disponible'

    const localized = entity.localizations?.find((l: any) => l.locale === locale.value)

    // Ahora soporta ambos campos: 'name' y 'title'
    return localized?.name || localized?.title || entity.name || entity.title || 'No disponible'
  }

  const getCountryName = (documentId: string) =>
    findLocalizedEntityName(countries.value, documentId)
  const getOrganizationName = (documentId: string) =>
    findLocalizedEntityName(organizations.value, documentId)
  const getVoiceTypeName = (documentId: string) =>
    findLocalizedEntityName(voiceTypes.value, documentId)

  return {
    fetchEntities,
    getCountryName,
    getOrganizationName,
    getVoiceTypeName,
  }
}
