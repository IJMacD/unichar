import React, { useState } from "react";
import { decimal, hex } from "./formats";
import { NodeViewer } from "./NodeViewer";
import styles from "./TheChain.module.css";
import { TheChainError } from "./TheChainError";
import { getUTF8Bytes, parseUTF8Bytes, stringToCodePoints } from "./utf8";

/**
 * @typedef {StringBlock|CodePointsBlock|BytesBlock} Block
 */
/**
 * @typedef StringBlock
 * @property {string} label
 * @property {string} input
 * @property {"string"} output
 * @property {(input: string|number[]|Uint8Array) => string} convert
 */
/**
 * @typedef CodePointsBlock
 * @property {string} label
 * @property {string} input
 * @property {"codepoints"} output
 * @property {(input: string|number[]|Uint8Array) => number[]} convert
 */
/**
 * @typedef BytesBlock
 * @property {string} label
 * @property {string} input
 * @property {"bytes"} output
 * @property {(input: string|number[]|Uint8Array) => Uint8Array} convert
 */

/**
 * @type {{ [key: string]: { label: string }}}
 */
const availableNodes = {
    raw: { label: "Raw" },
    codepoints: { label: "Code Points" },
    string: { label: "String" },
    bytes: { label: "bytes" },
};

/** @type {Block[]} */
const availableBlocks = [
    { label: "Raw Characters", input: "string", output: "codepoints", convert: (/** @type {string} */input) => [...input].map(s => s.codePointAt(0)||0) },
    { label: "Hex Code Points", input: "string", output: "codepoints", convert: (/** @type {string} */input) => hex.parse(input) },
    { label: "Decimal Code Points", input: "string", output: "codepoints", convert: (/** @type {string} */input) => decimal.parse(input) },
    { label: "Base64", input: "string", output: "bytes", convert: (/** @type {string} */input) => new Uint8Array([...atob(input)].map(c => c.charCodeAt(0))) },
    // { label: "UTF-8", input: "string", output: "bytes", convert: (/** @type {string} */input) => getUTF8Bytes(stringToCodePoints(input)) },

    { label: "UTF-8", input: "codepoints", output: "bytes", convert: (/** @type {number[]} */input) => getUTF8Bytes(input) },
    { label: "UTF-16 LE", input: "codepoints", output: "bytes", convert: (/** @type {number[]} */input) => new Uint8Array(new Uint16Array(String.fromCodePoint(...input).split("").map(c => c.charCodeAt(0))).buffer) },
    { label: "UTF-32", input: "codepoints", output: "bytes", convert: (/** @type {number[]} */input) => new Uint8Array(new Uint32Array(input).buffer) },
    { label: "Code Points to String", input: "codepoints", output: "string", convert: (/** @type {number[]} */input) => String.fromCodePoint(...input) },

    { label: "UTF-8", input: "bytes", output: "codepoints", convert: (/** @type {Uint8Array} */input) => stringToCodePoints(parseUTF8Bytes(input)) },
    { label: "UTF-16 LE", input: "bytes", output: "codepoints", convert: (/** @type {Uint8Array} */input) => stringToCodePoints(String.fromCharCode(...new Uint16Array(input.buffer))) },
    { label: "UTF-32", input: "bytes", output: "codepoints", convert: (/** @type {Uint8Array} */input) => stringToCodePoints(String.fromCodePoint(...new Uint32Array(input.buffer))) },
    // { label: "UTF-16 LE", input: "bytes", output: "string", convert: (/** @type {Uint8Array} */input) => String.fromCharCode(...new Uint16Array(input.buffer)) },
    // { label: "UTF-32", input: "bytes", output: "string", convert: (/** @type {Uint8Array} */input) => String.fromCodePoint(...new Uint32Array(input.buffer)) },
    { label: "Base64", input: "bytes", output: "string", convert: (/** @type {Uint8Array} */input) => btoa(String.fromCharCode(...input)) },
];

/**
 *
 * @param {object} props
 * @param {string} props.input
 * @returns
 */
export function TheChainPage ({ input }) {
    const [ theChain, setTheChain ] = useState(/** @type {Block[]} */([]));

    const chainOut = theChain.length === 0 ? "string" : theChain[theChain.length - 1].output;

    let output = null;
    let errorIndex = -1;

    try {
        /** @type {string|number[]|Uint8Array} */
        // @ts-ignore
        output = performTheChain(theChain, input);
    }
    catch (e) {
        if (e instanceof TheChainError) {
            errorIndex = e.errorIndex;
            console.log(e.message);
            output = performTheChain(theChain.slice(0, errorIndex), input);
        }
        else {
            throw e;
        }
    }

    return (
        <div>
            <ol className={styles.TheChain}>
                <li className={`${styles["TheChain-Link"]} ${styles[`TheChain-Link--string`]}`}>Input</li>
            {
                theChain.map((link, i) => {
                    const isLast = i === theChain.length - 1;

                    const onClick = isLast ?
                        () => {
                            setTheChain(theChain => theChain.slice(0, -1));
                        } :
                        void 0;

                    const className = `${styles["TheChain-Link"]} ${styles[`TheChain-Link--${link.output}`]}`;

                    return (
                        <li
                            key={i}
                            className={className}
                            style={{cursor:isLast?"pointer":void 0,outline:errorIndex===i?"2px solid red":void 0}}
                            onClick={onClick}
                        >
                            {link.label}
                        </li>
                    );
                })
            }
            </ol>
            <h2>Output:</h2>
            {
                errorIndex >= 0 &&
                <p className={styles["TheChainPage-Error"]}>Broken Chain</p>
            }
            <NodeViewer node={output} />
            <div>
                <h2>Blocks</h2>
                <h3>From String</h3>
                <BlockAdder onAdd={block => setTheChain([...theChain, block])} blocks={availableBlocks.filter(b => b.input === "string")} chainOut={chainOut} />
                <h3>From Code Points</h3>
                <BlockAdder onAdd={block => setTheChain([...theChain, block])} blocks={availableBlocks.filter(b => b.input === "codepoints")} chainOut={chainOut} />
                <h3>From Bytes</h3>
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
        return theChain.reduce((prev, block, index) => {
            lastIndex = index;
            return block.convert(prev);
        }, input);
    }
    catch (e) {
        throw new TheChainError(lastIndex);
    }
}

