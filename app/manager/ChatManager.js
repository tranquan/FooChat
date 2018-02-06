/**
 * Handle Chat
 * - Subscribe all needed threas to update message
 * - Thread, Message objects return from this class are already set with Thread, Message prototype
 * - Handle chat policy logic: admin, group 
 */
/**
 * TODO:
 * - before subscribe a path, check if it already in mSubscribePaths
 */

import firebase from 'react-native-firebase';

import FirebaseDatabase from '../network/FirebaseDatabase';
import { User, Message, Thread } from '../models';

export const CHAT_EVENTS = {
  MY_USER_CHANGE: 'MY_USER_CHANGE',
  NEW_MESSAGE: 'NEW_MESSAGE',
  NEW_THREAD: 'NEW_THREAD',
  THREAD_CHANGE: 'THREAD_CHANGE',
  THREAD_USERS_CHANGE: 'THREAD_USERS_CHANGE',
};

/* eslint-disable */
import Utils from '../utils/Utils';
const LOG_TAG = 'ChatManager.js';
/* eslint-enable */

const INITIAL_THREADS_LOAD = 255; // initial threads will be loaded on the beginning
const INITIAL_MESSAGES_LOAD = 255; // initial messages will be loaded on the beginning

function initChatManager() {
  
  // PRIVATE
  // --------------------------------------------------

  let mMyUser = {};
  let mObservers = {};
  const mSubscribePaths = {};
  // const mThreadLastMessages = {};

  function mUpdateMyUser() {
    FirebaseDatabase.updateUser(mMyUser.uid, mMyUser);
  }

  // EVENT HANDLERs
  // --------------------

  const onNewThread = (snapshot) => {
    // Utils.log(`${LOG_TAG}: onNewThread: ${snapshot.key}`, snapshot.val());
    // check thread
    const threadID = snapshot.key;
    if (!threadID) { return; }
    // fetch thread
    const asyncTask = async () => {
      try {
        const threadJSON = await FirebaseDatabase.getThread(threadID);
        const thread = Object.assign(new Thread(), threadJSON);
        mNotifyObservers(CHAT_EVENTS.NEW_THREAD, thread);
        // mSubscribeMyThreadsChangeForThread(thread.uid);
        mSubscribeNewMessageInThread(thread.uid);
      } catch (err) {
        Utils.warn(`onNewThread: exception: ${err}`, err);
      }
    };
    asyncTask();
  };

  const onThreadChange = (snapshot) => {

  };

  const onThreadUsersChange = (snapshot) => {

  }

  const onNewMessage = (snapshot) => {
    // Utils.log(`${LOG_TAG}: onNewMessage: ${snapshot.key}`, snapshot.val());
    const messageJSON = snapshot.val();
    const message = Object.assign(new Message(), messageJSON);
    const threadID = snapshot.ref.parent.parent.key;
    mNotifyObservers(CHAT_EVENTS.NEW_MESSAGE, message, threadID);
  };

  // EVENT SUBSCRIBEs
  // --------------------

  /**
   * listen for /users/<my_user_id> -> `value`
   * - to support login in on multiple devices
   */
  // function mSubscribeMyUserChange() {
  //   const usersRef = FirebaseDatabase.getUsersRef();
  //   usersRef.child(`${mMyUser.uid}`)
  //     .limitToLast(1)
  //     .on('value', (snapshot) => {
  //       const user = snapshot.val();
  //       mNotifyObservers(CHAT_EVENTS.MY_USER_CHANGE, user);
  //     });
  // }

  /**
   * for each of my thread
   * listen for /threads/<my_thread_id> -> `value`
   * - to support thread meta data change
   */
  function mSubscribeMyThreadsChange() {
    const asyncTask = async () => {
      try {
        const threads = await FirebaseDatabase.getThreadsOfUser(mMyUser.uid);
        for (let i = 0; i < threads.length; i += 1) {
          const thread = threads[i];
          mSubscribeMyThreadsChangeForThread(thread.uid);
        }
      } catch (err) {
        Utils.warn('mSubscribeMyThreadsChange: error', err);
      }
    };
    asyncTask();
  }

  /**
   * listen for /threads/<my_thread_id> -> `value`
   * - to support thread meta data change
   */
  function mSubscribeMyThreadsChangeForThread(threadID) {
    // subscribe
    const threadRef = FirebaseDatabase.getThreadsRef();
    threadRef.child(threadID)
      .on('value', (snapshot) => {
        const thread = snapshot.val();
        mNotifyObservers(CHAT_EVENTS.THREAD_CHANGE, thread);
      });
    // keep track to remove later
    // const path = `${threadRef.key}/${threadID}`;
    // mSubscribePaths.push(path);
    // Utils.log(`mSubscribeMyThreadsChangeForThread: subscribe path: ${path}`);
  }

  /**
   * listen for /users/<my_user_id>/threads -> `child_added`
   * - to support add/remove user
   */
  function mSubscribeNewThread() {
    // Utils.log(`${LOG_TAG}: mSubscribeNewThread:`);
    const usersThreadsRef = FirebaseDatabase.getUsersThreadsRef();
    const fbUserID = FirebaseDatabase.firebaseUserID(mMyUser.uid);
    // un-subscribe old path
    const path = `${usersThreadsRef.key}/${fbUserID}/threads`;
    mUnSubScribeChatPath(path);
    // subscribe
    usersThreadsRef.child(`${fbUserID}/threads`)
      .orderByChild('updateTime')
      .limitToLast(INITIAL_THREADS_LOAD)
      .on('child_added', onNewThread);
    // track to un-subscribe later
    mSubscribePaths[path] = true;
  }

  /**
   * for each of my thread
   * listen for /threads/<my_thread_id>/users -> `child_added`, `child_removed`
   * - to support invite/remove me in a thread
   */
  // function mSubscribeThreadUsersChange() {
  //   const asyncTask = async () => {
  //     try {
  //       const threadsMessagesRef = FirebaseDatabase.getThreadsMessagesRef();
  //       const threads = await FirebaseDatabase.getThreadsOfUser(mMyUser.uid);
  //       for (let i = 0; i < threads.length; i += 1) {
  //         const thread = threads[i];
  //         threadsMessagesRef.child(`${thread.uid}/users`)
  //           .on('child_added', (snapshot) => {
  //             const user = snapshot.val();
  //           });
  //         threadsMessagesRef.child(`${thread.uid}/users`)
  //           .on('child_removed', (snapshot) => {
  //             const user = snapshot.val();
  //           });
  //       }
  //     } catch (err) {
  //       Utils.warn('mSubscribeThreadUsersChange: error', err);
  //     }
  //   };
  //   asyncTask();
  // }

  /**
   * for each of my thread
   * listen for /threads_messages/<my_thread_id>/messages -> `child_added`
   * - to support new message
   */
  function mSubscribeNewMessage() {
    const asyncTask = async () => {
      try {
        const threads = await FirebaseDatabase.getThreadsOfUser(mMyUser.uid);
        if (!threads) { 
          Utils.warn(`${LOG_TAG}: mSubscribeNewMessage: threads is null:`);
          return;
        }
        for (let i = 0; i < threads.length; i += 1) {
          const thread = threads[i];
          mSubscribeNewMessageInThread(thread.uid);
        }
      } catch (err) {
        Utils.warn(`${LOG_TAG}: mSubscribeNewMessage: exc:`, err);
      }
    };
    asyncTask();
  }

  function mSubscribeNewMessageInThread(threadID) {
    // Utils.log(`${LOG_TAG}: subscribeNewMessageInThread: ${threadID}`);
    const threadsMessagesRef = FirebaseDatabase.getThreadsMessagesRef();
    // un-subscribe old path
    const path = `${threadsMessagesRef.key}/${threadID}/messages`;
    mUnSubScribeChatPath(path);
    // subscribe
    threadsMessagesRef.child(`${threadID}/messages`)
      .orderByChild('updateTime')
      .limitToLast(INITIAL_MESSAGES_LOAD)
      .on('child_added', onNewMessage);
    // track to un-subscribe later
    mSubscribePaths[path] = true;
  }

  /**
   * Un-Subscribe event at full path /chat/<path>
   */
  function mUnSubScribeChatPath(path) {
    // Utils.log(`${LOG_TAG}: mUnSubScribePath: ${path}`);
    // is subscribe before
    if (!mSubscribePaths[path]) {
      return;
    }
    // un-subscribe
    mSubscribePaths[path] = null;
    const chatRef = FirebaseDatabase.getChatRef();
    chatRef.child(path).off();
  }

  /**
   * Un-Subscribe event at all paths in mSubscribePaths
   */
  function mUnSubscribeAllChatPaths() {
    // Utils.log(`${LOG_TAG}: mUnSubscribeAllChatPaths:`);
    const chatRef = FirebaseDatabase.getChatRef();
    const paths = Object.keys(mSubscribePaths);
    for (let i = 0; i < paths.length; i += 1) {
      const path = paths[i];
      mSubscribePaths[path] = null;
      chatRef.child(path).off();
    }
  }

  /**
   * notify observers
   * @param {string} name 
   * @param {array} args 
   */
  function mNotifyObservers(name, ...args) {
    const observers = mObservers[name];
    if (observers) {
      for (let j = 0; j < observers.length; j += 1) {
        const item = observers[j];
        if (item.callback) {
          item.callback.call(item.target, ...args);
        }
      }
    }
  }
  
  // PUBLIC
  // --------------------------------------------------
  
  return {
    initChat() {
    },
    deinitChat() {
    },
    goOnline() {
      FirebaseDatabase.getDatabase().goOnline();
    },
    goOffline() {
      FirebaseDatabase.getDatabase().goOffline();
      FirebaseDatabase.getConnectedRef().off();
      mUnSubscribeAllChatPaths();
    },
    setup(user) {

      mMyUser = user;
      mObservers = {};

      // init static vars
      User.setupMyUser(user);
      Thread.setupMyUser(user);
      Message.setupMyUser(user);

      // update my user
      mUpdateMyUser();
      
      // mSubscribeMyUserChange();
      // mSubscribeMyThreadsChange();
      mSubscribeNewThread();
      mSubscribeNewMessage();
      // mSubscribeNewMessage();
      // mSubscribeThreadUsersChange();
    },
    addObserver(name, target, callback) {
      // Utils.log(`addObserver: ${name}, callback: ${callback}`);
      let list = mObservers[name];
      if (!list) {
        list = [];
      }
      list.push({ callback });
      mObservers[name] = list;
    },
    removeObserver(name, target) {
      // Utils.log(`removeObserver: ${name}, callback: ${callback}`);
      const list = mObservers[name];
      if (list) {
        let removeIndex = -1;
        for (let i = 0; i < list.length; i += 1) {
          const item = list[i];
          if (item.target === target) {
            removeIndex = i;
            break;
          }
        }
        if (removeIndex) {
          list.splice(removeIndex, 1);
        }
      }
      mObservers[name] = list;
    },
    // --------------------------------------------------
    async getThread(threadID) {
      const thread = await FirebaseDatabase.getThread(threadID);
      return Object.assign(new Thread(), thread);
    },
    async getMyThreads(fromUpdateTime = null, maxThreadsFetch = 44) {
      const threads = 
        await FirebaseDatabase.getThreadsOfUser(mMyUser.uid, fromUpdateTime, maxThreadsFetch);
      return threads.map(thread => {
        return Object.assign(new Thread(), thread);
      });
    },
    async createSingleThreadWithTarget(target) {
      const thread = await FirebaseDatabase.createSingleThread(mMyUser, target);
      if (!thread) { 
        return null;
      }
      return Object.assign(new Thread(), thread);
    },
    async createGroupThread(users, metaData) {
      metaData.adminID = mMyUser.uid;
      const thread = await FirebaseDatabase.createGroupThread(users, metaData);
      if (!thread) { 
        return null; 
      }
      return Object.assign(new Thread(), thread);
    },
    async updateGroupThreadMetadata(threadID, metaData) {
      return FirebaseDatabase.updateGroupThreadMetadata(threadID, metaData);
    },
    async setThreadAdmin(threadID, userID) {
      const results = await FirebaseDatabase.setThreadAdmin(threadID, userID);
      return results;
    },
    async addUsersToGroupThread(threadID, users) {
      // add
      const result = FirebaseDatabase.addUsersToGroupThread(threadID, users);
      if (!result) {
        return false
      }
      // add a notice message remove by admin
      const notice = Message.newNoticeMessage('users added by admin');
      await FirebaseDatabase.sendMessage(notice, threadID);
    },
    async removeUsersFromGroupThread(threadID, userIDs) {
      // get thread
      const thread = await FirebaseDatabase.getThread(threadID);
      if (!thread) { 
        return false; 
      }
      // only allow to remove if admin is me
      if (thread.adminID !== mMyUser.uid) {
        return false;
      }
      // remove
      const result = await FirebaseDatabase.removeUsersFromGroupThread(threadID, userIDs);
      if (!result) {
        return false
      }
      // add a notice message remove by admin
      const notice = Message.newNoticeMessage('users removed by admin');
      await FirebaseDatabase.sendMessage(notice, threadID);
    },
    async leaveGroupThread(threadID) {
      // get thread
      const thread = await FirebaseDatabase.getThread(threadID);
      if (!thread) {
        return false;
      }
      // update thread members
      const results = await FirebaseDatabase.removeUsersFromGroupThread(threadID, [mMyUser.uid]);
      if (!results) {
        return false;
      }
      // re-assing admin if I am admin
      if (thread.adminID === mMyUser.uid) {
        const members = thread.users();
        const newAdminID = '';
        for (let i = 0; i < members.length; i += 1) {
          const member = members[i];
          if (member.uid !== mMyUser.uid) {
            newAdminID = member.uid;
            break;
          }
        }
        if (newAdminID.length > 0) {
          FirebaseDatabase.setThreadAdmin(threadID, newAdminID);
        }
      }
    },
    async sendMessage(message, threadID) {
      const myMessage = { ...message, authorID: mMyUser.uid };
      const newMessage = await FirebaseDatabase.sendMessage(myMessage, threadID);
      if (!newMessage) {
        return null;
      }
      return Object.assign(new Message(), newMessage);
    },
    async getMessagesInThread(threadID, fromCreateTime = null, maxMessages = 65) {
      const messages = 
        await FirebaseDatabase.getMessagesInThread(threadID, fromCreateTime, maxMessages);
      return messages.map(message => {
        return Object.assign(new Message(), message);
      });
    },
  };
}
 
// --------------------------------------------------

function initSingletonChatManager() {
  let instance;
  return {
    shared() {
      if (!instance) {
        instance = initChatManager();
        instance.initChat();
      }
      return instance;
    },
  };
}

// --------------------------------------------------

const ChatManager = initSingletonChatManager();
export default ChatManager;
