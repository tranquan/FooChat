/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import { 
  StyleSheet,
  StatusBar,
  View, 
  Text,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Spinner from 'react-native-loading-spinner-overlay';

import Styles from '../../constants/styles';
import ChatManager from '../../manager/ChatManager';
import ContactsManager, { CONTACTS_EVENTS } from '../../manager/ContactsManager';

import NavigationBar from './NavigationBar';
import ContactRow from './ContactRow';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: ContactsListScreen.js';
/* eslint-enable */

// -------------------------------------------------- 
// ContactsListScreen
// --------------------------------------------------

class ContactsListScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      contactsExtraData: false,
      isRefreshing: false,
      isSpinnerVisible: false,
      spinnerText: '',
    };
  }
  componentDidMount() {
    this.reloadData();
    this.addObservers();
    // test
    setTimeout(() => {
      // const target = this.state.contacts[0];
      // this.openChatWithUser(target);
      // this.props.navigation.navigate('AddNewContact');
    }, 1000);
    // end
  }
  componentWillUnmount() {
    this.removeObservers();
  }
  // --------------------------------------------------
  onNavBarInboxPress = () => {

  }
  onNavBarAddPress = () => {
    
  }
  onContactPress = (user) => {
    this.openChatWithUser(user);
  }
  // --------------------------------------------------
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
  renderContactsList() {
    const { contacts, contactsExtraData } = this.state;
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
