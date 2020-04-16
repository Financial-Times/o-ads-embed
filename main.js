import messenger from './src/js/postMessenger';

const sendMonitoringEvent = message =>
	messenger.post({ type: 'oAds.monitor', message }, window.top);

const handleReceivedMessage = event => {
	if (event.data && event.data.messageType === 'oAdsEmbed') {
		if (event.origin === 'https://ft.com' || event.origin === 'https://www.ft.com') {
			window.oAdsEmbedData = event.data.body;
		} else {
			sendMonitoringEvent(`oAdsEmbed message from unexpected origin: ${event.origin}`);
		}
	}
};

const checkSmartmatchProp = () => {
	try {
		// Is this code running on a Smartmatch-compatible page?
		const pageUrl = window.top.location && window.top.location.href;
		if (!pageUrl) {
			sendMonitoringEvent('Top window location info inaccessible');
			return;
		}

		const isSMpage = pageUrl.match(/ft.com\/content/);

		if (isSMpage) {
			const hasSMObjOnLoad = Boolean(window.top.smartmatchCreativeMatches);
			const neg = hasSMObjOnLoad ? ' ' : ' NOT ';
			sendMonitoringEvent(`SM obj was${neg}available when iframe loaded`);
		}
	}	catch(err) {
		sendMonitoringEvent('Problem accessing window.top.location.href from iframe');
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

			checkSmartmatchProp();
		});

		/* istanbul ignore else */
		if ('ontouchstart' in window) {
			document.body.addEventListener('touchstart', swipeHandler.bind(null));
			document.body.addEventListener('touchmove', swipeHandler.bind(null));
			document.body.addEventListener('touchend', swipeHandler.bind(null));
		}

		window.addEventListener('message', handleReceivedMessage, false);
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
