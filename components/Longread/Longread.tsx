import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import cx from 'classnames'
import { EyeOutlined } from '@ant-design/icons'
import { Button, Checkbox, Input, message } from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import isMobile from 'ismobilejs'
import { throwError } from 'store/error/actions'
import useBeforeUnload from 'shared/hooks/useBeforeUnload'
import type { LongreadStore } from 'features/longread'
import Breadcrumbs from 'components/shared/Breadcrumbs'
import Loading from 'components/shared/Loading'
import { CallApiError } from 'helpers/callApi'
import { BACKEND_ADMIN_PREFIX, ROUTE_PREFIX } from 'helpers/settings'
import type RootState from 'domains/Store'
import * as api from '../../api'
import {
  approximateProgressTimeChange,
  internalDescriptionChange,
  isGoogleLinkUpdatedChange,
  reusableContentChange,
  storeLongreadForm,
  titleChange,
  undoChangeLongreadForm,
  validateLongreadForm,
} from '../../ducks'
import type { LongreadResponse } from '../../types'
import LongreadEditor from '../LongreadEditor'
import type { Notification } from './components/NotificationDialog'
import NotificationDialog from './components/NotificationDialog'
import css from './styles.module.sass'
import { createErrorNotificationFromCallApiError, isNewLongread } from './utils'

