/*eslint-env mocha */

import utils from 'o-ads/src/js/utils/messenger';
import oAds from '../../main.js';
const messenger = utils.messenger;
import proclaim from 'proclaim';

describe('resize the slot', () => {
	it('sends a message when the size is valid', (done) => {
		function listener (event) {
			const data = messenger.parse(event.data);
			if (data.type === 'oAds.resize') {
				proclaim.equal(data.name, 'valid-resize');
				proclaim.equal(data.type, 'oAds.resize');
				proclaim.deepEqual(data.size, [1, 2]);

				window.removeEventListener('message', listener);
				done();
			}
		}

		window.top.addEventListener('message', listener);
		oAds.name = 'valid-resize';
		oAds.sizes = [[1, 2], [3, 4], [5, 6]];
		window.dispatchEvent(oAds.resize(1, 2));
	});

	it('throws an error when the size is invalid', () => {
		oAds.name = 'invalid-resize';
		oAds.sizes = [[1, 2], [3, 4], [5, 6]];
		proclaim.throws(oAds.resize.bind(oAds, 7, 8), Error, 'Invalid size for resize.');
	});
});
