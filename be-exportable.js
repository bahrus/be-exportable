import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
export class BeExportable extends BE {
    async hydrate(self) {
        const { enhancedElement } = self;
        if (enhancedElement instanceof HTMLScriptElement) {
            const { doScript } = await import('./doScript.js');
            await doScript(self, enhancedElement);
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
