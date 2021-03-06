var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "ninejs/core/deferredUtils"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    const deferredUtils_1 = require("ninejs/core/deferredUtils");
    let cradle = require('cradle');
    function merge(...args) {
        return cradle.merge(...args);
    }
    exports.merge = merge;
    function mergeWithoutConflict(db, id, doc, callback, condition) {
        if ((id !== null) && (id !== undefined)) {
            id = id + '';
        }
        let myCallback = (err, data) => {
            if (err && err.error === 'conflict') {
                setTimeout(function () {
                    mergeWithoutConflict(db, id, doc, callback, condition);
                }, 50);
            }
            else {
                callback(err, data);
            }
        };
        if ((id !== null) && (id !== undefined)) {
            db.get(id, function (err, data) {
                let _d = data;
                if (err) {
                    db.save(id, doc, myCallback);
                }
                else {
                    if (!condition || condition(data)) {
                        var merged = merge({}, data, doc);
                        merged['_rev'] = _d['_rev'];
                        db.save(id, merged['_rev'], merged, myCallback);
                    }
                    else {
                        callback({ error: 'notUpdated', message: 'update condition not met' }, data);
                    }
                }
            });
        }
        else {
            delete doc._id;
            db.save(doc, myCallback);
        }
    }
    exports.mergeWithoutConflict = mergeWithoutConflict;
    function mergeWithoutConflictAsync(db, id, doc, condition) {
        let r = deferredUtils_1.defer();
        mergeWithoutConflict(db, id, doc, (err, res) => {
            if (err) {
                r.reject(err);
            }
            else {
                r.resolve(res);
            }
        }, condition);
        return r.promise;
    }
    exports.mergeWithoutConflictAsync = mergeWithoutConflictAsync;
    function get(db, id) {
        let r = deferredUtils_1.defer();
        db.get(id, (err, res) => {
            if (err) {
                if ((err.name === 'CouchError') && (err.error === 'not_found')) {
                    r.resolve(null);
                }
                else {
                    r.reject(err);
                }
            }
            else {
                r.resolve(res);
            }
        });
        return r.promise;
    }
    exports.get = get;
    function removeWithoutConflict(db, id, callback) {
        var myCallback = function (err, data) {
            if (err && err.error === 'conflict') {
                setTimeout(function () {
                    removeWithoutConflict(db, id, callback);
                }, 50);
            }
            else {
                if (callback) {
                    callback.apply(null, arguments);
                }
            }
        };
        db.get(id, function (err, data) {
            if (err) {
                console.log(err);
                myCallback.apply(null, arguments);
            }
            else {
                db.remove(id, data['_rev'], myCallback);
            }
        });
    }
    exports.removeWithoutConflict = removeWithoutConflict;
    function removeWithoutConflictAsync(db, id) {
        let r = deferredUtils_1.defer();
        removeWithoutConflict(db, id, (err, res) => {
            if (err) {
                r.reject(err);
            }
            else {
                r.resolve(res);
            }
        });
        return r.promise;
    }
    exports.removeWithoutConflictAsync = removeWithoutConflictAsync;
    function view(db, viewName, args) {
        var r = deferredUtils_1.defer();
        let map = args.map;
        if (map) {
            delete args.map;
        }
        db.view(viewName, args, (err, data) => {
            if (err) {
                r.reject(err);
            }
            else {
                if (map) {
                    r.resolve(data.map(map));
                }
                else {
                    r.resolve(data);
                }
            }
        });
        return r.promise;
    }
    exports.view = view;
    function create(db) {
        let r = deferredUtils_1.defer();
        db.create((err, res) => {
            if (err) {
                r.reject(err);
            }
            else {
                r.resolve(res);
            }
        });
        return r.promise;
    }
    exports.create = create;
    function exists(db) {
        let r = deferredUtils_1.defer();
        db.exists((err, res) => {
            if (err) {
                r.reject(err);
            }
            else {
                r.resolve(res);
            }
        });
        return r.promise;
    }
    exports.exists = exists;
    function ensureDatabasesExist(connection, dbNames) {
        return dbNames.map((dbName) => __awaiter(this, void 0, void 0, function* () {
            let db = connection.database(dbName);
            let found = yield exists(db);
            if (!found) {
                yield create(db);
            }
            return true;
        })).reduce((acc, next) => {
            return acc.then(result => {
                if (!result) {
                    throw new Error('Unable to initialize database');
                }
                return next;
            });
        }, Promise.resolve(true));
    }
    exports.ensureDatabasesExist = ensureDatabasesExist;
    exports.default = {
        merge: merge,
        mergeWithoutConflict: mergeWithoutConflict,
        mergeWithoutConflictAsync: mergeWithoutConflictAsync,
        get: get,
        removeWithoutConflict: removeWithoutConflict,
        removeWithoutConflictAsync: removeWithoutConflictAsync,
        view: view,
        create: create,
        exists: exists
    };
});
//# sourceMappingURL=couchUtils.js.map