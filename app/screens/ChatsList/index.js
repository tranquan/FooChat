import React, { Component } from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
  Image,
  FlatList,
} from 'react-native';

import Styles from '../../constants/styles';
import ChatManager, { CHAT_EVENTS } from '../../manager/ChatManager';
import ThreadRow from './ThreadRow';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: ChatsListScreen.js';
/* eslint-enable */

const INITIAL_THREADS_LOAD = 256;
const PREVIOUS_THREADS_LOAD = 44;

// -------------------------------------------------- 
// ContactsListScreen
// --------------------------------------------------

class ChatsListScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      threads: [],
    };

    this.isThreadsAdded = {};
  }
  componentWillMount() {
    // add observer
    ChatManager.shared().addObserver(CHAT_EVENTS.NEW_THREAD, this, (thread) => {
      // Utils.log(`ChatScreen: observer: ${message.uid} thread: ${threadID}`, message);
      if (this.state.thread && this.state.thread.uid === threadID) {
        this.handleIncomingMessage(message);
      }
    });
  }
  componentDidMount() {
    // load initial messages
    this.loadPreviousThreads(INITIAL_THREADS_LOAD);
  }
  componentWillUnmount() {
    // remove observer
    ChatManager.shared().removeObserver(CHAT_EVENTS.NEW_MESSAGE, this);
  }
  // --------------------------------------------------
  onThreadPress = (thread) => {
    this.openChatWithThread(thread);
  }
  // --------------------------------------------------
  getOldestThread() {
    const n = this.state.threads.length;
    return n > 0 ? this.state.threads[n - 1] : null;
  }
  loadPreviousThreads() {
    const oldestThread = this.getOldestThread();
    const fromUpdateTime = oldestThread ? oldestThread.updateTime : null;
    const asyncTask = async () => {
      try {
        const threads = await ChatManager.shared().getMyThreads(fromUpdateTime);
        Utils.warn(`ChatsListScreen threads: ${threads.length}`, threads);
        this.setState({
          threads,
        });
      } catch (err) {
        Utils.warn(`ChatsListScreen: loadPreviousThreads err: ${err}`, err);
      }
    };
    asyncTask();
  }
  openChatWithThread(localThread) {
    const asyncTask = async () => {
      try {
        const thread = await ChatManager.shared().getThread(localThread.uid);
        if (!thread) { return; }
        this.props.navigation.navigate('Chat', { thread });
      } catch (err) {
        Utils.warn('openChatWithThread: error', err);
      }
    };
    asyncTask();
  }
  // --------------------------------------------------
  renderItem(item) {
    return (
      <ThreadRow
        thread={item}
        onPress={this.onThreadPress}
      />
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.threads}
          extraData={this.state.threads.length}
          keyExtractor={item => item.uid}
          renderItem={(row) => {
            return this.renderItem(row.item);
          }}
        />
      </View>
    );
  }
}

export default ChatsListScreen;

// --------------------------------------------------

ChatsListScreen.navigationOptions = () => ({
  title: 'Chat List',
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#fff',
});

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  threadsContainer: {

  },

});
