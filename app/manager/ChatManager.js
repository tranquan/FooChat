/**
 * Handle Chat
 * - Subscribe all needed threas to update message
 * - Thread, Message objects return from this class are already set with Thread, Message prototype
 */

import RealtimeDatabase from '../firebase/RealtimeDatabase';
import Utils from '../utils/Utils';
import Message from '../models/Message';
import Thread from '../models/Thread';

export const CHAT_EVENTS = {
  NEW_MESSAGE: 'NEW_MESSAGE',
  NEW_THREAD: 'NEW_THREAD',
  THREAD_CHANGE: 'THREAD_CHANGE',
  THREAD_USERS_CHANGE: 'THREAD_USERS_CHANGE',
};

function initChatManager() {
  
  // PRIVATE
  // --------------------------------------------------

  let mMyUser = '';
  let mObservers = {};

  function mSetupEvents(userID) {
    // 1. listen for users/<my_user_id> -> `value`

    // 2. listen for users/<my_user_id>/threads -> `child_added`

    // 3. listen for threads/<my_thread_id>/messages -> `child_added`
    // => to get update when a new message arrives

    // 4. listen for threads/<my_thread_id>/users -> `child_added`, `child_removed`
    // => get update when user join, leaves group

    // 5. for each user in group, listen for /threads/<my_thread_id>/users -> value
  }

  // function subscribeMyUser() {

  // }

  /**
   * listen for users/<my_user_id>/threads -> `child_added`
   */
  function mSubscribeNewThread() {
    const asyncTask = async () => {
      try {
        const usersRef = RealtimeDatabase.getUsersRef();
        usersRef.child(`${mMyUser.uid}/threads`)
          .limitToLast(1)
          .on('child_added', (snapshot) => {
            const thread = snapshot.val();
            mNotifyObservers(CHAT_EVENTS.NEW_THREAD, thread);
          });
      } catch (err) {
        Utils.warn('mSubscribeNewThread: error', err);
      }
    };
    asyncTask();
  }

  /**
   * listen for threads/<my_thread_id>/messages -> `child_added`
   */
  function mSubscribeIncomingMessage() {
    const asyncTask = async () => {
      try {
        const threadsMessagesRef = RealtimeDatabase.getThreadsMessagesRef();
        const threads = await RealtimeDatabase.getThreadsOfUser(mMyUser.uid);
        for (let i = 0; i < threads.length; i += 1) {
          const thread = threads[i];
          threadsMessagesRef.child(`${thread.uid}/messages`)
            .limitToLast(1)
            .on('child_added', (snapshot) => {
              const message = snapshot.val();
              const threadID = snapshot.ref.parent.parent.key;
              mNotifyObservers(CHAT_EVENTS.NEW_MESSAGE, message, threadID);
            });
        }
      } catch (err) {
        Utils.warn('mSubscribeIncomingMessage: error', err);
      }
    };
    asyncTask();
  }

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
    setup(user) {

      mMyUser = user;
      mObservers = {};
      
      Thread.setup(user);
      Message.setup(user);

      mSubscribeNewThread();
      mSubscribeIncomingMessage();
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
      const thread = await RealtimeDatabase.getThread(threadID);
      return thread;
    },
    async getMyThreads(fromUpdateTime) {
      const threads = await RealtimeDatabase.getThreadsOfUser('1', fromUpdateTime);
      return threads.map(thread => {
        return Object.assign(new Thread(), thread);
      });
    },
    async createSingleThreadWithTarget(target) {
      const thread = await RealtimeDatabase.createSingleThread(mMyUser, target);
      if (!thread) { 
        return null;
      }
      return Object.assign(new Thread(), thread);
    },
    async createGroupThread(users, metaData) {
      const thread = await RealtimeDatabase.createGroupThread(users, metaData);
      if (!thread) {
        return null;
      }
      return Object.assign(new Thread(), thread);
    },
    async sendMessage(message, threadID) {
      const myMessage = { ...message, authorID: mMyUser.uid };
      const newMessage = await RealtimeDatabase.sendMessage(myMessage, threadID);
      if (!newMessage) {
        return null;
      }
      return Object.assign(new Message(), newMessage);
    },
    async getMessagesInThread(threadID, fromMessage = null, maxMessages = 44) {
      const messages = 
        await RealtimeDatabase.getMessagesInThread(threadID, fromMessage, maxMessages);
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
