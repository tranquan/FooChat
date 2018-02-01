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
const LOG_TAG = '7777: CreateGroupChat/NavigationBar.js';
/* eslint-enable */

// --------------------------------------------------
// NavigationBar
// --------------------------------------------------

class NavigationBar extends PureComponent {
  onCancelPress = () => {
    this.props.onCancelPress();
  }
  onDonePress = () => {
    this.props.onDonePress();
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
          title={'Thêm vào danh bạ'}
          leftButtons={[
            <KJButton
              key={'1'}
              containerStyle={styles.barButton}
              leftIconSource={require('./img/close.png')}
              leftIconStyle={{ marginLeft: 12 }}
              onPress={this.onCancelPress}
            />,
          ]}
          rightButtons={[
            <KJButton
              key={'1'}
              title={'Thêm  '}
              titleStyle={{ fontSize: 13, fontWeight: '600', color: '#202020' }}
              containerStyle={styles.barButton}
              onPress={this.onDonePress}
            />,
          ]}
        />
      </View>
    );
  }
}

// --------------------------------------------------

NavigationBar.propTypes = {
  onCancelPress: PropTypes.func,
  onDonePress: PropTypes.func,
};

NavigationBar.defaultProps = {
  onCancelPress: () => { },
  onDonePress: () => { },
};

export default NavigationBar;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingTop: 20,
    paddingBottom: 0,
    height: 64,
    backgroundColor: '#fff',
  },
  barButton: {
    width: 44,
    height: 44,
    backgroundColor: '#f000',
  },
});
