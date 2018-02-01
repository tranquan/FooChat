/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */
/**
 * TODO: 
 * 1) as of now, for simple use case. we load all threads and don't provide load more
 * But for optimize, scroll to bottom should call loadMoreData
 */

import React, { Component } from 'react';
import { 
  StyleSheet,
  StatusBar,
  View,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';

import Styles from '../../constants/styles';
import ChatManager, { CHAT_EVENTS } from '../../manager/ChatManager';

import NavigationBar from './NavigationBar';
import ThreadRow from './ThreadRow';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = 'ChatsListScreen.js';
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
      threadsExtraData: false,
      isRefreshing: false,
      isSpinnerVisible: false,
      spinnerText: '',
    };

    this.isThreadsExists = {};
  }
  componentWillMount() {
    StatusBar.setBarStyle('dark-content', true);
    // add observer
    ChatManager.shared().addObserver(CHAT_EVENTS.NEW_THREAD, this, (thread) => {
      // Utils.warn(`ChatsListScreen: observer: ${thread.uid}`, thread);
      this.handleNewThread(thread);
    });
  }
  componentDidMount() {
    this.reloadData();
    // test
    // setTimeout(() => {
    //   const thread = this.state.threads[0];
    //   this.props.navigation.navigate('ChatSettings', { thread });
    // }, 1000);
    // end
  }
  componentWillUnmount() {
    StatusBar.setBarStyle('light-content', true);
    // remove observer
    ChatManager.shared().removeObserver(CHAT_EVENTS.NEW_THREAD, this);
  }
  // --------------------------------------------------
  onNavBarInboxPress = () => {

  }
  onNavBarAddPress = () => {
    this.props.navigation.navigate('CreateGroupChat');
  }
  onNavBarSearchPress = () => {

  }
  onThreadPress = (thread) => {
    this.openChatWithThread(thread);
  }
  // --------------------------------------------------
  getOldestThread() {
    const n = this.state.threads.length;
    return n > 0 ? this.state.threads[n - 1] : null;
  }
  handleNewThread(thread) {
    // Utils.log(`${LOG_TAG}: handleNewThread: ${thread.uid}`, thread);
    // thread already added
    if (this.isThreadsExists[thread.uid]) {
      return;
    }
    // add thread to top
    this.isThreadsExists[thread.uid] = true;
    this.setState((prevState) => ({
      threads: [thread].concat(prevState.threads),
    }));
  }
  reloadData = () => {
    this.loadMoreData(true, INITIAL_THREADS_LOAD);
  }
  loadMoreData = (isReload = false, maxThreadsFetch = PREVIOUS_THREADS_LOAD) => {
    const oldestThread = this.getOldestThread();
    const fromUpdateTime = oldestThread ? oldestThread.updateTime : null;
    const asyncTask = async () => {
      try {
        const threads = await ChatManager.shared().getMyThreads(fromUpdateTime, maxThreadsFetch);
        Utils.log(`${LOG_TAG}: loadMoreData: ${threads.length}`, threads);
        if (isReload) {
          // mark exists threads
          this.isThreadsExists = {};
          for (let i = 0; i < threads.length; i += 1) {
            const thread = threads[i];
            this.isThreadsExists[thread.uid] = true;
          }
          // update state
          this.setState({
            threads,
            isRefreshing: false,
          });
        } else {
          // mark exists threads
          const newThreads = threads.filter(thread => this.isThreadsExists[thread.uid] === null);
          this.isThreadsExists = {};
          for (let i = 0; i < newThreads.length; i += 1) {
            const thread = threads[i];
            this.isThreadsExists[thread.uid] = true;
          }
          // update state
          this.setState({
            threads: this.state.threads.concat(newThreads),
            isRefreshing: false,
          });
        }
      } catch (err) {
        Utils.warn(`${LOG_TAG}: loadPreviousThreads err: ${err}`, err);
        this.setState({
          isRefreshing: false,
        });
      }
    };
    asyncTask();
  }
  openChatWithThread(localThread) {
    // Utils.log(`${LOG_TAG}: openChatWithThread: `, localThread);
    // 1. open thread right away
    this.props.navigation.navigate('Chat', { thread: localThread });
    // 2. fetch thread then open
    // this.showSpinner('');
    // const asyncTask = async () => {
    //   try {
    //     await Utils.timeout(500);
    //     const thread = await ChatManager.shared().getThread(localThread.uid);
    //     this.hideSpinner();
    //     if (!thread) { return; }
    //     setTimeout(() => {
    //       this.props.navigation.navigate('Chat', { thread });
    //     }, 250);
    //   } catch (err) {
    //     this.hideSpinner();
    //     Utils.warn('openChatWithThread: error', err);
    //   }
    // };
    // asyncTask();
  }
  showSpinner(text = 'Đang xử lý') {
    this.setState({
      isSpinnerVisible: true,
      spinnerText: text,
    });
  }
  hideSpinner() {
    this.setState({
      isSpinnerVisible: false,
    });
  }
  // --------------------------------------------------
  renderNavigationBar() {
    return (
      <NavigationBar
        onInboxPress={this.onNavBarInboxPress}
        onSearchPress={this.onNavBarSearchPress}
        onAddPress={this.onNavBarAddPress}
      />
    );
  }
  renderThreadsList() {
    const { threads, threadsExtraData } = this.state;
    return (
      <FlatList
        refreshControl={
          <RefreshControl
            style={{ backgroundColor: '#f5f5f5' }}
            refreshing={this.state.isRefreshing}
            onRefresh={() => {
              this.reloadData();
            }}
          />
        }
        data={threads}
        extraData={threadsExtraData}
        keyExtractor={item => item.uid}
        renderItem={this.renderThreadRow}
      />
    );
  }
  renderThreadRow = (row) => {
    const thread = row.item;
    return (
      <ThreadRow
        thread={thread}
        onPress={this.onThreadPress}
      />
    );
  }
  renderSpinner() {
    const {
      isSpinnerVisible,
      spinnerText,
    } = this.state;
    return (
      <Spinner
        visible={isSpinnerVisible}
        textContent={spinnerText}
        textStyle={{ marginTop: 4, color: '#fff' }}
        overlayColor="#00000080"
      />
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderNavigationBar()}
        {this.renderThreadsList()}
        {this.renderSpinner()}
      </View>
    );
  }
}

export default ChatsListScreen;

// --------------------------------------------------

ChatsListScreen.navigationOptions = () => ({
  title: 'Chat List',
  header: null,
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#fff',
  tabBarLabel: 'Chat',
  tabBarIcon: ({ tintColor }) => (
    <Image
      source={require('../img/tab_chat.png')}
      style={[styles.icon, { tintColor }]}
    />
  ),
});

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
