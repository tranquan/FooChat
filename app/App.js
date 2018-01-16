import React, { Component } from 'react';
import {
  AppState,
  StatusBar,
} from 'react-native';
import { Provider } from 'react-redux';
import moment from 'moment/min/moment-with-locales';

import {
  switchToLogin,
  switchToMain,
  myUser,
} from './redux/actions';

import './constants/reactotron';

import store from './redux/store';
import RootScreen from './screens/Root/RootScreen';
import RealtimeDatabaseTest from './firebase/RealtimeDatabaseTest';
import ChatManager from './manager/ChatManager';

/* eslint-disable */
import Utils, { loadMyUser } from './utils/Utils';
const LOG_TAG = '7777: App.js';
/* eslint-enable */

// --------------------------------------------------
// App
// --------------------------------------------------

export default class App extends Component {
  componentDidMount() {
    this.currentAppState = AppState.currentState;
    AppState.addEventListener('change', this.handleAppStateChange);
    
    this.initApp();
    this.startApp();

    ChatManager.shared();

    RealtimeDatabaseTest.test();
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }
  // --------------------------------------------------
  handleAppStateChange = (nextAppState) => {
    // Utils.log(`${LOG_TAG} handleAppStateChange: `, nextAppState);
    if (this.currentAppState.match(/inactive|background/) && nextAppState === 'active') {
      // TODO: fetch data
    }
    this.currentAppState = nextAppState;
  }
  initApp() {
    moment.locale('vi');
  }
  startApp() {
    const asyncTask = async () => {
      const user = await loadMyUser();
      if (user && user.uid && user.uid.length > 0) {
        // setup chat
        ChatManager.shared().setup(user);
        // switch to main
        store.dispatch(myUser(user));
        store.dispatch(switchToMain());
      } else {
        store.dispatch(switchToLogin());
      } 
    };
    asyncTask();
  }
  // --------------------------------------------------
  render() {
    StatusBar.setBarStyle('light-content', true);
    return (
      <Provider store={store}>
        <RootScreen />
      </Provider>
    );
  }
}
