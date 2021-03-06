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
import Thread from '../../models/Thread';
import KJImage from '../../components/common/KJImage';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: ThreadRow.js';
/* eslint-enable */

const ROW_PADDING_LEFT = 20;
const ROW_PADDING_RIGHT = 20;
const PHOTO_SIZE = 46;
const PHOTO_CONTENT_SPACING = 10;
const TITLE_MAX_LINES = 3;

// --------------------------------------------------
// ThreadRow
// --------------------------------------------------

class ThreadRow extends PureComponent {
  onPress = () => {
    this.props.onPress(this.props.thread);
  }
  // --------------------------------------------------
  renderPhoto() {
    const { thread } = this.props;
    const totalUnReadMessages = thread.totalUnReadMessages();
    return (
      <View style={styles.photoContainer}>
        <KJImage
          style={styles.photoImage}
          source={thread.photoImageURI()}
          defaultSource={thread.photoImagePlaceholder()}
          resizeMode="cover"
        />
        {
          totalUnReadMessages <= 0 ? null :
            <Text style={styles.badge}>
              {`${totalUnReadMessages}`}
            </Text>
        }
      </View>
    );
  }
  renderContent() {
    const { thread } = this.props;
    return (
      <View style={styles.contentContainer} >
        <Text 
          style={styles.titleText}
          numberOfLines={TITLE_MAX_LINES}
        >
          {`${thread.titleString()}`}
        </Text>
        <Text style={styles.lastMessageText}>
          {`${thread.lastMessage()}`}
        </Text>
      </View>
    );
  }
  renderExtraInfo() {
    return (
      <View style={styles.extraInfoContainer} />
    );
  }
  render() {
    return (
      <View style={styles.container}>

        <View style={styles.rowContainer}>
          {this.renderPhoto()}
          {this.renderContent()}
          {this.renderExtraInfo()}
        </View>

        <View style={styles.separator} />
        
        <TouchableOpacity
          style={Styles.button_overlay}
          onPress={this.onPress}
        />
        
      </View>
    );
  }
}

export default ThreadRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#fff',
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: ROW_PADDING_LEFT,
    paddingRight: ROW_PADDING_RIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  photoContainer: {
    flex: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 10,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#fff',
  },
  photoImage: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: PHOTO_SIZE / 2.0,
    borderWidth: 1.0,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  badge: {
    position: 'absolute',
    right: 4,
    top: 0,
    paddingLeft: 5,
    paddingRight: 4,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 8,
    color: '#fff',
    backgroundColor: '#FF503E',
    fontSize: 9,
    fontWeight: '600',
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#fff',
  },
  titleText: {
    fontSize: 14,
    fontWeight: '300',
  },
  titleBoldText: {
    fontSize: 14,
    fontWeight: '600',
  },
  lastMessageText: {
    marginTop: 4,
    color: '#808080',
    fontSize: 12,
    fontWeight: '300',
  },
  extraInfoContainer: {

  },
  timeText: {
    color: '#808080',
    fontSize: 12,
    fontWeight: '300',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E1',
    marginLeft: PHOTO_SIZE + PHOTO_CONTENT_SPACING + ROW_PADDING_LEFT,
    marginRight: 0,
  },
});
