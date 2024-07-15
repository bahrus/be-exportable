import { config as beCnfg } from 'be-enhanced/config.js';
import { BE } from 'be-enhanced/BE.js';
//TODO:  store in truly global place based on guid (symbol.for)
const sharedTags = new Map();
class BeExportable extends BE {
    static config = {
        propInfo: {
            ...(beCnfg.propInfo),
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
        positractions: [...(beCnfg.positractions)]
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
            //TODO move this to external file
            const { BlowDry } = await import('blow-dry/blow-dry.js');
            //double check again due to yielding the thread
            if (enhancedElement.hasAttribute('blow-dry') || enhancedElement.dataset.blowDry) {
                const bd = new BlowDry();
                bd.blowDryScriptElement(enhancedElement);
            }
        }
        const scriptRef = enhancedElement.dataset.blowDryScriptRef;
        if (scriptRef) {
            const ref = document.head[scriptRef];
            if (ref instanceof HTMLScriptElement) {
                //already taken care of, but need to wait for it to be loaded
                const exports = ref.beEnhanced[this.#emc.enhPropKey].exports;
                if (exports) {
                    self.exports = exports;
                    return {
                        resolved: true,
                    };
                }
                else {
                    const enhancement = await ref.beEnhanced.whenResolved(this.#emc);
                    self.exports = enhancement.exports;
                    return {
                        resolved: true,
                    };
                }
            }
            else {
                const sharedScriptElement = document.createElement('script');
                sharedScriptElement.noModule = true;
                document.head[scriptRef] = sharedScriptElement;
                if (Array.isArray(ref)) {
                    //array is of a url
                    sharedScriptElement.src = ref[0];
                }
                else {
                    sharedScriptElement.innerHTML = ref;
                }
                document.head.appendChild(sharedScriptElement);
                const enhancement = await sharedScriptElement.beEnhanced.whenResolved(this.#emc);
                self.exports = enhancement.exports;
                return {
                    resolved: true,
                };
            }
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
