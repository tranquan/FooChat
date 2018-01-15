import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import Thread from '../../models/Thread';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: ThreadRow.js';
/* eslint-enable */

// --------------------------------------------------
// ThreadRow
// --------------------------------------------------

class ThreadRow extends PureComponent {
  onPress = () => {
    this.props.onPress(this.props.thread);
  }
  render() {
    const { thread } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {`Thread: ${thread.titleString()}`}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={this.onPress}
        />
      </View>
    );
  }
}

export default ThreadRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    marginTop: 4,
    padding: 4,
    height: 44,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 15,
    fontWeight: '300',
  },
  button: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#f000',
  },
});
