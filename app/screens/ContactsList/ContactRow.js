import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import KJImage from '../../components/common/KJImage';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: ContactRow.js';
/* eslint-enable */

const ROW_PADDING_LEFT = 20;
const ROW_PADDING_RIGHT = 20;
const AVATAR_SIZE = 46;
const AVATAR_CONTENT_SPACING = 10;

// --------------------------------------------------
// ContactRow
// --------------------------------------------------

class ContactRow extends PureComponent {
  onPress = () => {
    this.props.onPress(this.props.user);
  }
  renderAvatar() {
    const { user } = this.props;
    return (
      <View style={styles.avatarContainer}>
        <KJImage
          style={styles.avatarImage}
          source={user.avatarImageURI()}
          defaultSource={user.avatarImagePlaceholder()}
          resizeMode="cover"
        />
        <View style={styles.status} />
      </View>
    );
  }
  renderContent() {
    const { user } = this.props;
    return (
      <Text style={styles.title}>
        {`${user.fullName}`}
      </Text>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        
        <View style={styles.rowContainer}>
          {this.renderAvatar()}
          {this.renderContent()}
        </View>
        
        <View style={styles.separator} />
        
        <TouchableOpacity
          style={styles.button}
          onPress={this.onPress}
        />
      </View>
    );
  }
}

ContactRow.defaultProps = {
  onPress: () => {},
};

export default ContactRow;

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
    paddingLeft: 20,
    paddingRight: 20,
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
  contentContainer: {
    flex: 0,
    paddingLeft: ROW_PADDING_LEFT,
    paddingRight: ROW_PADDING_RIGHT,
    paddingTop: 0,
    paddingBottom: 0,
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
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  status: {
    position: 'absolute',
    right: 8,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.0,
    borderColor: '#fff',
    backgroundColor: '#ff0',
  },
  button: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#f000',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E1',
    marginLeft: AVATAR_SIZE + AVATAR_CONTENT_SPACING + ROW_PADDING_LEFT,
    marginRight: 0,
  },
});
