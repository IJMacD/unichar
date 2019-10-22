import React, { Component } from 'react';

import * as input from '../input';
import { StringOutput, CodePoints, UTF8Bytes, UTF8Binary, EncodedOutput } from '../output';
import UCDSearch from '../UCDSearch';

import classes from './style.module.css';

const TITLE = "Unichar";

export default class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      value: getHash() || "",
      inputInterpretation: "raw",
      ucd: null,
    };

  }

  onChange = (e) => {
    this.setValue(e.target.value);
  }

  setValue (value, inputInterpretation=this.state.inputInterpretation) {
    this.setState({ value, inputInterpretation }, () => {
      window.location.hash = value;

      const ii = input[this.state.inputInterpretation]
      if(ii.isValid(value)) {
        document.title = `${TITLE} - ${String.fromCodePoint(...ii.parse(value))}`;
      }
    });
  }

  async componentDidMount () {
    window.addEventListener("hashchange", () => {
      const value = getHash();
      if (value !== this.state.value) {
        const isCodePoint = /^U\+[0-9a-f]+/i.test(value);
        const inputInterpretation = isCodePoint ? "hex" : "raw";
        this.setState({ value, inputInterpretation });
      }
    });

    this.inputRef.focus();

    const { default: ucd } = await import('ijmacd.ucd');

    // prime unicode data
    ucd.getName("a");

    this.setState({ ucd });
  }

  render () {
    const { value, inputInterpretation, ucd } = this.state;

    if (!(inputInterpretation in input)) {
      return <p>Error: Bad input method chosen</p>;
    }

    /** @type {import('../input').Interpreter} */
    const ii = input[inputInterpretation]

    const isValid = ii.isValid(value);

    let codepoints = isValid ? ii.parse(value) : [];

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
        { ucd && <UCDSearch ucd={ucd} onChoose={cp => this.setState({ value: value + String.fromCodePoint(cp) })} /> }
        <div className={classes.inOutContainer}>
          <div className={classes.inputContainer}>
            <h2 className={classes.sectionHeader}>Input Interpretation</h2>
            <ul className={classes.inputList}>
              {
                Object.keys(input).map(key => {
                  try {
                    let classNames = classes.inputChoice;
                    /** @type {import('../input').Interpreter} */
                    const ij = input[key];
                    const isValid = ij.isValid(value);

                    if (!isValid) {
                      classNames += " " + classes.invalidInput;
                    }

                    if (key === inputInterpretation) {
                      classNames += " " + classes.selectedInput;
                    }

                    return (
                      <li
                        key={key}
                        className={classNames}
                        onClick={isValid ? (() => this.setState({ inputInterpretation: key })) : undefined}
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
            <h2 className={classes.sectionHeader}>Output</h2>
            { isValid &&
              <ul className={classes.output}>
                <li><StringOutput codepoints={codepoints} onSelect={inputInterpretation === "raw" ? false : (value) => this.setValue(value, "raw")} /></li>
                <li><CodePoints codepoints={codepoints} ucd={ucd} onSelect={inputInterpretation === "hex" ? false : (value) => this.setValue(value.toUpperCase(), "hex")} /></li>
                <li><UTF8Bytes codepoints={codepoints} onSelect={inputInterpretation === "utf8" ? false : (value) => this.setValue(value, "utf8")} /></li>
                <li><UTF8Binary codepoints={codepoints} /></li>
                <li><EncodedOutput codepoints={codepoints} onSelect={inputInterpretation === "encoded" ? false : (value) => this.setValue(value, "encoded")} /></li>
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
    return "";
  }

  return decodeURIComponent(hash.substr(1));
}