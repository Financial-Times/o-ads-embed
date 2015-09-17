/*eslint-env mocha */
/*globals expect */
import oAds from '../../main.js';

describe('messages are queued when slot is not yet identified', () => {
	it('queues messages when the slot name is unavailable', (done) => {
		window.dispatchEvent(oAds.collapse());

		// wait for 'collapse' message to be processed
		window.setTimeout(() => {
			oAds.messageQueue.length.should.equal(1);

			let once = true;
			function listener(event) {
				if (event.data.type === 'oAds.whoami' && once) {
					once = false;

					//send a reply to the whoami message
					window.postMessage({ type: 'youare', name: 'collapsing-slot'}, '*');
				} else if (event.data.type === 'oAds.collapse') {
					expect(event.data).to.have.property('name', 'collapsing-slot');
					expect(event.data).to.have.property('type', 'oAds.collapse');
					oAds.messageQueue.length.should.equal(0);
					window.removeEventListener('message', listener);
					done();
				}
			}

			window.top.addEventListener('message', listener);
			oAds.init();
		}, 0);
	});
});
