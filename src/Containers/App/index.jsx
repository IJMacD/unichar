import React, { Component } from 'react';

import classes from './style.cssm';

export default class App extends Component {
  constructor () {
    super();

    this.state = {
      value: 65,
    };

  }

  onChange = (e) => {
    const { value } = e.target;
    this.setState({ value });
  }

  render () {
    const { value } = this.state;

    return (
      <div className={classes.container}>
        <input
          type="text"
          value={value}
          onChange={this.onChange}
          className={classes.input}
        />
        <ul className={classes.output}>
          <li><DecimalCharacters value={value} /></li>
          <li><HexCharacters value={value} /></li>
        </ul>
      </div>
    );
  }
}

function DecimalCharacter (props) {
  const codepoint = parseInt(props.value, 10);
  if(isNaN(codepoint) || codepoint != props.value)
    return null;

  return <Char value={codepoint} />
}

function HexCharacter (props) {
  if(isNaN(parseInt(props.value, 16)))
    return null;

  return <Char value={parseInt(props.value, 16)} />
}

function DecimalCharacters (props) {
  const raw = String(props.value).split(" ");

  const codepoints = raw.map(x => parseInt(x, 10));

  return <div>
    <div className={classes.label}>Decimal</div>
    {
      codepoints.map((x,i) => <Char value={x} key={i} />)
    }
  </div>
}

function HexCharacters (props) {
  const raw = String(props.value).split(" ");

  const codepoints = raw.map(x => parseInt(x, 16));

  return <div>
    <div className={classes.label}>Hexadecimal</div>
    {
      codepoints.map((x,i) => <Char value={x} key={i} />)
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
