const navigationActions = require('./navigation');
const userActions = require('./user');

module.exports = {
  ...navigationActions,
  ...userActions,
};
