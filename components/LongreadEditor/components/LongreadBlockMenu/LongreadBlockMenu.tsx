import React, { useCallback } from 'react'
import { Button, Drawer } from 'antd'
import type { MenuItem } from '../../menu'
import css from './styles.module.sass'

interface LongreadBlockMenuProps {
  open: boolean
  items: MenuItem[]
  onClose: (menuItem?: MenuItem) => void
}

const LongreadBlockMenu: React.FC<LongreadBlockMenuProps> = ({ open, items, onClose }) => {
  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleButtonClick = useCallback(
    (e) => {
      const { index } = e.currentTarget.dataset
      onClose(items[parseInt(index, 10)])
    },
    [items, onClose]
  )

  return (
    <Drawer
      title='Добавление блока'
      placement='right'
      width={680}
      closable={false}
      onClose={handleClose}
      open={open}
      maskClosable
    >
      <div className={css.root}>
        {items.map(({ text }, index) => (
          <Button key={text} size='small' data-index={index} onClick={handleButtonClick}>
            {text}
          </Button>
        ))}
      </div>
    </Drawer>
  )
}

export default LongreadBlockMenu
