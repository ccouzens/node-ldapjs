// Copyright 2011 Mark Cavage, Inc.  All rights reserved.

var assert = require('assert-plus');
var util = require('util');

var dtrace = require('../dtrace');

var LDAPMessage = require('./result');


///--- API
// Ok, so there's really no such thing as an unbind 'response', but to make
// the framework not suck, I just made this up, and have it stubbed so it's
// not such a one-off.

function UnbindResponse(options) {
  options = options || {};
  assert.object(options);

  options.protocolOp = 0;
  LDAPMessage.call(this, options);
}
util.inherits(UnbindResponse, LDAPMessage);
Object.defineProperties(UnbindResponse.prototype, {
  type: {
    get: function getType() { return 'UnbindResponse'; },
    configurable: false
  }
});

/**
 * Special override that just ends the connection, if present.
 *
 * @param {Number} status completely ignored.
 */
UnbindResponse.prototype.end = function (status) {
  assert.ok(this.connection);

  this.log.trace('%s: unbinding!', this.connection.ldap.id);

  this.connection.end();

  var self = this;
  if (self._dtraceOp && self._dtraceId) {
    dtrace.fire('server-' + self._dtraceOp + '-done', function () {
      var c = self.connection || {ldap: {}};
      return [
        self._dtraceId || 0,
        (c.remoteAddress || ''),
        c.ldap.bindDN ? c.ldap.bindDN.toString() : '',
        (self.requestDN ? self.requestDN.toString() : ''),
        0,
        ''
      ];
    });
  }
};

UnbindResponse.prototype._json = function (j) {
  return j;
};


///--- Exports

module.exports = UnbindResponse;
