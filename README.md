# be-exportable

[![Playwright Tests](https://github.com/bahrus/be-exportable/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-exportable/actions/workflows/CI.yml)
[![NPM version](https://badge.fury.io/js/be-exportable.png)](http://badge.fury.io/js/be-exportable)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-exportable?style=for-the-badge)](https://bundlephobia.com/result?p=be-exportable)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-exportable?compression=gzip">

## Inline scripts

Make exports from inside a script tag accessible from the DOM.

```html
<script nomodule be-exportable>
    export const foo = 'bar';
</script>
```

The script tag ends up with a custom field:  oScript.beEnhanced.beExportable.exports that exposes each of the export const's.  It also emits event "load" when it has finished exporting.

To wait for the script to load:

```JavaScript
const enhancement = await oScript.beEnhanced.whenResolved('be-exportable');
const {foo} = enhancement.exports;
```

Inline scripts can reference the script tag with the keyword "selfish".

Inline scripts are quite limited in the syntax.  Only "export const blah" is exported.

## External scripts

External scripts are far more flexible, but cannot reference the script tag with the keyword "selfish".

```html
<script nomodule src="blah/blah.js" be-exportable>
</script>
```

## Repeating script tag

If the adorned script tag is inside a template / shadowDOM realm that is repeated throughout the page, the script tag can share  the same export constants by setting the id to something starting with "shared-". To be extra safe, use a guid after the shared- prefix.



## Viewing Locally

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/ in a modern browser.

## Importing in ES Modules:

```JavaScript
import 'be-exportable/be-exportable.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-exportable';
</script>
```

