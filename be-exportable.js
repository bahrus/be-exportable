import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
//TODO:  store in trully global place based on guid (symbol.for)
const sharedTags = new Map();
export class BeExportable extends BE {
    async hydrate(self) {
        delete self.dataset.loaded;
        const { enhancedElement, preferAttrForBareImports } = self;
        let { id } = enhancedElement;
        if (!id) {
            id = 'shared-' + crypto.randomUUID();
            enhancedElement.id = id;
        }
        if (id.startsWith('shared-')) {
            if (sharedTags.has(id)) {
                const sharedElement = sharedTags.get(id);
                await sharedElement.whenResolved();
                self.exports = sharedElement.exports;
                self.dispatchEvent(new Event('load'));
                self.dataset.loaded = 'true';
                self.resolved = true;
                sharedElement.innerHTML = '';
                return;
            }
            else {
                sharedTags.set(id, self);
            }
        }
        self.exports = {};
        let innerText;
        let src;
        if (preferAttrForBareImports) {
            const attr = enhancedElement.getAttribute('src');
            if (attr !== null && !attr.startsWith('.') && !attr.startsWith('/')) {
                src = attr;
            }
            else {
                src = enhancedElement.src;
            }
        }
        else {
            src = enhancedElement.src;
        }
        if (src) {
            const module = await import(src); //.then(module => {
            self.exports = module;
            self.dispatchEvent(new Event('load'));
            self.dataset.loaded = 'true';
            self.resolved = true;
            return;
        }
        else {
            const { doInline } = await import('./doInline.js');
            doInline(enhancedElement);
        }
    }
}
const tagName = 'be-exportable';
const ifWantsToBe = 'exportable';
const upgrade = 'script';
const xe = new XE({
    config: {
        tagName,
        isEnh: true,
        propDefaults: {
            ...propDefaults,
            enabled: true,
            beOosoom: 'enabled',
            preferAttrForBareImports: true,
        },
        propInfo: {
            ...propInfo
        },
        actions: {
            hydrate: 'enabled'
        }
    },
    superclass: BeExportable
});
register(ifWantsToBe, upgrade, tagName);
