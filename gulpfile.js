/*eslint-env node */
const path = require('path');
const gulp = require('gulp');
const karma = require('karma').Server;
const obt = require('origami-build-tools');

const karmaConfig = path.join(__dirname, 'karma.conf.js');
const eslintConfig = path.join(__dirname, '.eslintrc');

gulp.task('build', () => {
	return obt.build.js(gulp);
});

gulp.task('test', (done) => {
	process.env.CI = true;
	return new karma({
			configFile: karmaConfig
		}, done).start();
});

gulp.task('tdd', (done) => {
	return new karma({
			configFile: karmaConfig
		}, done).start();
});

gulp.task('coverage', (done) => {
	process.env.COVERAGE = true;
	return new karma({
			configFile: karmaConfig,
		}, done).start();
});
