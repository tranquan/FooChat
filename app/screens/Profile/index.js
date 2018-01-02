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
    // clear user info
    const user = {
      uid: '',
      name: '',
    };
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
    const { myUser } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.userIdText}>
          {`User ID: ${myUser.uid}`}
        </Text>
        <Text style={styles.userNameText}>
          {`User Name: ${myUser.name}`}
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
  setMyUser: (user) => dispatchEvent(myUser(user)),
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
