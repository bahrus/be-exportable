# be-exportable

<a href="https://nodei.co/npm/xtal-editor/"><img src="https://nodei.co/npm/xtal-editor.png"></a>

## Inline scripts

Make exports from inside a script tag accessible from the DOM.

```html
<script nomodule be-exportable>
    export const foo = 'bar';
    
</script>
```

The script tag ends up with a custom field:  _modExport that exposes each of the export const's.  It also emits event "load" when it has finished exporting.

A convenience function, beBeckoned, contained in be-exportable/beBeckoned.js is provided to manage this.  Pass in the container to search within, and an optional id, and it will return the exports in a callback.

Inline scripts can reference the script tag with the keyword "selfish".

Inline scripts are quite limited in the syntax.  Only "export const blah" is exported.

## External scripts

External scripts are far more flexible, but cannot reference the script tag with the keyword "selfish".

```html
<script nomodule src="blah/blah.js" be-exportable>
</script>
```

The code first tries evaluating import('blah/blah.js').  If that fails, it prepends https://esm.run/ to the path, and tries that.

