import { useRef } from 'react'
import type { SourceType, TargetType } from 'dnd-core'
import { useDrag, useDrop } from 'react-dnd'

interface Params<Item> {
  item: Item
  type: SourceType
  accept?: TargetType
  enable: boolean
  onDropItem: (dragItem: Item, dropItem: Item) => void
}

const useDragAndDrop = <Item>({ item, type, accept = type, enable, onDropItem }: Params<Item>) => {
  const ref = useRef<HTMLDivElement | null>(null)

  const [{ isOver, canDrop, isOverCurrent }, dropRef] = useDrop(
    () => ({
      accept,
      drop: (dragItem: Item) => {
        onDropItem(item, dragItem)
      },
      canDrop: () => enable,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [accept, enable, item, onDropItem]
  )

  const [{ isDragging }, dragRef] = useDrag(
    {
      type,
      item,
      canDrag: () => enable,
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    },
    [type, item, enable]
  )

  dropRef(dragRef(ref))

  return {
    ref,
    isOver,
    canDrop,
    isOverCurrent,
    isDragging,
  }
}

export default useDragAndDrop
