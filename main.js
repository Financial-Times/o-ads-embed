import messenger from './src/js/postMessenger';

/*
* Initialise oAds Embed library.
* - looks for a collapse element in the iframe
* - intialise touch event listeners.
*/
const oAdsEmbed = {
	init: () => {
		window.addEventListener('load', () => {
			const collapse = !!document.querySelector('[data-o-ads-collapse]');
			
			messenger.post({ type: 'oAds.adIframeLoaded' });

			if (collapse) {
				messenger.post({ type: 'oAds.collapse' }, window.top);
			}
		});

		/* istanbul ignore else */
		if ('ontouchstart' in window) {
			document.body.addEventListener('touchstart', swipeHandler.bind(null));
			document.body.addEventListener('touchmove', swipeHandler.bind(null));
			document.body.addEventListener('touchend', swipeHandler.bind(null));
		}
	}
};

/*
* swipeHandler
* Catches swipe events and posts them to the parent window
*/
function swipeHandler(event) {
	const target = event.targetTouches.item(0);
	const message = {
		type: event.type,
		defaultPrevented: false
	};

	/* istanbul ignore else */
	if (target) {
		message.x = target.pageX;
		message.y = target.pageY;
	}
	messenger.post(message, parent);
}

export default oAdsEmbed;