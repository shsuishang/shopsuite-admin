import pinia from '@/store'
import { translate } from '@/i18n'
import { useSettingsStore } from '@/store/modules/settings'

/**
 * @description 标题
 * @param pageTitle
 * @returns {string}
 */
export default function getPageTitle(pageTitle: string | undefined) {
  const { getTitle } = useSettingsStore(pinia)
  const newTitles = []
  if (pageTitle) newTitles.push(translate(pageTitle))
  if (getTitle) newTitles.push(getTitle)
  return newTitles.join(' - ')
}
