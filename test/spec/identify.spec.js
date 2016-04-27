/*eslint-env mocha */
import oAds from '../../main.js';
import { messenger } from 'o-ads/src/js/utils/messenger';

describe('identifying the slot', () => {
	it('asks for the slot config and stores it when returned', (done) => {
		let once = true;
		function listener(event) {
			const data = messenger.parse(event.data);
			if (data.type === 'oAds.whoami' && once) {
				once = false;
				window.top.removeEventListener(listener);
				messenger.post({ type: 'oAds.youare', name: 'a-slot', sizes: [[300,250]]}, window);

				// wait for next 'youare' message to be processed
				window.setTimeout(() => {
					oAds.name.should.equal('a-slot');
					oAds.sizes.should.have.length(1);
					done();
				});
			}
		}

		window.top.addEventListener('message', listener);
		oAds.init();
		window.dispatchEvent(new Event('load'));

	});

	it('throws an error if the slot is not found', (done) => {
		let once = true;
		function onError(err) {
			if (err.toString() === 'Uncaught Error: Could not identify this slot') {
				return true;
			}

			return false;
		}

		// listen for the whoami message and react to it
		function listener(event) {
			let data = messenger.parse(event.data);
			if (data.type === 'oAds.whoami' && once) {
				once = false;
				onError.should.throw(Error);
				window.onerror = onError;
				window.top.removeEventListener(listener);
				messenger.post({ type: 'oAds.youare', name: null}, window);

				// wait for next 'youare' message to be processed
				window.setTimeout(() => {
					(oAds.name === null).should.be.true;
					window.onerror = undefined;
					done();
				}, 0);
			}
		}

		window.top.addEventListener('message', listener);
		oAds.init();
		window.dispatchEvent(new Event('load'));
	});
});
