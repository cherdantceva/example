import buildUrl from 'shared/utils/buildUrl'
import callApi from 'helpers/callApi'
import type { LongreadFormValues, LongreadResponse } from '../types'

/**
 * Чтение существующего лонгрида по id
 */
const fetchLongread = async (id: number | string): Promise<LongreadFormValues> => {
  const url = buildUrl(`/backend/admin/api/lesson_resources/longreads/${id}`)

  const {
    longread: {
      title,
      description: internalDescription,
      approximate_progress_time: approximateProgressTime,
      reusable: reusableContentEnabled,
      is_google_link_updated: isGoogleLinkUpdated,
      content,
    },
  } = await callApi<LongreadResponse>(url)

  return {
    title,
    version: content.version,
    internalDescription,
    approximateProgressTime,
    reusableContentEnabled,
    isGoogleLinkUpdated,
    longreadElements: content.elements,
  }
}

export default fetchLongread
