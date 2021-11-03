const fs = require("fs");

const data = fs.readFileSync("./res/big5.txt", 'utf-8');

const lines = data.split("\n");

const nextLine = 0;

const out = [];
let current = null;
let prevOffset = 0;

for (const line of lines) {
    if (line.startsWith("code")) {
        continue;
    }

    if (line.length === 0) {
        continue;
    }

    const offset = parseInt(line, 16);

    const chars = getChars(line);

    if (prevOffset + 16 === offset) {
        current.chars += chars;
    } else {
        current = {
            offset,
            chars
        };

        out.push(current);
    }

    prevOffset = offset;
}

fs.writeFileSync("./big5.json", JSON.stringify(out));

console.log(`Written ${out.length} groups`);

/**
 * @param {string} line
 */
function getChars (line) {
    const s = line.substr(6);
    let out = "";

    const o = s.startsWith("  ") ? 1 : 0;

    for (let i = o; i < s.length; i += 2) {
        out += s[i];
    }

    return out;
}