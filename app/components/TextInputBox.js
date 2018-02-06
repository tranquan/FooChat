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
  TextInput,
} from 'react-native';

import KJButton from '../components/common/KJButton';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'TextInputBox.js';
/* eslint-enable */

// --------------------------------------------------
// TextInputBox
// --------------------------------------------------

class TextInputBox extends PureComponent {
  constructor(props) {
    super(props);
    
    this.state = {
      inputValue: '',
    };
  }
  componentWillMount() {
    const inputValue = this.props.initInputValue;
    this.setState({
      inputValue,
    });
  }
  // --------------------------------------------------
  onCancelPress = () => {
    this.props.onCancelPress();
  }
  onYesPress = () => {
    this.props.onYesPress(this.state.inputValue);
  }
  onChangeText = (text) => {
    this.setState({ inputValue: text });
    this.props.onChangeText(text);
  }
  // --------------------------------------------------
  renderInput() {
    const { title, inputPlaceholder } = this.props;
    const { inputValue } = this.state;
    return (
      <View>
        <Text style={styles.titleText}>
          {title}
        </Text>
        <TextInput
          style={styles.textInput}
          value={inputValue}
          placeholder={inputPlaceholder}
          onChangeText={this.onChangeText}
        />
      </View>
    )
  }
  renderButtons() {
    return (
      <View style={styles.buttonsContainer}>
        <KJButton
          containerStyle={styles.cancelButton}
          title={'Đóng'}
          titleStyle={styles.noButtonTitle}
          onPress={this.onCancelPress}
        />
        <View style={styles.vline} />
        <KJButton
          containerStyle={styles.yesButton}
          title={'Đồng ý'}
          titleStyle={styles.yesButtonTitle}
          onPress={this.onYesPress}
        />
      </View>
    );
  }
  render() {
    const { title, placeholder } = this.props;
    return (
      <View style={styles.container}>
        {this.renderInput()}
        <View style={{ height: 12 }} />
        <View style={styles.hline} />
        {this.renderButtons()}
      </View>
    );
  }
}

TextInputBox.defaultProps = {
  inputValue: '',
  inputPlaceholder: '',
  onCancelPress: () => {},
  onYesPress: () => {},
  onChangeText: (text) => {},
};

export default TextInputBox;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'stretch',
    marginLeft: 24,
    marginRight: 24,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  titleText: {
    alignSelf: 'center',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  textInput: {
    flex: 0,
    marginTop: 12,
    marginLeft: 12,
    marginRight: 12,
    paddingLeft: 8,
    paddingRight: 8,
    alignSelf: 'stretch',
    height: 40,
    borderRadius: 2,
    backgroundColor: '#f5f5f5',
    textAlign: 'left',
  },
  buttonsContainer: {
    flex: 0,
    flexDirection: 'row',
  },
  yesButton: {
    flex: 0.5,
    height: 44,
    backgroundColor: '#ff02',
  },
  yesButtonTitle: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '400',
    color: '#39B5FC',
  },
  cancelButton: {
    flex: 0.5,
    height: 44,
    backgroundColor: '#f002',
  },
  cancelButtonTitle: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#202020',
  },
  hline: {
    height: 1,
    backgroundColor: '#E0E0E1',
    marginLeft: 0,
    marginRight: 0,
  },
  vline: {
    width: 1,
    backgroundColor: '#E0E0E1',
    marginTop: 0,
    marginBottom: 0,
  },
});
