import React from 'react';
import he from 'he';
import utf8 from 'utf8';
import * as input from './input';

import classes from './nodes.module.css';

export const TYPES = {
    INPUT:              0x01,
    
    INTERPRET_RAW:      0x10,
    INTERPRET_ENCODED:  0x11,
    INTERPRET_DECIMAL:  0x12,
    INTERPRET_HEX:      0x13,
    INTERPRET_UTF8:     0x14,
    INTERPRET_BASE64:   0x15,
    
    DISPLAY_STRING:     0x20,
    DISPLAY_CODEPOINTS: 0x21,
    DISPLAY_ENCODED:    0x22,
    
    ENCODE_UTF8:        0x30,
    ENCODE_UTF16:       0x31,

    RENDER_HEX:         0x40,
    RENDER_BINARY:      0x41,
    RENDER_BASE64:      0x42,

    DECODE_UTF8:        0x50,
    DECODE_BASE64:      0x51,
};

export function InputBlock (props) {
    const [ value, setValue ] = React.useState(props.value || "Hello");

    const { node } = props;

    return (
        <div className={classes['node-container']}>
            <div className={classes['input-node']}>
                <label>Input</label>
                <textarea
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
            </div>
            <div className={classes['node-children']}>
                {node.children.map(child => <InterpretBlock node={child} value={value} setValue={setValue} />)}
            </div>
        </div>
    );
}

export function InterpretBlock (props) {
    const type_map = {
        [TYPES.INTERPRET_RAW]:      "raw",
        [TYPES.INTERPRET_ENCODED]:  "encoded",
        [TYPES.INTERPRET_DECIMAL]:  "decimal",
        [TYPES.INTERPRET_HEX]:      "hex",
        [TYPES.INTERPRET_UTF8]:     "utf8",
        [TYPES.INTERPRET_BASE64]:   "base64",
        [TYPES.DECODE_BASE64]:      "base64_decode",
    };

    let type = type_map[props.node.type];
    const ii = input[type];
    const isValid = ii.isValid(props.value);
    const codePoints = isValid ? ii.parse(props.value) : [];
    const className = props.node.type === TYPES.DECODE_BASE64 ?
        classes['encode-node'] : classes['interpret-node'];

    return (
        <div className={classes['node-container']} style={{ opacity: isValid ? 1 : 0.5 }}>
            <div className={className}>
                <label>{ii.label}</label>
            </div>
            <div className={classes['node-children']}>
                {props.node.children.map(child => <CPBlock node={child} codePoints={codePoints} setValue={props.setValue} />)}
            </div>
        </div>
    );
}

export function CPBlock (props) {
    switch (props.node.type) {
        case TYPES.DISPLAY_STRING:
        case TYPES.DISPLAY_ENCODED:
        case TYPES.DISPLAY_CODEPOINTS:
            return <DisplayBlock node={props.node} codePoints={props.codePoints} setValue={props.setValue} />;
        case TYPES.ENCODE_UTF8:
            return <EncodeBlock node={props.node} codePoints={props.codePoints} setValue={props.setValue} />;
        case TYPES.RENDER_HEX:
        case TYPES.RENDER_BASE64:
            return <RenderBlock node={props.node} bytes={props.codePoints} setValue={props.setValue} />;
        case TYPES.DECODE_UTF8:
            return <DecodeBlock node={props.node} bytes={props.codePoints} setValue={props.setValue} />;
    }
    return null;
}

export function DisplayBlock (props) {
    const { node, codePoints } = props;

    let label;
    let output;

    if (node.type === TYPES.DISPLAY_STRING) {
        label = "String";
        output = String.fromCodePoint(...codePoints);
    } else if (node.type === TYPES.DISPLAY_ENCODED) {
        label = "Encoded";
        output = he.encode(String.fromCodePoint(...codePoints), { useNamedReferences: true });
    } else if (node.type === TYPES.DISPLAY_CODEPOINTS) {
        label = "Code Points";
        output = codePoints.map(cp => `U+${cp.toString(16).padStart(2, '0')}`).join(" ");
    }

    return (
        <div className={classes['node-container']}>
            <div className={classes['display-node']}>
                <label>{label}</label>
                <p onClick={() => props.setValue(output)}>{output}</p>
            </div>
            <div className={classes['node-children']}>
                {props.node.children.map(child => <InterpretBlock node={child} value={output} setValue={props.setValue} />)}
            </div>
        </div>
    );
}

export function EncodeBlock (props) {
    const bytes = [...utf8.encode(String.fromCodePoint(...props.codePoints))].map(c => c.charCodeAt(0));
  
    return (
        <div className={classes['node-container']}>
            <div className={classes['encode-node']}>
                <label>UTF-8 Encode</label>
            </div>
            <div className={classes['node-children']}>
                {props.node.children.map(child => <RenderBlock node={child} bytes={bytes} setValue={props.setValue} />)}
            </div>
        </div>
    );
}

export function DecodeBlock (props) {
    let codePoints = [];
    let isValid = false;

    try {
        const byteString = props.bytes.map(x => String.fromCharCode(x)).join("");
        const string = utf8.decode(byteString);

        codePoints = [...string].map(x => x.codePointAt(0));
        isValid = true;
    } catch (e) {}
  
    return (
        <div className={classes['node-container']} style={{ opacity: isValid ? 1 : 0.5 }}>
            <div className={classes['interpret-node']}>
                <label>UTF-8 Decode</label>
            </div>
            <div className={classes['node-children']}>
                {props.node.children.map(child => <CPBlock node={child} codePoints={codePoints} setValue={props.setValue} />)}
            </div>
        </div>
    );
}

export function RenderBlock (props) {
    const { node, bytes } = props;

    let label;
    let output;
    let text = bytes.map((b, i) => b.toString(16).padStart(2,'0')).join(" ");

    if (node.type === TYPES.RENDER_HEX) {
        label = "Hex";
        text = bytes.map((b, i) => b.toString(16).padStart(2,'0')).join(" ");
        output = bytes.map((b, i) => <span key={i}>{b.toString(16).padStart(2,'0')}</span>);
    } else if (node.type === TYPES.RENDER_BASE64) {
        label = "Base64";
        output = btoa(String.fromCharCode(...bytes));
        text = output;
    }

    return (
        <div className={classes['node-container']}>
            <div className={classes['render-node']}>
                <label>{label}</label>
                <p onClick={() => props.setValue(text)}>{output}</p>
            </div>
        </div>
    );
}