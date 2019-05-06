import React from 'react';
import utf8 from 'utf8';
import he from 'he';

import classes from './App/style.module.css';

export function StringOutput (props) {
  const str = String.fromCodePoint(...props.codepoints);
  return (
    <div>
      <p className={classes.label}>
        String
        { props.onSelect && <button className={classes.switchInput} onClick={() => props.onSelect(str)}>➔</button> }
      </p>
      { str }
    </div>
  );
}

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

export function CodePoints (props) {
  const cpList = props.codepoints.map(cp => `U+${cp.toString(16)}`).join(" ");

  return (
    <div>
      <p className={classes.label}>
        Code Points ({props.codepoints.length})
        { props.onSelect && <button className={classes.switchInput} onClick={() => props.onSelect(cpList)}>➔</button> }
      </p>
      {
        props.codepoints.map((x,i) => <Char value={x} key={i} ucd={props.ucd} />)
      }
    </div>
  );
}

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

export function UTF8Binary (props) {
  return <div>
    <div className={classes.label}>UTF-8 Bits</div>
    {
      props.codepoints.map((x,i) => <BinaryBytes value={x} key={i} />)
    }
  </div>
}

function Char (props) {
  if(isNaN(props.value)) return null;

  const char = String.fromCodePoint(props.value);
  const title = props.ucd ? props.ucd.getName(char) : "";

  return <div className={classes.char} title={title}>
    <p>{char}</p>
    <span className={classes.label}>U+{Number(props.value).toString(16).toUpperCase()}</span>
    { props.ucd && <span className={classes.labelName}>{title}</span> }
  </div>
}

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