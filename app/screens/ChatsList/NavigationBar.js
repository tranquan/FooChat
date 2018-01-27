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
} from 'react-native';

import PropTypes from 'prop-types';

import KJButton from '../../components/common/KJButton';

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: ChatsList/NavigationBar.js';
/* eslint-enable */

// --------------------------------------------------
// NavigationBar
// --------------------------------------------------

class NavigationBar extends PureComponent {
  onInboxPress = () => {
    this.props.onInboxPress();
  }
  onAddPress = () => {
    this.props.onAddPress();
  }
  onSearchPress = () => {
    this.props.onSearchPress();
  }
  // --------------------------------------------------
  renderInboxButton() {
    return (
      <KJButton
        containerStyle={styles.barButton}
        leftIconSource={require('./img/bell.png')}
        leftIconStyle={{ marginLeft: 12 }}
        onPress={this.onInboxPress}
      />
    );
  }
  renderSearchButton() {
    return (
      <KJButton
        containerStyle={styles.barButton}
        leftIconSource={require('./img/search.png')}
        leftIconStyle={{ marginLeft: -12 }}
        onPress={this.onSearchPress}
      />
    );
  }
  renderAddButton() {
    return (
      <KJButton
        containerStyle={styles.barButton}
        leftIconSource={require('./img/add.png')}
        leftIconStyle={{ marginLeft: -12 }}
        onPress={this.onAddPress}
      />
    );
  }
  renderTitle() {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          {'Chat'}
        </Text>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          {this.renderInboxButton()}
          {this.renderTitle()}
          {this.renderSearchButton()}
          {this.renderAddButton()}
        </View>
        <View style={styles.separator} />
      </View>
    );
  }
}

// --------------------------------------------------

NavigationBar.propTypes = {
  onInboxPress: PropTypes.func,
  onAddPress: PropTypes.func,
  onSearchPress: PropTypes.func,
};

NavigationBar.defaultProps = {
  onInboxPress: () => {},
  onAddPress: () => {},
  onSearchPress: () => {},
};

export default NavigationBar;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingTop: 20,
    paddingBottom: 0,
    height: 64,
    backgroundColor: '#fff',
  },
  rowContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#fff',
  },
  barButton: {
    marginTop: 0,
    width: 44,
    height: 44,
    backgroundColor: '#f000',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginLeft: 44,
    marginRight: 0,
    backgroundColor: '#0000',
  },
  titleText: {
    flex: 0,
    alignSelf: 'center',
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#ff00',
    color: '#202020',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
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
