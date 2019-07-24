import React from 'react';

import "./UCDSearch.css";

export default function ({ ucd, onChoose }) {
    const [ value, setValue ] = React.useState("");

    const results = value.length >= 3 ? searchUCD(ucd, value) : [];

    return (
        <div className="UCDSearch">
            <label>Search <input type="search" value={value} onChange={e => setValue(e.target.value)} /></label>
            <ul className="UCDSearch-list">
                { results.map(r => (
                    <li key={r.codePoint} onClick={() => { setValue(""); onChoose(r.codePoint); }}>{r.name}</li>
                )) }
            </ul>
        </div>
    )
}

function searchUCD (ucd, value, limit=20) {
    const out = [];

    const reg = new RegExp(value, "i");

    for (let i = 0; i < ucd.characterNameList.length && out.length < limit; i++) {
        const name = ucd.characterNameList[i];
        if (name && reg.test(name)) {
            out.push({ codePoint: i, name });
        }
    }

    return out;
}