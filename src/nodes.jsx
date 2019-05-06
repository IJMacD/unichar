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
    
    DISPLAY_STRING:     0x20,
    DISPLAY_CODEPOINTS: 0x21,
    DISPLAY_ENCODED:    0x22,
    
    ENCODE_UTF8:        0x30,
    ENCODE_UTF16:       0x31,

    RENDER_HEX:         0x40,
    RENDER_BINARY:      0x41,
    RENDER_BASE64:      0x42,
};

export class Node {
    /** @type {number} */
    type;
    /** @type {Node[]} */
    children;
}

export function InputBlock (props) {
    const [ value, setValue ] = React.useState(props.value || "Hello");

    const { node } = props;

    return (
        <div className={classes['node-container']}>
            <div className={classes['input-node']}>
                <p>Input</p>
                <input
                    type="text"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
            </div>
            <div className={classes['node-children']}>
                {node.children.map(child => {
                    let type;
                    if (child.type === TYPES.INTERPRET_RAW) {
                        type = "raw";
                    }
                    else if (child.type === TYPES.INTERPRET_ENCODED) {
                        type = "encoded";
                    }
                    else if (child.type === TYPES.INTERPRET_HEX) {
                        type = "hex";
                    }
                    else if (child.type === TYPES.INTERPRET_DECIMAL) {
                        type = "decimal";
                    }
                    else if (child.type === TYPES.INTERPRET_UTF8) {
                        type = "utf8";
                    }
                    return <InterpretBlock node={child} type={type} value={value} />;
                })}
            </div>
        </div>
    );
}

export function InterpretBlock (props) {
    const ii = input[props.type];
    const isValid = ii.isValid(props.value);
    const codePoints = isValid ? ii.parse(props.value) : [];

    return (
        <div className={classes['node-container']} style={{ opacity: isValid ? 1 : 0.5 }}>
            <div className={classes['interpret-node']}>
                <p>{ii.label}</p>
            </div>
            <div className={classes['node-children']}>
                {props.node.children.map(child => <CPBlock node={child} codePoints={codePoints} />)}
            </div>
        </div>
    );
}

export function CPBlock (props) {
    switch (props.node.type) {
        case TYPES.DISPLAY_STRING:
        case TYPES.DISPLAY_ENCODED:
        case TYPES.DISPLAY_CODEPOINTS:
            return <DisplayBlock node={props.node} codePoints={props.codePoints} />;
        case TYPES.ENCODE_UTF8:
            return <EncodeBlock node={props.node} codePoints={props.codePoints} />;
    }
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
                <p>{label}</p>
                <p>{output}</p>
            </div>
        </div>
    );
}

export function EncodeBlock (props) {
    const bytes = [...utf8.encode(String.fromCodePoint(...props.codePoints))].map(c => c.charCodeAt(0));
  
    return (
        <div className={classes['node-container']}>
            <div className={classes['encode-node']}>
                <p>UTF-8</p>
            </div>
            <div className={classes['node-children']}>
                {props.node.children.map(child => <RenderBlock node={child} bytes={bytes} />)}
            </div>
        </div>
    );
}

export function RenderBlock (props) {
    const { node, bytes } = props;

    let label;
    let output;

    if (node.type === TYPES.RENDER_HEX) {
        label = "Hex";
        output = bytes.map((b, i) => <span key={i}>{b.toString(16).padStart(2,'0')}</span>);
    }

    return (
        <div className={classes['node-container']}>
            <div className={classes['render-node']}>
                <p>{label}</p>
                <p>{output}</p>
            </div>
        </div>
    );
}