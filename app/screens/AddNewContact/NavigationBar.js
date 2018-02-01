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
  renderCloseButton() {
    return (
      <KJButton
        containerStyle={styles.leftButton}
        leftIconSource={require('./img/close.png')}
        leftIconStyle={{ marginLeft: -12 }}
        onPress={this.onCancelPress}
      />
    );
  }
  renderRightButton() {
    const { isDoneButtonEnable } = this.props;
    const doneButtonColor = isDoneButtonEnable ? '#007BFA' : '#808080';
    return (
      <KJButton
        containerStyle={styles.rightButton}
        title={'Tạo'}
        titleStyle={{ color: doneButtonColor }}
        onPress={this.onDonePress}
      />
    );
  }
  renderTitle() {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          {'Cuộc trò chuyện mới'}
        </Text>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderLeftButton()}
        {this.renderTitle()}
        {this.renderRightButton()}
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
  leftButton: {
    marginTop: 0,
    width: 64,
    height: 44,
    backgroundColor: '#f000',
  },
  rightButton: {
    marginTop: 0,
    width: 64,
    height: 44,
    backgroundColor: '#f000',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginLeft: 0,
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
});
