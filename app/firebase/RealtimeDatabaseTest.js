import RealtimeDatabase from './RealtimeDatabase';
import User from '../models/User';
import Thread from '../models/Thread';
import Utils from '../utils/Utils';

class RealtimeDatabaseTest {

  static test() {
    // RealtimeDatabaseTest.testAddThreadsToUser();
    // RealtimeDatabaseTest.testCreateSingleThread();
  }

  // --------------------------------------------------
  
  static testAllSingleThreadFunctions() {

  }

  static testCreateSingleThread() {
    const user1 = {
      uid: '1',
      name: 'User 1',
    };
    const user2 = {
      uid: '2',
      name: 'User 2',
    };
    const asyncTask = async () => {
      try {
        const thread = await RealtimeDatabase.createSingleThread(user1, user2);
        Utils.log(`create thread success: ${JSON.stringify(thread)}`, thread);
      } catch (err) {
        Utils.log(`create thread exception: ${err}`);
      }
    };
    asyncTask();
  }

  // --------------------------------------------------

  static testAddThreadsToUser() {
    const asyncTask = async () => {
      try {
        // add
        await RealtimeDatabase.mAddThreadIDsToUser('1', ['single_1_2']);
        await RealtimeDatabase.mAddThreadIDsToUser('2', ['single_1_2']);
        // check
        const ref = RealtimeDatabase.getUsersRef();
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
}

export default RealtimeDatabaseTest;
