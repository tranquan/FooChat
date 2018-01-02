import React, { Component } from 'react';
import { LayoutAnimation, UIManager } from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MainScreen from './MainScreen';
import LoadingScreen from './LoadingScreen';
import LoginScreen from '../Login';

import {
  switchToLogin,
  switchToLoading,
  switchToMain,
} from '../../redux/actions';

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: RootScreen.js';
/* eslint-enable */

// --------------------------------------------------
// RootScreen
// --------------------------------------------------

class RootScreen extends Component {
  componentWillUpdate() {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.spring();
  }
  render() {
    if (this.props.rootScreen === 'LOGIN') {
      return (
        <LoginScreen />
      );
    }
    if (this.props.rootScreen === 'MAIN') {
      return (
        <MainScreen />
      );
    }
    return (
      <LoadingScreen />
    );
  }
}

// --------------------------------------------------
// react-redux
// --------------------------------------------------

RootScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  rootScreen: state.rootScreen,
});

const mapDispatchToProps = (dispatch) => ({
  switchToLoading: () => dispatch(switchToLoading()),
  switchToLogin: () => dispatch(switchToLogin()),
  switchToMain: () => dispatch(switchToMain()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootScreen);
