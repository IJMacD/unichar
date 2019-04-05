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
          <div style={{flex:1}}>
            <h2 className={classes.sectionHeader}>Output</h2>
            { isValid &&
              <ul className={classes.output}>
                <li><Characters codepoints={codepoints} /></li>
                <li><UTF8Bytes codepoints={codepoints} /></li>
                <li><UTF8Binary codepoints={codepoints} /></li>
              </ul>
            }
          </div>
        </div>
      </div>
    );
  }
}

const hexDigits = value => /^[\da-f ]*$/i.test(value);

const inputValidators = {
  raw: () => true,
  decimal: value => {
    if(!/^[\d ]*$/.test(value)) {
      return false;
    }

    const raw = String(value).split(" ");
    const codepoints = raw.map(x => parseInt(x, 10));

    return codepoints.every(x => x >= 0 && x < 0x110000);
  },
  hex: value => {
    if (!hexDigits(value)) {
      return false;
    }

    const raw = String(value).split(" ");
    const codepoints = raw.map(x => parseInt(x, 16));

    return codepoints.every(x => x >= 0 && x < 0x110000);
  },
  utf8: value => {
    if (!hexDigits(value)) {
      return false;
    }

    try {
      const raw = String(value).replace(/ /g, "");
      if (raw.length % 2) {
        return false;
      }

      const bytes = [];

      for (let i = 0; i < raw.length; i += 2) {
        bytes.push(parseInt(raw.substr(i,2), 16));
      }

      const byteString = bytes.map(x => String.fromCharCode(x)).join("");
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
    <div className={classes.label}>UTF-8</div>
    {
      props.codepoints.map((x,i) => <Bytes value={x} key={i} />)
    }
  </div>
}

function UTF8Binary (props) {
  return <div>
    <div className={classes.label}>UTF-8</div>
    {
      props.codepoints.map((x,i) => <BinaryBytes value={x} key={i} />)
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

    return <div className={classes.byte} style={{ marginRight: 4 }}>
      <div>{bytes.map((b, i) => <span key={i}>{b.toString(2).padStart(8,'0')}</span>)}</div>
    </div>
  } catch (e) {
    return;
  }
}