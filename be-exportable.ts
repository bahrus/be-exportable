import {Actions, Proxy, PP, VirtualProps} from './types';
import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {register} from 'be-hive/register.js';

export class BeExportableController extends EventTarget implements Actions {
    static cache : {[key: string]: string} = {};
    async intro(proxy: Proxy, target: HTMLScriptElement, beDecorProps: BeDecoratedProps){

        (<any>target)._modExport = {};
        let innerText: string | undefined;
        if(target.src){
            const module = await import(target.src);//.then(module => {
            (<any>target)._modExport = module;
            target.dispatchEvent(new Event('load'));
            target.dataset.loaded = 'true';
            proxy.resolved = true;
            return;
        }else{
            const {doInline} = await import('./doInline.js');
            doInline(target);
        }
    }
}


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
            virtualProps:[],
            noParse: true,
            intro: 'intro'
        }

    },
    complexPropDefaults:{
        controller: BeExportableController
    }
});

register(ifWantsToBe, upgrade, tagName);