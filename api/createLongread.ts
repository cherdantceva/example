import buildUrl from 'shared/utils/buildUrl'
import callApi from 'helpers/callApi'
import type { LongreadFormValues, LongreadResponse } from '../types'
import { getLongreadImages } from '../utils'

/**
 * Создание новой сущности лонгрида
 */
const createLongread = (
  lessonId: number | string | null,
  {
    title,
    version,
    internalDescription,
    approximateProgressTime,
    reusableContentEnabled,
    isGoogleLinkUpdated,
    longreadElements,
  }: LongreadFormValues
) => {
  const url = buildUrl('/backend/admin/api/lesson_resources/longreads')
  return callApi<LongreadResponse>(url, {
    method: 'POST',
    data: {
      longread: {
        title,
        description: internalDescription,
        approximate_progress_time: approximateProgressTime,
        reusable: reusableContentEnabled,
        is_google_link_updated: isGoogleLinkUpdated,
        content: {
          version,
          elements: longreadElements,
        },
        image_ids: getLongreadImages(longreadElements),
      },
      lesson_id: lessonId,
    },
  })
}

export default createLongread
