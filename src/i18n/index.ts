import pinia from '@/store'
import { useSettingsStore } from '@/store/modules/settings'
import { createI18n } from 'vue-i18n'
import { LanguageType } from '/#/store'
// import ar from './locales/ar.json'
// import az from './locales/az.json'
// import da from './locales/da.json'
// import de from './locales/de.json'
// import el from './locales/el.json'
import es from './locales/es.json'
import en from './locales/en.json'
// import fi from './locales/fi.json'
// import fr from './locales/fr.json'
// import id from './locales/id.json'
// import it from './locales/it.json'
import ja from './locales/ja.json'
// import kk from './locales/kk.json'
// import ko from './locales/ko.json'
// import lv from './locales/lv.json'
// import ms from './locales/ms.json'
// import my from './locales/my.json'
// import nl from './locales/nl.json'
// import pl from './locales/pl.json'
// import pt from './locales/pt.json'
// import ro from './locales/ro.json'
import ru from './locales/ru.json'
// import sr from './locales/sr.json'
import th from './locales/th.json'
// import tr from './locales/tr.json'
// import uk from './locales/uk.json'
// import vi from './locales/vi.json'
import zh from './locales/zh.json'

import enLocale from 'element-plus/dist/locale/en'
import zhLocale from 'element-plus/dist/locale/zh-cn'

export { enLocale, zhLocale }

/*
  ar: {...ar},
  az: {...az},
  da: {...da},
  de: {...de},
  el: {...el},
  es: {...es},
  en: {...en},
  fi: {...fi},
  fr: {...fr},
  id: {...id},
  it: {...it},
  ja: {...ja},
  kk: {...kk},
  ko: {...ko},
  lv: {...lv},
  ms: {...ms},
  my: {...my},
  nl: {...nl},
  pl: {...pl},
  pt: {...pt},
  ro: {...ro},
  ru: {...ru},
  sr: {...sr},
  th: {...th},
  tr: {...tr},
  uk: {...uk},
  vi: {...vi},
  zh: {},
*/
const messages: Record<LanguageType, any> = {
  en: {...en},
  ru: {...ru},
  es: {...es},
  th: {...th},
  ja: {...ja},
  zh: {...zh},
}

function getLanguage() {
  const { getLanguage } = useSettingsStore(pinia)
  return getLanguage
}

export const i18n = createI18n({
  legacy: false,
  locale: getLanguage(),
  fallbackLocale: 'zh',
  messages,
})

export function setupI18n(app: any) {
  app.use(i18n)
  return i18n
}

export function translate(message: string | undefined) {
  if (!message) {
    return ''
  }
  return (
    [getLanguage(), 'msI18n', message].reduce(
      (o, k) => (o || {})[k],
      messages as any
    ) || message
  )
}
