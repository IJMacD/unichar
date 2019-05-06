import React, { Component } from 'react';

import * as input from '../input';
import { StringOutput, CodePoints, UTF8Bytes, UTF8Binary, EncodedOutput } from '../output';

import classes from './style.module.css';

export default class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      value: "A",
      inputInterpretation: "raw",
      ucd: null,
    };

  }

  onChange = (e) => {
    const { value } = e.target;
    this.setState({ value });
  }

  async componentDidMount () {
    const { default: ucd } = await import('ijmacd.ucd');
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

    let codepoints = ii.parse(value);

    return (
      <div className={classes.container}>
        <input
          type="text"
          value={value}
          onChange={this.onChange}
          className={classes.input}
          style={{border: isValid ? "" : "1px solid #f33"}}
        />
        <div className={classes.inOutContainer}>
          <div className={classes.inputContainer}>
            <h2 className={classes.sectionHeader}>Input Interpretation</h2>
            <ul className={classes.inputList}>
              {
                Object.keys(input).map(key => {
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
                })
              }
            </ul>
          </div>
          <div className={classes.outputContainer}>
            <h2 className={classes.sectionHeader}>Output</h2>
            { isValid &&
              <ul className={classes.output}>
                <li><StringOutput codepoints={codepoints} onSelect={inputInterpretation === "raw" ? false : (value) => this.setState({ inputInterpretation: "raw", value })} /></li>
                <li><CodePoints codepoints={codepoints} ucd={ucd} onSelect={inputInterpretation === "hex" ? false : (value) => this.setState({ inputInterpretation: "hex", value: value.toUpperCase() })} /></li>
                <li><UTF8Bytes codepoints={codepoints} onSelect={inputInterpretation === "utf8" ? false : (value) => this.setState({ inputInterpretation: "utf8", value })} /></li>
                <li><UTF8Binary codepoints={codepoints} /></li>
                <li><EncodedOutput codepoints={codepoints} onSelect={inputInterpretation === "encoded" ? false : (value) => this.setState({ inputInterpretation: "encoded", value })} /></li>
              </ul>
            }
          </div>
        </div>
      </div>
    );
  }
}
