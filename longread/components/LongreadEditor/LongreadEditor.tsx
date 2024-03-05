import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import cx from 'classnames'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { addNewLongreadElement, addNewLongreadElementAfter } from 'features/longread/ducks'
import { LongreadElement } from 'features/longread/lib/types'
import { isEmptyLongreadElement } from 'features/longread/lib/utils'
import LongreadBlockMenu from './components/LongreadBlockMenu'
import LongreadItem from './components/LongreadItem'
import LongreadMenu from './components/LongreadMenu'
import { BLOCK_MENU_ITEMS, MENU_ITEMS, MenuItem } from './menu'
import css from './styles.module.sass'

interface LongreadEditorProps {
  editable: boolean
  longreadElements: LongreadElement[]
}

const LongreadEditor: React.FC<LongreadEditorProps> = ({ editable, longreadElements }) => {
  const dispatch = useDispatch()

  const [isOpenBlockMenu, setIsOpenBlockMenu] = useState(false)
  const [activeElement, setActiveElement] = useState<LongreadElement | null>(null)

  const handleBlockMenuClose = useCallback(
    (menuIem?: MenuItem) => {
      if (menuIem && menuIem.type && activeElement) {
        dispatch(
          addNewLongreadElementAfter({
            type: menuIem.type,
            options: menuIem.options,
            element: activeElement,
          })
        )
      }
      setActiveElement(null)
      setIsOpenBlockMenu(false)
    },
    [activeElement, dispatch]
  )

  const handlerMenuClick = useCallback(
    ({ type, options }) => {
      if (type) {
        dispatch(
          addNewLongreadElement({
            type,
            options,
          })
        )
      } else {
        setActiveElement(null)
        setIsOpenBlockMenu(true)
      }
    },
    [dispatch]
  )

  const handleItemMenuClick = useCallback(
    (element: LongreadElement, menuItem: unknown) => {
      const { type, options } = menuItem as MenuItem
      if (type) {
        dispatch(addNewLongreadElementAfter({ type, element, options }))
      } else {
        setActiveElement(element)
        setIsOpenBlockMenu(true)
      }
    },
    [dispatch]
  )

  return (
    <div className={css.root}>
      <div className={cx(css.canvas, editable && css.editable)}>
        <DndProvider backend={HTML5Backend}>
          {longreadElements.length
            ? longreadElements
                .filter((item) => editable || !isEmptyLongreadElement(item))
                .map((item, index, elements) => (
                  <LongreadItem
                    key={item.id}
                    item={item}
                    editable={editable}
                    isFirsItem={!index}
                    isLastItem={index === elements.length - 1}
                    menuItems={MENU_ITEMS}
                    onClickMenuItem={handleItemMenuClick}
                  />
                ))
            : editable && <LongreadMenu className={css.menu} items={MENU_ITEMS} onClickMenuItem={handlerMenuClick} />}
        </DndProvider>
      </div>
      <LongreadBlockMenu open={isOpenBlockMenu} items={BLOCK_MENU_ITEMS} onClose={handleBlockMenuClose} />
    </div>
  )
}

export default React.memo(LongreadEditor)
