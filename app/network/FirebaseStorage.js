/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

/**
 * Firebase Cloud Storage
 * - use to upload/download files, images
 * - client will upload file to storage & get the url to insert into database
 */

import firebase from 'react-native-firebase';
import moment from 'moment/min/moment-with-locales';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../utils/Utils';
const LOG_TAG = 'FirebaseStorage.js';
/* eslint-enable */

// --------------------------------------------------

const IMAGES_PATH = 'images';
const FILES_PATH = 'files';

const PROFILE_AVATAR_PATH = `${IMAGES_PATH}/profile_avatar`;
const PROFILE_WALL_PATH = `${IMAGES_PATH}/profile_wall`;

const CHAT_IMAGES_PATH = `${IMAGES_PATH}/chat`;
const CHAT_FILES_PATH = `${FILES_PATH}/chat`;

const GENERAL_IMAGES_PATH = `${IMAGES_PATH}/general`;
const GENERAL_FILES_PATH = `${FILES_PATH}/gerneal`;

// --------------------------------------------------
// FirebaseStorage
// --------------------------------------------------

class FirebaseStorage {

  /**
   * Upload a file from fileURL to filePath on Firebase Storage
   * @param {string} fileURI Local file path
   * @param {string} storagePath Firebase Storage path
   * @returns firebase upload task
   */
  static uploadFile(fileURI, storagePath) {
    const uploadTask = firebase.storage().ref().child(storagePath).put(fileURI);
    return uploadTask;
  }

  /**
   * Download a file from Firebase Storage to local 
   * @param {string} storagePath 
   */
  // static downloadFile(
  //   storagePath,
  //   onProgress, onError, onSuccess // eslint-disable-line
  // ) {
  // }

  /**
   * Upload profile avatar image
   * @param {string} userID
   */
  static uploadProfileAvatar(userID, fileURI) {
    const updateTime = moment().unix();
    const storagePath = `${PROFILE_AVATAR_PATH}/${userID}_${updateTime}.jpg`;
    return FirebaseStorage.uploadFile(fileURI, storagePath);
  }

  /**
   * Upload profile wall image
   * @param {string} userID
   */
  static uploadProfileWall(userID, fileURI) {
    const updateTime = moment().unix();
    const storagePath = `${PROFILE_WALL_PATH}/${userID}_${updateTime}.jpg`;
    return FirebaseStorage.uploadFile(fileURI, storagePath);
  }

  /**
   * Upload an image in chat
   * @param {string} threadID
   */
  static uploadChatImage(threadID, fileURI) {
    const updateTime = moment().unix();
    const storagePath = `${CHAT_IMAGES_PATH}/${threadID}/image_${updateTime}.jpg`;
    return FirebaseStorage.uploadFile(fileURI, storagePath);
  }

  /**
   * Upload a file in chat
   * @param {string} threadID 
   * @param {string} fileExtension file extension, like .zip, .pdf, ... (optional)
   */
  static uploadChatFile(threadID, fileURI, fileExtension) {
    const updateTime = moment().unix();
    const storagePath = `${CHAT_FILES_PATH}/${threadID}/file_${updateTime}${fileExtension}`;
    return FirebaseStorage.uploadFile(fileURI, storagePath);
  }

  /**
   * Upload an image in to a common place
   * @param {string} threadID
   */
  static uploadGeneralImage(fileURI) {
    const now = moment(); 
    const date = now.format('DD_MM_YYYY');
    const updateTime = now.unix();
    const storagePath = `${GENERAL_IMAGES_PATH}/${date}/image_${updateTime}.jpg`;
    return FirebaseStorage.uploadFile(fileURI, storagePath);
  }

  /**
   * Upload a file to a common place
   * @param {string} threadID 
   * @param {string} fileExtension file extension, like .zip, .pdf, ... (optional)
   */
  static uploadGeneralFile(fileURI, fileExtension) {
    const now = moment();
    const date = now.format('DD_MM_YYYY');
    const updateTime = now.unix();
    const storagePath = `${GENERAL_FILES_PATH}/${date}/file_${updateTime}${fileExtension}`;
    return FirebaseStorage.uploadFile(fileURI, storagePath);
  }
}

export default FirebaseStorage;
