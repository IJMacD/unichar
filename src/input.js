import u from 'utf8';
import he from 'he';

/**
 * @typedef Interpreter
 * @prop {string} label
 * @prop {(s: string) => boolean} isValid
 * @prop {(s: string) => number[]} parse
 */

/** @type {Interpreter} */
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
};

/** @type {Interpreter} */
export const encoded = {
    label: "Encoded String",
    isValid: () => true,
    parse (value) {
        return raw.parse(he.decode(value));
    },
};

/** @type {Interpreter} */
export const decimal = {
    label: "Code Point List (Decimal)",
    isValid (value) {
        if(!/^[\d ]*$/.test(value)) {
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
        const raw = String(value).trim().replace(/ +/g, " ").split(" ");
      
        const codepoints = raw.map(x => parseInt(x, 10));
      
        return codepoints;
    },
};

/** @type {Interpreter} */
export const hex = {
    label: "Code Point List (Hexidecimal)",
    isValid (value) {
        if (!/^ *((U\+)?[\da-f-]+,? *)*$/i.test(value)) {
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
        const raw = String(value).trim().replace(/[,\s]+/g, " ");

        const expanded = raw.replace(/([\da-f]+)-([\da-f]+)/g, (s, a, b) => {
            const start = parseInt(a, 16);
            const end = parseInt(b, 16);

            if (start >= end) {
                throw RangeError(`Start must be less than end: ${start} < ${end}`);
            }

            return Array(end - start + 1).fill(0).map((x,i) => (i + start).toString(16)).join(" ");
        }).split(" ");
      
        const codepoints = expanded.map(p => p.replace(/^U\+/, "")).map(x => parseInt(x, 16));
      
        return codepoints;
    },
};

/** @type {Interpreter} */
export const utf8 = {
    label: "UTF-8 Bytes",
    isValid (value) {
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
        const raw = String(value).replace(/ /g, "");
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
    }
};