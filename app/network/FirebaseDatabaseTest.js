import FirebaseDatabase from './FirebaseDatabase';
import User from '../models/User';
import Thread from '../models/Thread';
import Utils from '../utils/Utils';

// TEST DATA
// --------------------------------------------------

const USER_1 = {
  uid: '1',
  name: 'User 1',
};

const USER_2 = {
  uid: '2',
  name: 'User 2',
};

const USER_3 = {
  uid: '3',
  name: 'User 3',
};

// --------------------------------------------------

const MESSAGE_1 = {
  type: 'text',
  text: 'hello, this is message 2',
};

const MESSAGE_2 = {
  type: 'image',
  text: 'my photo',
  imageURLs: [
    'http://google.com/127312.png',
    'http://google.com/127332.png',
  ],
};

// --------------------------------------------------

class FirebaseDatabaseTest {

  static test() {
    setTimeout(() => {
      const asyncTask = async () => {
        try {

          // FirebaseDatabaseTest.testSetThreadAdmin();

        } catch (err) {
          Utils.log(`test exception: ${err}`);
        }
      };
      asyncTask();
    }, 2000);
  }

  // CONTACTS TEST
  // --------------------------------------------------

  static testUpdateUser() {
    const asyncTask = async () => {
      try {
        const contacts = Utils.getTestContacts();
        const me = contacts[0];
        const result = await FirebaseDatabase.updateUser(me.uid, me);
        Utils.log(`testUpdateUser PASSED: ${result}`);
      } catch (err) {
        Utils.log(`testUpdateUser FAILED: ${err}`);
      }
    };
    asyncTask();
  }

  // THREAD TEST
  // --------------------------------------------------
  
  static testAllSingleThreadFunctions() {

  }

  static testCreateSingleThread() {
    const asyncTask = async () => {
      try {
        const thread = await FirebaseDatabase.createSingleThread(USER_1, USER_2);
        Utils.log('create single thread PASSED: ', thread);
      } catch (err) {
        Utils.log(`create single thread FAILED: ${err}`);
      }
    };
    asyncTask();
  }

  static testCreateGroupThread() {
    const asyncTask = async () => {
      try {
        const users = [USER_1, USER_2];
        const metaData = { title: 'group 1', photoURL: 'http://image.png' };
        const thread = await FirebaseDatabase.createGroupThread(users, metaData);
        Utils.log('create group thread PASSED: ', thread);
      } catch (err) {
        Utils.log(`create group thread FAILED: ${err}`);
      }
    };
    asyncTask();
  }

  static testGetGroupThread(threadID) {
    const asyncTask = async () => {
      try {
        const thread = await FirebaseDatabase.getThread(threadID);
        const users = thread.users;
        const messages = thread.messages;
        Utils.log(`testGetGroupThread users: ${Array.isArray(users)}`);
        Utils.log(`testGetGroupThread messages: ${Array.isArray(messages)}`);
      } catch (err) {
        Utils.log(`testGetGroupThread FAILED: ${err}`);
      }
    };
    asyncTask();
  }

  static testAddUserToGroupThread(threadID, users) {
    const asyncTask = async () => {
      try {
        // add user
        await FirebaseDatabase.addUsersToGroupThread(threadID, users);
        // check if users added
        const thread = await FirebaseDatabase.getThread(threadID);
        const threadUsers = thread.users;
        for (let i = 0; i < users.length; i += 1) {
          const item = users[i];
          const userID = item.uid;
          if (!threadUsers[userID]) {
            Utils.log(`testAddUserToGroupThread FAILED: missing user: ${userID}`);
            break;
          }
        }
        Utils.log(`testAddUserToGroupThread PASSED: ${thread.uid}`);
      } catch (err) {
        Utils.log(`testAddUserToGroupThread FAILED: ${err}`);
      }
    };
    asyncTask();
  }

  static testRemoveUserFromGroupThread(threadID, userIDs) {
    const asyncTask = async () => {
      try {
        // add user
        await FirebaseDatabase.removeUsersFromGroupThread(threadID, userIDs);
        // check if users removed
        const thread = await FirebaseDatabase.getThread(threadID);
        const threadUsers = thread.users;
        for (let i = 0; i < userIDs.length; i += 1) {
          const userID = userIDs[i];
          if (threadUsers[userID]) {
            Utils.log(`testRemoveUserFromGroupThread FAILED: missing user: ${userID}`);
            break;
          }
        }
        Utils.log(`testRemoveUserFromGroupThread PASSED: ${thread.uid}`);
      } catch (err) {
        Utils.log(`testAddUserToGroupThread FAILED: `, err);
      }
    };
    asyncTask();
  }

  static testSetThreadAdmin() {
    const asyncTask = async () => {
      try {
        const result = await FirebaseDatabase.setThreadAdmin('-L3yTMe9_LRd6zkUpKaB', '1');
      } catch (err) {
        Utils.log(`testSetThreadAdmin FAILED: `, err);
      }
    };
    asyncTask();
  }

  static testUpdateThreadMetaData(threadID, metaData) {
    const asyncTask = async () => {
      try {
        await FirebaseDatabase.mUpdateThreadMetaData(threadID, metaData);
      } catch (err) {
        Utils.log(`testAddUserToGroupThread FAILED: ${err}`);
      }
    };
    asyncTask();
  }

  // MESSAGE TEST
  // --------------------------------------------------

