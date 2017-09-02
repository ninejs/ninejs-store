/*
 * ninejs grunt configuration file
 */
function exports(grunt) {
	'use strict';

	require('load-grunt-tasks')(grunt);
	// Project configuration.
	grunt.initConfig({
		exec: {
			defaultTs : (process.env.TS_COMPILER || "./node_modules/typescript/bin/tsc") + " -p ./tsconfig.json"
		}
	});

	// Default task.
	grunt.registerTask('default', ['exec']);

}

module.exports = exports;