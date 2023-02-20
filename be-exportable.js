import { define } from 'be-decorated/DE.js';
import { register } from 'be-hive/register.js';
class BeExportableController extends EventTarget {
    static cache = {};
    async hydrate(pp) {
        const { self, proxy } = pp;
        delete self.dataset.loaded;
        const expScr = self;
        if (self.id.startsWith('shared-')) {
            if (sharedTags.has(self.id)) {
                const sharedElement = sharedTags.get(self.id);
                expScr._modExport = sharedElement._modExport;
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
        expScr._modExport = {};
        let innerText;
        if (self.src) {
            const module = await import(self.src); //.then(module => {
            expScr._modExport = module;
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
export { BeExportableController };
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
