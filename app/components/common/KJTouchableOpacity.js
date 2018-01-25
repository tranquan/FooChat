/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */ 

/**
 * Props can be overwrite
 * - containerStyle
 * - activeOpacity
 * - delayTime
 */

import React, { PureComponent } from 'react';
import {
  TouchableOpacity,
} from 'react-native';

// --------------------------------------------------
// KJTouchableOpacity
// --------------------------------------------------

class KJTouchableOpacity extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isTouchDelay: false,
    };
  }
  // --------------------------------------------------
  onPress = () => {
    const {
      delayTime,
    } = this.props;
    // ignore touch
    if (this.state.isTouchDelay) return;
    // make toucha un-available in 500ms 
    // so that user cannot tap rapidly and cause un-expected behaviour
    this.setState({ isTouchDelay: true });
    setTimeout(() => {
      this.setState({ isTouchDelay: false });
    }, delayTime);
    // press
    this.props.onPress();
  }
  // --------------------------------------------------
  render() {
    const {
      containerStyle,
      activeOpacity,
    } = this.props;
    return (
      <TouchableOpacity
        style={containerStyle}
        activeOpacity={activeOpacity}
        onPress={this.onPress}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

// --------------------------------------------------

KJTouchableOpacity.defaultProps = {
  delayTime: 500,
  activeOpacity: 0.75,
  onPress: () => { },
};

export default KJTouchableOpacity;
