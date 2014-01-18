'use strict';

/**
 * Output parser interface for haproxy output
 *
 * @constructor
 * @api private
 */
function Output(config) {
  if (!(this instanceof Output)) return new Output();
  return this;
}

/**
 * Parse full sessions list
 *
 * @returns {Object}
 */
Output.prototype.sessions = function sessions(buffer) {
 result = buffer.split('\n').reduce(function sessionReducer(data, line) {
      line = line.trim();
      if (!line) return data;
      if ('object' === using) {
        var kv = line.split(':');
        var vals = kv.splice(1).join(':').trim().split(' ');
        data[kv[0]] = vals.reduce(function sessionStatsReducer(obj, value) {
            var keyval;
            if (/\[/.test(value)) {
              keyval = value.replace(']', '').split('[');
              if (~keyval[0].indexOf('=')) {
                obj[keyval[0].replace('=', '')] = keyval[1].split(',').map(returnNumOrStr);
                return obj;
              }
              obj[keyval[0]] = keyval[1].split(',').reduce(sessionStatsReducer, {});
              return obj;
            }
            keyval = value.split('=');
            if (keyval[0] === 'src') {
              var addr = keyval[1].split(':');
              obj[keyval[0]] = {
                address: addr[0],
                port: +addr[1]
              };
            } else {
              obj[keyval[0]] = returnNumOrStr(keyval[1]);
            }
            return obj;
        }, {});
      }
      return data;
    }, {});
};

/**
 * Return a single session status
 *
 * @returns {Object}
 */
Output.prototype.session = function session() {

};

//
// Expose the module.
//
module.exports = Output;
