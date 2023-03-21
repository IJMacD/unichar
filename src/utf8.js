import utf8 from "utf8";

/**
 * Code Points to UTF-8 bytes
 * @param {number[]} codePoints
 */
export function getUTF8Bytes (codePoints) {
    return new Uint8Array([...utf8.encode(String.fromCodePoint(...codePoints))].map(c => c.charCodeAt(0)));
}

/**
 * UTF-8 bytes to string
 * @param {Uint8Array} bytes
 */
export function parseUTF8Bytes (bytes) {
    return utf8.decode(String.fromCharCode(...bytes));
}

/**
 * Not specific to UTF-8
 * @param {string} string
 */
export function stringToCodePoints (string) {
    return [...string].map(c => c.codePointAt(0)||0);
}