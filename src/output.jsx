import React, { useState } from 'react';
import utf8 from 'utf8';
import he from 'he';
import * as formats from './formats';
import { Toast } from './Toast';

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

function CommonOutput ({ label, onSelect, string, children = null, copyable = false, defaultExpanded = false }) {
  const [ expanded, setExpanded ] = useState(defaultExpanded);

  return (
    <div onClick={() => { document.getSelection().getRangeAt(0).collapsed && setExpanded(!expanded); }} style={{cursor:"pointer", padding: "8px 0"}}>
      <p className={classes.label}>
        { label }{' '}
        { onSelect && <button className={classes.switchInput} onClick={e => { e.stopPropagation(); onSelect(string); }}>✎</button> }
        { copyable && <button className={classes.switchInput} onClick={e => { e.stopPropagation(); copyText(string); Toast("Copied"); }}>📋</button> }
        <span style={{color: "black"}}>{expanded ? "▼" : "◀"}</span>
      </p>
      { expanded && (children || string) }
    </div>
  );
}

/**
 * @param {{ codepoints: number[]; onSelect: (text: string) => void; }} props
 */
export function StringOutput (props) {
  const str = String.fromCodePoint(...props.codepoints);
  return <CommonOutput label="String" onSelect={props.onSelect} string={str} copyable defaultExpanded />;
}

/**
 * @param {{ codepoints: number[]; onSelect: (text: string) => void; }} props
 */
export function EncodedOutput (props) {
  const str = he.encode(String.fromCodePoint(...props.codepoints), { useNamedReferences: true });
  return <CommonOutput label={formats.encoded.label} onSelect={props.onSelect} string={str} />
}

/**
 * @param {{ codepoints: number[]; onSelect: (text: string) => void; }} props
 */
export function EscapedOutput (props) {
  const str = formats.escaped.fromCodePoint(...props.codepoints);
  return <CommonOutput label={formats.escaped.label} onSelect={props.onSelect} string={str} />
}

/**
 * @param {{ codepoints: number[]; onSelect: (text: string) => void; }} props
 */
 export function URLEncodedOutput (props) {
  return <CommonOutput label={formats.urlEncoded.label} onSelect={props.onSelect} string={formats.urlEncoded.fromCodePoint(...props.codepoints)} />
}

/**
 * @param {{ codepoints: number[]; onSelect: (text: string) => void; }} props
 */
export function DecimalOutput (props) {
  return <CommonOutput label={formats.decimal.label} onSelect={props.onSelect} string={props.codepoints.join(" ")} />
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
    <div className={classes.codePointOutput} style={{flex:1}}>
      <p className={classes.label}>
        Code Points ({codepoints.length})
        { onSelect && <button className={classes.switchInput} onClick={() => onSelect(cpList)}>✎</button> }
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

  const encoded = utf8.encode(String.fromCodePoint(...props.codepoints));
  const bytes = [...encoded].map(b => b.charCodeAt(0).toString(16).padStart(2,"0")).join(" ");
  const length = encoded.length;

  return (
    <CommonOutput
      label={`UTF-8 (${length} ${length === 1 ? "byte" : "bytes"})`}
      onSelect={props.onSelect}
      string={bytes}
    >
      {
        props.codepoints.map((x,i) => <Bytes value={x} key={i} />)
      }
    </CommonOutput>
  );
}

/**
 * @param {{ codepoints: number[]; onSelect: (text: string) => void;  }} props
 */
export function UTF8Binary (props) {
  return (
    <CommonOutput
      label={`UTF-8 Bits`}
      onSelect={props.onSelect}
      string={formats.binary.fromCodePoint(...props.codepoints)}
    >
      <div style={{fontSize:"1rem"}}>
        {
          props.codepoints.map((x,i) => <BinaryBytes value={x} key={i} />)
        }
      </div>
    </CommonOutput>
  );
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