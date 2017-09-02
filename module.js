(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./CouchDB", "ninejs/modules/moduleDefine"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    const CouchDB_1 = require("./CouchDB");
    const moduleDefine_1 = require("ninejs/modules/moduleDefine");
    exports.default = moduleDefine_1.define(['ninejs'], function (provide) {
        provide('ninejs/store/couchdb', (config, ninejs) => {
            var log = ninejs.get('logger');
            log.info('ninejs/store module starting');
            var couchdb = new CouchDB_1.default(config);
            return couchdb;
        });
    });
});
//# sourceMappingURL=module.js.map