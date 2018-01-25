import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  StatusBar,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Styles from '../../constants/styles';

import NavigationBar from './NavigationBar';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: CreateGroupChat.js';
/* eslint-enable */

// --------------------------------------------------
// CreateGroupChat.js
// --------------------------------------------------

class CreateGroupChat extends Component {
  // --------------------------------------------------
  onCancel = () => {
    this.props.navigation.goBack();
  }
  onDone = () => {
    // get members
    // gen default title
    // create
  }
  // --------------------------------------------------
  renderNavigationBar() {
    return (
      <NavigationBar
        onCancel={this.onCancel}
        onDone={this.onDone}
      />
    );
  }
  renderSearch() {

  }
  renderMemberList() {

  }
  render() {
    StatusBar.setBarStyle('dark-content', true);
    return (
      <View style={styles.container}>
        {this.renderNavigationBar()}
        <Text style={{ marginTop: 20 }}>
          CreateGroupChat
        </Text>
      </View>
    );
  }
}

// --------------------------------------------------

CreateGroupChat.navigationOptions = () => ({
  title: 'Contacts List', // must have a space or navigation will crash
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#fff',
  tabBarLabel: 'Contacts',
  tabBarIcon: ({ tintColor }) => (
    <Image
      source={require('../img/tab_contacts.png')}
      style={[styles.icon, { tintColor }]}
    />
  ),
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

CreateGroupChat.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroupChat);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
});
