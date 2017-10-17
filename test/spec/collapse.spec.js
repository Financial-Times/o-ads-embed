/*eslint-env mocha */
import utils from 'o-ads/src/js/utils/messenger';
import oAds from '../../main.js';
const messenger = utils.messenger;
import proclaim from 'proclaim';

describe('collapsing the slot', () => {
	it('sends a collapse message', (done) => {
		function listener(event) {
			const data = messenger.parse(event.data);
			if (data.type === 'oAds.collapse') {
				proclaim.equal(data.name, 'collapse-slot');
				proclaim.equal(data.type, 'oAds.collapse');

				window.removeEventListener('message', listener);
				done();
			}
		}

		window.top.addEventListener('message', listener);
		oAds.init();
		oAds.name = 'collapse-slot';
		oAds.sizes = [[1, 2], [3, 4], [5, 6]];
		window.dispatchEvent(oAds.collapse(1, 2));
	});
});
