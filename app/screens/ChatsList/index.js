import React, { Component } from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
  Image,
  FlatList,
  TouchableOpacity,
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
      // Utils.warn(`ChatsListScreen: observer: ${thread.uid}`, thread);
      this.handleNewThread(thread);
    });
    
  }
  componentDidMount() {
    // navigation bar right button
    if (this.props.navigation) {
      this.props.navigation.setParams({ 
        onHeaderRightButtonPress: this.onHeaderRightButtonPress,
      });
    }
    // load initial messages
    this.loadPreviousThreads(INITIAL_THREADS_LOAD);
  }
  componentWillUnmount() {
    // remove observer
    ChatManager.shared().removeObserver(CHAT_EVENTS.NEW_THREAD, this);
  }
  // --------------------------------------------------
  onHeaderRightButtonPress = () => {
    // test create threads
    const allContacts = Utils.getTestContacts();
    const user1 = allContacts[0];
    const user2 = allContacts[1];
    const user3 = allContacts[2];
    ChatManager.shared().createGroupThread([user1, user2, user3], {
      title: '',
      photoURL: '',
    });
    // end
  };
  onThreadPress = (thread) => {
    this.openChatWithThread(thread);
  }
  // --------------------------------------------------
  getOldestThread() {
    const n = this.state.threads.length;
    return n > 0 ? this.state.threads[n - 1] : null;
  }
  handleNewThread(thread) {
    // Utils.log(`ChatsListScreen: handleNewThread: ${thread.uid}`, thread);
    this.setState((prevState) => ({
      threads: [thread].concat(prevState.threads),
    }));
  }
  loadPreviousThreads() {
    const oldestThread = this.getOldestThread();
    const fromUpdateTime = oldestThread ? oldestThread.updateTime : null;
    const asyncTask = async () => {
      try {
        const threads = await ChatManager.shared().getMyThreads(fromUpdateTime);
        Utils.log(`ChatsListScreen: loadPreviousThreads: ${threads.length}`, threads);
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
    // open thread right away
    this.props.navigation.navigate('Chat', { thread: localThread });
    // fetch thread then open
    // const asyncTask = async () => {
    //   try {
    //     const thread = await ChatManager.shared().getThread(localThread.uid);
    //     if (!thread) { return; }
    //     this.props.navigation.navigate('Chat', { thread });
    //   } catch (err) {
    //     Utils.warn('openChatWithThread: error', err);
    //   }
    // };
    // asyncTask();
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

ChatsListScreen.navigationOptions = ({ navigation }) => ({
  title: 'Chat List',
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#fff',
  headerRight: <HeaderRightButton navigation={navigation} />,
  tabBarLabel: 'Chat',
  tabBarIcon: ({ tintColor }) => (
    <Image
      source={require('../img/tab_chat.png')}
      style={[styles.icon, { tintColor }]}
    />
  ),
});

const HeaderRightButton = (props) => {
  const params = props.navigation.state.params;
  return (
    <TouchableOpacity
      style={styles.headerRightButton}
      onPress={() => {
        if (params.onHeaderRightButtonPress) {
          params.onHeaderRightButtonPress();
        }
      }}
    >
      <Text style={styles.headerRightButtonTitle}>
        {'Create'}
      </Text>
    </TouchableOpacity>
  );
};

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRightButton: {
    width: 64,
    height: 44,
    paddingLeft: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRightButtonTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
