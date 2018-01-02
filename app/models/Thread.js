
export const THREAD_TYPES = {
  SINGLE: 'single',
  GROUP: 'group',
};

export default class Thread {
  uid = '';
  type = '';
  title = '';
  photoURL = '';
  users = [];
  messages = [];
  createTime = 0;
  updateTime = 0;
}

