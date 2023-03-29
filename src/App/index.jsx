import React, { Component } from 'react';

import * as formats from '../formats';
import {
  StringOutput,
  UTF8Bytes,
  UTF8Binary,
  EncodedOutput,
  EscapedOutput,
  URLEncodedOutput,
  DecimalOutput,
  Windows1252HexOutput,
  Base64Utf8Output,
} from '../output';
import { CodePoints } from '../output/CodePoints';
import { TheChainPage } from '../TheChainPage';
import UCDSearch from '../UCDSearch';

import classes from './style.module.css';

const TITLE = "Unichar";

export default class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      ...getHash(),
      theChain: false,
      /** @type {number[]|undefined} */
      initialChain: void 0,
    };
  }

  onChange = (e) => {
    this.setValue(e.target.value);
  }

  setValue (value, format=this.state.format) {
    this.setState({ value, format });
  }

  async componentDidMount () {
    window.addEventListener("hashchange", () => {
      this.setState(getHash());
    });

    this.inputRef?.focus();
  }

  /**
   * @param {number} codePoint
   */
  insertCodePoint (codePoint) {
    this.setState(oldState => {
      let { value, format }  = oldState;

      const out = formats[format].fromCodePoint(codePoint);

      if (format === "raw") {
        value += out;
      } else if (format === "hex") {
        value += " " + out;
      } else if (format === "decimal") {
        value += " " + out;
      } else if (format === "utf8") {
        value += " " + out;
      } else if (format === "encoded") {
        value += out;
      } else if (format === "escaped") {
        value += out;
      }

      return { value };
    });
  }

  componentDidUpdate () {
    const { value, format } = this.state;

    window.location.hash = `${format}:${encodeURIComponent(value)}`;

    if (format in formats) {
      const ii = formats[format];
      try {
        if(ii.isValid(value)) {
          document.title = `${TITLE} - ${String.fromCodePoint(...ii.parse(value))}`;
        }
      } catch (e) {}
    }
  }

  /**
   * @param {number[]} initialChain
   */
  setChain (initialChain) {
    this.setState({ theChain: true, initialChain });
  }

  render () {
    let { value, format, theChain, initialChain } = this.state;

    if (!(format in formats)) {
      format = "raw";
    }

    /** @type {import('../formats').Format} */
    const formatter = formats[format]

    const isValid = formatter.isValid(value);

    let codepoints = [];

    try {
      codepoints = isValid ? formatter.parse(value) : [];
    }
    catch (e) {}

    // Re-order so "raw" is at start
    const inputFormatList = [ "raw", ...Object.keys(formats).filter(key => key !== "raw") ];

    const chain = getChainStart(format);

    return (
      <div className={classes.container}>
        <input
          type="text"
          value={value}
          onChange={this.onChange}
          className={classes.input}
          style={{border: (theChain || isValid) ? "" : "1px solid #f33"}}
          ref={ref => this.inputRef = ref}
        />
        <UCDSearch onChoose={(/** @type {number} */ cp) => this.insertCodePoint(cp)} />
        {
          theChain ?
          <div>
            <button onClick={() => this.setState({theChain:false})}>Stop the Chain</button>
            <TheChainPage input={value} initialChain={initialChain} />
          </div> :
          <div className={classes.inOutContainer}>
            <div className={classes.inputContainer}>
              <h2 className={classes.sectionHeader}>Input Interpretation</h2>
              <ul className={classes.inputList}>
                {
                  inputFormatList.map(key => {
                    try {
                      let classNames = classes.inputChoice;
                      /** @type {import('../formats').Format} */
                      const ij = formats[key];
                      const isValid = ij.isValid(value);

                      if (!isValid) {
                        classNames += " " + classes.invalidInput;
                      }

                      if (key === format) {
                        classNames += " " + classes.selectedInput;
                      }

                      return (
                        <li
                          key={key}
                          className={classNames}
                          onClick={isValid ? (() => this.setValue(value, key)) : undefined}
                        >
                          {ij.label}
                          { isValid && <p>{String.fromCodePoint(...ij.parse(value))}</p> }
                        </li>
                      );
                    } catch (e) {
                      console.debug(e);
                      return "Error decoding value";
                    }
                  })
                }
              </ul>
            </div>
            <div className={classes.outputContainer} style={{flex:1}}>
              <h2 className={classes.sectionHeader}>Code Points</h2>
              { isValid &&
                <CodePoints codepoints={codepoints} onSelect={format === "hex" ? void 0 : (value) => this.setValue(value.toUpperCase(), "hex")} />
              }
            </div>
            <div className={classes.outputContainer}>
              <h2 className={classes.sectionHeader}>Output</h2>
              { isValid &&
                <ul className={classes.output}>
                  <li><StringOutput codepoints={codepoints} onSelect={format === "raw" ? void 0 : (value) => this.setValue(value, "raw")} onChain={chain?() => this.setChain([...chain, 0x2100]):void 0} /></li>
                  <li><UTF8Bytes codepoints={codepoints} onSelect={format === "utf8" ? void 0 : (value) => this.setValue(value, "utf8")} onChain={chain?() => this.setChain([...chain, 0x2300]):void 0} /></li>
                  <li><UTF8Binary codepoints={codepoints} onSelect={format === "binary" ? void 0 : (value) => this.setValue(value, "binary")} /></li>
                  <li><DecimalOutput codepoints={codepoints} onSelect={format === "decimal" ? void 0 : (value) => this.setValue(value, "decimal")} onChain={chain?() => this.setChain([...chain, 0x210A]):void 0} /></li>
                  <li><EncodedOutput codepoints={codepoints} onSelect={format === "encoded" ? void 0 : (value) => this.setValue(value, "encoded")} /></li>
                  <li><URLEncodedOutput codepoints={codepoints} onSelect={format === "urlEncoded" ? void 0 : (value) => this.setValue(value, "urlEncoded")} onChain={chain?() => this.setChain([...chain, 0x2300, 0x3107]):void 0} /></li>
                  <li><EscapedOutput codepoints={codepoints} onSelect={format === "escaped" ? void 0 : (value) => this.setValue(value, "escaped")} /></li>
                  <li><Windows1252HexOutput codepoints={codepoints} onSelect={format === "windows1252Hex" ? void 0 : (value) => this.setValue(value, "windows1252Hex")}  /></li>
                  <li><Base64Utf8Output codepoints={codepoints} onSelect={format === "base64Utf8" ? void 0 : (value) => this.setValue(value, "base64utf8")} onChain={chain?() => this.setChain([...chain, 0x2300, 0x3104]):void 0} /></li>
                </ul>
              }
            </div>
          </div>
        }
      </div>
    );
  }
}

function getHash () {
  const { hash } = window.location;

  if (!hash) {
    return {
      value: "",
      format: "raw"
    };
  }

  const value = decodeURIComponent(hash.substr(1));

  const inputMatch = /^([a-z0-9]+):/i.exec(value);

  if (inputMatch) {
    return {
      format: inputMatch[1],
      value: value.substr(inputMatch[0].length),
    };
  } else {
    return {
      value,
      format: "raw",
    };
  }
}

/**
 * @param {string} format
 */
function getChainStart (format) {
  switch (format) {
    case "raw": return [0x1200];
    case "base64Utf8": return [0x1304,0x3200];
    case "big5": return null;
    case "binary": return null;
    case "decimal": return [0x120A];
    case "encoded": return null;
    case "escaped": return [0x120B];
    case "hex": return [0x1201];
    case "mainlandTelegraph": return null;
    case "taiwanTelegraph": return null;
    case "urlEncoded": return [0x1307,0x3200];
    case "utf8": return [0x1306,0x3200];
    case "windows1252": return [0x1312,0x3200];
    case "windows1252Hex": return [0x1306,0x3112,0x1200];
    default: return null;
  }
}