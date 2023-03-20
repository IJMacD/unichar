import React from 'react';
import classes from '../App/style.module.css';

/**
 * @param {object} props
 * @param {Uint8Array} props.bytes
 */
export function Bytes({ bytes }) {
    return (
      <div className={classes.byte} style={{ marginRight: 4 }}>
        {[...bytes].map((b, i) => <span key={i}>{b.toString(16).padStart(2, '0')}</span>)}
      </div>
    );
}