  static testSendMessage(message, threadID) {
    const asyncTask = async () => {
      try {
        const newMessage = await FirebaseDatabase.sendMessage(message, threadID);
        if (newMessage) {
          Utils.log('testSendMessage PASSED');
        } else {
          Utils.log('testSendMessage FAILED');
        }
      } catch (err) {
        Utils.log(`testSendMessage error: ${err}`);
      }
    };
    asyncTask();
  }

  static testSendManyMessages(threadID) {
    const asyncTask = async () => {
      try {
        for (let i = 0; i < 50; i += 1) {
          let message = MESSAGE_1;
          if (i % 2 === 0) {
            message = { ...MESSAGE_1, text: `${MESSAGE_1.text} [${i}]` };
          } else {
            message = { ...MESSAGE_2, text: `${MESSAGE_2.text} [${i}]` };
          }
          FirebaseDatabase.sendMessage(message, threadID);
        }
        Utils.log('testSendManyMessages PASSED');
      } catch (err) {
        Utils.log(`testSendManyMessages error: ${err}`);
      }
    };
    asyncTask();
  }

  static testGetMessagesOrderDescending(threadID) {
    const asyncTask = async () => {
      try {
        const messages = await FirebaseDatabase.getMessagesInThread(threadID);
        for (let i = 0; i < messages.length - 1; i += 1) {
          const item1 = messages[i];
          const item2 = messages[i + 1];
          if (item1.createTime < item2.createTime) {
            Utils.log(`testGetMessagesOrderByTime FAILED: 
              ${i}: ${item1.createTime} < ${i + 1}: ${item2.createTime}`, messages);
            return;
          }
        }
        Utils.log('testGetMessagesOrderByTime PASSED:', messages);
      } catch (err) {
        Utils.log(`testGetMessagesOrderByTime error: ${err}`);
      }
    };
    asyncTask();
  }

  static testGetMessages(threadID) {
    const asyncTask = async () => {
      try {
        let fromMessage = null;
        for (let i = 0; i < 10; i += 1) {
          const messages = 
            await FirebaseDatabase.getMessagesInThread(threadID, fromMessage, 100); // eslint-disable-line
          if (messages && messages.length > 0) {
            const firstMessage = messages[0];
            const lastMessage = messages[messages.length - 1];
            fromMessage = lastMessage.uid;
            Utils.log(`testGetMessages get: ${messages.length} messages, from: ${firstMessage.uid} -> to: ${lastMessage.uid}`, messages);
          }
          else {
            break;
          }
        }
      } catch (err) {
        Utils.log(`testGetMessages error: ${err}`);
      }
    };
    asyncTask();
  }

  // --------------------------------------------------

  static testAddThreadsToUser() {
    const asyncTask = async () => {
      try {
        // add
        await FirebaseDatabase.mAddThreadIDsToUser('1', ['single_1_2']);
        await FirebaseDatabase.mAddThreadIDsToUser('2', ['single_1_2']);
        // check
        const ref = FirebaseDatabase.getUsersRef();
        const isUser1Has = await ref.child('1/threads/single_1_2').once('value');
        const isUser2Has = await ref.child('2/threads/single_1_3').once('value');
        if (isUser1Has.exists() && isUser2Has.exists()) {
          Utils.warn('testAddThreadsToUser: PASSED');
        } else {
          Utils.warn('testAddThreadsToUser: FAILED');
        }
      } catch (err) {
        Utils.log(`add thread to user exception: ${err}`);
        Utils.warn('testAddThreadsToUser: FAILED');
      }
    };
    asyncTask();
  }

  // OTHER TEST
  // --------------------------------------------------

  static testReadManyRecords() {
    
    // add records
    // const itemsRef = FirebaseDatabase.getDatabase().ref('items');
    // const item = {
    //   name: 'Hello buddy',
    //   title: 'Welcome to chat',
    //   details: 'This will be a lot of fun',
    // };
    // for (let i = 0; i < 100; i += 1) {
    //   const itemRef = itemsRef.push();
    //   itemRef.set({ ...item });
    // }

    // read
    // const readItemsRef = FirebaseDatabase.getDatabase().ref('items');
    // readItemsRef.once('value', (snapshot) => {
    //   const allKeys = Object.keys(snapshot.val());
    //   Utils.log(`read ${allKeys.length}`, allKeys.length);
    // });

    // remove
    // const itemsRef = FirebaseDatabase.getDatabase().ref('items');
    // itemsRef.remove();
  }

  static testFirebaseCallback() {
    
    // setup callbacks
    const itemsRef = FirebaseDatabase.getDatabase().ref('items');
    itemsRef.on('value', (snapshot) => {
      Utils.warn(`callback 1: ${snapshot}`, snapshot);
    });
    itemsRef.on('value', (snapshot) => {
      Utils.warn(`callback 2: ${snapshot}`, snapshot);
    });
    itemsRef.on('child_added', (snapshot) => {
      Utils.warn(`callback 3: ${snapshot}`, snapshot);
    });
    
    // add item
    setTimeout(() => {
      const newItemRef = itemsRef.push({});
      newItemRef.set({ title: 'title' });
    }, 2000);
    setTimeout(() => {
      const newItemRef = itemsRef.push({});
      newItemRef.set({ title: 'title' });
    }, 3000);
  }
}

export default FirebaseDatabaseTest;
