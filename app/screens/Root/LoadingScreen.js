import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: LoadingScreen.js';
/* eslint-enable */

// --------------------------------------------------
// RootScreen
// --------------------------------------------------

class LoadingScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>
          {'Loading...'}
        </Text>
      </View>
    );
  }
}

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
