/*eslint-env node */
const gulp = require('gulp');
const karma = require('gulp-karma');
const obt = require('origami-build-tools');
const plato = require('plato');

gulp.task('build', () => {
	return obt.build.js(gulp);
});

gulp.task('test', () => {
	const action = process.env.CI ? 'run' : 'watch';
	return gulp.src(['test/spec/*.js'])
		.pipe(karma({
			configFile: 'karma.conf.js',
			action: action
		}))
		.on('error', function(err) {
			throw err;
		});
});

gulp.task('analize', ['build'], (done) => {
	plato.inspect(['build/**.js'], 'reports/analysis/', { title: 'o-ads-embed' }, () => {
		done();
	});
});

gulp.task('coverage', () => {
	process.env.CI = true;
	return gulp.src(['test/spec/*.js'])
		.pipe(karma({
			configFile: 'karma.conf.js',
			action: 'run'
		}))
		.on('error', function(err) {
			throw err;
		});
});
