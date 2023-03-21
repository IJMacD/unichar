import u from 'utf8';
import he from 'he';

export { windows1252, windows1252Hex } from './windows1252';
export { mainlandTelegraph, taiwanTelegraph } from './chineseTelegraph';
export { big5 } from './big5';
export { base64Utf8 } from "./base64Utf8";
export { hex } from "./hex";
export { decimal } from "./decimal";

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
export const escaped = {
    label: "Escape Sequences",
    isValid (value) {
        try {
            const codepoints = this.parse(value);
            return codepoints.every(x => x >= 0 && x < 0x110000);
        } catch (e) {
            return false;
        }
    },
    parse (value) {
        /** @type {(string|string[]|number|number[])[]} */
        let rawList = [value];

        const regexes = [
            /\\u{([0-9a-fA-F]+)}/g,
            /\\u([0-9a-fA-F]{4})/g,
            /\\U([0-9a-fA-F]{8})/g,
        ];
        for (const re of regexes) {
            rawList = rawList.map(item => {
                if (typeof item === "string") {
                    const out = [];
                    let match;
                    let pos = 0;
                    while (match = re.exec(item)) {
                        if (match.index > pos) {
                            out.push(item.substring(pos, match.index));
                        }
                        pos = match.index + match[0].length;
                        out.push(parseInt(match[1], 16));
                    }
                    if (pos < item.length) out.push(item.substr(pos));
                    return out;
                }
                return item;
            });
            rawList = flatten(rawList);
        }

        rawList = rawList.map(item => typeof item === "string" ? [...item].map(x => x.codePointAt(0)) : item);

        const codepoints = flatten(rawList);

        return codepoints;
    },
    fromCodePoint (...codePoints) {
        return codePoints.map(codePoint =>
            (codePoint >= 0x20 && codePoint < 0x80) ?
                // Printable ASCII as-is
                String.fromCodePoint(codePoint)
                :
                // Everything else escaped
                (codePoint < 0xffff ? "\\u" + codePoint.toString(16).padStart(4, "0") : `\\u{${codePoint.toString(16)}}`)
        ).join("");
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

const flatten = arr => [].concat(...arr);