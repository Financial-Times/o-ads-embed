# o-ads-embed

This module facilitates communication between advertising creatives in iframes and the main o-ads library via post message and so is dependant on o-ads existing in the top window to listen for the message.

This module is designed to be included in advertising creatives and not installed as a dependency.

## Touch Events
On touch screen devices touch events are captured by iframes and not passed on to the parent page, this can be an issue under some circumstances such as an ad included in a gallery where swiping is required to move forwards.

To mitigate these circumstances o-ads-embed will detect when a touch screen is present and post the `touchstart`, `touchend` and `touchmove` events to o-ads via post message, you can listen for oAds.touch events in the top window if you need to react to these events.

## Usage

### Initialising

In a creative wrapper, include the following:

```
<script src="https://www.ft.com/__origami/service/build/v2/bundles/js?modules=o-ads-embed@^3.0.0"></script>
if (window !== window.top) {
	window.Origami['o-ads-embed'].init();
}
```

### Collapsing

In a creative in DFP, include the following:

```
<div data-o-ads-collapse></div>
<script src="https://www.ft.com/__origami/service/build/v2/bundles/js?modules=o-ads-embed@^3.0.0"></script>
if (window !== window.top) {
	window.Origami['o-ads-embed'].init();
}
```

This will collapse any ad slot that serves the creative with this code inside it.


# Developers

## Demos

There are two demos that demonstrate the two uses mentioned above. In order to get things running, you'll need to add the following lines at the bottom of `main.js` and run `obt build`.

```
window.Origami = {
	'o-ads-embed': oAdsEmbed
}
```

The reason for this is that in a creative wrapper, we would load o-ads-embed through the Origami registry, which places a global `Origmai` object on the page with all of the modules requested. When we run the demos, we simply include a built version of the module from `/build/main.js`.

## Testing

Run `obt test` or `obt test --debug`.

# Upgrading from v2

v3 is a BIG simplification over v2, after analysing which functionality is still being used by the FT. This is what changed:
- Removed event listeners for `oAds.resive`, `oAds.responsive`, `oAds.collapse`
- Removed the message queue
- Removed `youare` message from oAds. There is now a one way line of communication from `o-ads-embed` -> `o-ads`
- Removed `defaultSwipePrevented` option.
- Renamed `oAds` to `oAdsEmbed` to differentiate between `oAds` library on the parent page.
- Renamed `oAds.whoami` postMessage to `oAds.collapse` and is only sent if an element with the `data-o-ads-collapse` attrbute is present in the iframe.
- Touch event listeners are added on `init()`.

To upgrade from v2, you will need to update all the creative wrappers in DFP with the code snippets above. 

The main `o-ads` library is backwards compatible (at the time of writing) with `o-ads-embed` v2, for collapsing and touch event functionality. 

# Licence
This software is published by the Financial Times under the [MIT licence](http://opensource.org/licenses/MIT).
