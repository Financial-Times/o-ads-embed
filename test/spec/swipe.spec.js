/*eslint-env mocha */

import utils from 'o-ads/src/js/utils/messenger';
import oAds from '../../main.js';
import dispatchTouchEvent from './helpers.js';
const messenger = utils.messenger;
import proclaim from 'proclaim';

describe('passing swipe events to the parent window', () => {
	beforeEach((done) => {
		if (!('ontouchstart' in window)) {
			window.ontouchstart = 'mock';
		}

		done();
	});

	afterEach((done) => {
		if (window.ontouchstart === 'mock') {
			delete window.ontouchstart;
		}

		done();
	});

	it('sends a message when the swipe starts', (done) => {
		let once = true;
		const x = 10;
		const y = 20;
		function listener(event) {
			const data = messenger.parse(event.data);
			if (data.type === 'oAds.whoami' && once) {
				once = false;
				window.top.removeEventListener('message', listener);
				messenger.post({ type: 'oAds.youare', name: 'swipe-start', sizes: [[300,250]]}, window);
				// wait for next 'youare' message to be processed
				window.setTimeout(() => {
					dispatchTouchEvent('start', x, y);
				}, 0);
			} else if (data.type === 'touchstart') {
				proclaim.equal(data.name, 'swipe-start');
				proclaim.equal(data.type, 'touchstart');
				proclaim.equal(data.x, x);
				proclaim.equal(data.y, y);
				done();
			}
		}

		oAds.init();
		window.top.addEventListener('message', listener);
		window.dispatchEvent(new Event('load'));
	});

	it('sends a message when the swipe moves', (done) => {
		let once = true;
		function listener(event) {
			const data = messenger.parse(event.data);
			if (data.type === 'oAds.whoami' && once) {
				once = false;
				window .top.removeEventListener('message', listener);
				messenger.post({ type: 'oAds.youare', name: 'swipe-move', sizes: [[300,250]]}, window);

				// wait for next 'youare' message to be processed
				window.setTimeout(() => {
					dispatchTouchEvent('move');
				}, 0);
			} else if (data.type === 'touchmove') {
				proclaim.equal(data.name, 'swipe-move');
				proclaim.equal(data.type, 'touchmove');
				proclaim.notOk(data.x);
				proclaim.notOk(data.y);
				done();
			}
		}

		oAds.init();
		window.top.addEventListener('message', listener);
		window.dispatchEvent(new Event('load'));
	});

	it('sends a message when the swipe ends', (done) => {
		let once = true;
		const x = 30;
		const y = 40;
		function listener(event) {
			let data = messenger.parse(event.data);
			if (data.type === 'oAds.whoami' && once) {
				once = false;
				window.top.removeEventListener('message', listener);
				messenger.post({ type: 'oAds.youare', name: 'swipe-end', sizes: [[300,250]]}, window);

				// wait for next 'youare' message to be processed
				window.setTimeout(() => {
					dispatchTouchEvent('end', x, y);
				}, 0);
			} else if (data.type === 'touchend') {
				proclaim.equal(data.name, 'swipe-end');
				proclaim.equal(data.type, 'touchend');
				proclaim.equal(data.x, x);
				proclaim.equal(data.y, y);
				done();
			}
		}

		oAds.init();
		window.top.addEventListener('message', listener);
		window.dispatchEvent(new Event('load'));
	});

	it('does not prevent default swipe handler if no configuration is sent across', (done) => {
		let once = true;
		function listener(event) {
			const data = messenger.parse(event.data);
			if (data.type === 'oAds.whoami' && once) {
				once = false;
				window .top.removeEventListener('message', listener);
				messenger.post({ type: 'oAds.youare', name: 'swipe-move', sizes: [[300,250]]}, window);

				// wait for next 'youare' message to be processed
				window.setTimeout(() => {
					dispatchTouchEvent('move');
				}, 0);
			} else if (data.type === 'touchmove') {
				proclaim.equal(data.name, 'swipe-move');
				proclaim.equal(data.type, 'touchmove');
				proclaim.notOk(data.x);
				proclaim.notOk(data.y);
				proclaim.equal(data.defaultPrevented, false);
				done();
			}
		}

		oAds.init();
		window.top.addEventListener('message', listener);
		window.dispatchEvent(new Event('load'));
	});

	it('prevents default swipe handler if configuration is sent across', (done) => {
		let once = true;
		function listener(event) {
			const data = messenger.parse(event.data);
			if (data.type === 'oAds.whoami' && once) {
				once = false;
				window .top.removeEventListener('message', listener);
				messenger.post({ type: 'oAds.youare', name: 'swipe-move', disableDefaultSwipeHandler:true, sizes: [[300,250]]}, window);

				// wait for next 'youare' message to be processed
				window.setTimeout(() => {
					dispatchTouchEvent('move');
				}, 0);
			} else if (data.type === 'touchmove') {
				proclaim.equal(data.name, 'swipe-move');
				proclaim.equal(data.type, 'touchmove');
				proclaim.notOk(data.x);
				proclaim.notOk(data.y);
				proclaim.equal(data.defaultSwipePrevented, true);
				done();
			}
		}

		oAds.init();
		window.top.addEventListener('message', listener);
		window.dispatchEvent(new Event('load'));
	});



});
