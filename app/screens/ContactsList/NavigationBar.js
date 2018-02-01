/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';

import KJButton from '../../components/common/KJButton';
import BaseNavigationBar from '../../components/NavigationBar';

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: ContactsList/NavigationBar.js';
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
  // --------------------------------------------------
  render() {
    return (
      <View>
        <StatusBar
          backgroundColor="#fff"
          barStyle="dark-content"
        />
        <BaseNavigationBar
          title={'Danh bạ'}
          leftButtons={[
            <KJButton
              key={'1'}
              containerStyle={styles.barButton}
              leftIconSource={require('./img/bell.png')}
              leftIconStyle={{ marginLeft: 12 }}
              onPress={this.onInboxPress}
            />,
          ]}
          rightButtons={[
            <KJButton
              key={'1'}
              containerStyle={styles.barButton}
              leftIconSource={require('./img/add.png')}
              leftIconStyle={{ marginLeft: -12 }}
              onPress={this.onAddPress}
            />,
          ]}
        />
      </View>
    );
  }
}

// --------------------------------------------------

NavigationBar.propTypes = {
  onInboxPress: PropTypes.func,
  onAddPress: PropTypes.func,
};

NavigationBar.defaultProps = {
  onInboxPress: () => { },
  onAddPress: () => { },
};

export default NavigationBar;

// --------------------------------------------------

const styles = StyleSheet.create({
  barButton: {
    width: 44,
    height: 44,
    backgroundColor: '#f000',
  },
});
