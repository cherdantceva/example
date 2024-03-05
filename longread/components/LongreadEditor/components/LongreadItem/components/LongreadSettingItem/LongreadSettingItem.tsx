import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Drawer, Input, Radio, Space } from 'antd'
import type { RadioChangeEvent } from 'antd'
import type { LongreadElement } from 'features/longread/lib/types'
import {
  isCodeLongreadElement,
  isImageLongreadElement,
  isListLongreadElement,
  isPanelLongreadElement,
} from 'features/longread/lib/utils'
import css from './styles.module.sass'

interface Settings {
  indent: number
  anchor: string
  [key: string]: unknown
}

interface LongreadSettingItemProps {
  open: boolean
  item: LongreadElement
  onSettingSave: (settings?: Settings) => void
  onCloseDrawer: () => void
}

const LongreadSettingItem: React.FC<LongreadSettingItemProps> = ({ open, item, onCloseDrawer, onSettingSave }) => {
  const [indent, setIndent] = useState(item.settings.indent)
  const [anchor, setAnchor] = useState(item.settings.anchor)

  const [listOrdered, setListOrdered] = useState(!!item.settings.ordered)

  const [imageWidth, setImageWidth] = useState(item.settings.width)
  const [imageCount, setImageCount] = useState(() => (isImageLongreadElement(item) ? item.images.length : 0))
  const [imageBorder, setImageBorder] = useState(!!item.settings.border)

  const [panelIcon, setPanelIcon] = useState(item.settings.icon)
  const [panelBackground, setPanelBackground] = useState(item.settings.background)

  const [codeName, setCodeName] = useState(item.settings.name)

  const handles = useMemo(
    () => ({
      offsetChange(e: RadioChangeEvent) {
        setIndent(e.target.value)
      },
      anchorChange(e: React.ChangeEvent<HTMLInputElement>) {
        setAnchor(e.target.value)
      },
      listOrderedChange(e: RadioChangeEvent) {
        setListOrdered(e.target.value)
      },
      imageCountChange(e: RadioChangeEvent) {
        setImageCount(e.target.value)
      },
      imageWidthChange(e: RadioChangeEvent) {
        setImageWidth(e.target.value)
      },
      imageBorderChange(e: RadioChangeEvent) {
        setImageBorder(e.target.value)
      },
      panelIconChange(e: RadioChangeEvent) {
        setPanelIcon(e.target.value)
      },
      panelBackgroundChange(e: RadioChangeEvent) {
        setPanelBackground(e.target.value)
      },
      codeNameChange(e: RadioChangeEvent) {
        setCodeName(e.target.value)
      },
    }),
    []
  )

  const handleSettingSave = useCallback(() => {
    onSettingSave({
      indent,
      anchor,
      listOrdered,
      imageCount,
      imageWidth,
      imageBorder,
      panelIcon,
      panelBackground,
      codeName,
    })
  }, [
    indent,
    anchor,
    listOrdered,
    imageCount,
    imageWidth,
    imageBorder,
    panelIcon,
    panelBackground,
    codeName,
    onSettingSave,
  ])

  useEffect(() => {
    if (!open) {
      setIndent(item.settings.indent)
      setAnchor(item.settings.anchor)
      setListOrdered(!!item.settings.ordered)
    }
  }, [open, item])

  return (
    <div className={css.root}>
      <Drawer
        title='Настройки блока'
        placement='right'
        width={680}
        closable={false}
        onClose={onCloseDrawer}
        open={open}
        maskClosable
        footer={
          <>
            <Button className={css.button} type='primary' onClick={handleSettingSave}>
              Сохранить
            </Button>
            <Button className={css.button} onClick={onCloseDrawer}>
              Отменить и закрыть
            </Button>
          </>
        }
        footerStyle={{ padding: '20px 24px 19px 24px' }}
      >
        <div className={css.field}>
          <div className={css.label}>Отступ после блока</div>
          <Radio.Group onChange={handles.offsetChange} value={indent}>
            {[
              {
                label: '16 px',
                value: 16,
              },
              {
                label: '32 px',
                value: 32,
              },
              {
                label: '56 px',
                value: 56,
              },
            ].map(({ value, label }) => (
              <Radio key={label} value={value}>
                {label}
              </Radio>
            ))}
          </Radio.Group>
        </div>
        {isListLongreadElement(item) && (
          <div className={css.field}>
            <div className={css.label}>Тип списка</div>
            <Radio.Group onChange={handles.listOrderedChange} value={listOrdered}>
              {[
                {
                  label: 'Маркированный',
                  value: false,
                },
                {
                  label: 'Нумерованный',
                  value: true,
                },
              ].map(({ value, label }) => (
                <Radio key={label} value={value}>
                  {label}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        )}
        {isImageLongreadElement(item) && (
          <>
            <div className={css.field}>
              <div className={css.label}>Изображений в ряду</div>
              <Radio.Group onChange={handles.imageCountChange} value={imageCount}>
                {[1, 2, 3].map((value) => (
                  <Radio key={value} value={value}>
                    {value}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
            <div className={css.field}>
              <div className={css.label}>Ширина блока от ширины контента</div>
              <Radio.Group onChange={handles.imageWidthChange} value={imageWidth}>
                {[100, 70, 50, 30].map((value) => (
                  <Radio key={value} value={value}>
                    {value}%
                  </Radio>
                ))}
              </Radio.Group>
            </div>
            <div className={css.field}>
              <div className={css.label}>Рамка для изображения</div>
              <Radio.Group onChange={handles.imageBorderChange} value={imageBorder}>
                {[
                  {
                    label: 'Нет',
                    value: false,
                  },
                  {
                    label: 'Есть',
                    value: true,
                  },
                ].map(({ label, value }) => (
                  <Radio key={label} value={value}>
                    {label}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          </>
        )}
        {isPanelLongreadElement(item) && (
          <>
            <div className={css.field}>
              <div className={css.label}>Оформление</div>
              <Radio.Group onChange={handles.panelBackgroundChange} value={panelBackground}>
                <Space direction='vertical'>
                  {[
                    {
                      label: 'Серый фон',
                      value: 'grey',
                    },
                    {
                      label: 'Зелено-голубой фон',
                      value: 'green-blue',
                    },
                    {
                      label: 'Черная рамка',
                      value: 'black-frame',
                    },
                    {
                      label: 'Красная рамка',
                      value: 'red-frame',
                    },
                  ].map(({ value, label }) => (
                    <Radio key={value} value={value}>
                      {label}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
            <div className={css.field}>
              <div className={css.label}>Иконка слева</div>
              <Radio.Group onChange={handles.panelIconChange} value={panelIcon}>
                {[
                  {
                    label: 'Нет',
                    value: false,
                  },
                  {
                    label: 'Есть',
                    value: true,
                  },
                ].map(({ label, value }) => (
                  <Radio key={label} value={value}>
                    {label}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          </>
        )}
        {isCodeLongreadElement(item) && (
          <>
            <div className={css.field}>
              <div className={css.label}>Язык программирования</div>
              <Radio.Group onChange={handles.codeNameChange} value={codeName}>
                {[
                  {
                    label: 'Java',
                    value: 'Java',
                  },
                  {
                    label: 'PHP',
                    value: 'php',
                  },
                ].map(({ label, value }) => (
                  <Radio key={label} value={value}>
                    {label}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          </>
        )}
        <div className={css.field}>
          <div className={css.label}>Якорь</div>
          <Input style={{ width: '320px' }} value={anchor} onChange={handles.anchorChange} maxLength={64} />
        </div>
      </Drawer>
    </div>
  )
}

export default LongreadSettingItem
