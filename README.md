# o-ads-embed

This module facilitates communication between advertising creatives in iframes and the main o-ads library via post message and so is dependant on o-ads existing in the top window to listen for the message.

This module is designed to be included in advertising creatives and not installed as a dependency.

## Usage

### `o-ads-embed#init()`
Sends an message to the main page asking for information on the slot, the slot name and supported sizes are returned.
```
oAds.init();
```

### `o-ads-embed#colliapse()`
Returns a custom event that will trigger a slot collapse on the main page
```
window.dispatchEvent(oAds.collapse());
```

### `o-ads-embed#resize(width, height)`
Returns a custom event that will trigger a slot resize on the main page, slots can only be resized to preconfigured sizes, reuesting a size that is not configured will result in an error.
```
window.dispatchEvent(oAds.resize(width, height));
```

# Licence
This software is published by the Financial Times under the [MIT licence](http://opensource.org/licenses/MIT).
