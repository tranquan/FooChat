/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';

import Styles from '../../constants/styles';
import KJButton from '../../components/common/KJButton';
import ContactsManager from '../../manager/ContactsManager';
import User from '../../models/User';

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: CreateGroupChat/NavigationBar.js';
/* eslint-enable */

// --------------------------------------------------
// NavigationBar
// --------------------------------------------------

class NavigationBar extends PureComponent {
  onBackPress = () => {
    this.props.onBackPress();
  }
  onTitlePress = () => {
    this.props.onTitlePress();
  }
  // --------------------------------------------------
  renderBackButton() {
    return (
      <KJButton
        containerStyle={styles.backButton}
        leftIconSource={require('./img/back.png')}
        leftIconStyle={{ marginLeft: -12 }}
        onPress={this.onBackPress}
      />
    );
  }
  renderPresenceStatus() {
    const { thread } = this.props;
    // don't render for group
    if (thread.isGroupThread()) {
      return null;
    }
    // render presence status color
    let targetUser = thread.getSingleThreadTargetUser();
    targetUser = ContactsManager.shared().getContact(targetUser.uid);
    const statusColor = targetUser ? 
      targetUser.presenceStatusColor() : 
      User.PRESENCE_STATUS_COLOR.OFFLINE;
    return (
      <View
        style={[
          styles.status, 
          { backgroundColor: statusColor },
        ]}
      /> 
    );
  }
  renderTitle() {
    const { thread } = this.props;
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          {thread.titleString()}
        </Text>
        <View style={styles.statusContainer}>
          { this.renderPresenceStatus() }
          <Text style={styles.statusText}>
            {thread.statusString()}
          </Text>
        </View>
        <TouchableOpacity
          style={Styles.button_overlay}
          onPress={this.onTitlePress}
        />
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          {this.renderBackButton()}
          {this.renderTitle()}
        </View>
        <View style={styles.separator} />
      </View>
    );
  }
}

// --------------------------------------------------

NavigationBar.propTypes = {
  onBackPress: PropTypes.func,
  onTitlePress: PropTypes.func,
};

NavigationBar.defaultProps = {
  onBackPress: () => {},
  onTitlePress: () => { },
};

export default NavigationBar;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    paddingTop: 20,
    paddingBottom: 8,
    height: 64,
    backgroundColor: '#fff',
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#fff',
  },
  backButton: {
    marginTop: 0,
    width: 64,
    height: 44,
    backgroundColor: '#f000',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#0000',
  },
  titleText: {
    flex: 0,
    alignSelf: 'flex-start',
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#ff00',
    color: '#202020',
    fontSize: 15,
    fontWeight: '400',
  },
  statusContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 0,
  },
  statusText: {
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#ff00',
    color: '#808080',
    fontSize: 13,
    fontWeight: '300',
  },
  status: {
    flex: 0,
    marginRight: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 0,
    borderColor: '#fff',
    backgroundColor: '#f5f5f5',
  },
  separator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 0,
    marginRight: 0,
  },
});
