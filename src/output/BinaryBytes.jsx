import React from 'react';
import utf8 from 'utf8';
import styles from './BinaryBytes.module.css';

/**
 * @param {{ value: number; }} props
 */
export function BinaryBytes(props) {
  if (isNaN(props.value))
    return null;

  try {
    const bytes = [...utf8.encode(String.fromCodePoint(props.value))].map(c => c.charCodeAt(0));

    return <div className={styles.binaryByte} style={{ marginRight: 4 }}>
      {bytes.map((b, i, a) => {
        const bString = b.toString(2).padStart(8, '0');
        let bytePrefix, byteData;
        if (a.length === 1) {
          bytePrefix = bString.substr(0, 1);
          byteData = bString.substr(1);
        } else {
          if (i === 0) {
            bytePrefix = bString.substr(0, a.length + 1);
            byteData = bString.substr(a.length + 1);
          } else {
            bytePrefix = bString.substr(0, 2);
            byteData = bString.substr(2);
          }
        }
        return <span key={i}>
          <span className={styles.bytePrefix}>{bytePrefix}</span>
          <span className={styles.byteData}>{byteData}</span>
        </span>;
      })}
    </div>;
  } catch (e) {
    return null;
  }
}
