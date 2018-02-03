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
  Image,
  TouchableOpacity,
} from 'react-native';

import Styles from '../../constants/styles';
import KJImage from '../../components/common/KJImage';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = 'GetContactsRow.js';
/* eslint-enable */

// --------------------------------------------------
// GetContactsRow
// --------------------------------------------------

class GetContactsRow extends PureComponent {
  onPress = () => {
    this.props.onPress();
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <KJImage
            style={styles.iconImage}
            source={require('./img/sync.png')}
            defaultSource={require('./img/sync.png')}
            resizeMode="cover"
          />
          <Text style={styles.titleText}>
          { 'Đồng bộ danh bạ của bạn' }
          </Text>
        </View>
        <TouchableOpacity
          style={Styles.button_overlay}
          onPress={this.onPress}
        />
      </View>
    );
  }
}

export default GetContactsRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: '#fff',
  },
  rowContainer: {
    flex: 0,
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconImage: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2.0,
    borderWidth: 1.0,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  titleText: {
    flex: 1,
    marginLeft: 14,
    fontSize: 15,
    fontWeight: '300',
  },
});
