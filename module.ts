'use strict';
import CouchDB from './CouchDB'
import { define } from 'ninejs/modules/moduleDefine'
import Module from 'ninejs/modules/Module'
export default define(['ninejs'], function (provide) {
	provide('ninejs/store/couchdb', (config, ninejs) => {
		var log = ninejs.get('logger');
		log.info('ninejs/store module starting');
		var couchdb = new CouchDB(config);
		return couchdb;
	});
});