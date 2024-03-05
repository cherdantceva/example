/* eslint-env jest */
import { LongreadElementType, LongreadListElement } from 'features/longread/lib/types'
import { newLongreadElement } from 'features/longread/utils'
import {
  addNewListItem,
  addNewListItemAfter,
  changeListItemValue,
  changeTitle,
  deleteListItem,
  downListItem,
  upListItem,
} from './utils'

describe('feature longread: longread list utils', () => {
  describe('Измение заголовка', () => {
    it('Текст', () => {
      const list = newLongreadElement(LongreadElementType.list) as LongreadListElement
      const result = changeTitle(list, 'Новый заголовок')
      expect(result.title).toBe('Новый заголовок')
    })
    it('Вёрстка', () => {
      const list = newLongreadElement(LongreadElementType.list) as LongreadListElement
      const result = changeTitle(list, '<h1>Новый заголовок</h1>')
      expect(result.title).toBe('<h1>Новый заголовок</h1>')
    })
  })

  describe('Добавляем новый пункт в конец списка', () => {
    it('Первый уровень', () => {
      const list = newLongreadElement(LongreadElementType.list) as LongreadListElement
      const result = addNewListItem(list)
      expect(result.items.length).toBe(2)
      expect(result.items[1].parentId).toBe(list.id)
    })
    it('Второй уровень', () => {
      const element = newLongreadElement(LongreadElementType.list) as LongreadListElement
      const result = addNewListItem(element, element.items[0].id)
      expect(result.items.length).toBe(2)
      expect(result.items[1].parentId).toBe(result.items[0].id)
    })
  })

  describe('Добавляем новый пункт в список после элемента', () => {
    it('Один после первого', () => {
      const list = newLongreadElement(LongreadElementType.list) as LongreadListElement
      const result = addNewListItemAfter(list, list.items[0])
      expect(result.items.length).toBe(2)
      expect(result.items[1].parentId).toBe(list.id)
    })
    it('Два после первого', () => {
      const list = newLongreadElement(LongreadElementType.list) as LongreadListElement
      const newList = addNewListItemAfter(list, list.items[0])
      const result = addNewListItemAfter(newList, list.items[0])
      expect(result.items.length).toBe(3)
      expect(result.items[1].parentId).toBe(result.id)
      expect(result.items[2].parentId).toBe(result.id)
    })
  })

  it('Изменяем значение элемента списка', () => {
    let list = newLongreadElement(LongreadElementType.list) as LongreadListElement

    list = addNewListItem(list)
    list = addNewListItem(list)

    const result = changeListItemValue({
      list,
      listItem: list.items[0],
      value: '123',
    })

    expect(result.items[0].value).toBe('123')
  })

  describe('Поднимаем элемент списка на уровень выше', () => {
    it('Второй на место первого', () => {
      let list = newLongreadElement(LongreadElementType.list) as LongreadListElement

      list = addNewListItem(list)
      list = addNewListItem(list)

      const result = upListItem(list, list.items[1])

      expect(result.items.length).toBe(3)
      expect(result.items[0]).toBe(list.items[1])
      expect(result.items[1]).toBe(list.items[0])
    })
    it('Третий на место второго', () => {
      let list = newLongreadElement(LongreadElementType.list) as LongreadListElement

      list = addNewListItem(list)
      list = addNewListItem(list)

      const result = upListItem(list, list.items[2])

      expect(result.items.length).toBe(3)
      expect(result.items[1]).toBe(list.items[2])
      expect(result.items[2]).toBe(list.items[1])
    })
    it('Первый на место первого - список не меняется', () => {
      let list = newLongreadElement(LongreadElementType.list) as LongreadListElement

      list = addNewListItem(list)
      list = addNewListItem(list)

      const result = upListItem(list, list.items[0])

      expect(result.items.length).toBe(3)
      expect(result).toBe(list)
    })
  })

  describe('Опускаем элемент списка на уровень ниже', () => {
    it('Первый на место второго', () => {
      let list = newLongreadElement(LongreadElementType.list) as LongreadListElement

      list = addNewListItem(list)
      list = addNewListItem(list)

      const result = downListItem(list, list.items[0])

      expect(result.items.length).toBe(3)
      expect(result.items[1]).toBe(list.items[0])
      expect(result.items[0]).toBe(list.items[1])
    })
    it('Второй на место третьего', () => {
      let list = newLongreadElement(LongreadElementType.list) as LongreadListElement

      list = addNewListItem(list)
      list = addNewListItem(list)

      const result = downListItem(list, list.items[1])

      expect(result.items.length).toBe(3)
      expect(result.items[2]).toBe(list.items[1])
      expect(result.items[1]).toBe(list.items[2])
    })
    it('Третий на место третьего - список не меняется', () => {
      let list = newLongreadElement(LongreadElementType.list) as LongreadListElement

      list = addNewListItem(list)
      list = addNewListItem(list)

      const result = downListItem(list, list.items[2])

      expect(result.items.length).toBe(3)
      expect(result).toBe(list)
    })
  })

  describe('Удаляем элемент из списка', () => {
    it('Удаляем первый из трёх', () => {
      let list = newLongreadElement(LongreadElementType.list) as LongreadListElement

      list = addNewListItem(list)
      list = addNewListItem(list)

      const result = deleteListItem(list, list.items[0])

      expect(result.items.length).toBe(2)
      expect(result.items[0]).toBe(list.items[1])
      expect(result.items[1]).toBe(list.items[2])
    })
    it('Удаляем второй из трёх', () => {
      let list = newLongreadElement(LongreadElementType.list) as LongreadListElement

      list = addNewListItem(list)
      list = addNewListItem(list)

      const result = deleteListItem(list, list.items[1])

      expect(result.items.length).toBe(2)
      expect(result.items[0]).toBe(list.items[0])
      expect(result.items[1]).toBe(list.items[2])
    })
    it('Удаляем третий из трёх', () => {
      let list = newLongreadElement(LongreadElementType.list) as LongreadListElement

      list = addNewListItem(list)
      list = addNewListItem(list)

      const result = deleteListItem(list, list.items[2])

      expect(result.items.length).toBe(2)
      expect(result.items[0]).toBe(list.items[0])
      expect(result.items[1]).toBe(list.items[1])
    })
    it('Удаляем второй из трёх с его двумя подпунктами', () => {
      // 1
      let list = newLongreadElement(LongreadElementType.list) as LongreadListElement

      // 2
      list = addNewListItem(list)

      // 2.1
      list = addNewListItem(list, list.items[1].id)

      // 2.2
      list = addNewListItem(list, list.items[1].id)

      // 3
      list = addNewListItem(list)

      const result = deleteListItem(list, list.items[1])

      expect(result.items.length).toBe(2)
      expect(result.items[0]).toBe(list.items[0])
      expect(result.items[1]).toBe(list.items[4])
    })
  })
})
