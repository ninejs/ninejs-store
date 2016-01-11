import { Database, ViewParameters } from '../CouchDB';
import { PromiseType } from 'ninejs/core/deferredUtils';
export declare function merge(...args: any[]): any;
export declare function mergeWithoutConflict(db: Database, id: string, doc: any, callback: (err: any, data: any) => void, condition?: (data: any) => boolean): void;
export declare function mergeWithoutConflictAsync(db: Database, id: string, doc: any, condition?: (data: any) => boolean): Promise<any>;
export declare function getAsync(db: Database, id: string): Promise<any>;
export declare function removeWithoutConflict(db: Database, id: string, callback: (err: any, data: any) => void): void;
export declare function removeWithoutConflictAsync(db: Database, id: string): Promise<any>;
export declare function view<T>(db: Database, viewName: string, args: ViewParameters): PromiseType<T[]>;
