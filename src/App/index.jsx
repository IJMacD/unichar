import React, { Component } from 'react';
import utf8 from 'utf8';

import classes from './style.module.css';

export default class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      value: "A",
      inputInterpretation: "raw",
    };

  }

  onChange = (e) => {
    const { value } = e.target;
    this.setState({ value });
  }

  render () {
    const { value, inputInterpretation } = this.state;

    const inputs = {
      "raw": "Raw Characters",
      "decimal": "Code Point List (Decimal)",
      "hex": "Code Point List (Hexidecimal)",
      "utf8": "UTF-8 Bytes",
    };

    let codepoints = [];

    switch (inputInterpretation) {
      case "decimal":
        codepoints = parseAsDecimal(value);
        break;
      case "hex":
        codepoints = parseAsHexidecimal(value);
        break;
      case "raw":
        codepoints = parseAsRawChars(value);
        break;
      case "utf8":
        codepoints = parseAsUtf8Bytes(value);
        break;
    }

    return (
      <div className={classes.container}>
        <input
          type="text"
          value={value}
          onChange={this.onChange}
          className={classes.input}
        />
        <div className={classes.inOutContainer}>
          <div style={{flex:1}}>
            <h2 className={classes.sectionHeader}>Input Interpretation</h2>
            <ul className={classes.inputList}>
              {
                Object.keys(inputs).map(key => {
                  let classNames = classes.inputChoice;
                  const isValid = inputValidators[key](value);

                  if (!isValid) {
                    classNames += " " + classes.invalidInput;
                  }
                  else if (key === inputInterpretation) {
                    classNames += " " + classes.selectedInput;
                  }

                  return (
                    <li
                      key={key}
                      className={classNames}
                      onClick={isValid ? (() => this.setState({ inputInterpretation: key })) : undefined}
                    >
                      {inputs[key]}
                    </li>
                  );
                })
              }
            </ul>
          </div>
          <div style={{flex:1}}>
            <h2 className={classes.sectionHeader}>Output</h2>
            <ul className={classes.output}>
              <li><Characters codepoints={codepoints} /></li>
              <li><UTF8Bytes codepoints={codepoints} /></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

const inputValidators = {
  raw: () => true,
  decimal: value => /^[\d ]*$/.test(value),
  hex: value => /^[\da-f ]*$/i.test(value),
  utf8: value => {
    if (!inputValidators.hex(value)) {
      return false;
    }

    try {
      const raw = String(value).split(" ");
      const bytes = raw.map(x => parseInt(x, 16));

      if (!bytes.every(x => x >= 0 && x < 256)) {
        return false;
      }

      const byteString = bytes.map(x => String.fromCharCode(x)).join("");
      utf8.decode(byteString);
      return true;
    } catch (e) {
      return false;
    }
  },
};

function parseAsDecimal (value) {
  const raw = String(value).split(" ");

  const codepoints = raw.map(x => parseInt(x, 10));

  return codepoints;
}

function parseAsHexidecimal (value) {
  const raw = String(value).split(" ");

  const codepoints = raw.map(x => parseInt(x, 16));

  return codepoints;
}

function parseAsRawChars (value) {
  const raw = String(value);

  const codepoints = [];

  for (let i = 0; i < raw.length; i++) {
    codepoints.push(raw.codePointAt(i));
  }

  return codepoints;
}

function parseAsUtf8Bytes (value) {
  const raw = String(value).split(" ");

  const bytes = raw.map(x => String.fromCharCode(parseInt(x, 16))).join("");

  console.log(bytes);

  try {
    const string = utf8.decode(bytes);

    const codepoints = [...string].map(x => x.codePointAt(0));

    console.log(codepoints);
    return codepoints;
  } catch (e) {
    return [];
  }
}

function Characters (props) {
  return <div>
    <div className={classes.label}>Characters</div>
    {
      props.codepoints.map((x,i) => <Char value={x} key={i} />)
    }
  </div>
}

function UTF8Bytes (props) {
  return <div>
    <div className={classes.label}>UTF8</div>
    {
      props.codepoints.map((x,i) => <Bytes value={x} key={i} />)
    }
  </div>
}

function Char (props) {
  if(isNaN(props.value)) return null;

  return <div className={classes.char}>
    <div>{String.fromCodePoint(props.value)}</div>
    <span className={classes.label}>U+{Number(props.value).toString(16).toUpperCase()}</span>
  </div>
}

function Bytes (props) {
  if(isNaN(props.value)) return null;

  const bytes = [...utf8.encode(String.fromCodePoint(props.value))].map(c => c.charCodeAt(0));

  return <div className={classes.char} style={{ marginRight: 4 }}>
    <div>{bytes.map(b => <span>{b.toString(16)}</span>)}</div>
  </div>
}