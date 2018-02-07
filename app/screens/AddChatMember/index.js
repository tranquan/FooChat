/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

 /**
  * Navigation Params:
  * - thread: instance of Thread, which is about to add more user
  */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Alert,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { SearchBar } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';

import Styles from '../../constants/styles';
import Strings from '../../constants/strings';
import ContactsManager from '../../manager/ContactsManager';
import ChatManager from '../../manager/ChatManager';

import NavigationBar from './NavigationBar';
import ContactRow from './ContactRow';
import MemberCell from './MemberCell';

const _ = require('lodash');
const removeDiacritics = require('diacritics').remove;

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'AddChatMember.js';
/* eslint-enable */

const SEARCH_DELAY = 500;

// --------------------------------------------------
// AddChatMember.js
// --------------------------------------------------

class AddChatMember extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSpinnerVisible: false,
      spinnerText: 'Đang xử lý',
      contacts: [],
      contactsExtraData: false,
      members: [],
      membersExtraData: false,
      isMembersSelected: {},
      searchText: '',
    };
  }
  componentWillMount() {
    // get members if having
    const navParams = this.props.navigation.state.params || {};
    const thread = navParams.thread || null;
    // mark added contacts
    const members = thread.getUsersArray();
    const isMembersSelected = {};
    members.forEach(user => {
      isMembersSelected[user.uid] = true;
    });
    // // get list of contacts
    const contacts = ContactsManager.shared().getContactsArray();
    this.setState({
      thread,
      contacts,
      isMembersSelected,
    });
  }
  // --------------------------------------------------
  onCancelPress = () => {
    this.props.navigation.goBack();
  }
  onDonePress = () => {
    if (this.state.members.length <= 0) { return; }
    this.addUsersToGroupChat();
  }
  onSearchBarChangeText = (text) => {
    this.debounceSetSearchText(text);
  }
  onSearchBarClearText = () => {
    this.debounceSetSearchText('');
  }
  onContactPress = (user) => {
    // check user
    if (this.state.isMembersSelected[user.uid]) {
      return;
    }
    // add to member
    this.state.isMembersSelected[user.uid] = true;
    this.state.members.push(user);
    // update ui
    this.setState((prevState) => ({
      contactsExtraData: !prevState.contactsExtraData,
      membersExtraData: !prevState.membersExtraData,
    }));
  }
  onMemberPress = (user) => {
    // check user
    if (!this.state.isMembersSelected[user.uid]) {
      return;
    }
    // remove from member
    this.state.isMembersSelected[user.uid] = null;
    const removeUser = this.state.members.filter(item => item.uid === user.uid)[0];
    if (removeUser) {
      const removeIndex = this.state.members.indexOf(removeUser);
      this.state.members.splice(removeIndex, 1);
    }
    // update ui
    this.setState((prevState) => ({
      contactsExtraData: !prevState.contactsExtraData,
      membersExtraData: !prevState.membersExtraData,
    }));
  }
  // --------------------------------------------------
  getContacts() {
    let contacts = this.state.contacts;
    const searchText = removeDiacritics(this.state.searchText.trim());
    if (searchText && searchText.length > 0) {
      contacts = contacts.filter((user) => {
        const name = user.fullNameNoDiacritics();
        const matchFullName = name.search(new RegExp(searchText, 'i')) !== -1;
        return matchFullName;
      });
    }
    return contacts;
  }
  setSearchText = (text) => {
    this.setState({ searchText: text });
  }
  debounceSetSearchText = _.debounce(this.setSearchText, SEARCH_DELAY);
  addUsersToGroupChat() {
    // request
    this.showSpinner();
    const asyncTask = async () => {
      try {
        const { thread, members } = this.state;
        const result = ChatManager.shared().addUsersToGroupThread(thread.uid, members);
        this.hideSpinner();
        // wait for spinner hide & check
        setTimeout(() => {
          if (result) {
            this.props.navigation.goBack();
          } else {
            this.showAlert(Strings.update_thread_error);
          }
        }, 250);
      } catch (err) {
        // error
        this.showAlert(Strings.unknown_error);
      }
    };
    asyncTask();
  }
  // --------------------------------------------------
  showSpinner(text = 'Đang xử lý') {
    this.setState({
      isSpinnerVisible: true,
      spinnerText: text,
    });
  }
  hideSpinner() {
    this.setState({
      isSpinnerVisible: false,
    });
  }
  showAlert(message) {
    Alert.alert(
      Strings.alert_title,
      message,
      [{ text: 'Đóng' }],
      { cancelable: false },
    );
  }
  // --------------------------------------------------
  renderNavigationBar() {
    const isDoneButtonEnable = this.state.members.length > 0;
    return (
      <NavigationBar
        onCancelPress={this.onCancelPress}
        onDonePress={this.onDonePress}
        isDoneButtonEnable={isDoneButtonEnable}
      />
    );
  }
  renderSearchBar() {
    return (
      <View style={styles.searchBarContainer}>
        <SearchBar
          lightTheme
          containerStyle={{ backgroundColor: '#fff' }}
          inputStyle={{ backgroundColor: '#f5f5f5', fontSize: 15, textAlign: 'center' }}
          onChangeText={this.onSearchBarChangeText}
          onClearText={this.onSearchBarClearText}
          placeholder={'Tìm kiếm mọi người'}
        />
        <View style={styles.topLine} />
        <View style={styles.bottomLine} />
      </View>
    );
  }
  renderMembersList() {
    if (this.state.members.length === 0) {
      return null;
    }
    return (
      <View style={styles.membersListContainer}>
        <FlatList
          horizontal
          data={this.state.members}
          extraData={this.state.membersExtraData}
          keyExtractor={item => item.uid}
          renderItem={this.renderMemeberCell}
        />
      </View>
    );
  }
  renderMemeberCell = (row) => {
    const user = row.item;
    return (
      <MemberCell
        key={user.uid}
        user={user}
        userPresenceStatus={user.presenceStatus}
        onPress={this.onMemberPress}
      />
    );
  }
  renderContactsList() {
    const data = this.getContacts();
    return (
      <View style={styles.contactsListContainer}>
        <FlatList
          data={data}
          extraData={this.state.contactsExtraData}
          keyExtractor={item => item.uid}
          renderItem={this.renderContactRow}
        />
      </View>
    );
  }
  renderContactRow = (row) => {
    const user = row.item;
    const isSelected = this.state.isMembersSelected[user.uid] || false;
    return (
      <ContactRow
        key={user.uid}
        user={user}
        userPresenceStatus={user.presenceStatus}
        isSelected={isSelected}
        onPress={this.onContactPress}
      />
    );
  }
  render() {
    const {
      isSpinnerVisible,
      spinnerText,
    } = this.state;
    return (
      <View style={styles.container}>
        {this.renderNavigationBar()}
        {this.renderMembersList()}
        {this.renderSearchBar()}
        {this.renderContactsList()}
        <Spinner
          visible={isSpinnerVisible}
          textContent={spinnerText}
          textStyle={{ marginTop: 4, color: '#fff' }}
          overlayColor="#00000080"
        />
      </View>
    );
  }
}

// --------------------------------------------------

AddChatMember.navigationOptions = () => ({
  title: ' ', // must have a space or navigation will crash
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#fff',
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

AddChatMember.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(AddChatMember);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#eee',
  },
  searchBarContainer: {
    flex: 0,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#f5f5f5',
  },
  membersListContainer: {
    flex: 0,
    paddingTop: 12,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#f5f5f5',
  },
  contactsListContainer: {
    flex: 1,
  },
  topLine: {
    position: 'absolute',
    left: 0,
    top: 12,
    right: 0,
    height: 1,
    backgroundColor: '#f5f5f5',
  },
  bottomLine: {
    position: 'absolute',
    left: 0,
    bottom: 12,
    right: 0,
    height: 1,
    backgroundColor: '#f5f5f5',
  },
});
