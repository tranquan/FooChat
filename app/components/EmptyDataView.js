/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'EmptyDateView.js';
/* eslint-enable */

// --------------------------------------------------
// EmptyDateView
// --------------------------------------------------

class EmptyDateView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={{ marginTop: 20 }}>
          EmptyDateView
        </Text>
      </View>
    );
  }
}

EmptyDateView.defaultProps = {

};

export default EmptyDateView;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
