/*eslint-env mocha, chai */
import oAds from '../../main.js';

describe('resize the slot', () => {
	it('sends a message when the size is valid', (done) => {
		function listener(event) {
			if (event.data.type === 'oAds.resize') {
				expect(event.data).to.have.property('name', 'valid-resize');
				expect(event.data).to.have.property('type', 'oAds.resize');
				expect(event.data.size).to.deep.equal([1, 2]);

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
