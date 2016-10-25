'use strict';
import { Database } from './couchdb/common'
export { Database, ViewParameters } from './couchdb/common'
import { default as utils, CouchUtils } from './couchdb/couchUtils'

declare var require: any;
let cradle: any = require('cradle');


export interface CouchConnection {
    database: (name: string) => Database;
}

var Connection: {
    new (host: string, port: string, storeConfig: any): CouchConnection
} = cradle.Connection;

class CouchDB {
    utils: CouchUtils;
    profiles: { [ name: string ]: CouchConnection }
    constructor (config: any) {
        this.profiles = {};
        for (let p in config) {
            this.profiles[p] = new Connection(config[p].host, config[p].port, config[p]);
        }
    }
    connection (name: string) {
        return this.profiles[name];
    }
}
CouchDB.prototype.utils = utils;

export default CouchDB;