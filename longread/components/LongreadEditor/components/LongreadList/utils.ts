import type { LongreadListElement, LongreadListElementItem } from 'features/longread/lib/types'
import type { MediumEditorOptions } from 'features/longread/types'
import { newLongreadListItem } from 'features/longread/utils'

/**
 * Изменяем дефолтную настройку редактора для поля заголовка списка
 */
export const getMediumEditorOptionsListTitle = (options: MediumEditorOptions) => ({
  ...options,
  disableReturn: true,
})

/**
 * Изменяем заголовок списка
 */
export const changeTitle = (list: LongreadListElement, title: string): LongreadListElement => ({
  ...list,
  title,
})

/**
 * Добавляем новый пункт в список
 */
export const addNewListItem = (list: LongreadListElement, parentId = list.id): LongreadListElement => ({
  ...list,
  items: list.items.concat([newLongreadListItem(parentId)]),
})

/**
 * Добавляем новый пункт в список после заданного
 */
export const addNewListItemAfter = (
  list: LongreadListElement,
  listItem: LongreadListElementItem
): LongreadListElement => {
  const items = [...list.items]
  const index = items.findIndex(({ id }) => id === listItem.id)
  if (index !== -1) {
    items.splice(index + 1, 0, newLongreadListItem(listItem.parentId))
    return {
      ...list,
      items,
    }
  }
  return list
}

/**
 * Изменяем значение элемента списка
 */
export const changeListItemValue = ({
  list,
  listItem,
  value,
}: {
  list: LongreadListElement
  listItem: LongreadListElementItem
  value: string
}): LongreadListElement => {
  const index = list.items.findIndex(({ id }) => id === listItem.id)

  if (index !== -1) {
    const items = [...list.items]
    items.splice(index, 1, {
      ...listItem,
      value,
    })
    return {
      ...list,
      items,
    }
  }

  return list
}

/**
 * Поднимаем элемент списка на уровень выше
 * list - список
 * listItem - поднимаемый элемент списка
 */
export const upListItem = (list: LongreadListElement, listItem: LongreadListElementItem): LongreadListElement => {
  const items = [...list.items]
  const itemIndex = items.findIndex(({ id }) => id === listItem.id)

  if (itemIndex !== -1) {
    const targetIndex = items.reduce((result, { parentId }, index) => {
      if (parentId === listItem.parentId && index < itemIndex) {
        return index
      }
      return result
    }, -1)

    if (targetIndex !== -1) {
      const temp = items[targetIndex]
      items[targetIndex] = items[itemIndex]
      items[itemIndex] = temp

      return {
        ...list,
        items,
      }
    }
  }

  return list
}

/**
 * Опускаем элемент списка на уровень ниже
 * list - список
 * listItem - опускаемый элемент списка
 */
export const downListItem = (list: LongreadListElement, listItem: LongreadListElementItem): LongreadListElement => {
  const items = [...list.items]
  const itemIndex = items.findIndex(({ id }) => id === listItem.id)

  if (itemIndex !== -1) {
    const targetIndex = items.findIndex(({ parentId }, index) => parentId === listItem.parentId && itemIndex < index)

    if (targetIndex !== -1) {
      const temp = items[targetIndex]
      items[targetIndex] = items[itemIndex]
      items[itemIndex] = temp

      return {
        ...list,
        items,
      }
    }
  }
  return list
}

/**
 * Удаляем элемент из списка
 * list - список
 * listItem - удаляемый элемент списка
 */
export const deleteListItem = (list: LongreadListElement, listItem: LongreadListElementItem): LongreadListElement => {
  const items = list.items.filter(({ parentId }) => parentId !== listItem.id)
  const index = items.findIndex(({ id }) => id === listItem.id)

  if (index !== -1) {
    items.splice(index, 1)
    return {
      ...list,
      items,
    }
  }
  return list
}
