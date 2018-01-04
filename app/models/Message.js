/**
 * Chat Message
 * - each message type will a appropriate payload
 */

export const MESSAGE_TYPES = {
  TEXT: 'text', // plain text message
  NOTICE: 'notice', // a notice in a thread. i.e: a user be added/removed
  IMAGE: 'image', // user send an image
  FILE: 'file', // user send a file (pdf, zip, etc)
};

export default class Message {
  // meta data
  text = '';
  imageURLs = [];
  fileURLs = [];
  // props
  uid = '';
  type = '';
  createTime = 0;
  updateTime = 0;
  isDeleted = false;
}
