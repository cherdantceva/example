import React, { useCallback, useMemo } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import cx from 'classnames';
import styles from 'features/longread/lib/styles.module.sass';
import type {
  LongreadListElement,
  LongreadListElementItem,
} from 'features/longread/lib/types';
import LongreadListItem from './LongreadListItem';
import css from './styles.module.sass';
import {
  addNewListItem,
  addNewListItemAfter,
  changeListItemValue,
  changeTitle,
  deleteListItem,
  downListItem,
  getMediumEditorOptionsListTitle,
  upListItem,
} from './utils';
import ContentEditable from '../ContentEditable';

interface LongreadListProps {
  list: LongreadListElement;
  editable: boolean;
  onBlur: () => void;
  onFocus: () => void;
  onChange: (item: LongreadListElement) => void;
}

const LongreadList: React.FC<LongreadListProps> = ({
  list,
  editable,
  onBlur,
  onFocus,
  onChange,
}) => {
  const listItems = useMemo(
    () => list.items.filter(({ parentId }) => parentId === list.id),
    [list],
  );

  const handleTitleChange = useCallback(
    value => {
      onChange(changeTitle(list, value));
    },
    [list, onChange],
  );

  const handleAddItemClick = useCallback(() => {
    onChange(addNewListItem(list));
  }, [list, onChange]);

  const listItemHandlers = useMemo(
    () => ({
      valueChange: (listItem: LongreadListElementItem, value: string) => {
        onChange(
          changeListItemValue({
            list,
            listItem,
            value,
          }),
        );
      },
      upListItem: (listItem: LongreadListElementItem) => {
        onChange(upListItem(list, listItem));
      },
      downListItem: (listItem: LongreadListElementItem) => {
        onChange(downListItem(list, listItem));
      },
      deleteListItem: (listItem: LongreadListElementItem) => {
        onChange(deleteListItem(list, listItem));
      },
      addNewListItem: (listItem: LongreadListElementItem) => {
        onChange(addNewListItem(list, listItem.id));
      },
      addNewListItemAfter: (listItem: LongreadListElementItem) => {
        onChange(addNewListItemAfter(list, listItem));
      },
    }),
    [list, onChange],
  );

  return (
    <div className={css.root}>
      <ContentEditable
        className={css.titleContainer}
        contentClassName={cx(css.title, styles.common)}
        editable={editable}
        value={list.title}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={handleTitleChange}
        getMediumEditorOptions={getMediumEditorOptionsListTitle}
      />
      <div className={css.list}>
        {listItems
          .filter(listItem => editable || listItem.value)
          .map((listItem, index, items) => (
            <div key={listItem.id} className={css.listItem}>
              <LongreadListItem
                item={listItem}
                list={list.items}
                index={index}
                ordered={list.settings.ordered}
                editable={editable}
                isFirsItem={!index}
                isLastItem={index === items.length - 1}
                disabledDelete={items.length === 1}
                onBlur={onBlur}
                onFocus={onFocus}
                handlers={listItemHandlers}
              />
            </div>
          ))}
      </div>
      {editable && (
        <Button
          className={css.addButton}
          icon={<PlusCircleOutlined />}
          onClick={handleAddItemClick}
        >
          Добавить пункт
        </Button>
      )}
    </div>
  );
};

export default React.memo(LongreadList);
