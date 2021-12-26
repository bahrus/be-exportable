# be-exportable

<a href="https://nodei.co/npm/xtal-editor/"><img src="https://nodei.co/npm/xtal-editor.png"></a>

Make exports from inside a script tag accessible from the DOM.

```html
<script nomodule be-exportable>
    export const foo = 'bar';
    
</script>
```

Exports get assigned to proxy associated with be-exportable - can emit events since based on be-decorated.  Accessed via be-observant.