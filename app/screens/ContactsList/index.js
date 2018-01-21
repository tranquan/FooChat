import React, { Component } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image 
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Styles from '../../constants/styles';
import ChatManager from '../../manager/ChatManager';
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
      contacts: {},
    };
  }
  componentWillMount() {
    // filter me out
    const allContacts = Utils.getTestContacts();
    const contacts = allContacts.filter((contact) => {
      return contact.uid !== this.props.myUser.uid;
    });
    this.setState({
      contacts,
    });
  }
  componentDidMount() {
    // test: auto pick 1st user to chat
    // setTimeout(() => {
    //   const target = this.state.contacts[0];
    //   this.openChatWithUser(target)
    // }, 1000);
    // end
  }
  onContactPress = (user) => {
    this.openChatWithUser(user);
  }
  openChatWithUser(user) {
    // Utils.log('openChatWithUser: ', userID);
    const asyncTask = async () => {
      try {
        const thread = await ChatManager.shared().createSingleThreadWithTarget(user);
        if (!thread) { return; }
        this.props.navigation.navigate('Chat', { thread });
      } catch (err) {
        Utils.warn('openChatWithUser: error', err);
      }
    };
    asyncTask();
  }
  renderContacts() {
    const contacts = this.state.contacts;
    return (
      <View style={styles.container}>
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
  render() {
    return (
      <View style={styles.container}>
        {this.renderContacts()}
      </View>
    );
  }
}

// --------------------------------------------------

ContactsListScreen.navigationOptions = () => ({
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

ContactsListScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ContactsListScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {

  },
});
