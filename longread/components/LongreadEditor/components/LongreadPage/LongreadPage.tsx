import React from 'react';
import type { LongreadPageElement } from 'features/longread/lib/types';
import css from './styles.module.sass';

interface LongreadPageProps {
  item: LongreadPageElement;
}

const LongreadPage: React.FC<LongreadPageProps> = ({ item }) => (
  <div className={css.root}>{item.type}</div>
);

export default LongreadPage;
