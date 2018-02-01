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
const LOG_TAG = 'ChatSettings/NavigationBar.js';
/* eslint-enable */

// --------------------------------------------------
// NavigationBar
// --------------------------------------------------

class NavigationBar extends PureComponent {
  onClosePress = () => {
    this.props.onClosePress();
  }
  // --------------------------------------------------
  renderCloseButton() {
    return (
      <KJButton
        containerStyle={styles.closeButton}
        leftIconSource={require('./img/close.png')}
        leftIconStyle={{ marginLeft: -12 }}
        onPress={this.onClosePress}
      />
    );
  }
  renderTitle() {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          {'Quản lý nhóm'}
        </Text>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderCloseButton()}
        {this.renderTitle()}
      </View>
    );
  }
}

// --------------------------------------------------

NavigationBar.propTypes = {
  onClosePress: PropTypes.func,
};

NavigationBar.defaultProps = {
  onClosePress: () => { },
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
    backgroundColor: '#2fb2ff',
  },
  closeButton: {
    marginTop: 0,
    width: 64,
    height: 44,
    backgroundColor: '#2fb2ff',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginLeft: 0,
    marginRight: 64,
    backgroundColor: '#0000',
  },
  titleText: {
    flex: 0,
    alignSelf: 'center',
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#ff00',
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
});
