import isEqual from 'lodash/lang/isEqual'

/**
* Event types that o-ads-embed will forward onto the parent.
* name is the
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
	messageQueue: [],
	init: () => {
		sendMessage('oAds.whoami');
	}
};

function isValidSize(size) {
	return oAds.sizes.filter((item) => {
		return isEqual(item, size);
	}).length;
}

function sendMessage(type, detail) {
	detail = detail || {};
	detail.type = type;
	detail.name = oAds.name;
	window.top.postMessage(detail, '*');
};

/**
* Handles messages sent from the o-ads to identify which slot this creative loaded into.
*/

function youAreHandler(event) {
	if (event.data.type === 'youare') {
		oAds.name = event.data.name;
		if (oAds.name) {
			oAds.sizes = event.data.sizes;
			let message;
			while (message = oAds.messageQueue.pop()) {
				sendMessage(message.type, message.event);
			}
		} else {
			throw new Error('Could not identify this slot');
		}
	}
}

function eventHandler(event) {
	if (oAds.name) {
		sendMessage(event.type, event.detail);
	} else {
		oAds.messageQueue.push({ type: event.type, detail: event.detail});
	}
}

window.addEventListener('message', youAreHandler);
window.addEventListener('oAds.collapse', eventHandler);
window.addEventListener('oAds.resize', eventHandler);

export default oAds;
