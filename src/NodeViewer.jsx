import React from "react";
import { Bytes } from "./output/Bytes";
import { Char } from "./output/Char";
import { useUCD } from "./useUCD";

/**
 *
 * @param {object} props
 * @param {(string|number[]|Uint8Array)?} props.node
 */
export function NodeViewer({ node }) {
    const ucd = useUCD();

    if (typeof node === "string") {
        return <p style={{wordBreak:"break-word"}}>{node}</p>;
    }

    if (node instanceof Uint8Array) {
        return (
            <div style={{ marginRight: 4 }}>
                <Bytes bytes={node} />
            </div>
        );
    }

    if (node) {
        return (
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {node.map((x, i) => <Char value={x} key={i} ucd={ucd||void 0} />)}
            </div>
        );
    }

    return null;
}
