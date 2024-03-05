import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { LongreadElementType } from 'features/longread/lib/types'

export interface MenuItem<Options = Record<string, unknown>> {
  type: LongreadElementType | null
  text: string
  icon?: React.ReactNode
  options?: Options
}

export const MENU_ITEMS: MenuItem[] = [
  {
    type: LongreadElementType.text,
    text: 'Текст',
  },
  {
    type: LongreadElementType.image,
    text: 'Изображение',
  },
  {
    type: null,
    text: 'Выбрать блок',
    icon: <PlusOutlined />,
  },
]

export const BLOCK_MENU_ITEMS: MenuItem[] = [
  {
    text: 'Список маркированный',
    type: LongreadElementType.list,
    options: {
      ordered: false,
    },
  },
  {
    text: 'Список упорядоченный',
    type: LongreadElementType.list,
    options: {
      ordered: true,
    },
  },
  {
    text: 'Панель с текстом',
    type: LongreadElementType.panel,
  },
  {
    text: 'Видео',
    type: LongreadElementType.video,
  },
  // Временно скрываем
  // {
  //   text: 'Блок с кодом',
  //   type: LongreadElementType.code,
  // },
]
