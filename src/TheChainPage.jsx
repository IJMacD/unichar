import React, { useState } from "react";
import { decimal, escaped, hex, regexCharClass, windows1252 } from "./formats";
import { NodeViewer } from "./NodeViewer";
import styles from "./TheChain.module.css";
import { TheChainError } from "./TheChainError";
import { getUTF8Bytes, parseUTF8Bytes, stringToCodePoints } from "./utf8";

/**
 * @typedef {BaseBlock&(StringBytesBlock|StringCodePointsBlock|CodePointsStringBlock|CodePointsBytesBlock|BytesStringBlock|BytesCodePointsBlock)} Block
 */
/**
 * @typedef BaseBlock
 * @property {number} id
 * @property {string} label
 * @property {number} [inverse]
 */
/**
 * @typedef CodePointsStringBlock
 * @property {"codepoints"} input
 * @property {"string"} output
 * @property {(input: number[]) => string} convert
 */
/**
 * @typedef BytesStringBlock
 * @property {"bytes"} input
 * @property {"string"} output
 * @property {(input: Uint8Array) => string} convert
 */
/**
 * @typedef BytesCodePointsBlock
 * @property {"bytes"} input
 * @property {"codepoints"} output
 * @property {(input: Uint8Array) => number[]} convert
 */
/**
 * @typedef StringCodePointsBlock
 * @property {"string"} input
 * @property {"codepoints"} output
 * @property {(input: string) => number[]} convert
 */
/**
 * @typedef StringBytesBlock
 * @property {"string"} input
 * @property {"bytes"} output
 * @property {(input: string) => Uint8Array} convert
 */
/**
 * @typedef CodePointsBytesBlock
 * @property {"codepoints"} input
 * @property {"bytes"} output
 * @property {(input: number[]) => Uint8Array} convert
 */

const parseHexBytes = (/** @type {string} */ input) => {
    return new Uint8Array([...input.replace(/\s+/g, "").matchAll(/\w{1,2}/g)].map(c => {
        const v = parseInt(c[0], 16);
        if (isNaN(v) || v > 255) throw Error(`Hex Bytes: bad byte <${c}>`);
        return v;
    }));
};

const urlSpecial = [0x22,0x25,0x3C,0x3E,0x5B,0x5C,0x5D,0x5E,0x60,0x7B,0x7C,0x7D,0x7F];

