/*eslint-env mocha */
/*globals expect */
import oAds from '../../main.js';
import { messenger } from 'o-ads/src/js/utils/messenger';

describe('communicating a creative is responsive', () => {
	it('sends a responsive message', (done) => {
		function listener(event) {
			let data = messenger.parse(event.data);
			if (data.type === 'oAds.responsive') {
				expect(data).to.have.property('name', 'responsive-slot');
				expect(data).to.have.property('type', 'oAds.responsive');

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
