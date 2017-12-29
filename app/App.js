import React, { Component } from 'react';
import {
  AppState,
  StatusBar,
} from 'react-native';
import { Provider } from 'react-redux';
import moment from 'moment/min/moment-with-locales';

import './constants/reactotron';

import store from './redux/store';
import MainScreen from './screens/Main';

/* eslint-disable */
import Utils, { getAppVersion, compareVersion } from './utils/Utils';
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
  // --------------------------------------------------
  render() {
    StatusBar.setBarStyle('light-content', true);
    return (
      <Provider store={store}>
        <MainScreen />
      </Provider>
    );
  }
}
