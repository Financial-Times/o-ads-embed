/*eslint-env node */
/*eslint strict: 0 */

// if you want a different local configuration create a file called karma.local.js
// the file should export a function that takes the current options object and
// returns an amended one e.g.
// module.exports = function (options) {
// 	var options.test = "it works!";
// 	return options;
// }

'use strict';
const istanbul = require('browserify-istanbul');
const babelify = require('babelify').configure({
  presets: ['es2015']
});
const debowerify = require('debowerify');
let options = {
	autoWatch: true,
	singleRun: false,
	frameworks: ['mocha', 'chai', 'browserify'],
	files: ['test/spec/*.js'],
	customLaunchers: {
		chromeWithFlags: {
			base: 'Chrome',
			flags: ['--no-sandbox', '--no-first-run']
		}
	},
	client: {
		mocha: {
			reporter: 'html',
			ui: 'bdd',
			timeout: 0
		}
	},
	preprocessors: {
		'test/spec/*.js': ['browserify']
	},
	browserify: {
		debug: true,
		transform: [babelify, debowerify]
	},
	browsers: ['chromeWithFlags'],
	reporters: ['progress']
};

if (process.env.CI) {
	console.log('CI options on.');
	options.autoWatch = false;
	options.singleRun = true;
	options.browsers = ['PhantomJS2'];
}

if (process.env.COVERAGE) {
	console.log('COVERAGE options on.');
	options.client.mocha.reporter = 'html';
	options.client.mocha.timeout = 2e3;
	options.reporters.push('coverage');
	options.browserify.transform.unshift(istanbul);
	options.coverageReporter = {
		type: 'lcov',
		dir: 'reports/coverage/'
	};
}

try {
	options = require('./karma.local.js')(options);
	console.log('Local config loaded');
} catch (err) {
	if (err.code === 'MODULE_NOT_FOUND') {
		console.log('No local config found');
	} else {
		console.error('%s:%s', err.code, err.toString().replace('Error:', ''));
	}
}

module.exports = function(config) {
	config.set(options);
};
