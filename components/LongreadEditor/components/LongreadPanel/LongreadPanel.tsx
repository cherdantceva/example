import React, { useMemo } from 'react'
import cx from 'classnames'
import { Input } from 'antd'
import styles from 'features/longread/lib/styles.module.sass'
import type { LongreadPanelElement } from 'features/longread/lib/types'
import { createGetterMediumEditorOptions } from 'features/longread/utils'
import ContentEditable from '../ContentEditable'
import css from './styles.module.sass'

const getMediumEditorOptions = createGetterMediumEditorOptions({
  acceptedButtons: ['bold', 'italic', 'strikethrough', 'anchor', 'superscript'],
})

const CLASS_NAMES = {
  grey: css.grey,
  'green-blue': css.greenBlue,
  'black-frame': css.blackFrame,
  'red-frame': css.redFrame,
}

interface LongreadPanelProps {
  item: LongreadPanelElement
  editable: boolean
  onBlur: () => void
  onFocus: () => void
  onChange: (item: LongreadPanelElement) => void
}

const LongreadPanel: React.FC<LongreadPanelProps> = ({ item, onBlur, onFocus, onChange, editable }) => {
  const className = CLASS_NAMES[item.settings.background]

  const handles = useMemo(
    () => ({
      badgeChange(e: React.ChangeEvent<HTMLInputElement>) {
        onChange({
          ...item,
          badge: e.target.value,
        })
      },
      titleChange(e: React.ChangeEvent<HTMLInputElement>) {
        onChange({
          ...item,
          title: e.target.value,
        })
      },
      contentChange(content: string) {
        onChange({
          ...item,
          content,
        })
      },
      captionChange(e: React.ChangeEvent<HTMLInputElement>) {
        onChange({
          ...item,
          caption: e.target.value,
        })
      },
    }),
    [item, onChange]
  )

  return (
    <div className={cx(css.root, className)}>
      {editable || item.badge ? (
        <div className={cx(css.badge, editable && css.editable)}>
          {editable ? (
            <Input
              className={css.badgeInput}
              value={item.badge}
              onChange={handles.badgeChange}
              maxLength={64}
              placeholder='Введите текст бейджика'
            />
          ) : (
            item.badge
          )}
        </div>
      ) : null}
      {editable ? (
        <Input
          className={css.titleInput}
          value={item.title}
          onChange={handles.titleChange}
          maxLength={250}
          placeholder='Введите текст заголовка'
        />
      ) : (
        item.title && <div className={css.title}>{item.title}</div>
      )}
      <ContentEditable
        className={cx(css.content, editable && css.editable)}
        contentClassName={styles.common}
        editable={editable}
        value={item.content}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={handles.contentChange}
        getMediumEditorOptions={getMediumEditorOptions}
      />
      {editable ? (
        <Input
          className={css.captionInput}
          value={item.caption}
          onChange={handles.captionChange}
          maxLength={250}
          placeholder='Введите подпись'
        />
      ) : (
        item.caption && <div className={css.caption}>{item.caption}</div>
      )}
    </div>
  )
}

export default React.memo(LongreadPanel)
