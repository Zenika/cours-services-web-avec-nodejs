const _ = require('lodash');
const denodeify = require('denodeify');

module.exports = function promiseRepository(repository) {
  return _.mapValues(repository, method => denodeify(method));
};
