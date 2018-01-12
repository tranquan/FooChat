import React, { Component } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image 
} from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';

import Styles from '../../constants/styles';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: ChatScreen.js';
/* eslint-enable */

// -------------------------------------------------- 
// ChatScreen
// --------------------------------------------------

class ChatScreen extends Component {
  render() {
    return (
      <Text 
        style={{
        marginTop: 20,
        }}
      >
        ChatScreen
      </Text>
    );
  }
}

ChatScreen.navigationOptions = () => ({
  title: 'Thông tin cá nhân',
  headerBackTitle: ' ',
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#fff',
  tabBarVisible: false,
});

export default ChatScreen;

// --------------------------------------------------

const styles = StyleSheet.create({

});
