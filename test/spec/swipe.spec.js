/*eslint-env mocha */
/*globals expect */
import oAds from '../../main.js';
import { dispatchTouchEvent } from './helpers.js';

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
			if (event.data.type === 'oAds.whoami' && once) {
				once = false;
				window.top.removeEventListener(listener);
				window.postMessage({ type: 'youare', name: 'swipe-start', sizes: [[300,250]]}, '*');

				// wait for next 'youare' message to be processed
				window.setTimeout(() => {
					dispatchTouchEvent('start', x, y);
				}, 0);
			} else if (event.data.type === 'touchstart') {
				expect(event.data).to.have.property('name', 'swipe-start');
				expect(event.data).to.have.property('type', 'touchstart');
				expect(event.data).to.have.property('x', x);
				expect(event.data).to.have.property('y', y);
				done();
			}
		};

		oAds.init();
		window.top.addEventListener('message', listener);
	});

	it('sends a message when the swipe moves', (done) => {
		let once = true;
		function listener(event) {
			if (event.data.type === 'oAds.whoami' && once) {
				once = false;
				window.top.removeEventListener(listener);
				window.postMessage({ type: 'youare', name: 'swipe-move', sizes: [[300,250]]}, '*');

				// wait for next 'youare' message to be processed
				window.setTimeout(() => {
					dispatchTouchEvent('move');
				}, 0);
			} else if (event.data.type === 'touchmove') {
				expect(event.data).to.have.property('name', 'swipe-move');
				expect(event.data).to.have.property('type', 'touchmove');
				expect(event.data).to.not.have.property('x');
				expect(event.data).to.not.have.property('y');
				done();
			}
		};

		oAds.init();
		window.top.addEventListener('message', listener);
	});

	it('sends a message when the swipe ends', (done) => {
		let once = true;
		const x = 30;
		const y = 40;
		function listener(event) {
			if (event.data.type === 'oAds.whoami' && once) {
				once = false;
				window.top.removeEventListener(listener);
				window.postMessage({ type: 'youare', name: 'swipe-end', sizes: [[300,250]]}, '*');

				// wait for next 'youare' message to be processed
				window.setTimeout(() => {
					dispatchTouchEvent('end', x, y);
				}, 0);
			} else if (event.data.type === 'touchend') {
				expect(event.data).to.have.property('name', 'swipe-end');
				expect(event.data).to.have.property('type', 'touchend');
				expect(event.data).to.have.property('x', x);
				expect(event.data).to.have.property('y', y);
				done();
			}
		};

		oAds.init();
		window.top.addEventListener('message', listener);
	});
});
