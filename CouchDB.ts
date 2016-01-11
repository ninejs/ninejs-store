'use strict';

declare var require: any;
let cradle: any = require('cradle');

export interface ViewParameters {
    /*
    key. Mutually exclusive with 'keys' parameter
     */
    key?: string;
    /*
    If true then the reduce part of the view is processed
     */
    reduce?: boolean;
    /*
    key array. Mutually exclusive with 'key' parameter
     */
    keys?: string[];
    /*

     */
    group?: boolean;
    /*
    If true, whole documents are included in the view results
     */
    include_docs?: boolean;
    /*
    Function that maps the result array. Useful for include_docs: true
    Optional
     */
    map?: (source: any) => any;
}

export interface Database {
    create (): Promise<any>;
    exists (): Promise<boolean>;
    get (id:string, callback: (err: any, result: any) => void): void;
    view (viewName: string, args: ViewParameters, callback: (err: any, result: any) => void): void;
    save (data: any, callback: (err?: any, data?: any) => void): void;
    save (id: string, data: any, callback: (err?: any, data?: any) => void): void;
    save (id: string, rev: string, data: any, callback: (err?: any, data?: any) => void): void;
    remove (id: string, rev: string, callback: (err?: any, data?: any) => void): void;
}
export interface CouchConnection {
    database: (name: string) => Database;
}

var Connection: {
    new (host: string, port: string, storeConfig: any): CouchConnection
} = cradle.Connection;

class CouchDB {
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

export default CouchDB;