import React from 'react';
import classes from '../App/style.module.css';
import charClasses from "./Char.module.css";

/**
 * @param {{ value: number; ucd: { getName: (char: string) => string; }?; }} props
 */

export function Char(props) {
  if (isNaN(props.value))
    return null;

  const char = String.fromCodePoint(props.value);
  const title = props.ucd ? props.ucd.getName(char) : "";

  return <div className={charClasses.char} title={title}>
    <p>{char}</p>
    <span className={classes.label}>U+{Number(props.value).toString(16).toUpperCase()}</span>
    {props.ucd && <span className={classes.labelName}>{title}</span>}
  </div>;
}
