
import taiwanTelegraphMapping from '../data/TaiwanTelegraph.json';
import mainlandTelegraphMapping from '../data/MainlandTelegraph.json';

const TAIWAN_MAX_CODE = 9798;
const MAINLAND_MAX_CODE = 9694;


/** @type {import('.').Format} */
export const taiwanTelegraph = {
    label: "Chinese Telegraph Code (Traditional)",
    isValid (value) {
        if (value.length === 0) {
            return true;
        }

        if (/[^\d\s]/.test(value)) {
            return false;
        }

        return value.trim().split(" ").map(v => parseInt(v, 10)).every(n => n >= 0 && n <= TAIWAN_MAX_CODE && taiwanTelegraphMapping[n]);
    },
    parse (value) {
        if (value.trim().length === 0) {
            return [];
        }

        return value.trim().split(" ").map(v => taiwanTelegraphMapping[parseInt(v, 10)]);
    },
    fromCodePoint (...codePoints) {
        return "";
    }
}

/** @type {import('.').Format} */
export const mainlandTelegraph = {
    label: "Chinese Telegraph Code (Simplified)",
    isValid (value) {
        if (value.length === 0) {
            return true;
        }

        if (/[^\d\s]/.test(value)) {
            return false;
        }

        return value.trim().split(" ").map(v => parseInt(v, 10)).every(n => n >= 0 && n <= MAINLAND_MAX_CODE && mainlandTelegraphMapping[n]);
    },
    parse (value) {
        if (value.trim().length === 0) {
            return [];
        }

        return value.trim().split(" ").map(v => mainlandTelegraphMapping[parseInt(v, 10)]);
    },
    fromCodePoint (...codePoints) {
        return "";
    }
}