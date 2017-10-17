/*eslint-env mocha */
import utils from 'o-ads/src/js/utils/messenger';
import oAds from '../../main.js';
const messenger = utils.messenger;
import proclaim from 'proclaim';

describe('messages are queued when slot is not yet identified', () => {
	it('queues messages when the slot name is unavailable', (done) => {
		window.dispatchEvent(oAds.collapse());

		// wait for 'collapse' message to be processed
		window.setTimeout(() => {
			proclaim.equal(oAds.messageQueue.length, 1);

			let once = true;
			function listener(event) {
				const data = messenger.parse(event.data);
				if (data.type === 'oAds.whoami' && once) {
					once = false;

					//send a reply to the whoami message
					messenger.post({ type: 'oAds.youare', name: 'collapsing-slot'}, window);
				} else if (data.type === 'oAds.collapse') {
					proclaim.equal(data.name, 'collapsing-slot');
					proclaim.equal(data.type, 'oAds.collapse');
					proclaim.equal(oAds.messageQueue.length, 0);
					window.removeEventListener('message', listener);
					done();
				}
			}

			window.top.addEventListener('message', listener);
			oAds.init();
			window.dispatchEvent(new Event('load'));
		}, 10);
	});
});
