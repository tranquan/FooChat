/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';

import ContactsManager from '../../manager/ContactsManager';
import { showAlert } from '../../utils/UIUtils';

import NavigationBar from './NavigationBar';
import TextInputRow from './TextInputRow';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = 'AddNewContact.js';
/* eslint-enable */

// --------------------------------------------------
// AddNewContact
// --------------------------------------------------

class AddNewContact extends Component {
  componentWillMount() {
    // create empty user if needed
    let user = {};
    if (this.props.navigation.state.params && this.props.navigation.state.params.user) {
      user = this.props.navigation.state.params.user;
    }
    // update state
    this.setState({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phoneNumber: user.phoneNumber || '',
      isSpinnerVisible: false,
      spinnerText: '',
    });
  }
  // --------------------------------------------------
  onCancelPress = () => {
    this.props.navigation.goBack();
  }
  onDonePress = () => {
    const asyncTask = async () => {
      try {
        // request
        const {
          firstName, lastName, phoneNumber,
        } = this.state;
        const result = 
          await ContactsManager.shared().addPhoneContact(firstName, lastName, phoneNumber);
        // result
        if (result) {
          showAlert('Thêm liên lạc mới thành công!');
          setTimeout(() => {
            this.onCancelPress();
          }, 500);
        } else {
          showAlert('Không thể tạo liên lạc mới trong danh bạ!');
        }
      } catch (err) {
        showAlert('Không thể tạo liên lạc mới trong danh bạ!');
      }
    };
    asyncTask();
  }
  onFirstNameChangeText = (text) => {
    this.setState({
      firstName: text,
    });
  }
  onLastNameChangeText = (text) => {
    this.setState({
      lastName: text,
    });
  }
  onPhoneNumberChangeText = (text) => {
    const formattedText = text.replace(/[^0-9\+]+/g, '');
    this.setState({
      phoneNumber: formattedText,
    });
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
  // --------------------------------------------------
  renderNavigationBar() {
    return (
      <NavigationBar
        onCancelPress={this.onCancelPress}
        onDonePress={this.onDonePress}
      />
    );
  }
  renderContent() {
    const {
      firstName, lastName, phoneNumber,
    } = this.state;
    return (
      <View style={styles.contentContainer}>
        <TextInputRow
          title="Họ"
          textInputProps={{
            value: firstName,
            onChangeText: this.onFirstNameChangeText,
          }}
          isSeperatorHidden={false}
        />
        <TextInputRow
          title="Tên"
          textInputProps={{
            value: lastName,
            onChangeText: this.onLastNameChangeText,
          }}
          isSeperatorHidden={false}
        />
        <TextInputRow
          title="Số điện thoại"
          textInputProps={{
            keyboardType: 'numeric',
            value: phoneNumber,
            onChangeText: this.onPhoneNumberChangeText,
          }}
          isSeperatorHidden={false}
        />
      </View>
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
        {this.renderContent()}
        {this.renderSpinner()}
      </View>
    );
  }
}

export default AddNewContact;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  contentContainer: {
    flex: 0,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
  },
});
