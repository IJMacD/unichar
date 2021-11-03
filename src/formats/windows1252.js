import utf8 from 'utf8';

const UPPER_HALF = "€ ‚ƒ„…†‡ˆ‰Š‹Œ Ž  ‘’“”•–—˜™š›œ žŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ";

/** @type {import('.').Format} */
export const windows1252 = {
    label: "UTF-8 (As Windows-1252)",
    isValid: (value) => {
        if (value.length === 0) return true;

        const bytes = [...value].map(c => c.charCodeAt(0) < 0x80 ? c.charCodeAt(0) : 0x80 + UPPER_HALF.indexOf(c));

        const byteString = bytes.map(x => String.fromCharCode(x)).join("");

        try {
            utf8.decode(byteString);

            return true;
        } catch (e) {
            return false;
        }
    },
    parse (value) {
        if (value.length === 0) return [];

        const bytes = [...value].map(c => c.charCodeAt(0) < 0x80 ? c.charCodeAt(0) : 0x80 + UPPER_HALF.indexOf(c));

        const byteString = bytes.map(x => String.fromCharCode(x)).join("");

        try {
            const string = utf8.decode(byteString);

            const codepoints = [...string].map(x => x.codePointAt(0));

            return codepoints;
        } catch (e) {
            return [];
        }
    },
    fromCodePoint (...codePoints) {
        return "";
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
        const REPLACEMENT_CHARACTER = 0xFFFD; // �
        return codePoints.map(c => {
            let hex = 0;

            if (c < 0x80) hex = c;
            else {
                const index = UPPER_HALF.indexOf(String.fromCodePoint(c));
                if (index < 0) hex = REPLACEMENT_CHARACTER;
                else hex = 0x80 + index;
            }

            return hex.toString(16).padStart(2, "0");
        }).join(" ");
    }
};