const Longread: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const lessonId = searchParams.get('lesson_id')

  const history = useHistory()
  const dispatch = useDispatch()

  const { longreadForm, longreadFormErrors, loadedLongreadForm } = useSelector<RootState, LongreadStore>(
    (state) => state.longread
  )

  const [loadingData, setLoadingData] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [notification, setNotification] = useState<Notification | null>(null)
  const [editable, setEditable] = useState(true)
  const [savedIsGoogleLinkUpdated, setSavedIsGoogleLinkUpdated] = useState(false)

  const mobile = isMobile(window.navigator).any

  const [messageApi, contextHolder] = message.useMessage()

  const breadcrumbsItems = useMemo(
    () => [
      { title: 'Контент занятий', link: '' },
      { title: 'Лонгрид', link: '/backend/admin/lesson_resources/longreads' },
      { title: isNewLongread(id) ? 'Новый контент типа лонгрид' : longreadForm.title, link: '' },
    ],
    [id, longreadForm.title]
  )

  const isChangedLongreadForm = useMemo(
    () => JSON.stringify(longreadForm) !== JSON.stringify(loadedLongreadForm),
    [longreadForm, loadedLongreadForm]
  )

  useBeforeUnload(!saved && isChangedLongreadForm)

  const formHandlers = useMemo(
    () => ({
      handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        dispatch(titleChange(e.target.value))
      },
      handleInternalDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        dispatch(internalDescriptionChange(e.target.value))
      },
      handleApproximateProgressTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
        dispatch(approximateProgressTimeChange(parseInt(e.target.value, 10)))
      },
      handleReusableContentChange(e: CheckboxChangeEvent) {
        dispatch(reusableContentChange(e.target.checked))
      },
      handleIsGoogleLinkUpdatedChange(e: CheckboxChangeEvent) {
        dispatch(isGoogleLinkUpdatedChange(e.target.checked))
      },
    }),
    [dispatch]
  )

  const handleCancelClick = useCallback(() => {
    dispatch(undoChangeLongreadForm())
  }, [dispatch])

  const handleSubmitClick = useCallback(async () => {
    if (longreadFormErrors.isError) {
      dispatch(validateLongreadForm())
    } else {
      setSaving(true)
      try {
        let response: LongreadResponse
        if (isNewLongread(id)) {
          response = await api.createLongread(lessonId, longreadForm)
        } else {
          response = await api.updateLongread(id, longreadForm)
        }
        if (response?.errors) {
          // Ошибка
          dispatch(throwError(response?.errors))
          return
        }

        setSavedIsGoogleLinkUpdated(longreadForm.isGoogleLinkUpdated)

        if (isNewLongread(id)) {
          // Создали новый лонгрид
          setSaved(true)
          setNotification({
            status: 'success',
            title: `Лонгрид "${longreadForm.title}" успешно создан`,
            messages: null,
            button: {
              title: 'Продолжить',
              onClick: () => {
                setNotification(null)
                if (lessonId) {
                  window.location.href = `${BACKEND_ADMIN_PREFIX}/lessons/${lessonId}/lesson_items`
                } else {
                  history.push(`${ROUTE_PREFIX}/longreads/${response.longread.id}`)
                }
              },
            },
          })
        } else {
          // Обновили существующий лонгрид
          dispatch(storeLongreadForm(longreadForm))
          messageApi.open({
            type: 'success',
            content: `Лонгрид "${longreadForm.title}" успешно обновлён`,
          })
        }
      } catch (error) {
        if (error instanceof CallApiError && error.status === 422) {
          const currentNotification = createErrorNotificationFromCallApiError(error, id)
          setNotification(currentNotification)
        } else {
          dispatch(throwError(error))
        }
      }
      setSaving(false)
    }
  }, [id, lessonId, longreadForm, dispatch, history, longreadFormErrors, messageApi])

  const closeNotificationDialog = useCallback(() => {
    setNotification(null)
  }, [])

  const handlePreviewClick = useCallback(() => {
    setEditable((value) => !value)
  }, [])

  useEffect(() => {
    const fetchLongreadItem = async () => {
      setLoadingData(true)
      try {
        const longreadFormValues = await api.fetchLongread(id)
        dispatch(storeLongreadForm(longreadFormValues))
        setSavedIsGoogleLinkUpdated(longreadFormValues.isGoogleLinkUpdated)
      } catch (e) {
        dispatch(throwError(e))
      }
      setLoadingData(false)
    }
    if (!isNewLongread(id) && !loadedLongreadForm) {
      fetchLongreadItem()
    }
  }, [id, loadedLongreadForm, dispatch])

  if (loadingData) {
    return <Loading />
  }

  return (
    <div className={css.root}>
      <Breadcrumbs items={breadcrumbsItems} />
      {contextHolder}
      <NotificationDialog
        notification={notification}
        onOk={closeNotificationDialog}
        onCancel={closeNotificationDialog}
      />
      <div className={css.form}>
        <div className={css.title} data-testid='lms-lesson-resources-longread-header'>
          {isNewLongread(id) ? 'Новый лонгрид' : 'Редактирование лонгрида'}
        </div>

        <div className={css.field}>
          <div className={css.label}>Заголовок</div>
          <Input
            className={cx(longreadFormErrors.title && css.inputError)}
            value={longreadForm.title}
            onChange={formHandlers.handleTitleChange}
            disabled={saving}
            maxLength={250}
            data-testid='lms-lesson-resources-longread-title'
          />
        </div>

        <div className={css.field}>
          <div className={css.label}>Внутреннее описание (студент его не увидит)</div>
          <div className={css.optionalText}>Необязательное поле</div>
          <Input.TextArea
            value={longreadForm.internalDescription}
            autoSize
            onChange={formHandlers.handleInternalDescriptionChange}
            disabled={saving}
            maxLength={255}
            data-testid='lms-lesson-resources-longread-internal-description'
          />
        </div>

        <div className={cx(css.field, css.timeField)}>
          <div className={css.label}>Примерное время прохождения (мин.)</div>
          <Input
            className={cx(longreadFormErrors.approximateProgressTime && css.inputError)}
            value={longreadForm.approximateProgressTime || ''}
            onChange={formHandlers.handleApproximateProgressTimeChange}
            disabled={saving}
            maxLength={4}
            data-testid='lms-lesson-resources-longread-approximate-progress-time'
          />
        </div>

        <div className={css.field}>
          <Checkbox onChange={formHandlers.handleReusableContentChange} checked={longreadForm.reusableContentEnabled}>
            Универсальный контент
          </Checkbox>
        </div>

        <div className={css.field}>
          <Checkbox
            onChange={formHandlers.handleIsGoogleLinkUpdatedChange}
            checked={longreadForm.isGoogleLinkUpdated}
            disabled={savedIsGoogleLinkUpdated}
          >
            Обновлена ссылка на гугл
          </Checkbox>
        </div>

        <div className={cx(css.field, css.longreadField)}>
          <div className={css.label}>Конструктор лонгрида</div>
          <LongreadEditor longreadElements={longreadForm.longreadElements} editable={editable} />
        </div>

        <div className={css.footer}>
          <div className={css.buttons}>
            <Button
              type='primary'
              className={css.btn}
              onClick={handleSubmitClick}
              loading={saving}
              data-testid='lms-lesson-resources-longread-submit'
            >
              Сохранить
            </Button>
            <Button
              className={css.btn}
              type={editable ? 'default' : 'primary'}
              icon={<EyeOutlined />}
              onClick={handlePreviewClick}
              data-testid='lms-lesson-resources-longread-preview'
            >
              {mobile ? 'Превью' : 'Превью лонгрида'}
            </Button>
            <Button
              type='default'
              className={css.btn}
              onClick={handleCancelClick}
              disabled={saving}
              data-testid='lms-lesson-resources-longread-cancel'
            >
              {mobile ? 'Отменить' : 'Отменить изменения'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Longread
