const messenger = require('o-ads/src/js/utils/messenger').messenger;

/*
* Initialise oAds Embed library.
* - looks for a collapse element in the iframe
* - intialise touch event listeners.
*/
const oAds = {
	init: () => {
		window.addEventListener('load', collapseSlot);

		/* istanbul ignore else */
		if ('ontouchstart' in window) {
			document.body.addEventListener('touchstart', swipeHandler.bind(null));
			document.body.addEventListener('touchmove', swipeHandler.bind(null));
			document.body.addEventListener('touchend', swipeHandler.bind(null));
		}
	}
};

/*
 TODO: See if we can use the GPT methods to collapse the slot
 */
function collapseSlot() {
		const detail = {
			collapse: !!document.querySelector('[data-o-ads-collapse]')
		};
		sendMessage('oAds.collapse', detail);
};


/*
* sendMessage
* sends a post message to the top window on the page
*/
function sendMessage(type, detail) {
	detail = detail || {};
	detail.type = type;
	detail.name = oAds.name;
	messenger.post(detail, window.top);
}

/*
* swipeHandler
* Catches swipe events and posts them to the parent window
*/
function swipeHandler(event) {
	const target = event.targetTouches.item(0);
	const message = {
		name: oAds.name,
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


// module.exports = oAds;
window.Origami = {
	'o-ads-embed': oAds
};