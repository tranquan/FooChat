import React, { Component } from 'react';
import { DrawerNavigator, StackNavigator, TabNavigator, NavigationActions } from 'react-navigation';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  switchToLogin,
  switchToLoading,
  switchToMain,
} from '../../redux/actions';

import SlideMenu from '../SlideMenu';
import ContactsList from '../ContactsList';
import ChatsList from '../ChatsList';
import Chat from '../Chat';
import CreateGroupChat from '../CreateGroupChat';
import Profile from '../Profile';

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: MainScreen.js';
/* eslint-enable */

// --------------------------------------------------

const ContactsListStackNavigator = StackNavigator({
  ContactsList: { screen: ContactsList },
  Chat: { screen: Chat },
});

const ChatsListStackNavigator = StackNavigator({
  ChatsList: { screen: ChatsList },
  Chat: { screen: Chat },
});

// each tab is a stack navigator
const MainTabNavigator = TabNavigator(
  {
    ChatsListTab: { screen: ChatsListStackNavigator },
    ContactsListTab: { screen: ContactsListStackNavigator },
    ProfileTab: { screen: Profile },
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

const MainModalNavigator = StackNavigator(
  {
    MainTabNavigator: { screen: MainTabNavigator },
    CreateGroupChat: { screen: CreateGroupChat },
  },
  {
    mode: 'modal',
    headerMode: 'none',
    style: {
      backgroundColor: '#fff',
    },
  },
);

// add main tab into a drawer
const MainDrawerNavigator = DrawerNavigator(
  {
    MainModalNavigator: { screen: MainModalNavigator },
  },
  {
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    contentComponent: SlideMenu,
  },
);

// --------------------------------------------------
// MainScreen
// --------------------------------------------------

class MainScreen extends Component {
  componentDidMount() {
    setTimeout(() => {
      // const resetAction = NavigationActions.reset({
      //   index: 0,
      //   actions: [
      //     NavigationActions.navigate({ routeName: 'ChatsListTab' }),
      //   ],
      // });
      // this.props.navigation.dispatch(resetAction);
    }, 2000);
  }
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

