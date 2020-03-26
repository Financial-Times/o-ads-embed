import messenger from './src/js/postMessenger';

const handleReceivedMessage = event => {
	console.log('event.origin', event.origin);
	console.log('event.data', event.data);
	if (event.origin === 'https://ft.com') {
		window.oAdsEmbed.data = event.data;
	}
};

/*
* Initialise oAds Embed library.
* - looks for a collapse element in the iframe
* - intialise touch event listeners.
*/
const oAdsEmbed = {
	init: () => {
		window.addEventListener('load', () => {
			const slotClassEl = document.querySelector('[data-o-ads-class]');
			if (slotClassEl) {
				const slotClass = slotClassEl.dataset.oAdsClass;
				if (slotClass) {
					messenger.post({
						type: 'oAds.slotClass',
						slotClass: slotClass
					}, window.top);
				}
			}

			const collapse = Boolean(document.querySelector('[data-o-ads-collapse]'));

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

		window.addEventListener('oAds.sendToIframe', handleReceivedMessage);
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
