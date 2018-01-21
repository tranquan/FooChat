import React, { Component } from 'react';
import { DrawerNavigator, StackNavigator, TabNavigator } from 'react-navigation';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  switchToLogin,
  switchToLoading,
  switchToMain,
} from '../../redux/actions';

import SlideMenuScreen from '../SlideMenu';
import ContactsListScreen from '../ContactsList';
import ChatsListScreen from '../ChatsList';
import ChatScreen from '../Chat';
import ProfileScreen from '../Profile';

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: MainScreen.js';
/* eslint-enable */

// --------------------------------------------------

const ContactsListStackNavigator = StackNavigator({
  ContactsList: { screen: ContactsListScreen },
  Chat: { screen: ChatScreen },
});

const ChatsListStackNavigator = StackNavigator({
  ChatsList: { screen: ChatsListScreen },
  Chat: { screen: ChatScreen },
});

// each tab is a stack navigator
const MainTabNavigator = TabNavigator(
  {
    ContactsListTab: {
      screen: ContactsListStackNavigator,
    },
    ChatsListTab: {
      screen: ChatsListStackNavigator,
    },
    ProfileTab: {
      screen: ProfileScreen,
    },
  },
  {
    initialRouteName: 'ChatsListTab',
    tabBarPosition: 'bottom',
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#007FFA',
    },
  },
);

// add main tab into a drawer
const MainDrawerNavigator = DrawerNavigator(
  {
    TabNavigator: {
      screen: MainTabNavigator,
    },
  },
  {
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    contentComponent: SlideMenuScreen,
  },
);

// --------------------------------------------------
// MainScreen
// --------------------------------------------------

class MainScreen extends Component {
  render() {
    return (
      <MainDrawerNavigator />
    );
  }
}

// --------------------------------------------------
// react-redux
// --------------------------------------------------

MainScreen.contextTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);

