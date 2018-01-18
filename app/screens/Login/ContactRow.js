import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: ContactRow.js';
/* eslint-enable */

// --------------------------------------------------
// ContactRow
// --------------------------------------------------

class ContactRow extends PureComponent {
  onPress = () => {
    this.props.onPress(this.props.user);
  }
  render() {
    const { user } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {`user: ${user.fullName}`}
        </Text>
        <View style={styles.separator} />
        <TouchableOpacity
          style={styles.button}
          onPress={this.onPress}
        />
      </View>
    );
  }
}

ContactRow.defaultProps = {
  onPress: () => {},
};

export default ContactRow;

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
    flex: 1,
    fontSize: 15,
    fontWeight: '300',
  },
  separator: {
    height: 1,
    backgroundColor: '#a0a0a0',
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
