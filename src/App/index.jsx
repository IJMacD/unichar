import React, { Component } from 'react';

import * as formats from '../formats';
import { StringOutput, CodePoints, UTF8Bytes, UTF8Binary, EncodedOutput } from '../output';
import UCDSearch from '../UCDSearch';

import classes from './style.module.css';

const TITLE = "Unichar";

export default class App extends Component {
  constructor (props) {
    super(props);

    this.state = getHash();
  }

  onChange = (e) => {
    this.setValue(e.target.value);
  }

  setValue (value, format=this.state.format) {
    this.setState({ value, format }, () => {
      window.location.hash = `${format}:${value}`;

      const ii = formats[this.state.format]
      if(ii.isValid(value)) {
        document.title = `${TITLE} - ${String.fromCodePoint(...ii.parse(value))}`;
      }
    });
  }

  async componentDidMount () {
    window.addEventListener("hashchange", () => {
      this.setState(getHash());
    });

    this.inputRef.focus();
  }

  /**
   * @param {number} codePoint
   */
  insertCodePoint (codePoint) {
    let { value, format }  = this.state;

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

    this.setValue(value);
  }

  render () {
    const { value, format } = this.state;

    if (!(format in formats)) {
      return <p>Error: Bad input method chosen</p>;
    }

    /** @type {import('../formats').Format} */
    const formatter = formats[format]

    const isValid = formatter.isValid(value);

    let codepoints = isValid ? formatter.parse(value) : [];

    return (
      <div className={classes.container}>
        <input
          type="text"
          value={value}
          onChange={this.onChange}
          className={classes.input}
          style={{border: isValid ? "" : "1px solid #f33"}}
          ref={ref => this.inputRef = ref}
        />
        <UCDSearch onChoose={cp => this.insertCodePoint(cp)} />
        <div className={classes.inOutContainer}>
          <div className={classes.inputContainer}>
            <h2 className={classes.sectionHeader}>Input Interpretation</h2>
            <ul className={classes.inputList}>
              {
                Object.keys(formats).map(key => {
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
                    return "Error decoding value";
                  }
                })
              }
            </ul>
          </div>
          <div className={classes.outputContainer}>
            <h2 className={classes.sectionHeader}>Code Points</h2>
            { isValid &&
              <CodePoints codepoints={codepoints} onSelect={format === "hex" ? null : (value) => this.setValue(value.toUpperCase(), "hex")} />
            }
          </div>
          <div className={classes.outputContainer}>
            <h2 className={classes.sectionHeader}>Output</h2>
            { isValid &&
              <ul className={classes.output}>
                <li><StringOutput codepoints={codepoints} onSelect={format === "raw" ? null : (value) => this.setValue(value, "raw")} /></li>
                <li><UTF8Bytes codepoints={codepoints} onSelect={format === "utf8" ? null : (value) => this.setValue(value, "utf8")} /></li>
                <li><UTF8Binary codepoints={codepoints} onSelect={format === "binary" ? null : (value) => this.setValue(value, "binary")} /></li>
                <li><EncodedOutput codepoints={codepoints} onSelect={format === "encoded" ? null : (value) => this.setValue(value, "encoded")} /></li>
              </ul>
            }
          </div>
        </div>
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

  const inputMatch = /^([a-z0-9]+):/.exec(value);

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