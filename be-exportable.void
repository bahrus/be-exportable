import {Actions, Proxy, PP, VirtualProps, ExportableScript} from './types';
import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {register} from 'be-hive/register.js';

export class BeExportableController extends EventTarget implements Actions {
    static cache : {[key: string]: string} = {};

    async hydrate(pp: PP){
        const {self, proxy} = pp;
        delete self.dataset.loaded;
        const expScr = self as ExportableScript;
        if(self.id.startsWith('shared-')){
            if(sharedTags.has(self.id)){
                const sharedElement = sharedTags.get(self.id)! as ExportableScript;
                expScr._modExport = sharedElement._modExport;
                if(sharedElement.dataset.loaded === 'true'){
                    self.dispatchEvent(new Event('load'));
                    self.dataset.loaded = 'true';
                    proxy.resolved = true;
                    return;
                }
                sharedElement.addEventListener('load', e=> {
                    self.dispatchEvent(new Event('load'));
                    self.dataset.loaded = 'true';
                    proxy.resolved = true;
                    return;
                });
                return;
            }else{
                sharedTags.set(self.id, self);
            }
        }
        expScr._modExport = {};
        let innerText: string | undefined;
        if(self.src){
            const module = await import(self.src);//.then(module => {
            expScr._modExport = module;
            self.dispatchEvent(new Event('load'));
            self.dataset.loaded = 'true';
            proxy.resolved = true;
            return;
        }else{
            const {doInline} = await import('./doInline.js');
            doInline(self);
        }
    }
}

const sharedTags = new Map<string, HTMLScriptElement>();


const tagName = 'be-exportable';
const ifWantsToBe = 'exportable';
const upgrade = 'script';

define<VirtualProps & BeDecoratedProps<VirtualProps, Actions>, Actions>({
    config: {
        tagName,
        propDefaults: {
            ifWantsToBe,
            upgrade,
            forceVisible: ['script'],
            virtualProps:['beOosoom', 'enabled'],
            proxyPropDefaults:{
                beOosoom: 'enabled',
                enabled: true,
            },
        },
        actions:{
            hydrate: 'enabled',
        }


    },
    complexPropDefaults:{
        controller: BeExportableController
    }
});

register(ifWantsToBe, upgrade, tagName);