/**
 * FirebaseFunctions
 */

import Configs from '../constants/configs';

/* eslint-disable */
import Utils from '../utils/Utils';
const LOG_TAG = '7777: FirebaseFunctions.js';
/* eslint-enable */

// --------------------------------------------------

const UNKNOWN_ERROR_RESPONSE = {
  status: false,
  message: 'UNKNOW_ERROR',
};

// --------------------------------------------------

const axios = require('axios');

const AxiosClient = axios.create({
  baseURL: Configs.firebaseFunctionsBaseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// --------------------------------------------------
// FirebaseFunctions
// --------------------------------------------------

class FirebaseFunctions {

  static userID = '';

  static setup(userID) {
    FirebaseFunctions.userID = userID;
  }

  /**
   * Help to log axios error
   */
  static logAxiosError(error, api = 'API') {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      Utils.warn(`${LOG_TAG} ${api} axios response: `, error.response);
    }
    if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser
      // and an instance of http.ClientRequest in node.js
      Utils.warn(`${LOG_TAG} ${api} axios request: `, error.request);
    }
    // rarely need -> disabled
    // Utils.warn(`${LOG_TAG} ${api} message: `, error.message);
    // Utils.warn(`${LOG_TAG} ${api} config: `, error.config);
  }

  /**
   * Make sure if an axius error/exception occur, it will be log & have message
   */
  static handleAxiosError(error, api = 'API') {
    FirebaseFunctions.logAxiosError(error, api);
    if (error.response && error.response.data) {
      const response = Object.assign(UNKNOWN_ERROR_RESPONSE, error.response.data);
      return Promise.reject(response);
    }
    return Promise.reject(UNKNOWN_ERROR_RESPONSE);
  }

  /**
   * Make sure if a response failed, it will be log & have message
   */
  static handleFailResponse(response, api = 'API') {
    Utils.warn(`${LOG_TAG} handleFailResponse ${api}: `, response);
    const message = Object.assign(UNKNOWN_ERROR_RESPONSE, response);
    return Promise.reject(message);
  }

  // --------------------------------------------------

  static getContacts(standardPhoneNumbers) {
    const api = 'getContacts';
    return AxiosClient.get('getContacts', { params: { standardPhoneNumbers } })
      .then(response => {
        return response.data.data;
      })
      .catch(error => FirebaseFunctions.handleAxiosError(error, api));
  }
}

export default FirebaseFunctions;
