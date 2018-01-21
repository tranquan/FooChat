import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  switchToLogin,
  switchToLoading,
  switchToMain,
  myUser,
} from '../../redux/actions';

import Styles from '../../constants/styles';
import ChatManager from '../../manager/ChatManager';

// --------------------------------------------------

/* eslint-disable */
import Utils, { saveMyUser } from '../../utils/Utils';
const LOG_TAG = '7777: ProfileScreen.js';
/* eslint-enable */

// --------------------------------------------------
// ProfileScreen
// --------------------------------------------------

class ProfileScreen extends Component {
  onLogoutPress = () => {
    // loading
    this.props.switchToLoading();
    // de-init chat
    ChatManager.shared().goOffline();
    // clear user info
    const user = {};
    // set user
    this.props.setMyUser({});
    // clear from storage
    const asyncTask = async () => {
      const result = await saveMyUser(user);
      // go to main or login
      if (result) {
        this.props.switchToLogin();
      } else {
        this.props.switchToMain();
      }
    };
    asyncTask();
  }
  render() {
    const me = this.props.myUser;
    return (
      <View style={styles.container}>
        <Text style={styles.userIdText}>
          {`User ID: ${me.uid}`}
        </Text>
        <Text style={styles.userNameText}>
          {`User Name: ${me.fullName}`}
        </Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={this.onLogoutPress}
        >
          <Text>
            {'Logout'}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            height: 44,
          }}
        />
      </View>
    );
  }
}

// --------------------------------------------------

ProfileScreen.navigationOptions = () => ({
  title: 'Profile', // must have a space or navigation will crash
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#fff',
  tabBarLabel: 'Profile',
  tabBarIcon: ({ tintColor }) => (
    <Image
      source={require('../img/tab_home.png')}
      style={[styles.icon, { tintColor }]}
    />
  ),
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

ProfileScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  rootScreen: state.rootScreen,
  myUser: state.myUser,
});

const mapDispatchToProps = (dispatch) => ({
  switchToLoading: () => dispatch(switchToLoading()),
  switchToLogin: () => dispatch(switchToLogin()),
  switchToMain: () => dispatch(switchToMain()),
  setMyUser: (user) => dispatch(myUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  userIdText: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '300',
  },
  userNameText: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '300',
  },
  logoutButton: {
    flex: 0,
    marginTop: 20,
    marginLeft: 44,
    marginRight: 44,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f22',
    height: 44,
  },
});
