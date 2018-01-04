
export const THREAD_TYPES = {
  SINGLE: 'single',
  GROUP: 'group',
};

export default class Thread {
  // meta data
  title = '';
  photoURL = '';
  // props
  uid = '';
  type = '';
  users = [];
  messages = [];
  createTime = 0;
  updateTime = 0;
  isDeleted = false;
}

