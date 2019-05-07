import React, { Component } from 'react';

import * as input from '../input';

import classes from './style.module.css';
import { TYPES, InputBlock } from '../nodes';

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

    const { default: ucd } = await import('ijmacd.ucd');
    this.setState({ ucd });
  }

  render () {
    const tree = {
      type: TYPES.INPUT,
      children: [
        { type: TYPES.INTERPRET_RAW, children: [
          { type: TYPES.DISPLAY_STRING, children: [] },
          { type: TYPES.DISPLAY_ENCODED, children: [] },
          { type: TYPES.DISPLAY_CODEPOINTS, children: [] },
          { type: TYPES.ENCODE_UTF8, children: [
            { type: TYPES.RENDER_HEX, children: [] },
          ] },
        ] },
        { type: TYPES.INTERPRET_ENCODED, children: [
          { type: TYPES.DISPLAY_STRING, children: [] },
          { type: TYPES.DISPLAY_ENCODED, children: [] },
          { type: TYPES.DISPLAY_CODEPOINTS, children: [] },
          { type: TYPES.ENCODE_UTF8, children: [
            { type: TYPES.RENDER_HEX, children: [] },
            { type: TYPES.RENDER_BASE64, children: [] },
          ] },
        ] },
        { type: TYPES.INTERPRET_HEX, children: [
          { type: TYPES.DISPLAY_STRING, children: [
            { type: TYPES.INTERPRET_UTF8, children: [
              { type: TYPES.DISPLAY_STRING, children: [] },
            ] },
          ] },
          { type: TYPES.DISPLAY_CODEPOINTS, children: [] },
          { type: TYPES.ENCODE_UTF8, children: [
            { type: TYPES.RENDER_HEX, children: [] },
            { type: TYPES.RENDER_BASE64, children: [] },
          ] },
        ] },
        { type: TYPES.INTERPRET_DECIMAL, children: [
          { type: TYPES.DISPLAY_STRING, children: [] },
          { type: TYPES.DISPLAY_CODEPOINTS, children: [] },
          { type: TYPES.ENCODE_UTF8, children: [
            { type: TYPES.RENDER_HEX, children: [] },
            { type: TYPES.RENDER_BASE64, children: [] },
          ] },
        ] },
        { type: TYPES.INTERPRET_UTF8, children: [
          { type: TYPES.DISPLAY_STRING, children: [
            { type: TYPES.INTERPRET_UTF8, children: [
              { type: TYPES.DISPLAY_STRING, children: [] },
            ] },
          ] },
          { type: TYPES.DISPLAY_ENCODED, children: [] },
          { type: TYPES.DISPLAY_CODEPOINTS, children: [] },
          { type: TYPES.ENCODE_UTF8, children: [
            { type: TYPES.RENDER_HEX, children: [] },
          ] },
        ] },
        { type: TYPES.DECODE_BASE64, children: [
          { type: TYPES.RENDER_HEX, children: [] },
          { type: TYPES.RENDER_BASE64, children: [] },
          { type: TYPES.DECODE_UTF8, children: [
            { type: TYPES.DISPLAY_STRING, children: [] },
            { type: TYPES.DISPLAY_CODEPOINTS, children: [] },
          ] },
        ] },
      ],
    };

    let rootNode;

    if (tree.type === TYPES.INPUT) {
      rootNode = <InputBlock node={tree} />;
    }

    return (
      <div className={classes.container}>
        {rootNode}
      </div>
    )
  }
}

function getHash () {
  const { hash } = window.location;

  if (!hash) {
    return null;
  }

  return decodeURIComponent(hash.substr(1));
}