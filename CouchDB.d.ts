export interface ViewParameters {
    key?: string;
    reduce?: boolean;
    keys?: string[];
    group?: boolean;
    include_docs?: boolean;
    map?: (source: any) => any;
}
export interface Database {
    create(): Promise<any>;
    exists(): Promise<boolean>;
    get(id: string, callback: (err: any, result: any) => void): void;
    view(viewName: string, args: ViewParameters, callback: (err: any, result: any) => void): void;
    save(data: any, callback: (err?: any, data?: any) => void): void;
    save(id: string, data: any, callback: (err?: any, data?: any) => void): void;
    save(id: string, rev: string, data: any, callback: (err?: any, data?: any) => void): void;
    remove(id: string, rev: string, callback: (err?: any, data?: any) => void): void;
}
export interface CouchConnection {
    database: (name: string) => Database;
}
declare class CouchDB {
    profiles: {
        [name: string]: CouchConnection;
    };
    constructor(config: any);
    connection(name: string): CouchConnection;
}
export default CouchDB;
