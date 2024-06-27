import React from 'react';
import { Button } from 'antd';
import cx from 'classnames';
import css from './styles.module.sass';

interface MenuItem {
  text: string;
  icon?: React.ReactNode;
}

interface LongreadMenuProps {
  items: MenuItem[];
  className?: string;
  onClickMenuItem: (item: MenuItem) => void;
}

const LongreadMenu: React.FC<LongreadMenuProps> = ({
  className,
  items,
  onClickMenuItem,
}) => (
  <div className={cx(css.root, className)}>
    <div className={css.container}>
      <div className={css.line} />
      {items.map(item => (
        <Button
          key={item.text}
          className={css.button}
          size="small"
          icon={item.icon}
          onClick={() => onClickMenuItem(item)}
        >
          {item.text}
        </Button>
      ))}
    </div>
  </div>
);

export default React.memo(LongreadMenu);
