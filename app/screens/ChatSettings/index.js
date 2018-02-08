/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';

import Styles from 'app/constants/styles';
import Strings from 'app/constants/strings';
import KJButton from 'app/components/common/KJButton';
import TextInputBox from 'app/components/TextInputBox';
import ChatManager from 'app/manager/ChatManager';
import ImageUtils from 'app/utils/ImageUtils';
import { showInfoAlert } from 'app/utils/UIUtils';

import NavigationBar from './NavigationBar';
import ThreadRow from './ThreadRow';
import MemberRow from './MemberRow';
import TextRow from './TextRow';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = 'ChatSettings.js';
/* eslint-enable */

// --------------------------------------------------
// ChatSettings
// --------------------------------------------------

class ChatSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      thread: null,
      isNotificationOn: true,
      isFavoriteOn: false,
      isTextInputVisible: false,
      isSpinnerVisible: false,
    };
  }
  componentWillMount() {
    // cache current thread
    const navParams = this.props.navigation.state.params || {};
    const thread = navParams.thread || null;
    // update state
    this.setState({ thread });
  }
  // --------------------------------------------------
  onClosePress = () => {
    this.props.navigation.goBack();
  }
  onPhotoPress = () => {
    // don't allow update single thread title
    if (this.state.thread.isSingleThread()) {
      return;
    }
    // prompt image picker
    ImageUtils.pickAndUploadImage(
      256, 256, 
      (step) => {
        if (step === 'resize') {
          this.showSpinner();
        }
      }, null,
      (step, err) => {
        Utils.warn(`${LOG_TAG}: pickAndUploadImage err: ${step}`, err);
        this.hideSpinner();
        const message = step === 'pick' ? Strings.camera_access_error : Strings.update_thread_error;
        showInfoAlert(message);
      },
      (downloadURL) => {
        this.updateThreadMetadata(null, downloadURL);
      },
    );
  }
  onTitlePress = () => {
    // don't allow update single thread title
    if (this.state.thread.isSingleThread()) {
      return;
    }
    // prompt input
    this.showTextInput();
  }
  onNotificationToggle = (isOn) => {
    this.setState({
      isNotificationOn: isOn,
    });
  }
  onFavoriteToggle = (isOn) => {
    this.setState({
      isFavoriteOn: isOn,
    });
  }
  onRemoveMemberPress = (member) => {
    this.showSpinner();
    const asyncTask = async () => {
      try {
        const thread = this.state.thread;
        const result = 
          await ChatManager.shared().removeUsersFromGroupThread(thread.uid, [member.uid]);
        this.hideSpinner();
        if (!result) {
          setTimeout(() => {
            showInfoAlert(Strings.update_thread_error);
          }, 250);
        }
      } catch (err) {
        this.hideSpinner();
        setTimeout(() => {
          showInfoAlert(Strings.update_thread_error);
        }, 250);
      }
    };
    asyncTask();
  }
  onAddMemberPress = () => {
    const thread = this.state.thread;
    this.props.navigation.navigate('AddChatMember', { thread });
  }
  // --------------------------------------------------
  updateThreadMetadata(title = null, photoImage = null) {
    this.showSpinner();
    const asyncTask = async () => {
      try {
        const threadID = this.state.thread.uid;
        const result = await ChatManager.shared().updateGroupThreadMetadata(threadID, {
          title,
          photoImage,
        });
        this.hideSpinner();
        if (!result) {
          showInfoAlert(Strings.update_thread_error);
        } else {
          showInfoAlert(Strings.update_thread_success);
        }
      } catch (err) {
        this.hideSpinner();
        showInfoAlert(Strings.update_thread_error);
      }
    };
    asyncTask();
  }
  showTextInput() {
    this.setState({
      isTextInputVisible: true,
    });
  }
  hideTextInput() {
    this.setState({
      isTextInputVisible: false,
    });
  }
  showSpinner(text = 'Đang xử lý') {
    this.setState({
      isSpinnerVisible: true,
      spinnerText: text,
    });
  }
  hideSpinner() {
    this.setState({
      isSpinnerVisible: false,
    });
  }
  // --------------------------------------------------
  renderNavigationBar() {
    return (
      <NavigationBar
        onClosePress={this.onClosePress}
      />
    );
  }
  renderThreadDetails() {
    const { thread } = this.state;
    return (
      <View style={styles.threadDetailsCotainer}>
        <ThreadRow 
          thread={thread}
          onPhotoPress={this.onPhotoPress}
          onTitlePress={this.onTitlePress}
        />
      </View>
    );
  }
  renderSettings() {
    const {
      isNotificationOn,
      isFavoriteOn,
    } = this.state;
    return (
      <View style={styles.settingsContainer}>
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeaderText}>
            {'Cài đặt tin nhắn'}
          </Text>
        </View>
        <TextRow
          title={'Hình nền'}
          details={''}
          isArrowHidden={false}
        />
        <TextRow
          title={'Thông báo'}
          details={''}
          switchValue={isNotificationOn}
          isSwitchHidden={false}
          onSwitchValueChange={this.onNotificationToggle}
        />
        <TextRow
          title={'Thêm vào danh sách yêu thích'}
          details={''}
          switchValue={isFavoriteOn}
          isSwitchHidden={false}
          isSeparatorHidden
          onSwitchValueChange={this.onFavoriteToggle}
        />
      </View>
    );
  }
  renderMembers() {
    // don't render member of single thread
    const { thread } = this.state;
    if (thread.isSingleThread()) { return null; } 
    // render
    const members = thread.getUsersArray();
    for (let i = 0; i < members.length; i += 1) {
      if (members[i].isMe()) {
        if (i === 0) { break; }
        const temp = members[0];
        members[0] = members[i];
        members[i] = temp;
        break;
      }
    }
    return (
      <View style={styles.membersContainer}>
        { this.renderMembersSectionHeader() }
        { members.map(user => this.renderMember(user)) }
      </View>
    );
  }
  renderMembersSectionHeader() {
    const { thread } = this.state;
    const members = thread.getUsersArray();
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderText}>
          {`Thành viên (${members.length})`}
        </Text>
        <Text 
          style={{ 
            fontSize: 12, 
            color: '#7f7f7f', 
            paddingTop: 4, 
            marginRight: 4,
          }}
        >
          {'Thêm Thành viên'}
        </Text>
        <KJButton
          containerStyle={{}}
          leftIconSource={require('./img/add_contact.png')}
          leftIconStyle={{ marginLeft: 0 }}
          onPress={this.onAddMemberPress}
        />
      </View>
    );
  }
  renderMember(user) {
    const myUser = this.props.myUser;
    const thread = this.state.thread;
    const isDeleteAble = thread.adminID === myUser.uid && user.uid !== myUser.uid;
    return (
      <MemberRow
        key={user.uid}
        user={user}
        isDeleteButtonHidden={!isDeleteAble}
        onDeletePress={this.onRemoveMemberPress}
      />
    );
  }
  renderSharedContent() {
    return (
      <View style={styles.sharedContentContainer}>
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeaderText}>
            {'Media'}
          </Text>
        </View>
        <TextRow
          title={'Hình ảnh chung'}
          details={'0'}
          isArrowHidden={false}
        />
        <TextRow
          title={'Tệp tin'}
          details={'0'}
          isArrowHidden={false}
        />
        <TextRow
          title={'Link chia sẻ'}
          details={'0'}
          isArrowHidden={false}
          isSeparatorHidden
        />
      </View>
    );
  }
  renderCommands() {
    const { thread } = this.state;
    const isLeaveGroupVisible = thread.isGroupThread();
    return (
      <View style={styles.commandsContainer}>
        <TextRow
          title={'Xóa tin nhắn'}
          details={''}
          isSeparatorHidden={!isLeaveGroupVisible}
        />
        {
          !isLeaveGroupVisible ? null :
            <TextRow
              title={'Rời khỏi nhóm'}
              titleStyle={{ color: '#d0021b' }}
              details={''}
              isSeparatorHidden
            />
        }
      </View>
    );
  }
  renderTextInputBox() {
    const { isTextInputVisible } = this.state;
    const groupName = this.state.thread.title;
    return (
      <Modal
        isVisible={isTextInputVisible}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropOpacity={0.5}
      >
        <TextInputBox
          title={'Đổi tên nhóm'}
          initInputValue={groupName}
          inputPlaceholder={'Tên nhóm'}
          onYesPress={(text) => {
            const newGroupName = text.trim();
            if (newGroupName.length <= 0) { return; }
            this.hideTextInput();
            setTimeout(() => {
              this.updateThreadMetadata(newGroupName);
            }, 250);
          }}
          onCancelPress={() => {
            this.hideTextInput();
          }}
        />
      </Modal>
    );
  }
  renderSpinner() {
    const {
      isSpinnerVisible,
      spinnerText,
    } = this.state;
    return (
      <Spinner
        visible={isSpinnerVisible}
        textContent={spinnerText}
        textStyle={{ marginTop: 4, color: '#fff' }}
        overlayColor="#00000080"
      />
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderNavigationBar()}
        <ScrollView 
          style={styles.scrollView}
        >
          {this.renderThreadDetails()}
          {this.renderSettings()}
          {this.renderMembers()}
          {this.renderSharedContent()}
          {this.renderCommands()}
          {this.renderTextInputBox()}
          {this.renderSpinner()}
        </ScrollView>
      </View>
    );
  }
}

// --------------------------------------------------

ChatSettings.navigationOptions = () => ({
  title: 'ChatSettings',
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#fff',
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

ChatSettings.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ChatSettings);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  threadDetailsCotainer: {
    flex: 0,
    paddingTop: 12,
    backgroundColor: '#f5f5f5',
  },
  settingsContainer: {
    flex: 0,
    paddingTop: 12,
    backgroundColor: '#f5f5f5',
  },
  membersContainer: {
    flex: 0,
    paddingTop: 12,
    backgroundColor: '#f5f5f5',
  },
  sharedContentContainer: {
    flex: 0,
    paddingTop: 12,
    backgroundColor: '#f5f5f5',
  },
  commandsContainer: {
    flex: 0,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  sectionHeaderContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 4,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#fff',
  },
  sectionHeaderText: {
    flex: 1,
    color: '#7f7f7f',
    backgroundColor: '#0000',
    fontSize: 14,
    fontWeight: '600',
  },
});
