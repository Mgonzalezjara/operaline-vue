import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const layout = ref<any | null>(null)

export function useLayout() {
  const { locale } = useI18n()

  const fetchLayout = async () => {
    const res = await fetch(`http://localhost:1337/api/layout?populate=*&locale=${locale.value}`)
    const data = await res.json()
    layout.value = data.data
  }

  onMounted(fetchLayout)
  watch(locale, fetchLayout)

  return {
    layout,
  }
}
