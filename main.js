const isEqual = require('lodash/lang/isEqual');
const messenger = require('o-ads/src/js/utils/messenger').messenger;

/*
* Event types that o-ads-embed will forward onto the parent.
* name is the identifier used by the main o-ads library
* MessageQueue is used to queue messages until the slot sending them is identified
* init Initialises the process of identifying the slot
*/
const oAds = {
	name: null,
	collapse: () => {
		return new CustomEvent('oAds.collapse', { bubbles: true, cancelable: true});
	},
	resize: (width, height) => {
		const size = [+width, +height];
		if (isValidSize(size)) {
			return new CustomEvent('oAds.resize', { bubbles: true, cancelable: true, detail: {size: size}});
		} else {
			throw new Error('Invalid size for resize.');
		}
	},
	responsive: () => {
		return new CustomEvent('oAds.responsive', { bubbles: true, cancelable: true});
	},
	messageQueue: [],
	init: () => {
		initListeners();
	}
};


function whoAmI() {
		const detail = {
			collapse: !!document.querySelector('[data-o-ads-collapse]'),
			mastercompanion: !!document.querySelector('[data-o-ads-mc]'),
			customMessage : (document.querySelector('[data-o-ads-custom-message]')) ? document.querySelector('[data-o-ads-custom-message]') : false
		};
		if (window && window.top && window.top.performance && window.top.performance.mark) {
			window.top.performance.mark('adIframeOnLoad');
		}
		sendMessage('oAds.whoami', detail);
};

/*
* isValidSize
* Checks the a requested resize dimensions are valid for this ad slot
*/
function isValidSize(size) {
	return oAds.sizes.filter((item) => {
		return isEqual(item, size);
	}).length;
}

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
* youAreHandler
* Handles messages sent from o-ads to identify which slot this creative loaded into.
*/
function youAreHandler(event) {
	/* istanbul ignore else */
	if (/oAds\.youare/.test(event.data)) {
		const data = messenger.parse(event.data);
		oAds.name = data.name;
		if (oAds.name) {
			oAds.sizes = data.sizes;
			processMessageQueue();
			initSwipeMessaging(data.disableDefaultSwipeHandler);
		} else {
			throw new Error('Could not identify this slot');
		}
	}
}

/*
* processMessageQueue
* send messages that were requested before the slot was identified
*/
function processMessageQueue() {
	oAds.messageQueue.forEach((message) => sendMessage(message.type, message.event));
	oAds.messageQueue = [];
}

/*
* eventHandler
* Queues messages if the slot has not been identified.
* Sends message when the slot has been identified
*/
function eventHandler(event) {
	if (oAds.name) {
		sendMessage(event.type, event.detail);
	} else {
		oAds.messageQueue.push({ type: event.type, detail: event.detail});
	}
}

/*
* swipeHandler
* Catches swipe events and posts them to the parent window
*/
function swipeHandler(touchType, disableDefaultSwipeHandler, event) {
	const target = event.targetTouches.item(0);
	const message = {
		name: oAds.name,
		type: event.type,
		defaultPrevented: false
	};

	/* istanbul ignore else */
	if (touchType === 'move' && disableDefaultSwipeHandler === true) {
		event.preventDefault();
		message.defaultSwipePrevented = true;
	}

	/* istanbul ignore else */
	if (target) {
		message.x = target.pageX;
		message.y = target.pageY;
	}

	messenger.post(message, parent);
}

/*
* initSwipeMessaging
* initialise swipe event messagoing on touch screen devices.
*/
function initSwipeMessaging(disableDefaultSwipeHandler) {
	/* istanbul ignore else */
	if ('ontouchstart' in window) {
		document.body.addEventListener('touchstart', swipeHandler.bind(null, 'start', disableDefaultSwipeHandler));
		document.body.addEventListener('touchmove', swipeHandler.bind(null, 'move', disableDefaultSwipeHandler));
		document.body.addEventListener('touchend', swipeHandler.bind(null, 'end', disableDefaultSwipeHandler));
	}
}

function initListeners() {
	window.addEventListener('message', youAreHandler);
	window.addEventListener('oAds.collapse', eventHandler);
	window.addEventListener('oAds.responsive', eventHandler);
	window.addEventListener('oAds.resize', eventHandler);
	window.addEventListener('load', whoAmI);
}

module.exports = oAds;
