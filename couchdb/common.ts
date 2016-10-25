'use strict';

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
	create (callback: (err: any, resp: any) => void): void;
	exists (callback: (err: any, resp: boolean) => void): void;
	get (id:string, callback: (err: any, result: any) => void): void;
	view (viewName: string, args: ViewParameters, callback: (err: any, result: any) => void): void;
	save (data: any, callback: (err?: any, data?: any) => void): void;
	save (id: string, data: any, callback: (err?: any, data?: any) => void): void;
	save (id: string, rev: string, data: any, callback: (err?: any, data?: any) => void): void;
	remove (id: string, rev: string, callback: (err?: any, data?: any) => void): void;
}