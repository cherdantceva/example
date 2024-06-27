import React, { useCallback, useMemo, useState } from 'react';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import cx from 'classnames';
import {
  changeLongreadElement,
  copyLongreadElement,
  deleteLongreadElement,
  downLongreadElement,
  dragAndDropLongreadElement,
  upLongreadElement,
} from 'features/longread/ducks';
import {
  LongreadElement,
  LongreadElementType,
} from 'features/longread/lib/types';
import {
  isCodeLongreadElement,
  isImageLongreadElement,
  isListLongreadElement,
  isPanelLongreadElement,
  isTextLongreadElement,
  isVideoLongreadElement,
} from 'features/longread/lib/utils';
import { useDispatch } from 'react-redux';
import LongreadSettingItem from './components/LongreadSettingItem';
import useDragAndDrop from './hooks/useDragAndDrop';
import css from './styles.module.sass';
import LongreadCode from '../LongreadCode';
import LongreadImage from '../LongreadImage';
import LongreadList from '../LongreadList';
import LongreadMenu from '../LongreadMenu';
import LongreadPanel from '../LongreadPanel';
import LongreadText from '../LongreadText';
import LongreadVideo from '../LongreadVideo';

interface LongreadItemProps {
  item: LongreadElement;
  editable: boolean;
  isFirsItem: boolean;
  isLastItem: boolean;
  menuItems: {
    type: LongreadElementType | null;
    text: string;
    icon?: React.ReactNode;
  }[];
  onClickMenuItem: (item: LongreadElement, menuItem: unknown) => void;
}

