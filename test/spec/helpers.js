export default function dispatchTouchEvent(type, x, y) {
	let event;

	// we don't use touchEvent even if it's available because
	// it prevents you from mocking targetTouches in the way we do here
	try {
		event = document.createEvent('UIEvent');
		event.initUIEvent('touch' + type, true, true);
	} catch (err) {
		event = document.createEvent('Event');
		event.initEvent('touch' + type, true, true);
	}

	event.targetTouches = [];
	event.targetTouches.item = function(index) {
		return this[index];
	};

	if (x && y) {
		event.targetTouches.push({ pageX: x, pageY: y});
	}

	document.body.dispatchEvent(event);
}
