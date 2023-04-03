/** @type {import('.').Format} */
export const escaped = {
    label: "Escape Sequences",
    isValid(value) {
        try {
            const codepoints = this.parse(value);
            return codepoints.every(x => x >= 0 && x < 0x110000);
        } catch (e) {
            return false;
        }
    },
    parse(value) {
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
                    if (pos < item.length)
                        out.push(item.substr(pos));
                    return out;
                }
                return item;
            });
            rawList = rawList.flat();
        }

        rawList = rawList.map(item => typeof item === "string" ? [...item].map(x => x.codePointAt(0)) : item);

        const codepoints = rawList.flat();

        return codepoints;
    },
    fromCodePoint(...codePoints) {
        return codePoints.map(codePoint => (codePoint >= 0x20 && codePoint < 0x80) ?
            // Printable ASCII as-is
            String.fromCodePoint(codePoint)
            :
            // Everything else escaped
            (codePoint < 0xffff ? "\\u" + codePoint.toString(16).padStart(4, "0") : `\\u{${codePoint.toString(16)}}`)
        ).join("");
    }
};
