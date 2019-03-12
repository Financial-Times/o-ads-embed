/**
 * Utility methods for postMessage api.
 */
const messenger = {
	post: function(message, source) {
		message = typeof message === 'string' ? message : JSON.stringify(message);
		source = arguments[1] || window.top;
		source.postMessage(message, '*');
	},
	parse: function(message) {

		// Check whether the message looks like an object before trying to parse it
		if (typeof message !== 'string' || message[0] !== '{') {
			return message;
		}

		// try returning the parsed object
		try {
			return JSON.parse(message);
		}
		// return the original message
		catch(e){
			return message;
		}
	}
};


/*
* Initialise oAds Embed library.
* - looks for a collapse element in the iframe
* - intialise touch event listeners.
*/
const oAds = {
	init: () => {
		window.addEventListener('load', () => {
			const collapse = !!document.querySelector('[data-o-ads-collapse]');
			if (collapse) {
				sendMessage('oAds.collapse');
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