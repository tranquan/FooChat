/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import { 
  StyleSheet,
  View,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Spinner from 'react-native-loading-spinner-overlay';

import Styles from '../../constants/styles';
import Strings from '../../constants/strings';
import DelaySearchBar from '../../components/DelaySearchBar';
import ChatManager from '../../manager/ChatManager';
import ContactsManager, { CONTACTS_EVENTS } from '../../manager/ContactsManager';
import { showAlert } from '../../utils/UIUtils';

import NavigationBar from './NavigationBar';
import GetContactsRow from './GetContactsRow';
import ContactRow from './ContactRow';

const removeDiacritics = require('diacritics').remove;

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = 'ContactsListScreen.js';
/* eslint-enable */

// -------------------------------------------------- 
// ContactsListScreen
// --------------------------------------------------

class ContactsListScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      isContactsPermissionsGranted: true,
      contacts: [],
      contactsExtraData: false,
      isRefreshing: false,
      spinnerText: '',
      isSpinnerVisible: false,
    };
  }
  componentDidMount() {
    this.checkContactsPermissions();
    this.reloadData();
    this.addObservers();

    // test
    // setTimeout(() => {
    //   const target = this.state.contacts[0];
    //   this.openChatWithUser(target);
    // }, 1000);
    // end
  }
  componentWillUnmount() {
    this.removeObservers();
  }
  // --------------------------------------------------
  onNavBarInboxPress = () => {
    Utils.log(`${LOG_TAG} onNavBarInboxPress`);
  }
  onNavBarAddPress = () => {
    this.props.navigation.navigate('AddNewContact');
  }
  onContactPress = (user) => {
    this.openChatWithUser(user);
  }
  onGetContactsPress = () => {
    Utils.log(`${LOG_TAG} onGetContactsPress`);
    this.requestContactsPermissions();
  }
  onSearchBarChangeText = (text) => {
    Utils.log(`${LOG_TAG} onSearchBarChangeText ${text}`);
    this.setState({ searchText: text });
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
  reloadData = () => {
    const asyncTask = async () => {
      try {
        await ContactsManager.shared().reloadContacts();
        const contacts = ContactsManager.shared().getContactsArray();
        this.setState({
          contacts,
          isRefreshing: false,
        });
      } catch (err) {
        this.setState({
          isRefreshing: false,
        });
      }
    };
    asyncTask();
  }
  checkContactsPermissions() {
    const asyncTask = async () => {
      try {
        const isGranted = await ContactsManager.shared().checkContactsPermissions();
        this.setState({
          isContactsPermissionsGranted: isGranted,
        });
      } catch (err) {
        Utils.log(`${LOG_TAG} checkContactsPermissions: exc: `, err);
      }
    };
    asyncTask();
  }
  requestContactsPermissions() {
    const asyncTask = async () => {
      try {
        const isSuccess = await ContactsManager.shared().requestContactsPermissions();
        if (!isSuccess) {
          showAlert(Strings.contacts_access_guide);
          return;
        }
        this.setState({
          isContactsPermissionsGranted: true,
        });
      } catch (err) {
        Utils.log(`${LOG_TAG} requestContactsPermissions: exc: `, err);
      }
    };
    asyncTask();
  }
  addObservers() {
    const presenceEvent = CONTACTS_EVENTS.CONTACT_PRESENCE_CHANGE;
    ContactsManager.shared().addObserver(presenceEvent, this, (contact) => {
      // Utils.log(`${LOG_TAG}: presence change: `, contact);
      this.replaceContact(contact);
      this.refreshFlatList();
    });
  }
  removeObservers() {
    const presenceEvent = CONTACTS_EVENTS.CONTACT_PRESENCE_CHANGE;
    ContactsManager.shared().removeObserver(presenceEvent, this);
  }  
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
  // --------------------------------------------------
  openChatWithUser(user) {
    // Utils.log('openChatWithUser: ', userID);
    this.showSpinner('');
    const asyncTask = async () => {
      try {
        await Utils.timeout(500);
        const thread = await ChatManager.shared().createSingleThreadWithTarget(user);
        this.hideSpinner();
        if (!thread) { return; }
        setTimeout(() => {
          Utils.log(`${LOG_TAG}: openChatWithUser: thread: `, thread);
          this.props.navigation.navigate('Chat', { thread });
        }, 250);
      } catch (err) {
        Utils.warn('openChatWithUser: error', err);
        this.hideSpinner();
      }
    };
    asyncTask();
  }
  replaceContact(contact) {
    // Utils.log('replaceContact: ', contact);
    let index = -1;
    const contacts = this.state.contacts;
    for (let i = 0; i < contacts.length; i += 1) {
      if (contact.uid === contacts[i].uid) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      contacts[index] = contact;
    }
  }
  refreshFlatList() {
    this.setState({
      contactsExtraData: !this.state.contactsExtraData,
    });
  }
  // --------------------------------------------------
  renderNavigationBar() {
    return (
      <NavigationBar
        onInboxPress={this.onNavBarInboxPress}
        onAddPress={this.onNavBarAddPress}
      />
    );
  }
  renderGetContactsRow() {
    if (this.state.isContactsPermissionsGranted) { return null; }
    return (
      <View style={{ flex: 0, paddingBottom: 12 }}>
        <GetContactsRow
          onPress={this.onGetContactsPress}
        />
      </View>
    );
  }
  renderSearchBar() {
    return (
      <View style={styles.searchBarContainer}>
        <DelaySearchBar
          searchBarProps={{
            placeholder: 'Tìm kiếm mọi người',
          }}
          containerStyle={{ backgroundColor: '#f5f5f5' }}
          inputStyle={{ backgroundColor: '#fff' }}
          onChangeText={this.onSearchBarChangeText}
        />
        <View style={styles.topLine} />
        <View style={styles.bottomLine} />
      </View>
    );
  }
  renderContactsList() {
    const { contactsExtraData } = this.state;
    const contacts = this.getContacts();
    return (
      <FlatList
        refreshControl={
          <RefreshControl
            style={{ backgroundColor: '#f5f5f5' }}
            refreshing={this.state.isRefreshing}
            onRefresh={() => {
              this.reloadData();
            }}
          />
        }
        data={contacts}
        extraData={contactsExtraData}
        keyExtractor={item => item.uid}
        renderItem={this.renderContactRow}
      />
    );
  }
  renderContactRow = (row) => {
    const contact = row.item;
    return (
      <ContactRow
        key={contact.uid}
        user={contact}
        userPresenceStatus={contact.presenceStatus}
        onPress={this.onContactPress}
      />
    );
  }
  renderSpinner() {
    const {
      isSpinnerVisible,
      spinnerText,
    } = this.state;
    return (
      <Spinner
        visible={isSpinnerVisible}
        textContent={spinnerText}
        textStyle={{ marginTop: 4, color: '#fff' }}
        overlayColor="#00000080"
      />
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderNavigationBar()}
        {this.renderGetContactsRow()}
        {this.renderSearchBar()}
        {this.renderContactsList()}
        {this.renderSpinner()}
      </View>
    );
  }
}

// --------------------------------------------------

ContactsListScreen.navigationOptions = () => ({
  title: 'Contacts List', // must have a space or navigation will crash
  header: null,
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

ContactsListScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ContactsListScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
