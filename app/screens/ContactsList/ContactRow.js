import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
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
  render() {
    const { user } = this.props;
    return (
      <Text style={{ marginTop: 20 }}>
        {`user: ${user.name}`}
      </Text>
    );
  }
}

export default ContactRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
});
