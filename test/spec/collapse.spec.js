/*eslint-env mocha */
/*globals expect */
import oAds from '../../main.js';

describe('collapsing the slot', () => {
	it('sends a collapse message', (done) => {
		function listener(event) {
			if (event.data.type === 'oAds.collapse') {
				expect(event.data).to.have.property('name', 'collapse-slot');
				expect(event.data).to.have.property('type', 'oAds.collapse');

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
