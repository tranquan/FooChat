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

import ImageResizer from 'react-native-image-resizer';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';

import Styles from '../../constants/styles';
import Strings from '../../constants/strings';
import KJButton from '../../components/common/KJButton';
import TextInputBox from '../../components/TextInputBox';
import ChatManager from '../../manager/ChatManager';
import FirebaseStorage from '../../network/FirebaseStorage';
import { showAlert } from '../../utils/UIUtils';

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
      isNotificationOn: true,
      isFavoriteOn: false,
      isTextInputVisible: false,
      isSpinnerVisible: false,
    };
  }
  componentWillMount() {
    // cache current thread
    const navParams = this.props.navigation.state.params || {};
    const thread = navParams.thread;
    // update state
    this.setState({
      thread,
    });
  }
  // --------------------------------------------------
  onClosePress = () => {
    this.props.navigation.goBack();
  }
  onPhotoPress = () => {
    this.pickImage()
      .then(response => {
        // user cancel
        if (response === null) { return; }
        // resize image & upload
        this.showSpinner();
        this.resizeImage(response.uri, 256, 256)
          .then(imageURI => {
            this.uploadImage(imageURI);
          })
          .catch((err) => {
            Utils.warn(`${LOG_TAG} resizeImage error: `, err);
            this.hideSpinner();
            setTimeout(() => {
              showAlert(Strings.camera_access_error);
            }, 250);
          });
      })
      .catch((err) => {
        Utils.warn(`${LOG_TAG} pickImage error: `, err);
        this.hideSpinner();
        setTimeout(() => {
          showAlert(Strings.camera_access_error);
        }, 250);
      });
  }
  onTitlePress = () => {
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
  onRemoveMember = (member) => {
    this.removeMembers([member]);
  }
  onAddMember = () => {
    // open add member
  }
  // --------------------------------------------------
  addMembers(members) {
    ChatManager.shared().addUsersToGroupThread();
  }
  removeMembers(members) {

  }
  pickImage() {
    const title = 'Cập nhật hình đại diện';
    return new Promise((resolve, reject) => {
      const ImagePicker = require('react-native-image-picker');
      const options = {
        title,
        cancelButtonTitle: 'Đóng',
        takePhotoButtonTitle: 'Chụp hình mới',
        chooseFromLibraryButtonTitle: 'Chọn từ Album',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      ImagePicker.showImagePicker(options, (response) => {
        if (response.error) {
          reject(response.error);
        } else if (response.didCancel) {
          resolve(null);
        } else {
          resolve(response);
        }
      });
    });
  }
  resizeImage(fileURI, width = 512, height = 512) {
    return ImageResizer.createResizedImage(fileURI, width, height, 'JPEG', 80)
      .then((response) => {
        return response.uri;
      })
      .catch((error) => {
        Utils.warn(`${LOG_TAG} resizeImage error: `, error);
        return Promise.reject(error);
      });
  }
  uploadImage(fileURI) {
    const threadID = this.state.thread.uid;
    let uploadTask = null;
    // create upload task
    uploadTask = FirebaseStorage.uploadChatImage(threadID, fileURI);
    if (!uploadTask) { return; }
    // upload
    uploadTask.on('state_changed', (snapshot) => { // eslint-disable-line
      // progress
      // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // Utils.log(`${LOG_TAG} uploadImage progress: ${progress} %`);
    }, (error) => {
      // error
      Utils.warn(`${LOG_TAG} uploadImage: error: `, error);
      this.hideSpinner();
      setTimeout(() => {
        showAlert(Strings.upload_image_error);
      }, 250);
    }, (snapshot) => {
      // success
      Utils.log(`${LOG_TAG} uploadImage: `, snapshot);
      const photoImage = snapshot.downloadURL;
      this.updateThreadMetadata(null, photoImage);
      this.hideSpinner();
    });
  }
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
        setTimeout(() => {
          if (!result) {
            showAlert(Strings.update_thread_error);
          }
        }, 250);
      } catch (err) {
        this.hideSpinner();
        setTimeout(() => {
          showAlert(Strings.update_thread_error);
        }, 250);
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
          onPress={this.onAddMoreMemberPress}
        />
      </View>
    );
  }
  renderMember(user) {
    const myUser = this.props.myUser;
    return (
      <MemberRow
        key={user.uid}
        user={user}
        isDeleteButtonHidden={user.uid === myUser.uid}
        onDeletePress={this.onRemoveMember}
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
            }, 500);
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
