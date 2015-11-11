/*eslint-env mocha */
/*globals expect */
import oAds from '../../main.js';
import { messenger } from 'o-ads/src/js/utils/messenger';

describe('resize the slot', () => {
	it('sends a message when the size is valid', (done) => {
		function listener(event) {
			const data = messenger.parse(event.data);
			if (data.type === 'oAds.resize') {
				expect(data).to.have.property('name', 'valid-resize');
				expect(data).to.have.property('type', 'oAds.resize');
				expect(data.size).to.deep.equal([1, 2]);

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
		oAds.resize.bind(oAds, 7, 8).should.throw(Error, 'Invalid size for resize.');
	});
});
