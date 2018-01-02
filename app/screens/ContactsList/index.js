import React, { Component } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image 
} from 'react-native';

import FBDatabaseManager from '../../manager/FBDatabaseManager';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: ContactsListScreen.js';
/* eslint-enable */

// -------------------------------------------------- 
// ContactsListScreen
// --------------------------------------------------

class ContactsListScreen extends Component {
  componentDidMount() {
    setTimeout(() => {
      FBDatabaseManager.createSingleThread();
    }, 500);
  }
  render() {
    return (
      <Text 
        style={{
        marginTop: 20,
        }}
      >
        ContactsListScreen
      </Text>
    );
  }
}

export default ContactsListScreen;

// --------------------------------------------------

const styles = StyleSheet.create({

});
