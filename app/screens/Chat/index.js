import React, { Component } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image 
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import moment from 'moment/min/moment-with-locales';
import { GiftedChat } from 'react-native-gifted-chat';

import Styles from '../../constants/styles';
import ChatManager, { CHAT_EVENTS } from '../../manager/ChatManager';
import Thread from '../../models/Thread';
import Message from '../../models/Message';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: ChatScreen.js';
/* eslint-enable */

const INITIAL_MESSAGES_LOAD = 256;
const PREVIOUS_MESSAGES_LOAD = 44;

// -------------------------------------------------- 
// ChatScreen
// --------------------------------------------------

class ChatScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      thread: {},
      giftedMessages: [],
      loadEarlier: true,
      isLoadingEarlier: false,
    };

    this.isMessagesAdded = {};
  }
  componentWillMount() {
    // cache current thread
    const { thread } = this.props.navigation.state.params;
    this.setState({
      thread,
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
  handleNewMessage(message) {
    Utils.log(`ChatScreen: handleNewMessage: ${message.uid}`, message);
    this.appendMessages([message]);
  }
  // --------------------------------------------------
  loadPreviousMessages(maxMessages) {
    // load from the oldest message if having
    const threadID = this.state.thread.uid;
    const oldestMessage = this.getOldestMessage();
    const fromMessageRef = oldestMessage ? oldestMessage.uid : null;
    const asyncTask = async () => {
      try {
        // get messages
        const messages = await 
          ChatManager.shared().getMessagesInThread(threadID, fromMessageRef, maxMessages);
        // unable to load more if messages.length is zero
        this.setState({
          loadEarlier: messages.length > 0,
          isLoadingEarlier: false,
        }, () => {
          this.prependMessages(messages);
        });
      } catch (err) {
        Utils.warn(`ChatScreen: componentDidMount err: ${err}`, err);
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
    return {
      _id: message.uid,
      uid: message.uid,
      text: message.text,
      createdAt: moment(message.createTime, 'X').toDate(),
      user: {
        _id: message.authorID,
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
  render() {
    return (
      <View style={styles.container}>
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
      </View>
    );
  }
}

// --------------------------------------------------

ChatScreen.navigationOptions = () => ({
  title: 'Chat',
  headerBackTitle: ' ',
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#fff',
  tabBarVisible: false,
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

ChatScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);


// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// disable -> no need to add since observer will auto add
// const newMessage = await ChatManager.shared().sendMessage(message, this.state.thread.uid);
// const giftedMessage = this.convertMessageToGiftedMessage(newMessage);
// this.setState(previousState => ({
//   messages: GiftedChat.append(previousState.messages, [giftedMessage]),
// }));
// end
