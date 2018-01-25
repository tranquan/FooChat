import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Dimensions,
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
  onCancel = () => {
    this.props.onCancel();
  }
  onDone = () => {
    this.props.onDone();
  }
  // --------------------------------------------------
  renderLeftButton() {
    return (
      <KJButton
        containerStyle={styles.leftButton}
        leftIconSource={require('./img/close.png')}
        leftIconStyle={{ marginLeft: -12 }}
        onPress={this.onCancel}
      />
    );
  }
  renderRightButton() {
    return (
      <KJButton
        containerStyle={styles.rightButton}
        title={'Tạo'}
        titleStyle={{ color: '#007BFA' }}
        onPress={this.onCancel}
      />
    );
  }
  renderTitle() {
    return (
      <View style={styles.titleContainer}>
        <Text
          style={styles.titleText}
        >
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
  onCancel: PropTypes.func,
  onDone: PropTypes.func,
};

NavigationBar.defaultProps = {
  onCancel: () => {},
  onDone: () => { },
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