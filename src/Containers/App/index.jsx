import React, { Component } from 'react';

import classes from './style.cssm';

export default class App extends Component {
  render () {
    return (
      <div>
        <h1 className={classes.welcome}>
          Welcome to Blank React Project
        </h1>
      </div>
    );
  }
}
