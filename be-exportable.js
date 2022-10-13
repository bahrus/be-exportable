import { define } from 'be-decorated/DE.js';
import { register } from 'be-hive/register.js';
export class BeExportableController extends EventTarget {
    static cache = {};
    async intro(proxy, target, beDecorProps) {
        target._modExport = {};
        let innerText;
        if (target.src) {
            const module = await import(target.src); //.then(module => {
            target._modExport = module;
            target.dispatchEvent(new Event('load'));
            target.dataset.loaded = 'true';
            proxy.resolved = true;
            return;
        }
        else {
            const { doInline } = await import('./doInline.js');
            doInline(target);
        }
    }
}
const tagName = 'be-exportable';
const ifWantsToBe = 'exportable';
const upgrade = 'script';
define({
    config: {
        tagName,
        propDefaults: {
            ifWantsToBe,
            upgrade,
            forceVisible: ['script'],
            virtualProps: [],
            noParse: true,
            intro: 'intro'
        }
    },
    complexPropDefaults: {
        controller: BeExportableController
    }
});
register(ifWantsToBe, upgrade, tagName);
