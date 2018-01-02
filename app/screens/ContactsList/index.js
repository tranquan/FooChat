import React, { Component } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image 
} from 'react-native';

import FBDatabaseManager from '../../manager/FBDatabaseManager';
import Styles from '../../constants/styles';
import ContactRow from './ContactRow';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: ContactsListScreen.js';
/* eslint-enable */

const CONTACTS = [
  {
    uid: '1',
    name: 'User 1',
  },
  {
    uid: '2',
    name: 'User 2',
  },
];

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
      <View style={styles.container}>
        <ContactRow
          user={CONTACTS[0]}
        />
        <ContactRow
          user={CONTACTS[1]}
        />
      </View>
    );
  }
}

export default ContactsListScreen;

// --------------------------------------------------

ContactsListScreen.navigationOptions = () => ({
  title: 'Contacts List', // must have a space or navigation will crash
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#fff',
});

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {

  },

});
