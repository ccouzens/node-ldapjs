// Copyright 2011 Mark Cavage, Inc.  All rights reserved.

var assert = require('assert-plus');

///--- API

function Control(options) {
  assert.optionalObject(options);
  options = options || {};
  assert.optionalString(options.type);
  assert.optionalBool(options.criticality);
  if (options.value) {
    assert.buffer(options.value);
  }

  this.type = options.type || '';
  this.criticality = options.critical || options.criticality || false;
  this.value = options.value || null;
}
Object.defineProperties(Control.prototype, {
  json: {
    get: function getJson() {
      var obj = {
        controlType: this.type,
        criticality: this.criticality,
        controlValue: this.value
      };
      return (typeof (this._json) === 'function' ? this._json(obj) : obj);
    }
  }
});

Control.prototype.toBer = function toBer(ber) {
  assert.ok(ber);

  ber.startSequence();
  ber.writeString(this.type || '');
  ber.writeBoolean(this.criticality);
  if (typeof (this._toBer) === 'function') {
    this._toBer(ber);
  } else {
    if (this.value)
      ber.writeString(this.value);
  }

  ber.endSequence();
  return;
};

Control.prototype.toString = function toString() {
  return this.json;
};


///--- Exports
module.exports = Control;
