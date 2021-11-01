import u from 'utf8';
import he from 'he';

const taiwanTelegraphMapping = require('./data/TaiwanTelegraph.json');
const mainlandTelegraphMapping = require('./data/MainlandTelegraph.json');

const TAIWAN_MAX_CODE = 9798;
const MAINLAND_MAX_CODE = 9694;

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
            codepoints.push(cp);
            if (cp > 0xffff) {
                i++;
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
    isValid: () => true,
    parse (value) {
        return [...decodeURIComponent(String(value))].map(c => c.charCodeAt(0));
    },
    fromCodePoint (...codePoints) {
        return codePoints.map(codePoint =>
            (codePoint >= 0x20 && codePoint < 0x80) ?
                // Printable ASCII as-is
                String.fromCodePoint(codePoint)
                :
                // Everything else escaped
                [...u.encode(String.fromCodePoint(codePoint))].map(c => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join("")
        ).join("");
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
export const decimal = {
    label: "Code Point List (Decimal)",
    isValid (value) {
        if (value.length === 0) {
            return true;
        }

        if (value.match(/[^\d ]/)) {
            return false;
        }

        try {
            const codepoints = decimal.parse(value);
            return codepoints.every(x => x >= 0 && x < 0x110000);
        } catch (e) {
            return false;
        }
    },
    parse (value) {
        const raw = value.replace(/[^\d ]/g, "").trim().replace(/ +/g, " ");

        if (raw.length === 0) {
            return [];
        }

        const codepoints = raw.split(" ").map(x => parseInt(x, 10));

        return codepoints;
    },
    fromCodePoint (...codePoints) {
        return codePoints.map(cp => cp.toString(10)).join(" ");
    }
};

/** @type {Format} */
export const hex = {
    label: "Code Point List (Hexidecimal)",
    isValid (value) {
        if (value.length === 0) {
            return true;
        }

        if (value.match(/[^a-f\d\sU+-]/i)) {
            return false;
        }

        try {
            const codepoints = hex.parse(value);
            return codepoints.every(x => x >= 0 && x < 0x110000);
        } catch (e) {
            return false;
        }
    },
    parse (value) {
        const raw = value.replace(/[^\da-f\sU+-]/gi, "").trim().replace(/[,\s]+/g, " ");

        if (raw.length === 0) {
            return [];
        }

        const expanded = raw.replace(/([\da-f]+)-([\da-f]+)/gi, (s, a, b) => {
            const start = parseInt(a, 16);
            const end = parseInt(b, 16);

            if (start >= end) {
                throw RangeError(`Start must be less than end: ${start} < ${end}`);
            }

            if (end - start >= 0x1000) {
                throw RangeError(`Too many code points: ${end - start}`);
            }

            return Array(end - start + 1).fill(0).map((x,i) => (i + start).toString(16)).join(" ");
        }).split(" ");

        const codepoints = expanded.map(p => p.replace(/^U\+/, "")).map(x => parseInt(x, 16));

        return codepoints;
    },
    fromCodePoint (...codePoints) {
        return codePoints.map(cp => cp.toString(16)).join(" ");
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

            const codepoints = [...string].map(x => x.codePointAt(0));

            return codepoints;
        } catch (e) {
            return [];
        }
    },
    fromCodePoint (codePoints) {
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

            const codepoints = [...string].map(x => x.codePointAt(0));

            return codepoints;
        } catch (e) {
            return [];
        }
    },
    fromCodePoint (...codePoints) {
        const bytes = u.encode(String.fromCodePoint(...codePoints));
        return [...bytes].map(b => b.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
    }
}

/** @type {Format} */
export const taiwanTelegraph = {
    label: "Chinese Telegraph Code (Traditional)",
    isValid (value) {
        if (value.length === 0) {
            return true;
        }

        if (/[^\d\s]/.test(value)) {
            return false;
        }

        return value.trim().split(" ").map(v => parseInt(v, 10)).every(n => n >= 0 && n <= TAIWAN_MAX_CODE);
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

/** @type {Format} */
export const mainlandTelegraph = {
    label: "Chinese Telegraph Code (Simplified)",
    isValid (value) {
        if (value.length === 0) {
            return true;
        }

        if (/[^\d\s]/.test(value)) {
            return false;
        }

        return value.trim().split(" ").map(v => parseInt(v, 10)).every(n => n >= 0 && n <= MAINLAND_MAX_CODE);
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

const flatten = arr => [].concat(...arr);