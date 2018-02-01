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
  Switch,
  TouchableOpacity,
} from 'react-native';

import Styles from '../../constants/styles';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: TextRow.js';
/* eslint-enable */

// --------------------------------------------------
// TextRow
// --------------------------------------------------

class TextRow extends PureComponent {
  onPress = () => {
    this.props.onPress();
  }
  onSwitchValueChange = (value) => {
    Utils.warn(`9999: ${value}`);
    this.props.onSwitchValueChange(value);
  }
  // --------------------------------------------------
  renderArrow() {
    const { isArrowHidden } = this.props;
    return (
      isArrowHidden ? null :
        <Image
          style={styles.arrowImage}
          source={require('./img/right_arrow.png')}
          resizeMode="contain"
        />
    );
  }
  renderSwitch() {
    const { switchValue, isSwitchHidden } = this.props;
    return (
      isSwitchHidden ? null :
        <Switch
          tintColor={'#f7f7f7'}
          onTintColor={'#2fb2ff'}
          value={switchValue}
          onValueChange={this.onSwitchValueChange}
        />
    );
  }
  render() {
    const {
      title, details,
      titleStyle, detailsStyle,
      isSeparatorHidden,
    } = this.props;
    return (
      <View style={styles.container}>

        <View style={styles.rowContainer}>
          
          <Text style={[styles.titleText, titleStyle]}>
            {title}
          </Text>
          
          <Text style={[styles.detailsText, detailsStyle]}>
            {details}
          </Text>

          <TouchableOpacity
            style={Styles.button_overlay}
            onPress={this.onPress}
          />
          
          { this.renderSwitch() }
          
          { this.renderArrow() }

        </View>
        
        {
          isSeparatorHidden ? null :
            <View style={styles.separator} />
        }

      </View>
    );
  }
}

TextRow.defaultProps = {
  title: 'text',
  details: 'details',
  switchTitle: 'On',
  switchValue: false,
  isSwitchHidden: true,
  isArrowHidden: true,
  isSeparatorHidden: false,
  onPress: () => {},
  onSwitchValueChange: () => {},
};

export default TextRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingLeft: 24,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: '#fff',
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 12,
    backgroundColor: '#f000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 15,
  },
  titleText: {
    flex: 1,
    marginRight: 4,
    fontSize: 16,
    fontWeight: '400',
    color: '#24253d',
    backgroundColor: '#f000',
  },
  detailsText: {
    marginRight: 4,
    fontSize: 14,
    fontWeight: '300',
    color: '#7f7f7f',
    backgroundColor: '#f000',
  },
  arrowImage: {

  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E1',
    marginLeft: 0,
    marginRight: 0,
  },
});