const LongreadItem: React.FC<LongreadItemProps> = ({
  item,
  editable,
  isFirsItem,
  isLastItem,
  menuItems,
  onClickMenuItem,
}) => {
  const dispatch = useDispatch();

  const [dndEnable, setDndEnable] = useState(true);
  const [settingDrawerOpen, setSettingDrawerOpen] = useState(false);

  const handleDragAndDrop = useCallback(
    (dropElement: LongreadElement, dragElement: LongreadElement) => {
      dispatch(dragAndDropLongreadElement({ dropElement, dragElement }));
    },
    [dispatch],
  );

  const { ref } = useDragAndDrop<LongreadElement>({
    item,
    type: 'longread-item',
    enable: editable && dndEnable,
    onDropItem: handleDragAndDrop,
  });

  const elementHandlers = useMemo(
    () => ({
      handleItemBlur: () => {
        setDndEnable(true);
      },
      handleItemFocus: () => {
        setDndEnable(false);
      },
      handleItemDelete: () => {
        dispatch(deleteLongreadElement(item));
      },
      handleItemCopy: () => {
        dispatch(copyLongreadElement(item));
      },
      handleItemChange: (longreadElement: LongreadElement) => {
        dispatch(changeLongreadElement(longreadElement));
      },
      handleItemUp: () => {
        dispatch(upLongreadElement(item));
      },
      handleItemDown: () => {
        dispatch(downLongreadElement(item));
      },
    }),
    [item, dispatch],
  );

  const inlineStyle: React.CSSProperties = useMemo(
    () => ({
      marginBottom: isLastItem ? undefined : `${item.settings.indent}px`,
    }),
    [item.settings, isLastItem],
  );

  const handlerMenuItemClick = useCallback(
    (menuItem: unknown) => {
      onClickMenuItem(item, menuItem);
    },
    [item, onClickMenuItem],
  );

  const handleItemSetting = useCallback(() => {
    setSettingDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setSettingDrawerOpen(false);
  }, []);

  const handleSettingSave = useCallback(
    ({ indent, anchor, ...settings }) => {
      const newItem = {
        ...item,
        settings: {
          ...item.settings,
          indent,
          anchor,
        },
      };
      if (isListLongreadElement(newItem)) {
        newItem.settings.ordered = settings.listOrdered;
      } else if (isImageLongreadElement(newItem)) {
        newItem.settings.width = settings.imageWidth;
        newItem.settings.border = settings.imageBorder;
        newItem.images = Array(settings.imageCount)
          .fill({ url: '' })
          .map((value, index) => newItem.images[index] || value);
      } else if (isPanelLongreadElement(newItem)) {
        newItem.settings.icon = settings.panelIcon;
        newItem.settings.background = settings.panelBackground;
      } else if (isCodeLongreadElement(newItem)) {
        newItem.settings.name = settings.codeName;
      }
      dispatch(changeLongreadElement(newItem));
      setSettingDrawerOpen(false);
    },
    [dispatch, item],
  );

  return (
    <div
      ref={ref}
      id={item.settings.anchor || undefined}
      className={cx(css.root, editable && css.editable)}
      style={editable ? undefined : inlineStyle}
    >
      {editable && (
        <div className={css.toolbar}>
          <div className={css.label}>{item.label}</div>
          <Button
            className={css.button}
            size="small"
            onClick={handleItemSetting}
          >
            Настройки
          </Button>
          <Button
            className={css.button}
            size="small"
            icon={<ArrowDownOutlined />}
            onClick={elementHandlers.handleItemDown}
            disabled={isLastItem}
            title="Переместить ниже"
          />
          <Button
            className={css.button}
            size="small"
            icon={<ArrowUpOutlined />}
            onClick={elementHandlers.handleItemUp}
            disabled={isFirsItem}
            title="Переместить выше"
          />
          <Button
            className={css.button}
            size="small"
            icon={<CopyOutlined />}
            onClick={elementHandlers.handleItemCopy}
            title="Дублировать блок"
          />
          <Button
            className={css.button}
            size="small"
            icon={<DeleteOutlined />}
            onClick={elementHandlers.handleItemDelete}
            title="Удалить блок"
          />
        </div>
      )}
      {isTextLongreadElement(item) && (
        <LongreadText
          item={item}
          editable={editable}
          onBlur={elementHandlers.handleItemBlur}
          onFocus={elementHandlers.handleItemFocus}
          onChange={elementHandlers.handleItemChange}
        />
      )}
      {isListLongreadElement(item) && (
        <LongreadList
          list={item}
          editable={editable}
          onBlur={elementHandlers.handleItemBlur}
          onFocus={elementHandlers.handleItemFocus}
          onChange={elementHandlers.handleItemChange}
        />
      )}
      {isImageLongreadElement(item) && (
        <LongreadImage
          item={item}
          editable={editable}
          onBlur={elementHandlers.handleItemBlur}
          onFocus={elementHandlers.handleItemFocus}
          onChange={elementHandlers.handleItemChange}
        />
      )}
      {isPanelLongreadElement(item) && (
        <LongreadPanel
          item={item}
          editable={editable}
          onBlur={elementHandlers.handleItemBlur}
          onFocus={elementHandlers.handleItemFocus}
          onChange={elementHandlers.handleItemChange}
        />
      )}
      {isCodeLongreadElement(item) && (
        <LongreadCode
          item={item}
          editable={editable}
          onBlur={elementHandlers.handleItemBlur}
          onFocus={elementHandlers.handleItemFocus}
          onChange={elementHandlers.handleItemChange}
        />
      )}
      {isVideoLongreadElement(item) && (
        <LongreadVideo
          item={item}
          onBlur={elementHandlers.handleItemBlur}
          onFocus={elementHandlers.handleItemFocus}
          editable={editable}
          onChange={elementHandlers.handleItemChange}
        />
      )}
      {editable && (
        <>
          <LongreadMenu
            className={css.menu}
            items={menuItems}
            onClickMenuItem={handlerMenuItemClick}
          />
          <LongreadSettingItem
            open={settingDrawerOpen}
            item={item}
            onSettingSave={handleSettingSave}
            onCloseDrawer={handleDrawerClose}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(LongreadItem);
