import callApi from 'helpers/callApi';
import buildUrl from 'shared/utils/buildUrl';
import type { LongreadFormValues, LongreadResponse } from '../types';
import { getLongreadImages } from '../utils';

/**
 * Обновление существующей сущности лонгрида по id
 */
const updateLongread = (
  id: number | string,
  {
    title,
    version,
    internalDescription,
    approximateProgressTime,
    reusableContentEnabled,
    isGoogleLinkUpdated,
    longreadElements,
  }: LongreadFormValues,
) => {
  const url = buildUrl(`/backend/admin/api/lesson_resources/longreads/${id}`);
  return callApi<LongreadResponse>(url, {
    method: 'PATCH',
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
    },
  });
};

export default updateLongread;
