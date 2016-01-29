'use strict';
import { Database, ViewParameters } from '../CouchDB'
import { defer, PromiseType } from 'ninejs/core/deferredUtils'

declare var require: any;
let cradle: any = require('cradle');

export function merge (...args: any[]): any {
	return cradle.merge(...args);
}

export function mergeWithoutConflict(db: Database, id: string, doc: any, callback: (err: any, data: any) => void, condition?: (data: any) => boolean) {
	if ((id !== null) && (id !== undefined)) {
		id = id + '';
	}
	let myCallback = (err: any, data: any) => {
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
		db.get(id, function(err, data) {
			if (err) {
				db.save(id, doc, myCallback);
			}
			else {
				if (!condition || condition(data)) {
					var merged = merge({}, data, doc);
					merged['_rev'] = data['_rev'];
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

export function mergeWithoutConflictAsync(db: Database, id: string, doc: any, condition?: (data: any) => boolean) {
	let r = defer<any>();
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

export function get(db: Database, id: string) {
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

