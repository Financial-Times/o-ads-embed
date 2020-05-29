import messenger from './src/js/postMessenger';

const sendMonitoringEvent = message =>
	messenger.post({ type: 'oAdsEmbed.monitor', message }, window.top);

const acceptedMessageOrigins = [
	'https://ft.com',
	'https://www.ft.com',
	'https://app.ft.com',
	'https://www-ft-com.eur.idm.oclc.org',
	'https://www-ft-com.ezproxy.babson.edu',
	'https://www-ft-com.baldwinlib.idm.oclc.org',
	'https://www-ft-com.ezproxy.babson.edu',
	'https://www-ft-com.newman.richmond.edu',
	'https://www-ft-com.btpl.idm.oclc.org'
];

// TO-DO: The monitoring events in this handler can be removed as soon
const handleReceivedMessage = event => {
	if (event.data && event.data.messageType === 'oAdsEmbed') {
		const origin = (event.origin || '').trim();
		if (acceptedMessageOrigins.includes(origin)) {
			window.oAdsEmbedData = event.data.body;
			sendMonitoringEvent(`oAdsEmbed message received from known origin: ${event.origin}--`);
		} else {
			sendMonitoringEvent(`oAdsEmbed message from unexpected origin: ${event.origin}--`);
		}
	}
};

// Monitor if top-level window is accessible from the iframe
const checkSafeFrame = () => {
	try {
		const pageUrl = window.top.location && window.top.location.href;
		if (!pageUrl) {
			sendMonitoringEvent('SafeFrame seems off but top window location is empty');
			return;
		}
		sendMonitoringEvent('SafeFrame seems off');
	}	catch(err) {
		sendMonitoringEvent('SafeFrame seems on');
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

			messenger.post({ type: 'oAds.adIframeLoaded' });

			const collapse = Boolean(document.querySelector('[data-o-ads-collapse]'));
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

checkSafeFrame();
window.addEventListener('message', handleReceivedMessage, false);

// Notify the top-level window that the o-ads-embed is listening for
// incoming postMessages
messenger.post({ type: 'oAdsEmbed.listens' }, window.top);

export default oAdsEmbed;
