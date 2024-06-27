import React, { useCallback } from 'react';
import css from 'features/longread/lib/styles.module.sass';
import type { LongreadTextElement } from 'features/longread/lib/types';
import ContentEditable from '../ContentEditable';

interface LongreadTextProps {
  item: LongreadTextElement;
  editable: boolean;
  onBlur: () => void;
  onFocus: () => void;
  onChange: (item: LongreadTextElement) => void;
}

const LongreadText: React.FC<LongreadTextProps> = ({
  item,
  onBlur,
  onFocus,
  onChange,
  editable,
}) => {
  const handleChange = useCallback(
    value => {
      onChange({
        ...item,
        value,
      });
    },
    [item, onChange],
  );

  return (
    <ContentEditable
      contentClassName={css.common}
      editable={editable}
      value={item.value}
      onBlur={onBlur}
      onFocus={onFocus}
      onChange={handleChange}
    />
  );
};

export default React.memo(LongreadText);
