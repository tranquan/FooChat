import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
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
const LOG_TAG = '7777: LoginScreen.js';
/* eslint-enable */

// --------------------------------------------------
// LoginScreen
// --------------------------------------------------

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: '1',
      user_name: 'user 1',
    };
  }
  onUserIdChangeText = (text) => {
    this.setState({ user_id: text });
  }
  onUserNameChangeText = (text) => {
    this.setState({ user_name: text });
  }
  onLoginPress = () => {
    // loading
    this.props.switchToLoading();
    // save user info
    const user = {
      uid: this.state.user_id,
      name: this.state.user_name,
    };
    // set user
    this.props.setMyUser(user);
    // save to storage
    const asyncTask = async () => {
      const result = await saveMyUser(user);
      // go to main or login
      if (result) {
        this.props.switchToMain();
      } else {
        this.props.switchToLogin();
      }
    };
    asyncTask();
  }
  // --------------------------------------------------
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder={'user_id'}
          onChangeText={this.onUserIdChangeText}
        />
        <TextInput
          style={styles.textInput}
          placeholder={'name'}
          onChangeText={this.onUserNameChangeText}
        />
        <TouchableOpacity
          style={styles.loginButton}
          onPress={this.onLoginPress}
        >
          <Text>
            {'Login'}
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

LoginScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  rootScreen: state.rootScreen,
});

const mapDispatchToProps = (dispatch) => ({
  switchToLoading: () => dispatch(switchToLoading()),
  switchToLogin: () => dispatch(switchToLogin()),
  switchToMain: () => dispatch(switchToMain()),
  setMyUser: (user) => dispatch(myUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 0,
    marginTop: 12,
    marginLeft: 44,
    marginRight: 44,
    alignSelf: 'stretch',
    height: 44,
    backgroundColor: '#eaeaea',
    textAlign: 'center',
  },
  loginButton: {
    flex: 0,
    marginTop: 20,
    marginLeft: 44,
    marginRight: 44,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff0',
    height: 44,
  },
});
