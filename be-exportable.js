import { resolved, rejected, propInfo } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
//TODO:  store in truly global place based on guid (symbol.for)
const sharedTags = new Map();
class BeExportable extends BE {
    static config = {
        propInfo: {
            ...propInfo,
            attached: {
                def: true,
                ro: true,
            }
        },
        actions: {
            hydrate: {
                ifAllOf: ['attached']
            }
        },
        positractions: [
            resolved, rejected
        ]
    };
    #emc;
    async attach(el, enhancementInfo) {
        const { mountCnfg } = enhancementInfo;
        this.#emc = mountCnfg;
        await super.attach(el, enhancementInfo);
    }
    async hydrate(self) {
        const { enhancedElement, preferAttrForBareImports } = self;
        if (enhancedElement.hasAttribute('blow-dry') || enhancedElement.dataset.blowDry) {
            const { blowDry } = await import('./blowDry.js');
            return await blowDry(self, this.#emc);
        }
        delete enhancedElement.dataset.loaded;
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
                enhancedElement.dataset.loaded = 'true';
                sharedElement.innerHTML = '';
                return {
                    resolved: true
                };
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
            enhancedElement.dataset.loaded = 'true';
            return {
                resolved: true
            };
        }
        else {
            const { doInline } = await import('./doInline.js');
            await doInline(enhancedElement);
            //the script itself does the resolving
            //self.resolved = true;
        }
        return {
        //resolved: true
        };
    }
}
await BeExportable.bootUp();
export { BeExportable };
