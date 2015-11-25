/*eslint-env node */
const path = require('path');
const gulp = require('gulp');
const Karma = require('karma').Server;
const obt = require('origami-build-tools');

const karmaConfig = path.join(__dirname, 'karma.conf.js');

gulp.task('build', () => {
	return obt.build.js(gulp);
});

gulp.task('test', (done) => {
	process.env.CI = true;
	return new Karma({
			configFile: karmaConfig
		}, done).start();
});

gulp.task('tdd', (done) => {
	return new Karma({
			configFile: karmaConfig
		}, done).start();
});

gulp.task('coverage', (done) => {
	process.env.CI = true;
	process.env.COVERAGE = true;
	return new Karma({
			configFile: karmaConfig,
		}, done).start();
});
