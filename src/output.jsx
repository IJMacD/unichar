import React, { useState } from 'react';
import utf8 from 'utf8';
import he from 'he';
import * as formats from './formats';
import { Toast } from './Toast';

import classes from './App/style.module.css';
import { UTF8Bytes as UTF8ByteBlocks } from './output/UTF8Bytes';
import { BinaryBytes } from './output/BinaryBytes';

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
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.string
 * @param {Function} [props.onSelect]
 * @param {Function?} [props.onChain]
 * @param {object} [props.children]
 * @param {boolean} [props.copyable]
 * @param {boolean} [props.defaultExpanded]
 */
function CommonOutput ({ label, onSelect, string, onChain = null, children = null, copyable = false, defaultExpanded = false }) {
  const [ expanded, setExpanded ] = useState(defaultExpanded);

  return (
    <div onClick={() => { document.getSelection()?.getRangeAt(0).collapsed && setExpanded(!expanded); }} style={{cursor:"pointer", padding: "8px 0"}}>
      <p className={classes.label}>
        { label }{' '}
        { onSelect && <button className={classes.switchInput} onClick={e => { e.stopPropagation(); onSelect(string); }}>✎</button> }
        { copyable && <button className={classes.switchInput} onClick={e => { e.stopPropagation(); copyText(string); Toast("Copied"); }}>📋</button> }
        <span style={{color: "black"}}>{expanded ? "▼" : "◀"}</span>
        { onChain && <button className={classes.switchInput} onClick={e => { e.stopPropagation(); onChain(); }}>🔗</button> }
      </p>
      { expanded && (children || string) }
    </div>
  );
}

/**
 * @param {{ codepoints: number[]; onSelect?: (text: string) => void; onChain?: Function }} props
 */
export function StringOutput (props) {
  const str = String.fromCodePoint(...props.codepoints);
  return <CommonOutput label="String" onSelect={props.onSelect} string={str} onChain={props.onChain} copyable defaultExpanded />;
}

/**
 * @param {{ codepoints: number[]; onSelect?: (text: string) => void; onChain?: Function }} props
 */
export function EncodedOutput (props) {
  const str = he.encode(String.fromCodePoint(...props.codepoints), { useNamedReferences: true });
  return <CommonOutput label={formats.encoded.label} onSelect={props.onSelect} string={str} onChain={props.onChain} />
}

/**
 * @param {{ codepoints: number[]; onSelect?: (text: string) => void; onChain?: Function }} props
 */
export function EscapedOutput (props) {
  const str = formats.escaped.fromCodePoint(...props.codepoints);
  return <CommonOutput label={formats.escaped.label} onSelect={props.onSelect} string={str} onChain={props.onChain} />
}

/**
 * @param {{ codepoints: number[]; onSelect?: (text: string) => void; onChain?: Function }} props
 */
 export function URLEncodedOutput (props) {
  return <CommonOutput label={formats.urlEncoded.label} onSelect={props.onSelect} string={formats.urlEncoded.fromCodePoint(...props.codepoints)} onChain={props.onChain} />
}

/**
 * @param {{ codepoints: number[]; onSelect?: (text: string) => void; onChain?: Function }} props
 */
export function DecimalOutput (props) {
  return <CommonOutput label={formats.decimal.label} onSelect={props.onSelect} string={props.codepoints.join(" ")} onChain={props.onChain} />
}

/**
 * @param {{ codepoints: number[]; onSelect?: (text: string) => void; onChain?: Function }} props
 */
export function Windows1252HexOutput (props) {
  return <CommonOutput label={formats.windows1252Hex.label} onSelect={props.onSelect} string={formats.windows1252Hex.fromCodePoint(...props.codepoints)} onChain={props.onChain} />
}

/**
 * @param {{ codepoints: number[]; onSelect?: (text: string) => void; onChain?: Function }} props
 */
export function Base64Utf8Output (props) {
  return <CommonOutput label={formats.base64Utf8.label} onSelect={props.onSelect} string={formats.base64Utf8.fromCodePoint(...props.codepoints)} onChain={props.onChain} />
}

/**
 * @param {{ codepoints: number[]; onSelect?: (text: string) => void; onChain?: Function }} props
 */
export function UTF8Bytes (props) {

  try {
    const encoded = utf8.encode(String.fromCodePoint(...props.codepoints));
    const bytes = [...encoded].map(b => b.charCodeAt(0).toString(16).padStart(2,"0")).join(" ");
    const length = encoded.length;

    return (
      <CommonOutput
        label={`UTF-8 (${length} ${length === 1 ? "byte" : "bytes"})`}
        onSelect={props.onSelect}
        string={bytes}
        onChain={props.onChain}
      >
        {
          props.codepoints.map((x,i) => <UTF8ByteBlocks value={x} key={i} />)
        }
      </CommonOutput>
    );
  } catch (e) {
    return null;
  }
}

/**
 * @param {{ codepoints: number[]; onSelect?: (text: string) => void; onChain?: Function }} props
 */
export function UTF8Binary (props) {
  return (
    <CommonOutput
      label={`UTF-8 Bits`}
      onSelect={props.onSelect}
      string={formats.binary.fromCodePoint(...props.codepoints)}
      onChain={props.onChain}
    >
      <div style={{fontSize:"1rem"}}>
        {
          props.codepoints.map((x,i) => <BinaryBytes value={x} key={i} />)
        }
      </div>
    </CommonOutput>
  );
}

