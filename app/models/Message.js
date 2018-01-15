/**
 * Chat Message
 */

import moment from 'moment/min/moment-with-locales';

export const MESSAGE_TYPES = {
  NOTICE: 'notice', // a notice in a thread. i.e: a user be added/removed
  TEXT: 'text', // plain text message
  IMAGES: 'images', // user send some images
};

export default class Message {

  // meta data
  text = '';
  imageURLs = [];
  // props
  uid = '';
  type = '';
  authorID = '';
  createTime = 0;
  updateTime = 0;
  isDeleted = false;

  // --------------------------------------------------

  static mMyUser = {};
  static setup(user) {
    Message.mMyUser = user;
  }

  static newNoticeMessage(text) {
    const message = new Message();
    message.text = text;
    message.type = MESSAGE_TYPES.NOTICE;
    return message;
  }

  static newTextMessage(text) {
    const message = new Message();
    message.text = text;
    message.type = MESSAGE_TYPES.TEXT;
    return message;
  }

  static newImagesMessage(imageURLs) {
    const message = new Message();
    message.imageURLs = imageURLs;
    message.type = MESSAGE_TYPES.IMAGES;
    return message;
  }

  // --------------------------------------------------
  
  createTimeMoment() {
    if (!this.mCreateTimeMoment) {
      this.mCreateTimeMoment = moment(this.createTime, 'X');
    }
    return this.mCreateTimeMoment;
  }

  updateTimeMoment() {
    if (!this.mUpdateTimeMoment) {
      this.mUpdateTimeMoment = moment(this.updateTime, 'X');
    }
    return this.mUpdateTimeMoment;
  }
}
