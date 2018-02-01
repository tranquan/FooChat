/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  StatusBar,
  ScrollView,
  View,
  Text,
  Image
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Styles from '../../constants/styles';
import Strings from '../../constants/strings';
import KJButton from '../../components/common/KJButton';
import ContactsManager from '../../manager/ContactsManager';
import ChatManager from '../../manager/ChatManager';

import NavigationBar from './NavigationBar';
import ThreadRow from './ThreadRow';
import MemberRow from './MemberRow';
import TextRow from './TextRow';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: ChatSettings.js';
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
    };
  }
  componentWillMount() {
    StatusBar.setBarStyle('light-content', true);
    // cache current thread
    const { thread } = this.props.navigation.state.params;
    // update state
    this.setState({
      thread,
    });
  }
  componentDidMount() {
    
  }
  componentWillUnmount() {
    StatusBar.setBarStyle('dark-content', true);
  }
  // --------------------------------------------------
  onClosePress = () => {
    this.props.navigation.goBack();
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

  }
  removeMembers(members) {

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