/** @type {Block[]} */
const availableBlocks = [
    // Numbering Scheme:
    // id: 0xABNN
    //  A   - From
    //  B   - To
    //  NN  - Identifier
    // A,B from {1,2,3} where:
    //  1 - string
    //  2 - codepoints
    //  3 - bytes

    { id: 0x1200, inverse: 0x2100, label: "Raw Characters", input: "string", output: "codepoints", convert: (input) => [...input].map(s => s.codePointAt(0)||0) },
    { id: 0x1201, inverse: 0x2101, label: "Hex Code Points", input: "string", output: "codepoints", convert: (input) => hex.parse(input) },
    { id: 0x120A, inverse: 0x210A, label: "Decimal Code Points", input: "string", output: "codepoints", convert: (input) => decimal.parse(input) },
    { id: 0x120B, label: "Escaped", input: "string", output: "codepoints", convert: (input) => escaped.parse(input) },
    { id: 0x120C, label: "Regex Character Class", input: "string", output: "codepoints", convert: (input) => regexCharClass.parse(input) },

    // { id: 0x1300, label: "UTF-8", input: "string", output: "bytes", convert: (input) => getUTF8Bytes(stringToCodePoints(input)) },
    { id: 0x1304, inverse: 0x3104, label: "Base64", input: "string", output: "bytes", convert: (input) => new Uint8Array([...atob(input)].map(c => c.charCodeAt(0))) },
    { id: 0x1306, inverse: 0x3106, label: "Hex Bytes", input: "string", output: "bytes", convert: parseHexBytes },
    { id: 0x1307, inverse: 0x3107, label: "URLEncoded", input: "string", output: "bytes", convert: (input) => new Uint8Array([...decodeURI(input)].map(c => c.charCodeAt(0))) },
    { id: 0x1312, inverse: 0x3112, label: "Windows-1252", input: "string", output: "bytes", convert: (input) => new Uint8Array(windows1252.parseBytes(input)) },

    { id: 0x2300, inverse: 0x3200, label: "UTF-8", input: "codepoints", output: "bytes", convert: (input) => getUTF8Bytes(input) },
    { id: 0x2301, inverse: 0x3201, label: "UTF-16 LE", input: "codepoints", output: "bytes", convert: (input) => new Uint8Array(new Uint16Array(String.fromCodePoint(...input).split("").map(c => c.charCodeAt(0))).buffer) },
    { id: 0x2302, inverse: 0x3202, label: "UTF-32", input: "codepoints", output: "bytes", convert: (input) => new Uint8Array(new Uint32Array(input).buffer) },
    { id: 0x2100, inverse: 0x1200, label: "Code Points to String", input: "codepoints", output: "string", convert: (input) => String.fromCodePoint(...input) },
    { id: 0x2101, inverse: 0x1201, label: "As Hex List", input: "codepoints", output: "string", convert: (input) => input.map(cp => cp.toString(16).toUpperCase()).join(" ") },
    { id: 0x210A, inverse: 0x120A, label: "As Decimal List", input: "codepoints", output: "string", convert: (input) => input.map(cp => cp.toString(10).toUpperCase()).join(" ") },

    { id: 0x3200, inverse: 0x2300, label: "UTF-8", input: "bytes", output: "codepoints", convert: (input) => stringToCodePoints(parseUTF8Bytes(input)) },
    { id: 0x3201, inverse: 0x2301, label: "UTF-16 LE", input: "bytes", output: "codepoints", convert: (input) => stringToCodePoints(String.fromCharCode(...new Uint16Array(input.buffer))) },
    { id: 0x3202, inverse: 0x2302, label: "UTF-32", input: "bytes", output: "codepoints", convert: (input) => stringToCodePoints(String.fromCodePoint(...new Uint32Array(input.buffer))) },
    // { id: 0x3100, label: "UTF-8", input: "bytes", output: "string", convert: (input) =>  },
    // { id: 0x3101, label: "UTF-16 LE", input: "bytes", output: "string", convert: (input) => String.fromCharCode(...new Uint16Array(input.buffer)) },
    // { id: 0x3102, label: "UTF-32", input: "bytes", output: "string", convert: (input) => String.fromCodePoint(...new Uint32Array(input.buffer)) },
    { id: 0x3104, inverse: 0x1304, label: "Base64", input: "bytes", output: "string", convert: (input) => btoa(String.fromCharCode(...input)) },
    { id: 0x3106, inverse: 0x1306, label: "To Hex", input: "bytes", output: "string", convert: (input) => [...input].map(b => b.toString(16).padStart(2, "0")).join(" ") },
    { id: 0x3107, inverse: 0x1307, label: "URLEncode", input: "bytes", output: "string", convert: (input) => [...input].map(b => b > 0x20 && b < 0x80 && !urlSpecial.includes(b) ? String.fromCharCode(b) : `%${b.toString(16).padStart(2,"0").toUpperCase()}`).join("") },
    { id: 0x3112, inverse: 0x1312, label: "Windows-1252", input: "bytes", output: "string", convert: (input) => windows1252.fromCodePoint(...input) },
];

/**
 *
 * @param {object} props
 * @param {string} props.input
 * @param {number[]} [props.initialChain]
 * @returns
 */
