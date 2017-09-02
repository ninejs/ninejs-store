import { Database, ViewParameters } from './common';
import { CouchConnection } from "../CouchDB";
export declare function merge(...args: any[]): any;
export declare function mergeWithoutConflict<T>(db: Database, id: string, doc: any, callback: (err: any, data: T) => void, condition?: (data: T) => boolean): void;
export declare function mergeWithoutConflictAsync<T>(db: Database, id: string, doc: any, condition?: (data: any) => boolean): Promise<T>;
export declare function get<T>(db: Database, id: string): Promise<any>;
export declare function removeWithoutConflict(db: Database, id: string, callback: (err: any, data: any) => void): void;
export declare function removeWithoutConflictAsync(db: Database, id: string): Promise<any>;
export declare function view<T>(db: Database, viewName: string, args: ViewParameters): Promise<T[]>;
export declare function create(db: Database): Promise<any>;
export declare function exists(db: Database): Promise<any>;
export declare function ensureDatabasesExist(connection: CouchConnection, dbNames: string[]): Promise<boolean>;
export interface CouchUtils {
    merge: (...args: any[]) => any;
    mergeWithoutConflict: <T>(db: Database, id: string, doc: any, callback: (err: any, data: T) => void, condition?: (data: T) => boolean) => void;
    mergeWithoutConflictAsync: <T>(db: Database, id: string, doc: any, condition?: (data: any) => boolean) => Promise<T>;
    get: <T>(db: Database, id: string) => Promise<T>;
    removeWithoutConflict: (db: Database, id: string, callback: (err: any, data: any) => void) => void;
    removeWithoutConflictAsync: (db: Database, id: string) => Promise<any>;
    view: <T>(db: Database, viewName: string, args: ViewParameters) => Promise<T[]>;
    create: (db: Database) => Promise<any>;
    exists: (db: Database) => Promise<any>;
}
declare const _default: {
    merge: (...args: any[]) => any;
    mergeWithoutConflict: <T>(db: Database, id: string, doc: any, callback: (err: any, data: T) => void, condition?: (data: T) => boolean) => void;
    mergeWithoutConflictAsync: <T>(db: Database, id: string, doc: any, condition?: (data: any) => boolean) => Promise<T>;
    get: <T>(db: Database, id: string) => Promise<any>;
    removeWithoutConflict: (db: Database, id: string, callback: (err: any, data: any) => void) => void;
    removeWithoutConflictAsync: (db: Database, id: string) => Promise<any>;
    view: <T>(db: Database, viewName: string, args: ViewParameters) => Promise<T[]>;
    create: (db: Database) => Promise<any>;
    exists: (db: Database) => Promise<any>;
};
export default _default;
