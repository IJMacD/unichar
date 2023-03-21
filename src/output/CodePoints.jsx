import React from 'react';
import classes from '../App/style.module.css';
import { useUCD } from '../useUCD';
import { Char } from "./Char";

/**
 * @param {{ codepoints: number[]; onSelect?: (text: string) => void; }} props
 */

export function CodePoints({ codepoints, onSelect }) {
  const cpList = codepoints.map(cp => cp.toString(16)).join(" ");
  const ucd = useUCD();

  return (
    <div className={classes.codePointOutput} style={{ flex: 1 }}>
      <p className={classes.label}>
        Code Points ({codepoints.length})
        {onSelect && <button className={classes.switchInput} onClick={() => onSelect(cpList)}>✎</button>}
      </p>
      <div className={classes.codePointList}>
        {codepoints.map((x, i) => <Char value={x} key={i} ucd={ucd} />)}
      </div>
    </div>
  );
}
