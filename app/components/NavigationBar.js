import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = 'NavigationBar.js';
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
  renderLeftButtons() {
    return (
      <View style={styles.leftButtonsContainer}>
        { ...this.props.leftButtons }
      </View>
    );
  }
  renderRightButtons() {
    return (
      <View style={styles.leftButtonsContainer}>
        {...this.props.rightButtons}
      </View>
    );
  }
  renderTitle() {
    const { leftButtons, rightButtons } = this.props;
    const marginLeft = leftButtons.length * 44;
    const marginRight = rightButtons.length * 44;
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
        {this.renderLeftButtons()}
        {this.renderTitle()}
        {this.renderRightButtons()}
      </View>
    );
  }
}

// --------------------------------------------------

NavigationBar.propTypes = {
  renderTitle: PropTypes.func,
  onCancelPress: PropTypes.func,
  onDonePress: PropTypes.func,
};

NavigationBar.defaultProps = {
  renderTitle: null,
  leftButtons: [],
  rightButtons: [],
  onCancelPress: () => {},
  onDonePress: () => {},
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
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginLeft: 20,
    marginRight: 20,
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
