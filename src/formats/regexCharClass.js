
const HYPHEN_CODE_POINT = /** @type {number} */("-".codePointAt(0));

/** @type {import('.').Format} */
export const regexCharClass = {
    label: "Regex Character Class",
    isValid(value) {
        try {
            const codepoints = this.parse(value);
            return codepoints.every(x => x >= 0 && x < 0x110000);
        } catch (e) {
            return false;
        }
    },
    parse (value) {
        if (value.length === 0) {
            return [];
        }

        const replacedValue = value
            .replace(/\\u([0-9A-F]{4})/gi, (_,cp) => String.fromCharCode(parseInt(cp, 16)))
            .replace(/\\u{([0-9A-F]+)}/gi, (_,cp) => String.fromCodePoint(parseInt(cp, 16)));

        const parts = replacedValue.split("-");

        /**
         * @type {number[][]}
         */
        return parts
            .map(part => [...part].map(c => c.charCodeAt(0)))
            .map((currList, i, array) => {
                if (i === 0) {
                    if (currList.length === 0) {
                        return [HYPHEN_CODE_POINT];
                    }
                    return currList;
                }

                // Probably the last item (but could be two `--` in a row)
                if (currList.length === 0) {
                    return [HYPHEN_CODE_POINT];
                }

                const prevList = array[i-1];

                if (prevList.length === 0) {
                    return currList;
                }

                const prevLast = prevList.at(-1);
                const currFirst = currList.at(0);

                if (typeof prevLast === "number" && typeof currFirst === "number") {
                    return [ ...range(prevLast + 1, currFirst), ...currList ];
                }

                console.debug("I don't know why we're here.");
                console.debug(parts);
                return [];
            })
            .flat();
    },
    fromCodePoint (...codePoints) {
        return codePoints.map(codePoint => (codePoint >= 0x20 && codePoint < 0x80) ?
            // Printable ASCII as-is
            String.fromCodePoint(codePoint)
            :
            // Everything else escaped
            (codePoint < 0xffff ? "\\u" + codePoint.toString(16).padStart(4, "0") : `\\u{${codePoint.toString(16)}}`)
        ).join("");
    }
};

/**
 * @param {number} start
 * @param {number} end
 */
function range (start, end) {
    const length = end - start;
    return Array.from({ length }).map((_, i) => i + start);
}