import React, { Component } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image 
} from 'react-native';

import Styles from '../../constants/styles';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: ChatsListScreen.js';
/* eslint-enable */

// -------------------------------------------------- 
// ContactsListScreen
// --------------------------------------------------

class ChatsListScreen extends Component {
  render() {
    return (
      <Text 
        style={{
        marginTop: 20,
        }}
      >
        ChatsListScreen
      </Text>
    );
  }
}

export default ChatsListScreen;

// --------------------------------------------------

ChatsListScreen.navigationOptions = () => ({
  title: 'Contacts List', // must have a space or navigation will crash
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#fff',
});


// --------------------------------------------------

const styles = StyleSheet.create({

});
