/**
 * Chat Thread
 */

import moment from 'moment/min/moment-with-locales';

import Thread, { THREAD_TYPES } from 'app/models/Thread';
import User from './User';

export default class ThreadView {

  static mMyUser = {};
  static setupMyUser(user) {
    ThreadView.mMyUser = user;
  }

  thread = null;

  constructor(thread) {
    this.thread = thread;
  }

}

