import { Database } from './couchdb/common';
export { Database, ViewParameters } from './couchdb/common';
import { CouchUtils } from './couchdb/couchUtils';
export interface CouchConnection {
    database: (name: string) => Database;
}
declare class CouchDB {
    utils: CouchUtils;
    profiles: {
        [name: string]: CouchConnection;
    };
    constructor(config: any);
    connection(name: string): CouchConnection;
}
export default CouchDB;
