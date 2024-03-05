import React, { useCallback, useEffect, useState } from 'react'
import cx from 'classnames'
import KinescopePlayer from '@kinescope/react-kinescope-player'
import { AutoComplete, Button, Typography } from 'antd'
import useAutoComplete from 'features/autoComplete/hooks/useAutoComplete'
import styles from 'features/longread/lib/styles.module.sass'
import type { LongreadVideoElement } from 'features/longread/lib/types'
import { createGetterMediumEditorOptions } from 'features/longread/utils'
import { AutoCompleteKeys, IAutoCompleteVideoLessonItem } from 'types/api/autoComplete'
import ContentEditable from '../ContentEditable'
import css from './styles.module.sass'

const { Text } = Typography

const getMediumEditorOptions = createGetterMediumEditorOptions({
  acceptedButtons: ['bold', 'italic', 'strikethrough', 'anchor', 'superscript'],
})

interface LongreadVideoProps {
  item: LongreadVideoElement
  editable: boolean
  onChange: (item: LongreadVideoElement) => void
  onBlur: () => void
  onFocus: () => void
}

const LongreadVideo: React.FC<LongreadVideoProps> = ({ item, onBlur, onFocus, editable, onChange }) => {
  const { inputValue, options } = useAutoComplete({
    apiProps: {
      apiKey: AutoCompleteKeys.videoLessonItemName,
    },
    searchMin: 2,
    type: 'LMS::LessonResources::Video',
  })

  const [videoLessonItem, setVideoLessonItem] = useState<IAutoCompleteVideoLessonItem | null>(null)
  const [savedVideoUrl, setSavedVideoUrl] = useState('')
  const [savedVideoTitle, setSavedVideoTitle] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [autoCompleteValue, setAutoCompleteValue] = useState(item?.lessonResource?.title.trim() || '')
  const [videoId, setVideoId] = useState('')
  const [isError, setIsError] = useState(false)

  const videoChange = useCallback(
    (title, id, url, lessonId) => {
      onChange({
        ...item,
        lessonResource: {
          title,
          videoId: id,
          url,
          id: lessonId,
        },
      })
    },
    [item, onChange]
  )

  const handleDescriptionChange = useCallback(
    (value) => {
      onChange({
        ...item,
        description: value,
      })
    },
    [item, onChange]
  )

  const handleCancelButtonClick = useCallback(() => {
    setVideoLessonItem(null)
    setSavedVideoTitle('')
    setSavedVideoUrl('')
    setAutoCompleteValue('')
    setVideoId('')
    onChange({
      ...item,
      lessonResource: {
        title: '',
        url: '',
        videoId: '',
        id: undefined,
      },
    })
  }, [item, onChange])

  const handleApplyButtonClick = useCallback(() => {
    setSavedVideoTitle(videoLessonItem?.meta.title || '')
    setSavedVideoUrl(videoLessonItem?.meta.videoUrl || '')
    videoChange(videoLessonItem?.meta.title, videoId, videoLessonItem?.meta.videoUrl, videoLessonItem?.id)
  }, [videoChange, videoId, videoLessonItem?.id, videoLessonItem?.meta.title, videoLessonItem?.meta.videoUrl])

  useEffect(() => {
    if (videoLessonItem?.meta?.videoUrl) {
      const videoUrlSplit = videoLessonItem?.meta?.videoUrl.split('/')
      setVideoId(videoUrlSplit[videoUrlSplit.length - 1])
    }
  }, [savedVideoUrl, videoId, videoLessonItem?.meta?.videoUrl])

  useEffect(() => {
    inputValue.set(searchValue)
  }, [inputValue, searchValue])

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value.trim())
  }, [])

  const handleChange = useCallback((value: string) => {
    setAutoCompleteValue(value.trim())
  }, [])

  return (
    <div className={css.root}>
      {editable && (
        <>
          <div className={css.description}>
            Найдите гранулу c нужным видео. Видео в грануле должно быть загружено в Kinescope
          </div>
          <div className={css.top}>
            <AutoComplete
              style={{ width: 200 }}
              placeholder='Выберите гранулу с видео'
              options={options.get}
              value={autoCompleteValue}
              onChange={handleChange}
              onSearch={handleSearch}
              onSelect={(value, option) => setVideoLessonItem(option as IAutoCompleteVideoLessonItem)}
            />
            <Button type='primary' className={css.button} onClick={handleApplyButtonClick} disabled={!videoLessonItem}>
              Применить
            </Button>
            <Button
              type='default'
              className={css.button}
              onClick={handleCancelButtonClick}
              disabled={!item?.lessonResource?.videoId && !savedVideoUrl}
            >
              Сбросить выбор
            </Button>
          </div>
        </>
      )}

      {(item?.lessonResource?.videoId || savedVideoUrl) && (
        <>
          {!isError && (
            <div className={css.body}>
              <KinescopePlayer
                videoId={item?.lessonResource?.videoId || videoId}
                width='940px'
                height='541px'
                title={savedVideoTitle || item?.lessonResource?.title}
                onError={() => setIsError(true)}
              />
              {editable || item.description ? (
                <ContentEditable
                  className={css.title}
                  contentClassName={cx(css.content, styles.common)}
                  editable={editable}
                  value={item.description}
                  placeholder='Введите подпись к видео'
                  onBlur={onBlur}
                  onFocus={onFocus}
                  onChange={handleDescriptionChange}
                  getMediumEditorOptions={getMediumEditorOptions}
                />
              ) : null}
            </div>
          )}
          {isError && <Text type='danger'>Не удалось подгрузить видео. Проверьте, что выбрали верную гранулу</Text>}
        </>
      )}
    </div>
  )
}

export default React.memo(LongreadVideo)
