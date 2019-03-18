import proclaim from 'proclaim';
import sinon from 'sinon/pkg/sinon';
import * as fixtures from './helpers/fixtures';
import oAdsEmbed from '../main';
import { dispatchTouchEvent } from './helpers/utils';

describe('o-ads-embed', () => {
	context('Window has loaded', () => {
		it('a postMessage should be sent with type `adIframeLoaded`', (done) => {
			const postMessageSpy = sinon.spy(window.top, 'postMessage');
			const expectedMessage = JSON.stringify({ type: 'oAds.adIframeLoaded'});

			window.addEventListener('load', () => {
				// Make sure the first event listener in main.js runs first
				setTimeout(() => {
					proclaim.equal(postMessageSpy.calledWith(expectedMessage, '*'), true);
					postMessageSpy.restore();
					done();
				}, 0);
			});

			oAdsEmbed.init();
			window.dispatchEvent(new Event('load'));
		});


		context('collapse element exists on the page', () => {
			it('should send a postMessage of type "oAds.collapse"', (done) => {
				fixtures.insertHtml('<script data-o-ads-collapse></script>');
				const postMessageSpy = sinon.spy(window.top, 'postMessage');
				const expectedMessage = JSON.stringify({ type: 'oAds.collapse'});

				window.addEventListener('load', () => {
					// Make sure the first event listener in main.js runs first
					setTimeout(() => {
						proclaim.equal(postMessageSpy.calledWith(expectedMessage, '*'), true);
						postMessageSpy.restore();
						done();
					}, 0);
				});

				oAdsEmbed.init();
				window.dispatchEvent(new Event('load'));
			});

			after(() => {
				fixtures.reset();
			});
		});
		context('collapse element does NOT exit on the page', () => {
			it('should NOT send a postMessage', (done) => {
				const postMessageSpy = sinon.spy(window.top, 'postMessage');
				const expectedMessage = JSON.stringify({ type: 'oAds.collapse'});
				window.addEventListener('load', () => {
					// Make sure the first event listener in main.js runs first
					setTimeout(() => {
						proclaim.notOk(postMessageSpy.calledWith(expectedMessage));
						postMessageSpy.restore();
						done();
					}, 0);
				});
				oAdsEmbed.init();
				window.dispatchEvent(new Event('load'));
			});
		});
	});

	context('On touch event', () => {
		beforeEach(() => {
			if (!('ontouchstart' in window)) {
				window.ontouchstart = 'mock';
			}
		});

		afterEach(() => {
			if (window.ontouchstart === 'mock') {
				delete window.ontouchstart;
			}
		});

		it('should send a postMessage of type "oAds.touch{start|move|end}"', (done) => {
			const x = 10;
			const y = 20;

			const postMessageSpy = sinon.spy(window.top, 'postMessage');
			const expectedMessage = JSON.stringify({
				type: 'touchstart',
				defaultPrevented: false,
				x: x,
				y: y
			});

			window.addEventListener('touchstart', () => {
				setTimeout(() => {
					proclaim.equal(postMessageSpy.calledWith(expectedMessage, '*'), true);
					postMessageSpy.restore();
					done();
				}, 0);
			});

			oAdsEmbed.init();
			window.dispatchEvent(new Event('load'));
			dispatchTouchEvent('start', x, y);
		});
	});
});