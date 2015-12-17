# o-ads-embed

This module facilitates communication between advertising creatives in iframes and the main o-ads library via post message and so is dependant on o-ads existing in the top window to listen for the message.

This module is designed to be included in advertising creatives and not installed as a dependency.

## Touch Events
On touch screen devices touch events are captured by iframes and not passed on to the parent page, this can be an issue under some circumstances such as an ad included in a gallery where swiping is required to move forwards.

To mitigate these circumstances o-ads-embed will detect when a touch screen is present and post the `touchstart`, `touchend` and `touchmove` events to o-ads via post message, you can listen for oAds.touch events in the top window if you need to react to these events.

## Usage

### `o-ads-embed#init()`
Sends an message to the main page asking for information on the slot, the slot name and supported sizes are returned.
```
oAds.init();
```

### `o-ads-embed#collapse()`
Returns a custom event that will trigger a slot collapse on the main page
```
window.dispatchEvent(oAds.collapse());
```

### `o-ads-embed#resize(width, height)`
Returns a custom event that will trigger a slot resize on the main page, slots can only be resized to preconfigured sizes, requesting a size that is not configured will result in an error.
```
window.dispatchEvent(oAds.resize(width, height));
```

### `o-ads-embed#responsive(width, height)`
Returns a custom event that will mark a creative as respsonsive on the main page, this will prevent a slot making requested when a viewport resize happens.
```
window.dispatchEvent(oAds.resize(width, height));

# Developers
`npm run eslint:config` will create an .eslintrc with relevant settings.
Coverage reporting is available by running `npm run coverage`, it's currently at 100%.

# Licence
This software is published by the Financial Times under the [MIT licence](http://opensource.org/licenses/MIT).
