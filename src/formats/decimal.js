/** @type {import(".").Format} */

export const decimal = {
    label: "Code Point List (Decimal)",
    isValid(value) {
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
    parse(value) {
        if (value.match(/[^\d ]/)) {
            throw Error("Invalid decimal list");
        }

        const raw = value.replace(/[^\d ]/g, "").trim().replace(/ +/g, " ");

        if (raw.length === 0) {
            return [];
        }

        const codepoints = raw.split(" ").map(x => parseInt(x, 10));

        return codepoints;
    },
    fromCodePoint(...codePoints) {
        return codePoints.map(cp => cp.toString(10)).join(" ");
    }
};