export function TheChainPage ({ input, initialChain }) {
    const [ theChain, setTheChain ] = useState(() => {
        /** @type {Block[]} */
        const chain = [];

        if (initialChain) {
            for (const id of initialChain) {
                const block = availableBlocks.find(b => b.id === id);

                if (typeof block === "undefined")
                    throw Error(`Can't find block ID: ${id}`);

                // Avoid adding block and its inverse immediately next to each other
                const prevBlock = chain.length > 0 ? chain[chain.length - 1] : null;
                if (prevBlock && prevBlock.id === block.inverse) {
                    chain.length--;
                    continue;
                }

                chain.push(block);
            }
        }

        return chain;
    });

    const chainOut = theChain.length === 0 ? "string" : theChain[theChain.length - 1].output;

    let output = null;
    let errorIndex = -1;

    try {
        /** @type {string|number[]|Uint8Array} */
        // @ts-ignore
        output = performTheChain(theChain, input).slice(0, 0x1000);
    }
    catch (e) {
        if (e instanceof TheChainError) {
            errorIndex = e.errorIndex;
            console.log(e.message);
            output = performTheChain(theChain.slice(0, errorIndex), input).slice(0, 0x1000);
        }
        else {
            throw e;
        }
    }

    return (
        <div style={{width:"100%"}}>
            <ol className={styles.TheChain}>
                <li className={`${styles.link} ${styles.string}`}>Input</li>
            {
                theChain.map((link, i) => {
                    const isLast = i === theChain.length - 1;

                    const onClick = isLast ?
                        () => {
                            setTheChain(theChain => theChain.slice(0, -1));
                        } :
                        void 0;

                    const className = [
                        styles.link,
                        styles[link.output],
                        i === errorIndex ? styles.error : "",
                        errorIndex >= 0 && i > errorIndex ? styles.unused : ""
                    ].join(" ");

                    return (
                        <li
                            key={i}
                            className={className}
                            onClick={onClick}
                        >
                            {link.label}
                        </li>
                    );
                })
            }
            </ol>
            {
                errorIndex >= 0 ?
                <h2 className={styles["TheChainPage-Error"]}>Broken Chain</h2> :
                <h2>Output:</h2>
            }
            <NodeViewer node={output} />
            {
                errorIndex >= 0 &&
                    <p className={styles.hint}>(Value before break)</p>
            }
            <div>
                <h2>Add Link</h2>
                <h3><div className={`${styles.linkPreview} ${styles.string}`} /> From String</h3>
                <BlockAdder onAdd={block => setTheChain([...theChain, block])} blocks={availableBlocks.filter(b => b.input === "string")} chainOut={chainOut} />
                <h3><div className={`${styles.linkPreview} ${styles.codepoints}`} /> From Code Points</h3>
                <BlockAdder onAdd={block => setTheChain([...theChain, block])} blocks={availableBlocks.filter(b => b.input === "codepoints")} chainOut={chainOut} />
                <h3><div className={`${styles.linkPreview} ${styles.bytes}`} /> From Bytes</h3>
                <BlockAdder onAdd={block => setTheChain([...theChain, block])} blocks={availableBlocks.filter(b => b.input === "bytes")} chainOut={chainOut} />
            </div>
        </div>
    );
}

function BlockAdder({ onAdd, blocks, chainOut }) {
    return blocks.map((block, i) => {
        return (
            <button
                key={i}
                onClick={() => onAdd(block)}
                disabled={chainOut ? (chainOut !== block.input) : false}
                className={styles[`TheChainPage-Button--${block.output}`]}
            >
                {block.label}
            </button>
        );
    });
}

/**
 *
 * @param {Block[]} theChain
 * @param {string} input
 * @returns {string|number[]|Uint8Array}
 */
function performTheChain(theChain, input) {
    let lastIndex = -1;

    try {
        // @ts-ignore
        return theChain.reduce((/** @type {string|number|Uint8Array} */prev, block, index) => {
            lastIndex = index;
            // @ts-ignore
            return block.convert(prev);
        }, input);
    }
    catch (e) {
        throw new TheChainError(lastIndex, e.message);
    }
}

