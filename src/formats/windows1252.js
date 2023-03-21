import utf8 from 'utf8';

// Example corruption: CafÃ©
// See also: https://en.wikipedia.org/wiki/Mojibake

// Undefined Windows-1252 bytes are replaced with the Unicode characters at that codepoint to aid conversion (e.g. 0x81, 0x8D, 0x8f, etc.)
const UPPER_HALF = "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ";

/** @type {import('.').Format&{parseBytes:(value: string)=>number[]}} */
export const windows1252 = {
    label: "UTF-8 (As Windows-1252)",
    isValid: (value) => {
        if (value.length === 0) return true;

        try {
        const bytes = windows1252.parseBytes(value);

        const byteString = bytes.map(x => String.fromCharCode(x)).join("");

            utf8.decode(byteString);

            return true;
        } catch (e) {
            return false;
        }
    },
    parse (value) {
        if (value.length === 0) return [];

        let bytes = windows1252.parseBytes(value);

        const byteString = bytes.map(x => String.fromCharCode(x)).join("");

        try {
            const string = utf8.decode(byteString);

            const codepoints = [...string].map(x => x.codePointAt(0));

            return codepoints;
        } catch (e) {
            return [];
        }
    },
    parseBytes (value) {
        return [...value].map(c => {
            if (c.charCodeAt(0) < 0x80) return c.charCodeAt(0);
            const index = UPPER_HALF.indexOf(c);
            if (index < 0) throw Error(`Invalid Windows-1252 character: '${c}'`);
            return 0x80 + index;
        });
    },
    fromCodePoint (...bytes) {
        return bytes.map(b => {
            if (b < 0x80) return String.fromCodePoint(b);
            if (b < 0x100) return UPPER_HALF[b - 0x80];
            throw Error(`Windows-1252: Invalid byte value <${b.toString(16)}>`);
        }).join("");
    }
};

/** @type {import('.').Format} */
export const windows1252Hex = {
    label: "Windows-1252 (Hexidecimal values)",
    isValid: (value) => {
        if (value.length === 0) return true;
        return value.trim().split(" ").every(v => /^[a-f0-9]+$/i.test(v) && parseInt(v, 16) < 0x100);
    },
    parse (value) {
        if (value.length === 0) return [];

        const values = value.trim().split(" ").map(v => parseInt(v, 16));

        return values.map(v => v < 0x80 ? v : UPPER_HALF.codePointAt(v - 0x80));
    },
    fromCodePoint (...codePoints) {
        return codePoints.map(c => {
            let hex = 0;

            if (c < 0x80) hex = c;
            else {
                const index = UPPER_HALF.indexOf(String.fromCodePoint(c));
                if (index < 0) hex = c; // It's helpful if we just use the Unicode code point
                else hex = 0x80 + index;
            }

            return hex.toString(16).padStart(2, "0");
        }).join(" ");
    }
};