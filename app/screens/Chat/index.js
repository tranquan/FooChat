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

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import moment from 'moment/min/moment-with-locales';
import { GiftedChat } from 'react-native-gifted-chat';

import Styles from '../../constants/styles';
import ChatManager, { CHAT_EVENTS } from '../../manager/ChatManager';
import Thread from '../../models/Thread';
import Message from '../../models/Message';

import NavigationBar from './NavigationBar';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = 'ChatScreen.js';
/* eslint-enable */

const INITIAL_MESSAGES_LOAD = 255;
const PREVIOUS_MESSAGES_LOAD = 65;

// -------------------------------------------------- 
// Chat
// --------------------------------------------------

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      thread: {},
      giftedMessages: [],
      loadEarlier: true,
      isLoadingEarlier: false,
    };

    this.isMessagesAdded = {};
    this.members = {};
  }
  componentWillMount() {
    // cache current thread
    const { thread } = this.props.navigation.state.params;
    // update state
    this.setState({
      thread,
    }, () => {
      this.initMembers();
    });
    // add observer
    if (!thread) { return; }
    ChatManager.shared().addObserver(CHAT_EVENTS.NEW_MESSAGE, this, (message, threadID) => {
      // Utils.log(`ChatScreen: observer: ${message.uid} thread: ${threadID}`, message);
      if (this.state.thread && this.state.thread.uid === threadID) {
        this.handleNewMessage(message);
      }
    });
  }
  componentDidMount() {
    // load initial messages
    this.loadPreviousMessages(INITIAL_MESSAGES_LOAD);
  }
  componentWillUnmount() {
    // remove observer
    const thread = this.state.thread;
    if (!thread) { return; }
    ChatManager.shared().removeObserver(CHAT_EVENTS.NEW_MESSAGE, this);
  }
  // --------------------------------------------------
  onNavBarBackPress = () => {
    this.props.navigation.goBack();
  }
  onNavBarTitlePress = () => {
    const { thread } = this.state;
    this.props.navigation.navigate('ChatSettings', { thread });
  }
  onSend = (messages = []) => {
    // Utils.log(`ChatScreen: onSend: messages: ${messages.length}`, messages);
    if (messages.length === 0) { return; }
    const text = messages[0].text;
    this.sendMessageText(text);
  }
  onLoadEarlier = () => {
    this.setState({
      isLoadingEarlier: true,
    }, () => {
      this.loadPreviousMessages(PREVIOUS_MESSAGES_LOAD);
    });
  }
  // --------------------------------------------------
  getOldestMessage() {
    const n = this.state.giftedMessages.length;
    return n > 0 ? this.state.giftedMessages[n - 1] : null;
  }
  initMembers() {
    const members = {};
    const users = this.state.thread.getUsersArray();
    for (let i = 0; i < users.length; i += 1) {
      const user = users[i];
      members[user.uid] = user;
    }
    this.members = members;
  }
  handleNewMessage(message) {
    Utils.log(`ChatScreen: handleNewMessage: ${message.uid}`, message);
    this.appendMessages([message]);
  }
  // --------------------------------------------------
  loadPreviousMessages(maxMessages) {
    // load from the oldest message if having
    const threadID = this.state.thread.uid;
    const oldestMessage = this.getOldestMessage();
    const fromCreateTime = oldestMessage ? oldestMessage.createTime : null;
    const asyncTask = async () => {
      try {
        // get messages
        const messages = await 
          ChatManager.shared().getMessagesInThread(threadID, fromCreateTime, maxMessages);
        // hide load earlier if messages.length = 0
        this.setState({
          loadEarlier: messages.length > 0,
          isLoadingEarlier: false,
        }, () => {
          this.prependMessages(messages);
        });
      } catch (err) {
        Utils.warn(`${LOG_TAG}: loadPreviousMessages exc: ${err}`, err);
      }
    };
    asyncTask();
  }
  sendMessageText(text) {
    const message = Message.newTextMessage(text);
    const asyncTask = async () => {
      try {
        await ChatManager.shared().sendMessage(message, this.state.thread.uid);
      } catch (err) {
        Utils.warn(`ChatScreen: sendMessageText err: ${err}`, err);
      }
    };
    asyncTask();
  }
  // HELPERS
  // --------------------------------------------------
  convertMessageToGiftedMessage(message) {
    const author = this.members[message.authorID];
    const authorName = (author && author.fullName) ? author.fullName : 'N/A';
    const authorAvatar = (author && author.avatarImage) ? author.avatarImage : '';
    return {
      _id: message.uid,
      uid: message.uid,
      text: message.text,
      createdAt: moment(message.createTime, 'X').toDate(),
      user: {
        _id: message.authorID,
        name: authorName,
        avatar: authorAvatar,
      },
    };
  }
  appendMessages(messages) {
    // check for duplicate
    const filteredMessages = messages.filter(msg => {
      if (!this.isMessagesAdded[msg.uid]) {
        this.isMessagesAdded[msg.uid] = true;
        return true;
      }
      return false;
    });
    // convert to gifted messages
    const giftedMessages = filteredMessages.map(msg => {
      return this.convertMessageToGiftedMessage(msg);
    });
    // append
    this.setState(previousState => ({
      giftedMessages: GiftedChat.append(previousState.giftedMessages, giftedMessages),
    }));
  }
  prependMessages(messages) {
    // check for duplicate
    const filteredMessages = messages.filter(msg => {
      if (!this.isMessagesAdded[msg.uid]) {
        this.isMessagesAdded[msg.uid] = true;
        return true;
      }
      return false;
    });
    // convert to gifted messages
    const giftedMessages = filteredMessages.map(msg => {
      return this.convertMessageToGiftedMessage(msg);
    });
    // prepend
    this.setState(previousState => ({
      giftedMessages: GiftedChat.prepend(previousState.giftedMessages, giftedMessages),
    }));
  }
  // --------------------------------------------------
  renderNavigationBar() {
    const { thread } = this.state;
    return (
      <NavigationBar
        thread={thread}
        onBackPress={this.onNavBarBackPress}
        onTitlePress={this.onNavBarTitlePress}
      />
    );
  }
  renderMessagesList() {
    return (
      <GiftedChat
        user={{
          _id: this.props.myUser.uid,
        }}
        placeholder={'Type a message ...'}

        messages={this.state.giftedMessages}
        onSend={this.onSend}

        loadEarlier={this.state.loadEarlier}
        isLoadingEarlier={this.state.isLoadingEarlier}
        onLoadEarlier={this.onLoadEarlier}
      />
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderNavigationBar()}
        {this.renderMessagesList()}
      </View>
    );
  }
}

// --------------------------------------------------

Chat.navigationOptions = () => ({
  title: 'Chat',
  header: null,
  headerBackTitle: ' ',
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#fff',
  tabBarVisible: false,
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

Chat.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);


// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
