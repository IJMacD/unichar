import React from 'react';
import utf8 from 'utf8';
import styles from './Bytes.module.css';

/**
 * @param {{ value: number; }} props
 */
export function UTF8Bytes(props) {
  if (isNaN(props.value))
    return null;

  try {
    const bytes = [...utf8.encode(String.fromCodePoint(props.value))].map(c => c.charCodeAt(0));

    return <div className={styles.byte} style={{ marginRight: 4 }}>
      {bytes.map((b, i) => <span key={i}>{b.toString(16).padStart(2, '0')}</span>)}
    </div>;
  } catch (e) {
    return null;
  }
}
