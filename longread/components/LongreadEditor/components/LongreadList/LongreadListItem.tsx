import React, { useMemo } from 'react';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import cx from 'classnames';
import styles from 'features/longread/lib/styles.module.sass';
import type { LongreadListElementItem } from 'features/longread/lib/types';
import { getCyrillicLetterByIndex } from 'features/longread/lib/utils';
import { createGetterMediumEditorOptions } from 'features/longread/utils';
import css from './styles.module.sass';
import ContentEditable from '../ContentEditable';

const getMediumEditorOptions = createGetterMediumEditorOptions({
  acceptedButtons: ['bold', 'italic', 'strikethrough', 'anchor', 'superscript'],
});

interface LongreadListItemProps {
  item: LongreadListElementItem;
  list: LongreadListElementItem[];
  index: number;
  level?: number;
  ordered: boolean;
  editable: boolean;
  isFirsItem: boolean;
  isLastItem: boolean;
  disabledDelete?: boolean;
  onBlur: () => void;
  onFocus: () => void;
  handlers: {
    valueChange: (listItem: LongreadListElementItem, value: string) => void;
    upListItem: (listItem: LongreadListElementItem) => void;
    downListItem: (listItem: LongreadListElementItem) => void;
    deleteListItem: (listItem: LongreadListElementItem) => void;
    addNewListItem: (listItem: LongreadListElementItem) => void;
    addNewListItemAfter: (listItem: LongreadListElementItem) => void;
  };
}

const LongreadListItem: React.FC<LongreadListItemProps> = ({
  list,
  item,
  level = 1,
  index,
  ordered,
  editable,
  isFirsItem,
  isLastItem,
  disabledDelete = false,
  onBlur,
  onFocus,
  handlers,
}) => {
  const listItems = useMemo(
    () => list?.filter(({ parentId }) => parentId === item.id),
    [list, item],
  );

  return (
    <>
      <div className={css.row}>
        {ordered ? (
          level > 1 ? (
            <div className={css.letter}>{getCyrillicLetterByIndex(index)}.</div>
          ) : (
            <div className={css.circle}>{index + 1}</div>
          )
        ) : (
          <div className={css.point} />
        )}
        <ContentEditable
          className={cx(
            css.content,
            editable && css.editable,
            ordered && css.ordered,
          )}
          contentClassName={cx(css.item, styles.common)}
          editable={editable}
          value={item.value}
          onBlur={onBlur}
          onFocus={onFocus}
          onChange={(value: string) => handlers.valueChange(item, value)}
          onKeydownEnter={() => handlers.addNewListItemAfter(item)}
          getMediumEditorOptions={getMediumEditorOptions}
        />
        {editable && (
          <div className={css.toolbar}>
            {level === 1 && (
              <Button
                className={css.button}
                size="small"
                icon={<UnorderedListOutlined />}
                onClick={() => handlers.addNewListItem(item)}
                title="Добавить подпункт"
              />
            )}
            <Button
              className={css.button}
              size="small"
              icon={<ArrowDownOutlined />}
              onClick={() => handlers.downListItem(item)}
              disabled={isLastItem}
              title="Переместить ниже"
            />
            <Button
              className={css.button}
              size="small"
              icon={<ArrowUpOutlined />}
              onClick={() => handlers.upListItem(item)}
              disabled={isFirsItem}
              title="Переместить выше"
            />
            <Button
              className={css.button}
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handlers.deleteListItem(item)}
              disabled={disabledDelete}
              title="Удалить пункт"
            />
          </div>
        )}
      </div>
      {listItems.length > 0 && (
        <div className={css.list}>
          {listItems
            .filter(item => editable || item.value)
            .map((item, index, items) => (
              <LongreadListItem
                key={item.id}
                item={item}
                list={list}
                index={index}
                level={level + 1}
                ordered={ordered}
                editable={editable}
                isFirsItem={!index}
                isLastItem={index === items.length - 1}
                onBlur={onBlur}
                onFocus={onFocus}
                handlers={handlers}
              />
            ))}
        </div>
      )}
    </>
  );
};

export default LongreadListItem;
