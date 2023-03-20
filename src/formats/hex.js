/** @type {import(".").Format} */

export const hex = {
    label: "Code Point List (Hexidecimal)",
    isValid(value) {
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
    parse(value) {
        if (/[^\da-f\sU+-]/gi.test(value)) {
            throw Error("Invalid hex string");
        }

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

            return Array(end - start + 1).fill(0).map((x, i) => (i + start).toString(16)).join(" ");
        }).split(" ");

        const codepoints = expanded.map(p => p.replace(/^U\+/, "")).map(x => parseInt(x, 16));

        return codepoints;
    },
    fromCodePoint(...codePoints) {
        return codePoints.map(cp => cp.toString(16)).join(" ");
    }
};
