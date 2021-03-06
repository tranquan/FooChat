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
  TouchableOpacity,
} from 'react-native';

import Styles from '../../constants/styles';
import KJButton from '../../components/common/KJButton';
import KJImage from '../../components/common/KJImage';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'ContactRow.js';
/* eslint-enable */

const ROW_PADDING_LEFT = 20;
const ROW_PADDING_RIGHT = 20;
const AVATAR_SIZE = 46;
const AVATAR_CONTENT_SPACING = 10;

// --------------------------------------------------
// MemberRow
// --------------------------------------------------

class MemberRow extends PureComponent {
  onDeletePress = () => {
    this.props.onDeletePress(this.props.user);
  }
  // --------------------------------------------------
  renderAvatar() {
    const { user } = this.props;
    const presenceStatusColor = user.presenceStatusColor();
    return (
      <View style={styles.avatarContainer}>
        <KJImage
          style={styles.avatarImage}
          source={user.avatarImageURI()}
          defaultSource={user.avatarImagePlaceholder()}
          resizeMode="cover"
        />
        <View
          style={[
            styles.status,
            { backgroundColor: presenceStatusColor },
          ]}
        />
      </View>
    );
  }
  renderContent() {
    const { user } = this.props;
    const isMe = user.isMe() ? ' (Tôi)' : '';
    return (
      <Text style={styles.titleText}>
        {`${user.fullName}${isMe}`}
      </Text>
    );
  }
  renderDeleteButton() {
    const { isDeleteButtonHidden } = this.props;
    if (isDeleteButtonHidden) { return null; }
    return (
      <KJButton
        containerStyle={styles.deleteButton}
        title={'Xóa'}
        titleStyle={styles.deleteButtonTitle}
        onPress={this.onDeletePress}
      />
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          {this.renderAvatar()}
          {this.renderContent()}
          {this.renderDeleteButton()}
        </View>
        <View style={styles.separator} />
      </View>
    );
  }
}

MemberRow.defaultProps = {
  isDeleteButtonHidden: false,
  onDeletePress: () => {},
};

export default MemberRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#fff',
  },
  rowContainer: {
    flex: 0,
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: ROW_PADDING_LEFT,
    paddingRight: ROW_PADDING_RIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatarContainer: {
    flex: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 10,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#fff',
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2.0,
    borderWidth: 1.0,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  titleText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '300',
  },
  status: {
    position: 'absolute',
    right: 8,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#fff',
    backgroundColor: '#ff0',
  },
  deleteButton: {
    flex: 0,
    width: 48,
    height: 26,
    borderColor: '#d0021b',
    borderWidth: 1.0,
    borderRadius: 4.0,
  },
  deleteButtonTitle: {
    fontSize: 14,
    color: '#d0021b',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E1',
    marginLeft: AVATAR_SIZE + AVATAR_CONTENT_SPACING + ROW_PADDING_LEFT,
    marginRight: 0,
  },
});
