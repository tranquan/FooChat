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

          // const thread = await FirebaseDatabase.createGroupThread(
          //   [USER_1, USER_2], 
          //   { title: 'hello', photoURL: 'https://google.com' },
          // );
          // FirebaseDatabase.addUsersToGroupThread('-L2-krkIhG5Fuwb4YbFA', [USER_1, USER_2]);
          // FirebaseDatabase.addUsersToGroupThread('-L2B2jhNA0ZzMN1CL3rl', [USER_1, USER_2, USER_3]);
          // FirebaseDatabase.removeUsersFromGroupThread('-L2-krkIhG5Fuwb4YbFA', ['1', '2']);
          // FirebaseDatabaseTest.testReadManyRecords();
          // FirebaseDatabase.mAddMessageToThread(MESSAGE_1, 'single_1_2');
          // FirebaseDatabase.mAddMessageToThread(MESSAGE_2, 'single_1_2');
          
          // await FirebaseDatabaseTest.testCreateGroupThread();
          // await FirebaseDatabaseTest.testSendMessage(MESSAGE_1, '-L2dC-Dpc3BSjG7ieTbS');
          // await FirebaseDatabaseTest.testSendMessage(MESSAGE_2, '-L2dC-Dpc3BSjG7ieTbS');
          // await FirebaseDatabaseTest.testSendMessage(MESSAGE_1, '-L2dC-Dpc3BSjG7ieTbS');

          // await FirebaseDatabaseTest.testGetGroupThread('-L2BRVGsZIQK2eEBkb36');

          // await FirebaseDatabaseTest.testAddUserToGroupThread('-L2BRVGsZIQK2eEBkb36', [USER_1]);

          // await FirebaseDatabaseTest.testRemoveUserFromGroupThread('-L2BRVGsZIQK2eEBkb36', ['2']);

          // await FirebaseDatabaseTest.testSendManyMessages('-L2BRVGsZIQK2eEBkb36');

          // await FirebaseDatabaseTest.testGetMessagesOrderDescending('-L2BRVGsZIQK2eEBkb36');

          // await FirebaseDatabaseTest.testGetMessages('-L2BRVGsZIQK2eEBkb36');

          // await FirebaseDatabase.updateGroupThreadMetadata('-L2de8KBI3P38dSatXgy', {
          //   title: 'title 1',
          // });

          // const threads = await FirebaseDatabase.getThreadsOfUser('1', null);
          // Utils.log(`getThreadsOfUser: ${threads.length}`, threads);

        } catch (err) {
          Utils.log(`test exception: ${err}`);
        }
      };
      asyncTask();
    }, 1000);
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
        Utils.log(`testAddUserToGroupThread FAILED: ${err}`);
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
}

export default FirebaseDatabaseTest;
