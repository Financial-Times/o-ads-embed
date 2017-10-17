/*eslint-env mocha */
import utils from 'o-ads/src/js/utils/messenger';
import oAds from '../../main.js';
const messenger = utils.messenger;
import proclaim from 'proclaim';

describe('communicating a creative is responsive', () => {
	it('sends a responsive message', (done) => {
		function listener(event) {
			const data = messenger.parse(event.data);
			if (data.type === 'oAds.responsive') {
				proclaim.equal(data.name, 'responsive-slot');
				proclaim.equal(data.type, 'oAds.responsive');

				window.removeEventListener('message', listener);
				done();
			}
		}

		window.top.addEventListener('message', listener);
		oAds.init();
		oAds.name = 'responsive-slot';
		oAds.sizes = [[1, 2], [3, 4], [5, 6]];
		window.dispatchEvent(oAds.responsive(1, 2));
	});
});
