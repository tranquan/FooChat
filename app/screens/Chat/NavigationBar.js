/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
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
  renderTitle() {
    const { thread } = this.props;
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          {'APPAY'}
        </Text>
        <Text style={styles.subTitleText}>
          {'4/8 Đang hoạt động'}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={this.onPress}
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
    fontSize: 16,
    fontWeight: '400',
  },
  subTitleText: {
    flex: 0,
    alignSelf: 'flex-start',
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#ff00',
    color: '#808080',
    fontSize: 14,
    fontWeight: '300',
  },
  button: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#f000',
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
