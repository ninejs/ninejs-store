'use strict';
import { Database, ViewParameters } from './common'
import { defer, PromiseType } from 'ninejs/core/deferredUtils'

declare var require: any;
let cradle: any = require('cradle');

export function merge (...args: any[]): any {
	return cradle.merge(...args);
}

export function mergeWithoutConflict<T>(db: Database, id: string, doc: any, callback: (err: any, data: T) => void, condition?: (data: T) => boolean) {
	if ((id !== null) && (id !== undefined)) {
		id = id + '';
	}
	let myCallback = (err: any, data: T) => {
		if (err && err.error === 'conflict') {
			setTimeout(function() {
				mergeWithoutConflict(db, id, doc, callback, condition);
			}, 50);
		}
		else {
			callback(err, data);
		}
	};
	if ((id !== null) && (id !== undefined)) {
		db.get(id, function(err: any, data: T) {
			let _d: any = data;
			if (err) {
				db.save(id, doc, myCallback);
			}
			else {
				if (!condition || condition(data)) {
					var merged = merge({}, data, doc);
					merged['_rev'] = _d['_rev'];
					db.save(id,
						merged['_rev'],
						merged,
						myCallback);
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

export function mergeWithoutConflictAsync<T>(db: Database, id: string, doc: any, condition?: (data: any) => boolean) {
	let r = defer<T>();
	mergeWithoutConflict(db, id, doc, (err: any, res: T) => {
		if (err) {
			r.reject(err);
		}
		else {
			r.resolve(res);
		}
	}, condition);
	return r.promise;
}

export function get<T>(db: Database, id: string) {
	let r = defer<any>();
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

export function removeWithoutConflict(db: Database, id: string, callback: (err: any, data: any) => void) {
	var myCallback = function(err: any, data: any) {
		if (err && err.error === 'conflict') {
			//console.log('update conflicted, retrying');
			setTimeout(function() {
				removeWithoutConflict(db, id, callback);
			}, 50);
		}
		else {
			if (callback) {
				callback.apply(null, arguments);
			}
		}
	};
	db.get(id, function(err, data) {
		if (err) {
			console.log(err);
			myCallback.apply(null, arguments);
		}
		else {
			db.remove(id, data['_rev'], myCallback);
		}
	});
}

export function removeWithoutConflictAsync(db: Database, id: string) {
	let r = defer<any>();
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

export function view<T>(db: Database, viewName: string, args: ViewParameters): PromiseType<T[]> {
	var r = defer<T[]>();
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

export function create(db: Database) {
	let r = defer<any>();
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

export function exists(db: Database) {
	let r = defer<any>();
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

export interface CouchUtils {
	merge: (...args: any[]) => any,
	mergeWithoutConflict: <T>(db: Database, id: string, doc: any, callback: (err: any, data: T) => void, condition?: (data: T) => boolean) => void,
	mergeWithoutConflictAsync: <T>(db: Database, id: string, doc: any, condition?: (data: any) => boolean) => Promise<T>,
	get: <T>(db: Database, id: string) => Promise<T>,
	removeWithoutConflict: (db: Database, id: string, callback: (err: any, data: any) => void) => void,
	removeWithoutConflictAsync: (db: Database, id: string) => Promise<any>,
	view: <T>(db: Database, viewName: string, args: ViewParameters) => Promise<T[]>,
	create: (db: Database) => Promise<any>,
	exists: (db: Database) => Promise<any>
}

export default {
	merge: merge,
	mergeWithoutConflict: mergeWithoutConflict,
	mergeWithoutConflictAsync: mergeWithoutConflictAsync,
	get: get,
	removeWithoutConflict: removeWithoutConflict,
	removeWithoutConflictAsync: removeWithoutConflictAsync,
	view: view,
	create: create,
	exists: exists
}