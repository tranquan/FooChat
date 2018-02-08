/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import ImageResizer from 'react-native-image-resizer';

import FirebaseStorage from 'app/network/FirebaseStorage';

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'ImageHelper.js';
/* eslint-enable */

// --------------------------------------------------
// ImageUtils
// --------------------------------------------------

export default class ImageUtils {
  /**
   * Help to pick an image -> resize -> upload to firebase storage
   * - onStep will call with step: 'pick', 'resize', 'upload'
   * - onSuccess will call with null if user cancell
   * - onError will be call with err if any issue happen
   * @param {number} resizeMaxWidth 
   * @param {number} resizeMaxHeight 
   * @param {callback} onStep: (step) => {}
   * @param {callback} onProgress: (step, percent) => {}
   * @param {callback} onError: (step, err) => {}
   * @param {callback} onSuccess: (downloadURL) => {}
   */
  static pickAndUploadImage(
    resizeMaxWidth = 512, resizeMaxHeight = 512, 
    onStep, onProgress, onError, onSuccess,
  ) {
    if (onStep) { onStep('pick'); }
    ImageUtils.pickImage()
      .then(response => {
        // user cancel
        if (!response) { 
          if (onSuccess) { onSuccess(null); }
          return;
        }
        // resize image
        if (onStep) { onStep('resize'); }
        ImageUtils.createResizedImage(response.uri, resizeMaxWidth, resizeMaxHeight)
          .then(imageURI => {
            // upload image
            if (onStep) { onStep('upload'); }
            ImageUtils.uploadImage(imageURI, onProgress, (err) => {
              if (onError) { onError('upload', err); }
            }, onSuccess);
          })
          .catch((err) => {
            if (onError) { onError('resize', err); }
          }); 
      })
      .catch(err => {
        if (onError) { onError('pick', err); }
      });
  }
  /** 
   * Help to pick a picture from device album
   * @returns a Promise resolve with image uri
   */
  static pickImage() {
    const title = '';
    return new Promise((resolve, reject) => {
      const ImagePicker = require('react-native-image-picker');
      const options = {
        title,
        cancelButtonTitle: 'Đóng',
        takePhotoButtonTitle: 'Chụp hình mới',
        chooseFromLibraryButtonTitle: 'Chọn từ Album',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      ImagePicker.showImagePicker(options, (response) => {
        if (response.error) {
          reject(response.error);
        } else if (response.didCancel) {
          resolve(null);
        } else {
          resolve(response);
        }
      });
    });
  }
  /**
   * Create a resized image with aspect ratio satisfy max width, max height
   * @param {string} fileURI 
   * @param {number} width 
   * @param {number} height 
   * @returns a Promise solve with new image uri
   */
  static createResizedImage(fileURI, maxWidth, maxHeight) {
    return ImageResizer.createResizedImage(fileURI, maxWidth, maxHeight, 'JPEG', 80)
      .then((response) => {
        return response.uri;
      })
      .catch((error) => {
        Utils.warn(`${LOG_TAG} resizeImage error: `, error);
        return Promise.reject(error);
      });
  }
  /**
   * Upload an image from device to Firebase Cloud Storage
   * @param {string} fileURI
   * @returns void
   */
  static uploadImage(fileURI, onProgress, onError, onSuccess) {
    // create upload task
    let uploadTask = null;
    uploadTask = FirebaseStorage.uploadGeneralImage(fileURI);
    if (!uploadTask) { return; }
    // upload
    uploadTask.on('state_changed', (snapshot) => {
      // progress
      // Utils.log(`${LOG_TAG} uploadImage progress: ${snapshot} %`);
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      if (onProgress) { 
        onProgress(progress); 
      }
    }, (error) => {
      // error
      Utils.warn(`${LOG_TAG} uploadImage error: `, error);
      if (onError) { 
        onError(error); 
      }
    }, (snapshot) => {
      // success
      // Utils.log(`${LOG_TAG} uploadImage success: `, snapshot);
      if (onSuccess) { 
        onSuccess(snapshot.downloadURL); 
      }
    });
  }
}
