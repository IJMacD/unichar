import data from '../data/big5.json';

/** @type {import('.').Format} */
export const big5 = {
    label: "Big5 (Hexidecimal values)",
    isValid: (value) => {
        if (value.length === 0) return true;
        return value.trim().split(" ").every(v => /^[a-f0-9]+$/i.test(v) && findRange(parseInt(v, 16)));
    },
    parse (value) {
        if (value.length === 0) return [];

        const values = value.trim().split(" ").map(v => parseInt(v, 16));

        return values.map(v => {
            const range = findRange(v);
            const delta = v - range.offset;
            return range.chars[delta].charCodeAt(0);
        });
    },
    fromCodePoint (...codePoints) {
        return "";
    }
};

/**
 * @param {number} hexValue
 */
function findRange (hexValue) {
    for (const range of data) {
        const start = range.offset;
        const end = start + range.chars.length;

        if (start <= hexValue && hexValue < end) {
            return range;
        }
    }

    return null;
}