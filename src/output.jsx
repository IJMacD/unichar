import React from 'react';
import utf8 from 'utf8';
import he from 'he';
import * as formats from './formats';

import classes from './App/style.module.css';

/**
 * @param {string} string
 */
function copyText (string) {
  const el = document.createElement("textarea");
  el.value = string;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

/**
 * @param {{ codepoints: number[]; onSelect: (text: string) => void; }} props
 */
export function StringOutput (props) {
  const str = String.fromCodePoint(...props.codepoints);
  return (
    <div>
      <p className={classes.label}>
        String
        { props.onSelect && <button className={classes.switchInput} onClick={() => props.onSelect(str)}>➔</button> }
        <button className={classes.switchInput} onClick={() => copyText(str)}>📋</button>
      </p>
      { str }
    </div>
  );
}

/**
 * @param {{ codepoints: number[]; onSelect: (text: string) => void; }} props
 */
export function EncodedOutput (props) {
  const str = he.encode(String.fromCodePoint(...props.codepoints), { useNamedReferences: true });
  return (
    <div>
      <p className={classes.label}>
        Encoded
        { props.onSelect && <button className={classes.switchInput} onClick={() => props.onSelect(str)}>➔</button> }
      </p>
      { str }
    </div>
  );
}

/**
 * @param {{ codepoints: number[]; onSelect: (text: string) => void; }} props
 */
export function CodePoints ({ codepoints, onSelect }) {
  const cpList = codepoints.map(cp => `U+${cp.toString(16)}`).join(" ");
  const [ ucd, setUCD ] = React.useState(null);

  React.useEffect(() => {
    if (codepoints.length && !ucd) {
      import('ijmacd.ucd').then(({ default: ucd }) => {
        setUCD(ucd);
      });
    }
  }, [codepoints, ucd]);

  return (
    <div className={classes.codePointOutput}>
      <p className={classes.label}>
        Code Points ({codepoints.length})
        { onSelect && <button className={classes.switchInput} onClick={() => onSelect(cpList)}>➔</button> }
      </p>
      <div className={classes.codePointList}>
        {
          codepoints.map((x,i) => <Char value={x} key={i} ucd={ucd} />)
        }
      </div>
    </div>
  );
}

/**
 * @param {{ codepoints: number[]; onSelect: (text: string) => void; }} props
 */
export function UTF8Bytes (props) {

  const bytes = [...utf8.encode(String.fromCodePoint(...props.codepoints))].map(b => b.charCodeAt(0).toString(16).padStart(2,"0")).join(" ");
  const length = utf8.encode(String.fromCodePoint(...props.codepoints)).length;

  return (
    <div>
      <p className={classes.label}>
        UTF-8 ({length} {length === 1 ? "byte" : "bytes"})
        { props.onSelect && <button className={classes.switchInput} onClick={() => props.onSelect(bytes)}>➔</button> }
      </p>
      {
        props.codepoints.map((x,i) => <Bytes value={x} key={i} />)
      }
    </div>
  );
}

/**
 * @param {{ codepoints: number[]; onSelect: (text: string) => void;  }} props
 */
export function UTF8Binary (props) {
  return <div>
    <div className={classes.label}>
      UTF-8 Bits
      { props.onSelect && <button className={classes.switchInput} onClick={() => props.onSelect(formats.binary.fromCodePoint(...props.codepoints))}>➔</button> }
    </div>
    {
      props.codepoints.map((x,i) => <BinaryBytes value={x} key={i} />)
    }
  </div>
}

/**
 * @param {{ value: number; ucd: { getName: (char: string) => string; }; }} props
 */
function Char (props) {
  if(isNaN(props.value)) return null;

  const char = String.fromCodePoint(props.value);
  const title = props.ucd ? props.ucd.getName(char) : "";

  return <div className={classes.char} title={title}>
    <p>{char}</p>
    <span className={classes.label}>U+{Number(props.value).toString(16).toUpperCase()}</span>
    { props.ucd && <span className={classes.labelName}>{title}</span> }
  </div>;
}

/**
 * @param {{ value: number; }} props
 */
function Bytes (props) {
  if(isNaN(props.value)) return null;

  try {
    const bytes = [...utf8.encode(String.fromCodePoint(props.value))].map(c => c.charCodeAt(0));

    return <div className={classes.byte} style={{ marginRight: 4 }}>
      {bytes.map((b, i) => <span key={i}>{b.toString(16).padStart(2,'0')}</span>)}
    </div>;
  } catch (e) {
    return;
  }
}

/**
 * @param {{ value: number; }} props
 */
function BinaryBytes (props) {
  if(isNaN(props.value)) return null;

  try {
    const bytes = [...utf8.encode(String.fromCodePoint(props.value))].map(c => c.charCodeAt(0));

    return <div className={classes.byte + " " + classes.binaryByte} style={{ marginRight: 4 }}>
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
          } else  {
            bytePrefix = bString.substr(0,2);
            byteData = bString.substr(2);
          }
        }
        return <span key={i}>
          <span className={classes.bytePrefix}>{bytePrefix}</span>
          <span className={classes.byteData}>{byteData}</span>
        </span>;
      })}
    </div>
  } catch (e) {
    return;
  }
}