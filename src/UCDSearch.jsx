import React, { useState } from 'react';
import { useUCD } from './useUCD';
import "./UCDSearch.css";

/**
 *
 * @param {object} props
 * @param {(codePoint: number) => void} props.onChoose
 * @returns
 */
export default function UCDSearch ({ onChoose }) {
    const [ value, setValue ] = useState("");
    const ucd = useUCD();

    if (!ucd) return null;

    const results = value.length >= 3 ? searchUCD(ucd, value) : [];

    return (
        <div className="UCDSearch">
            <input type="search" value={value} onChange={e => setValue(e.target.value)} placeholder="Search" />
            <ul className="UCDSearch-list" style={{zIndex: 2}}>
                { results.map(r => (
                    <li key={r.codePoint} onClick={() => { setValue(""); onChoose(r.codePoint); }}>{r.name} {String.fromCodePoint(r.codePoint)}</li>
                )) }
                { results.length > 0 && <li className="UCDSearch-LinkItem" onClick={() => { setValue(""); results.forEach(r => onChoose(r.codePoint)); }}>All</li> }
            </ul>
        </div>
    )
}

/**
 *
 * @param {{ getName: (name: string) => string; characterNameList: string[] }} ucd
 * @param {string} value
 * @param {number} limit
 */
function searchUCD (ucd, value, limit=100) {
    const out = [];
    const found = [];

    if (!ucd) {
        return [];
    }

    if (!ucd.characterNameList) {
        // prime unicode data
        ucd.getName("a");
    }

    try {
        const reg = new RegExp(value, "i");

        for (let i = 0; i < ucd.characterNameList.length && out.length < limit; i++) {
            const name = ucd.characterNameList[i];
            if (name && reg.test(name)) {
                out.push({ codePoint: i, name });
                found.push(i);
            }
        }
    }
    catch (e) {}

    if (out.length < limit && value.includes(" ")) {
        const searchParts = value.toUpperCase().split(" ");

        for (let i = 0; i < ucd.characterNameList.length && out.length < limit; i++) {
            const name = ucd.characterNameList[i];
            if (name && searchParts.every(s => name.includes(s)) && !found.includes(i)) {
                out.push({ codePoint: i, name });
            }
        }
    }

    return out;
}