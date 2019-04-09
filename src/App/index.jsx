import React, { Component } from 'react';
import utf8 from 'utf8';

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

  // componentDidMount () {
  //   import('ijmacd.ucd').then(({ default: ucd }) => this.setState({ ucd }));
  // }

  render () {
    const { value, inputInterpretation, ucd } = this.state;

    const isValid = inputValidators[inputInterpretation](value);

    const inputs = {
      "raw": "Raw Characters",
      "decimal": "Code Point List (Decimal)",
      "hex": "Code Point List (Hexidecimal)",
      "utf8": "UTF-8 Bytes",
    };

    if (!(inputInterpretation in inputInterpreters)) {
      return <p>Error: Bad input method chosen</p>;
    }

    let codepoints = inputInterpreters[inputInterpretation](value);

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
                Object.keys(inputs).map(key => {
                  let classNames = classes.inputChoice;
                  const isValid = inputValidators[key](value);

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
                      {inputs[key]}
                      { isValid && <p>{inputInterpreters[key](value).map(cp => String.fromCodePoint(cp)).join("")}</p> }
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
                <li><CodePoints codepoints={codepoints} ucd={ucd} onSelect={inputInterpretation === "hex" ? false : (value) => this.setState({ inputInterpretation: "hex", value })} /></li>
                <li><UTF8Bytes codepoints={codepoints} onSelect={inputInterpretation === "utf8" ? false : (value) => this.setState({ inputInterpretation: "utf8", value })} /></li>
                <li><UTF8Binary codepoints={codepoints} /></li>
              </ul>
            }
          </div>
        </div>
      </div>
    );
  }
}

const inputValidators = {
  raw: () => true,
  decimal: value => {
    if(!/^[\d ]*$/.test(value)) {
      return false;
    }

    try {
      const codepoints = parseAsDecimal(value);
      return codepoints.every(x => x >= 0 && x < 0x110000);
    } catch (e) {
      return false;
    }
  },
  hex: value => {
    if (!/^ *((U\+)?[\da-f]+ *)*$/i.test(value)) {
      return false;
    }

    try {
      const codepoints = parseAsHexidecimal(value);
      return codepoints.every(x => x >= 0 && x < 0x110000);
    } catch (e) {
      return false;
    }
  },
  utf8: value => {
    if (!/^[\da-f ,]*$/i.test(value)) {
      return false;
    }

    try {
      const raw = String(value).replace(/ ,/g, "");
      if (raw.length % 2) {
        return false;
      }

      const bytes = [];

      for (let i = 0; i < raw.length; i += 2) {
        bytes.push(parseInt(raw.substr(i,2), 16));
      }

      const byteString = String.fromCharCode(...bytes);
      utf8.decode(byteString);

      return true;
    } catch (e) {
      return false;
    }
  },
};

const inputInterpreters = {
  raw: parseAsRawChars,
  decimal: parseAsDecimal,
  hex: parseAsHexidecimal,
  utf8: parseAsUtf8Bytes,
};

function parseAsDecimal (value) {
  const raw = String(value).trim().replace(/ +/g, " ").split(" ");

  const codepoints = raw.map(x => parseInt(x, 10));

  return codepoints;
}

function parseAsHexidecimal (value) {
  const raw = String(value).trim().replace(/ +/g, " ").split(" ");

  const codepoints = raw.map(p => p.replace(/^U\+/, "")).map(x => parseInt(x, 16));

  return codepoints;
}

function parseAsRawChars (value) {
  const raw = String(value);

  const codepoints = [];

  for (let i = 0; i < raw.length; i++) {
    const cp = raw.codePointAt(i);
    codepoints.push(cp);
    if (cp > 0xffff) {
      i++;
    }
  }

  return codepoints;
}

function parseAsUtf8Bytes (value) {
  const raw = String(value).replace(/ /g, "");
  if (raw.length % 2) {
    return [];
  }

  const bytes = [];

  for (let i = 0; i < raw.length; i += 2) {
    bytes.push(parseInt(raw.substr(i,2), 16));
  }

  const byteString = bytes.map(x => String.fromCharCode(x)).join("");

  try {
    const string = utf8.decode(byteString);

    const codepoints = [...string].map(x => x.codePointAt(0));

    return codepoints;
  } catch (e) {
    return [];
  }
}

function StringOutput (props) {
  const str = String.fromCodePoint(...props.codepoints);
  return (
    <div>
      <p className={classes.label}>
        String
        { props.onSelect && <button className={classes.switchInput} onClick={() => props.onSelect(str)}>➔</button> }
      </p>
      { str }
    </div>
  );
}

function CodePoints (props) {
  const cpList = props.codepoints.map(cp => `U+${cp.toString(16)}`).join(" ");

  return (
    <div>
      <p className={classes.label}>
        Code Points ({props.codepoints.length})
        { props.onSelect && <button className={classes.switchInput} onClick={() => props.onSelect(cpList)}>➔</button> }
      </p>
      {
        props.codepoints.map((x,i) => <Char value={x} key={i} ucd={props.ucd} />)
      }
    </div>
  );
}

function UTF8Bytes (props) {

  const bytes = [...utf8.encode(String.fromCodePoint(...props.codepoints))].map(b => b.charCodeAt(0).toString(16).padStart(2,"0")).join(" ");
  const length = utf8.encode(String.fromCodePoint(...props.codepoints)).length;

  return (
    <div>
      <p className={classes.label}>
        UTF-8 ({length} {length === 1 ? "byte" : "bytes"})
        { props.onSelect && <button className={classes.switchInput} onClick={() => props.onSelect(bytes)}>➔</button> }
      </p>
      {
        props.codepoints.map((x,i) => <Bytes value={x} key={i} />)
      }
    </div>
  );
}

function UTF8Binary (props) {
  return <div>
    <div className={classes.label}>UTF-8 Bits</div>
    {
      props.codepoints.map((x,i) => <BinaryBytes value={x} key={i} />)
    }
  </div>
}

function Char (props) {
  if(isNaN(props.value)) return null;

  const char = String.fromCodePoint(props.value);
  const title = props.ucd ? props.ucd.getName(char) : "";

  return <div className={classes.char} title={title}>
    <p>{char}</p>
    <span className={classes.label}>U+{Number(props.value).toString(16).toUpperCase()}</span>
  </div>
}

function Bytes (props) {
  if(isNaN(props.value)) return null;

  try {
    const bytes = [...utf8.encode(String.fromCodePoint(props.value))].map(c => c.charCodeAt(0));

    return <div className={classes.byte} style={{ marginRight: 4 }}>
      <div>{bytes.map((b, i) => <span key={i}>{b.toString(16).padStart(2,'0')}</span>)}</div>
    </div>;
  } catch (e) {
    return;
  }
}

function BinaryBytes (props) {
  if(isNaN(props.value)) return null;

  try {
    const bytes = [...utf8.encode(String.fromCodePoint(props.value))].map(c => c.charCodeAt(0));

    return <div className={classes.byte + " " + classes.binaryByte} style={{ marginRight: 4 }}>
      {bytes.map((b, i) => <span key={i}>{b.toString(2).padStart(8,'0')}</span>)}
    </div>
  } catch (e) {
    return;
  }
}