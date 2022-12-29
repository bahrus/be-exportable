import { define } from 'be-decorated/DE.js';
import { register } from 'be-hive/register.js';
export class BeExportableController extends EventTarget {
    static cache = {};
    async hydrate(pp) {
        const { self, proxy } = pp;
        delete self.dataset.loaded;
        if (self.id.startsWith('shared-')) {
            if (sharedTags.has(self.id)) {
                const sharedElement = sharedTags.get(self.id);
                self._modExport = sharedElement._modExport;
                if (sharedElement.dataset.loaded === 'true') {
                    self.dispatchEvent(new Event('load'));
                    self.dataset.loaded = 'true';
                    proxy.resolved = true;
                    return;
                }
                sharedElement.addEventListener('load', e => {
                    self.dispatchEvent(new Event('load'));
                    self.dataset.loaded = 'true';
                    proxy.resolved = true;
                    return;
                });
                return;
            }
            else {
                sharedTags.set(self.id, self);
            }
        }
        self._modExport = {};
        let innerText;
        if (self.src) {
            const module = await import(self.src); //.then(module => {
            self._modExport = module;
            self.dispatchEvent(new Event('load'));
            self.dataset.loaded = 'true';
            proxy.resolved = true;
            return;
        }
        else {
            const { doInline } = await import('./doInline.js');
            doInline(self);
        }
    }
}
const sharedTags = new Map();
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
            virtualProps: ['beOosoom', 'enabled'],
            proxyPropDefaults: {
                beOosoom: 'enabled',
                enabled: true,
            },
        },
        actions: {
            hydrate: 'enabled',
        }
    },
    complexPropDefaults: {
        controller: BeExportableController
    }
});
register(ifWantsToBe, upgrade, tagName);
