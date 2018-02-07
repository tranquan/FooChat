/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */
/**
 * A wrapper of SearchBar of react-native-elements
 * - debounce onChangeText by delayTime
 * - be able to customize original SearchBar props
 */

import React, { PureComponent } from 'react';
import {
  StyleSheet,
} from 'react-native';

import { SearchBar } from 'react-native-elements';

const _ = require('lodash');

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'DelaySearchBar.js';
/* eslint-enable */

// --------------------------------------------------
// DelaySearchBar
// --------------------------------------------------

class DelaySearchBar extends PureComponent {
  // --------------------------------------------------
  onChangeText = (text) => {
    // Utils.log(`${LOG_TAG} onChangeText: ${text}`);
    this.debounceOnChangeText(text);
  }
  onChangeTextDelay = (text) => {
    this.props.onChangeText(text);
  }
  debounceOnChangeText = _.debounce(this.onChangeTextDelay, this.props.delayTime);
  // --------------------------------------------------
  render() {
    const {
      containerStyle,
      inputStyle,
      searchBarProps,
    } = this.props;
    return (
      <SearchBar
        lightTheme
        containerStyle={[styles.container, containerStyle]}
        inputStyle={[styles.input, inputStyle]}
        placeholder={'Tìm kiếm'}
        {...searchBarProps}
        onChangeText={this.onChangeText}
      />
    );
  }
}

DelaySearchBar.defaultProps = {
  delayTime: 500,
  onChangeText: () => {},
};

export default DelaySearchBar;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: '#fff',
  },
  input: { 
    backgroundColor: '#f5f5f5', 
    fontSize: 15, 
    textAlign: 'center',
  },
});
