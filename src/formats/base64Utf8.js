import utf8 from 'utf8';

/** @type {import(".").Format} */
export const base64Utf8 = {
    label: "Base64 UTF-8",
    isValid (value) {
        try {
            utf8.decode(atob(value));
            return true;
        } catch (e) {
            return false;
        }
    },
    parse (value) {
        try {
            const string = utf8.decode(atob(value));

            const codepoints = [...string].map(x => x.codePointAt(0)||0);

            return codepoints;
        } catch (e) {
            return [];
        }
    },
    fromCodePoint (...codePoints) {
        try {
            return btoa(utf8.encode(String.fromCodePoint(...codePoints)));
        }
        catch (e) {
            return "";
        }
    }
};