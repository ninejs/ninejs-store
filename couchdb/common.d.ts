export interface ViewParameters {
    key?: string;
    reduce?: boolean;
    keys?: string[];
    group?: boolean;
    include_docs?: boolean;
    map?: (source: any) => any;
}
export interface Database {
    create(callback: (err: any, resp: any) => void): void;
    exists(callback: (err: any, resp: boolean) => void): void;
    get(id: string, callback: (err: any, result: any) => void): void;
    view(viewName: string, args: ViewParameters, callback: (err: any, result: any) => void): void;
    save(data: any, callback: (err?: any, data?: any) => void): void;
    save(id: string, data: any, callback: (err?: any, data?: any) => void): void;
    save(id: string, rev: string, data: any, callback: (err?: any, data?: any) => void): void;
    remove(id: string, rev: string, callback: (err?: any, data?: any) => void): void;
}
