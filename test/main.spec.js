
describe('o-ads-embed', () => {
	context('Iframe has loaded', () => {
		context('collapse element exists on the page', () => {
			it('should send a postMessage of type "oAds.collapse"', () => {

			});
		});
		context('collapse element does NOT exit on the page', () => {
			it('should NOT send a postMessage', () => {

			});
		});
	});

	context('On touch event', () => {
		it('should send a postMessage of type "oAds.touchXXXX"', () => {
			
		});
	});
});