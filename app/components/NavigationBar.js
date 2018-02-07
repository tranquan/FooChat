import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';

/* eslint-disable */
import Utils from '../utils/Utils';
const LOG_TAG = 'NavigationBar.js';
/* eslint-enable */

const BAR_BUTTON_SIZE = 44;

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
  renderLeftButtons() {
    return (
      <View style={styles.leftButtonsContainer}>
        { this.props.leftButtons }
      </View>
    );
  }
  renderRightButtons() {
    return (
      <View style={styles.leftButtonsContainer}>
        { this.props.rightButtons }
      </View>
    );
  }
  renderTitle() {
    const { leftButtons, rightButtons, barButtonSize } = this.props;
    const margin = Math.abs(leftButtons.length - rightButtons.length) * barButtonSize;
    const marginLeft = leftButtons.length > rightButtons.length ? 0 : margin;
    const marginRight = rightButtons.length > leftButtons.length ? 0 : margin;
    const { title, titleStyle } = this.props;
    return (
      <View style={[styles.titleContainer, { marginLeft, marginRight }]}>
        {
          this.props.renderTitle ? this.props.renderTitle :
            <Text style={[styles.titleText, titleStyle]}>
              {title}
            </Text>
        }
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          {this.renderLeftButtons()}
          {this.renderTitle()}
          {this.renderRightButtons()}
        </View>
        <View style={styles.separator} />
      </View>
    );
  }
}

// --------------------------------------------------

NavigationBar.propTypes = {
  barButtonSize: PropTypes.number,
  renderTitle: PropTypes.func,
  onCancelPress: PropTypes.func,
  onDonePress: PropTypes.func,
};

NavigationBar.defaultProps = {
  barButtonSize: BAR_BUTTON_SIZE,
  renderTitle: null,
  leftButtons: [], // eslint-disable-line
  rightButtons: [], // eslint-disable-line
  onCancelPress: () => {},
  onDonePress: () => {},
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
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#0000',
  },
  leftButtonsContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0000',
  },
  rightButtonsContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
