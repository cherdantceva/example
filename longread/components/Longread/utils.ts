import isObject from 'shared/utils/isObject'
import type { CallApiError } from 'helpers/callApi'
import type { Notification } from './components/NotificationDialog'

interface ErrorData {
  errors?: [
    {
      rails_details: string | string[] | Record<string, string[]>
    }
  ]
  error?: number
  stdtst?: string[]
}

/**
 * Определяем, что создаём новый тренажёр
 * @param id
 * @returns
 */
export const isNewLongread = (id: number | string) => id === 'new'

/**
 * Создаём сообщение об ошибке по ошибке с сервера
 */
export const createErrorNotificationFromCallApiError = (
  error: CallApiError<ErrorData>,
  id: number | string
): Notification => {
  const railsDetails = error.data?.errors?.[0].rails_details
  const messages = []
  let output = ''

  if (Array.isArray(railsDetails)) {
    messages.push(...railsDetails)
  } else if (isObject(railsDetails)) {
    messages.push(...Object.values(railsDetails))
  } else if (railsDetails) {
    messages.push(railsDetails)
  }

  if (error.data?.stdtst) {
    output = error.data.stdtst.join('\n')
  }

  return {
    status: 'error',
    title: isNewLongread(id) ? 'Ошибка создания нового лонгрида' : 'Ошибка сохранения лонгрида',
    output,
    messages: messages.flat().filter(Boolean),
    button: {
      title: 'Закрыть',
    },
  }
}
