import u from 'utf8';
import he from 'he';

export { windows1252, windows1252Hex } from './windows1252';
export { mainlandTelegraph, taiwanTelegraph } from './chineseTelegraph';
export { big5 } from './big5';
export { base64Utf8 } from "./base64Utf8";
export { hex } from "./hex";
export { decimal } from "./decimal";
export { escaped } from "./escaped";
export { regexCharClass } from "./regexCharClass";

/**
 * @typedef Format
 * @prop {string} label
 * @prop {(value: string) => boolean} isValid
 * @prop {(value: string) => number[]} parse
 * @prop {(...codePoints: number[]) => string} fromCodePoint
 */

/** @type {Format} */
export const raw = {
    label: "Raw Characters",
    isValid: () => true,
    parse (value) {
        const raw = String(value);

        const codepoints = [];

        for (let i = 0; i < raw.length; i++) {
            const cp = raw.codePointAt(i);
            if (cp) {
                codepoints.push(cp);
                if (cp > 0xffff) {
                    i++;
                }
            }
        }

        return codepoints;
    },
    fromCodePoint (...codePoints) {
        return String.fromCodePoint(...codePoints);
    }
};

/** @type {Format} */
export const encoded = {
    label: "HTML Encoded",
    isValid: () => true,
    parse (value) {
        return raw.parse(he.decode(String(value)));
    },
    fromCodePoint (...codePoints) {
        return he.encode(String.fromCodePoint(...codePoints));
    }
};

/** @type {Format} */
export const urlEncoded = {
    label: "URL Encoded",
    isValid: (value) => {
        try {
            [...decodeURIComponent(String(value))].map(c => c.codePointAt(0));
            return true;
        } catch (e) {
            return false;
        }
    },
    parse (value) {
        try {
            return [...decodeURIComponent(String(value))].map(c => c.codePointAt(0)||0);
        } catch (e) {
            return [];
        }
    },
    fromCodePoint (...codePoints) {
        try {
            return encodeURIComponent(String.fromCodePoint(...codePoints));
        } catch (e) {
            return "";
        }
    }
};

/** @type {Format} */
export const utf8 = {
    label: "UTF-8 Bytes",
    isValid (value) {
        value = value.replace(/\\x/g, "");
        if (!/^[\da-f ,]*$/i.test(value)) {
            return false;
        }

        try {
            const raw = String(value).replace(/[ ,]/g, "");
            if (raw.length % 2) {
                return false;
            }

            const bytes = [];

            for (let i = 0; i < raw.length; i += 2) {
                bytes.push(parseInt(raw.substr(i,2), 16));
            }

            const byteString = String.fromCharCode(...bytes);
            u.decode(byteString);

            return true;
        } catch (e) {
            return false;
        }
    },
    parse (value) {
        const raw = String(value).replace(/\\x/g, "").replace(/ /g, "");
        if (raw.length % 2) {
            return [];
        }

        const bytes = [];

        for (let i = 0; i < raw.length; i += 2) {
            bytes.push(parseInt(raw.substr(i,2), 16));
        }

        const byteString = bytes.map(x => String.fromCharCode(x)).join("");

        try {
            const string = u.decode(byteString);

            const codepoints = [...string].map(x => x.codePointAt(0)||0);

            return codepoints;
        } catch (e) {
            return [];
        }
    },
    fromCodePoint (...codePoints) {
        return [...u.encode(String.fromCodePoint(...codePoints))].map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join(" ");
    }
};

/** @type {Format} */
export const binary = {
    label: "UTF-8 (Binary)",
    isValid (value) {
        if (value.length === 0) {
            return true;
        }

        if (/[^01 ]/.test(value)) {
            return false;
        }

        const bytes = value.split(" ").map(v => parseInt(v, 2));

        const byteString = bytes.map(x => String.fromCharCode(x)).join("");

        try {
            u.decode(byteString);

            return true;
        } catch (e) {
            return false;
        }
    },
    parse (value) {
        if (value.trim().length === 0) {
            return [];
        }

        const bytes = value.trim().split(" ").map(v => parseInt(v, 2));

        const byteString = bytes.map(x => String.fromCharCode(x)).join("");

        try {
            const string = u.decode(byteString);

            const codepoints = [...string].map(x => x.codePointAt(0)||0);

            return codepoints;
        } catch (e) {
            return [];
        }
    },
    fromCodePoint (...codePoints) {
        try {
            const bytes = u.encode(String.fromCodePoint(...codePoints));
            return [...bytes].map(b => b.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
        } catch (e) {
            return "";
        }
    }
}
