// all strings used in the app
/* eslint-disable */

const APP_NAME = 'FooApp';

export default {
  app_name: `${APP_NAME}`,
  alert_title: APP_NAME,
  alert_title_error: 'Error',
  contacts_access_guide: `${APP_NAME} needs to access your Contacts. Please open Settings, go to Privacy->Contacts and allow ${APP_NAME}`,
  create_thread_error: 'Unable to create new Thread!',
  unknown_error: 'Oops! There is an error. Please try again later!',
};

/* eslint-enable */

// METHODS
// --------------------------------------------------

export function formatString(string, params) {
  let formattedString = string;
  for (const key in params) { // eslint-disable-line
    formattedString = string.replace(`{${key}}`, params[key]);
  }
  return formattedString;
}
