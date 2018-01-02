import RealtimeDatabase from './RealtimeDatabase';
import User from '../models/User';
import Thread from '../models/Thread';
import Utils from '../utils/Utils';

class RealtimeDatabaseTest {

  static test() {
    const asyncTask = async () => {
      try {
        const user1 = {
          uid: '1',
          name: 'User 1',
        };
        const user2 = {
          uid: '2',
          name: 'User 2',
        };
        const thread = await RealtimeDatabase.createSingleThread(user1, user2);
        Utils.log(`create thread success: ${JSON.stringify(thread)}`, thread);
      } catch (err) {
        Utils.log(`create thread exception: ${err}`);
      }
    };
    asyncTask();

    // RealtimeDatabase.testAddThreadsToUser();
  }

  static testAddThreadsToUser() {
    const asyncTask = async () => {
      try {
        await RealtimeDatabase.mAddThreadIDsToUser('1', ['single_1_2']);
        await RealtimeDatabase.mAddThreadIDsToUser('2', ['single_1_2']);
      } catch (err) {
        Utils.log(`add thread to user exception: ${err}`);
      }
    };
    asyncTask();
  }
}

export default RealtimeDatabaseTest;
