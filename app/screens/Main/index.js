import React, { Component } from 'react';
import { DrawerNavigator, StackNavigator, TabNavigator } from 'react-navigation';

import SlideMenuScreen from '../SlideMenu';
import ContactsListScreen from '../ContactsList';
import ChatsListScreen from '../ChatsList';
import ChatScreen from '../Chat';

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
  },
  {
    tabBarPosition: 'bottom',
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#f00',
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

export default MainScreen;
