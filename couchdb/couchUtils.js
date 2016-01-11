(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'ninejs/core/deferredUtils'], factory);
    }
})(function (require, exports) {
    'use strict';
    var deferredUtils_1 = require('ninejs/core/deferredUtils');
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
                if (err) {
                    db.save(id, doc, myCallback);
                }
                else {
                    if (!condition || condition(data)) {
                        var merged = merge({}, data, doc);
                        merged['_rev'] = data['_rev'];
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
    function getAsync(db, id) {
        let r = deferredUtils_1.defer();
        db.get(id, (err, res) => {
            if (err) {
                r.reject(err);
            }
            else {
                r.resolve(res);
            }
        });
        return r.promise;
    }
    exports.getAsync = getAsync;
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
});
//# sourceMappingURL=couchUtils.js.map