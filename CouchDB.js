(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './couchdb/couchUtils'], factory);
    }
})(function (require, exports) {
    'use strict';
    var couchUtils_1 = require('./couchdb/couchUtils');
    let cradle = require('cradle');
    var Connection = cradle.Connection;
    class CouchDB {
        constructor(config) {
            this.profiles = {};
            for (let p in config) {
                this.profiles[p] = new Connection(config[p].host, config[p].port, config[p]);
            }
        }
        connection(name) {
            return this.profiles[name];
        }
    }
    CouchDB.prototype.utils = couchUtils_1.default;
    exports.default = CouchDB;
});
//# sourceMappingURL=CouchDB.js.map