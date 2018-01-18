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

import ChatManager from '../../manager/ChatManager';
import ContactRow from './ContactRow';

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
  componentWillMount() {
    const allContacts = Utils.getTestContacts();
    this.setState({
      contacts: allContacts,
    });
  }
  onUserIdChangeText = (text) => {
    this.setState({ user_id: text });
  }
  onUserNameChangeText = (text) => {
    this.setState({ user_name: text });
  }
  onContactPress = (user) => {
    this.loginWithUser(user);
  }
  onLoginPress = () => {
    const user = {
      uid: this.state.user_id,
      fullName: this.state.user_name,
    };
    this.loginWithUser(user);
  }
  // --------------------------------------------------
  loginWithUser(user) {
    // loading
    this.props.switchToLoading();
    // save user
    this.props.setMyUser(user);
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
    // init chat
    ChatManager.shared().goOnline();
    ChatManager.shared().setup(user);
  }
  // --------------------------------------------------
  renderContacts() {
    const contacts = this.state.contacts;
    return (
      <View style={styles.contactsContainer}>
        <Text style={styles.contactsTitle}>
          {'Choose a user to login'}
        </Text>
        <View style={{ height: 12 }} />
        {
          contacts.map((contact) => {
            return (
              <ContactRow
                key={contact.uid}
                user={contact}
                onPress={() => this.onContactPress(contact)}
              />
            );
          })
        }
      </View>
    );
  }
  renderInputs() {
    return (
      <View style={styles.inputContainer}>
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
  render() {
    return (
      <View style={styles.container}>
        { this.renderContacts() }
        {/* { this.renderInputs() } */}
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
    backgroundColor: '#aaa',
  },
  inputContainer: {
    flex: 0,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
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
  contactsContainer: {
    flex: 0,
    paddingTop: 20,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    backgroundColor: '#fff',
  },
  contactsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});
